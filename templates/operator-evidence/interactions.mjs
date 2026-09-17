/** The callback owns fetching, acceptance and rendering; this owns retry UI. */
export function bindRetry(button, { onRetry, result }) {
  if (
    !button ||
    button.tagName !== "BUTTON" ||
    typeof onRetry !== "function" ||
    !result
  )
    throw new TypeError(
      "bindRetry requires a button, result region and onRetry callback",
    );
  let pending = false;
  let destroyed = false;
  result.setAttribute("role", "status");
  result.setAttribute("tabindex", "-1");
  button.disabled = false;
  async function retry() {
    if (pending || destroyed) return;
    pending = true;
    button.disabled = true;
    button.setAttribute("aria-busy", "true");
    result.textContent = "Bewijs wordt opnieuw opgehaald.";
    try {
      const operation = onRetry();
      if (!operation || typeof operation.then !== "function")
        throw new TypeError("De aanvraag heeft geen resultaat bevestigd.");
      const message = await operation;
      if (typeof message !== "string" || !message.trim())
        throw new TypeError("De aanvraag heeft geen resultaat bevestigd.");
      if (!destroyed) result.textContent = message;
    } catch {
      // Raw upstream errors can contain hosts, keys or internal details.
      if (!destroyed)
        result.textContent =
          "Verversen mislukt. Het vorige bewijs blijft beschikbaar. Probeer het opnieuw.";
    } finally {
      pending = false;
      if (!destroyed) {
        button.disabled = false;
        button.removeAttribute("aria-busy");
        result.focus();
      }
    }
  }
  button.addEventListener("click", retry);
  return {
    destroy() {
      destroyed = true;
      button.removeEventListener("click", retry);
      button.disabled = true;
      button.removeAttribute("aria-busy");
    },
  };
}
