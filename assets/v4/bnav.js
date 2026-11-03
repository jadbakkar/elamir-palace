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
  // homepage: the nav stays tucked away while the hero is idle and slides up once the visitor scrolls
  // (html.bnav-away is set in the page <head> so it never flashes in on load)
  if (document.querySelector(".hero")) {
    var root = document.documentElement, ticking = false;
    var away = function () { ticking = false; root.classList.toggle("bnav-away", (window.scrollY || 0) < 40); };
    addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(away); } }, { passive: true });
    away();
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

  // iOS 26 Safari (WebKit bug 297779): once the toolbar shrinks to the floating pill, fixed bars can stay where they were,
  // the bottom nav floating above the screen edge and the header below the status bar. Measure the gap to the visible
  // edge and close it with `translate` (the bars' own show/hide uses `transform`, so the two never clash). Zero gap = no change.
  var vv = window.visualViewport, ua = navigator.userAgent;
  if (vv && (/iP(hone|od|ad)/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1))) {
    var hd = document.querySelector(".hd"), queued = false;
    if (hd && getComputedStyle(hd).position !== "fixed") hd = null; // pedir.html's header is sticky: it scrolls with the page
    var fit = function () {
      queued = false;
      var zoomed = vv.scale > 1.01;
      var down = zoomed ? 0 : Math.round(vv.offsetTop + vv.height - (nav.offsetTop + nav.offsetHeight));
      nav.style.translate = down > 0 && down < 200 ? "0 " + down + "px" : "";
      if (hd) {
        var up = zoomed ? 0 : Math.round(hd.offsetTop - vv.offsetTop);
        hd.style.translate = up > 0 && up < 120 ? "0 " + -up + "px" : "";
      }
      if (dbg) dbg.textContent = "inner " + innerHeight + " · vv " + Math.round(vv.height) + " @" + Math.round(vv.offsetTop) + " · nav " + (nav.offsetTop + nav.offsetHeight) + " → " + down + (hd ? " · hd " + hd.offsetTop : "");
    };
    var queue = function () { if (!queued) { queued = true; requestAnimationFrame(fit); } };
    // ?vv in the address bar shows the numbers on screen, to read off a real iPhone
    var dbg = /[?&]vv\b/.test(location.search) ? document.body.appendChild(document.createElement("output")) : null;
    if (dbg) dbg.style.cssText = "position:fixed;top:40%;left:8px;right:8px;z-index:999;padding:8px;background:#000;color:#fff;font:12px/1.4 monospace;border-radius:8px;pointer-events:none";
    vv.addEventListener("resize", queue); vv.addEventListener("scroll", queue);
    addEventListener("scroll", queue, { passive: true }); addEventListener("resize", queue);
    fit();
  }
})();
