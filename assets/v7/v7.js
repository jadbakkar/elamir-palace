/* El Amir Palace · v7 behaviour + motion system (GSAP + ScrollTrigger + Lenis)
   Attribute API (reuse it on any page that loads this file):
     [data-reveal]          fade + rise once at "top 88%"   (style="--i:n" adds n × 0.12s delay)
     [data-reveal-group]    its children fade + rise in a stagger
     [data-split]           headline rises line by line from behind a mask (split after fonts load)
     .parallax > .parallax__inner   image scaled 1.12 drifts ±5% inside its frame (drift < scale: no gaps)
     .grow-wrap > .grow     image grows from 68% to full width, scrub 1.5
     .h-section > .h-track  pinned horizontal row, scrub 1, desktop only (swipe row below 900px)
     .script                hand-drawn word (SVG text stroke, then fill)
   The loader is CSS + an inline script in <body>; it fires "amir:reveal" when it starts to fade.
   prefers-reduced-motion: no Lenis, no parallax, no pin, no grow; plain fades only. */
(function () {
  "use strict";
  var d = document, h = d.documentElement, w = window;
  var reduced = w.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var rtl = function () { return h.dir === "rtl"; };

  /* ---- branches: today's hours highlighted + open/closed (America/Caracas, CONFIG.horario from config.js) ---- */
  function hoursStatus() {
    var C = typeof CONFIG !== "undefined" ? CONFIG : w.CONFIG, H = C && C.horario; if (!H) return; /* config.js declares a global const */
    var keys = ["dom", "lun", "mar", "mie", "jue", "vie", "sab"], p = {};
    try { new Intl.DateTimeFormat("en-US", { timeZone: C.tz || "America/Caracas", weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23" })
      .formatToParts(new Date()).forEach(function (x) { p[x.type] = x.value; }); } catch (e) { return; }
    var day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(p.weekday), now = (+p.hour % 24) * 60 + +p.minute;
    var m = function (s) { var a = s.split(":"); return +a[0] * 60 + +a[1]; };
    var t12 = function (s) { if (w.I18N && w.I18N.time12) return w.I18N.time12(s, w.I18N.lang); var a = s.split(":"), hh = +a[0], ap = hh >= 12 ? "pm" : "am"; hh = hh % 12 || 12; return hh + ":" + a[1] + " " + ap; };
    var T = function (k, v) { return w.I18N && w.I18N.t ? w.I18N.t(k, v) : k; };
    var today = H[keys[day]], yest = H[keys[(day + 6) % 7]], open = false, until, txt;
    if (today) { var o = m(today[0]), c = m(today[1]); if (c > o ? now >= o && now < c : now >= o) { open = true; until = today[1]; } }
    /* yesterday's hours can run past midnight ("02:00") */
    if (!open && yest && m(yest[1]) <= m(yest[0]) && now < m(yest[1])) { open = true; until = yest[1]; }
    if (open) txt = T("v7.br.open", { t: t12(until) });
    else {
      var next = today && now < m(today[0]) ? today[0] : null;
      for (var i = 1; !next && i < 8; i++) { var hd = H[keys[(day + i) % 7]]; if (hd) next = hd[0]; }
      txt = next ? T("v7.br.closed", { t: t12(next) }) : "";
    }
    d.querySelectorAll("[data-status]").forEach(function (el) { el.textContent = txt; el.classList.toggle("is-open", open); el.hidden = !txt; });
    d.querySelectorAll(".hours [data-days]").forEach(function (el) { el.classList.toggle("is-today", el.getAttribute("data-days").split(" ").indexOf(String(day)) > -1); });
  }
  /* "Hoy · 12:00 pm – 10:00 pm" line on the find-us card (after hoursStatus marked today's row) */
  function todayLine() {
    d.querySelectorAll("[data-today]").forEach(function (el) {
      var dd = el.closest(".find-panel").querySelector("dd.is-today");
      el.textContent = dd && w.I18N && w.I18N.t ? w.I18N.t("v7.br.today", { t: dd.textContent }) : (dd ? dd.textContent : "");
    });
  }
  var _hs = hoursStatus; hoursStatus = function () { _hs(); todayLine(); };
  d.addEventListener("langchange", todayLine);
  hoursStatus();
  setInterval(hoursStatus, 60000);

  /* ---- find us: branch toggle swaps the map + card; remembers the last branch ---- */
  var find = d.querySelector(".find");
  if (find) (function () {
    var tabs = find.querySelectorAll("[role=tab]"), frame = find.querySelector(".find-map"), ifr = d.getElementById("findMap");
    function pick(id, focus) {
      var panel;
      tabs.forEach(function (t) { var on = t.getAttribute("data-branch") === id; t.setAttribute("aria-selected", on); t.tabIndex = on ? 0 : -1; if (on && focus) t.focus(); });
      find.querySelectorAll(".find-panel").forEach(function (p) { var on = p.getAttribute("data-branch") === id; p.hidden = !on; if (on) panel = p; });
      var src = panel && panel.getAttribute("data-map").replace(/&amp;/g, "&");
      if (ifr && src && ifr.getAttribute("src") !== src) {
        frame.classList.add("is-swap");
        setTimeout(function () { ifr.src = src; ifr.addEventListener("load", function () { frame.classList.remove("is-swap"); }, { once: true }); setTimeout(function () { frame.classList.remove("is-swap"); }, 1500); }, reduced ? 0 : 300);
      }
      try { localStorage.setItem("amir-branch", id); } catch (e) {}
    }
    tabs.forEach(function (t, i) {
      t.addEventListener("click", function () { pick(t.getAttribute("data-branch")); });
      t.addEventListener("keydown", function (e) {
        var k = e.key, dir = k === "ArrowRight" ? 1 : k === "ArrowLeft" ? -1 : 0; if (!dir) return;
        if (rtl()) dir = -dir; e.preventDefault();
        var n = tabs[(i + dir + tabs.length) % tabs.length]; pick(n.getAttribute("data-branch"), true);
      });
    });
    var saved = null; try { saved = localStorage.getItem("amir-branch"); } catch (e) {}
    if (saved && /^[\w-]+$/.test(saved) && find.querySelector('.find-panel[data-branch="' + saved + '"]')) pick(saved);
  })();
  d.addEventListener("langchange", hoursStatus);

  /* ---- dish row: arrows scroll one card (mirrored in RTL) ---- */
  var dr = d.querySelector(".h-track");
  if (dr) (function () {
    var sec = dr.closest("section"), pv = sec.querySelector("[data-row-prev]"), nx = sec.querySelector("[data-row-next]");
    function upd() { var m = dr.scrollWidth - dr.clientWidth, x = Math.abs(dr.scrollLeft); if (pv) pv.disabled = x < 4; if (nx) nx.disabled = x > m - 4; }
    function step(dir) { var c = dr.querySelector(".dish"); if (!c) return; var g = parseFloat(getComputedStyle(dr).columnGap) || 0;
      dr.scrollBy({ left: dir * (c.offsetWidth + g) * (rtl() ? -1 : 1), behavior: reduced ? "auto" : "smooth" }); }
    if (pv) pv.addEventListener("click", function () { step(-1); });
    if (nx) nx.addEventListener("click", function () { step(1); });
    dr.addEventListener("scroll", upd, { passive: true }); w.addEventListener("resize", upd);
    d.addEventListener("langchange", function () { dr.scrollLeft = 0; upd(); });
    upd();
  })();

  /* ---- reviews row: arrows scroll one card (mirrored in RTL) ---- */
  var rr = d.getElementById("revRow");
  if (rr) (function () {
    var sec = rr.closest("section"), pv = sec.querySelector("[data-rev-prev]"), nx = sec.querySelector("[data-rev-next]");
    function upd() { var m = rr.scrollWidth - rr.clientWidth, x = Math.abs(rr.scrollLeft); if (pv) pv.disabled = x < 4; if (nx) nx.disabled = x > m - 4; }
    function step(dir) { var c = rr.querySelector(".rcard"); if (!c) return; var g = parseFloat(getComputedStyle(rr).columnGap) || 0;
      rr.scrollBy({ left: dir * (c.offsetWidth + g) * (rtl() ? -1 : 1), behavior: reduced ? "auto" : "smooth" }); }
    if (pv) pv.addEventListener("click", function () { step(-1); });
    if (nx) nx.addEventListener("click", function () { step(1); });
    rr.addEventListener("scroll", upd, { passive: true }); w.addEventListener("resize", upd);
    d.addEventListener("langchange", function () { rr.scrollLeft = 0; upd(); });
    upd();
  })();

  /* ---- reviews: endless marquee (cards cloned once; pauses on hover/focus; plain swipe row with reduced motion) ---- */
  var phone = w.matchMedia("(max-width:599px)").matches;
  /* phones: plain swipe row with dots instead of the marquee (a moving row can't be swiped) */
  if (rr && phone) (function () {
    var cards = [].slice.call(rr.querySelectorAll(".rcard")); if (cards.length < 2) return;
    var dots = d.createElement("div"); dots.className = "rev-dots"; dots.setAttribute("aria-hidden", "true");
    cards.forEach(function () { dots.appendChild(d.createElement("i")); });
    rr.parentNode.insertBefore(dots, rr.nextSibling);
    function mark() { var c = cards[0].offsetWidth + (parseFloat(getComputedStyle(rr).columnGap) || 0), k = Math.round(Math.abs(rr.scrollLeft) / c);
      [].forEach.call(dots.children, function (e, i) { e.classList.toggle("on", i === k); }); }
    rr.addEventListener("scroll", mark, { passive: true }); d.addEventListener("langchange", mark); mark();
  })();
  if (rr && !reduced && !phone) (function () {
    var orig = [].slice.call(rr.children);
    if (!orig.length) return;
    orig.forEach(function (c) { var k = c.cloneNode(true); k.setAttribute("aria-hidden", "true"); k.classList.add("is-clone"); rr.appendChild(k); });
    function measure() {
      var a = orig[0].getBoundingClientRect(), b = rr.children[orig.length].getBoundingClientRect(), dist = b.left - a.left;
      rr.style.setProperty("--marq-x", -dist + "px");
      rr.style.setProperty("--marq-d", Math.abs(dist) / 45 + "s");
    }
    rr.classList.add("is-marquee");
    measure();
    w.addEventListener("resize", measure);
    d.addEventListener("langchange", function () { setTimeout(measure, 0); });
    if (d.fonts && d.fonts.ready) d.fonts.ready.then(measure);
  })();

  /* ---- mouse drag-to-swipe on the dish row (touch already scrolls natively); release glides to the nearest card ---- */
  [dr].forEach(function (el) {
    if (!el) return;
    var down = false, moved = false, x0 = 0, s0 = 0, lx = 0, lt = 0, v = 0;
    el.addEventListener("pointerdown", function (e) {
      if (e.pointerType !== "mouse" || e.button !== 0 || el.scrollWidth <= el.clientWidth) return;
      down = true; moved = false; x0 = lx = e.clientX; s0 = el.scrollLeft; lt = performance.now(); v = 0;
    });
    w.addEventListener("pointermove", function (e) {
      if (!down) return;
      if (!moved && Math.abs(e.clientX - x0) > 4) { moved = true; el.style.scrollSnapType = "none"; el.style.scrollBehavior = "auto"; el.style.cursor = "grabbing"; el.style.userSelect = "none"; }
      if (!moved) return;
      var t = performance.now(), dt = Math.max(1, t - lt);
      v = 0.8 * ((e.clientX - lx) / dt) + 0.2 * v; lx = e.clientX; lt = t;
      el.scrollLeft = s0 - (e.clientX - x0);
    });
    function up() {
      if (!down) return;
      down = false;
      if (!moved) return;
      el.style.cursor = ""; el.style.userSelect = "";
      /* project the throw a little, then pick the card whose start edge lands nearest */
      var r = el.getBoundingClientRect(), rt = rtl(), cs = getComputedStyle(el);
      var pad = parseFloat(rt ? cs.scrollPaddingRight : cs.scrollPaddingLeft) || 0, throwPx = -v * 180, best = null;
      [].forEach.call(el.children, function (k) {
        var kr = k.getBoundingClientRect(), dx = rt ? kr.right - (r.right - pad) : kr.left - (r.left + pad);
        if (best === null || Math.abs(dx - throwPx) < Math.abs(best - throwPx)) best = dx;
      });
      var m = el.scrollWidth - el.clientWidth, cur = el.scrollLeft, to = cur + (best || 0);
      to = rt ? Math.min(0, Math.max(-m, to)) : Math.max(0, Math.min(m, to));
      var o = { x: cur };
      gsap && gsap.to ? gsap.to(o, { x: to, duration: 0.55, ease: "power3.out", onUpdate: function () { el.scrollLeft = o.x; },
        onComplete: function () { el.style.scrollSnapType = ""; el.style.scrollBehavior = ""; } })
        : (el.scrollLeft = to, el.style.scrollSnapType = "", el.style.scrollBehavior = "");
    }
    w.addEventListener("pointerup", up);
    w.addEventListener("pointercancel", up);
    el.addEventListener("click", function (e) { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);
    el.addEventListener("dragstart", function (e) { e.preventDefault(); });
  });

  /* ---- reviews follow the language switch: text from data-tr (written by scripts/prerender.js), date re-formatted ---- */
  function reviewsLang() {
    var l = (w.I18N && w.I18N.lang) || h.lang || "es", loc = { es: "es-VE", en: "en-US", ar: "ar" }[l] || "es-VE";
    d.querySelectorAll(".rcard").forEach(function (c) {
      var q = c.querySelector("blockquote[data-tr]"), tm = c.querySelector("time[datetime]"), tr = null;
      if (q) { try { tr = JSON.parse(q.getAttribute("data-tr")); } catch (e) {} }
      if (tr && tr[l] && q.lang !== l) { q.lang = l; q.dir = l === "ar" ? "rtl" : "ltr"; q.querySelector("p").textContent = tr[l]; }
      if (tm) try { tm.textContent = new Date(tm.getAttribute("datetime") + "T12:00:00").toLocaleDateString(loc, { month: "long", year: "numeric", numberingSystem: "latn" }); } catch (e) {}
    });
  }
  reviewsLang();
  d.addEventListener("langchange", reviewsLang);

  /* ---- silent loop videos: load when near, play only while visible; never autoplay with reduced motion ---- */
  d.querySelectorAll("video[data-src]").forEach(function (v) {
    if (reduced || !("IntersectionObserver" in w)) return;
    new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) { if (!v.src) { v.src = v.getAttribute("data-src"); } var p = v.play(); if (p && p.catch) p.catch(function () {}); }
        else if (v.src) v.pause();
      });
    }, { rootMargin: "200px 0px" }).observe(v);
  });

  var gsap = w.gsap, ST = w.ScrollTrigger;
  if (!gsap || !ST) { h.classList.remove("motion"); h.classList.add("no-motion"); initHeader(null); return; }
  gsap.registerPlugin(ST);
  h.classList.add("m-ready");
  var EASE = "power3.out", EXPO = "expo.out";
  var fontsReady = (d.fonts && d.fonts.ready) ? d.fonts.ready : Promise.resolve();

  /* ---- Lenis: calm, heavy glide ---- */
  var lenis = null;
  if (!reduced && w.Lenis) {
    lenis = w.lenis = new w.Lenis({ lerp: 0.08, smoothWheel: true });
    lenis.on("scroll", ST.update);
    /* first in the tick: the scroll is applied before any tween writes styles, so it never forces a style/layout flush */
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); }, false, true);
    gsap.ticker.lagSmoothing(0);
    d.addEventListener("click", function (e) {
      var a = e.target.closest && e.target.closest('a[href^="#"]');
      if (!a) return;
      var id = a.getAttribute("href"), el = id.length > 1 && d.querySelector(id);
      if (id === "#top" || el) { e.preventDefault(); lenis.scrollTo(id === "#top" ? 0 : el, { duration: 1.8, easing: function (x) { return 1 - Math.pow(1 - x, 4); } }); }
    });
  }

  function onEnter(el, fn) { ST.create({ trigger: el, start: "top 98%", once: true, onEnter: fn }); }
  function delayOf(el) { return (parseFloat(el.style.getPropertyValue("--i")) || 0) * 0.08; }
  function rise(targets, o) {
    o = o || {};
    var x = reduced ? 0 : (o.x || 0);
    return gsap.fromTo(targets, { opacity: 0, x: x, y: reduced || x ? 0 : 40 },
      { opacity: 1, x: 0, y: 0, duration: reduced ? 0.4 : x ? 1.5 : 0.55, ease: x ? "expo.out" : EASE, stagger: o.stagger || 0, delay: o.delay || 0, force3D: true, clearProps: "transform" });
  }

  /* ---- split: words → measured lines → .sl (mask) > .si (moves); restores the original markup afterwards ---- */
  function split(el) {
    var orig = el.innerHTML, words = [];
    (function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var frag = d.createDocumentFragment();
          n.nodeValue.split(/(\s+)/).forEach(function (p) {
            if (!p) return;
            if (/^\s+$/.test(p)) { frag.appendChild(d.createTextNode(" ")); return; }
            var s = d.createElement("span"); s.className = "sw"; s.textContent = p; s.style.display = "inline-block"; frag.appendChild(s); words.push(s);
          });
          n.parentNode.replaceChild(frag, n);
        } else if (n.nodeType === 1) {
          var s = d.createElement("span"); s.className = "sw"; s.style.display = "inline-block";
          n.parentNode.replaceChild(s, n); s.appendChild(n); words.push(s);
        }
      });
    })(el);
    var lines = [], top = null;
    words.forEach(function (s) {
      var t = Math.round(s.offsetTop);
      if (top === null || Math.abs(t - top) > 4) { lines.push([]); top = t; }
      lines[lines.length - 1].push(s);
    });
    el.innerHTML = "";
    var inners = lines.map(function (ws) {
      var sl = d.createElement("span"), si = d.createElement("span");
      sl.className = "sl"; si.className = "si";
      ws.forEach(function (s, i) { if (i) si.appendChild(d.createTextNode(" ")); si.appendChild(s); });
      sl.appendChild(si); el.appendChild(sl); return si;
    });
    /* restore only if the lines are still ours (a language switch may have rewritten the text meanwhile) */
    return { inners: inners, revert: function () { if (el.querySelector(".sl")) el.innerHTML = orig; } };
  }
  function playSplit(el, delay) {
    if (reduced || !el.textContent.trim()) { return rise(el, { delay: delay }); }
    var s = split(el);
    gsap.set(el, { opacity: 1 });
    /* lines swing up from a slight tilt (pivot on the reading-start edge) */
    return gsap.fromTo(s.inners, { yPercent: 115, rotate: rtl() ? -5 : 5, transformOrigin: rtl() ? "100% 0%" : "0% 0%" },
      { yPercent: 0, rotate: 0, duration: 1.4, ease: EXPO, stagger: 0.1, delay: delay || 0, onComplete: s.revert });
  }

  /* ---- hand-drawn script word: SVG text, stroke traced then filled ---- */
  function drawScript(span) {
    if (span._drawn) return; span._drawn = true;
    if (reduced) return;
    var NS = "http://www.w3.org/2000/svg", cs = getComputedStyle(span), fs = parseFloat(cs.fontSize), word = span.textContent;
    var svg = d.createElementNS(NS, "svg"), txt = d.createElementNS(NS, "text");
    svg.setAttribute("aria-hidden", "true"); svg.setAttribute("focusable", "false");
    txt.setAttribute("font-family", cs.fontFamily); txt.setAttribute("font-size", fs); txt.setAttribute("font-weight", cs.fontWeight);
    if (h.dir === "rtl") txt.setAttribute("direction", "rtl");
    txt.textContent = word;
    svg.appendChild(txt); svg.style.width = svg.style.height = "0";
    var sr = d.createElement("span"); sr.className = "sr"; sr.textContent = word;
    span.textContent = ""; span.appendChild(svg); span.appendChild(sr);
    /* tight box: room for the stroke sideways, a little more vertically; negative margins keep the line height */
    var b = txt.getBBox(), p = fs * 0.12, px = fs * 0.04;
    svg.setAttribute("viewBox", [b.x - px, b.y - p, b.width + 2 * px, b.height + 2 * p].join(" "));
    svg.style.width = (b.width + 2 * px) / fs + "em"; svg.style.height = (b.height + 2 * p) / fs + "em";
    svg.style.verticalAlign = -(b.y + b.height + p) / fs + "em";
    svg.style.marginBlock = "-.5em -.2em";
    gsap.set(txt, { strokeWidth: 0 });
    var rt = h.dir === "rtl", vbx = b.x - px, vby = b.y - p, vbw = b.width + 2 * px, vbh = b.height + 2 * p;
    var pen = null;
    try { pen = penPaths(word, cs, fs, rt, vbx, vby, vbw, vbh); } catch (e) { pen = null; }
    if (pen && pen.length) {
      /* the pen: the glyphs' centre lines (skeleton of the rendered word) become thick strokes inside a mask, drawn one after another from the first letter */
      var id = "pen" + (++penN), mk = d.createElementNS(NS, "mask"), g = d.createElementNS(NS, "g"), rest = d.createElementNS(NS, "rect"), defs = d.createElementNS(NS, "defs");
      mk.setAttribute("id", id); mk.setAttribute("maskUnits", "userSpaceOnUse");
      mk.setAttribute("x", vbx); mk.setAttribute("y", vby); mk.setAttribute("width", vbw); mk.setAttribute("height", vbh);
      g.setAttribute("fill", "none"); g.setAttribute("stroke", "#fff"); g.setAttribute("stroke-width", fs * 0.16);
      g.setAttribute("stroke-linecap", "round"); g.setAttribute("stroke-linejoin", "round");
      rest.setAttribute("x", vbx); rest.setAttribute("y", vby); rest.setAttribute("width", vbw); rest.setAttribute("height", vbh);
      rest.setAttribute("fill", "#fff"); rest.setAttribute("opacity", 0);
      mk.appendChild(g); mk.appendChild(rest); defs.appendChild(mk); svg.insertBefore(defs, txt);
      txt.setAttribute("mask", "url(#" + id + ")");
      var segs = pen.map(function (dstr) {
        var pa = d.createElementNS(NS, "path"); pa.setAttribute("d", dstr); g.appendChild(pa);
        var len = Math.max(polyLen(dstr), 0.5);
        pa.setAttribute("stroke-dasharray", len + " " + len); pa.style.strokeDashoffset = len; pa.style.opacity = 0; /* round caps leave dots on hidden dashes: keep each stroke invisible until the pen reaches it */
        return { pa: pa, len: len };
      });
      var tot = segs.reduce(function (a, s) { return a + s.len; }, 0), T = Math.min(3.2, Math.max(1.4, tot / (fs * 5))) / 1.2;
      span._play = function () {
        var tl = gsap.timeline(), at = 0;
        segs.forEach(function (s) {
          var du = T * s.len / tot;
          tl.set(s.pa, { opacity: 1 }, at).fromTo(s.pa, { strokeDashoffset: s.len }, { strokeDashoffset: 0, duration: du, ease: "none" }, at); at += du;
        });
        tl.to(rest, { opacity: 1, duration: 0.35, ease: "power1.out" }, at - 0.1)
          .add(function () { txt.removeAttribute("mask"); });
      };
    } else {
      /* fallback: soft-edged mask sweep, first letter first */
      var soft = 7, wipe = { p: 0 };
      var sweep = function () {
        var a = wipe.p - soft, gr = "linear-gradient(to " + (rt ? "left" : "right") + ", #000 " + a + "%, transparent " + wipe.p + "%)";
        svg.style.webkitMaskImage = svg.style.maskImage = gr;
      };
      sweep();
      span._play = function () {
        gsap.to(wipe, { p: 100 + soft, duration: 2.2, ease: "power1.inOut", onUpdate: sweep, onComplete: function () { svg.style.webkitMaskImage = svg.style.maskImage = "none"; } });
      };
    }
  }

  /* centre lines of a rendered word: draw it on a canvas, thin it (Zhang-Suen), walk the skeleton into strokes ordered in reading direction.
     Returns SVG path strings in the word's SVG coordinates. */
  var penN = 0;
  /* length of a penPaths() string ("M x y" then "L x y"… or a "l.01 0" dot): same as getTotalLength() without forcing SVG layout per path */
  function polyLen(s) {
    if (/l\.01 0$/.test(s)) return 0.01;
    var n = s.match(/-?\d+(?:\.\d+)?/g).map(Number), t = 0;
    for (var k = 2; k < n.length; k += 2) t += Math.sqrt((n[k] - n[k - 2]) * (n[k] - n[k - 2]) + (n[k + 1] - n[k - 1]) * (n[k + 1] - n[k - 1]));
    return t;
  }
  function penPaths(word, cs, fs, rt, vx, vy, vw, vh) {
    var S = 2, W = Math.ceil(vw * S) + 2, H = Math.ceil(vh * S) + 2;
    var cv = d.createElement("canvas"); cv.width = W; cv.height = H;
    var cx = cv.getContext("2d"); cx.fillStyle = "#000";
    cx.font = cs.fontWeight + " " + fs * S + "px " + cs.fontFamily; cx.textBaseline = "alphabetic";
    if (rt) { cx.direction = "rtl"; cx.textAlign = "right"; } else cx.textAlign = "left";
    cx.fillText(word, (0 - vx) * S + 1, (0 - vy) * S + 1);
    var im = cx.getImageData(0, 0, W, H).data, g = new Uint8Array(W * H), i, x, y;
    for (i = 0; i < g.length; i++) g[i] = im[i * 4 + 3] > 127 ? 1 : 0;
    var nb = [-W, -W + 1, 1, W + 1, W, W - 1, -1, -W - 1]; /* N NE E SE S SW W NW */
    /* Zhang-Suen thinning; only foreground pixels are revisited (pixels never come back), no per-pixel arrays: same result, far less work */
    var fg = [], nfg, del = new Int32Array(W * H), nd, P0, P1, P2, P3, P4, P5, P6, P7, B, A;
    for (y = 1; y < H - 1; y++) for (x = 1; x < W - 1; x++) if (g[y * W + x]) fg.push(y * W + x);
    var changed = true, guard = 0;
    while (changed && guard++ < 60) {
      changed = false;
      for (var step = 0; step < 2; step++) {
        nd = 0;
        for (var f = 0; f < fg.length; f++) {
          i = fg[f];
          P0 = g[i - W]; P1 = g[i - W + 1]; P2 = g[i + 1]; P3 = g[i + W + 1]; P4 = g[i + W]; P5 = g[i + W - 1]; P6 = g[i - 1]; P7 = g[i - W - 1];
          B = P0 + P1 + P2 + P3 + P4 + P5 + P6 + P7; if (B < 2 || B > 6) continue;
          A = (!P0 && P1) + (!P1 && P2) + (!P2 && P3) + (!P3 && P4) + (!P4 && P5) + (!P5 && P6) + (!P6 && P7) + (!P7 && P0); if (A !== 1) continue;
          if (step === 0 ? (P0 * P2 * P4 || P2 * P4 * P6) : (P0 * P2 * P6 || P0 * P4 * P6)) continue;
          del[nd++] = i;
        }
        if (nd) {
          changed = true;
          for (var e = 0; e < nd; e++) g[del[e]] = 0;
          nfg = []; for (f = 0; f < fg.length; f++) if (g[fg[f]]) nfg.push(fg[f]); fg = nfg;
        }
      }
    }
    var used = new Uint8Array(W * H), cover = new Uint8Array(W * H), px_ = [], pts = [];
    for (y = 1; y < H - 1; y++) for (x = 1; x < W - 1; x++) if (g[y * W + x]) px_.push(y * W + x);
    var key = function (j) { var xx = j % W; return rt ? -xx : xx; };
    px_.sort(function (a, b) { return key(a) - key(b) || a - b; });
    var dxs = [0, 1, 1, 1, 0, -1, -1, -1], dys = [-1, -1, 0, 1, 1, 1, 0, -1];
    px_.forEach(function (s0) {
      if (used[s0]) return;
      var path = [s0], cur = s0, hx = 0, hy = 0, wasCovered = cover[s0];
      used[s0] = 1;
      for (;;) {
        var best = -1, bs = -9;
        for (var k = 0; k < 8; k++) {
          var c = cur + nb[k]; if (!g[c] || used[c]) continue;
          var sc = path.length < 2 ? (rt ? -dxs[k] : dxs[k]) : (dxs[k] * hx + dys[k] * hy) + (k % 2 ? 0 : 0.2);
          if (sc > bs) { bs = sc; best = c; }
        }
        if (best < 0 || key(best) - key(s0) > fs * S * 0.45) break; /* short runs: letters finish left to right instead of one long baseline pass */
        for (var k2 = 0; k2 < 8; k2++) used[cur + nb[k2]] = g[cur + nb[k2]] ? 1 : used[cur + nb[k2]];
        used[best] = 1; path.push(best);
        var m = path.length, q = path[Math.max(0, m - 6)];
        hx = (best % W) - (q % W); hy = Math.floor(best / W) - Math.floor(q / W);
        var hn = Math.sqrt(hx * hx + hy * hy) || 1; hx /= hn; hy /= hn;
        cur = best;
      }
      if (path.length < 5 && wasCovered) return;
      path.forEach(function (j) {
        var jx = j % W, jy = Math.floor(j / W);
        for (var yy = Math.max(0, jy - 4); yy <= Math.min(H - 1, jy + 4); yy++) for (var xx = Math.max(0, jx - 4); xx <= Math.min(W - 1, jx + 4); xx++) cover[yy * W + xx] = 1;
      });
      pts.push(path.map(function (j) { return [((j % W) - 1 + 0.5) / S + vx, (Math.floor(j / W) - 1 + 0.5) / S + vy]; }));
    });
    return pts.map(function (o) {
      var s = "M" + o[0][0].toFixed(2) + " " + o[0][1].toFixed(2);
      if (o.length === 1 || (o.length === 2 && o[0][0] === o[1][0] && o[0][1] === o[1][1])) return s + "l.01 0";
      for (var k = 1; k < o.length; k += 2) s += "L" + o[k][0].toFixed(2) + " " + o[k][1].toFixed(2);
      var z = o[o.length - 1]; return s + "L" + z[0].toFixed(2) + " " + z[1].toFixed(2);
    });
  }

  /* hero entrance is pure CSS (v7.css) so the headline paints without waiting for scripts */
  var hero = d.querySelector(".hero");

  fontsReady.then(function () {
    /* headlines */
    gsap.utils.toArray("[data-split]").forEach(function (el) {
      if (hero && hero.contains(el)) return;
      onEnter(el, function () { playSplit(el, delayOf(el)); });
    });
    /* hand-drawn words build once their font is in (section eyebrows get the same treatment) */
    gsap.utils.toArray(".sec-label > span").forEach(function (s) { s.classList.add("script"); });
    /* words near the screen are built now; the rest one per idle slot (no long task), and always a screen before they arrive */
    var later = [];
    gsap.utils.toArray(".script").forEach(function (s) {
      if (s.getBoundingClientRect().top < w.innerHeight * 2) drawScript(s);
      else { later.push(s); ST.create({ trigger: s, start: "top bottom+=100%", once: true, onEnter: function () { drawScript(s); } }); }
      onEnter(s, function () { drawScript(s); if (s._play) s._play(); });
    });
    var idle = w.requestIdleCallback || function (f) { return setTimeout(f, 60); };
    (function next() { var s = later.shift(); if (!s) return; idle(function () { drawScript(s); next(); }, { timeout: 1500 }); })();
    ST.refresh();
  });

  /* ---- reveals ---- */
  gsap.utils.toArray("[data-reveal]").forEach(function (el) {
    if (hero && hero.contains(el)) return;
    /* data-reveal="left|right": slide in from that side (mirrored in RTL) */
    var side = el.getAttribute("data-reveal"), dx = side === "left" ? -140 : side === "right" ? 140 : 0;
    if (document.documentElement.dir === "rtl") dx = -dx;
    /* side slides fire together off their parent, with a light stagger, so the tiles move as one */
    if (dx) { ST.create({ trigger: el.parentElement, start: "top 72%", once: true, onEnter: function () { rise(el, { delay: delayOf(el) * 0.5, x: dx }); } }); return; }
    onEnter(el, function () { rise(el, { delay: delayOf(el) }); });
  });
  gsap.utils.toArray("[data-reveal-group]").forEach(function (g) {
    onEnter(g, function () { rise(g.children, { stagger: 0.03 }); });
  });

  if (!reduced) {
    /* ---- parallax: inner image (scale 1.12) drifts ±5% of its height ---- */
    gsap.utils.toArray(".parallax__inner").forEach(function (el) {
      gsap.fromTo(el, { yPercent: -5, scale: 1.12 }, { yPercent: 5, scale: 1.12, ease: "none",
        scrollTrigger: { trigger: el.parentNode, start: "top bottom", end: "bottom top", scrub: true } });
    });
    /* ---- grow: one image expands to full width ---- */
    gsap.utils.toArray(".grow-wrap").forEach(function (wrap) {
      var g = wrap.querySelector(".grow"); if (!g) return;
      gsap.fromTo(g, { scale: w.innerWidth < 768 ? 0.9 : 0.68 }, { scale: 1, ease: "none",
        scrollTrigger: { trigger: wrap, start: "top 60%", end: "top 10%", scrub: 0.3 } });
    });
  }

  /* ---- every other large image frame grows from 82% to full size as it scrolls into view ---- */
  if (!reduced) gsap.utils.toArray(".intro-img, .card-img, .br-img, .media").forEach(function (f) {
    gsap.fromTo(f, { scale: w.innerWidth < 768 ? 0.92 : 0.82, transformOrigin: "50% 100%" }, { scale: 1, ease: "none",
      scrollTrigger: { trigger: f, start: "top 100%", end: "top 85%", scrub: 0.15 } });
  });

  /* ---- find-us map: full-bleed box that starts at the content width and grows to the screen width (desktop) ---- */
  var fm = d.querySelector(".find");
  if (fm && !reduced) gsap.matchMedia().add("(min-width: 768px)", function () {
    fm.classList.add("is-bleed");
    var from = function () { var p = fm.parentNode, cs = getComputedStyle(p); return (p.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight)) / fm.offsetWidth; };
    gsap.fromTo(fm, { scale: from }, { scale: 1, ease: "none",
      scrollTrigger: { trigger: fm, start: "top 85%", end: "top 40%", scrub: 0.3, invalidateOnRefresh: true } });
    return function () { fm.classList.remove("is-bleed"); };
  });

  /* ---- h-section: pinned horizontal row (desktop, motion allowed); rebuilt when the language flips direction ---- */
  var mm = null;
  function setupH() {
    if (mm) mm.revert();
    mm = gsap.matchMedia();
    mm.add("(min-width: 900px) and (prefers-reduced-motion: no-preference)", function () {
      var secs = gsap.utils.toArray(".h-section");
      secs.forEach(function (sec) {
        var track = sec.querySelector(".h-track"), pin = sec.querySelector(".h-pin") || sec;
        if (!track) return;
        sec.classList.add("is-pinned");
        var dist = function () { return Math.max(0, track.scrollWidth - d.documentElement.clientWidth); };
        gsap.to(track, { x: function () { return (rtl() ? 1 : -1) * dist(); }, ease: "none",
          scrollTrigger: { trigger: pin, start: "top top", end: function () { return "+=" + dist(); }, pin: true, scrub: 1, invalidateOnRefresh: true, refreshPriority: 1 } });
      });
      return function () { secs.forEach(function (s) { s.classList.remove("is-pinned"); }); };
    });
  }
  /* pinning turned off at the owner's request: the dish row is a free swipe row (arrows below) */

  /* language switch rewrites text: show anything still waiting */
  d.addEventListener("langchange", function () {
    gsap.set("[data-reveal],[data-reveal-group]>*,[data-split]", { opacity: 1, y: 0 });

    ST.refresh();
  });

  initHeader(lenis);

  /* ---- header: solid past the hero, hidden while scrolling down ---- */
  function initHeader(lenis) {
    var hd = d.getElementById("hd"), hr = d.querySelector(".hero");
    if (!hd) return;
    var last = 0;
    function onScroll() {
      var y = w.scrollY || 0, lim = hr ? hr.offsetHeight - hd.offsetHeight : 80;
      hd.classList.toggle("is-solid", y > lim);
      hd.classList.toggle("is-hidden", y > lim + 200 && y > last && !hd.contains(d.activeElement));
      last = y;
    }
    if (lenis) lenis.on("scroll", onScroll); else w.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }
})();
