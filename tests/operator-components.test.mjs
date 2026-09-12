import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import * as components from "../templates/operator-evidence/components.mjs";
import * as interactions from "../templates/operator-evidence/interactions.mjs";
import {
  landingDocument,
  statesDocument,
} from "../templates/operator-evidence/specimen.mjs";

const contracts = JSON.parse(
  readFileSync(
    new URL(
      "../templates/operator-evidence/component-contracts.json",
      import.meta.url,
    ),
  ),
);

test("both specimen documents declare light and dark browser chrome colors", () => {
  for (const render of [landingDocument, statesDocument]) {
    const html = render();
    assert.match(
      html,
      /<meta name="theme-color" content="#f7f6f5" media="\(prefers-color-scheme: light\)">/,
    );
    assert.match(
      html,
      /<meta name="theme-color" content="#161513" media="\(prefers-color-scheme: dark\)">/,
    );
    assert.equal((html.match(/name="theme-color"/g) || []).length, 2);
  }
});

test("every operator contract has exactly one callable export", () => {
  assert.deepEqual(
    Object.keys(components).sort(),
    Object.keys(contracts.components).sort(),
  );
  assert.deepEqual(
    contracts.implemented.slice().sort(),
    Object.keys(components).sort(),
  );
  assert.deepEqual(
    Object.keys(interactions).sort(),
    Object.keys(contracts.interactions).sort(),
  );
  for (const value of [
    ...Object.values(components),
    ...Object.values(interactions),
  ])
    assert.equal(typeof value, "function");
});

test("conclusions never hide unknown layers behind healthy runtime", () => {
  const html = components.OperationalConclusion({
    layers: [
      { label: "Bron", state: "unknown" },
      { label: "Runtime", state: "healthy" },
    ],
  });
  assert.match(html, /1 laag is nog niet bewezen/);
  assert.doesNotMatch(html, /Alle lagen zijn bewezen/);
  assert.match(
    components.OperationalConclusion({ layers: [] }),
    /Nog geen bewijs beschikbaar/,
  );
  for (const state of [
    "down",
    "degraded",
    "drift",
    "stale",
    "partial",
    "waiting",
    "invented",
  ]) {
    assert.doesNotMatch(
      components.OperationalConclusion({ layers: [{ state }] }),
      /Alle lagen zijn bewezen/,
    );
  }
  assert.match(
    components.OperationalConclusion({ layers: [{ state: "healthy" }] }),
    /Alle lagen zijn bewezen/,
  );
  const mixed = components.OperationalConclusion({
    layers: [{ state: "down" }, { state: "stale" }, { state: "drift" }],
  });
  for (const label of ["Storing", "Verouderd", "Drift"])
    assert.match(mixed, new RegExp(label));
});

test("page conclusion never upgrades stale or incomplete snapshots", () => {
  for (const snapshotState of [
    "loading",
    "stale",
    "partial",
    "refresh-error",
    "unavailable",
  ]) {
    assert.doesNotMatch(
      components.OperatorPage({
        layers: [{ state: "healthy" }],
        snapshotState,
      }),
      /Alle lagen zijn bewezen/,
    );
  }
});

test("refresh failures preserve supplied evidence and disclose failure", () => {
  const html = components.SnapshotFrame({
    state: "refresh-error",
    contentHtml: "<p>Prior evidence</p>",
  });
  assert.match(html, /Prior evidence/);
  assert.match(html, /Verversen mislukt/);
  assert.match(html, /role="alert"/);
  assert.doesNotMatch(
    components.SnapshotFrame({
      state: "unavailable",
      contentHtml: "Hidden stale data",
    }),
    /Hidden stale data/,
  );
  assert.throws(
    () => components.SnapshotFrame({ state: "ready" }),
    /snapshot state/i,
  );
});

test("freshness requires valid zoned timestamp and deterministic caller clock", () => {
  const now = Date.parse("2026-09-12T12:00:00Z");
  const recent = components.FreshnessStamp({
    timestamp: "2026-09-12T11:59:00Z",
    now,
    staleAfterMs: 120000,
  });
  assert.match(recent, /datetime="2026-09-12T11:59:00.000Z"/);
  assert.match(recent, /data-freshness="current"/);
  assert.match(recent, /1 minuut geleden/);
  assert.match(
    components.FreshnessStamp({
      timestamp: "2026-09-12T11:55:00Z",
      now,
      staleAfterMs: 120000,
    }),
    /data-freshness="stale"/,
  );
  for (const timestamp of [
    undefined,
    "nope",
    "2026-09-12T13:00:00Z",
    "2026-09-12T11:59:00",
    "2026-02-30T11:59:00Z",
  ]) {
    const html = components.FreshnessStamp({
      timestamp,
      now,
      staleAfterMs: 120000,
    });
    assert.match(html, /data-freshness="unknown"/);
    assert.doesNotMatch(html, /<time/);
  }
  assert.throws(
    () => components.FreshnessStamp({ timestamp: "2026-09-12T11:59:00Z" }),
    /clock/i,
  );
});

test("status and text inputs cannot become HTML or CSS classes", () => {
  const html = components.StatusPill({ state: 'healthy" onclick="bad()' });
  assert.match(html, /data-state="unknown"/);
  assert.doesNotMatch(html, /onclick/);
  assert.match(
    components.EvidenceVector({
      layers: [{ label: "<script>", detail: "<img>", state: "healthy" }],
    }),
    /&lt;script&gt;/,
  );
  assert.throws(
    () =>
      components.SectionNav({
        items: [{ href: "javascript:bad()", label: "Bad" }],
      }),
    /HTTP/,
  );
});

test("tables retain semantic headers and escaped cell values", () => {
  const html = components.DataTable({
    label: "Evidence",
    columns: [
      { key: "name", label: "Laag" },
      { key: "state", label: "Stand", kind: "status" },
    ],
    rows: [{ name: "<script>", state: "down" }],
  });
  assert.match(html, /tabindex="0" role="region" aria-label="Evidence"/);
  assert.match(html, /<th scope="col">Laag/);
  assert.match(html, /&lt;script&gt;/);
  assert.match(html, /Storing/);
});

test("metrics preserve missing counts and reject made-up numeric values", () => {
  const html = components.MetricStrip({
    metrics: [
      { label: "Onbekend", value: null },
      { label: "Drift", value: 0 },
    ],
  });
  assert.match(html, /Niet bekend/);
  assert.match(html, /<dd>0<\/dd>/);
  assert.throws(
    () => components.MetricStrip({ metrics: [{ label: "Count", value: -1 }] }),
    /count/i,
  );
});

test("retry is inert before binding and reserves pending geometry", () => {
  assert.match(components.RetryAction(), /disabled/);
  const html = components.RetryAction({ pending: true });
  assert.match(html, /aria-busy="true"/);
  assert.match(html, /disabled/);
  assert.match(html, /activity-slot/);
});

test("complete page composes one main, heading and named home link", () => {
  const html = components.OperatorPage({
    product: "Voorbeeld",
    layers: [{ label: "Bron", state: "unknown" }],
    snapshotState: "partial",
    homeHref: "index.html",
  });
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  assert.equal((html.match(/<main\b/g) || []).length, 1);
  assert.match(html, /id="main" tabindex="-1"/);
  assert.match(html, /aria-label="ChefGroep startpagina"/);
  assert.match(html, /1 laag is nog niet bewezen/);
});
