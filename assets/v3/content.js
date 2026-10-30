/* =====================================================================
   El Amir Palace · editable homepage content
   Used in the browser by assets/v3/site.js AND at build time by
   scripts/prerender.js (re-run `node scripts/prerender.js` after editing).
   ===================================================================== */
(function (w) {
  "use strict";

  /* ---------------------------------------------------------------
     1. MAP — TODO(owner): exact coordinates of each branch.
        In Google Maps: right-click the pin → click the numbers to copy.
        Leave null to search Google Maps by name ("El Amir Palace <branch>, Anzoátegui").
        Optional overrides without touching this file (config.js), first match wins:
          sucursales: [{ id: "lecheria", …, lat: 10.18512, lng: -64.69071 }, …]
          mapa: { lecheria: { lat, lng }, plc: { lat, lng } }   or   mapa: { lat, lng }  (= Lechería)
        Branch ids/names/phones come from CONFIG.sucursales.
     --------------------------------------------------------------- */
  var MAP = {
    zoom: 16,
    branches: {
      lecheria: { lat: 10.196197, lng: -64.691991 },
      plc:      { lat: 10.220758, lng: -64.639242 }
    }
  };

  /* ---------------------------------------------------------------
     2. REVIEWS
        TODO: replace with real Google reviews before launch, then set
        REVIEWS_ARE_PLACEHOLDER = false.
        While it is true:
          - a small "Reseñas de ejemplo" label is shown in the section, and
          - NO Review / AggregateRating structured data is emitted
            (fake review markup breaks Google's policies).
        Format: first name + initial, rating 1-5, "Google" | "Instagram", optional photo: "img/reviews/name.webp" (48×48+; else the initial is shown),
        ISO date, the review text in the language it was written,
        plus tr: { es, en, ar } translations for the other site languages (shown when the visitor switches language).
     --------------------------------------------------------------- */
  var REVIEWS_ARE_PLACEHOLDER = false; /* owner confirmed these reviews are real (2026-10-17) */
  var REVIEWS = [
    { name: "Antonella L.", rating: 5, source: "Google", date: "2026-09-15", lang: "es",
      text: "Este lugar es increíble, la comida es deliciosa. La atención es excelente, igual que la comida. ¡Muy recomendado!",
      tr: { en: "This place is amazing, the food is delicious. The service is excellent, just like the food. Highly recommended!", ar: "هذا المكان رائع والطعام لذيذ. الخدمة ممتازة مثل الطعام تماماً. أنصح به بشدة!" } },
    { name: "Maria S.", rating: 5, source: "Google", date: "2026-06-15", lang: "es",
      text: "El shawarma lo preparan al momento y el mío estaba delicioso. El mesero que nos atendió fue excelente.",
      tr: { en: "The shawarma was made to order and mine was delicious. The waiter who served us was excellent.", ar: "الشاورما تُحضَّر عند الطلب وكانت شاورمتي لذيذة. والنادل الذي خدمنا كان ممتازاً." } },
    { name: "Greliz F.", rating: 5, source: "Google", date: "2025-10-15", lang: "es",
      text: "La comida estaba DELICIOSA. Ya habíamos probado el shawarma, pero esta vez pedimos la parrilla mar y tierra y las porciones eran ENORMES. Y venden el mejor jugo de fresa de la ciudad 😍",
      tr: { en: "The food was DELICIOUS. We’d had the shawarma before, but this time we ordered the surf and turf grill and the portions were HUGE. And they sell the best strawberry juice in town 😍", ar: "كان الطعام لذيذاً جداً. جرّبنا الشاورما من قبل، لكننا هذه المرة طلبنا مشاوي البر والبحر وكانت الحصص ضخمة. ويقدمون أفضل عصير فراولة في المدينة 😍" } },
    { name: "Silvia N.", rating: 5, source: "Google", date: "2025-10-15", lang: "es",
      text: "¡¡Sensacional!! La mejor kibbe que he comido, y eso que en Río tienen una maravillosa. Todo perfecto, la atención, la comida… ¡Ya volví varias veces!",
      tr: { en: "Sensational!! The best kibbeh I’ve ever eaten, and they have a wonderful one in Rio. Everything was perfect, the service, the food… I’ve already been back several times!", ar: "رائع جداً!! أفضل كبة أكلتها في حياتي، مع أن في ريو كبة رائعة. كل شيء كان مثالياً، الخدمة والطعام… وقد عدت عدة مرات!" } },
    { name: "Paolita R.", rating: 5, source: "Google", date: "2025-10-15", lang: "es",
      text: "El ambiente es genial y la atención excelente. Los precios, fantásticos. El mejor shawarma que he probado en Lechería ✨ una experiencia memorable.",
      tr: { en: "The atmosphere is great and the service is excellent. The prices are fantastic. The best shawarma I’ve had in Lechería ✨ a truly memorable experience.", ar: "الأجواء رائعة والخدمة ممتازة. والأسعار ممتازة. أفضل شاورما جرّبتها في ليتشيريا ✨ تجربة لا تُنسى." } },
    { name: "Franklin M.", rating: 5, source: "Google", date: "2025-10-15", lang: "es",
      text: "¡Sin duda el mejor lugar de comida árabe! Las especialidades de la casa y el shawarma mixto son una explosión de sabor. Ambiente fresco y limpio, y la terraza es espectacular.",
      tr: { en: "Without a doubt the best place for Arabic food! The house specialties and the mixed shawarma are an explosion of flavour. Fresh, clean atmosphere, and the terrace is spectacular.", ar: "بلا شك أفضل مكان للأكل العربي! أطباق البيت والشاورما المشكّلة انفجار من النكهات. أجواء منعشة ونظيفة، والتراس رائع." } }
  ];

  /* ---------------------------------------------------------------
     helpers (no need to edit)
     --------------------------------------------------------------- */
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  var isPh = function (v) { return !v || /\[|@tu_|TU-DOMINIO|0000000|000-0000/.test(String(v)); };
  var ok = function (p) { return p && p.lat !== null && p.lng !== null && p.lat !== undefined && isFinite(p.lat) && isFinite(p.lng); };
  /* branches from CONFIG.sucursales (fallback: one branch from CONFIG.whatsapp / telefono) */
  function branches(cfg) {
    cfg = cfg || {};
    var list = cfg.sucursales && cfg.sucursales.length ? cfg.sucursales : [{ id: "lecheria", nombre: "Lechería", whatsapp: cfg.whatsapp, telefono: cfg.telefono }];
    return list.map(function (b) {
      return { id: b.id, name: b.nombre, wa: isPh(b.whatsapp) ? "" : String(b.whatsapp).replace(/\D/g, ""), tel: isPh(b.telefono) ? "" : b.telefono, addr: isPh(b.direccion) ? "" : b.direccion || "", lat: b.lat, lng: b.lng };
    });
  }
  function branch(cfg, id) { var l = branches(cfg); for (var i = 0; i < l.length; i++) if (l[i].id === id) return l[i]; return l[0]; }
  function coords(cfg, id) {
    var b = branch(cfg, id), m = cfg && cfg.mapa;
    if (ok(b)) return { lat: +b.lat, lng: +b.lng };
    if (m && ok(m[b.id])) return { lat: +m[b.id].lat, lng: +m[b.id].lng };
    if (m && ok(m) && b.id === branches(cfg)[0].id) return { lat: +m.lat, lng: +m.lng };
    if (ok(MAP.branches[b.id])) return { lat: +MAP.branches[b.id].lat, lng: +MAP.branches[b.id].lng };
    return null;
  }
  function query(cfg, id) { var b = branch(cfg, id); return "El Amir Palace " + b.name + ", " + (b.addr ? b.addr + ", " : "") + "Anzoátegui, Venezuela"; }
  function target(cfg, id) { var c = coords(cfg, id); return c ? c.lat + "," + c.lng : query(cfg, id); }
  function mapEmbedUrl(cfg, lang, id) {
    return "https://www.google.com/maps?q=" + encodeURIComponent(target(cfg, id)) + "&z=" + MAP.zoom + "&hl=" + (lang || "es") + "&output=embed";
  }
  /* "Cómo llegar": a Google Maps search (or exact pin once coordinates exist) */
  function mapDirUrl(cfg, id) {
    var c = coords(cfg, id);
    return c ? "https://www.google.com/maps/search/?api=1&query=" + c.lat + "%2C" + c.lng : "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(query(cfg, id));
  }
  function telHref(b) { return "tel:" + (b.wa ? "+" + b.wa : b.tel.replace(/[^\d+]/g, "")); }
  var MAP_PH = '<svg class="map-ph" viewBox="0 0 300 375" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">' +
    '<rect width="300" height="375" fill="#2A2320"/>' +
    '<path d="M0 0H300V118C252 132 214 104 168 120 124 136 96 98 52 112 30 119 12 116 0 110Z" fill="#4A1119" opacity=".75"/>' +
    '<path d="M0 110C12 116 30 119 52 112 96 98 124 136 168 120 214 104 252 132 300 118" fill="none" stroke="#E9C9B8" stroke-opacity=".35" stroke-width="1.2"/>' +
    '<g fill="none" stroke="#F3E6DA" stroke-opacity=".13" stroke-width="1"><path d="M-20 170L320 138M-20 230L320 196M-20 292L320 258M-20 352L320 318"/><path d="M40 120L70 400M110 112L132 400M182 118L196 400M250 114L262 400"/></g>' +
    '<g fill="none" stroke="#F3E6DA" stroke-opacity=".28" stroke-width="3" stroke-linecap="round"><path d="M-10 262C70 240 150 214 310 205"/><path d="M150 128C158 200 166 290 176 390"/></g>' +
    '<circle cx="150" cy="190" r="56" fill="#7A1F2B" opacity=".18"/><circle cx="150" cy="190" r="30" fill="#7A1F2B" opacity=".22"/>' +
    '<text x="150" y="84" text-anchor="middle" fill="#E9C9B8" fill-opacity=".55" font-family="Instrument Serif, Georgia, serif" font-style="italic" font-size="20">Mar Caribe</text></svg>';
  /* Visit section body (both branches, hours, map with branch switch, delivery areas).
     o = { t(key, vars), lang, day(i), time12(hhmm), today (0-6 or null), base ("" or "../"), active (branch id) } */
  function renderVisit(cfg, o) {
    var t = o.t, bl = branches(cfg), active = o.active || bl[0].id;
    var cols = bl.map(function (b) {
      return '<div class="branch"><p class="branch-k">' + esc(t("v3.vis.branch")) + '</p><h3 class="branch-n latin">' + esc(b.name) + "</h3>" +
        '<p class="branch-a">' + esc(b.addr || b.name + ", Anzoátegui") + "</p>" +
        '<ul class="branch-l">' +
        (b.tel ? '<li><a class="link" href="' + telHref(b) + '"><span class="sr">' + esc(t("v3.vis.call")) + " </span>" + esc(b.tel) + "</a></li>" : "") +
        (b.wa ? '<li><a class="link" href="https://wa.me/' + b.wa + '" target="_blank" rel="noopener">WhatsApp<span class="sr"> ' + esc(b.name) + "</span></a></li>" : "") +
        '<li><a class="link" href="' + esc(mapDirUrl(cfg, b.id)) + '" target="_blank" rel="noopener">' + esc(t("v3.vis.map")) + '<span class="sr"> · ' + esc(b.name) + "</span></a></li>" +
        "</ul></div>";
    }).join("");
    var H = cfg.horario || {}, DAYS = [["lun", 1], ["mar", 2], ["mie", 3], ["jue", 4], ["vie", 5], ["sab", 6], ["dom", 0]];
    var hours = '<div><h3 data-i18n="v3.vis.hours">' + esc(t("v3.vis.hours")) + '</h3><ul id="vHours">' + DAYS.map(function (d) {
      var h = H[d[0]];
      return "<li" + (d[1] === o.today ? ' class="today"' : "") + "><span>" + esc(o.day(d[1])) + "</span><span>" + (h ? o.time12(h[0]) + " – " + o.time12(h[1]) : esc(t("v3.vis.closed"))) + "</span></li>";
    }).join("") + "</ul></div>";
    var tabs = bl.length > 1 ? '<div class="map-tabs" role="group" aria-label="' + esc(t("v3.vis.mapPick")) + '">' + bl.map(function (b) {
      return '<button type="button" data-branch="' + b.id + '" aria-pressed="' + (b.id === active) + '">' + esc(b.name) + "</button>";
    }).join("") + "</div>" : "";
    var map = '<div class="vis-map"><h3>' + esc(t("v3.vis.mapH")) + "</h3>" + tabs +
      '<div class="map" id="map" data-branch="' + active + '">' + MAP_PH +
      '<span class="map-pin" aria-hidden="true"><img src="' + (o.base || "") + 'img/brand/emblem.svg" alt="" width="22" height="22"></span>' +
      '<button class="btn btn--paper btn--sm map-load" type="button" id="mapLoad">' + esc(t("v3.vis.mapLoad")) + "</button></div>" +
      '<p class="map-note">' + esc(t("v3.vis.mapNote")) + "</p></div>";
    var zones = (cfg.zonas || []).map(function (z) { return z.name; }).filter(function (n) { return n && !/ejemplo/i.test(n); });
    var list = zones.join(", ");
    try { list = new Intl.ListFormat(o.lang === "ar" ? "ar" : o.lang === "en" ? "en" : "es", { type: "conjunction" }).format(zones); } catch (e) {}
    var deliv = zones.length ? '<p class="vis-deliv">' + esc(t("v3.vis.deliv", { zones: list })) + "</p>" : "";
    return cols + hours + map + deliv;
  }
  var STAR = '<svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true"><path fill="currentColor" d="M10 1.6l2.5 5.3 5.8.7-4.3 4 1.1 5.7L10 14.5l-5.1 2.8 1.1-5.7-4.3-4 5.8-.7z"/></svg>';
  var STAR_O = '<svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.3" d="M10 1.6l2.5 5.3 5.8.7-4.3 4 1.1 5.7L10 14.5l-5.1 2.8 1.1-5.7-4.3-4 5.8-.7z"/></svg>';
  var LOCALE = { es: "es-VE", en: "en-US", ar: "ar-u-nu-latn" };
  /* t(key, vars) = I18N.t bound to the language being rendered */
  function renderReviews(t, lang) {
    var fmt;
    try { fmt = new Intl.DateTimeFormat(LOCALE[lang] || "es-VE", { month: "long", year: "numeric" }); } catch (e) { fmt = null; }
    return REVIEWS.map(function (r) {
      var d = new Date(r.date + "T12:00:00"), stars = "";
      for (var i = 1; i <= 5; i++) stars += i <= r.rating ? STAR : STAR_O;
      return '<figure class="rev-card">' +
        '<div class="rev-stars" role="img" aria-label="' + esc(t("v3.rev.stars", { n: r.rating })) + '">' + stars + "</div>" +
        '<blockquote lang="' + (r.lang || "es") + '" dir="auto"><p>' + esc(r.text) + "</p></blockquote>" +
        '<figcaption class="rev-meta"><span class="rev-av" aria-hidden="true">' + esc(r.name.charAt(0)) + "</span>" +
        "<span><b>" + esc(r.name) + '</b><time datetime="' + r.date + '">' + esc(fmt ? fmt.format(d) : r.date) + "</time></span>" +
        '<span class="rev-src">' + esc(t("v3.rev.via", { source: r.source })) + "</span></figcaption></figure>";
    }).join("");
  }
  function aggregate() {
    if (REVIEWS_ARE_PLACEHOLDER || !REVIEWS.length) return null;
    var sum = REVIEWS.reduce(function (a, r) { return a + r.rating; }, 0);
    return { "@type": "AggregateRating", ratingValue: (sum / REVIEWS.length).toFixed(1), bestRating: "5", worstRating: "1", ratingCount: REVIEWS.length };
  }

  w.AMIR_CONTENT = {
    map: MAP, branches: branches, branch: branch, coords: coords, mapEmbedUrl: mapEmbedUrl, mapDirUrl: mapDirUrl, telHref: telHref, renderVisit: renderVisit, isPh: isPh,
    reviews: REVIEWS, reviewsArePlaceholder: REVIEWS_ARE_PLACEHOLDER, renderReviews: renderReviews, aggregate: aggregate
  };
})(typeof window !== "undefined" ? window : this);
