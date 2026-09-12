/**
 * Identity template renderers. Copy with tokens.css/product.css into a consumer.
 * Text and URL inputs are escaped. *Html slots accept only trusted markup from
 * these renderers or product-owned templates, never API/user HTML.
 * The product owns routing, requests, event handlers and authorization.
 */
function text(value) {
  return String(value).replace(
    /[&<>"']/g,
    (char) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[char],
  );
}

function url(value) {
  const target = new URL(value, "https://template.invalid/");
  if (!["http:", "https:"].includes(target.protocol)) {
    throw new TypeError("Identity links require an HTTP(S) or relative URL");
  }
  return text(value);
}

function activity() {
  return '<span class="activity-pips" aria-hidden="true"><i></i><i></i><i></i></span>';
}

export function Brand({
  href = "/",
  markUrl = "identity-mark.svg",
  label = "ChefGroep startpagina",
} = {}) {
  return `<a class="brand" href="${url(href)}" aria-label="${text(label)}" translate="no"><img class="brand-mark" src="${url(markUrl)}" width="36" height="36" alt="" aria-hidden="true"><span>ChefGroep<span class="brand-dot">.</span></span></a>`;
}

export function Portal({ compact = false } = {}) {
  return `<div class="portal${compact ? " portal--compact" : ""}" aria-hidden="true">
    <div class="portal-halo"></div>
    <div class="portal-orbit orbit-one"></div><div class="portal-orbit orbit-two"></div>
    <div class="portal-object">
      <div class="portal-plane plane-back"></div><div class="portal-plane plane-middle"></div><div class="portal-plane plane-front"></div>
      <div class="portal-core"><span></span></div><div class="portal-rim"></div>
    </div>
    <div class="portal-shadow"></div><span class="portal-caption">ChefGroep</span>
  </div>`;
}

export function ActionLink({ href, label, secondary = false }) {
  return `<a class="button button--${secondary ? "neutral" : "primary"}" href="${url(href)}">${text(label)} <span aria-hidden="true">→</span></a>`;
}

export function Button({
  label,
  id,
  intent = "primary",
  busy = false,
  disabled = false,
  action = "",
}) {
  busy = Boolean(busy);
  if (!["primary", "neutral", "danger"].includes(intent))
    throw new TypeError("Unknown button intent");
  return `<button type="button"${action ? ` data-action="${text(action)}"` : ""}${id ? ` id="${text(id)}"` : ""} class="button button--${intent}" aria-busy="${busy}"${busy || disabled ? " disabled" : ""}><span>${text(label)}</span><span class="button-activity" aria-hidden="true" data-busy="${busy}">${activity()}</span></button>`;
}

/** One shell per document. Navigation/footer slots contain product-owned links. */
export function SiteShell({
  contentHtml,
  plane,
  navigationHtml = "",
  footerHtml = "",
  homeHref = "/",
  mainId = "main",
}) {
  return `<div class="site-shell"><a class="skip-link" href="#${text(mainId)}">Naar inhoud</a>
    <header class="site-header">${Brand({ href: homeHref })}<span class="plane-label">${text(plane)}</span>${navigationHtml}</header>
    <main id="${text(mainId)}" tabindex="-1">${contentHtml}</main>
    ${footerHtml ? `<footer class="site-footer">${footerHtml}</footer>` : ""}
  </div>`;
}

/** The landing owns the document h1; title lines are plain text, not HTML. */
export function LandingHero({
  eyebrow,
  titleLines,
  emphasis,
  description,
  actionsHtml,
}) {
  return `<section class="landing-hero"><div class="hero-copy">
    <p class="eyebrow">${text(eyebrow)}</p>
    <h1>${titleLines.map(text).join("<br>")}<br><em>${text(emphasis)}</em></h1>
    <p class="hero-description">${text(description)}</p><div class="hero-actions">${actionsHtml}</div>
  </div><div class="hero-art">${Portal()}</div></section>`;
}

/** Use instead of LandingHero on operational routes, not beside its h1. */
export function PageTitle({ eyebrow, title, description, actionHtml = "" }) {
  return `<header class="page-title"><div><p class="eyebrow">${text(eyebrow)}</p><h1>${text(title)}</h1><p class="page-description">${text(description)}</p></div>${actionHtml}</header>`;
}

export function Loading({ message }) {
  return `<div class="loading-state" role="status">${activity()}<span>${text(message)}</span></div>`;
}

export function Empty({ title, message, actionHtml = "" }) {
  return `<div class="empty-state"><h2>${text(title)}</h2><p>${text(message)}</p>${actionHtml}</div>`;
}

/** Keep the alert text separate so retry remains keyboard-operable and named. */
export function Failure({ title, message, actionHtml }) {
  return `<div class="empty-state"><div role="alert"><h2>${text(title)}</h2><p>${text(message)}</p></div>${actionHtml}</div>`;
}

/** A notice describes a product-confirmed result; it never invents success. */
export function Notice({ message, error = false }) {
  return `<div class="notice${error ? " notice--error" : ""}" role="${error ? "alert" : "status"}"><span>${text(message)}</span></div>`;
}

export function Navigation({ items, currentHref, label = "Accountnavigatie" }) {
  return `<nav aria-label="${text(label)}">${items.map((item) => `<a href="${url(item.href)}"${item.href === currentHref ? ' aria-current="page" class="active"' : ""}>${text(item.label)}</a>`).join("")}</nav>`;
}

export function Field({
  id,
  name,
  label,
  autocomplete,
  type = "text",
  value = "",
  hint = "",
  error = "",
  required = false,
  disabled = false,
}) {
  if (!["text", "email", "password", "search", "tel", "url"].includes(type))
    throw new TypeError("Unsupported field type");
  const describedBy = [hint && `${id}-hint`, error && `${id}-error`]
    .filter(Boolean)
    .join(" ");
  return `<div class="identity-field"><label class="field" for="${text(id)}"><span>${text(label)}${required ? " (verplicht)" : ""}</span><input id="${text(id)}" name="${text(name)}" type="${type}" autocomplete="${text(autocomplete)}" value="${text(value)}"${required ? " required" : ""}${disabled ? " disabled" : ""} aria-invalid="${Boolean(error)}"${describedBy ? ` aria-describedby="${text(describedBy)}"` : ""}></label>${hint ? `<p class="field-help" id="${text(id)}-hint">${text(hint)}</p>` : ""}${error ? `<p class="identity-field-error" id="${text(id)}-error" role="alert">${text(error)}</p>` : ""}</div>`;
}

/** Membership must come from the product. Unknown or ineligible is disabled. */
export function AccountChoice({
  id,
  name,
  legend,
  options,
  selectedValue = "",
  pending = false,
  error = "",
}) {
  return `<fieldset class="account-choice"${pending ? " disabled" : ""} aria-busy="${Boolean(pending)}"${error ? ` aria-describedby="${text(id)}-error"` : ""}><legend>${text(legend)}</legend>${options
    .map((option, index) => {
      const eligible = option.membership === "eligible";
      return `<label class="account-option" for="${text(id)}-${index}"><input id="${text(id)}-${index}" type="radio" name="${text(name)}" value="${text(option.value)}"${eligible && selectedValue === option.value ? " checked" : ""}${eligible ? "" : " disabled"}><span><strong>${text(option.label)}</strong><small>${text(option.description)}</small>${eligible ? "" : `<small>${text(option.unavailableReason || "Niet beschikbaar voor deze keuze.")}</small>`}</span></label>`;
    })
    .join(
      "",
    )}${pending ? Loading({ message: "Accountkeuze wordt verwerkt…" }) : ""}${error ? `<p id="${text(id)}-error" role="alert">${text(error)}</p>` : ""}</fieldset>`;
}

/** Required scopes remain checked and are included in native FormData. */
export function PermissionChoice({
  id,
  name,
  legend,
  permissions,
  pending = false,
  error = "",
}) {
  return `<fieldset class="permission-choice"${pending ? " disabled" : ""} aria-busy="${Boolean(pending)}"${error ? ` aria-describedby="${text(id)}-error"` : ""}><legend>${text(legend)}</legend>${permissions.map((permission, index) => `<label class="permission-option" for="${text(id)}-${index}"><input id="${text(id)}-${index}" type="checkbox" name="${text(name)}" value="${text(permission.value)}"${permission.required || permission.checked ? " checked" : ""}${permission.required || permission.disabled ? " disabled" : ""}><span><strong>${text(permission.label)}</strong><span>${text(permission.description)}</span><code>${text(permission.value)}</code>${permission.required ? "<small>Verplicht voor deze verbinding.</small>" : ""}</span></label>${permission.required ? `<input type="hidden" name="${text(name)}" value="${text(permission.value)}">` : ""}`).join("")}${pending ? Loading({ message: "Toestemming wordt verwerkt…" }) : ""}${error ? `<p id="${text(id)}-error" role="alert">${text(error)}</p>` : ""}</fieldset>`;
}

/** Bind with bindConfirm from interactions.mjs before exposing an open action. */
export function Confirm({
  id,
  title,
  message,
  actionLabel,
  cancelLabel = "Annuleren",
  pendingMessage = "De wijziging wordt verwerkt…",
}) {
  return `<dialog id="${text(id)}" class="confirm-dialog" aria-labelledby="${text(id)}-title" aria-describedby="${text(id)}-description"><h2 id="${text(id)}-title">${text(title)}</h2><p id="${text(id)}-description">${text(message)}</p><p data-confirm-error role="alert" hidden></p><p data-confirm-pending role="status" hidden>${text(pendingMessage)}</p><div class="dialog-actions">${Button({ label: cancelLabel, id: `${id}-cancel`, intent: "neutral", action: "cancel", disabled: true })}${Button({ label: actionLabel, id: `${id}-confirm`, intent: "danger", action: "confirm", disabled: true })}</div></dialog>`;
}

function recordState(state) {
  const labels = {
    active: "Actief",
    expired: "Verlopen",
    revoked: "Ingetrokken",
    unknown: "Onbekend",
  };
  if (!Object.hasOwn(labels, state))
    throw new TypeError("Unknown record state");
  return labels[state];
}

export function ConnectionRow({
  id,
  name,
  description,
  state,
  actionId = "",
  pending = false,
  error = "",
}) {
  return `<li class="connection-row identity-record" id="${text(id)}"><div class="connection-name"><h2>${text(name)}</h2><p>${text(description)}</p><span class="badge">${recordState(state)}</span>${pending ? Loading({ message: "Toegang wordt ingetrokken…" }) : ""}${error ? Notice({ message: error, error: true }) : ""}</div>${actionId ? Button({ id: actionId, label: "Toegang intrekken", intent: "danger", busy: pending, disabled: state !== "active" }) : ""}</li>`;
}

export function SessionRow({
  id,
  name,
  description,
  consequence,
  current = false,
  state = "active",
  actionId = "",
  pending = false,
  error = "",
}) {
  return `<li class="session-row identity-record" id="${text(id)}"><div class="connection-name"><h2>${text(name)}${current ? '<span class="badge">Dit apparaat</span>' : ""}</h2><p>${text(description)}</p><p>${text(consequence)}</p><span class="badge">${recordState(state)}</span>${pending ? Loading({ message: "Sessie wordt beëindigd…" }) : ""}${error ? Notice({ message: error, error: true }) : ""}</div>${actionId ? Button({ id: actionId, label: "Sessie beëindigen", intent: "danger", busy: pending, disabled: state !== "active" }) : ""}</li>`;
}

export function SecurityMethods({ state, methods = [], message = "" }) {
  switch (state) {
    case "loading":
      return Loading({
        message: message || "Aanmeldmethoden worden opgehaald…",
      });
    case "unavailable":
      return Notice({
        message: message || "Aanmeldmethoden zijn niet beschikbaar.",
      });
    case "error":
      return Notice({
        message: message || "Aanmeldmethoden konden niet worden opgehaald.",
        error: true,
      });
    case "ready":
      return methods.length
        ? `<ul class="identity-methods">${methods.map((method) => `<li class="method-row"><div><strong>${text(method.label)}</strong><p>${text(method.description)}</p></div></li>`).join("")}</ul>`
        : Empty({
            title: "Geen aanmeldmethoden.",
            message: "Er zijn geen aanmeldmethoden aangeleverd.",
          });
    default:
      throw new TypeError("Unknown security-method state");
  }
}

/** Events and timestamps are supplied facts; no browser-generated audit events. */
export function Audit({
  events,
  locale = "nl-NL",
  timeZone = "Europe/Amsterdam",
  emptyMessage = "Er zijn nog geen gebeurtenissen aangeleverd.",
}) {
  const formatter = new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone,
  });
  if (!events.length)
    return Empty({ title: "Geen gebeurtenissen.", message: emptyMessage });
  return `<ol class="audit-list">${events
    .map((event) => {
      if (
        !/^\d{4}-\d{2}-\d{2}T.*(?:Z|[+-]\d{2}:\d{2})$/.test(event.timestamp) ||
        !Number.isFinite(Date.parse(event.timestamp))
      )
        throw new TypeError("Audit timestamp requires an explicit timezone");
      return `<li><span class="audit-dot" aria-hidden="true"></span><div><p>${text(event.actor)}: ${text(event.action)}</p><time datetime="${text(event.timestamp)}">${text(formatter.format(new Date(event.timestamp)))} (${text(timeZone)})</time></div></li>`;
    })
    .join("")}</ol>`;
}
