/** Local component evidence only; no live status or API claims. */
import assert from "node:assert/strict";
import { execFileSync, spawn } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import { fileURLToPath } from "node:url";

const [browser, origin, out] = process.argv.slice(2);
const root = fileURLToPath(new URL("../", import.meta.url));
const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
function files(path) {
  return readdirSync(path, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory()
      ? files(join(path, entry.name))
      : [join(path, entry.name)],
  );
}
const sourceFiles = Object.fromEntries(
  [
    ...files(join(root, "templates/operator-evidence")),
    fileURLToPath(import.meta.url),
    join(root, "scripts/verify-identity-template.py"),
  ].map((path) => [relative(root, path), hash(readFileSync(path))]),
);
const output = (command, args) =>
  execFileSync(command, args, { cwd: root, encoding: "utf8" }).trim();
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
  for (const page of ["index", "states"]) {
    for (const [viewport, width, height, dark, reduced] of [
      ["desktop", 1440, 1000, false, false],
      ["laptop", 1280, 800, false, false],
      ["phone", 390, 844, false, false],
      ["dark", 390, 844, true, false],
      ["reduced", 390, 844, false, true],
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
          { name: "prefers-color-scheme", value: dark ? "dark" : "light" },
          {
            name: "prefers-reduced-motion",
            value: reduced ? "reduce" : "no-preference",
          },
        ],
      });
      await command("Page.navigate", {
        url: `${origin}/templates/operator-evidence/${page}.html`,
      });
      await delay(600);
      await evaluate("document.fonts.ready");
      const facts = await evaluate(`({
        scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth,
        headings: document.querySelectorAll('h1').length,
        images: [...document.images].every(i => i.complete && i.naturalWidth > 0),
        fonts: document.fonts.status,
        fontFaces: [...document.fonts].length,
        geometry: {
          heading: document.querySelector('h1').getBoundingClientRect().toJSON(),
          headingFontSize: parseFloat(getComputedStyle(document.querySelector('h1')).fontSize),
          evidence: document.querySelector('.flow').getBoundingClientRect().toJSON()
        },
        theme: (() => {
          const matches = [...document.querySelectorAll('meta[name="theme-color"]')]
            .filter(meta => meta.media && matchMedia(meta.media).matches);
          const sample = document.createElement('span');
          sample.style.color = matches[0]?.content || 'transparent';
          document.body.append(sample);
          const metaColor = getComputedStyle(sample).color;
          sample.remove();
          return {matches:matches.length, metaColor, canvas:getComputedStyle(document.body).backgroundColor};
        })(),
        animations: document.getAnimations().map(a => ({state:a.playState,iterations:a.effect.getTiming().iterations,endTime:a.effect.getComputedTiming().endTime})),
        regions: [...document.querySelectorAll('.flow,.table-wrap')].every(r => r.tabIndex === 0 && r.getBoundingClientRect().right <= innerWidth),
        states: [...document.querySelectorAll('[data-snapshot]')].map(e => e.dataset.snapshot)
      })`);
      assert.ok(
        facts.scrollWidth <= facts.clientWidth &&
          facts.headings === 1 &&
          facts.images &&
          facts.fonts === "loaded" &&
          facts.fontFaces === 4 &&
          facts.regions,
        JSON.stringify(facts),
      );
      if (width >= 1200) {
        assert.ok(
          facts.geometry.evidence.top <= 350 &&
            facts.geometry.evidence.bottom <= 520 &&
            facts.geometry.heading.bottom <= 260 &&
            facts.geometry.headingFontSize >= 44,
          `operator evidence must fit the upper desktop viewport: ${JSON.stringify(facts.geometry)}`,
        );
      }
      assert.ok(
        facts.theme.matches === 1 &&
          facts.theme.metaColor === facts.theme.canvas,
        `theme-color must match the rendered canvas: ${JSON.stringify(facts.theme)}`,
      );
      assert.ok(
        facts.animations.every(
          (a) =>
            a.state === "finished" && a.iterations === 1 && a.endTime <= 420,
        ),
        JSON.stringify(facts.animations),
      );
      if (reduced) assert.equal(facts.animations.length, 0);
      await key("Tab", "Tab", 9);
      assert.ok(
        await evaluate(
          "document.activeElement.matches('.skip') && document.activeElement.getBoundingClientRect().top >= 0",
        ),
      );
      await key("Enter", "Enter", 13);
      assert.ok(
        await evaluate("document.activeElement.matches('main')"),
        "skip focus",
      );
      await evaluate("document.querySelector('.flow').focus()");
      await key("ArrowRight", "ArrowRight", 39);
      await delay(100);
      if (width < 700)
        assert.ok(
          await evaluate("document.querySelector('.flow').scrollLeft > 0"),
          "keyboard overflow",
        );
      if (page === "states") {
        assert.ok(
          [
            "loading",
            "current",
            "stale",
            "partial",
            "refresh-error",
            "unavailable",
          ].every((state) => facts.states.includes(state)),
        );
        const idle = await evaluate(
          "document.querySelector('#retry').getBoundingClientRect().toJSON()",
        );
        await evaluate("document.querySelector('#retry').focus()");
        await key("Enter", "Enter", 13);
        const busy = await evaluate(
          "({rect:document.querySelector('#retry').getBoundingClientRect().toJSON(), disabled:document.querySelector('#retry').disabled})",
        );
        assert.equal(idle.width, busy.rect.width);
        assert.equal(idle.height, busy.rect.height);
        assert.ok(busy.disabled);
        await delay(300);
        assert.ok(
          await evaluate(
            "document.activeElement.id === 'retry-result' && document.activeElement.textContent.includes('Verversen mislukt') && !document.querySelector('#retry').disabled",
          ),
        );
        await evaluate(`(async () => {
          const { bindRetry } = await import('/templates/operator-evidence/interactions.mjs');
          const host = document.createElement('div');
          host.innerHTML = '<button type="button">Contract test</button><p></p>';
          document.body.append(host);
          window.__retry = {calls:0,host};
          window.__retry.binding = bindRetry(host.firstChild,{result:host.lastChild,onRetry:()=>{window.__retry.calls++;return new Promise(resolve=>window.__retry.resolve=resolve)}});
          host.firstChild.click();host.firstChild.click();
        })()`);
        assert.equal(await evaluate("window.__retry.calls"), 1);
        await evaluate(
          "window.__retry.resolve('Voorbeeldresultaat bevestigd')",
        );
        await delay(20);
        assert.ok(
          await evaluate(
            "document.activeElement === window.__retry.host.lastChild && document.activeElement.textContent === 'Voorbeeldresultaat bevestigd'",
          ),
        );
        await evaluate(
          "window.__retry.binding.destroy();window.__retry.host.firstChild.click()",
        );
        assert.equal(await evaluate("window.__retry.calls"), 1);
        await evaluate("window.__retry.host.remove();delete window.__retry");
      }
      assert.equal(errors.length, 0, JSON.stringify(errors));
      await evaluate(
        "document.activeElement.blur();document.querySelector('.flow').scrollLeft=0;scrollTo(0,0)",
      );
      const { data } = await command("Page.captureScreenshot", {
        format: "png",
      });
      const bytes = Buffer.from(data, "base64");
      const file = `${page}-${viewport}.png`;
      writeFileSync(join(out, file), bytes);
      cases.push({
        page,
        viewport,
        width,
        height,
        dark,
        reduced,
        file,
        sha256: hash(bytes),
        ...facts,
        keyboard: "passed",
        retry: page === "states" ? "passed" : null,
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
          "local operator template rendering and component interactions; no live status/API proof",
        repository: output("git", ["config", "--get", "remote.origin.url"]),
        head: output("git", ["rev-parse", "HEAD"]),
        dirty: output("git", ["status", "--porcelain"]) !== "",
        runtimes: {
          node: process.version,
          browser: output(browser, ["--version"]),
        },
        sourceFiles,
        cases,
      },
      null,
      2,
    ) + "\n",
  );
  console.log(
    `operator-template: ${cases.length} browser cases passed -> ${out}`,
  );
} finally {
  clearTimeout(timeout);
  socket?.close();
  child.kill();
}
