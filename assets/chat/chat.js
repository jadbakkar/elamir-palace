/* =========================================================
   El Amir Palace · AI chat widget
   Talks to /api/chat (api/chat.js, Gemini). Loads its own CSS,
   builds the panel only on first open, follows the page
   language (es / en / ar + RTL) and keeps the conversation for
   the browser tab (sessionStorage) so it survives page changes.
   Dish names the AI writes in **bold** become photo cards; an
   order proposal becomes a "Tu pedido" card. Both read the real
   menu (assets/pedir/menu.js), loaded only when needed.
   ========================================================= */
(function () {
  "use strict";
  if (window.__amChat) return; window.__amChat = 1;

  var script = document.currentScript || document.querySelector('script[src*="assets/chat/chat.js"]');
  var base = script ? script.src.replace(/chat\.js(\?.*)?$/, "") : "/assets/chat/";
  var ver = script && /\?v=([^&]+)/.exec(script.src); ver = ver ? "?v=" + ver[1] : "";
  var root = base.replace(/assets\/chat\/$/, ""); // site root (absolute URL)
  var API = "/api/chat";
  var KEY = "amchat:v1", TEASED = "amchat:teased";
  var WA = "https://wa.me/584248060218";
  var html = document.documentElement;

  var T = {
    es: { open: "Abrir el asistente", close: "Cerrar el asistente", k: "El Amir Palace", h: "Asistente", live: "En línea",
      hi: "¡Hola! 👋 Soy el asistente de El Amir Palace. Te ayudo con la carta, precios, horarios y delivery, y si quieres **armo tu pedido** por ti 🛒",
      cartBtn: "Mi carrito", see: "Ver", addBtn: "Agregar al carrito", change: "Cambiar", order: "Tu pedido", total: "Total", done: "Agregado a tu carrito",
      plates: function (n) { return n + (n === 1 ? " plato" : " platos"); },
      added: "Listo ✅ Revisa tu pedido, elige delivery o retiro y envíalo por WhatsApp desde el carrito.",
      addFail: "Uy, no pude guardarlo en el carrito de este navegador. Puedes agregarlo directo en la página de pedidos.",
      ph: "Escribe tu pregunta…", send: "Enviar", busy: "Escribiendo…", reset: "Nueva conversación", wa: "Escríbenos por WhatsApp", addOne: "Agregar",
      want: function (n) { return "Quiero 1 " + n; },
      err: "Uy, no pude responder ahora. Intenta de nuevo o escríbenos por WhatsApp: " + WA,
      slow: "Vas muy rápido 😅 Espera un momento y vuelve a intentar.",
      note: "IA · puede equivocarse · pedidos confirmados por WhatsApp",
      chips: [["🥙", "Recomiéndame algo"], ["📋", "Ver la carta", "menu"], ["🛵", "¿Llegan a mi zona?"], ["🕐", "Horario de hoy"]],
      more: [["📋", "Ver la carta", "menu"], ["🥗", "Algo vegetariano"], ["💬", "WhatsApp", "wa"]],
      tH: "¿Te ayudo a pedir?", tP: "Dime qué se te antoja y lo armo por ti 🥙", tX: "Cerrar", tC: [["Recomiéndame", "Recomiéndame algo"], ["Delivery", "¿Llegan a mi zona?"]] },
    en: { open: "Open the assistant", close: "Close the assistant", k: "El Amir Palace", h: "Assistant", live: "Online",
      hi: "Hi! 👋 I'm the El Amir Palace assistant. I can help with the menu, prices, hours and delivery, and I can **build your order** for you 🛒",
      cartBtn: "My cart", see: "View", addBtn: "Add to cart", change: "Change", order: "Your order", total: "Total", done: "Added to your cart",
      plates: function (n) { return n + (n === 1 ? " dish" : " dishes"); },
      added: "Done ✅ Check your order, choose delivery or pickup and send it on WhatsApp from the cart.",
      addFail: "Sorry, I couldn't save it in this browser's cart. You can add it on the order page.",
      ph: "Type your question…", send: "Send", busy: "Typing…", reset: "New conversation", wa: "Message us on WhatsApp", addOne: "Add",
      want: function (n) { return "I'd like 1 " + n; },
      err: "Sorry, I couldn't answer right now. Please try again or message us on WhatsApp: " + WA,
      slow: "You're going fast 😅 Wait a moment and try again.",
      note: "AI · can make mistakes · orders confirmed on WhatsApp",
      chips: [["🥙", "Recommend me something"], ["📋", "See the menu", "menu"], ["🛵", "Do you deliver to my area?"], ["🕐", "Today's hours"]],
      more: [["📋", "See the menu", "menu"], ["🥗", "Something vegetarian"], ["💬", "WhatsApp", "wa"]],
      tH: "Can I help you order?", tP: "Tell me what you're craving and I'll put it together 🥙", tX: "Close", tC: [["Recommend", "Recommend me something"], ["Delivery", "Do you deliver to my area?"]] },
    ar: { open: "افتح المساعد", close: "أغلق المساعد", k: "قصر الأمير", h: "المساعد", live: "متصل الآن",
      hi: "أهلاً! 👋 أنا مساعد قصر الأمير. أساعدك في القائمة والأسعار ومواعيد العمل والتوصيل، ويمكنني **تجهيز طلبك** لك 🛒",
      cartBtn: "سلتي", see: "عرض", addBtn: "أضف إلى السلة", change: "تعديل", order: "طلبك", total: "المجموع", done: "أُضيف إلى سلتك",
      plates: function (n) { return n + (n === 1 ? " طبق" : " أطباق"); },
      added: "تم ✅ راجع طلبك، اختر التوصيل أو الاستلام وأرسله عبر واتساب من السلة.",
      addFail: "عذراً، لم أتمكن من حفظه في سلة هذا المتصفح. يمكنك إضافته من صفحة الطلبات.",
      ph: "اكتب سؤالك…", send: "إرسال", busy: "يكتب…", reset: "محادثة جديدة", wa: "راسلنا على واتساب", addOne: "أضف",
      want: function (n) { return "أريد 1 " + n; },
      err: "عذراً، لم أتمكن من الرد الآن. حاول مرة أخرى أو راسلنا على واتساب: " + WA,
      slow: "أنت سريع جداً 😅 انتظر لحظة وحاول مرة أخرى.",
      note: "ذكاء اصطناعي · قد يخطئ · تُؤكَّد الطلبات عبر واتساب",
      chips: [["🥙", "اقترح عليّ شيئاً"], ["📋", "عرض القائمة", "menu"], ["🛵", "هل توصلون إلى منطقتي؟"], ["🕐", "مواعيد اليوم"]],
      more: [["📋", "عرض القائمة", "menu"], ["🥗", "شيء نباتي"], ["💬", "واتساب", "wa"]],
      tH: "هل أساعدك في الطلب؟", tP: "أخبرني بما تشتهي وسأجهزه لك 🥙", tX: "إغلاق", tC: [["اقترح", "اقترح عليّ شيئاً"], ["التوصيل", "هل توصلون إلى منطقتي؟"]] }
  };
  function lang() { var l = (html.lang || "es").slice(0, 2); return T[l] ? l : "es"; }
  function t(k) { return T[lang()][k]; }

  var ss = {
    get: function (k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { sessionStorage.setItem(k, v); } catch (e) {} }
  };
  var store = {
    get: function () { try { return JSON.parse(ss.get(KEY)) || []; } catch (e) { return []; } },
    set: function (v) { ss.set(KEY, JSON.stringify(v.slice(-30))); }
  };

  function el(tag, cls, attrs) {
    var n = document.createElement(tag); if (cls) n.className = cls;
    for (var k in attrs || {}) n.setAttribute(k, attrs[k]);
    return n;
  }

  /* ---------- the real menu (the same file the order page uses), loaded on demand ---------- */
  var CART_MARK = "\u001eCART", CART_KEY = "amir-cart-v2";
  var onOrderPage = html.getAttribute("data-i18n-page") === "pedir";
  var slug = function (s) { return String(s).normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/gi, "-").replace(/^-+|-+$/g, "").toLowerCase(); };
  var norm = function (s) { return String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9؀-ۿ]+/g, " ").trim(); };
  var money = function (n) { return "$" + (Math.abs(n - Math.round(n)) < 0.005 ? String(Math.round(n)) : n.toFixed(2)); };
  var MD = null, mdWait = [], mdLoading = false;
  function buildMenu() {
    /* global MENU, PHOTOS */
    if (typeof MENU === "undefined" || !Array.isArray(MENU)) return false;
    var ph = typeof PHOTOS !== "undefined" && PHOTOS ? PHOTOS : {}, I = window.I18N, byId = {}, byName = {};
    MENU.forEach(function (c) {
      (c[2] || []).forEach(function (d) {
        var id = slug(c[0]) + "--" + slug(d[0]);
        if (byId[id]) return;
        byId[id] = { id: id, es: d[0], desc: d[2] || "", cat: c[0], price: d[1], need: !!(d[3] || d[5]), extras: (d[4] && d[4].items) || [], photo: ph[id] || "" };
        if (!byName[norm(d[0])]) byName[norm(d[0])] = id;
        try { var tr = I && I.dish && I.dish(d[0], d[2] || "", c[0]); if (tr && tr.name && !byName[norm(tr.name)]) byName[norm(tr.name)] = id; } catch (e) {}
      });
    });
    MD = { byId: byId, byName: byName };
    return true;
  }
  function withMenu(cb) {
    if (MD || buildMenu()) return cb(MD);
    mdWait.push(cb);
    if (mdLoading) return;
    mdLoading = true;
    var done = function () { mdLoading = false; if (MD || buildMenu()) { var w = mdWait; mdWait = []; w.forEach(function (f) { f(MD); }); } };
    if (onOrderPage) { // the order page loads menu.js itself: never load it twice
      if (document.readyState === "complete") done(); else window.addEventListener("load", done, { once: true });
      return;
    }
    var s = el("script", "", { src: root + "assets/pedir/menu.js" });
    s.onload = s.onerror = done;
    document.head.appendChild(s);
  }
  function dishName(d) {
    if (lang() === "es") return d.es;
    try { var I = window.I18N, r = I && I.dish && I.dish(d.es, d.desc, d.cat); return (r && r.name) || d.es; } catch (e) { return d.es; }
  }
  function photoSrc(p) { return p ? root + (/\.\w+$/.test(p) ? p : p + ".webp") : ""; }
  function keyPrice(k) { // "id|option|extra~extra|note" → unit price (dish + paid extras)
    var p = String(k).split("|"), d = MD && MD.byId[p[0]]; if (!d) return null;
    return d.price + (p[2] ? p[2].split("~") : []).reduce(function (s, n) { var e = d.extras.filter(function (x) { return x[0] === n; })[0]; return s + (e ? e[1] || 0 : 0); }, 0);
  }

  /* the order page's saved cart (pedir.js, "amir-cart-v2": {"dishId|option|extra~extra|note": qty}).
     The assistant's server checks every dish and builds the keys; here they are only merged in. */
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
  var CHECK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5 10 17l9-10"/></svg>';
  function cartBar() { // "My cart · 2 dishes · $62   View →" → order page with the order sheet open
    var a = el("a", "amc-cartbar", { href: onOrderPage ? "#carrito" : (html.getAttribute("data-base") || "") + "pedir.html#carrito" });
    a.innerHTML = BAG + '<span class="amc-cb-t"><b></b><small></small></span><span class="amc-cb-go"></span>';
    a.querySelector("b").textContent = t("cartBtn");
    a.querySelector(".amc-cb-go").textContent = t("see") + (html.dir === "rtl" ? " ←" : " →");
    var sum = function () {
      var c = cart.get(), n = 0, tot = 0, all = true;
      Object.keys(c).forEach(function (k) { var q = c[k] | 0, p = keyPrice(k); n += q; if (p == null) all = false; else tot += p * q; });
      a.querySelector("small").textContent = t("plates")(n) + (all && n ? " · " + money(tot) : "");
    };
    sum(); withMenu(sum);
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

  /* the server's order summary ("Tu pedido:\n• 1 × …\n¿Te lo agrego…?") is shown as a card, not as text */
  var SUMMARY = /\n*^(?:Tu pedido:|Your order:|طلبك:)[ \t]*$[\s\S]*/m;
  function shown(m) { return m.prop ? m.text.replace(SUMMARY, "").trim() : m.text; }
  function orderCard(m) {
    var open = m === pending();
    var box = el("div", "amc-order");
    box.innerHTML = '<div class="amc-oh">' + BAG + '<span></span></div><div class="amc-ol"></div><div class="amc-tot"><span></span><b></b></div><div class="amc-acts"></div>';
    box.querySelector(".amc-oh span").textContent = t("order");
    box.querySelector(".amc-tot span").textContent = t("total");
    var paint = function () {
      var list = box.querySelector(".amc-ol"), tot = 0, all = true;
      list.textContent = "";
      m.prop.forEach(function (x) {
        var id = x.key.split("|")[0], d = MD && MD.byId[id], unit = typeof x.unit === "number" ? x.unit : keyPrice(x.key);
        var row = el("div", "amc-line");
        row.appendChild(d && d.photo ? el("img", "amc-lph", { src: photoSrc(d.photo), alt: "", width: "40", height: "40", loading: "lazy", decoding: "async" }) : el("span", "amc-lph amc-ph0", { "aria-hidden": "true" }));
        var nm = el("span", "amc-lnm"); nm.textContent = d ? dishName(d) : (x.name || id);
        var det = typeof x.detail === "string" ? x.detail : x.key.split("|").slice(1).filter(Boolean).join(", ").replace(/~/g, ", ");
        if (det) { var sm = el("small"); sm.textContent = det; nm.appendChild(sm); }
        var q = el("span", "amc-lq"); q.textContent = x.qty + "×";
        var p = el("span", "amc-lp"); p.textContent = unit != null ? money(unit * x.qty) : "";
        if (unit == null) all = false; else tot += unit * x.qty;
        row.appendChild(nm); row.appendChild(q); row.appendChild(p); list.appendChild(row);
      });
      box.querySelector(".amc-tot").hidden = !all;
      box.querySelector(".amc-tot b").textContent = money(tot);
    };
    paint(); if (!MD) withMenu(paint);
    var acts = box.querySelector(".amc-acts");
    if (m.done) {
      var ok = el("p", "amc-odone"); ok.innerHTML = CHECK; ok.appendChild(document.createTextNode(t("done"))); acts.appendChild(ok);
    } else if (open) {
      var ch = el("button", "amc-btn amc-btn--2", { type: "button" }); ch.textContent = t("change");
      ch.addEventListener("click", function () { input.focus(); });
      var go = el("button", "amc-btn amc-btn--1", { type: "button" }); go.innerHTML = CHECK; go.appendChild(document.createTextNode(t("addBtn")));
      go.addEventListener("click", function () { confirmAdd(m); });
      acts.appendChild(ch); acts.appendChild(go);
    } else acts.remove(); // an old proposal the visitor moved on from
    return box;
  }

  /* dish names in **bold** → a swipeable rail of photo cards right under the reply */
  /* a new reply: follow it down until its first line reaches the top, then stay there
     (the visitor reads from the start; cards and chips wait below, never a forced jump past them) */
  function anchor(node) {
    if (!node || node.parentNode !== log) return;
    log.scrollTop = Math.max(0, Math.min(log.scrollHeight - log.clientHeight, node.offsetTop - 12));
  }
  function dishCards(text, after, live) {
    var names = [], re = /\*\*(.+?)\*\*/g, x;
    while ((x = re.exec(text))) names.push(x[1]);
    if (!names.length) return;
    withMenu(function (M) {
      var seen = {}, list = [];
      names.forEach(function (n) { var id = M.byName[norm(n)]; if (id && !seen[id]) { seen[id] = 1; list.push(M.byId[id]); } });
      if (!list.length || after.parentNode !== log) return;
      var rail = el("div", "amc-cards");
      list.slice(0, 8).forEach(function (d) {
        var c = el("div", "amc-card"), name = dishName(d);
        c.appendChild(d.photo ? el("img", "amc-cph", { src: photoSrc(d.photo), alt: "", loading: "lazy", decoding: "async" }) : el("span", "amc-cph amc-ph0", { "aria-hidden": "true" }));
        var bd = el("div", "amc-cbd"), h = el("p", "amc-cnm"); h.textContent = name;
        var ft = el("div", "amc-cft"), pr = el("span", "amc-cpr"); pr.textContent = money(d.price);
        var add = el("button", "amc-add", { type: "button", "aria-label": t("addOne") + ": " + name });
        add.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>';
        add.addEventListener("click", function () {
          if (busy) return;
          if (d.need) return ask(t("want")(name)); // has choices (protein, extras, sides): the assistant asks them
          if (!cart.apply({ add: [{ key: d.id, qty: 1 }] })) return;
          msgs.push({ role: "user", text: t("want")(name) }, { role: "bot", text: t("added"), cart: 1 }); store.set(msgs); render();
        });
        ft.appendChild(pr); ft.appendChild(add); bd.appendChild(h); bd.appendChild(ft); c.appendChild(bd); rail.appendChild(c);
      });
      var stick = log.scrollHeight - log.scrollTop - log.clientHeight < 60;
      log.insertBefore(rail, after.nextSibling);
      if (live) anchor(after); else if (stick) log.scrollTop = log.scrollHeight;
    });
  }

  var ICON_CHAT ='<svg class="amc-bub" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 12.2c0 4-3.6 7.3-8 7.3-1.1 0-2.2-.2-3.2-.6L4 20l1.3-3.6C4.5 15.2 4 13.8 4 12.2 4 8.2 7.6 5 12 5s8 3.2 8 7.2Z"/><path d="M8.5 12.3h.01M12 12.3h.01M15.5 12.3h.01" stroke-width="2.6"/></svg>';
  var ICON_X = '<svg class="amc-x" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>';
  var ICON_SEND = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15M13 6l6 6-6 6"/></svg>';
  var ICON_RESET = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12a8 8 0 1 0 2.4-5.7M4 4v4h4"/></svg>';
  var ICON_WA = '<svg class="amc-wa" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5a9.4 9.4 0 0 0-8.1 14.2L2.6 21.4l4.8-1.3A9.4 9.4 0 1 0 12 2.5Zm0 17.1a7.7 7.7 0 0 1-3.9-1.1l-.3-.2-2.9.8.8-2.8-.2-.3A7.7 7.7 0 1 1 12 19.6Zm4.3-5.8c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.5.1l-.7.9c-.1.2-.3.2-.5.1a6.3 6.3 0 0 1-3.1-2.7c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.7-1.7c-.2-.4-.4-.4-.5-.4h-.5a.9.9 0 0 0-.7.3 2.8 2.8 0 0 0-.9 2.1 4.9 4.9 0 0 0 1 2.6 11.2 11.2 0 0 0 4.3 3.8c1.6.7 2.2.7 3 .6a2.6 2.6 0 0 0 1.7-1.2 2.1 2.1 0 0 0 .1-1.2c0-.1-.2-.2-.4-.3Z"/></svg>';
  function emblem(cls) { return '<span class="' + cls + '" aria-hidden="true"><img src="' + root + 'img/brand/emblem.svg" alt="" width="34" height="34"></span>'; }

  var fab, panel, log, form, input, sendBtn, chips, teaser, busy = false, msgs = store.get(), lastFocus;

  /* plain text → text nodes, **bold** and safe links (https URLs only) */
  function links(node, text) {
    var re = /(https?:\/\/[^\s<>"')\]*]+)/g, i = 0, m;
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
  function fill(node, text) {
    text = text.replace(/^[ \t]*[*-][ \t]+/gm, "• "); // markdown bullets → •
    text.split(/\*\*(.+?)\*\*/g).forEach(function (p, i) {
      if (i % 2) { var b = el("b"); links(b, p); node.appendChild(b); } else links(node, p.replace(/\*\*/g, ""));
    });
  }

  function bubble(role, text, extra) {
    var b = el("div", "amc-m amc-m--" + role + (extra ? " " + extra : ""));
    fill(b, text); log.appendChild(b); log.scrollTop = log.scrollHeight;
    return b;
  }

  function chipRow(list, cls) {
    var row = el("div", "amc-chips" + (cls ? " " + cls : ""));
    list.forEach(function (c) {
      var n;
      if (c[2]) { // a link: the order page or WhatsApp
        n = el("a", "amc-chip", { href: c[2] === "wa" ? WA : (html.getAttribute("data-base") || "") + "pedir.html" });
        if (c[2] === "wa") { n.target = "_blank"; n.rel = "noopener"; }
        else if (onOrderPage) n.addEventListener("click", function (e) { e.preventDefault(); toggle(false); });
      } else {
        n = el("button", "amc-chip", { type: "button" });
        n.addEventListener("click", function () { ask(c[1]); });
      }
      n.textContent = c[0] + " " + c[1];
      row.appendChild(n);
    });
    return row;
  }

  function render() {
    log.textContent = "";
    bubble("bot", t("hi"));
    msgs.forEach(function (m) {
      var txt = shown(m), x = txt ? bubble(m.role, txt, m.err ? "amc-m--err" : "") : null;
      if (m.prop) log.appendChild(orderCard(m));
      else if (m.role === "bot" && x) dishCards(m.text, x);
      if (m.cart && x) x.appendChild(cartBar());
    });
    chips = null;
    var last = msgs[msgs.length - 1];
    if (!last) chips = chipRow(t("chips"));
    else if (last.role === "bot" && !last.prop) chips = chipRow(t("more"), "amc-chips--more");
    if (chips) log.appendChild(chips);
    log.scrollTop = log.scrollHeight;
  }

  function texts() {
    panel.setAttribute("aria-label", t("k") + " · " + t("h"));
    panel.querySelector(".amc-hd-k").textContent = t("k");
    panel.querySelector(".amc-hd-h").textContent = t("h");
    panel.querySelector(".amc-hd-s span").textContent = t("live");
    panel.querySelector(".amc-close").setAttribute("aria-label", t("close"));
    [[".amc-reset", "reset"], [".amc-wab", "wa"]].forEach(function (p) { var n = panel.querySelector(p[0]); n.setAttribute("aria-label", t(p[1])); n.title = t(p[1]); });
    panel.querySelector(".amc-note").textContent = t("note");
    input.placeholder = t("ph"); input.setAttribute("aria-label", t("ph"));
    sendBtn.setAttribute("aria-label", t("send"));
  }

  function build() {
    panel = el("div", "amc-panel", { id: "amc-panel", role: "dialog", hidden: "" });
    panel.innerHTML =
      '<div class="amc-hd"><span class="amc-grab" aria-hidden="true"></span>' + emblem("amc-av") +
      '<div class="amc-hd-t"><p class="amc-hd-k"></p><p class="amc-hd-h"></p><p class="amc-hd-s"><i aria-hidden="true"></i><span></span></p></div>' +
      '<button type="button" class="amc-ib amc-reset">' + ICON_RESET + '</button>' +
      '<a class="amc-ib amc-wab" href="' + WA + '" target="_blank" rel="noopener">' + ICON_WA + '</a>' +
      '<button type="button" class="amc-ib amc-close"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></button></div>' +
      '<div class="amc-log" aria-live="polite" data-lenis-prevent></div>' +
      '<form class="amc-f" autocomplete="off"><input class="amc-in" name="q" type="text" maxlength="600" enterkeyhint="send">' +
      '<button type="submit" class="amc-send">' + ICON_SEND + '</button></form><p class="amc-note"></p>';
    document.body.appendChild(panel);
    log = panel.querySelector(".amc-log"); form = panel.querySelector(".amc-f");
    input = panel.querySelector(".amc-in"); sendBtn = panel.querySelector(".amc-send");
    panel.querySelector(".amc-close").addEventListener("click", function () { toggle(false); });
    panel.querySelector(".amc-reset").addEventListener("click", function () {
      if (busy) return;
      msgs = []; store.set(msgs); render();
      if (window.matchMedia("(min-width:768px)").matches) input.focus({ preventScroll: true });
    });
    form.addEventListener("submit", function (e) { e.preventDefault(); ask(input.value); });
    panel.addEventListener("keydown", function (e) { if (e.key === "Escape") toggle(false); });
    swipe(panel.querySelector(".amc-hd"));
  }

  /* phones: drag the header down to close the sheet */
  function swipe(hd) {
    var y0 = null, dy = 0;
    hd.addEventListener("touchstart", function (e) {
      if (window.matchMedia("(min-width:768px)").matches || e.target.closest("button,a")) return;
      y0 = e.touches[0].clientY; dy = 0; panel.style.transition = "none"; panel.style.animation = "none";
    }, { passive: true });
    hd.addEventListener("touchmove", function (e) {
      if (y0 == null) return;
      dy = Math.max(0, e.touches[0].clientY - y0);
      panel.style.transform = "translateY(" + dy + "px)";
    }, { passive: true });
    var end = function () {
      if (y0 == null) return;
      y0 = null; panel.style.transition = "transform .24s cubic-bezier(.23,1,.32,1)";
      if (dy > 90) { panel.style.transform = "translateY(100%)"; setTimeout(function () { toggle(false, true); }, 220); }
      else { panel.style.transform = ""; setTimeout(function () { panel.style.transition = ""; }, 260); } // (animation stays off until the next open, or it would replay)
    };
    hd.addEventListener("touchend", end); hd.addEventListener("touchcancel", end);
  }

  function toggle(open, swiped) {
    if (!panel) build();
    if (open === (panel.hidden === false && !panel.classList.contains("amc-out"))) return;
    hideTeaser();
    fab.setAttribute("aria-expanded", String(open));
    fab.setAttribute("aria-label", t(open ? "close" : "open"));
    html.classList.toggle("amc-open", open);
    if (open) {
      ss.set(TEASED, "1");
      lastFocus = document.activeElement;
      panel.style.transform = panel.style.transition = panel.style.animation = "";
      texts(); render();
      panel.classList.remove("amc-out"); panel.hidden = false;
      log.scrollTop = log.scrollHeight;
      if (window.matchMedia("(min-width:768px)").matches) input.focus({ preventScroll: true });
      else panel.querySelector(".amc-close").focus({ preventScroll: true });
    } else {
      var done = function () {
        if (!swiped && !panel.classList.contains("amc-out")) return;
        panel.hidden = true; panel.classList.remove("amc-out");
        panel.style.transform = panel.style.transition = panel.style.animation = "";
      };
      if (swiped) done();
      else { panel.classList.add("amc-out"); panel.addEventListener("animationend", done, { once: true }); setTimeout(done, 260); } // timeout: reduced motion / no animation
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
    if (p) render(); // the open proposal loses its buttons once the visitor says something else
    var history = msgs.slice(-10);
    msgs.push({ role: "user", text: q }); store.set(msgs); bubble("user", q);
    var wait = el("div", "amc-m amc-m--bot", { "aria-label": t("busy") });
    wait.innerHTML = '<span class="amc-dots" aria-hidden="true"><i></i><i></i><i></i></span>';
    log.appendChild(wait); log.scrollTop = log.scrollHeight;

    var raw = "", text = "", b = null;
    function show(more) { // the reply types itself out as it streams in (a cart action after CART_MARK is never shown)
      raw += more; text = raw.split(CART_MARK)[0];
      var vis = text.replace(SUMMARY, "").trim();
      if (!vis) return; // only the order summary so far: it becomes a card at the end
      if (!b) { wait.remove(); b = bubble("bot", ""); }
      b.textContent = ""; fill(b, vis);
      anchor(b);
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
        wait.remove();
        var act = null, i = raw.indexOf(CART_MARK);
        if (i >= 0) { try { act = JSON.parse(raw.slice(i + CART_MARK.length)); } catch (e) { /* ignore */ } }
        if (act && act.remove && act.remove.length) cart.apply({ remove: act.remove }); // "quítale…": done straight away
        if (text) {
          var m = { role: "bot", text: text.trim() };
          if (act && act.add && act.add.length) m.prop = act.add;  // proposal: waits for the visitor's yes
          msgs.push(m); store.set(msgs);
          var card = m.prop ? log.appendChild(orderCard(m)) : null;
          if (!m.prop) {
            if (b) dishCards(m.text, b, true);
            chips = chipRow(t("more"), "amc-chips--more"); log.appendChild(chips);
          }
          anchor(b || card);
        } else log.scrollTop = log.scrollHeight; // the error message
        busy = false; sendBtn.disabled = false;
        if (window.matchMedia("(min-width:768px)").matches) input.focus({ preventScroll: true });
      });
  }

  /* ---------- teaser bubble above the button: once per visit, after a few seconds ---------- */
  function hideTeaser() {
    if (!teaser) return;
    var n = teaser; teaser = null;
    n.classList.add("amc-teaser--out");
    setTimeout(function () { n.remove(); }, 220); // never left in the page
  }
  function showTeaser() {
    if (teaser || ss.get(TEASED) || msgs.length || html.classList.contains("amc-open")) return;
    ss.set(TEASED, "1");
    teaser = el("div", "amc-teaser", { role: "status" });
    teaser.innerHTML = '<button type="button" class="amc-tx"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></button>' +
      emblem("amc-av amc-av--s") + '<div class="amc-tb"><button type="button" class="amc-tm"><b></b><span></span></button><div class="amc-tc"></div></div>';
    teaser.querySelector(".amc-tx").setAttribute("aria-label", t("tX"));
    teaser.querySelector(".amc-tm b").textContent = t("tH");
    teaser.querySelector(".amc-tm span").textContent = t("tP");
    teaser.querySelector(".amc-tx").addEventListener("click", hideTeaser);
    teaser.querySelector(".amc-tm").addEventListener("click", function () { toggle(true); });
    t("tC").forEach(function (c) {
      var b = el("button", "amc-chip", { type: "button" }); b.textContent = c[0];
      b.addEventListener("click", function () { toggle(true); ask(c[1]); });
      teaser.querySelector(".amc-tc").appendChild(b);
    });
    document.body.appendChild(teaser);
    setTimeout(hideTeaser, 20000);
  }

  function init() {
    var css = el("link", "", { rel: "stylesheet", href: base + "chat.css" + ver });
    css.onload = function () {
      fab = el("button", "amc-fab amc-fab-in", { type: "button", "aria-controls": "amc-panel", "aria-expanded": "false", "aria-label": t("open") });
      fab.innerHTML = ICON_CHAT + ICON_X + '<span class="amc-live" aria-hidden="true"></span>';
      fab.addEventListener("click", function () { toggle(fab.getAttribute("aria-expanded") !== "true"); });
      document.body.appendChild(fab);
      setTimeout(showTeaser, 8000);
      // page language switch (ES / EN / ع) → relabel
      new MutationObserver(function () {
        fab.setAttribute("aria-label", t(fab.getAttribute("aria-expanded") === "true" ? "close" : "open"));
        hideTeaser();
        if (MD) { MD = null; buildMenu(); } // translated dish names for the new language
        if (panel && !panel.hidden) { texts(); render(); }
      }).observe(html, { attributes: true, attributeFilter: ["lang"] });
    };
    document.head.appendChild(css);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
