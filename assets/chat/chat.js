/* =========================================================
   El Amir Palace · AI chat widget
   Talks to /api/chat (api/chat.js, Gemini). Loads its own CSS,
   builds the panel only on first open, follows the page
   language (es / en / ar + RTL) and keeps the conversation for
   the browser tab (sessionStorage) so it survives page changes.
   ========================================================= */
(function () {
  "use strict";
  if (window.__amChat) return; window.__amChat = 1;

  var script = document.currentScript || document.querySelector('script[src*="assets/chat/chat.js"]');
  var base = script ? script.src.replace(/chat\.js(\?.*)?$/, "") : "/assets/chat/";
  var ver = script && /\?v=([^&]+)/.exec(script.src); ver = ver ? "?v=" + ver[1] : "";
  var API = "/api/chat";
  var KEY = "amchat:v1";
  var html = document.documentElement;

  var T = {
    es: { open: "Abrir el asistente", close: "Cerrar el asistente", k: "El Amir Palace", h: "¿En qué te ayudamos?",
      hi: "¡Hola! 👋 Soy el asistente de El Amir Palace. Pregúntame por la carta, precios, horarios o delivery, o dime qué quieres pedir y te lo agrego al carrito 🛒",
      cartBtn: "Ver mi carrito", addBtn: "Agregar al carrito",
      added: "Listo ✅ Lo agregué a tu carrito. Revisa tu pedido, elige delivery o retiro y envíalo por WhatsApp desde el carrito.",
      addFail: "Uy, no pude guardarlo en el carrito de este navegador. Puedes agregarlo directo en la página de pedidos.",
      ph: "Escribe tu pregunta…", send: "Enviar", busy: "Escribiendo…",
      err: "Uy, no pude responder ahora. Intenta de nuevo o escríbenos por WhatsApp: https://wa.me/584248060218",
      slow: "Vas muy rápido 😅 Espera un momento y vuelve a intentar.",
      note: "Asistente con IA: puede equivocarse. Los pedidos se confirman por WhatsApp.",
      chips: ["¿Qué me recomiendan para compartir?", "¿Hacen delivery a mi zona?", "¿Cuál es el horario?"] },
    en: { open: "Open the assistant", close: "Close the assistant", k: "El Amir Palace", h: "How can we help?",
      hi: "Hi! 👋 I'm the El Amir Palace assistant. Ask me about the menu, prices, hours or delivery, or tell me what you want and I'll add it to your cart 🛒",
      cartBtn: "See my cart", addBtn: "Add to cart",
      added: "Done ✅ It's in your cart. Check your order, choose delivery or pickup and send it on WhatsApp from the cart.",
      addFail: "Sorry, I couldn't save it in this browser's cart. You can add it on the order page.",
      ph: "Type your question…", send: "Send", busy: "Typing…",
      err: "Sorry, I couldn't answer right now. Please try again or message us on WhatsApp: https://wa.me/584248060218",
      slow: "You're going fast 😅 Wait a moment and try again.",
      note: "AI assistant: it can make mistakes. Orders are confirmed on WhatsApp.",
      chips: ["What do you recommend to share?", "Do you deliver to my area?", "What are your opening hours?"] },
    ar: { open: "افتح المساعد", close: "أغلق المساعد", k: "قصر الأمير", h: "كيف يمكننا مساعدتك؟",
      hi: "أهلاً! 👋 أنا مساعد قصر الأمير. اسألني عن القائمة والأسعار ومواعيد العمل والتوصيل، أو أخبرني بما تريد وسأضيفه إلى سلتك 🛒",
      cartBtn: "عرض سلتي", addBtn: "أضف إلى السلة",
      added: "تم ✅ أضفته إلى سلتك. راجع طلبك، اختر التوصيل أو الاستلام وأرسله عبر واتساب من السلة.",
      addFail: "عذراً، لم أتمكن من حفظه في سلة هذا المتصفح. يمكنك إضافته من صفحة الطلبات.",
      ph: "اكتب سؤالك…", send: "إرسال", busy: "يكتب…",
      err: "عذراً، لم أتمكن من الرد الآن. حاول مرة أخرى أو راسلنا على واتساب: https://wa.me/584248060218",
      slow: "أنت سريع جداً 😅 انتظر لحظة وحاول مرة أخرى.",
      note: "مساعد بالذكاء الاصطناعي وقد يخطئ. تُؤكَّد الطلبات عبر واتساب.",
      chips: ["ماذا تنصحون للمشاركة؟", "هل توصلون إلى منطقتي؟", "ما هي مواعيد العمل؟"] }
  };
  function lang() { var l = (html.lang || "es").slice(0, 2); return T[l] ? l : "es"; }
  function t(k) { return T[lang()][k]; }

  var store = {
    get: function () { try { return JSON.parse(sessionStorage.getItem(KEY)) || []; } catch (e) { return []; } },
    set: function (v) { try { sessionStorage.setItem(KEY, JSON.stringify(v.slice(-30))); } catch (e) {} }
  };

  /* the order page's saved cart (pedir.js, "amir-cart-v2": {"dishId|option|extra~extra|note": qty}).
     The assistant's server checks every dish and builds the keys; here they are only merged in. */
  var CART_MARK = "\u001eCART", CART_KEY = "amir-cart-v2";
  var onOrderPage = html.getAttribute("data-i18n-page") === "pedir";
  var cart = {
    get: function () { try { var c = JSON.parse(localStorage.getItem(CART_KEY)); return c && typeof c === "object" ? c : {}; } catch (e) { return {}; } },
    apply: function (a) {
      var c = cart.get(), changed = false;
      (a.remove || []).forEach(function (id) { Object.keys(c).forEach(function (k) { if (k.split("|")[0] === id) { delete c[k]; changed = true; } }); });
      (a.add || []).forEach(function (x) {
        if (!x || typeof x.key !== "string" || !(x.qty > 0)) return;
        c[x.key] = Math.min(99, (c[x.key] || 0) + Math.floor(x.qty)); changed = true;
      });
      if (!changed) return false;
      try { localStorage.setItem(CART_KEY, JSON.stringify(c)); } catch (e) { return false; }
      document.dispatchEvent(new Event("amir-cart-external")); // pedir.js reloads its cart
      document.dispatchEvent(new Event("amir-cart"));          // cart badges
      return (a.add || []).length > 0;
    }
  };
  var BAG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 7h14l-1.5 12h-11Z"/><path d="M9 7V5.5a3 3 0 0 1 6 0V7"/></svg>';
  function cartBtn() { // "see my cart" → order page with the order sheet open
    var a = el("a", "amc-cart", { href: onOrderPage ? "#carrito" : (html.getAttribute("data-base") || "") + "pedir.html#carrito" });
    a.innerHTML = BAG; a.appendChild(document.createTextNode(t("cartBtn")));
    if (onOrderPage) a.addEventListener("click", function () { toggle(false); });
    return a;
  }
  /* The assistant only PROPOSES an order: the cart changes when the visitor taps "add to cart"
     or answers yes. So nothing is ever added twice, whatever the AI does. */
  var AFFIRM = /^(s[ií]+|si+p?|dale|ok(ay|a)?|okey|listo|claro|de una|agr[eé]ga(lo|los)?|yes+|yep|sure|go ahead|add it|نعم|اي|أيوه|موافق|تمام)[\s!.¡👍🙌]*$/i;
  function pending() { // only the assistant's LAST message can be confirmed: a "sí" later in the chat never adds an old proposal
    for (var i = msgs.length - 1; i >= 0; i--) { if (msgs[i].role === "bot") return msgs[i].prop && !msgs[i].done ? msgs[i] : null; }
    return null;
  }
  function confirmAdd(m) {
    if (!m || m.done) return;
    m.done = 1;
    var ok = cart.apply({ add: m.prop });
    var reply = { role: "bot", text: t(ok ? "added" : "addFail") };
    if (ok) reply.cart = 1;
    msgs.push(reply); store.set(msgs); render();
  }
  function addBtn(m) {
    var b = el("button", "amc-cart", { type: "button" });
    b.innerHTML = BAG; b.appendChild(document.createTextNode(t("addBtn")));
    b.addEventListener("click", function () { confirmAdd(m); });
    return b;
  }

  var ICON_CHAT ='<svg class="amc-bub" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 12.2c0 4-3.6 7.3-8 7.3-1.1 0-2.2-.2-3.2-.6L4 20l1.3-3.6C4.5 15.2 4 13.8 4 12.2 4 8.2 7.6 5 12 5s8 3.2 8 7.2Z"/><path d="M8.5 12.3h.01M12 12.3h.01M15.5 12.3h.01" stroke-width="2.6"/></svg>';
  var ICON_X = '<svg class="amc-x" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>';
  var ICON_SEND = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15M13 6l6 6-6 6"/></svg>';

  var fab, panel, log, form, input, sendBtn, chips, busy = false, msgs = store.get(), lastFocus;

  function el(tag, cls, attrs) {
    var n = document.createElement(tag); if (cls) n.className = cls;
    for (var k in attrs || {}) n.setAttribute(k, attrs[k]);
    return n;
  }

  /* plain text → text nodes + safe links (https URLs only) */
  function fill(node, text) {
    var re = /(https?:\/\/[^\s<>"')\]]+)/g, i = 0, m;
    while ((m = re.exec(text))) {
      var url = m[1].replace(/[.,;:!?]+$/, "");
      node.appendChild(document.createTextNode(text.slice(i, m.index)));
      var a = el("a", "", { href: url, dir: "ltr" });
      if (!/^https?:\/\/(www\.)?elamirpalace\.(com|online)/.test(url)) { a.target = "_blank"; a.rel = "noopener"; }
      a.textContent = /google\.[a-z.]+\/maps/.test(url) ? "📍 Google Maps" : url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
      node.appendChild(a);
      i = m.index + url.length; re.lastIndex = i;
    }
    node.appendChild(document.createTextNode(text.slice(i)));
  }

  function bubble(role, text, extra) {
    var b = el("div", "amc-m amc-m--" + role + (extra ? " " + extra : ""));
    fill(b, text); log.appendChild(b); log.scrollTop = log.scrollHeight;
    return b;
  }

  function render() {
    log.textContent = "";
    bubble("bot", t("hi"));
    var open = pending();
    msgs.forEach(function (m) {
      var x = bubble(m.role, m.text);
      if (m.cart) x.appendChild(cartBtn());
      else if (m === open) x.appendChild(addBtn(m));
    });
    chips = null;
    if (!msgs.length) {
      chips = el("div", "amc-chips");
      t("chips").forEach(function (q) {
        var c = el("button", "amc-chip", { type: "button" }); c.textContent = q;
        c.addEventListener("click", function () { ask(q); });
        chips.appendChild(c);
      });
      log.appendChild(chips);
    }
  }

  function texts() {
    panel.setAttribute("aria-label", t("h"));
    panel.querySelector(".amc-hd-k").textContent = t("k");
    panel.querySelector(".amc-hd-h").textContent = t("h");
    panel.querySelector(".amc-close").setAttribute("aria-label", t("close"));
    panel.querySelector(".amc-note").textContent = t("note");
    input.placeholder = t("ph"); input.setAttribute("aria-label", t("ph"));
    sendBtn.setAttribute("aria-label", t("send"));
  }

  function build() {
    panel = el("div", "amc-panel", { id: "amc-panel", role: "dialog", hidden: "" });
    panel.innerHTML =
      '<div class="amc-hd"><span class="amc-av" aria-hidden="true">A</span>' +
      '<div class="amc-hd-t"><p class="amc-hd-k"></p><p class="amc-hd-h"></p></div>' +
      '<button type="button" class="amc-close"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></button></div>' +
      '<div class="amc-log" aria-live="polite" data-lenis-prevent></div>' +
      '<form class="amc-f" autocomplete="off"><input class="amc-in" name="q" type="text" maxlength="600" enterkeyhint="send">' +
      '<button type="submit" class="amc-send">' + ICON_SEND + '</button></form><p class="amc-note"></p>';
    document.body.appendChild(panel);
    log = panel.querySelector(".amc-log"); form = panel.querySelector(".amc-f");
    input = panel.querySelector(".amc-in"); sendBtn = panel.querySelector(".amc-send");
    panel.querySelector(".amc-close").addEventListener("click", function () { toggle(false); });
    form.addEventListener("submit", function (e) { e.preventDefault(); ask(input.value); });
    panel.addEventListener("keydown", function (e) { if (e.key === "Escape") toggle(false); });
  }

  function toggle(open) {
    if (!panel) build();
    if (open === (panel.hidden === false && !panel.classList.contains("amc-out"))) return;
    fab.setAttribute("aria-expanded", String(open));
    fab.setAttribute("aria-label", t(open ? "close" : "open"));
    html.classList.toggle("amc-open", open);
    if (open) {
      lastFocus = document.activeElement;
      texts(); render();
      panel.classList.remove("amc-out"); panel.hidden = false;
      log.scrollTop = log.scrollHeight;
      if (window.matchMedia("(min-width:768px)").matches) input.focus({ preventScroll: true });
      else panel.querySelector(".amc-close").focus({ preventScroll: true });
    } else {
      panel.classList.add("amc-out");
      var done = function () { if (panel.classList.contains("amc-out")) { panel.hidden = true; panel.classList.remove("amc-out"); } };
      panel.addEventListener("animationend", done, { once: true });
      setTimeout(done, 260); // reduced motion / no animation
      if (lastFocus && lastFocus !== document.body && document.contains(lastFocus)) lastFocus.focus({ preventScroll: true }); else fab.focus({ preventScroll: true });
    }
  }

  function ask(q) {
    q = String(q || "").trim();
    if (!q || busy) return;
    var p = pending();
    if (p && AFFIRM.test(q)) { // "sí" / "dale" to an order proposal: add it here, no AI needed
      input.value = ""; msgs.push({ role: "user", text: q }); confirmAdd(p); return;
    }
    busy = true; sendBtn.disabled = true; input.value = "";
    if (chips) { chips.remove(); chips = null; }
    var history = msgs.slice(-10);
    msgs.push({ role: "user", text: q }); store.set(msgs); bubble("user", q);
    var wait = el("div", "amc-m amc-m--bot", { "aria-label": t("busy") });
    wait.innerHTML = '<span class="amc-dots" aria-hidden="true"><i></i><i></i><i></i></span>';
    log.appendChild(wait); log.scrollTop = log.scrollHeight;

    var raw = "", text = "", b = null;
    function show(more) { // the reply types itself out as it streams in (a cart action after CART_MARK is never shown)
      raw += more; text = raw.split(CART_MARK)[0];
      if (!b) { wait.remove(); b = bubble("bot", ""); }
      var stick = log.scrollHeight - log.scrollTop - log.clientHeight < 40;
      b.textContent = ""; fill(b, text);
      if (stick) log.scrollTop = log.scrollHeight;
    }
    function fail(status) { wait.remove(); if (!text) bubble("bot", t(status === 429 ? "slow" : "err"), "amc-m--err"); }

    fetch(API, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: q, history: history, lang: lang(), cart: cart.get() }) })
      .then(function (r) {
        var json = /json/.test(r.headers.get("content-type") || "");
        if (!r.ok || json) return r.json().catch(function () { return {}; }).then(function (d) { if (d.reply) show(d.reply); else fail(r.status); });
        if (!r.body || !r.body.getReader) return r.text().then(function (s) { if (s) show(s); else fail(); });
        var reader = r.body.getReader(), dec = new TextDecoder();
        return (function pump() {
          return reader.read().then(function (c) {
            if (c.done) { var tail = dec.decode(); if (tail) show(tail); if (!text) fail(); return; }
            var s = dec.decode(c.value, { stream: true }); if (s) show(s);
            return pump();
          });
        })();
      })
      .catch(function () { fail(); })
      .then(function () {
        var act = null, i = raw.indexOf(CART_MARK);
        if (i >= 0) { try { act = JSON.parse(raw.slice(i + CART_MARK.length)); } catch (e) { /* ignore */ } }
        if (act && act.remove && act.remove.length) cart.apply({ remove: act.remove }); // "quítale…": done straight away
        if (text) {
          var m = { role: "bot", text: text.trim() };
          if (act && act.add && act.add.length) m.prop = act.add;  // proposal: waits for the visitor's yes
          msgs.push(m); store.set(msgs);
          if (m.prop && b) { b.appendChild(addBtn(m)); log.scrollTop = log.scrollHeight; }
        }
        busy = false; sendBtn.disabled = false;
        if (window.matchMedia("(min-width:768px)").matches) input.focus({ preventScroll: true });
      });
  }

  function init() {
    var css = el("link", "", { rel: "stylesheet", href: base + "chat.css" + ver });
    css.onload = function () {
      fab = el("button", "amc-fab amc-fab-in", { type: "button", "aria-controls": "amc-panel", "aria-expanded": "false", "aria-label": t("open") });
      fab.innerHTML = ICON_CHAT + ICON_X;
      fab.addEventListener("click", function () { toggle(fab.getAttribute("aria-expanded") !== "true"); });
      document.body.appendChild(fab);
      // page language switch (ES / EN / ع) → relabel
      new MutationObserver(function () {
        fab.setAttribute("aria-label", t(fab.getAttribute("aria-expanded") === "true" ? "close" : "open"));
        if (panel && !panel.hidden) { texts(); render(); }
      }).observe(html, { attributes: true, attributeFilter: ["lang"] });
    };
    document.head.appendChild(css);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
