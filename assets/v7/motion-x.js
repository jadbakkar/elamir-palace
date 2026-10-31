/* El Amir Palace · motion layer X (loads after v7.js, reuses its GSAP / ScrollTrigger / Lenis).
   To revert: delete this file + motion-x.css and their two tags in index.html, en/, ar/.
     curtain      image frames unveil bottom-up while the photo settles from 1.25 to 1 (once the photo is decoded)
     hero lift    hero text and buttons rise faster than the page as it scrolls away (no fade)
     rules        section-label gold rules draw outwards
     magnetic     buttons and arrows lean toward the pointer (desktop)
     tilt         cards tilt in 3D under the pointer, lift kept (desktop)
     stars        review stars pop in one by one
     footer       emblem spins in, columns rise
     cursor       trailing ring that grows over links (desktop)
   Nothing here runs with prefers-reduced-motion. */
(function () {
  "use strict";
  var d = document, h = d.documentElement, w = window, gsap = w.gsap, ST = w.ScrollTrigger;
  if (!gsap || !ST || w.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  var fine = w.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var rtl = function () { return h.dir === "rtl"; };
  h.classList.add("mx"); if (fine) h.classList.add("mx-fine");
  var $$ = function (s, r) { return Array.prototype.slice.call((r || d).querySelectorAll(s)); };
  function onEnter(el, fn, start) { ST.create({ trigger: el, start: start || "top 88%", once: true, onEnter: fn }); }
  function nth(el) { var li = el.closest("li"); return li && li.parentNode ? Array.prototype.indexOf.call(li.parentNode.children, li) : 0; }

  /* ---- curtain: frame clips open from the bottom, photo inside settles ----
     Photos are fetched and decoded a screen ahead, so the reveal can start with its card and never opens on an empty frame;
     if a photo is still not ready it waits for it, at most 0.3s. Frames inside a [data-reveal-group] start with that group. */
  function decode(img) {
    if (!img) return Promise.resolve();
    if (!img._dec) { if (img.loading === "lazy") img.loading = "eager"; img._dec = img.decode ? img.decode().catch(function () {}) : Promise.resolve(); }
    return img._dec;
  }
  function decoded(img, max) { return Promise.race([decode(img), new Promise(function (r) { setTimeout(r, max); })]); }
  $$(".card-img, .dish-img, .intro-img, .story-photo, .vid-frame").forEach(function (f) {
    var r = getComputedStyle(f).borderRadius || "0px", pic /* full radius: keeps the decor arch (decor.css) during the reveal */ = f.querySelector("picture, video"), img = f.querySelector("img");
    var group = f.closest("[data-reveal-group]");
    /* the reveal is a CSS transition (motion-x.css): the browser runs it, no per-frame clip-path writes from JS (they made phones stutter) */
    f.style.setProperty("--mx-r", r); f.classList.add("mx-cur"); if (pic) pic.classList.add("mx-pic");
    ST.create({ trigger: group || f, start: "top bottom+=100%", once: true, onEnter: function () { decode(img); } });
    onEnter(group || f, function () {
      var fast = !!group || f.classList.contains("card-img"), dl = fast ? Math.min(nth(f), 6) * 0.06 : Math.min(nth(f), 6) * 0.12 + 0.05;
      var du = fast ? 1.1 : 1.5, pdl = dl + (fast ? 0.1 : 0.25), pdu = fast ? 1.6 : 2.1;
      decoded(img, 300).then(function () {
        f.style.setProperty("--mx-d", du + "s"); f.style.setProperty("--mx-dl", dl + "s"); f.style.setProperty("--mx-pd", pdu + "s"); f.style.setProperty("--mx-pdl", pdl + "s");
        f.classList.add(fast ? "mx-fast" : "mx-slow", "mx-open"); if (pic) pic.classList.add("mx-pic-on");
        setTimeout(function () { f.classList.remove("mx-cur", "mx-open", "mx-fast", "mx-slow"); }, (dl + du) * 1000 + 60);
        if (pic) setTimeout(function () { pic.classList.remove("mx-pic", "mx-pic-on"); }, (pdl + pdu) * 1000 + 60);
      });
    }, group ? "top 88%" : f.classList.contains("card-img") ? "top 100%" : "top 92%");
  });

  /* ---- hero: the text block lifts faster than the page as the hero scrolls away (no fade, no photo dimming) ---- */
  var hero = d.querySelector(".hero");
  if (hero) {
    var hin = hero.querySelector(".hero-in");
    gsap.to(hin, { y: function () { return -hero.offsetHeight * 0.22; }, ease: "none",
      scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true, invalidateOnRefresh: true } });
  }

  /* ---- section-label rules draw outwards ---- */
  $$(".sec-label").forEach(function (l) { onEnter(l, function () { l.classList.add("mx-on"); }); });

  /* ---- review stars pop ---- */
  $$(".rcard").forEach(function (c) {
    var st = $$(".rc-stars svg", c); if (!st.length) return;
    gsap.set(st, { scale: 0, rotate: -60 });
    onEnter(c, function () {
      gsap.to(st, { scale: 1, rotate: 0, duration: 0.7, ease: "back.out(3)", stagger: 0.07, delay: 0.45 + Math.min(nth(c), 6) * 0.12 });
    });
  });

  /* ---- footer: emblem spins in, columns rise ---- */
  var ft = d.querySelector(".ft");
  if (ft) {
    var mk = ft.querySelector(".ft-mark"), cols = $$(".ft-grid > *, .ft-bot", ft);
    if (mk) gsap.set(mk, { scale: 0.3, rotate: -180, opacity: 0 });
    gsap.set(cols, { y: 50, opacity: 0 });
    onEnter(ft, function () {
      if (mk) gsap.to(mk, { scale: 1, rotate: 0, opacity: 1, duration: 1.8, ease: "expo.out" });
      gsap.to(cols, { y: 0, opacity: 1, duration: 1.2, ease: "power3.out", stagger: 0.1, delay: 0.15, clearProps: "transform" });
    }, "top 90%");
  }

  /* language switch rewrites text: make sure nothing waits hidden */
  d.addEventListener("langchange", function () { ST.refresh(); });

  if (!fine) return;

  /* ---- magnetic buttons ---- */
  $$(".btn, .arr, .find-tabs button, .hd .brand").forEach(function (b) {
    var xTo = gsap.quickTo(b, "x", { duration: 0.7, ease: "power3.out" }), yTo = gsap.quickTo(b, "y", { duration: 0.7, ease: "power3.out" });
    b.addEventListener("pointermove", function (e) {
      var r = b.getBoundingClientRect(), cx = r.left + r.width / 2 - gsap.getProperty(b, "x"), cy = r.top + r.height / 2 - gsap.getProperty(b, "y");
      xTo((e.clientX - cx) * 0.3); yTo((e.clientY - cy) * 0.35);
    });
    b.addEventListener("pointerleave", function () { xTo(0); yTo(0); });
  });

  /* ---- 3D tilt (keeps each card's own hover lift) ---- */
  $$(".card, .dish > a, .rcard").forEach(function (c) {
    var lift = c.classList.contains("card") ? -8 : c.classList.contains("rcard") ? -6 : -4;
    gsap.set(c, { transformPerspective: 1000 });
    var rx = gsap.quickTo(c, "rotationX", { duration: 0.8, ease: "power3.out" }), ry = gsap.quickTo(c, "rotationY", { duration: 0.8, ease: "power3.out" });
    c.addEventListener("pointerenter", function () { gsap.to(c, { y: lift, duration: 0.9, ease: "expo.out", overwrite: "auto" }); });
    c.addEventListener("pointermove", function (e) {
      var r = c.getBoundingClientRect(), nx = (e.clientX - r.left) / r.width - 0.5, ny = (e.clientY - r.top) / r.height - 0.5;
      ry(nx * 9); rx(ny * -7);
    });
    c.addEventListener("pointerleave", function () { rx(0); ry(0); gsap.to(c, { y: 0, duration: 0.9, ease: "expo.out", overwrite: "auto" }); });
  });

  /* ---- cursor ring ---- */
  var cu = d.createElement("div"); cu.className = "mx-cursor"; cu.setAttribute("aria-hidden", "true"); cu.appendChild(d.createElement("i")); d.body.appendChild(cu);
  var cx = gsap.quickTo(cu, "x", { duration: 0.45, ease: "power3.out" }), cy = gsap.quickTo(cu, "y", { duration: 0.45, ease: "power3.out" });
  w.addEventListener("pointermove", function (e) { if (e.pointerType !== "mouse") return; cx(e.clientX); cy(e.clientY); cu.classList.add("is-on"); }, { passive: true });
  d.addEventListener("pointerover", function (e) {
    var t = e.target.closest ? e.target : e.target.parentNode;
    cu.classList.toggle("is-img", !!t.closest(".card, .dish > a"));
    cu.classList.toggle("is-big", !!t.closest("a, button, summary, [role=tab], label, input, select, textarea"));
    cu.classList.toggle("is-light", !!t.closest(".hero, .is-wine, .ft, .hd:not(.is-solid)"));
  });
  d.addEventListener("pointerleave", function () { cu.classList.remove("is-on"); });
  d.addEventListener("pointerdown", function () { cu.classList.add("is-down"); });
  d.addEventListener("pointerup", function () { cu.classList.remove("is-down"); });
})();
