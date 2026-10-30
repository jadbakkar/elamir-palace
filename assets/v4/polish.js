/* El Amir Palace · polish layer (homepage + pedir.html; styles in assets/v4/polish.css)
   - language switch: one pill slides under the active language
   - header / phone PEDIR bumps when a dish is added from the homepage
   - lazy photos fade in once loaded
   - pedir.html toast: swipe down to dismiss (touch)
   - page transitions: the tapped dish photo morphs into its row on pedir.html
   Everything here is an enhancement: without this file the page looks and works the same, minus the motion. */
(function () {
  "use strict";
  var doc = document, html = doc.documentElement;
  var RM = matchMedia("(prefers-reduced-motion: reduce)");

  /* ---------- language pill ---------- */
  function pill(box) {
    var place = function (instant) {
      var b = box.querySelector('button[aria-pressed="true"]');
      if (!b || !b.offsetWidth) return;
      if (instant) box.classList.add("no-anim");
      box.style.setProperty("--lx", b.offsetLeft + "px");
      box.style.setProperty("--lw", b.offsetWidth + "px");
      box.style.setProperty("--lt", b.offsetTop + "px");
      box.style.setProperty("--lh", b.offsetHeight + "px");
      if (instant) requestAnimationFrame(function () { requestAnimationFrame(function () { box.classList.remove("no-anim"); }); });
    };
    box.classList.add("has-pill");
    place(true);
    new MutationObserver(function () { place(false); }).observe(box, { subtree: true, attributes: true, attributeFilter: ["aria-pressed"] });
    if ("ResizeObserver" in window) new ResizeObserver(function () { place(true); }).observe(box);
    if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(function () { place(true); });
  }

  /* ---------- PEDIR bump when the homepage adds a dish (home.js fires "amir-cart") ---------- */
  function bump(el) {
    if (!el || RM.matches) return;
    el.classList.remove("is-bump"); void el.offsetWidth; el.classList.add("is-bump");
    el.addEventListener("animationend", function () { el.classList.remove("is-bump"); }, { once: true });
  }
  doc.addEventListener("amir-cart", function () {
    bump(doc.querySelector(".hd-r > .btn--wine"));
    bump(doc.querySelector(".bnav-o"));
  });

  /* ---------- lazy photos fade in ---------- */
  function fade(img) {
    if (img._fade || (img.complete && img.naturalWidth)) return;
    img._fade = true; img.classList.add("img-in");
    var done = function () {
      img.classList.add("is-in");
      setTimeout(function () { img.classList.remove("img-in", "is-in"); }, 450);   /* hand transitions back to the page's own rules */
    };
    img.addEventListener("load", done, { once: true });
    img.addEventListener("error", done, { once: true });
  }
  function fadeAll(root) {
    if (RM.matches) return;
    if (root.matches && root.matches('img[loading="lazy"]')) fade(root);
    if (root.querySelectorAll) Array.prototype.forEach.call(root.querySelectorAll('img[loading="lazy"]'), fade);
  }

  /* ---------- toast: swipe down to dismiss ---------- */
  function swipe(el) {
    var y0 = null, dy = 0, id = null;
    el.addEventListener("pointerdown", function (e) {
      if (e.pointerType === "mouse" || !el.classList.contains("show")) return;
      y0 = e.clientY; dy = 0; id = e.pointerId;
    });
    el.addEventListener("pointermove", function (e) {
      if (y0 === null || e.pointerId !== id) return;
      dy = Math.max(0, e.clientY - y0);
      if (dy < 6) return;
      el.classList.add("is-drag");
      el.style.translate = "0 " + dy + "px"; el.style.opacity = String(Math.max(0, 1 - dy / 90));
    });
    var end = function () {
      if (y0 === null) return;
      y0 = null; el.classList.remove("is-drag");
      if (dy > 28) el.classList.remove("show");
      el.style.translate = ""; el.style.opacity = "";
    };
    el.addEventListener("pointerup", end);
    el.addEventListener("pointercancel", end);
  }

  /* ---------- boot ---------- */
  function boot() {
    Array.prototype.forEach.call(doc.querySelectorAll(".lang"), pill);
    fadeAll(doc);
    if ("MutationObserver" in window) new MutationObserver(function (ms) {
      ms.forEach(function (m) { Array.prototype.forEach.call(m.addedNodes, function (n) { if (n.nodeType === 1) fadeAll(n); }); });
    }).observe(doc.body, { childList: true, subtree: true });
    var t = doc.getElementById("toast"); if (t) swipe(t);
  }
  if (doc.readyState === "loading") doc.addEventListener("DOMContentLoaded", boot); else boot();
})();
