import {
  DataTable,
  EvidenceRegion,
  FreshnessStamp,
  OperatorPage,
  RetryAction,
  SnapshotFrame,
} from "./components.mjs";

const layers = [
  ["Bron", "ref vereist"],
  ["CI", "check vereist"],
  ["Release", "niet bewezen"],
  ["Deploy", "niet bewezen"],
  ["Runtime", "probe vereist"],
  ["Routes", "probe vereist"],
  ["Versheid", "tijd vereist"],
].map(([label, detail]) => ({ label, detail, state: "unknown" }));
const columns = [
  { key: "label", label: "Laag" },
  { key: "state", label: "Stand", kind: "status" },
  { key: "detail", label: "Vereist bewijs", kind: "mono" },
];

function document(title, body, script = "") {
  return `<!doctype html>
<html lang="nl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#f7f6f5" media="(prefers-color-scheme: light)"><meta name="theme-color" content="#161513" media="(prefers-color-scheme: dark)"><title>${title}</title><link rel="stylesheet" href="tokens.css"></head><body>${body}${script}</body></html>\n`;
}

export function landingDocument() {
  return document(
    "ChefGroep operator evidence · ontwerptemplate",
    OperatorPage({
      product: "Evidence",
      homeHref: "index.html",
      layers,
      snapshotState: "partial",
      source: "GroepOnline/product",
      observationHtml:
        '<span class="observed">Ontwerptemplate<br>Geen live data</span>',
      description:
        "Alle zeven lagen wachten op een bron. Dit voorbeeld laat zien welk bewijs een operator nodig heeft voordat een claim bevestigd kan worden.",
      metrics: [
        { label: "Bewezen", value: 0 },
        { label: "Deels", value: 0 },
        { label: "Storing", value: 0 },
        { label: "Drift", value: 0 },
        { label: "Onbekend", value: 7 },
        { label: "Wacht", value: 0 },
      ],
      navigation: [
        { href: "#evidence", label: "Evidence" },
        { href: "states.html", label: "Alle toestanden" },
        { href: "README.md", label: "Gebruik" },
      ],
      regionsHtml: EvidenceRegion({
        id: "evidence",
        title: "Evidence",
        description: "Voorbeeld zonder runtimeclaim",
        contentHtml: DataTable({
          label: "Voorbeeldevidence",
          columns,
          rows: layers,
        }),
      }),
    }),
  );
}

export function statesDocument() {
  const snapshotExamples = [
    "loading",
    "current",
    "stale",
    "partial",
    "refresh-error",
    "unavailable",
  ]
    .map((state) =>
      EvidenceRegion({
        id: `state-${state}`,
        title: state,
        description: "Vaste voorbeeldtoestand",
        contentHtml: SnapshotFrame({
          state,
          contentHtml: DataTable({
            label: `Voorbeeld ${state}`,
            columns,
            rows: [
              {
                label: "Runtime",
                state: "healthy",
                detail: "Voorbeeld van eerder ontvangen bewijs",
              },
              {
                label: "Bron",
                state: "unknown",
                detail: "Nog niet aangeleverd",
              },
            ],
          }),
        }),
      }),
    )
    .join("");
  return document(
    "ChefGroep operator evidence · toestanden",
    OperatorPage({
      product: "Evidence",
      homeHref: "index.html",
      layers,
      snapshotState: "partial",
      observationHtml:
        '<span class="observed">Ontwerptemplate<br>Geen live data</span>',
      description:
        "Bekijk laden, ontbrekende bronnen en herstel. De voorbeeldknop demonstreert een mislukte poging en verstuurt geen verzoek.",
      navigation: [
        { href: "#recovery", label: "Herstel" },
        { href: "#state-loading", label: "Toestanden" },
        { href: "index.html", label: "Overzicht" },
      ],
      regionsHtml:
        EvidenceRegion({
          id: "recovery",
          title: "Herstel na een fout",
          description: "Lokale demonstratie",
          contentHtml: `<div class="example-body">${FreshnessStamp({ timestamp: "2026-09-12T11:59:00Z", now: Date.parse("2026-09-12T12:00:00Z"), staleAfterMs: 120000 })}<p>Deze relatieve tijd gebruikt een vaste voorbeeldklok.</p>${RetryAction()}<p id="retry-result" role="status">De vorige waarneming blijft leesbaar bij een fout.</p><noscript>De demonstratieknop wordt beschikbaar met JavaScript.</noscript></div>`,
        }) + snapshotExamples,
    }),
    '<script type="module" src="states.mjs"></script>',
  );
}
