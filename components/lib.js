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

  // GRO-1036: backtick-toggle voor debug overlays (dev-mode)
  document.addEventListener("keydown", function(e) {
    if (e.key === "`" && !e.ctrlKey && !e.metaKey && !e.altKey) {
      var tag = (e.target.tagName || "").toLowerCase();
      if (tag === "input" || tag === "textarea" || tag === "select" || e.target.isContentEditable) return;
      document.body.classList.toggle("dev-mode");
    }
  });

  // GRO-1043: scroll reveal — .reveal elementen faden in bij scroll
  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var ro = new IntersectionObserver(function(entries) {
      entries.forEach(function(en) {
        if (en.isIntersecting) {
          en.target.classList.add("visible");
          ro.unobserve(en.target);
        }
      });
    }, { threshold: 0.15 });
    document.querySelectorAll(".reveal").forEach(function(el) { ro.observe(el); });
  } else {
    document.querySelectorAll(".reveal").forEach(function(el) { el.classList.add("visible"); });
  }

  // GRO-1043: cursor glow — subtle accent glow follows mouse
  var glow = document.createElement("div");
  glow.style.cssText = "position:fixed;pointer-events:none;width:300px;height:300px;border-radius:50%;background:radial-gradient(circle,var(--accent-soft) 0%,transparent 70%);transform:translate(-50%,-50%);opacity:0;transition:opacity .3s;z-index:0;mix-blend-mode:multiply;";
  document.body.appendChild(glow);
  var glowRAF = 0;
  document.addEventListener("mousemove", function(e) {
    if (glowRAF) return;
    glowRAF = requestAnimationFrame(function() {
      glow.style.left = e.clientX + "px";
      glow.style.top = e.clientY + "px";
      glow.style.opacity = "0.6";
      glowRAF = 0;
    });
  });
  document.addEventListener("mouseleave", function() { glow.style.opacity = "0"; });
})();
