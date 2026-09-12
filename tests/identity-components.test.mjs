import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import {
  AccountChoice,
  Audit,
  Confirm,
  ConnectionRow,
  Field,
  Navigation,
  PermissionChoice,
  SecurityMethods,
  SessionRow,
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
  accountDocument,
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
  assert.deepEqual(
    [...contract.implemented].sort(),
    Object.keys(contract.components).sort(),
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

test("navigation owns current-page semantics and escapes all labels", () => {
  const html = Navigation({
    items: [
      { href: "/account", label: "<Account>" },
      { href: "/sessions", label: "Sessions" },
    ],
    currentHref: "/account",
  });
  assert.equal((html.match(/aria-current="page"/g) || []).length, 1);
  assert.match(html, /&lt;Account&gt;/);
  assert.throws(
    () =>
      Navigation({
        items: [{ href: "javascript:bad()", label: "Bad" }],
        currentHref: "/",
      }),
    TypeError,
  );
});
test("field connects labels, hints and validation without executable attributes", () => {
  const html = Field({
    id: "name",
    name: "name",
    label: "<Name>",
    autocomplete: "nickname",
    error: "<Fix it>",
    hint: "Help",
    required: true,
  });
  assert.match(html, /for="name"/);
  assert.match(html, /id="name"/);
  assert.match(html, /aria-describedby="name-hint name-error"/);
  assert.match(html, /aria-invalid="true"/);
  assert.match(html, /autocomplete="nickname"/);
  assert.match(html, /&lt;Fix it&gt;/);
  assert.throws(
    () =>
      Field({
        id: "x",
        name: "x",
        label: "x",
        autocomplete: "off",
        type: "hidden",
      }),
    TypeError,
  );
});
test("account choices fail closed for absent membership and never preselect ineligible accounts", () => {
  const html = AccountChoice({
    id: "accounts",
    name: "account",
    legend: "Account",
    selectedValue: "no",
    options: [
      {
        value: "no",
        label: "<Account>",
        description: "Example",
        membership: "unknown",
      },
    ],
  });
  assert.match(html, /type="radio"[^>]* disabled/);
  assert.doesNotMatch(html, / checked/);
  assert.match(html, /&lt;Account&gt;/);
});
test("required permissions cannot be deselected and remain serializable", () => {
  const html = PermissionChoice({
    id: "scopes",
    name: "scope",
    legend: "Rights",
    permissions: [
      { value: "read", label: "Read", description: "Required", required: true },
      { value: "write", label: "Write", description: "Optional" },
    ],
  });
  assert.match(
    html,
    /type="checkbox" name="scope" value="read" checked disabled/,
  );
  assert.match(html, /type="hidden" name="scope" value="read"/);
  assert.match(html, /value="write">/);
});
test("confirm markup uses an initially closed named native dialog and shared controls", () => {
  const html = Confirm({
    id: "revoke",
    title: "<Revoke>",
    message: "<Consequence>",
    actionLabel: "Revoke",
  });
  assert.match(html, /<dialog id="revoke"[^>]*aria-labelledby="revoke-title"/);
  assert.match(html, /aria-describedby="revoke-description"/);
  assert.doesNotMatch(html, /<dialog[^>]* open/);
  assert.match(html, /data-action="cancel"/);
  assert.match(html, /data-action="confirm"/);
  assert.equal((html.match(/ disabled/g) || []).length, 2);
  assert.match(html, /&lt;Consequence&gt;/);
  assert.match(html, /data-confirm-error role="alert" hidden/);
});
test("record states do not turn pending or failed revocation into success", () => {
  const row = ConnectionRow({
    id: "c",
    name: "<Client>",
    description: "Example",
    state: "active",
    pending: true,
    actionId: "revoke",
  });
  assert.match(row, />Actief</);
  assert.match(row, /aria-busy="true" disabled/);
  assert.match(row, /&lt;Client&gt;/);
  for (const state of ["expired", "revoked", "unknown"])
    assert.match(
      ConnectionRow({
        id: "c",
        name: "Client",
        description: "Example",
        state,
        actionId: "revoke",
      }),
      / disabled/,
    );
  assert.throws(
    () =>
      ConnectionRow({
        id: "c",
        name: "Client",
        description: "Example",
        state: "trusted",
      }),
    TypeError,
  );
  const session = SessionRow({
    id: "s",
    name: "Device",
    description: "Example",
    consequence: "This device signs out",
    current: true,
    error: "<Failure>",
  });
  assert.match(session, /Dit apparaat/);
  assert.match(session, /This device signs out/);
  assert.match(session, /role="alert"/);
  assert.match(session, /&lt;Failure&gt;/);
});
test("security methods distinguish supplied methods, loading and unavailable", () => {
  assert.match(SecurityMethods({ state: "loading" }), /role="status"/);
  assert.match(SecurityMethods({ state: "unavailable" }), /niet beschikbaar/);
  assert.match(
    SecurityMethods({
      state: "ready",
      methods: [{ label: "<Passkey>", description: "Upstream" }],
    }),
    /&lt;Passkey&gt;/,
  );
  assert.throws(() => SecurityMethods({ state: "verified" }), TypeError);
});
test("audit preserves supplied instants, escapes facts and localizes explicit timezone", () => {
  const html = Audit({
    events: [
      {
        actor: "<Actor>",
        action: "<Action>",
        timestamp: "2026-09-11T12:00:00Z",
      },
    ],
  });
  assert.match(html, /datetime="2026-09-11T12:00:00Z"/);
  assert.match(html, /14:00/);
  assert.match(html, /Europe\/Amsterdam/);
  assert.match(html, /&lt;Actor&gt;/);
  assert.throws(
    () =>
      Audit({
        events: [{ actor: "a", action: "b", timestamp: "2026-09-11T12:00:00" }],
      }),
    TypeError,
  );
  assert.match(Audit({ events: [] }), /Geen gebeurtenissen/);
});
test("all declared interactions are exported and the account specimen uses shared contracts", async () => {
  const contract = JSON.parse(
    readFileSync(
      new URL(
        "../templates/identity-spatial/component-contracts.json",
        import.meta.url,
      ),
    ),
  );
  const interactions =
    await import("../templates/identity-spatial/interactions.mjs");
  assert.deepEqual(
    Object.keys(interactions).sort(),
    Object.keys(contract.interactions).sort(),
  );
  const html = accountDocument();
  assert.equal((html.match(/<h1>/g) || []).length, 1);
  assert.match(html, /novalidate/);
  assert.match(html, /Voorbeeldgegevens/);
  assert.match(html, /<dialog/);
});
