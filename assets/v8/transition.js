/* fallback page fade for browsers without cross-document view transitions (see transition.css) */
(function () {
  "use strict";
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (window.CSS && CSS.supports && CSS.supports("selector(::view-transition)")) return;
  var h = document.documentElement;
  window.addEventListener("pageshow", function () { h.classList.remove("pg-leaving"); });
  document.addEventListener("click", function (e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target.closest && e.target.closest("a[href]");
    if (!a || (a.target && a.target !== "_self") || a.hasAttribute("download")) return;
    var u; try { u = new URL(a.href, location.href); } catch (_) { return; }
    if (u.origin !== location.origin || (u.pathname === location.pathname && u.search === location.search)) return;
    if (a.hasAttribute("data-wa")) return;
    e.preventDefault(); h.classList.add("pg-leaving");
    setTimeout(function () { location.href = u.href; }, 260);
  });
})();
