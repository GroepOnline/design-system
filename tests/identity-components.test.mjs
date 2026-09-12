import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import {
  ActionLink,
  Brand,
  Button,
  Empty,
  Failure,
  LandingHero,
  Loading,
  Notice,
  PageTitle,
  Portal,
  SiteShell,
} from "../templates/identity-spatial/components.mjs";
import {
  landingDocument,
  stateMarkup,
  statesDocument,
} from "../templates/identity-spatial/specimen.mjs";

test("all declared implemented components have callable exports", async () => {
  const contract = JSON.parse(
    readFileSync(
      new URL(
        "../templates/identity-spatial/component-contracts.json",
        import.meta.url,
      ),
    ),
  );
  const exports = await import("../templates/identity-spatial/components.mjs");
  for (const name of contract.implemented)
    assert.equal(typeof exports[name], "function", name);
  assert.deepEqual(
    Object.keys(exports).sort(),
    [...contract.implemented].sort(),
  );
});
test("product copy is escaped in headlines, notices, errors and controls", () => {
  const hostile = '<img src=x onerror="alert(1)">&';
  const pieces = [
    Button({ label: hostile, id: hostile }),
    Notice({ message: hostile }),
    Loading({ message: hostile }),
    Empty({ title: hostile, message: hostile }),
    Failure({ title: hostile, message: hostile, actionHtml: "" }),
    PageTitle({ eyebrow: hostile, title: hostile, description: hostile }),
    LandingHero({
      eyebrow: hostile,
      titleLines: [hostile],
      emphasis: hostile,
      description: hostile,
      actionsHtml: "",
    }),
  ];
  for (const piece of pieces) {
    assert.ok(!piece.includes(hostile));
    assert.ok(piece.includes("&lt;img"));
  }
});
test("links reject executable schemes and escape attributes", () => {
  for (const href of [
    "javascript:alert(1)",
    "data:text/html,bad",
    "java\nscript:alert(1)",
  ]) {
    assert.throws(() => ActionLink({ href, label: "Go" }), TypeError);
    assert.throws(() => Brand({ markUrl: href }), TypeError);
  }
  assert.match(
    ActionLink({ href: '/account?name="a"&view=1', label: "Account" }),
    /name=&quot;a&quot;&amp;view=1/,
  );
});
test("brand and portal are decorative, intrinsically sized and status-free", () => {
  assert.match(Brand(), /aria-label="ChefGroep startpagina"/);
  assert.match(Brand(), /width="36" height="36" alt="" aria-hidden="true"/);
  assert.match(Portal({ compact: true }), /portal--compact/);
  assert.equal((Portal().match(/class="portal-plane /g) || []).length, 3);
  assert.doesNotMatch(Portal(), /role=|verified|status/);
});
test("pending button preserves its label and activity slot, cannot submit or activate", () => {
  const idle = Button({ label: "Bewaren" });
  const busy = Button({ label: "Bewaren", busy: true });
  assert.match(busy, /type="button"/);
  assert.match(busy, /aria-busy="true" disabled/);
  assert.match(idle, /data-busy="false"/);
  assert.doesNotMatch(
    Button({ label: "Safe", busy: '" onclick="bad' }),
    /onclick/,
  );
  assert.equal(
    busy
      .replace('aria-busy="true"', 'aria-busy="false"')
      .replace('data-busy="true"', 'data-busy="false"')
      .replace(" disabled", ""),
    idle,
  );
  assert.throws(
    () => Button({ label: "Test", intent: "fake-success" }),
    TypeError,
  );
});
test("states keep pending, absence and failure semantically distinct", () => {
  assert.match(Loading({ message: "Ophalen" }), /role="status"/);
  assert.doesNotMatch(
    Empty({ title: "Leeg", message: "Geen gegevens" }),
    /role="alert"/,
  );
  assert.match(
    Failure({
      title: "Fout",
      message: "Probeer opnieuw",
      actionHtml: Button({ label: "Opnieuw" }),
    }),
    /role="alert"/,
  );
  assert.match(Notice({ message: "Fout", error: true }), /role="alert"/);
  assert.throws(() => stateMarkup("unknown"), TypeError);
});
test("shell skip target is focusable and each specimen has exactly one h1", () => {
  const shell = SiteShell({
    contentHtml: "<h1>Account</h1>",
    plane: "Intern",
    mainId: "content",
  });
  assert.match(shell, /href="#content"/);
  assert.match(shell, /<main id="content" tabindex="-1">/);
  for (const html of [landingDocument(), statesDocument()]) {
    assert.equal((html.match(/<h1>/g) || []).length, 1);
    assert.equal((html.match(/<main /g) || []).length, 1);
  }
  assert.doesNotMatch(statesDocument(), /class="portal"/);
});
test("arrival specimen keeps the decision a native link, independent of script/motion", () => {
  assert.match(landingDocument(), /href="#decision"/);
  assert.doesNotMatch(landingDocument(), /<script/);
  assert.match(statesDocument(), /type="radio" name="example-state"/);
  assert.match(statesDocument(), /id="retry"[^>]* disabled/);
  assert.match(statesDocument(), /<fieldset class="state-selector" disabled>/);
  assert.doesNotMatch(stateMarkup("error"), / disabled/);
});
