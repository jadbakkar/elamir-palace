/* =====================================================================
   El Amir Palace · reservar.html
   Table request form → WhatsApp of the chosen branch (the branch confirms
   in the chat; nothing is stored). Plain script, no build step.
   Needs i18n.js and config.js loaded first. Branch numbers and opening
   hours come from config.js; the WhatsApp text is I18N.buildReservationMessage
   (always Spanish, staff read Spanish).
   ===================================================================== */
(function () {
  "use strict";
  var doc = document, html = doc.documentElement, I = window.I18N;
  var reveal = function () { html.classList.remove("i18n-wait"); };
  if (!I || typeof CONFIG === "undefined") { reveal(); console.warn("reservar: falta i18n.js o config.js"); return; }
  var C = CONFIG;

  /* ---------- how the time list is built (owner can tune) ---------- */
  var STEP = 30;          /* minutes between the times offered */
  var BEFORE_CLOSE = 60;  /* last time offered = closing time minus this */
  var LEAD = 30;          /* for today: earliest time offered = now plus this */
  var MAX_DAYS = 90;      /* how far ahead the calendar goes */

  /* ---------- page strings (the form labels themselves are the "res.*" keys in i18n.js) ---------- */
  var RV = {
    es: {
      "meta.reservar.title": "Reservar mesa | El Amir Palace Lechería y Puerto La Cruz",
      "meta.reservar.description": "Reserva tu mesa en El Amir Palace, Lechería o Puerto La Cruz. Elige sucursal, fecha y hora; la sucursal te confirma por WhatsApp.",
      "rv.skip": "Saltar al formulario", "rv.branch": "Sucursal", "rv.timePh": "Elige la hora",
      "rv.area": "¿Dónde prefieres sentarte?", "rv.zone": "Zona",
      "rv.area.terraza": "Terraza", "rv.area.terrazaD": "Al aire libre, bajo toldo",
      "rv.area.baja": "Planta baja", "rv.area.bajaD": "Junto a la barra",
      "rv.area.alta": "Piso 1", "rv.area.altaD": "El salón grande, ideal para grupos",
      "rv.phone": "Teléfono (WhatsApp)", "rv.docid": "C.I / RIF", "rv.docidPh": "V-12345678 o J-12345678-9",
      "rv.err.phone": "Escribe un teléfono válido, con código de área.",
      "rv.err.docid": "Escribe tu C.I o RIF (ej. V-12345678 o J-12345678-9).",
      "rv.area.terrazaSup": "Terraza superior", "rv.area.terrazaSupD": "Al aire libre, en el piso de arriba",
      "rv.area.any": "Donde haya sitio", "rv.area.anyD": "La sucursal te ubica",
      "rv.area.hint": "Es una preferencia: la sucursal te confirma la zona según disponibilidad.",
      "rv.note": "Se abrirá WhatsApp con tu solicitud lista. La mesa queda reservada cuando la sucursal te confirma.",
      "rv.err.branch": "Elige una sucursal.", "rv.err.name": "Escribe tu nombre.",
      "rv.err.date": "Elige una fecha.", "rv.err.past": "Esa fecha ya pasó.",
      "rv.err.closed": "Ese día estamos cerrados. Elige otra fecha.",
      "rv.err.noSlots": "Hoy ya no quedan horas para reservar. Elige otra fecha.",
      "rv.err.time": "Elige una hora.",
      "rv.how.t": "Cómo funciona", "rv.how.1": "Elige sucursal, fecha y hora.",
      "rv.how.2": "Envía el mensaje que se abre en WhatsApp.", "rv.how.3": "La sucursal te confirma la mesa por el chat.",
      "rv.group.t": "¿Grupo grande o celebración?",
      "rv.group.p": "Para más de 8 personas o un evento, escribe directo a la sucursal y lo organizamos contigo.",
      "rv.done.t": "Solicitud lista", "rv.done.p": "Envía el mensaje en WhatsApp. {branch} te confirma la mesa por el chat.",
      "rv.done.edit": "Cambiar datos",
      "rv.backHome": "Volver al inicio", "rv.menuPdf": "Carta en PDF", "rv.top": "Volver arriba"
    },
    en: {
      "meta.reservar.title": "Book a Table | El Amir Palace Lechería & Puerto La Cruz",
      "meta.reservar.description": "Book your table at El Amir Palace in Lechería or Puerto La Cruz. Choose a location, date and time; the restaurant confirms on WhatsApp.",
      "rv.skip": "Skip to the form", "rv.branch": "Location", "rv.timePh": "Choose a time",
      "rv.area": "Where would you like to sit?", "rv.zone": "Area",
      "rv.area.terraza": "Terrace", "rv.area.terrazaD": "Outdoors, under an awning",
      "rv.area.baja": "Ground floor", "rv.area.bajaD": "By the bar",
      "rv.area.alta": "Floor 1", "rv.area.altaD": "The big room, great for groups",
      "rv.phone": "Phone (WhatsApp)", "rv.docid": "ID (C.I / RIF)", "rv.docidPh": "V-12345678 or J-12345678-9",
      "rv.err.phone": "Enter a valid phone number, with area code.",
      "rv.err.docid": "Enter your C.I or RIF (e.g. V-12345678 or J-12345678-9).",
      "rv.area.terrazaSup": "Upper terrace", "rv.area.terrazaSupD": "Outdoors, upstairs",
      "rv.area.any": "Wherever is free", "rv.area.anyD": "The restaurant seats you",
      "rv.area.hint": "This is a preference: the restaurant confirms the area depending on availability.",
      "rv.note": "WhatsApp will open with your request ready to send. Your table is booked once the restaurant confirms.",
      "rv.err.branch": "Choose a location.", "rv.err.name": "Enter your name.",
      "rv.err.date": "Choose a date.", "rv.err.past": "That date has already passed.",
      "rv.err.closed": "We are closed that day. Choose another date.",
      "rv.err.noSlots": "There are no times left to book today. Choose another date.",
      "rv.err.time": "Choose a time.",
      "rv.how.t": "How it works", "rv.how.1": "Choose a location, date and time.",
      "rv.how.2": "Send the message that opens in WhatsApp.", "rv.how.3": "The restaurant confirms your table in the chat.",
      "rv.group.t": "Large group or celebration?",
      "rv.group.p": "For more than 8 guests or an event, message the restaurant directly and we will plan it with you.",
      "rv.done.t": "Request ready", "rv.done.p": "Send the message in WhatsApp. {branch} will confirm your table in the chat.",
      "rv.done.edit": "Change details",
      "rv.backHome": "Back to home", "rv.menuPdf": "Menu (PDF)", "rv.top": "Back to top"
    },
    ar: {
      "meta.reservar.title": "احجز طاولة | El Amir Palace",
      "meta.reservar.description": "احجز طاولتك في قصر الأمير في ليتشيريا أو بويرتو لا كروز. اختر الفرع والتاريخ والوقت، ويؤكد لك الفرع الحجز عبر واتساب.",
      "rv.skip": "انتقل إلى النموذج", "rv.branch": "الفرع", "rv.timePh": "اختر الوقت",
      "rv.area": "أين تفضّل الجلوس؟", "rv.zone": "المكان",
      "rv.area.terraza": "التراس", "rv.area.terrazaD": "في الهواء الطلق تحت المظلة",
      "rv.area.baja": "الطابق الأرضي", "rv.area.bajaD": "بجانب البار",
      "rv.area.alta": "الطابق الأول", "rv.area.altaD": "الصالة الكبيرة، مثالية للمجموعات",
      "rv.phone": "الهاتف (واتساب)", "rv.docid": "C.I / RIF", "rv.docidPh": "V-12345678 أو J-12345678-9",
      "rv.err.phone": "اكتب رقم هاتف صالحاً مع رمز المنطقة.",
      "rv.err.docid": "اكتب رقم هويتك C.I أو RIF (مثال: V-12345678 أو J-12345678-9).",
      "rv.area.terrazaSup": "التراس العلوي", "rv.area.terrazaSupD": "في الهواء الطلق في الطابق العلوي",
      "rv.area.any": "أي مكان متاح", "rv.area.anyD": "يختار لك الفرع المكان",
      "rv.area.hint": "هذا تفضيل فقط: يؤكد لك الفرع المكان حسب التوفر.",
      "rv.note": "سيفتح واتساب وطلبك جاهز للإرسال. يُعتبر الحجز مؤكداً عندما يؤكده الفرع.",
      "rv.err.branch": "اختر الفرع.", "rv.err.name": "اكتب اسمك.",
      "rv.err.date": "اختر التاريخ.", "rv.err.past": "هذا التاريخ قد مضى.",
      "rv.err.closed": "نحن مغلقون في ذلك اليوم. اختر تاريخاً آخر.",
      "rv.err.noSlots": "لم تعد هناك أوقات متاحة للحجز اليوم. اختر تاريخاً آخر.",
      "rv.err.time": "اختر الوقت.",
      "rv.how.t": "كيف يتم الحجز", "rv.how.1": "اختر الفرع والتاريخ والوقت.",
      "rv.how.2": "أرسل الرسالة التي تُفتح في واتساب.", "rv.how.3": "يؤكد لك الفرع الطاولة عبر المحادثة.",
      "rv.group.t": "مجموعة كبيرة أو مناسبة؟",
      "rv.group.p": "لأكثر من 8 أشخاص أو لمناسبة خاصة، راسل الفرع مباشرة وسنرتبها معك.",
      "rv.done.t": "الطلب جاهز", "rv.done.p": "أرسل الرسالة عبر واتساب، وسيؤكد لك فرع {branch} الطاولة عبر المحادثة.",
      "rv.done.edit": "تعديل البيانات",
      "rv.backHome": "العودة إلى الرئيسية", "rv.menuPdf": "القائمة (PDF)", "rv.top": "العودة إلى الأعلى"
    }
  };
  for (var l in RV) { I.dict[l] = I.dict[l] || {}; for (var k in RV[l]) I.dict[l][k] = RV[l][k]; }

  var $ = function (s) { return doc.querySelector(s); };
  var form = $("#resForm"), done = $("#resDone");
  if (!form || !done) { I.apply(doc); reveal(); return; }
  var F = form.elements, LOCALES = { es: "es-VE", en: "en-US", ar: "ar-u-nu-latn" };

  /* ---------- dates and times, always on the restaurant's clock ---------- */
  var pad = function (n) { return (n < 10 ? "0" : "") + n; };
  var toMin = function (hhmm) { var p = String(hhmm).split(":"); return (+p[0]) * 60 + (+p[1] || 0); };
  function now() {
    var p = {};
    try {
      new Intl.DateTimeFormat("en-CA", { timeZone: C.tz || "America/Caracas", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" })
        .formatToParts(new Date()).forEach(function (x) { p[x.type] = x.value; });
      return { iso: p.year + "-" + p.month + "-" + p.day, min: (+p.hour % 24) * 60 + (+p.minute) };
    } catch (e) { var d = new Date(); return { iso: d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()), min: d.getHours() * 60 + d.getMinutes() }; }
  }
  var noon = function (iso) { return new Date(iso + "T12:00"); };
  function addDays(iso, n) { var d = noon(iso); d.setDate(d.getDate() + n); return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }
  var validISO = function (iso) { return /^\d{4}-\d{2}-\d{2}$/.test(iso) && !isNaN(noon(iso)); };
  /* times offered for a date: null = closed that day, [] = nothing left (today, late) */
  function slots(iso) {
    var h = (C.horario || {})[I.dayKeys[noon(iso).getDay()]];
    if (!h) return null;
    var open = toMin(h[0]), close = toMin(h[1]); if (close <= open) close += 1440;
    var n = now(), from = iso === n.iso ? n.min + LEAD : 0, out = [];
    for (var t = open; t <= close - BEFORE_CLOSE && t < 1440; t += STEP) if (t >= from) out.push(pad(Math.floor(t / 60)) + ":" + pad(t % 60));
    return out;
  }
  function fillTimes() {
    var sel = F.time, keep = sel.value, iso = F.date.value, list = validISO(iso) ? slots(iso) || [] : [];
    sel.textContent = "";
    var first = doc.createElement("option"); first.value = ""; first.textContent = I.t("rv.timePh"); sel.appendChild(first);
    list.forEach(function (v) { var o = doc.createElement("option"); o.value = v; o.textContent = I.time12(v); sel.appendChild(o); });
    sel.value = list.indexOf(keep) > -1 ? keep : "";
  }

  /* ---------- errors (kept as keys, so they follow a language switch) ---------- */
  var errs = {};
  function paintErrs() {
    ["date", "time", "name", "phone", "docid"].forEach(function (n) {
      var el = F[n], f = el.closest(".f"), key = errs[n] || "";
      f.classList.toggle("bad", !!key);
      f.querySelector(".err").textContent = key ? I.t(key) : "";
      if (key) el.setAttribute("aria-invalid", "true"); else el.removeAttribute("aria-invalid");
    });
    $("#branchG").classList.toggle("bad", !!errs.branch);
    $("#eBranch").textContent = errs.branch ? I.t(errs.branch) : "";
  }
  /* "v-12.345.678" -> "V-12345678" (what the branch sees) */
  function normDocid(s) { var d = String(s).replace(/[\s.-]/g, "").toUpperCase(); return /^[VEJGP]/.test(d) ? d[0] + "-" + d.slice(1) : d; }
  function check(n) {
    var key = "";
    if (n === "branch") key = F.branch.value ? "" : "rv.err.branch";
    if (n === "name") key = F.name.value.trim().length >= 2 ? "" : "rv.err.name";
    if (n === "phone") { var ph = F.phone.value.replace(/\D/g, ""); key = ph.length >= 10 && ph.length <= 13 ? "" : "rv.err.phone"; }
    if (n === "docid") key = /^[VEJGP]?\d{6,12}$/.test(F.docid.value.replace(/[\s.-]/g, "").toUpperCase()) ? "" : "rv.err.docid";
    if (n === "date") {
      var iso = F.date.value, s = validISO(iso) ? slots(iso) : null;
      key = !validISO(iso) ? "rv.err.date" : iso < now().iso ? "rv.err.past" : s === null ? "rv.err.closed" : !s.length ? "rv.err.noSlots" : "";
    }
    if (n === "time") key = errs.date ? "" : F.time.value ? "" : "rv.err.time"; /* a bad date already explains the empty list */
    errs[n] = key;
    return !key;
  }

  /* ---------- footer hours, WhatsApp links ---------- */
  function hours() {
    var box = $("#ftHours"); if (!box || !C.horario) return;
    var today = noon(now().iso).getDay(); box.textContent = "";
    [1, 2, 3, 4, 5, 6, 0].forEach(function (i) {
      var h = C.horario[I.dayKeys[i]], dt = doc.createElement("dt"), dd = doc.createElement("dd");
      dt.textContent = I.day(i);
      if (h) { var s = doc.createElement("span"); s.className = "num"; s.textContent = I.time12(h[0]) + " – " + I.time12(h[1]); dd.appendChild(s); }
      else dd.textContent = I.t("visit.closed");
      if (i === today) { dt.className = "now"; dd.className = "now"; }
      box.appendChild(dt); box.appendChild(dd);
    });
  }
  var branchOf = function (id) { return (C.sucursales || []).filter(function (b) { return b.id === id; })[0] || null; };
  doc.querySelectorAll("[data-wa]").forEach(function (a) { a.href = "https://wa.me/" + C.whatsapp; });
  doc.querySelectorAll("[data-br]").forEach(function (a) { var b = branchOf(a.getAttribute("data-br")); if (b && b.whatsapp) a.href = "https://wa.me/" + b.whatsapp; });

  /* ---------- "request ready" panel ---------- */
  var sent = null;
  function paintDone() {
    if (!sent) return;
    $("#doneP").textContent = I.t("rv.done.p", { branch: sent.branch });
    var dl = $("#doneSum"); dl.textContent = "";
    [["rv.branch", sent.branch],
     ["res.people", sent.people === "+8" ? I.t("res.more8") : sent.people],
     ["res.date", noon(sent.date).toLocaleDateString(LOCALES[I.lang] || "es-VE", { weekday: "long", day: "numeric", month: "long" })],
     ["res.time", I.time12(sent.time)]].concat(sent.area ? [["rv.zone", I.t("rv.area." + sent.area)]] : []).forEach(function (r) {
      var dt = doc.createElement("dt"), dd = doc.createElement("dd");
      dt.textContent = I.t(r[0]); dd.textContent = r[1]; dl.appendChild(dt); dl.appendChild(dd);
    });
    $("#doneOpen").href = sent.url;
  }

  /* ---------- events ---------- */
  F.date.addEventListener("change", function () { check("date"); fillTimes(); if (errs.time) check("time"); paintErrs(); });
  F.time.addEventListener("change", function () { if (errs.time) { check("time"); paintErrs(); } });
  F.name.addEventListener("input", function () { if (errs.name) { check("name"); paintErrs(); } });
  form.addEventListener("change", function (e) { if (e.target.name === "branch") { check("branch"); paintErrs(); } });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var bad = ["branch", "date", "time", "name", "phone", "docid"].filter(function (n) { return !check(n); });
    paintErrs();
    if (bad.length) { (bad[0] === "branch" ? F.branch[0] : F[bad[0]]).focus(); return; }
    var b = branchOf(F.branch.value) || { nombre: "", whatsapp: "" }, people = F.people.value, area = F.area.value;
    var msg = I.buildReservationMessage({
      name: F.name.value.trim(), phone: F.phone.value.trim(), docid: normDocid(F.docid.value), people: people === "+8" ? I.tEs("res.more8") : people,
      dateISO: F.date.value, time: F.time.value, notes: F.notes.value, branch: b.nombre,
      area: area ? I.tEs("rv.area." + area) : ""
    });
    sent = { branch: b.nombre, area: area, people: people, date: F.date.value, time: F.time.value, url: "https://wa.me/" + (b.whatsapp || C.whatsapp) + "?text=" + encodeURIComponent(msg) };
    var win = window.open(sent.url, "_blank");
    if (win) { try { win.opener = null; } catch (er) { /* ignore */ } }
    paintDone();
    form.hidden = true; done.hidden = false;
    done.focus({ preventScroll: true }); done.scrollIntoView({ block: "start" });
  });
  $("#doneEdit").addEventListener("click", function () { done.hidden = true; form.hidden = false; F.date.focus(); });
  doc.addEventListener("langchange", function () { fillTimes(); paintErrs(); hours(); paintDone(); });

  /* ---------- start: today if there is still a time to offer, otherwise tomorrow ---------- */
  var t0 = now().iso, s0 = slots(t0);
  F.date.min = t0; F.date.max = addDays(t0, MAX_DAYS);
  if (!F.date.value) F.date.value = s0 && s0.length ? t0 : addDays(t0, 1);
  I.apply(doc);
  fillTimes(); hours();
  reveal();
})();
