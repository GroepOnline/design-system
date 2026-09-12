/** Bounded local artifact QA. Uses real time and native CDP keyboard events. */
import assert from "node:assert/strict";
import { execFileSync, spawn } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import { fileURLToPath } from "node:url";

const [browser, origin, out] = process.argv.slice(2);
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const sourcePaths = [
  "scripts/verify-identity-browser.mjs",
  "scripts/verify-identity-template.py",
  "templates/identity-spatial/README.md",
  "templates/identity-spatial/index.html",
  "templates/identity-spatial/states.html",
  "templates/identity-spatial/account.html",
  "templates/identity-spatial/component-contracts.json",
  "templates/identity-spatial/components.mjs",
  "templates/identity-spatial/interactions.mjs",
  "templates/identity-spatial/specimen.mjs",
  "templates/identity-spatial/states.mjs",
  "templates/identity-spatial/account.mjs",
  "templates/identity-spatial/tokens.css",
  "templates/identity-spatial/product.css",
  "templates/identity-spatial/specimen.css",
  "templates/identity-spatial/identity-mark.svg",
  "templates/identity-spatial/fonts/bricolage-grotesque-latin-wght-normal.woff2",
  "templates/identity-spatial/fonts/instrument-sans-latin-wght-normal.woff2",
  "templates/identity-spatial/fonts/BRICOLAGE-GROTESQUE-LICENSE",
  "templates/identity-spatial/fonts/INSTRUMENT-SANS-LICENSE",
];

function output(command, args) {
  return execFileSync(command, args, { cwd: root, encoding: "utf8" }).trim();
}

function provenance() {
  const sourceFiles = Object.fromEntries(
    sourcePaths.map((path) => [
      path,
      createHash("sha256").update(readFileSync(join(root, path))).digest("hex"),
    ]),
  );
  return {
    repository: output("git", ["config", "--get", "remote.origin.url"]),
    head: output("git", ["rev-parse", "HEAD"]),
    dirty: output("git", ["status", "--porcelain"]) !== "",
    runtimes: {
      node: process.version,
      browser: output(browser, ["--version"]),
    },
    verifier: relative(root, fileURLToPath(import.meta.url)),
    sourceFiles,
  };
}
const child = spawn(
  browser,
  ["--no-sandbox", "--disable-gpu", "--remote-debugging-port=0"],
  { stdio: ["ignore", "ignore", "pipe"] },
);
const timeout = setTimeout(() => {
  child.kill("SIGKILL");
  process.exit(1);
}, 55000);
let socket;
try {
  const endpoint = await new Promise((resolve, reject) => {
    let stderr = "";
    child.stderr.on("data", (chunk) => {
      stderr += chunk;
      const match = stderr.match(/DevTools listening on (ws:\/\/[^\s]+)/);
      if (match) resolve(match[1]);
    });
    child.once("error", reject);
    child.once("exit", (code) => reject(new Error(`Renderer exited: ${code}`)));
  });
  socket = new WebSocket(endpoint);
  await new Promise((resolve, reject) => {
    socket.onopen = resolve;
    socket.onerror = reject;
  });
  let id = 0;
  const pending = new Map();
  const errors = [];
  socket.onmessage = (event) => {
    const message = JSON.parse(event.data);
    if (message.method === "Runtime.exceptionThrown")
      errors.push(message.params);
    if (pending.has(message.id)) {
      const { resolve, reject } = pending.get(message.id);
      pending.delete(message.id);
      if (message.error) reject(new Error(JSON.stringify(message.error)));
      else resolve(message.result);
    }
  };
  function send(method, params = {}, sessionId) {
    return new Promise((resolve, reject) => {
      const requestId = ++id;
      pending.set(requestId, { resolve, reject });
      socket.send(JSON.stringify({ id: requestId, method, params, sessionId }));
    });
  }
  const cases = [];
  for (const page of ["index", "states", "account"]) {
    for (const [viewport, width, height, reduced] of [
      ["desktop", 1440, 1000, false],
      ["phone", 390, 844, false],
      ["reduced", 390, 844, true],
    ]) {
      const { targetId } = await send("Target.createTarget", {
        url: "about:blank",
      });
      const { sessionId } = await send("Target.attachToTarget", {
        targetId,
        flatten: true,
      });
      const command = (method, params) => send(method, params, sessionId);
      const evaluate = async (expression) => {
        const result = await command("Runtime.evaluate", {
          expression,
          returnByValue: true,
          awaitPromise: true,
        });
        if (result.exceptionDetails)
          throw new Error(JSON.stringify(result.exceptionDetails));
        return result.result.value;
      };
      const key = async (key, code, windowsVirtualKeyCode) => {
        await command("Input.dispatchKeyEvent", {
          type: "keyDown",
          key,
          code,
          windowsVirtualKeyCode,
          text: key === "Enter" ? "\r" : undefined,
        });
        await command("Input.dispatchKeyEvent", {
          type: "keyUp",
          key,
          code,
          windowsVirtualKeyCode,
        });
      };
      await command("Runtime.enable");
      await command("Emulation.setDeviceMetricsOverride", {
        width,
        height,
        deviceScaleFactor: 1,
        mobile: false,
      });
      await command("Emulation.setEmulatedMedia", {
        features: [
          {
            name: "prefers-reduced-motion",
            value: reduced ? "reduce" : "no-preference",
          },
        ],
      });
      await command("Page.navigate", {
        url: `${origin}/templates/identity-spatial/${page}.html`,
      });
      // Real wall-clock time includes font loading and the <=1.2s arrival.
      await delay(1600);
      await evaluate("document.fonts.ready");
      const facts = await evaluate(`({
        width: innerWidth, scrollWidth: document.documentElement.scrollWidth,
        headingCount: document.querySelectorAll('h1').length,
        images: [...document.images].every(i => i.complete && i.naturalWidth > 0),
        fonts: document.fonts.status,
        portableFontFaces: [...document.styleSheets]
          .filter(sheet => !sheet.href?.endsWith('/specimen.css'))
          .flatMap(sheet => [...sheet.cssRules])
          .filter(rule => rule.type === CSSRule.FONT_FACE_RULE).length,
        animations: document.getAnimations().map(a => ({state: a.playState, iterations: a.effect.getTiming().iterations, endTime: a.effect.getComputedTiming().endTime})),
        primary: (() => {const a=document.querySelector('.hero-actions .button');if(!a)return null;const r=a.getBoundingClientRect();return {left:r.left,right:r.right,bottom:r.bottom};})()
      })`);
      assert.equal(facts.headingCount, 1);
      assert.ok(
        facts.scrollWidth <= width && facts.images && facts.fonts === "loaded" && facts.portableFontFaces === 2,
        JSON.stringify(facts),
      );
      assert.ok(
        facts.animations.every(
          (a) =>
            a.state === "finished" && a.iterations === 1 && a.endTime <= 1200,
        ),
        JSON.stringify(facts.animations),
      );
      if (reduced) assert.equal(facts.animations.length, 0);
      if (facts.primary)
        assert.ok(
          facts.primary.left >= 0 &&
            facts.primary.right <= width &&
            facts.primary.bottom <= height,
          "primary action must fit first viewport",
        );
      await key("Tab", "Tab", 9);
      assert.ok(
        await evaluate(
          "document.activeElement.matches('.skip-link') && document.activeElement.getBoundingClientRect().top >= 0",
        ),
        "visible keyboard skip link",
      );
      await key("Enter", "Enter", 13);
      assert.ok(
        await evaluate("document.activeElement.matches('main')"),
        "skip moves keyboard focus to main",
      );
      if (page === "states") {
        assert.ok(
          await evaluate(
            "document.querySelector('#retry').getBoundingClientRect().bottom <= innerHeight",
          ),
          "recovery action must fit first viewport",
        );
        await evaluate("document.querySelector('#retry').focus()");
        await key("Enter", "Enter", 13);
        assert.ok(
          await evaluate(
            "!!document.querySelector('#state-example [role=status]') && document.activeElement.matches('[value=loading]')",
          ),
          JSON.stringify({
            reason: "keyboard retry and focus recovery",
            errors,
            dom: await evaluate(
              "({active:document.activeElement.outerHTML, example:document.querySelector('#state-example').innerHTML})",
            ),
          }),
        );
        await key("ArrowRight", "ArrowRight", 39);
        assert.ok(
          await evaluate(
            "document.querySelector('[value=empty]').checked && !!document.querySelector('#state-example .empty-state a')",
          ),
          "native radio keyboard choice",
        );
        await key("ArrowRight", "ArrowRight", 39);
        assert.ok(
          await evaluate(
            "!!document.querySelector('#state-example [role=alert]') && !!document.querySelector('#retry')",
          ),
          "error recovery persists",
        );
        await key("ArrowRight", "ArrowRight", 39);
        assert.ok(
          await evaluate(
            "document.querySelector('[value=notice]').checked && !!document.querySelector('#state-example [role=status]')",
          ),
          "notice state",
        );
        await key("ArrowLeft", "ArrowLeft", 37);
      }
      let dialogEvidence = null;
      let recordEvidence = null;
      if (page === "account") {
        await evaluate("document.querySelector('#validate-example').focus()");
        await key("Enter", "Enter", 13);
        assert.ok(
          await evaluate(
            "document.activeElement.id === 'example-name' && document.activeElement.getAttribute('aria-invalid') === 'true'",
          ),
          "first invalid field focus",
        );
        await evaluate(
          "document.querySelector('#example-name').value = 'Voorbeeld'; document.querySelector('#validate-example').focus()",
        );
        await key("Enter", "Enter", 13);
        assert.ok(
          await evaluate(
            "document.querySelector('#example-name').getAttribute('aria-describedby') === 'example-name-hint' && document.querySelector('#example-name-error').hidden",
          ),
          "corrected field clears accessible error",
        );
        assert.deepEqual(
          await evaluate(
            "[...new FormData(document.querySelector('#example-form')).getAll('scope')]",
          ),
          ["example:read"],
        );
        assert.ok(
          await evaluate(
            "document.querySelector('#permissions-0').click(); document.querySelector('#accounts-1').click(); document.querySelector('#permissions-0').checked && !document.querySelector('#accounts-1').checked",
          ),
          "required permission and ineligible account cannot change",
        );
        await evaluate("document.querySelector('#permissions-1').click()");
        assert.deepEqual(
          await evaluate(
            "[...new FormData(document.querySelector('#example-form')).getAll('scope')]",
          ),
          ["example:read", "example:write"],
        );
        await evaluate("document.querySelector('#connection-revoke').focus()");
        await key("Enter", "Enter", 13);
        assert.ok(
          await evaluate(
            "document.querySelector('#connection-confirm').open && document.activeElement.dataset.action === 'cancel'",
          ),
          "modal starts on safe action",
        );
        await key("Tab", "Tab", 9);
        assert.ok(
          await evaluate("document.activeElement.dataset.action === 'confirm'"),
          "modal keyboard order",
        );
        await key("Tab", "Tab", 9);
        assert.ok(
          await evaluate("document.activeElement.dataset.action === 'cancel'"),
          "modal focus containment",
        );
        await key("Tab", "Tab", 9);
        await key("Enter", "Enter", 13);
        assert.ok(
          await evaluate(
            "document.querySelector('#connection-confirm [data-action=confirm]').disabled",
          ),
          "confirmation pending",
        );
        await key("Escape", "Escape", 27);
        assert.ok(
          await evaluate("document.querySelector('#connection-confirm').open"),
          "pending Escape cannot dismiss",
        );
        await delay(300);
        assert.ok(
          await evaluate(
            "document.querySelector('#connection-confirm').open && !document.querySelector('#connection-confirm [data-confirm-error]').hidden && document.activeElement.dataset.action === 'cancel'",
          ),
          "failed mutation stays open and restores safe focus",
        );
        const { data: dialogData } = await command("Page.captureScreenshot", {
          format: "png",
        });
        const dialogBytes = Buffer.from(dialogData, "base64");
        const dialogFile = `account-dialog-${viewport}.png`;
        writeFileSync(join(out, dialogFile), dialogBytes);
        dialogEvidence = {
          file: dialogFile,
          sha256: createHash("sha256").update(dialogBytes).digest("hex"),
        };
        await key("Escape", "Escape", 27);
        await delay(30);
        assert.ok(
          await evaluate(
            "!document.querySelector('#connection-confirm').open && document.activeElement.id === 'connection-revoke'",
          ),
          "cancel returns trigger focus",
        );
        await evaluate(`(async () => {
          const { Confirm } = await import('/templates/identity-spatial/components.mjs');
          const { bindConfirm } = await import('/templates/identity-spatial/interactions.mjs');
          const host = document.createElement('div');
          host.innerHTML = Confirm({id:'contract-confirm',title:'Test',message:'Isolated browser contract test',actionLabel:'Confirm'});
          document.body.append(host);
          window.__confirmTest = {calls:0, host};
          window.__confirmTest.binding = bindConfirm(host.firstElementChild, {onConfirm: () => {
            window.__confirmTest.calls++;
            return new Promise(resolve => {window.__confirmTest.resolve = resolve;});
          }});
          window.__confirmTest.binding.open();
        })()`);
        await key("Tab", "Tab", 9);
        await key("Enter", "Enter", 13);
        assert.equal(
          await evaluate(
            "document.querySelector('#contract-confirm [data-action=confirm]').click(); window.__confirmTest.calls",
          ),
          1,
          "duplicate confirmation blocked",
        );
        await evaluate("window.__confirmTest.resolve()");
        await delay(30);
        assert.ok(
          await evaluate(
            "!document.querySelector('#contract-confirm').open && document.activeElement.id === 'connection-revoke'",
          ),
          "confirmed promise closes and returns focus",
        );
        await evaluate(`(async () => {
          const { bindConfirm } = await import('/templates/identity-spatial/interactions.mjs');
          window.__confirmTest.binding.destroy();
          window.__confirmTest.binding = bindConfirm(window.__confirmTest.host.firstElementChild, {onConfirm: () => undefined});
          window.__confirmTest.binding.open();
        })()`);
        await key("Tab", "Tab", 9);
        await key("Enter", "Enter", 13);
        assert.ok(
          await evaluate(
            "document.querySelector('#contract-confirm').open && !document.querySelector('#contract-confirm [data-confirm-error]').hidden",
          ),
          "missing promise cannot confirm success",
        );
        await evaluate(
          "window.__confirmTest.binding.destroy(); window.__confirmTest.host.remove(); delete window.__confirmTest",
        );
        assert.ok(
          await evaluate(
            "[...document.querySelectorAll('.identity-record .button')].every(b => {const r=b.getBoundingClientRect(); return r.left>=0 && r.right<=innerWidth;})",
          ),
          "record actions fit narrow viewport",
        );
      }
      if (page === "account") {
        await evaluate(
          "document.querySelector('#pending-connection').scrollIntoView({block:'start'})",
        );
        const { data: recordData } = await command("Page.captureScreenshot", {
          format: "png",
        });
        const recordBytes = Buffer.from(recordData, "base64");
        const recordFile = `account-records-${viewport}.png`;
        writeFileSync(join(out, recordFile), recordBytes);
        recordEvidence = {
          file: recordFile,
          sha256: createHash("sha256").update(recordBytes).digest("hex"),
        };
      }
      assert.equal(errors.length, 0, JSON.stringify(errors));
      const buttonProof = await evaluate(`(async () => {
        const { Button } = await import('/templates/identity-spatial/components.mjs');
        const host = document.createElement('div');
        host.style.cssText = 'position:absolute;left:0;top:0;visibility:hidden';
        document.body.append(host);
        host.innerHTML = Button({ label: 'Opnieuw proberen' });
        const idle = host.firstElementChild.getBoundingClientRect();
        host.innerHTML = Button({ label: 'Opnieuw proberen', busy: true });
        const button = host.firstElementChild;
        const busy = button.getBoundingClientRect();
        let activated = false;
        button.addEventListener('click', () => { activated = true; });button.click();
        const passed = idle.width === busy.width && idle.height === busy.height && button.disabled && !activated;
        host.remove();return passed;
      })()`);
      assert.ok(
        buttonProof,
        "pending button geometry and duplicate prevention",
      );
      await evaluate("document.activeElement.blur(); scrollTo(0, 0)");
      const { data } = await command("Page.captureScreenshot", {
        format: "png",
      });
      const bytes = Buffer.from(data, "base64");
      const file = `${page}-${viewport}.png`;
      writeFileSync(join(out, file), bytes);
      cases.push({
        page,
        viewport,
        reduced,
        file,
        sha256: createHash("sha256").update(bytes).digest("hex"),
        ...facts,
        keyboard: "passed",
        pendingButton: "passed",
        dialogEvidence,
        recordEvidence,
      });
      await send("Target.closeTarget", { targetId });
    }
  }
  writeFileSync(
    join(out, "manifest.json"),
    JSON.stringify(
      {
        schema: 1,
        scope:
          "local template rendering, keyboard, motion and component behavior; no live identity/API proof",
        ...provenance(),
        cases,
      },
      null,
      2,
    ) + "\n",
  );
  console.log(
    `identity-template: ${cases.length} browser cases passed -> ${out}`,
  );
} finally {
  clearTimeout(timeout);
  socket?.close();
  child.kill();
}
