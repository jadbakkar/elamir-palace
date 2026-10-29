/* TEMPORARY colour switch: wine (original) <-> menu.pdf palette. Choice is remembered in localStorage. */
(function () {
  var d = document.documentElement, K = "ea-palette", cur = "pdf";
  try { cur = localStorage.getItem(K) || "pdf"; } catch (e) {}
  d.setAttribute("data-palette", cur);
  var L = { es: "Cambiar colores", en: "Switch colors", ar: "تبديل الألوان" };
  function add() {
    var b = document.createElement("button");
    b.type = "button"; b.className = "pal-btn";
    b.setAttribute("aria-label", L[d.lang] || L.en);
    b.title = b.getAttribute("aria-label");
    b.onclick = function () {
      cur = cur === "pdf" ? "wine" : "pdf";
      d.setAttribute("data-palette", cur);
      try { localStorage.setItem(K, cur); } catch (e) {}
    };
    document.body.appendChild(b);
  }
  if (document.body) add(); else document.addEventListener("DOMContentLoaded", add);
})();
