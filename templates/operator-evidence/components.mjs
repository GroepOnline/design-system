/** Portable HTML renderers. *Html slots accept trusted product markup only.
 * The product owns snapshots, required layers, clocks, requests and routing.
 */
function text(value) {
  return String(value ?? "").replace(
    /[&<>"']/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        char
      ],
  );
}

function url(value) {
  if (
    !["http:", "https:"].includes(
      new URL(value, "https://template.invalid/").protocol,
    )
  )
    throw new TypeError("Links require an HTTP(S) or relative URL");
  return text(value);
}

const states = Object.freeze({
  healthy: ["✓", "Bewezen"],
  partial: ["◐", "Deels bewezen"],
  degraded: ["!", "Verminderd"],
  down: ["×", "Storing"],
  drift: ["≠", "Drift"],
  stale: ["◷", "Verouderd"],
  waiting: ["…", "Wacht"],
  unknown: ["○", "Niet bewezen"],
});
function stateOf(value) {
  return Object.hasOwn(states, value) ? value : "unknown";
}

const snapshotStates = Object.freeze({
  loading: true,
  current: true,
  stale: true,
  partial: true,
  "refresh-error": true,
  unavailable: true,
});
function snapshotStateOf(value) {
  return Object.hasOwn(snapshotStates, value) ? value : "unknown";
}

export function BrandMark({
  href = "/",
  markUrl = "identity-mark.svg",
  product = "",
} = {}) {
  return `<a class="brand" href="${url(href)}" aria-label="ChefGroep startpagina" translate="no"><span class="brand-mark"><img src="${url(markUrl)}" alt="" aria-hidden="true" width="36" height="36"></span><span>ChefGroep<span class="brand-dot">.</span></span>${product ? `<span class="product">${text(product)}</span>` : ""}</a>`;
}

export function StatusPill({ state = "unknown" } = {}) {
  const value = stateOf(state);
  const [symbol, label] = states[value];
  return `<span class="pill" data-state="${value}"><span aria-hidden="true">${symbol}</span>${label}</span>`;
}

export function FreshnessStamp({
  timestamp,
  now,
  staleAfterMs,
  locale = "nl-NL",
} = {}) {
  if (
    !Number.isFinite(now) ||
    !Number.isFinite(staleAfterMs) ||
    staleAfterMs <= 0
  )
    throw new TypeError(
      "Freshness requires a finite caller clock and positive staleAfterMs",
    );
  const zoned =
    typeof timestamp === "string" &&
    timestamp.match(
      /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})(?:\.\d{1,9})?(?:Z|[+-]\d{2}:\d{2})$/,
    );
  const wallTime = zoned ? Date.parse(`${zoned[1]}Z`) : NaN;
  const validCalendar =
    Number.isFinite(wallTime) &&
    new Date(wallTime).toISOString().slice(0, 19) === zoned[1];
  const instant = validCalendar ? Date.parse(timestamp) : NaN;
  if (!Number.isFinite(instant) || instant > now)
    return '<span class="observed" data-freshness="unknown">Tijd niet bewezen</span>';
  const age = now - instant;
  const [unit, size] =
    age >= 86400000
      ? ["day", 86400000]
      : age >= 3600000
        ? ["hour", 3600000]
        : age >= 60000
          ? ["minute", 60000]
          : ["second", 1000];
  const label = new Intl.RelativeTimeFormat(locale, {
    numeric: "always",
  }).format(-Math.floor(age / size), unit);
  const absolute = new Date(instant).toISOString();
  return `<time class="observed" data-freshness="${age >= staleAfterMs ? "stale" : "current"}" datetime="${absolute}" title="${absolute}">${text(label)}</time>`;
}

export function OperationalConclusion({
  layers = [],
  snapshotState = "current",
  eyebrow = "Operationele bewijsvoering",
  description = "Elke laag houdt zijn eigen bewijs. Een geslaagde runtimeprobe bevestigt geen release of bereikbaarheid.",
} = {}) {
  const acceptedSnapshotState = snapshotStateOf(snapshotState);
  const unproven = layers.filter((layer) => stateOf(layer.state) !== "healthy");
  const layerTitle =
    layers.length === 0
      ? "Nog geen bewijs beschikbaar."
      : unproven.length === 0
        ? "Alle lagen zijn bewezen."
        : `${unproven.length} ${unproven.length === 1 ? "laag is" : "lagen zijn"} nog niet bewezen.`;
  const contextTitles = {
    loading: "Bewijs wordt opgehaald.",
    unavailable: "Nog geen bewijs beschikbaar.",
    stale: "Deze waarneming is verouderd.",
    "refresh-error": "Verversen is niet gelukt.",
    unknown: "De waarneming is onbekend.",
  };
  const title =
    contextTitles[acceptedSnapshotState] ||
    (acceptedSnapshotState === "partial" && unproven.length === 0
      ? "De waarneming is nog onvolledig."
      : layerTitle);
  const groups = Object.keys(states)
    .filter((state) => state !== "healthy")
    .map((state) => ({
      state,
      count: unproven.filter((layer) => stateOf(layer.state) === state).length,
    }))
    .filter((group) => group.count > 0);
  const details =
    groups.length > 1
      ? `<ul class="conclusion-states" aria-label="Aandacht per toestand">${groups.map(({ state, count }) => `<li><span>${count}</span> ${StatusPill({ state })}</li>`).join("")}</ul>`
      : "";
  return `<div><p class="kicker">${text(eyebrow)}</p><h1 id="title">${title}</h1>${details}<p class="intro">${text(description)}</p></div>`;
}

export function EvidenceVector({
  layers = [],
  label = "Bewijs van bron tot waarneming",
} = {}) {
  if (!layers.length)
    return '<p class="empty">Er zijn nog geen bewijslagen aangeleverd.</p>';
  return `<section class="flow" aria-label="${text(label)}" tabindex="0" style="--layer-count:${layers.length}">${layers
    .map((layer, index) => {
      const state = stateOf(layer.state);
      return `<div class="step" data-state="${state}" style="--layer-delay:${Math.min(index, 6) * 10}ms"><span class="node" aria-hidden="true"></span><span class="label">${text(layer.label)}</span>${StatusPill({ state })}<span class="detail">${text(layer.detail)}</span></div>`;
    })
    .join("")}</section>`;
}

export function MetricStrip({ metrics = [], label = "Samenvatting" } = {}) {
  return `<dl class="metrics" aria-label="${text(label)}" style="--metric-count:${Math.max(metrics.length, 1)}">${metrics
    .map(({ label: name, value }) => {
      if (value != null && (!Number.isSafeInteger(value) || value < 0))
        throw new TypeError(
          "Metric count must be a non-negative safe integer or null",
        );
      return `<div class="metric"><dt>${text(name)}</dt><dd>${value == null ? '<span class="unavailable-count">Niet bekend</span>' : value}</dd></div>`;
    })
    .join("")}</dl>`;
}

export function SectionNav({
  items = [],
  label = "Secties",
  currentHref,
} = {}) {
  return `<nav class="nav" aria-label="${text(label)}">${items.map(({ href, label: name }) => `<a href="${url(href)}"${href === currentHref ? ' aria-current="location"' : ""}>${text(name)}</a>`).join("")}</nav>`;
}

export function EvidenceRegion({
  id,
  title,
  description = "",
  contentHtml = "",
  state = "ready",
} = {}) {
  if (!id || !title)
    throw new TypeError("EvidenceRegion requires an id and title");
  if (!["ready", "empty", "unavailable"].includes(state))
    throw new TypeError("Unknown evidence region state");
  const content =
    state === "ready"
      ? contentHtml
      : `<p class="empty">${state === "empty" ? "Geen gegevens in deze sectie." : "Deze bron is niet beschikbaar."}</p>`;
  return `<section class="region" id="${text(id)}" aria-labelledby="${text(id)}-title"><div class="region-head"><h2 id="${text(id)}-title">${text(title)}</h2><p>${text(description)}</p></div>${content}</section>`;
}

export function DataTable({
  label,
  columns = [],
  rows = [],
  emptyMessage = "Geen gegevens beschikbaar.",
} = {}) {
  if (!label || !columns.length)
    throw new TypeError("DataTable requires an accessible label and columns");
  return `<div class="table-wrap" tabindex="0" role="region" aria-label="${text(label)}"><table><thead><tr>${columns.map((column) => `<th scope="col">${text(column.label)}</th>`).join("")}</tr></thead><tbody>${rows.length ? rows.map((row) => `<tr>${columns.map((column) => `<td${column.kind === "mono" ? ' class="mono"' : ""}>${column.kind === "status" ? StatusPill({ state: row[column.key] }) : text(row[column.key] ?? "Niet bekend")}</td>`).join("")}</tr>`).join("") : `<tr><td colspan="${columns.length}">${text(emptyMessage)}</td></tr>`}</tbody></table></div>`;
}

export function RetryAction({
  id = "retry",
  label = "Opnieuw proberen",
  pending = false,
  disabled = true,
} = {}) {
  return `<button class="retry" id="${text(id)}" type="button"${pending || disabled ? " disabled" : ""}${pending ? ' aria-busy="true"' : ""}><span>${text(label)}</span><span class="activity-slot" aria-hidden="true">···</span></button>`;
}

export function SnapshotFrame({
  state = "unavailable",
  contentHtml = "",
  actionHtml = "",
  message = "",
} = {}) {
  const labels = {
    loading: "Bewijs wordt opgehaald.",
    current: "Huidige waarneming.",
    stale: "Deze waarneming is verouderd. Controleer de bron opnieuw.",
    partial: "Niet alle bronnen hebben bewijs aangeleverd.",
    "refresh-error":
      "Verversen mislukt. Het laatst ontvangen bewijs blijft zichtbaar.",
    unavailable:
      "Er is geen waarneming beschikbaar. Probeer de bron opnieuw op te halen.",
  };
  if (!Object.hasOwn(labels, state))
    throw new TypeError("Unknown snapshot state");
  return `<section class="snapshot" data-snapshot="${state}" aria-label="Waarneming"><div class="snapshot-feedback"><p role="${state === "refresh-error" ? "alert" : "status"}">${text(message || labels[state])}</p>${actionHtml}</div>${["loading", "unavailable"].includes(state) ? "" : contentHtml}</section>`;
}

export function OperatorPage({
  product,
  homeHref = "/",
  markUrl = "identity-mark.svg",
  observationHtml = "",
  source = "",
  layers = [],
  description,
  snapshotState = "unavailable",
  snapshotMessage,
  metrics = [],
  navigation = [],
  regionsHtml = "",
  actionHtml = "",
} = {}) {
  return `<a class="skip" href="#main">Naar inhoud</a><div class="shell"><header class="masthead">${BrandMark({ href: homeHref, markUrl, product })}${observationHtml}</header><main id="main" tabindex="-1"><section class="hero" aria-labelledby="title">${OperationalConclusion({ layers: ["loading", "unavailable"].includes(snapshotState) ? [] : layers, snapshotState, description })}${source ? `<aside class="aside"><p>Bron</p><p class="mono">${text(source)}</p></aside>` : ""}</section>${SnapshotFrame({ state: snapshotState, message: snapshotMessage, actionHtml, contentHtml: EvidenceVector({ layers }) + (metrics.length ? MetricStrip({ metrics }) : "") + (navigation.length ? SectionNav({ items: navigation }) : "") + regionsHtml })}</main></div>`;
}
