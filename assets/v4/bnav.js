/* El Amir Palace · bottom nav: sliding indicator + scroll-spy (homepage). Tiny, no dependencies. */
(function () {
  "use strict";
  var nav = document.getElementById("bnav"); if (!nav) return;
  var ind = nav.querySelector(".bnav-ind"), links = nav.querySelectorAll("a[data-k]");
  function place() {
    var a = nav.querySelector("a[aria-current]");
    if (!a || !nav.offsetWidth) { nav.classList.remove("has-ind"); return; }
    /* first placement: appear in place instead of sliding in from the left edge */
    if (!nav.classList.contains("has-ind")) { nav.classList.add("ind-init"); requestAnimationFrame(function () { requestAnimationFrame(function () { nav.classList.remove("ind-init"); }); }); }
    nav.style.setProperty("--x", (a.offsetLeft + a.offsetWidth / 2 - 13) + "px");
    nav.classList.add("has-ind");
  }
  function setActive(k) {
    links.forEach(function (a) { if (a.dataset.k === k) a.setAttribute("aria-current", "location"); else if (a.getAttribute("aria-current") !== "page") a.removeAttribute("aria-current"); });
    place();
  }
  // homepage: Inicio / Carta / Sucursales follow the section in view
  var spy = { carta: document.getElementById("carta"), branches: document.getElementById("sucursales") || document.getElementById("visitanos") };
  if (spy.carta && !nav.querySelector('a[aria-current="page"]')) {
    var seen = {};
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { seen[e.target === spy.branches ? "branches" : "carta"] = e.isIntersecting; });
      setActive(seen.branches ? "branches" : seen.carta ? "carta" : "home");
    }, { rootMargin: "-45% 0px -45% 0px" });
    io.observe(spy.carta); if (spy.branches) io.observe(spy.branches);
    links.forEach(function (a) { a.addEventListener("click", function () { if (a.dataset.k !== "wa" && a.dataset.k !== "order") setActive(a.dataset.k); }); });
  }
  // order count badge on PEDIR (same cart as pedir.html)
  var o = nav.querySelector(".bnav-o"), badge = document.createElement("b"); badge.className = "bnav-n"; badge.setAttribute("aria-hidden", "true");
  function count() {
    var c = {}, n = 0; try { c = JSON.parse(localStorage.getItem("amir-cart-v2")) || {}; } catch (e) {}
    for (var k in c) n += +c[k] || 0;
    badge.textContent = n > 99 ? "99+" : n; badge.hidden = !n;
    if (n && o) { o.appendChild(badge); badge.classList.remove("pop"); void badge.offsetWidth; badge.classList.add("pop"); }
  }
  if (o) { count(); document.addEventListener("amir-cart", count); addEventListener("storage", count); }
  addEventListener("resize", place);
  document.addEventListener("langchange", function () { setTimeout(place, 50); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(place);
  place();
})();
