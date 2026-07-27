// lib.js — gedeelde component-helpers (optioneel, components werken ook standalone)
// Gebruik: <script src="lib.js"></script>
(function () {
  // deep link: ?theme=dark
  const t = new URLSearchParams(location.search).get("theme");
  if (t) document.documentElement.dataset.theme = t;

  // luister naar gallery-theme (postMessage van index.html)
  window.addEventListener("message", e => {
    if (e.data && e.data.dsTheme !== undefined) {
      document.documentElement.dataset.theme = e.data.dsTheme;
    }
  });

  // standaard switch-gedrag
  document.addEventListener("click", e => {
    const sw = e.target.closest(".switch");
    if (sw && !sw.dataset.manual) {
      sw.setAttribute("aria-checked", sw.getAttribute("aria-checked") !== "true");
    }
  });
})();
