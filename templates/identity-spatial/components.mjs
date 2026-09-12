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
}) {
  busy = Boolean(busy);
  if (!["primary", "neutral", "danger"].includes(intent))
    throw new TypeError("Unknown button intent");
  return `<button type="button"${id ? ` id="${text(id)}"` : ""} class="button button--${intent}" aria-busy="${busy}"${busy || disabled ? " disabled" : ""}><span>${text(label)}</span><span class="button-activity" aria-hidden="true" data-busy="${busy}">${activity()}</span></button>`;
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
