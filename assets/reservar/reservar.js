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
  var STEP = 15;          /* minutes between the times offered */
  var BEFORE_CLOSE = 30;  /* last time offered = closing time minus this (they close at 12 am, so the last reservation is 11:30 pm) */
  var LEAD = 0;           /* for today: earliest time offered = now, rounded up to the next slot (1:03 pm -> 1:15 pm) */
  var LAST_DATE = "2028-12-31"; /* the last day the calendar offers */

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
      "rv.hours": "Tiempo estimado de estadía", "rv.min": "min",
      "rv.datePh": "Elige la fecha", "rv.cal.label": "Elige la fecha", "rv.cal.prev": "Mes anterior", "rv.cal.next": "Mes siguiente",
      "rv.cal.closed": "Cerrado", "rv.cal.noTimes": "Sin horas disponibles hoy",
      "rv.zoom": "Ampliar foto", "rv.zoom.close": "Cerrar", "rv.zoom.in": "Acercar", "rv.zoom.out": "Alejar",
      "rv.zoom.hint": "Pellizca o toca dos veces para acercar. Toca una mesa para elegirla.",
      "rv.quote": "¿Quieres un presupuesto?", "rv.quote.no": "No", "rv.quote.yes": "Sí",
      "rv.quote.hint": "Si dices sí, vas al menú a elegir tus platos. Al terminar vuelves aquí y presionas Reservar.",
      "rv.quote.ready": "Listo: tus platos viajan con tu reserva. Presiona Reservar para enviarla.",
      "rv.quote.edit": "Editar platos", "rv.quote.sub": "Subtotal estimado: {amount}",
      "rv.quote.lock": "Completa todos los datos para poder pedir un presupuesto.",
      "rv.quote.fail": "No pudimos guardar tus datos en este navegador. Usa el botón Reservar.",
      "rv.table": "Elige tu mesa (opcional)", "rv.table.hint": "Toca el número de una mesa en la foto. Es una preferencia: la sucursal te confirma la mesa.",
      "rv.table.sel": "Mesa {n} elegida. La sucursal te confirma si está libre.", "rv.table.clear": "Quitar mesa", "rv.table.aria": "Mesa {n}", "rv.table.row": "Mesa",
      "rv.area.hint": "Es una preferencia: la sucursal te confirma la zona según disponibilidad.",
      "rv.note": "Se abrirá WhatsApp con tu solicitud lista. La mesa queda reservada cuando la sucursal te confirma.",
      "rv.err.branch": "Elige una sucursal.", "rv.err.name": "Escribe tu nombre.", "rv.err.notes": "Escribe la ocasión o una nota para la mesa.",
      "rv.err.date": "Elige una fecha.", "rv.err.past": "Esa fecha ya pasó.",
      "rv.err.closed": "Ese día estamos cerrados. Elige otra fecha.",
      "rv.err.noSlots": "Hoy ya no quedan horas para reservar. Elige otra fecha.",
      "rv.err.time": "Escribe una hora.", "rv.err.ampm": "Elige AM o PM.","rv.err.timeBad": "Escribe una hora cada 15 minutos, dentro del horario (por ejemplo 7:30 pm).", "rv.hours.range": "Horario: {from} – {to}",
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
      "rv.hours": "Estimated length of stay", "rv.min": "min",
      "rv.datePh": "Choose a date", "rv.cal.label": "Choose a date", "rv.cal.prev": "Previous month", "rv.cal.next": "Next month",
      "rv.cal.closed": "Closed", "rv.cal.noTimes": "No times left today",
      "rv.zoom": "Enlarge photo", "rv.zoom.close": "Close", "rv.zoom.in": "Zoom in", "rv.zoom.out": "Zoom out",
      "rv.zoom.hint": "Pinch or double-tap to zoom. Tap a table to pick it.",
      "rv.quote": "Would you like a quote?", "rv.quote.no": "No", "rv.quote.yes": "Yes",
      "rv.quote.hint": "If you say yes, you pick your dishes on the menu. When you're done you come back here and press Book.",
      "rv.quote.ready": "Done: your dishes go with your booking. Press Book to send it.",
      "rv.quote.edit": "Edit dishes", "rv.quote.sub": "Estimated subtotal: {amount}",
      "rv.quote.lock": "Fill in all the details to ask for a quote.",
      "rv.quote.fail": "We couldn't save your details in this browser. Use the Book button.",
      "rv.table": "Choose your table (optional)", "rv.table.hint": "Tap a table number on the photo. It's a preference: the restaurant confirms your table.",
      "rv.table.sel": "Table {n} selected. The restaurant confirms if it's free.", "rv.table.clear": "Clear table", "rv.table.aria": "Table {n}", "rv.table.row": "Table",
      "rv.area.hint": "This is a preference: the restaurant confirms the area depending on availability.",
      "rv.note": "WhatsApp will open with your request ready to send. Your table is booked once the restaurant confirms.",
      "rv.err.branch": "Choose a location.", "rv.err.name": "Enter your name.", "rv.err.notes": "Enter the occasion or a note for the table.",
      "rv.err.date": "Choose a date.", "rv.err.past": "That date has already passed.",
      "rv.err.closed": "We are closed that day. Choose another date.",
      "rv.err.noSlots": "There are no times left to book today. Choose another date.",
      "rv.err.time": "Type a time.", "rv.err.ampm": "Choose AM or PM.","rv.err.timeBad": "Type a time every 15 minutes, within opening hours (for example 7:30 pm).", "rv.hours.range": "Open: {from} – {to}",
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
      "rv.hours": "مدة الإقامة المتوقعة", "rv.min": "د",
      "rv.datePh": "اختر التاريخ", "rv.cal.label": "اختر التاريخ", "rv.cal.prev": "الشهر السابق", "rv.cal.next": "الشهر التالي",
      "rv.cal.closed": "مغلق", "rv.cal.noTimes": "لا توجد أوقات متاحة اليوم",
      "rv.zoom": "تكبير الصورة", "rv.zoom.close": "إغلاق", "rv.zoom.in": "تكبير", "rv.zoom.out": "تصغير",
      "rv.zoom.hint": "اضغط بإصبعين أو انقر مرتين للتكبير. اضغط على طاولة لاختيارها.",
      "rv.quote": "هل تريد عرض سعر؟", "rv.quote.no": "لا", "rv.quote.yes": "نعم",
      "rv.quote.hint": "إذا اخترت نعم تنتقل إلى القائمة لاختيار أطباقك. عند الانتهاء تعود إلى هنا وتضغط احجز.",
      "rv.quote.ready": "تم: أطباقك مرفقة بحجزك. اضغط احجز لإرساله.",
      "rv.quote.edit": "تعديل الأطباق", "rv.quote.sub": "المجموع التقديري: {amount}",
      "rv.quote.lock": "أكمل جميع البيانات لتتمكن من طلب عرض سعر.",
      "rv.quote.fail": "تعذّر حفظ بياناتك في هذا المتصفح. استخدم زر احجز.",
      "rv.table": "اختر طاولتك (اختياري)", "rv.table.hint": "اضغط على رقم طاولة في الصورة. هذا تفضيل فقط: يؤكد لك الفرع الطاولة.",
      "rv.table.sel": "تم اختيار الطاولة {n}. يؤكد لك الفرع إن كانت متاحة.", "rv.table.clear": "إلغاء الطاولة", "rv.table.aria": "الطاولة {n}", "rv.table.row": "الطاولة",
      "rv.area.hint": "هذا تفضيل فقط: يؤكد لك الفرع المكان حسب التوفر.",
      "rv.note": "سيفتح واتساب وطلبك جاهز للإرسال. يُعتبر الحجز مؤكداً عندما يؤكده الفرع.",
      "rv.err.branch": "اختر الفرع.", "rv.err.name": "اكتب اسمك.", "rv.err.notes": "اكتب المناسبة أو ملاحظة للطاولة.",
      "rv.err.date": "اختر التاريخ.", "rv.err.past": "هذا التاريخ قد مضى.",
      "rv.err.closed": "نحن مغلقون في ذلك اليوم. اختر تاريخاً آخر.",
      "rv.err.noSlots": "لم تعد هناك أوقات متاحة للحجز اليوم. اختر تاريخاً آخر.",
      "rv.err.time": "اكتب الوقت.", "rv.err.ampm": "اختر ص أو م.","rv.err.timeBad": "اكتب وقتاً كل 15 دقيقة ضمن ساعات العمل (مثلاً 7:30 م).", "rv.hours.range": "ساعات العمل: {from} – {to}",
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
  /* the guest types the time by hand (no dropdown): only digits and ":" are kept, at most 5 characters.
     The ":" is added by itself: after "13" (or a first digit 2-9, like "2" -> "2:"), and "1350" / a pasted "1320" -> "13:50" / "13:20".
     A "." is read as ":" ("13.50" -> "13:50"). Nothing is added while deleting, so Backspace still works. */
  function timeKeys(e) {
    var raw = F.time.value.replace(/\./g, ":").replace(/[^\d:]/g, "");
    var deleting = e && String(e.inputType || "").indexOf("delete") > -1;
    var i = raw.indexOf(":"), mins = i < 0 ? "" : raw.slice(i + 1);
    if (i < 0 || mins.length > 2) { /* no colon yet, or too many digits after it: rebuild from the digits */
      var d = raw.replace(/:/g, "");
      if (d.length === 3) d = d.slice(0, 1) + ":" + d.slice(1);   /* 140 -> 1:40 */
      else if (d.length >= 4) d = d.slice(0, 2) + ":" + d.slice(2); /* 1400 -> 14:00, 1350 -> 13:50 */
      else if (i < 0 && !deleting && d.length === 1 && +d >= 2) d += ":"; /* 2 -> 2: (a single 2-9 can only be the hour) */
      raw = d;
    }
    raw = raw.slice(0, 5);
    if (raw !== F.time.value) F.time.value = raw;
  }
  /* any reasonable typing -> "HH:MM" (or "" if it isn't a time): "19:30", "7:30 pm", "730pm", "7:30" (evening if that is the time offered), "11:30" */
  function parseTime(text, iso, ampm) {
    var s = String(text || "").trim().toLowerCase().replace(/\./g, "").replace(/\s+/g, " ");
    var m = /^(\d{1,2})(?::?(\d{2}))?\s?(am|pm|a|p)?$/.exec(s); if (!m) return "";
    var h = +m[1], mi = m[2] != null ? +m[2] : 0, sfx = m[3] || (ampm && h >= 1 && h <= 12 ? ampm : ""); /* the AM / PM choice counts for hours 1-12 (13:40 ignores it) */
    if (mi > 59) return "";
    if (sfx) {
      if (h < 1 || h > 12) return "";
      if (sfx[0] === "p" && h < 12) h += 12; if (sfx[0] === "a" && h === 12) h = 0;
    } else if (h > 23) return "";
    else if (h >= 1 && h <= 12 && m[1][0] !== "0" && validISO(iso)) { /* no am/pm: take the one of the two that is offered that day ("7:30" -> 7:30 pm) */
      var list = slots(iso) || [], am = pad(h % 12) + ":" + pad(mi), pm = pad((h % 12) + 12) + ":" + pad(mi);
      var inAm = list.indexOf(am) > -1, inPm = list.indexOf(pm) > -1;
      h = inPm && (!inAm || h < 11) ? (h % 12) + 12 : h % 12;
    }
    return pad(h) + ":" + pad(mi);
  }
  function timeVal() { return parseTime(F.time.value, F.date.value, F.ampm.value); }
  /* the box shows the hour as the guest reads it ("7:30") and the AM / PM choice shows the rest: "19:30" -> "7:30" + PM */
  function showTime(hhmm) {
    if (!hhmm) { F.time.value = ""; return; }
    var h = +hhmm.slice(0, 2);
    F.time.value = (h % 12 || 12) + ":" + hhmm.slice(3, 5);
    F.ampm.value = h < 12 ? "am" : "pm";
  }
  /* "11:30 am – 11:30 pm" for the chosen day, from the opening hours (the last time = closing minus BEFORE_CLOSE) */
  function dayRange(iso) {
    var h = (C.horario || {})[I.dayKeys[noon(iso).getDay()]]; if (!h) return "";
    var open = toMin(h[0]), close = toMin(h[1]); if (close <= open) close += 1440;
    var last = (close - BEFORE_CLOSE) % 1440;
    return I.t("rv.hours.range", { from: I.time12(h[0]), to: I.time12(pad(Math.floor(last / 60)) + ":" + pad(last % 60)) });
  }

  /* ---------- errors (kept as keys, so they follow a language switch) ---------- */
  var errs = {};
  function paintErrs() {
    ["date", "time", "name", "phone", "docid", "notes"].forEach(function (n) {
      var el = n === "date" ? calBtn : F[n], f = el.closest(".f"), key = errs[n] || "";
      f.classList.toggle("bad", !!key);
      var txt = key ? I.t(key) : "";
      if (key === "rv.err.timeBad") txt += " " + dayRange(F.date.value); /* say the real hours for that day */
      f.querySelector(".err").textContent = txt;
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
    if (n === "notes") key = F.notes.value.trim() ? "" : "rv.err.notes";
    if (n === "phone") { var ph = F.phone.value.replace(/\D/g, ""); key = ph.length >= 10 && ph.length <= 13 ? "" : "rv.err.phone"; }
    if (n === "docid") key = /^[VEJGP]?\d{6,12}$/.test(F.docid.value.replace(/[\s.-]/g, "").toUpperCase()) ? "" : "rv.err.docid";
    if (n === "date") {
      var iso = F.date.value, s = validISO(iso) ? slots(iso) : null;
      key = !validISO(iso) ? "rv.err.date" : iso < now().iso ? "rv.err.past" : s === null ? "rv.err.closed" : !s.length ? "rv.err.noSlots" : "";
    }
    if (n === "time") { /* a typed time must be one of the times offered that day: inside the opening hours, every 15 minutes, and not already past */
      var tv = timeVal(), tl = validISO(F.date.value) ? slots(F.date.value) : null;
      key = errs.date ? "" : !F.time.value.trim() ? "rv.err.time" : !F.ampm.value ? "rv.err.ampm" : !tl || tl.indexOf(tv) < 0 ? "rv.err.timeBad" : "";
    }
    errs[n] = key;
    return !key;
  }

  /* ---------- table picker: the chosen area's photos (swiped sideways) with a numbered dot on each table ----------
     The table positions and numbers live in assets/reservar/tables.json (edit them with scripts/table-editor.html:
     pick an area and a photo, click the photo to add a table, drag to move, set the number, save). Each area is a
     list of photos, {"img", "h", "dots"}; the same table can appear on several photos of one area, with the same number.
     If the file can't be loaded the picker simply stays hidden and the form still works.
       [number, x%, y%]                   near table: the numbered dot sits on the table
       [number, x%, y%, labelX%, labelY%]  far table: a small pin sits on the table and a thin line runs up to the
                                          numbered label in the empty space above it */
  var PLANS = {};
  var plansReady = fetch("assets/reservar/tables.json")
    .then(function (r) { return r.ok ? r.json() : {}; })
    .then(function (j) { PLANS = j || {}; })
    .catch(function () { PLANS = {}; });
  var table = "";
  function paintTable() {
    $("#tableH").textContent = table ? I.t("rv.table.sel", { n: table }) : I.t("rv.table.hint");
    $("#tableClear").hidden = !table;
    [].forEach.call(doc.querySelectorAll(".rv-pin"), function (p) { p.classList.toggle("on", p.getAttribute("data-n") === table); });
    [].forEach.call(doc.querySelectorAll(".rv-dot"), function (b) {
      b.setAttribute("aria-pressed", b.textContent === table ? "true" : "false");
      b.setAttribute("aria-label", I.t("rv.table.aria", { n: b.textContent }));
    });
  }
  /* one floor = one row of photos the guest swipes sideways; each photo carries its own dots */
  var curPhotos = [];
  /* one photo with its dots: the picker row uses it small (with a zoom button), the zoom viewer uses it large */
  function buildSlide(p, large) {
    var NS = "http://www.w3.org/2000/svg", slide = doc.createElement("div"), img = doc.createElement("img"), box = doc.createElement("div"), svg = doc.createElementNS(NS, "svg");
    slide.className = large ? "rv-plan" : "rv-plan rv-slide";
    img.alt = ""; img.decoding = "async"; img.draggable = false;
    if (large) img.src = "img/salon/" + p.img + "-1600.webp";
    else {
      img.loading = "lazy"; img.addEventListener("load", sizeSwipe);
      img.src = "img/salon/" + p.img + "-800.webp";
      img.srcset = "img/salon/" + p.img + "-800.webp 800w, img/salon/" + p.img + "-1600.webp 1600w";
      img.sizes = "(min-width:960px) 600px, 92vw";
    }
    img.width = 1600; img.height = p.h;
    box.className = "rv-dots";
    svg.setAttribute("class", "rv-lines"); svg.setAttribute("viewBox", "0 0 100 100"); svg.setAttribute("preserveAspectRatio", "none"); svg.setAttribute("aria-hidden", "true");
    box.appendChild(svg); /* first, so the pins and labels draw over the lines */
    p.dots.forEach(function (d) {
      var far = d[3] != null, b = doc.createElement("button");
      if (far) { /* far table: pin on the table, thin line up to the label */
        var ln = doc.createElementNS(NS, "line");
        ln.setAttribute("x1", d[3]); ln.setAttribute("y1", d[4]); ln.setAttribute("x2", d[1]); ln.setAttribute("y2", d[2]);
        svg.appendChild(ln);
        var pin = doc.createElement("i");
        pin.className = "rv-pin"; pin.setAttribute("data-n", d[0]); pin.style.left = d[1] + "%"; pin.style.top = d[2] + "%";
        box.appendChild(pin);
      }
      b.type = "button"; b.className = "rv-dot"; b.textContent = d[0];
      b.style.left = (far ? d[3] : d[1]) + "%"; b.style.top = (far ? d[4] : d[2]) + "%";
      box.appendChild(b);
    });
    slide.appendChild(img); slide.appendChild(box);
    if (!large) {
      var z = doc.createElement("button"); z.type = "button"; z.className = "rv-zoom"; z.setAttribute("aria-label", I.t("rv.zoom"));
      z.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L21 21M10.5 7.5v6M7.5 10.5h6"/></svg>';
      slide.appendChild(z);
    }
    return slide;
  }
  function renderPlan() {
    var g = $("#tableG"), photos = PLANS[F.area.value], row = $("#planSwipe");
    table = ""; row.textContent = ""; curPhotos = [];
    if (!photos || !photos.length || F.branch.value === "plc") { g.hidden = true; return; } /* the table photos are Lechería's: no picker for Puerto La Cruz */
    curPhotos = photos;
    photos.forEach(function (p) { row.appendChild(buildSlide(p, false)); });
    row.scrollLeft = 0;
    g.hidden = false; paintTable(); sizeSwipe();
  }
  /* the row takes the height of the photo on screen, so a shorter photo leaves no blank space */
  function sizeSwipe() {
    var row = $("#planSwipe"), i = row.clientWidth ? Math.round(row.scrollLeft / row.clientWidth) : 0, s = row.children[i];
    if (s) row.style.height = s.offsetHeight + "px";
  }
  $("#planSwipe").addEventListener("scroll", function () { sizeSwipe(); }, { passive: true });
  window.addEventListener("resize", function () { sizeSwipe(); });
  function showPlan() { plansReady.then(renderPlan); }
  /* picking a floor must not scroll the page: the radios are visually hidden, so focusing one on click made the browser
     scroll to wherever it sits ("centering" the cards). Cancelling the mousedown skips that focus; the click still selects the floor. */
  [].forEach.call(doc.querySelectorAll(".rv-area"), function (l) { l.addEventListener("mousedown", function (e) { e.preventDefault(); }); });
  function pickDot(b) { table = table === b.textContent ? "" : b.textContent; paintTable(); }
  $("#planSwipe").addEventListener("click", function (e) {
    var b = e.target.closest ? e.target.closest(".rv-dot") : null;
    if (b) { pickDot(b); return; }
    var slide = e.target.closest ? e.target.closest(".rv-slide") : null; /* a tap on the photo (or its zoom button) opens the viewer */
    if (slide) openViewer([].indexOf.call($("#planSwipe").children, slide), slide.querySelector(".rv-zoom"));
  });

  /* ---------- zoom viewer ----------
     Full-screen photo you can pinch, drag and double-tap to zoom (wheel and +/- on a computer). The table numbers stay on the photo,
     at a constant size, and can still be tapped to pick a table. It only exists in the page while open (no hidden full-screen layer left behind). */
  var viewer = null;
  function openViewer(index, opener) {
    var p = curPhotos[index]; if (!p || viewer) return;
    var wrap = doc.createElement("div"), stage = doc.createElement("div"), pan = buildSlide(p, true);
    wrap.className = "rv-lb"; wrap.setAttribute("role", "dialog"); wrap.setAttribute("aria-modal", "true"); wrap.setAttribute("aria-label", I.t("rv.zoom"));
    stage.className = "rv-lb-stage"; pan.classList.add("rv-lb-pan"); stage.appendChild(pan); wrap.appendChild(stage);
    var icon = function (d) { return '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' + d + '"/></svg>'; };
    var btn = function (cls, label, d) { var b = doc.createElement("button"); b.type = "button"; b.className = cls; b.setAttribute("aria-label", label); b.innerHTML = icon(d); return b; };
    var closeB = btn("rv-lb-x", I.t("rv.zoom.close"), "M6 6l12 12M18 6L6 18"), outB = btn("rv-lb-b", I.t("rv.zoom.out"), "M5 12h14"), inB = btn("rv-lb-b", I.t("rv.zoom.in"), "M5 12h14M12 5v14");
    var hint = doc.createElement("p"); hint.className = "rv-lb-hint"; hint.textContent = I.t("rv.zoom.hint");
    var ctl = doc.createElement("div"); ctl.className = "rv-lb-ctl"; ctl.appendChild(outB); ctl.appendChild(inB);
    wrap.appendChild(hint); wrap.appendChild(ctl); wrap.appendChild(closeB);
    doc.body.appendChild(wrap);
    paintTable(); /* the chosen table (if any) is already highlighted when the viewer opens */

    var SW = 0, SH = 0, W = 0, H = 0, minS = 1, MAX = 6, s = 1, tx = 0, ty = 0, pts = {}, g = { moved: false, onDot: false, sx: 0, sy: 0 }, lastTap = { t: 0, x: 0, y: 0 };
    function clamp() {
      var cw = W * s, ch = H * s;
      tx = cw <= SW ? (SW - cw) / 2 : Math.min(0, Math.max(SW - cw, tx));
      ty = ch <= SH ? (SH - ch) / 2 : Math.min(0, Math.max(SH - ch, ty));
    }
    function apply() { clamp(); pan.style.transform = "translate(" + tx + "px," + ty + "px) scale(" + s + ")"; pan.style.setProperty("--z", s); }
    function zoomAt(cx, cy, ns) { ns = Math.min(MAX, Math.max(minS, ns)); tx = cx - (cx - tx) * (ns / s); ty = cy - (cy - ty) * (ns / s); s = ns; apply(); }
    function layout() { /* fit the photo to the screen (also after a rotation) */
      SW = stage.clientWidth; SH = stage.clientHeight; W = SW; H = SW * p.h / 1600; minS = Math.min(1, SH / H);
      pan.style.width = W + "px"; pan.style.height = H + "px"; s = Math.max(minS, Math.min(s, MAX)); apply();
    }
    layout();
    var keys = Object.keys, mid = function () { var k = keys(pts), a = pts[k[0]], b = pts[k[1]]; return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }; };
    var dist = function () { var k = keys(pts), a = pts[k[0]], b = pts[k[1]]; return Math.hypot(a.x - b.x, a.y - b.y); };
    var box = function () { return stage.getBoundingClientRect(); };
    stage.addEventListener("pointerdown", function (e) {
      pts[e.pointerId] = { x: e.clientX, y: e.clientY };
      if (keys(pts).length === 1) g = { moved: false, onDot: !!(e.target.closest && e.target.closest(".rv-dot")), sx: e.clientX, sy: e.clientY };
      else g.moved = true; /* a second finger = a pinch, never a tap */
    });
    function onMove(e) {
      var pt = pts[e.pointerId]; if (!pt) return;
      if (keys(pts).length === 1) {
        tx += e.clientX - pt.x; ty += e.clientY - pt.y; pt.x = e.clientX; pt.y = e.clientY;
        if (Math.hypot(e.clientX - g.sx, e.clientY - g.sy) > 8) g.moved = true;
        apply();
      } else if (keys(pts).length === 2) {
        var m0 = mid(), d0 = dist(); pt.x = e.clientX; pt.y = e.clientY; var m1 = mid(), d1 = dist(), r = box();
        tx += m1.x - m0.x; ty += m1.y - m0.y;
        if (d0 > 0) zoomAt(m1.x - r.left, m1.y - r.top, s * d1 / d0); else apply();
      }
    }
    function onUp(e) {
      if (!pts[e.pointerId]) return; delete pts[e.pointerId];
      if (keys(pts).length || g.moved || g.onDot || e.type === "pointercancel") return;
      var now = Date.now(), r = box(); /* two quick taps in the same spot: zoom in there, or back out */
      if (now - lastTap.t < 320 && Math.hypot(e.clientX - lastTap.x, e.clientY - lastTap.y) < 30) { lastTap.t = 0; zoomAt(e.clientX - r.left, e.clientY - r.top, s > minS * 1.3 ? minS : Math.min(MAX, Math.max(minS * 2.5, 2.5))); }
      else lastTap = { t: now, x: e.clientX, y: e.clientY };
    }
    stage.addEventListener("click", function (e) { /* a drag or pinch that ends on a table number must not pick it */
      if (g.moved) { e.stopPropagation(); e.preventDefault(); return; }
      var d = e.target.closest ? e.target.closest(".rv-dot") : null; if (d) pickDot(d);
    }, true);
    stage.addEventListener("wheel", function (e) { e.preventDefault(); var r = box(); zoomAt(e.clientX - r.left, e.clientY - r.top, s * Math.exp(-e.deltaY * 0.0015)); }, { passive: false });
    var step = function (f) { var r = box(); zoomAt(r.width / 2, r.height / 2, s * f); };
    inB.addEventListener("click", function () { step(1.6); }); outB.addEventListener("click", function () { step(1 / 1.6); });
    function close() {
      window.removeEventListener("pointermove", onMove); window.removeEventListener("pointerup", onUp); window.removeEventListener("pointercancel", onUp);
      window.removeEventListener("resize", layout); doc.removeEventListener("keydown", onKey, true);
      wrap.remove(); viewer = null; if (opener && opener.focus) opener.focus({ preventScroll: true });
    }
    function onKey(e) {
      if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); close(); return; }
      if (e.key === "+" || e.key === "=") { step(1.6); return; }
      if (e.key === "-") { step(1 / 1.6); return; }
      if (e.key === "Tab") { /* keep the focus inside the viewer */
        var f = [].slice.call(wrap.querySelectorAll("button")), i = f.indexOf(doc.activeElement);
        e.preventDefault(); f[(i + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus();
      }
    }
    window.addEventListener("pointermove", onMove); window.addEventListener("pointerup", onUp); window.addEventListener("pointercancel", onUp);
    window.addEventListener("resize", layout); doc.addEventListener("keydown", onKey, true);
    closeB.addEventListener("click", close);
    viewer = { close: close }; closeB.focus({ preventScroll: true });
  }
  $("#tableClear").addEventListener("click", function () { table = ""; paintTable(); });
  form.addEventListener("change", function (e) { if (e.target.name === "area") showPlan(); });

  /* ---------- how long they stay: 10 to 240 minutes, every 10 (default 1 hour) ---------- */
  function fillDurations() {
    var sel = F.hours, keep = sel.value || "60";
    sel.textContent = "";
    for (var m = 10; m <= 240; m += 10) {
      var o = doc.createElement("option"); o.value = String(m); o.textContent = m + " " + I.t("rv.min");
      if (String(m) === keep) o.selected = true;
      sel.appendChild(o);
    }
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
     ["res.time", I.time12(sent.time)]].concat(sent.area ? [["rv.zone", I.t("rv.area." + sent.area)]] : []).concat(sent.table ? [["rv.table.row", sent.table]] : []).forEach(function (r) {
      var dt = doc.createElement("dt"), dd = doc.createElement("dd");
      dt.textContent = I.t(r[0]); dd.textContent = r[1]; dl.appendChild(dt); dl.appendChild(dd);
    });
    $("#doneOpen").href = sent.url;
  }

  /* ---------- our own calendar ----------
     Shows one month at a time, from this month to the last bookable one: earlier months (and years) can't be reached.
     Days that are past, beyond the booking limit, closed, or already out of times today are greyed out and can't be picked.
     The chosen date lives in the hidden #rDate as "YYYY-MM-DD"; the button only shows it. */
  var dMin = "", dMax = "";
  var calBtn = $("#rDateBtn"), calTxt = $("#rDateTxt"), cal = $("#rCal"), calIsOpen = false, viewY = 0, viewM = 0;
  var calLocale = function () { return LOCALES[I.lang] || "es-VE"; };
  function paintDate() {
    var iso = F.date.value;
    /* the year only when it isn't this year: keeps "jue, 12 nov" inside the narrow phone column */
    var fmt = { weekday: "short", day: "numeric", month: "short" }; if (validISO(iso) && iso.slice(0, 4) !== now().iso.slice(0, 4)) fmt.year = "numeric";
    calTxt.textContent = validISO(iso) ? noon(iso).toLocaleDateString(calLocale(), fmt) : I.t("rv.datePh");
    calTxt.classList.toggle("ph", !validISO(iso));
  }
  function dayWhy(iso) { /* "" = bookable; else why not */
    if (iso < dMin || iso > dMax) return "out";
    var s = slots(iso); return s === null ? "closed" : !s.length ? "noTimes" : "";
  }
  function calBtnEl(cls, label, nav, disabled, glyph) {
    var b = doc.createElement("button"); b.type = "button"; b.className = cls; b.setAttribute("aria-label", label); b.setAttribute("data-nav", nav);
    b.innerHTML = glyph; b.disabled = disabled; return b;
  }
  function renderCal() {
    var loc = calLocale(), lo = +dMin.slice(0, 4) * 12 + (+dMin.slice(5, 7) - 1), hi = +dMax.slice(0, 4) * 12 + (+dMax.slice(5, 7) - 1), cur = viewY * 12 + viewM;
    cal.textContent = ""; cal.setAttribute("aria-label", I.t("rv.cal.label"));
    var head = doc.createElement("div"); head.className = "rv-cal-h";
    var title = doc.createElement("b"); title.setAttribute("aria-live", "polite");
    title.textContent = new Date(viewY, viewM, 1, 12).toLocaleDateString(loc, { month: "long", year: "numeric" });
    var chev = function (d) { return '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' + d + '"/></svg>'; };
    head.appendChild(calBtnEl("rv-cal-nav", I.t("rv.cal.prev"), "-1", cur <= lo, chev("M15 6l-6 6 6 6")));
    head.appendChild(title);
    head.appendChild(calBtnEl("rv-cal-nav", I.t("rv.cal.next"), "1", cur >= hi, chev("M9 6l6 6-6 6")));
    cal.appendChild(head);
    var wk = doc.createElement("div"); wk.className = "rv-cal-w"; wk.setAttribute("aria-hidden", "true");
    for (var i = 0; i < 7; i++) { var s = doc.createElement("span"); s.textContent = new Date(2024, 0, 1 + i, 12).toLocaleDateString(loc, { weekday: "narrow" }); wk.appendChild(s); } /* Monday first */
    cal.appendChild(wk);
    var grid = doc.createElement("div"), lead = (new Date(viewY, viewM, 1, 12).getDay() + 6) % 7, n = new Date(viewY, viewM + 1, 0, 12).getDate();
    grid.className = "rv-cal-g";
    for (var k = 0; k < lead; k++) grid.appendChild(doc.createElement("i"));
    for (var d = 1; d <= n; d++) {
      var iso = viewY + "-" + pad(viewM + 1) + "-" + pad(d), why = dayWhy(iso), b = doc.createElement("button");
      b.type = "button"; b.className = "rv-day" + (iso === F.date.value ? " on" : "") + (iso === now().iso ? " today" : "") + (why === "closed" ? " closed" : "");
      b.textContent = d; b.setAttribute("data-iso", iso); b.disabled = !!why;
      b.setAttribute("aria-label", new Date(viewY, viewM, d, 12).toLocaleDateString(loc, { weekday: "long", day: "numeric", month: "long", year: "numeric" }) + (why === "closed" ? ", " + I.t("rv.cal.closed") : why === "noTimes" ? ", " + I.t("rv.cal.noTimes") : ""));
      if (why === "closed" || why === "noTimes") b.title = I.t(why === "closed" ? "rv.cal.closed" : "rv.cal.noTimes");
      if (iso === F.date.value) b.setAttribute("aria-pressed", "true");
      grid.appendChild(b);
    }
    while (grid.children.length < 42) grid.appendChild(doc.createElement("i")); /* always 6 rows: a shorter month would shrink the page under the cursor and move the arrows */
    cal.appendChild(grid);
  }
  function focusDay(prefer) {
    var el = (prefer && cal.querySelector('.rv-day[data-iso="' + prefer + '"]:not(:disabled)')) || cal.querySelector(".rv-day.on") || cal.querySelector(".rv-day:not(:disabled)");
    if (el) el.focus({ preventScroll: true });
  }
  function openCal() {
    var v = validISO(F.date.value) ? F.date.value : dMin;
    viewY = +v.slice(0, 4); viewM = +v.slice(5, 7) - 1;
    renderCal(); cal.hidden = false; calIsOpen = true; calBtn.setAttribute("aria-expanded", "true"); focusDay();
  }
  function closeCal(back) { cal.hidden = true; calIsOpen = false; calBtn.setAttribute("aria-expanded", "false"); if (back) calBtn.focus({ preventScroll: true }); }
  calBtn.addEventListener("click", function () { if (calIsOpen) closeCal(); else openCal(); });
  cal.addEventListener("click", function (e) {
    var b = e.target.closest ? e.target.closest("button") : null; if (!b || b.disabled) return;
    if (b.hasAttribute("data-nav")) {
      var m = viewY * 12 + viewM + (+b.getAttribute("data-nav")); viewY = Math.floor(m / 12); viewM = m % 12; renderCal();
      var again = cal.querySelector('[data-nav="' + b.getAttribute("data-nav") + '"]:not(:disabled)') || cal.querySelector(".rv-day:not(:disabled)"); if (again) again.focus({ preventScroll: true });
      return;
    }
    if (b.hasAttribute("data-iso")) {
      F.date.value = b.getAttribute("data-iso");
      F.date.dispatchEvent(new Event("change", { bubbles: true })); /* fills the times and clears the date error, as the native picker did */
      paintDate(); closeCal(true);
    }
  });
  /* the path is read from the event itself: a month arrow redraws the calendar, so by now e.target is detached and cal.contains(e.target) would be false */
  doc.addEventListener("click", function (e) {
    if (!calIsOpen) return;
    var path = e.composedPath ? e.composedPath() : [];
    if (path.indexOf(cal) > -1 || path.indexOf(calBtn) > -1) return;
    if (!path.length && (cal.contains(e.target) || calBtn.contains(e.target))) return;
    closeCal();
  });
  doc.addEventListener("keydown", function (e) {
    if (!calIsOpen) return;
    if (e.key === "Escape") { e.preventDefault(); closeCal(true); return; }
    var day = e.target && e.target.classList && e.target.classList.contains("rv-day") ? e.target : null, step = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }[e.key];
    if (!day || !step) return;
    e.preventDefault();
    var days = [].slice.call(cal.querySelectorAll(".rv-day")), i = days.indexOf(day) + step;
    while (i >= 0 && i < days.length && days[i].disabled) i += step > 0 ? 1 : -1;
    if (i >= 0 && i < days.length) days[i].focus({ preventScroll: true });
  });

  /* ---------- events ---------- */
  F.date.addEventListener("change", function () { check("date"); if (errs.time) check("time"); paintErrs(); });
  F.time.addEventListener("change", function () { var c = timeVal(); if (c) showTime(c); if (errs.time) { check("time"); paintErrs(); } });
  F.time.addEventListener("input", timeKeys);
  F.ampm.addEventListener("change", function () { if (errs.time) { check("time"); paintErrs(); } });

  F.name.addEventListener("input", function () { if (errs.name) { check("name"); paintErrs(); } });
  F.notes.addEventListener("input", function () { if (errs.notes) { check("notes"); paintErrs(); } });
  /* Puerto La Cruz has no seating areas or table photos on the page: hide them and drop any zone/table already chosen */
  function syncBranch() {
    var plc = F.branch.value === "plc";
    $("#areaG").hidden = plc;
    if (plc) { $("#aAny").checked = true; table = ""; }
    showPlan();
  }
  form.addEventListener("change", function (e) { if (e.target.name === "branch") { check("branch"); paintErrs(); syncBranch(); } });
  /* ---------- "¿Quieres un presupuesto?" (last question of the form) ----------
     "No" (default) = the normal reservation, sent with the Reservar button. "Sí" stays locked until every field is valid, and choosing
     it IS the submit: the reservation is saved (sessionStorage "amir-presupuesto") and the guest goes to the menu; pedir.js prefills
     their name, phone and branch and sends the reservation together with the order to WhatsApp. */
  var REQUIRED = ["branch", "date", "time", "name", "phone", "docid", "notes"];
  function isOk(n) { var keep = errs[n], ok = check(n); errs[n] = keep; return ok; } /* check() without changing the error on screen */
  /* the guest's pending presupuesto: sessionStorage "amir-presupuesto" = { form: {every field}, dishes: [{qty,name,ui,total}] | null, sub }.
     "Sí" saves the form and sends them to pedir.html?presupuesto=1 to pick dishes; "Listo" there adds dishes and brings them back here. */
  var PEND_KEY = "amir-presupuesto", PICK_KEY = "amir-presupuesto-cart", picks = null;
  function readPending() { try { var v = JSON.parse(sessionStorage.getItem(PEND_KEY) || "null"); return v && v.form ? v : null; } catch (e) { return null; } }
  function writePending(v) { try { sessionStorage.setItem(PEND_KEY, JSON.stringify(v)); return true; } catch (e) { return false; } }
  function clearPending() { try { sessionStorage.removeItem(PEND_KEY); localStorage.removeItem(PICK_KEY); } catch (e) { /* ignore */ } }
  function formState() {
    return { branch: F.branch.value, area: F.area.value, table: table, people: F.people.value, date: F.date.value, time: timeVal(), hours: F.hours.value,
      name: F.name.value, phone: F.phone.value, docid: F.docid.value, notes: F.notes.value };
  }
  function paintQuote() {
    var ok = REQUIRED.every(isOk), h = $("#quoteH"), key = picks ? "rv.quote.ready" : ok ? "rv.quote.hint" : "rv.quote.lock";
    $("#qYes").disabled = !ok && !picks; h.setAttribute("data-i18n", key); h.textContent = I.t(key);
    paintPicks();
  }
  function paintPicks() { /* the dishes they chose, under the question (Spanish names are stored for WhatsApp; the on-screen name is in the language they used) */
    var box = $("#picks"); box.hidden = !picks; if (!picks) return;
    var ul = $("#picksList"); ul.textContent = "";
    picks.dishes.forEach(function (d) { var li = doc.createElement("li"), a = doc.createElement("span"), b = doc.createElement("span"); a.textContent = d.qty + "× " + (d.ui || d.name); b.textContent = I.money(d.total); li.appendChild(a); li.appendChild(b); ul.appendChild(li); });
    $("#picksSub").textContent = I.t("rv.quote.sub", { amount: I.money(picks.sub) });
  }
  function quoteOff() { if (F.quote) F.quote.value = picks ? "yes" : "no"; }
  function dropPicks() { /* "No" again, or the reservation was sent: forget the dishes */
    picks = null; try { localStorage.removeItem(PICK_KEY); } catch (e) { /* ignore */ }
    var v = readPending(); if (v) { v.dishes = null; v.sub = 0; writePending(v); }
    quoteOff(); paintQuote();
  }
  /* back from the menu (or the Back button): put every field as they left it, and show the dishes if they chose some */
  function restoreForm() {
    var v = readPending(); if (!v) return; var f = v.form, radio = function (name, val) { var r = [].filter.call(form.querySelectorAll('input[name="' + name + '"]'), function (i) { return i.value === val; })[0]; if (r) r.checked = true; };
    radio("branch", f.branch); radio("area", f.area || "");
    if (validISO(f.date) && f.date >= dMin && f.date <= dMax) F.date.value = f.date;
    paintDate(); if (f.time) showTime(f.time);
    F.people.value = f.people; F.hours.value = f.hours; F.name.value = f.name; F.phone.value = f.phone; F.docid.value = f.docid; F.notes.value = f.notes;
    syncBranch(); /* shows/hides the floors and the table photos for the restored branch and floor */
    if (f.table) plansReady.then(function () { table = f.table; paintTable(); }); /* after the picker has been redrawn (that clears the table) */
    if (v.dishes && v.dishes.length) picks = { dishes: v.dishes, sub: v.sub || 0 };
  }
  /* every missing field shows its error and shakes (the same .shake as the order page, styled in assets/v4/polish.css); true if anything was missing */
  function flagMissing() {
    var bad = REQUIRED.filter(function (n) { return !check(n); });
    paintErrs();
    if (!bad.length) return false;
    bad.forEach(function (n) {
      var box = n === "branch" ? $("#branchG") : F[n].closest(".f"); if (!box) return;
      box.classList.remove("shake"); void box.offsetWidth; box.classList.add("shake");
      box.addEventListener("animationend", function end(ev) { if (ev.animationName !== "shake") return; box.classList.remove("shake"); box.removeEventListener("animationend", end); });
    });
    (bad[0] === "branch" ? F.branch[0] : bad[0] === "date" ? calBtn : F[bad[0]]).focus();
    return true;
  }
  function startQuote() {
    if (flagMissing()) { quoteOff(); paintQuote(); return; }
    var prev = readPending(), keep = prev && prev.dishes && prev.dishes.length; /* editing dishes already chosen: they stay selected on the menu */
    if (!keep) { try { localStorage.removeItem(PICK_KEY); } catch (e) { /* ignore */ } }
    if (!writePending({ form: formState(), dishes: keep ? prev.dishes : null, sub: keep ? prev.sub : 0 })) { quoteOff(); $("#quoteH").textContent = I.t("rv.quote.fail"); return; } /* storage blocked: stay, they can use Reservar */
    location.href = "pedir.html?presupuesto=1#entradas-arabes"; /* the menu, in "pick dishes" mode, at the first section */
  }
  form.addEventListener("input", paintQuote);
  form.addEventListener("change", function (e) {
    if (e.target.name === "quote") { if (e.target.value === "yes") startQuote(); else if (picks) dropPicks(); return; }
    paintQuote();
  });
  $("#picksEdit").addEventListener("click", startQuote);
  /* tapping the locked "Sí" shows what is missing instead of doing nothing */
  $("#qYes").nextElementSibling.addEventListener("click", function () { if ($("#qYes").disabled) flagMissing(); });
  window.addEventListener("pageshow", function () { quoteOff(); syncBranch(); paintQuote(); }); /* Back button: keep "Sí" only if they have dishes, re-apply the restored branch */

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (flagMissing()) return;
    var b = branchOf(F.branch.value) || { nombre: "", whatsapp: "" }, people = F.people.value, area = F.area.value;
    var msg = I.buildReservationMessage({
      name: F.name.value.trim(), phone: F.phone.value.trim(), docid: normDocid(F.docid.value), people: people === "+8" ? I.tEs("res.more8") : people,
      dateISO: F.date.value, time: timeVal(), notes: F.notes.value, branch: b.nombre,
      area: area ? I.tEs("rv.area." + area) : "", hours: F.hours.value + " " + I.tEs("rv.min"), table: table,
      quote: picks && F.quote.value === "yes" ? picks : null /* the dishes of the presupuesto, if they asked for one */
    });
    var base = "https://wa.me/" + (b.whatsapp || C.whatsapp) + "?text=";
    if ((base + encodeURIComponent(msg)).length > 1900) { /* a very long dish list: cut from the end (the reservation details come first) */
      var ls = msg.split("\n"); while (ls.length > 12 && (base + encodeURIComponent(ls.join("\n") + "\n…")).length > 1900) ls.pop();
      msg = ls.join("\n") + "\n…";
    }
    sent = { branch: b.nombre, area: area, table: table, people: people, date: F.date.value, time: timeVal(), url: base + encodeURIComponent(msg) };
    var win = window.open(sent.url, "_blank");
    if (win) { try { win.opener = null; } catch (er) { /* ignore */ } }
    clearPending(); picks = null; quoteOff(); paintQuote(); /* the presupuesto went with this reservation */
    paintDone();
    form.hidden = true; done.hidden = false;
    done.focus({ preventScroll: true }); done.scrollIntoView({ block: "start" });
  });
  $("#doneEdit").addEventListener("click", function () { done.hidden = true; form.hidden = false; calBtn.focus(); });
  doc.addEventListener("langchange", function () { [].forEach.call(doc.querySelectorAll(".rv-zoom"), function (b) { b.setAttribute("aria-label", I.t("rv.zoom")); }); paintDate(); if (calIsOpen) renderCal(); paintQuote(); fillDurations(); paintErrs(); hours(); paintTable(); paintDone(); });

  /* ---------- start: today if there is still a time to offer, otherwise tomorrow ---------- */
  var t0 = now().iso, s0 = slots(t0);
  dMin = t0; dMax = LAST_DATE;
  if (!F.date.value) F.date.value = s0 && s0.length ? t0 : addDays(t0, 1);
  paintDate();
  I.apply(doc);
  fillDurations(); hours();
  restoreForm(); quoteOff(); paintQuote(); /* back from the menu: everything as they left it, plus their dishes */
  (function landOnQuote() { /* "reservar.html#presupuesto" (the menu's Listo): show the question with their dishes, and hold it there while the page settles */
    if (location.hash !== "#presupuesto" || !picks) return;
    var touched = false, t0 = Date.now();
    ["wheel", "touchstart", "keydown", "mousedown"].forEach(function (ev) { addEventListener(ev, function () { touched = true; }, { once: true, passive: true }); });
    (function keep() { var q = $(".rv-quote"); if (q && !touched) q.scrollIntoView({ block: "center", behavior: "instant" }); if (!touched && Date.now() - t0 < 2500) setTimeout(keep, 120); })();
  })();
  reveal();
})();
