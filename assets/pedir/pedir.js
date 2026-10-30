/* =====================================================================
   El Amir Palace · pedir.html
   1) PedirRender: markup builders shared with scripts/prerender-menu.js
      (the static HTML and the live page are built by the same code).
   2) App: cart, options, checkout, WhatsApp order, i18n (ES / EN / AR).
   Data: assets/pedir/menu.js (MENU, PHOTOS…) · config.js (CONFIG) · i18n.js (I18N)
   ===================================================================== */
(function (G) {
  "use strict";
  const slug = s => String(s).normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/gi, "-").replace(/^-+|-+$/g, "").toLowerCase();
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  /* same output as I18N.money(): "$8" · "$1.50" */
  const money = n => { n = +n || 0; return "$" + (Math.abs(n - Math.round(n)) < 0.005 ? String(Math.round(n)) : n.toFixed(2)); };
  const dishId = (cat, name) => slug(cat) + "--" + slug(name);
  const sig = (...parts) => { const s = JSON.stringify(parts); let h = 5381; for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0; return (h >>> 0).toString(36); };

  /* one stroke weight for every glyph (styled in assets/v4/pedir.css) */
  const PLUS = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>';
  const MINUS = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/></svg>';
  function ctl(id, d, q, I, pop) {
    const name = I.dish(d.name, d.desc, d.cat).name;
    if (d.opts || d.extras) {
      return `<button type="button" class="add" data-opt="1" aria-haspopup="dialog" aria-label="${esc(q ? I.t("dish.chooseOptionsQty", { name, qty: q }) : I.t("dish.chooseOptions", { name }))}">${PLUS}${q ? `<i class="bd" aria-hidden="true">${q}</i>` : ""}</button>`;
    }
    if (!q) return `<button type="button" class="add" data-d="1" aria-label="${esc(I.t("dish.add", { name }))}">${PLUS}</button>`;
    return `<span class="step${pop ? " pop" : ""}"><button type="button" data-d="-1" aria-label="${esc(I.t("dish.removeOne", { name }))}">${MINUS}</button><b aria-hidden="true">${q}</b><span class="sr">${esc(I.t("dish.inOrder", { qty: q }))}</span><button type="button" data-d="1" aria-label="${esc(I.t("dish.addAnother", { name }))}">${PLUS}</button></span>`;
  }
  /* the dish name is a button: it opens the dish sheet, and its ::after makes the whole row tappable */
  const openBtn = name => `<button type="button" class="dish-go" aria-haspopup="dialog">${esc(name)}</button>`;
  /* photo paths: our own photos are "img/x" (+ .webp, thumb in assets/pedir/thumbs); PedidosYa ones carry their extension ("img/pya/id.jpg", thumb "id-th.jpg") */
  const hasExt = p => /\.\w{3,4}$/.test(p);
  const phSrc = p => hasExt(p) ? p : p + ".webp";
  const phTh = p => hasExt(p) ? p.replace(/(\.\w+)$/, "-th$1") : "assets/pedir/thumbs/" + p.split("/").pop() + ".webp";
  const FEAT = "destacados";
  /* "Destacados" keeps the curated studio photos only (the PedidosYa set would turn it into the whole menu) */
  function featured(menu, photos) {
    const out = [];
    if (photos) menu.forEach(([cat, , list]) => list.forEach(([name, price, desc, opts, extras]) => { const id = dishId(cat, name); if (photos[id] && !hasExt(photos[id])) out.push([id, { name, price, cat, desc: desc || "", opts: opts || null, extras: extras || null }, photos[id]]); }));
    return out;
  }
  function chips(menu, I, photos) {
    // small photo per section (6 KB thumbs from scripts/make-thumbs.js); sections without one get a gold mark
    const TH = { "entradas-arabes": "bandeja-arabe-640", "entradas-mediterraneas": "carpaccio-480", "sopas-y-cremas": "crema-auyama-480", "ensaladas": "ensalada-burrata-480",
      "platos-arabes-especiales": "tabaquitos-uva", "shawarmas-y-sandwiches": "shawarma-wrap-640", "brochetas-y-parrillas": "parrilla-mixta-640", "carnes-y-aves": "pollo-brasa-el-amir-480",
      "pescados-y-mariscos": "dynamite-shrimp-640", "arroces": "fideua-640", "pastas": "rigatoni-480", "hamburguesas": "oh-my-burger-480" };
    return menu.map(([cat]) => {
      const s = slug(cat), th = TH[s];
      const pic = th ? '<img src="assets/pedir/thumbs/' + th + '.webp" width="30" height="30" alt="" decoding="async">' : '<i class="chip-dot" aria-hidden="true"></i>';
      return '<a href="#' + s + '" data-c="' + s + '">' + pic + esc(I.cat(cat)) + "</a>";
    }).join("");
  }
  /* "Destacados": a swipeable rail of photo cards (only dishes that have a real photo) */
  function feat(menu, I, photos, qty) {
    const list = featured(menu, photos);
    if (!list.length) return "";
    return `<section class="cat feat" id="${FEAT}" aria-labelledby="h-${FEAT}"><div class="cat-h"><h2 id="h-${FEAT}">${esc(I.t("chips.featured"))}</h2></div><ul class="cards">` +
      list.map(([id, d, ph]) => `<li class="dish card" data-id="${id}"><img class="ph" src="${phSrc(ph)}" alt="" width="640" height="480" loading="lazy" decoding="async">` +
        `<div class="tx"><h3 class="nm">${openBtn(I.dish(d.name, d.desc, d.cat).name)}</h3><span class="pr">${money(d.price)}</span></div>` +
        `<div class="ctl">${ctl(id, d, qty ? qty(id) : 0, I)}</div></li>`).join("") + `</ul></section>`;
  }
  function cats(menu, I, photos, qty) {
    return feat(menu, I, photos, qty) + menu.map(([cat, note, list]) => {
      const cid = slug(cat), mc = I.menu && I.menu[cat];
      const ar = I.lang !== "ar" && mc && mc.ar && mc.ar.name ? mc.ar.name : "";
      const items = list.map(([name, price, desc, opts, extras]) => {
        const id = cid + "--" + slug(name), T = I.dish(name, desc, cat), ph = photos && photos[id];
        const d = { name, price, cat, desc: desc || "", opts: opts || null, extras: extras || null };
        /* dishes without a real photo get a branded placeholder in the same slot */
        return `<li class="dish has-ph" data-id="${id}">` +
          (ph ? `<img class="ph" src="${phTh(ph)}" alt="" width="72" height="72" loading="lazy" decoding="async">` : `<span class="ph ph-empty" aria-hidden="true"></span>`) +
          `<div class="tx"><div class="r1"><h3 class="nm">${openBtn(T.name)}</h3><span class="pr">${money(price)}</span></div>` +
          (T.desc ? `<p class="ds">${esc(T.desc)}</p>` : "") +
          `</div><div class="ctl">${ctl(id, d, qty ? qty(id) : 0, I)}</div></li>`;
      }).join("");
      return `<section class="cat" id="${cid}" aria-labelledby="h-${cid}"><div class="cat-h"><h2 id="h-${cid}">${esc(I.cat(cat))}</h2>` +
        (ar ? `<span class="ar" lang="ar" aria-hidden="true">${esc(ar)}</span>` : "") + `</div>` +
        (note ? `<p class="note">${esc(I.note(note))}</p>` : "") + `<ul class="list">${items}</ul></section>`;
    }).join("");
  }
  G.PedirRender = { slug, esc, money, dishId, sig, ctl, chips, cats, phSrc, phTh, PLUS, MINUS };
})(typeof window !== "undefined" ? window : globalThis);


(function () {
  "use strict";
  if (typeof document === "undefined" || window.__PRERENDER__) return;
  const doc = document, html = doc.documentElement, R = window.PedirRender, I = window.I18N;
  const reveal = () => html.classList.remove("i18n-wait");
  if (!I || typeof MENU === "undefined" || typeof CONFIG === "undefined") { reveal(); console.warn("pedir: falta i18n.js, config.js o assets/pedir/menu.js"); return; }
  const PH = typeof PHOTOS !== "undefined" ? PHOTOS : {};

  /* ---------- page-only strings (merged into I18N.dict) ---------- */
  const PX = {
    es: {
      "meta.pedir.title": "Menú y pedidos a domicilio | El Amir Palace Lechería",
      "meta.pedir.description": "Carta completa de El Amir Palace en Lechería con precios: mezze, shawarmas, bandejas árabes, parrillas y mariscos. Pide delivery o retiro por WhatsApp.",
      "meta.pedir.ogDescription": "Mezze, shawarmas y parrillas libanesas en Lechería. Delivery o retiro, confirmación por WhatsApp.",
      "px.kicker": "Carta completa · Lechería · Puerto La Cruz",
      "px.updated": "Precios en dólares, sin IVA · Actualizado el {date}",
      "px.addrSoon": "Lechería, Anzoátegui, Venezuela",
      "px.mm.title": "Datos para el Pago móvil",
      "px.mm.titleBs": "Datos para el Pago móvil (monto en Bs. a tasa BCV)",
      "px.mm.later": "Te enviaremos los datos del Pago móvil por WhatsApp al confirmar tu pedido.",
      "px.zelle.later": "Te enviaremos el correo de Zelle por WhatsApp al confirmar tu pedido.",
      "px.pay.binance": "Binance Pay", "px.pay.zinli": "Zinli", "px.pay.transfer": "Transferencia bancaria",
      "px.nm.binance": "Binance Pay", "px.nm.zinli": "Zinli", "px.nm.zelle": "Zelle", "px.nm.transferencia": "la transferencia bancaria",
      "px.ex.title": "Datos para {name}",
      "px.ex.titleBs": "Datos para {name} (monto en Bs. a tasa BCV)",
      "px.ex.later": "Te enviaremos los datos de {name} por WhatsApp al confirmar tu pedido.",
      "px.kv.payId": "Pay ID", "px.kv.account": "Cuenta", "px.kv.holder": "Titular", "px.kv.amountCur": "Monto ({cur})",
      "px.pay.cashBs": "Efectivo (Bs.)",
      "px.cashBs.amt": "Pagarás <b>{bs}</b> en efectivo (Bs.) al recibir.",
      "px.cashBs.later": "Pagarás en efectivo (Bs.) al recibir.",
      "px.payRef": "Número de referencia (si ya pagaste)", "px.payRefPh": "Ej. 012345678",
      "px.when.now": "Pagar ahora · más rápido", "px.when.later": "Pagar al recibir",
      "px.when.nowHint": "Paga con estos datos y sube el comprobante. Preparamos tu pedido apenas lo confirmemos.",
      "px.when.laterHint": "Pagarás al recibir tu pedido. Confirmaremos los detalles por WhatsApp.",
      "px.note.label": "Indicaciones (opcional)", "px.note.ph": "Ej. sin sal, salsa aparte, bien cocido…", "px.step.1": "Entrega", "px.step.2": "Tus datos", "px.step.3": "Pago", "px.step.next": "Continuar", "px.send.short": "Enviar por WhatsApp", "px.step.back": "Atrás",
      "px.more.ref": "+ Punto de referencia", "px.more.loc": "+ Ubicación en el mapa", "px.more.notes": "+ Nota para la cocina",
      "px.receipt.add": "Subir comprobante de pago", "px.receipt.ok": "Comprobante listo: {name}", "px.receipt.remove": "Quitar",
      "px.receipt.share": "Enviar comprobante por WhatsApp", "px.receipt.shareText": "Comprobante de pago, pedido {id}",
      "px.receipt.doneShare": "Último paso: envía tu comprobante al chat del restaurante.",
      "px.receipt.doneManual": "Último paso: adjunta la foto de tu comprobante en el chat de WhatsApp.",
      "px.results.one": "{n} plato encontrado", "px.results.other": "{n} platos encontrados",
      "px.top": "Volver arriba", "px.backHome": "Volver al inicio", "px.menuPdf": "Carta en PDF",
      "px.copied": "Copiado",
      "px.loc.label": "Tu ubicación en el mapa",
      "px.loc.err": "Marca tu ubicación: así enviamos tu pedido a la sucursal más cercana.",
      "px.loc.req": "Obligatorio", "px.loc.need": "Marca tu ubicación",
      "px.loc.use": "Usar mi ubicación actual",
      "px.loc.map": "Marcar en el mapa",
      "px.loc.remove": "Quitar ubicación",
      "px.loc.locating": "Buscando tu ubicación…",
      "px.loc.ok": "Ubicación agregada (±{acc} m). Mueve el pin si hace falta.",
      "px.loc.set": "Ubicación marcada en el mapa. Mueve el pin si hace falta.",
      "px.loc.saved": "Usaremos tu ubicación guardada. Puedes ajustarla en el mapa.",
      "px.loc.tap": "Toca el mapa para colocar el pin en tu puerta.",
      "px.loc.denied": "No diste permiso para usar tu ubicación. Márcala en el mapa.",
      "px.loc.unavailable": "No pudimos obtener tu ubicación. Márcala en el mapa.",
      "px.loc.timeout": "La ubicación tardó demasiado. Inténtalo de nuevo o márcala en el mapa.",
      "px.loc.unsupported": "Este navegador no permite compartir la ubicación. Márcala en el mapa.",
      "px.loc.mapError": "No se pudo cargar el mapa. Usa tu ubicación actual o inténtalo de nuevo.",
      "px.loc.mapAria": "Mapa para confirmar tu ubicación. Toca el mapa o arrastra el pin.",
      "px.loc.pin": "Tu ubicación de entrega",
      "px.branch.serves": "Te atiende: Sucursal {name}",
      "px.branch.pick": "¿En qué sucursal lo retiras?",
      "px.branch.err": "Elige la sucursal donde retiras tu pedido."
    },
    en: {
      "meta.pedir.title": "Menu & Delivery Orders | El Amir Palace Lechería",
      "meta.pedir.description": "Full menu of El Amir Palace in Lechería, Venezuela, with prices: Lebanese mezze, shawarma, Arabic platters, grills and seafood. Order delivery or pickup on WhatsApp.",
      "meta.pedir.ogDescription": "Lebanese mezze, shawarma and grills in Lechería. Delivery or pickup, confirmed on WhatsApp.",
      "px.kicker": "Full menu · Lechería · Puerto La Cruz",
      "px.updated": "Prices in US dollars, VAT not included · Updated {date}",
      "px.addrSoon": "Lechería, Anzoátegui, Venezuela",
      "px.mm.title": "Pago Móvil details",
      "px.mm.titleBs": "Pago Móvil details (amount in Bs. at the BCV rate)",
      "px.mm.later": "We'll send you the Pago Móvil details on WhatsApp when we confirm your order.",
      "px.zelle.later": "We'll send you our Zelle e-mail on WhatsApp when we confirm your order.",
      "px.pay.binance": "Binance Pay", "px.pay.zinli": "Zinli", "px.pay.transfer": "Bank transfer (Bs.)",
      "px.nm.binance": "Binance Pay", "px.nm.zinli": "Zinli", "px.nm.zelle": "Zelle", "px.nm.transferencia": "bank transfer",
      "px.ex.title": "Payment details ({name})",
      "px.ex.titleBs": "Payment details ({name}, amount in Bs. at the BCV rate)",
      "px.ex.later": "We'll send you the {name} details on WhatsApp when we confirm your order.",
      "px.kv.payId": "Pay ID", "px.kv.account": "Account", "px.kv.holder": "Holder", "px.kv.amountCur": "Amount ({cur})",
      "px.pay.cashBs": "Cash (Bs.)",
      "px.cashBs.amt": "You will pay <b>{bs}</b> in cash (Bs.) when you receive your order.",
      "px.cashBs.later": "You will pay in cash (Bs.) when you receive your order.",
      "px.payRef": "Payment reference (if you've already paid)", "px.payRefPh": "e.g. 012345678",
      "px.when.now": "Pay now · faster", "px.when.later": "Pay on delivery",
      "px.when.nowHint": "Pay with these details and upload the receipt. We start preparing your order as soon as we confirm it.",
      "px.when.laterHint": "You will pay when you receive your order. We'll confirm the details on WhatsApp.",
      "px.note.label": "Special instructions (optional)", "px.note.ph": "e.g. no salt, sauce on the side, well done…", "px.step.1": "Delivery", "px.step.2": "Your details", "px.step.3": "Payment", "px.step.next": "Continue", "px.send.short": "Send on WhatsApp", "px.step.back": "Back",
      "px.more.ref": "+ Landmark", "px.more.loc": "+ Location on the map", "px.more.notes": "+ Note for the kitchen",
      "px.receipt.add": "Upload payment receipt", "px.receipt.ok": "Receipt ready: {name}", "px.receipt.remove": "Remove",
      "px.receipt.share": "Send receipt on WhatsApp", "px.receipt.shareText": "Payment receipt, order {id}",
      "px.receipt.doneShare": "Last step: send your receipt to the restaurant's chat.",
      "px.receipt.doneManual": "Last step: attach the photo of your receipt in the WhatsApp chat.",
      "px.results.one": "{n} dish found", "px.results.other": "{n} dishes found",
      "px.top": "Back to top", "px.backHome": "Back to home", "px.menuPdf": "Menu (PDF)",
      "px.copied": "Copied",
      "px.loc.label": "Your location on the map",
      "px.loc.err": "Set your location so we can send your order to the nearest branch.",
      "px.loc.req": "Required", "px.loc.need": "Set your location",
      "px.loc.use": "Use my current location",
      "px.loc.map": "Pick on the map",
      "px.loc.remove": "Remove location",
      "px.loc.locating": "Finding your location…",
      "px.loc.ok": "Location added (±{acc} m). Drag the pin if needed.",
      "px.loc.set": "Location pinned on the map. Drag the pin if needed.",
      "px.loc.saved": "We'll use your saved location. You can adjust it on the map.",
      "px.loc.tap": "Tap the map to drop the pin at your door.",
      "px.loc.denied": "Location permission was denied. Pick it on the map.",
      "px.loc.unavailable": "We couldn't get your location. Pick it on the map.",
      "px.loc.timeout": "Finding your location took too long. Try again or pick it on the map.",
      "px.loc.unsupported": "This browser can't share your location. Pick it on the map.",
      "px.loc.mapError": "The map couldn't load. Use your current location or try again.",
      "px.loc.mapAria": "Map to confirm your location. Tap the map or drag the pin.",
      "px.loc.pin": "Your delivery location",
      "px.branch.serves": "Your order goes to our {name} branch",
      "px.branch.pick": "Which branch will you pick up from?",
      "px.branch.err": "Choose the branch where you'll pick up your order."
    },
    ar: {
      "meta.pedir.title": "القائمة وطلبات التوصيل | El Amir Palace ليتشيريا",
      "meta.pedir.description": "القائمة الكاملة لمطعم El Amir Palace في ليتشيريا، فنزويلا، مع الأسعار: مقبلات لبنانية وشاورما وصوانٍ عربية ومشاوي ومأكولات بحرية. اطلب توصيلاً أو استلاماً عبر واتساب.",
      "meta.pedir.ogDescription": "مقبلات وشاورما ومشاوي لبنانية في ليتشيريا. توصيل أو استلام مع التأكيد عبر واتساب.",
      "px.kicker": "القائمة الكاملة · ليتشيريا · بويرتو لا كروث",
      "px.updated": "الأسعار بالدولار الأمريكي ولا تشمل الضريبة · آخر تحديث {date}",
      "px.addrSoon": "ليتشيريا، أنزواتيغي، فنزويلا",
      "px.mm.title": "بيانات الدفع عبر Pago Móvil",
      "px.mm.titleBs": "بيانات الدفع عبر Pago Móvil (المبلغ بالبوليفار حسب سعر البنك المركزي)",
      "px.mm.later": "سنرسل لك بيانات الدفع عبر Pago Móvil على واتساب عند تأكيد طلبك.",
      "px.zelle.later": "سنرسل لك بريد Zelle الإلكتروني على واتساب عند تأكيد طلبك.",
      "px.pay.binance": "Binance Pay", "px.pay.zinli": "Zinli", "px.pay.transfer": "تحويل بنكي (بوليفار)",
      "px.nm.binance": "Binance Pay", "px.nm.zinli": "Zinli", "px.nm.zelle": "Zelle", "px.nm.transferencia": "التحويل البنكي",
      "px.ex.title": "بيانات الدفع عبر {name}",
      "px.ex.titleBs": "بيانات الدفع عبر {name} (المبلغ بالبوليفار حسب سعر البنك المركزي)",
      "px.ex.later": "سنرسل لك بيانات الدفع عبر {name} على واتساب عند تأكيد طلبك.",
      "px.kv.payId": "Pay ID", "px.kv.account": "رقم الحساب", "px.kv.holder": "صاحب الحساب", "px.kv.amountCur": "المبلغ ({cur})",
      "px.pay.cashBs": "نقداً (بالبوليفار)",
      "px.cashBs.amt": "ستدفع <b>{bs}</b> نقداً بالبوليفار عند استلام طلبك.",
      "px.cashBs.later": "ستدفع نقداً بالبوليفار عند استلام طلبك.",
      "px.payRef": "رقم مرجع الدفع (إذا كنت قد دفعت)", "px.payRefPh": "مثال: 012345678",
      "px.when.now": "ادفع الآن · أسرع", "px.when.later": "ادفع عند الاستلام",
      "px.when.nowHint": "ادفع باستخدام هذه البيانات وارفع إيصال الدفع. نبدأ بتحضير طلبك فور تأكيده.",
      "px.when.laterHint": "ستدفع عند استلام طلبك. سنؤكد التفاصيل عبر واتساب.",
      "px.note.label": "تعليمات خاصة (اختياري)", "px.note.ph": "مثال: بدون ملح، الصلصة جانباً، مطهو جيداً…", "px.step.1": "التوصيل", "px.step.2": "بياناتك", "px.step.3": "الدفع", "px.step.next": "متابعة", "px.send.short": "أرسل عبر واتساب", "px.step.back": "رجوع",
      "px.more.ref": "+ معلم قريب", "px.more.loc": "+ الموقع على الخريطة", "px.more.notes": "+ ملاحظة للمطبخ",
      "px.receipt.add": "ارفع إيصال الدفع", "px.receipt.ok": "الإيصال جاهز: {name}", "px.receipt.remove": "إزالة",
      "px.receipt.share": "أرسل الإيصال عبر واتساب", "px.receipt.shareText": "إيصال الدفع، الطلب {id}",
      "px.receipt.doneShare": "الخطوة الأخيرة: أرسل الإيصال إلى محادثة المطعم.",
      "px.receipt.doneManual": "الخطوة الأخيرة: أرفق صورة الإيصال في محادثة واتساب.",
      "px.results.other": "عدد الأطباق: {n}",
      "px.top": "العودة إلى الأعلى", "px.backHome": "العودة إلى الرئيسية", "px.menuPdf": "القائمة (PDF)",
      "px.copied": "تم النسخ",
      "px.loc.label": "موقعك على الخريطة",
      "px.loc.err": "حدّد موقعك لنرسل طلبك إلى أقرب فرع.",
      "px.loc.req": "مطلوب", "px.loc.need": "حدّد موقعك",
      "px.loc.use": "استخدم موقعي الحالي",
      "px.loc.map": "حدّد على الخريطة",
      "px.loc.remove": "إزالة الموقع",
      "px.loc.locating": "جارٍ تحديد موقعك…",
      "px.loc.ok": "تمت إضافة الموقع (±{acc} م). اسحب الدبوس إذا لزم الأمر.",
      "px.loc.set": "تم تحديد الموقع على الخريطة. اسحب الدبوس إذا لزم الأمر.",
      "px.loc.saved": "سنستخدم موقعك المحفوظ. يمكنك تعديله على الخريطة.",
      "px.loc.tap": "اضغط على الخريطة لوضع الدبوس عند بابك.",
      "px.loc.denied": "لم تمنح إذن الوصول إلى موقعك. حدّده على الخريطة.",
      "px.loc.unavailable": "تعذّر الحصول على موقعك. حدّده على الخريطة.",
      "px.loc.timeout": "استغرق تحديد الموقع وقتاً طويلاً. حاول مجدداً أو حدّده على الخريطة.",
      "px.loc.unsupported": "هذا المتصفح لا يسمح بمشاركة الموقع. حدّده على الخريطة.",
      "px.loc.mapError": "تعذّر تحميل الخريطة. استخدم موقعك الحالي أو حاول مجدداً.",
      "px.loc.mapAria": "خريطة لتأكيد موقعك. اضغط على الخريطة أو اسحب الدبوس.",
      "px.loc.pin": "موقع التوصيل",
      "px.branch.serves": "يتولى طلبك: فرع {name}",
      "px.branch.pick": "من أي فرع ستستلم طلبك؟",
      "px.branch.err": "اختر الفرع الذي ستستلم منه طلبك."
    }
  };
  if (I.dict) for (const l in PX) { I.dict[l] = I.dict[l] || {}; Object.assign(I.dict[l], PX[l]); }

  const $ = s => doc.querySelector(s), $$ = s => Array.from(doc.querySelectorAll(s));
  const t = (k, v) => I.t(k, v), esc = R.esc, money = R.money;
  const MAXQ = 20, DAYS = I.dayKeys || ["dom", "lun", "mar", "mie", "jue", "vie", "sab"];
  const DAYEN = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const rate = () => +CONFIG.bcv.tasa > 0 ? +CONFIG.bcv.tasa : 0;
  /* owner placeholders ("[BANCO…]", "@tu_instagram", "TU-DOMINIO", "0000000") are never shown to guests */
  const isPh = v => !v || /^\s*\[|TU-DOMINIO|@tu_|0{6,}|000-0000|ejemplo\.com/i.test(String(v));
  const now = () => typeof window.__PEDIR_NOW === "number" ? new Date(window.__PEDIR_NOW) : new Date();
  const reduce = matchMedia("(prefers-reduced-motion: reduce)");
  const mqSheet = "(max-width:1080px)";
  if (/0000000$/.test(CONFIG.whatsapp)) console.warn("CONFIG.whatsapp todavía es un número de ejemplo.");

  /* ---------- data + cart ---------- */
  const dishes = {};
  MENU.forEach(([cat, , list]) => list.forEach(([name, price, desc, opts, extras, pick]) => { dishes[R.dishId(cat, name)] = { name, price, cat, desc: desc || "", opts: opts || null, extras: extras || null, pick: pick || null }; }));
  const APARTE = "Servir aparte (fuera del pan)";   /* included extras (shawarma especial) travel in the extras part of the key, at $0 */
  let cart = {};   /* key = dishId or dishId|opción|extra~extra|nota del cliente (Spanish) → qty */
  const parseKey = k => { const [id, opt, ex, note] = k.split("|"); return { id, opt, extras: ex ? ex.split("~") : [], note: note || "" }; };
  const cleanNote = s => String(s || "").replace(/[|~\n\r]+/g, " ").replace(/\s+/g, " ").trim().slice(0, 120);
  /* "Sin lechuga…" options (price 0) read as a list, priced extras as "+ …", the guest's note last */
  const lineFmt = (name, opt, extras, note, tx) => {
    const isFree = n => /^Sin /.test(n) || n === APARTE;
    const free = extras.filter(isFree), paid = extras.filter(n => !isFree(n));
    return name + (opt ? ` (${tx(opt)})` : "") + (paid.length ? ` + ${paid.map(tx).join(" + ")}` : "") + (free.length ? ` · ${free.map(tx).join(", ")}` : "") + (note ? ` · "${note}"` : "");
  };
  const extraPrice = (d, n) => { const e = d.extras && d.extras.items.find(x => x[0] === n); return e ? e[1] : 0; };
  const unitPrice = k => { const { id, extras } = parseKey(k), d = dishes[id]; return d.price + extras.reduce((s, n) => s + extraPrice(d, n), 0); };
  const validKey = k => {
    const { id, opt, extras } = parseKey(k), d = dishes[id];
    const known = n => (!!d.extras && d.extras.items.some(x => x[0] === n)) || (!!d.pick && (d.pick.items.includes(n) || (d.pick.aparte && n === APARTE)));
    return !!d && (d.opts ? d.opts.choices.includes(opt) : !opt) && extras.every(known) && (!d.pick || extras.filter(n => d.pick.items.includes(n)).length === d.pick.n);
  };
  try {
    const raw = JSON.parse(localStorage.getItem("amir-cart-v2")) || {};
    Object.entries(raw).forEach(([k, q]) => {
      if (Number.isInteger(q) && q > 0 && validKey(k)) cart[k] = Math.min(q, MAXQ);
    });
  } catch (e) { /* private mode */ }

  const qtyOf = id => Object.entries(cart).reduce((s, [k, q]) => s + (parseKey(k).id === id ? q : 0), 0);
  const qtyFor = id => dishes[id].opts || dishes[id].extras ? qtyOf(id) : (cart[id] || 0);
  const count = () => Object.values(cart).reduce((a, b) => a + b, 0);
  const subtotal = () => Object.entries(cart).reduce((s, [k, q]) => s + unitPrice(k) * q, 0);
  const tr = id => I.dish(dishes[id].name, dishes[id].desc, dishes[id].cat);
  const lineName = k => { const { id, opt, extras, note } = parseKey(k); return lineFmt(dishes[id].name, opt, extras, note, x => x); };        /* Spanish: WhatsApp */
  const lineNameUI = k => { const { id, opt, extras, note } = parseKey(k); return lineFmt(tr(id).name, opt, extras, note, x => I.opt(x)); };  /* on screen */

  /* ---------- menu ---------- */
  const catsEl = $("#cats"), chips = $("#chips"), SIG = R.sig(MENU, PH);
  const ctlFor = (id, pop) => R.ctl(id, dishes[id], qtyFor(id), I, pop);
  /* a dish can be on the page twice (Destacados + its section): update every copy */
  function renderOne(id, pop) { $$(`.dish[data-id="${id}"] .ctl`).forEach(c => { c.innerHTML = ctlFor(id, pop); }); }
  function renderMenu(keep) {
    let anchor = null;
    if (keep) { const a = currentCat(); const el = a && doc.getElementById(a); if (el) anchor = [a, el.getBoundingClientRect().top]; }
    chips.innerHTML = R.chips(MENU, I, PH);
    catsEl.innerHTML = R.cats(MENU, I, PH, qtyFor);
    catsEl.dataset.sig = SIG;
    lastCur = undefined;
    if (q.value) doSearch(true);
    measure();
    if (anchor) { const el = doc.getElementById(anchor[0]); if (el) scrollTo({ top: scrollY + el.getBoundingClientRect().top - anchor[1], behavior: "instant" }); }
    requestAnimationFrame(spy);
  }
  function hydrate() { new Set(Object.keys(cart).map(k => parseKey(k).id)).forEach(id => renderOne(id)); }

  const DRINKS = typeof DRINK_CATS !== "undefined" ? DRINK_CATS : [];
  /* small photo for order lines: the dish thumb, or the branded placeholder (same one the menu uses) */
  const thumb = id => PH[id] ? `<img class="lth" src="${R.phTh(PH[id])}" alt="" width="52" height="52" loading="lazy" decoding="async">` : `<span class="lth ph-empty" aria-hidden="true"></span>`;
  const hasDrink = () => Object.keys(cart).some(k => DRINKS.includes(dishes[parseKey(k).id].cat));
  function linesHTML() {
    const keys = Object.keys(cart);
    if (!keys.length) return `<div class="blank"><span class="ar" lang="ar" aria-hidden="true">${esc(t("ledger.greet"))}</span>${esc(t("ledger.empty"))}</div>`;
    let h = keys.map(k => {
      const { id, opt, extras, note } = parseKey(k), n = lineNameUI(k), ek = esc(k), sub = [opt ? I.opt(opt) : "", ...extras.map(x => (/^Sin /.test(x) ? "" : "+ ") + I.opt(x)), note ? `"${note}"` : ""].filter(Boolean).join(" · ");
      return `<div class="ln has-th">${thumb(id)}<span class="q"><button type="button" data-k="${ek}" data-d="-1" aria-label="${esc(t("dish.removeOne", { name: n }))}">${R.MINUS}</button><b>${cart[k]}</b><button type="button" data-k="${ek}" data-d="1" aria-label="${esc(t("dish.addAnother", { name: n }))}">${R.PLUS}</button></span>` +
        `<span class="n">${esc(tr(id).name)}${sub ? `<small>${esc(sub)}</small>` : ""}</span><span class="p">${money(unitPrice(k) * cart[k])}</span></div>`;
    }).join("");
    if (!hasDrink() && typeof UPSELL !== "undefined") {
      h += `<div class="up"><p>${esc(t("upsell.title"))}</p>${UPSELL.map(([c, n]) => { const id = R.dishId(c, n); return dishes[id] ? `<button type="button" data-up="${id}"><span>${esc(tr(id).name)}</span><b>+ ${money(dishes[id].price)}</b></button>` : ""; }).join("")}</div>`;
    }
    return h;
  }

  /* ---------- branch / totals ---------- */
  const form = $("#form");
  const isDel = () => form.elements.type.value === "Delivery";
  /* delivery: the pinned location is required and the order goes to the nearest branch (straight-line km).
     Branches without lat/lng in CONFIG.sucursales are skipped; none with coordinates → first branch. No delivery fee is shown. */
  const hasLL = b => b && isFinite(b.lat) && isFinite(b.lng) && b.lat !== null && b.lng !== null;
  const kmTo = b => { const r = Math.PI / 180, dLat = (loc.lat - b.lat) * r, dLng = (loc.lng - b.lng) * r;
    return 12742 * Math.asin(Math.sqrt(Math.sin(dLat / 2) ** 2 + Math.cos(b.lat * r) * Math.cos(loc.lat * r) * Math.sin(dLng / 2) ** 2)); };
  function nearestBranch() {
    const bs = BRANCHES || [], ll = loc ? bs.filter(hasLL) : [];
    return ll.length ? ll.reduce((a, x) => kmTo(x) < kmTo(a) ? x : a) : bs[0] || null;
  }
  function totals() { const sub = subtotal(); return { sub, total: sub }; }
  /* branches: the pinned location decides (delivery) or the guest chooses (pickup); fallback = CONFIG.whatsapp */
  const BRANCHES = Array.isArray(CONFIG.sucursales) && CONFIG.sucursales.length ? CONFIG.sucursales : null;
  if (BRANCHES && BRANCHES.length > 1 && !BRANCHES.every(hasLL)) console.warn("CONFIG.sucursales: faltan lat/lng; el delivery va siempre a la primera sucursal.");
  const branchById = id => BRANCHES && BRANCHES.find(b => b.id === id) || null;
  function curBranch() {
    if (!BRANCHES) return null;
    if (isDel()) return loc ? nearestBranch() : null;
    if (BRANCHES.length === 1) return BRANCHES[0];
    const r = form.querySelector('input[name="branch"]:checked'); return r ? branchById(r.value) : null;
  }
  /* every order goes to the WhatsApp of its branch (nearest for delivery, chosen for pickup) */
  const waNumber = () => { const b = curBranch(); return b && b.whatsapp ? b.whatsapp : CONFIG.whatsapp; };
  function minMsg() { const m = +CONFIG.pedidoMinimo || 0, s = subtotal(); return count() && m && s < m ? t("cart.min", { missing: money(m - s), min: money(m) }) : ""; }
  const staleRate = () => { const d = Date.parse(CONFIG.bcv.fecha); return d && (now() - d) > 3 * 864e5; };

  /* ---------- opening hours (America/Caracas) ---------- */
  function caracasNow() {
    const p = {};
    new Intl.DateTimeFormat("en-US", { timeZone: CONFIG.tz, weekday: "long", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" })
      .formatToParts(now()).forEach(x => { p[x.type] = x.value; });
    return { dow: DAYEN.indexOf(p.weekday), hh: p.hour, mi: p.minute, mm: p.month, dd: p.day, min: (+p.hour) * 60 + (+p.minute) };
  }
  const tmin = s => { const [h, m] = s.split(":").map(Number); return h * 60 + m; };
  function openStatus() {
    const n = caracasNow(), cur = n.dow * 1440 + n.min, W = 10080;
    let next = null;
    for (let d = 0; d < 7; d++) {
      const h = CONFIG.horario[DAYS[d]]; if (!h) continue;
      const s = d * 1440 + tmin(h[0]); let e = d * 1440 + tmin(h[1]); if (e <= s) e += 1440;
      if ((cur >= s && cur < e) || (cur + W >= s && cur + W < e)) return { open: true, until: h[1] };
      [s, s + W].forEach(x => { if (x > cur && (next === null || x < next.abs)) next = { abs: x, t: h[0] }; });
    }
    if (!next) return { open: false };
    return { open: false, daysAhead: Math.floor(next.abs / 1440) - n.dow, dow: Math.floor(next.abs / 1440) % 7, time: next.t };
  }
  let ST = { open: true }, S = { open: true, text: "" };
  function updateStatus() {
    ST = openStatus(); S = I.status(ST);
    const pill = $("#statusPill"), note = $("#closedNote");
    pill.className = "status " + (ST.open ? "open" : "closed");
    if (pill.textContent !== S.text) pill.textContent = S.text;
    const showNote = !ST.open && !CONFIG.pruebaSinHorario;
    note.hidden = !showNote; note.textContent = showNote ? S.note : "";
    html.classList.toggle("is-closed", !ST.open);
    updateBlock();
  }
  function blockReason() { if (!count()) return t("cart.needOne"); if (!ST.open && !CONFIG.pruebaSinHorario) return S.text; return minMsg(); }
  function updateBlock() {
    const r = blockReason();
    $("#send").setAttribute("aria-disabled", r ? "true" : "false");
    $("#blockMsg").textContent = r;
    $("#sendLbl").textContent = t(ST.open || CONFIG.pruebaSinHorario ? "px.send.short" : "send.closed");
  }

  /* ---------- cart render ---------- */
  function renderTotals() {
    const tt = totals(), c = count(), r = rate();
    $("#ledgerSub").textContent = $("#sheetSub").textContent = $("#pillSub").textContent = money(tt.sub);
    $("#pillCount").textContent = c;
    const hc = $("#hdCount"); hc.textContent = c; hc.hidden = !c;
    $("#hdCart").setAttribute("aria-label", c ? t("pill.aria", { items: I.tp("cart.dishes", c), total: money(tt.sub) }) : t("pill.view"));
    const pill = $("#pill"); pill.classList.toggle("show", c > 0);
    /* phones: the bottom-nav PEDIR button stands in for the pill (count badge from bnav.js, total under the circle) */
    const bo = $(".bnav-order");
    if (bo) {
      const lbl = bo.querySelector("[data-i18n]"), bt = $("#bnavTot");
      bt.textContent = money(tt.sub); bt.hidden = !c; lbl.hidden = !!c;
      bo.setAttribute("aria-label", c ? t("pill.aria", { items: I.tp("cart.dishes", c), total: money(tt.sub) }) : t("bnav.order"));
    }
    pill.setAttribute("aria-label", t("pill.aria", { items: I.tp("cart.dishes", c), total: money(tt.sub) }));
    $("#ledgerGo").disabled = !c; $("#clearBtn").hidden = !c; $("#ledgerWhy").hidden = !!c;
    const lb = $("#ledgerBs"); lb.hidden = !(r && c); lb.textContent = r ? "≈ " + I.bs(tt.sub, r) : "";
    const mm = minMsg(); $("#ledgerMin").hidden = !mm; $("#ledgerMin").textContent = mm;
    $("#totLbl").textContent = t("totals.total");
    $("#sheetTotal").textContent = money(tt.total);
    const sb = $("#sheetBs"); sb.hidden = !r;
    sb.textContent = r ? t("totals.bsLine", { bs: I.bs(tt.total, r), rate: I.num(r, 2, 2), date: CONFIG.bcv.fecha ? t("totals.bsDate", { date: CONFIG.bcv.fecha.split("-").reverse().join("/") }) : "" }) + (staleRate() ? t("totals.bsStale") : "") : "";
    updateBlock();
  }
  function renderLines() { const h = linesHTML(); $("#ledgerLines").innerHTML = h; $("#sheetLines").innerHTML = count() ? h : ""; }
  function save() { try { localStorage.setItem("amir-cart-v2", JSON.stringify(cart)); } catch (e) { /* ignore */ } doc.dispatchEvent(new Event("amir-cart")); }
  function refreshAll() { renderLines(); renderTotals(); save(); }

  let tt0;
  function toast(msg, undo) {
    const el = $("#toast"); el.textContent = "";
    const s = doc.createElement("span"); s.textContent = msg; el.append(s);
    el.classList.toggle("has-btn", !!undo);
    if (undo) { const b = doc.createElement("button"); b.type = "button"; b.textContent = t("cart.undo"); b.onclick = () => { undo(); el.classList.remove("show"); }; el.append(b); }
    el.classList.add("show"); clearTimeout(tt0); tt0 = setTimeout(() => el.classList.remove("show"), undo ? 6000 : 1800);
  }
  function bump(el) { if (!el || reduce.matches) return; el.classList.remove("bump"); void el.offsetWidth; el.classList.add("bump"); }
  /* quantity roll: the new number slides in while the old one slides out (styled in assets/v4/polish.css) */
  function roll(el, from, to) {
    if (!el) return;
    if (reduce.matches || from === to || !from || !to) { el.textContent = to; el.removeAttribute("data-roll"); return; }
    el.dataset.roll = to > from ? "up" : "down";
    el.innerHTML = `<span class="rn">${to}</span><span class="ro" aria-hidden="true">${from}</span>`;
  }
  /* fly-to-cart: a dot travels from the tapped + to the cart (spatial feedback). WAAPI, transform/opacity only. */
  let tapFrom = null;
  doc.addEventListener("pointerdown", e => { const b = e.target.closest && e.target.closest(".dish .ctl button, .optdlg .foot .btn"); tapFrom = b ? b.getBoundingClientRect() : null; }, { passive: true });
  function fly() {
    const from = tapFrom; tapFrom = null;
    if (!from || reduce.matches || !doc.body.animate) return;
    const pill = $("#pill"), bo = $(".bnav-o");
    const to = pill && pill.classList.contains("show") && pill.offsetParent ? $("#pillCount") : bo && bo.offsetParent ? bo : $("#ledgerSub");
    if (!to) return;
    const r = to.getBoundingClientRect(); if (!r.width) return;
    const x0 = from.left + from.width / 2, y0 = from.top + from.height / 2, x1 = r.left + r.width / 2, y1 = r.top + r.height / 2;
    const lift = Math.min(160, Math.abs(y1 - y0) * 0.35 + 60); /* arc height */
    const dot = doc.createElement("i"); dot.className = "fly"; dot.setAttribute("aria-hidden", "true"); doc.body.append(dot);
    const a = dot.animate([
      { transform: `translate(${x0}px,${y0}px) scale(.6)`, opacity: 0 },
      { transform: `translate(${x0 + (x1 - x0) * .35}px,${Math.min(y0, y1) - lift}px) scale(1.15)`, opacity: 1, offset: .4 },
      { transform: `translate(${x1}px,${y1}px) scale(.45)`, opacity: .9 }
    ], { duration: 560, easing: "cubic-bezier(.77,0,.175,1)" });
    a.onfinish = a.oncancel = () => { dot.remove(); bump($("#pillCount")); bump($("#ledgerSub")); bump($("#hdCount")); };
  }
  function change(key, d) {
    const cur = cart[key] || 0, want = cur + d, nx = Math.min(MAXQ, want);
    if (want > MAXQ) toast(t("cart.max", { max: MAXQ }));
    if (nx <= 0) delete cart[key]; else cart[key] = nx;
    const id = parseKey(key).id;
    renderOne(id, d > 0 && cur === 0);
    $$(`.dish[data-id="${id}"] .step b`).forEach(b => roll(b, cur, nx));
    refreshAll();
    if (nx > cur) {
      if (tapFrom && !reduce.matches) requestAnimationFrame(fly); else { bump($("#pillCount")); bump($("#ledgerSub")); bump($("#hdCount")); }
      try { if (matchMedia("(pointer:coarse)").matches && navigator.vibrate) navigator.vibrate(8); } catch (e) { /* ignore */ }
    }
  }
  const sheet = $("#sheet"), optDlg = $("#optDlg");
  const isOpen = el => el.classList.contains("open");

  /* "Destacados" rail and category chips: a mouse can grab and drag them sideways (touch already swipes natively) */
  const RAILS = ".feat .cards, .chips";
  let rail = null;
  doc.addEventListener("pointerdown", e => {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    const el = e.target.closest(RAILS); if (!el) return;
    rail = { el, x: e.clientX, left: el.scrollLeft, moved: false };
  });
  doc.addEventListener("pointermove", e => {
    if (!rail) return;
    const dx = e.clientX - rail.x;
    if (!rail.moved && Math.abs(dx) < 6) return;
    if (!rail.moved) { rail.moved = true; rail.el.classList.add("drag"); }
    rail.el.scrollLeft = rail.left - dx;
  });
  const railEnd = () => {
    if (!rail) return;
    const { el, moved } = rail; rail = null;
    if (!moved) return;
    el.classList.remove("drag");   /* scroll-snap comes back and settles on the nearest card */
    /* swallow the click that ends the drag so it doesn't open a dish */
    const eat = ev => { ev.stopPropagation(); ev.preventDefault(); };
    doc.addEventListener("click", eat, true); setTimeout(() => doc.removeEventListener("click", eat, true), 0);
  };
  doc.addEventListener("pointerup", railEnd); doc.addEventListener("pointercancel", railEnd);
  doc.addEventListener("dragstart", e => { if (e.target.closest(RAILS)) e.preventDefault(); });

  doc.addEventListener("click", e => {
    const b = e.target.closest("button"); if (!b) return;
    const li = b.closest(".dish");
    if (li && b.classList.contains("dish-go")) { openOptions(li.dataset.id); return; }
    if (li && b.closest(".ctl")) {
      const id = li.dataset.id;
      if (b.hasAttribute("data-opt")) { openOptions(id, false, true); return; }
      const d = +b.dataset.d, wasAdd = !cart[id];
      change(id, d);
      if (cart[id] && wasAdd && d > 0) toast(t("cart.added", { name: lineNameUI(id) }));
      const nb = li.querySelector(`.ctl [data-d="${d}"]`) || li.querySelector(".ctl button");
      if (nb) nb.focus({ preventScroll: true });
      return;
    }
    if (b.dataset.k) {
      const key = b.dataset.k, d = +b.dataset.d, box = b.closest("#ledgerLines,#sheetLines"), wasAdd = !cart[key];
      change(key, d);
      if (cart[key] && wasAdd && d > 0) toast(t("cart.added", { name: lineNameUI(key) }));
      if (!count() && isOpen(sheet)) { closeDlg(sheet); return; }
      if (box) {
        const c = doc.getElementById(box.id), ek = CSS.escape(key);
        (c.querySelector(`[data-k="${ek}"][data-d="${d}"]`) || c.querySelector(`[data-k="${ek}"]`) || c.querySelector(".ln button") || $("#ledgerGo")).focus({ preventScroll: true });
      }
    } else if (b.dataset.up) {
      change(b.dataset.up, 1); toast(t("cart.added", { name: lineNameUI(b.dataset.up) }));
      const c = b.closest("#ledgerLines,#sheetLines"); const f = c && c.querySelector(`[data-k="${CSS.escape(b.dataset.up)}"][data-d="1"]`); if (f) f.focus({ preventScroll: true });
    } else if (b.dataset.copy !== undefined) {
      copyText(b.dataset.copy).then(() => {
        toast(t("cart.copied"));
        const old = b.textContent; b.classList.add("ok"); b.textContent = t("px.copied");
        setTimeout(() => { b.classList.remove("ok"); b.textContent = old; }, 1600);
      });
    }
  });
  $("#clearBtn").onclick = () => {
    const prev = cart; cart = {};
    $$(".dish").forEach(li => renderOne(li.dataset.id)); refreshAll();
    toast(t("cart.cleared"), () => { cart = prev; $$(".dish").forEach(li => renderOne(li.dataset.id)); refreshAll(); });
  };
  async function copyText(s) {
    try { await navigator.clipboard.writeText(s); return; } catch (e) { /* fallback */ }
    const ta = doc.createElement("textarea"); ta.value = s; ta.setAttribute("readonly", ""); ta.style.cssText = "position:fixed;top:0;opacity:0"; doc.body.append(ta); ta.select();
    try { doc.execCommand("copy"); } catch (e) { /* ignore */ } ta.remove();
  }

  /* ---------- search (any language) ---------- */
  const q = $("#q"), barIn = $("#barIn"); let sIdx = null;
  function doSearch(silent) {
    const s = I.fold(q.value), words = s ? s.split(" ") : [];
    if (s && !sIdx) { sIdx = {}; for (const id in dishes) { const d = dishes[id]; sIdx[id] = I.searchKey(d.name, d.desc, d.cat); } }
    let any = 0;
    $$(".cat").forEach(sec => {
      if (sec.id === "destacados") { sec.hidden = !!s; return; }   /* its dishes are also in their own sections */
      let vis = 0;
      sec.querySelectorAll(".dish").forEach(li => { const h = sIdx && sIdx[li.dataset.id] || ""; const m = !s || words.every(w => h.includes(w)); li.hidden = !m; vis += m; });
      sec.hidden = !vis; any += vis;
    });
    $("#noResults").hidden = !s || any > 0;
    $("#qClear").hidden = !q.value;
    $("#qStatus").textContent = s ? I.tp("px.results", any) : "";
    if (s && !silent) { const m = $("#carta"); if (m.getBoundingClientRect().top < barH()) m.scrollIntoView({ block: "start", behavior: "instant" }); }
    measure(); lastCur = undefined; spy();
  }
  q.addEventListener("input", () => doSearch());
  q.addEventListener("keydown", e => { if (e.key === "Escape" && q.value) { e.stopPropagation(); q.value = ""; doSearch(); } else if (e.key === "Enter") q.blur(); });
  $("#qClear").onclick = () => { q.value = ""; doSearch(); q.focus(); };
  q.addEventListener("focus", () => barIn.classList.add("searching"));
  q.addEventListener("blur", () => { if (!q.value) barIn.classList.remove("searching"); });
  chips.addEventListener("click", e => {
    if (q.value) { q.value = ""; doSearch(true); barIn.classList.remove("searching"); }
    const a = e.target.closest("a"); if (a) setActive(a.dataset.c);
  });

  /* ---------- active chip (scroll-spy, cached offsets) ---------- */
  let offs = [], ticking = false, lastCur;
  const barH = () => $(".bar").offsetHeight + $(".hd").offsetHeight;   /* both stick to the top */
  let dirty = true;
  function measure() { dirty = true; }   /* lazy: offsets are read on the next scroll frame, never mid-render */
  function doMeasure() { const y = scrollY; offs = $$(".cat:not([hidden])").map(s => [s.id, s.getBoundingClientRect().top + y]); dirty = false; }
  function currentCat() { if (dirty) doMeasure(); const y = scrollY + barH() + 48; let cur = null; for (const [id, top] of offs) if (top <= y) cur = id; return cur; }
  function setActive(cur) {
    if (cur === lastCur) return; lastCur = cur;
    chips.querySelectorAll("a").forEach(a => {
      const on = a.dataset.c === cur; a.classList.toggle("on", on);
      if (on) {
        a.setAttribute("aria-current", "true");
        const c = chips.getBoundingClientRect(), r = a.getBoundingClientRect(), dx = (r.left + r.width / 2) - (c.left + c.width / 2);
        if (Math.abs(dx) > 4) chips.scrollBy({ left: dx, behavior: reduce.matches ? "auto" : "smooth" });
      } else a.removeAttribute("aria-current");
    });
  }
  function spy() { ticking = false; setActive(currentCat()); }
  addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(spy); } }, { passive: true });
  if ("ResizeObserver" in window) new ResizeObserver(() => measure()).observe(catsEl); else addEventListener("resize", measure);

  /* ---------- dialogs: focus trap, inert, Escape, drag-to-close ---------- */
  const app = $("#app"), dlgs = [];
  function openDlg(el, focusSel, restore) {
    dlgs.push({ el, back: doc.activeElement, restore });
    $("#scrim").classList.add("open"); el.classList.add("open");
    app.inert = true; html.classList.add("lock");
    requestAnimationFrame(() => (el.querySelector(focusSel) || el).focus({ preventScroll: true }));
  }
  function closeDlg(el) {
    const i = dlgs.findIndex(r => r.el === el); if (i < 0) return;
    const rec = dlgs.splice(i, 1)[0];
    el.classList.remove("open");
    if (!dlgs.length) { $("#scrim").classList.remove("open"); app.inert = false; html.classList.remove("lock"); }
    let tg = rec.restore ? doc.querySelector(rec.restore) : rec.back;
    if (!tg || !doc.contains(tg) || getComputedStyle(tg).visibility === "hidden" || tg.closest("[hidden]")) tg = $("#carta");
    tg.focus({ preventScroll: true });
  }
  const focusables = el => Array.from(el.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]),select,textarea,[tabindex]:not([tabindex="-1"])'))
    .filter(n => !n.closest("[hidden]") && n.getClientRects().length && getComputedStyle(n).visibility !== "hidden");
  doc.addEventListener("keydown", e => {
    const top = dlgs[dlgs.length - 1]; if (!top) return;
    if (e.key === "Escape") { e.preventDefault(); closeDlg(top.el); return; }
    if (e.key !== "Tab") return;
    const f = focusables(top.el); if (!f.length) { e.preventDefault(); return; }
    const first = f[0], last = f[f.length - 1], a = doc.activeElement;
    if (e.shiftKey && (a === first || a === top.el)) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && (a === last || !top.el.contains(a))) { e.preventDefault(); first.focus(); }
  });
  $("#scrim").onclick = () => { const tp = dlgs[dlgs.length - 1]; if (tp) closeDlg(tp.el); };
  $("#closeSheet").onclick = () => closeDlg(sheet);
  $("#optClose").onclick = () => closeDlg(optDlg);
  function dragClose(dlg, mq) {
    let y0 = null, dy = 0;
    dlg.addEventListener("pointerdown", e => {
      if (!matchMedia(mq).matches || !e.target.closest(".grab,.dlg-h") || e.target.closest("button")) return;
      y0 = e.clientY; dy = 0; dlg.style.transition = "none"; try { dlg.setPointerCapture(e.pointerId); } catch (er) { /* ignore */ }
    });
    dlg.addEventListener("pointermove", e => { if (y0 === null) return; dy = Math.max(0, e.clientY - y0); dlg.style.transform = `translateY(${dy}px)`; });
    const end = () => { if (y0 === null) return; y0 = null; dlg.style.transition = ""; dlg.style.transform = ""; if (dy > 110) closeDlg(dlg); };
    dlg.addEventListener("pointerup", end); dlg.addEventListener("pointercancel", end);
  }
  dragClose(sheet, mqSheet); dragClose(optDlg, "(max-width:720px)");

  /* ---------- dish sheet: photo, description, options (shawarma / arroz / batidos), quantity ---------- */
  let opt = null;
  const optUnit = () => dishes[opt.id].price + opt.extras.reduce((s, n) => s + extraPrice(dishes[opt.id], n), 0);
  const optLabel = () => t("opt.add", { total: money(optUnit() * opt.qty) });
  function openOptions(id, refresh, fromAdd) {
    const d = dishes[id], T = tr(id), ph = PH[id];
    if (!refresh) opt = { id, choice: null, extras: [], picks: [], aparte: false, qty: 1, note: "" };
    const full = d.pick && opt.picks.length >= d.pick.n;
    $("#optTitle").textContent = T.name;
    $("#optBody").innerHTML = `${ph ? `<figure class="dph"><img src="${R.phSrc(ph)}" alt="" width="640" height="480" decoding="async"></figure>` : `<figure class="dph ph-empty" aria-hidden="true"></figure>`}
      <p class="dpr">${money(d.price)}</p>${T.desc ? `<p class="dsc">${esc(T.desc)}</p>` : ""}
      ${d.opts ? `<fieldset><legend>${esc(I.opt(d.opts.label))} <span class="req">${esc(t("opt.required"))}</span></legend>
      <div class="opts">${d.opts.choices.map((c, i) => `<div class="oc"><input type="radio" name="optc" id="oc${i}" value="${esc(c)}"${opt.choice === c ? " checked" : ""}><label for="oc${i}">${esc(I.opt(c))}</label></div>`).join("")}</div></fieldset>` : ""}
      ${d.pick ? `<fieldset><legend>${esc(I.opt(d.pick.label))} <span class="req">${esc(t("opt.required"))}</span></legend>
      <div class="opts">${d.pick.items.map((n, i) => { const on = opt.picks.includes(n); return `<div class="oc"><input type="checkbox" name="optp" id="op${i}" value="${esc(n)}"${on ? " checked" : full ? " disabled" : ""}><label for="op${i}">${esc(I.opt(n))}</label></div>`; }).join("")}</div>
      ${d.pick.aparte ? `<div class="opts"><div class="oc"><input type="checkbox" name="opta" id="opa"${opt.aparte ? " checked" : ""}><label for="opa">${esc(I.opt(APARTE))}</label></div></div>` : ""}</fieldset>` : ""}
      ${d.extras ? `<fieldset><legend>${esc(I.opt(d.extras.label))}</legend>
      <div class="opts">${d.extras.items.map(([n, p], i) => `<div class="oc"><input type="checkbox" name="optx" id="ox${i}" value="${esc(n)}"${opt.extras.includes(n) ? " checked" : ""}><label for="ox${i}">${esc(I.opt(n))}${p ? ` · +${money(p)}` : ""}</label></div>`).join("")}</div></fieldset>` : ""}
      <div class="f onote"><label for="optNote">${esc(t("px.note.label"))}</label><textarea id="optNote" rows="2" maxlength="120" dir="auto" placeholder="${esc(t("px.note.ph"))}">${esc(opt.note)}</textarea></div>
      <div class="err" id="optErr" role="alert"></div>`;
    $("#optQty").innerHTML = `<button type="button" data-oq="-1" aria-label="${esc(t("opt.less"))}">${R.MINUS}</button><b id="optQ" aria-live="polite">${opt.qty}</b><button type="button" data-oq="1" aria-label="${esc(t("opt.more"))}">${R.PLUS}</button>`;
    $("#optAdd").textContent = optLabel();
    $("#optClose").setAttribute("aria-label", t("opt.close"));
    optDlg.classList.toggle("has-dph", !!ph);
    if (!refresh) openDlg(optDlg, d.opts ? "input" : "#optAdd", fromAdd ? `.dish[data-id="${id}"] .add` : null);
  }
  $("#optBody").addEventListener("input", e => { if (e.target.id === "optNote") opt.note = e.target.value; });
  $("#optBody").addEventListener("change", e => {
    if (e.target.name === "optx") {
      opt.extras = $$('#optBody input[name="optx"]:checked').map(i => i.value);
      $("#optAdd").textContent = optLabel(); return;
    }
    if (e.target.name === "optp") {
      const boxes = $$('#optBody input[name="optp"]');
      opt.picks = boxes.filter(i => i.checked).map(i => i.value);
      const full = opt.picks.length >= dishes[opt.id].pick.n;
      boxes.forEach(i => { i.disabled = full && !i.checked; i.removeAttribute("aria-invalid"); });
      $("#optErr").textContent = ""; return;
    }
    if (e.target.name === "opta") { opt.aparte = e.target.checked; return; }
    if (e.target.name !== "optc") return;
    opt.choice = e.target.value; $("#optErr").textContent = ""; $$("#optBody input").forEach(i => i.removeAttribute("aria-invalid"));
  });
  $("#optQty").addEventListener("click", e => {
    const b = e.target.closest("[data-oq]"); if (!b) return;
    const was = opt.qty;
    opt.qty = Math.max(1, Math.min(MAXQ, opt.qty + (+b.dataset.oq)));
    roll($("#optQ"), was, opt.qty); $("#optAdd").textContent = optLabel();
  });
  $("#optAdd").onclick = () => {
    const o = dishes[opt.id].opts;
    if (o && !opt.choice) {
      $("#optErr").textContent = t("opt.pick", { label: I.opt(o.label).toLowerCase() });
      $$("#optBody input").forEach(i => i.setAttribute("aria-invalid", "true")); $("#optBody input").focus(); return;
    }
    const p = dishes[opt.id].pick;
    if (p && opt.picks.length !== p.n) {
      $("#optErr").textContent = t("opt.pick", { label: I.opt(p.label).toLowerCase() });
      $$('#optBody input[name="optp"]').forEach(i => i.setAttribute("aria-invalid", "true")); $('#optBody input[name="optp"]').focus(); return;
    }
    const note = cleanNote(opt.note), ex = p ? [...opt.picks, ...(opt.aparte ? [APARTE] : []), ...opt.extras] : opt.extras;
    const key = o || ex.length || note ? [opt.id, o ? opt.choice : "", ex.join("~"), note].join("|").replace(/\|+$/, "") : opt.id, qn = opt.qty;
    closeDlg(optDlg); change(key, qn); toast(t("cart.added", { name: lineNameUI(key) }));
  };

  /* ---------- checkout ---------- */
  function renderBranches() {
    const box = $("#branchSeg"); if (!box) return;
    const many = !!BRANCHES && BRANCHES.length > 1;
    $("#branchF").dataset.on = many ? "1" : "";
    if (!many) return;
    const v = (form.querySelector('input[name="branch"]:checked') || {}).value;
    box.innerHTML = BRANCHES.map((b, i) => `<input type="radio" name="branch" id="br${i}" value="${esc(b.id)}"${v === b.id ? " checked" : ""}><label for="br${i}">${esc(b.nombre)}</label>`).join("");
  }
  function syncType() {
    const del = isDel(), b = curBranch();
    $("#refF").hidden = $("#locF").hidden = $("#moreDel").hidden = !del;
    $("#branchF").hidden = del || !$("#branchF").dataset.on;
    if (del && isOpen(sheet)) warmMap();
    if ($("#eLoc").textContent) validateLoc();
    syncNeedLoc();
    const bi = $("#branchInfo"); bi.textContent = del && b ? t("px.branch.serves", { name: b.nombre }) : ""; bi.hidden = !bi.textContent;
    renderTotals();
  }
  function validateBranch() {
    const f = $("#branchF"), need = !isDel() && !f.hidden && !curBranch(), err = $("#eBranch");
    err.textContent = need ? t("px.branch.err") : "";
    f.querySelectorAll("input").forEach(i => need ? i.setAttribute("aria-invalid", "true") : i.removeAttribute("aria-invalid"));
    return !need;
  }
  /* delivery needs the pinned location: it picks the branch and goes in the WhatsApp message */
  function validateLoc() {
    const need = isDel() && !loc;
    $("#eLoc").textContent = need ? t("px.loc.err") : "";
    $("#locF").classList.toggle("bad", need);
    return !need;
  }
  /* hide methods switched off in config.js; if the checked one is hidden, check the first visible one */
  function setupPays() {
    const all = $$('.pays input[name="pay"]');
    all.forEach(i => {
      const k = i.dataset.cfg; if (!k) return;
      const c = CONFIG[k], on = !!c && c.activo !== false;
      i.hidden = i.nextElementSibling.hidden = !on; i.disabled = !on;
    });
    if (!all.some(i => i.checked && !i.disabled)) { const f = all.find(i => !i.disabled); if (f) f.checked = true; }
  }
  setupPays();
  form.addEventListener("change", e => {
    if (e.target.name === "type" || e.target.name === "branch") {
      syncType();
      if (e.target.name === "branch") validateBranch();
    }
  });
  const RULES = {
    name: v => v.trim().length >= 2 ? "" : t("err.name"),
    phone: v => /^\+?[0-9\s-]{10,15}$/.test(v.trim()) ? "" : t("err.phone")
  };
  function validate(el) {
    const rule = RULES[el.name]; if (!rule) return true;
    const msg = rule(el.value), f = el.closest(".f");
    f.querySelector(".err").textContent = msg; f.classList.toggle("bad", !!msg);
    if (msg) el.setAttribute("aria-invalid", "true"); else el.removeAttribute("aria-invalid");
    return !msg;
  }
  form.addEventListener("focusout", e => { if (e.target.name in RULES) validate(e.target); });
  form.addEventListener("input", e => { if (e.target.name in RULES && e.target.getAttribute("aria-invalid")) validate(e.target); });
  form.addEventListener("focusin", e => {
    if (matchMedia(mqSheet).matches && e.target.matches("input:not([type=radio]):not([type=checkbox]),textarea,select")) setTimeout(() => e.target.scrollIntoView({ block: "center", behavior: "smooth" }), 320);
  });

  /* ---------- delivery location: Geolocation + lazy Leaflet map (never blocks the order) ---------- */
  const LEAFLET = { v: "1.9.4", js: "sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=", css: "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" };
  const LECHERIA = [10.19, -64.69];
  let step = 1;   /* checkout step (declared early: syncType → syncNeedLoc can run while restoring the saved pin) */
  let loc = null, locState = null, map = null, marker = null, ring = null, leafletP = null;
  const locMsg = $("#locMsg"), locMapEl = $("#locMap");
  function setLocMsg(key, vars, bad) { locState = key ? [key, vars, bad] : null; locMsg.textContent = key ? t(key, vars) : ""; locMsg.classList.toggle("bad", !!bad); }
  /* same files (same SRI) on two CDNs: cdnjs first, unpkg if it fails or stalls */
  const LEAFLET_CDNS = [`https://cdnjs.cloudflare.com/ajax/libs/leaflet/${LEAFLET.v}/leaflet`, `https://unpkg.com/leaflet@${LEAFLET.v}/dist/leaflet`];
  function loadFrom(base) {
    return new Promise((res, rej) => {
      const css = doc.createElement("link"); css.rel = "stylesheet"; css.href = base + ".css"; css.integrity = LEAFLET.css; css.crossOrigin = ""; doc.head.append(css);
      const s = doc.createElement("script"); s.src = base + ".js"; s.integrity = LEAFLET.js; s.crossOrigin = ""; s.async = true;
      const fail = () => { clearTimeout(to); s.remove(); css.remove(); rej(new Error("leaflet")); };
      const to = setTimeout(fail, 9000);
      s.onload = () => { clearTimeout(to); window.L && window.L.map ? res(window.L) : fail(); };
      s.onerror = fail;
      doc.head.append(s);
    });
  }
  function loadLeaflet() {
    if (window.L && window.L.map) return Promise.resolve(window.L);
    return leafletP || (leafletP = loadFrom(LEAFLET_CDNS[0]).catch(() => loadFrom(LEAFLET_CDNS[1])).catch(e => { leafletP = null; throw e; }));
  }
  function setLoc(lat, lng, src, acc) {
    loc = { lat: +(+lat).toFixed(6), lng: +(+lng).toFixed(6), src, acc };
    $("#locClear").hidden = false;
    syncType();
  }
  function placePin(L, ll) {
    if (!marker) {
      const icon = L.divIcon({ className: "pin", iconSize: [34, 44], iconAnchor: [17, 43], html: '<svg width="34" height="44" viewBox="0 0 34 44" aria-hidden="true"><path d="M17 1.5C8.4 1.5 1.5 8.3 1.5 16.8 1.5 28 17 42.5 17 42.5S32.5 28 32.5 16.8C32.5 8.3 25.6 1.5 17 1.5z" fill="#7A1F2B" stroke="#fff" stroke-width="2"/><circle cx="17" cy="16.5" r="5.5" fill="#FBF8F3"/></svg>' });
      marker = L.marker(ll, { draggable: true, icon, title: t("px.loc.pin"), alt: t("px.loc.pin"), keyboard: true }).addTo(map);
      marker.on("dragend", () => { const p = marker.getLatLng(); setLoc(p.lat, p.lng, "map"); if (ring) { ring.remove(); ring = null; } setLocMsg("px.loc.set"); });
    } else marker.setLatLng(ll);
  }
  function showMap(center, zoom) {
    locMapEl.hidden = false;
    return loadLeaflet().then(L => {
      if (!map) {
        const coarse = matchMedia("(pointer:coarse)").matches;
        /* one-finger drag would hijack the bottom sheet scroll on phones: pan with pinch / +−, tap to move the pin */
        map = L.map(locMapEl, { center, zoom, dragging: !coarse, scrollWheelZoom: false, tap: false, zoomControl: true, attributionControl: true });
        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' }).addTo(map);
        map.on("click", e => { placePin(L, e.latlng); setLoc(e.latlng.lat, e.latlng.lng, "map"); if (ring) { ring.remove(); ring = null; } setLocMsg("px.loc.set"); });
        locMapEl.setAttribute("aria-label", t("px.loc.mapAria"));
      } else map.setView(center, zoom);
      requestAnimationFrame(() => map.invalidateSize());
      setTimeout(() => map && map.invalidateSize(), 450);   /* after the sheet transition */
      return L;
    }).catch(() => { locMapEl.hidden = true; setLocMsg(loc ? locState && locState[0] || "px.loc.set" : "px.loc.mapError", locState && locState[1], !loc); return null; });
  }
  function showLocOnMap() {
    if (!loc) return;
    showMap([loc.lat, loc.lng], 17).then(L => {
      if (!L) return;
      placePin(L, [loc.lat, loc.lng]);
      if (ring) { ring.remove(); ring = null; }
      if (loc.acc && loc.acc < 2000) ring = L.circle([loc.lat, loc.lng], { radius: loc.acc, color: "#7A1F2B", weight: 1, opacity: .5, fillColor: "#7A1F2B", fillOpacity: .08, interactive: false }).addTo(map);
    });
  }
  $("#locUse").onclick = () => {
    const b = $("#locUse");
    if (!("geolocation" in navigator) || !window.isSecureContext) { setLocMsg("px.loc.unsupported", null, true); return; }
    b.setAttribute("aria-busy", "true"); setLocMsg("px.loc.locating");
    loadLeaflet().catch(() => {});          /* warm the map while the GPS works */
    navigator.geolocation.getCurrentPosition(p => {
      b.removeAttribute("aria-busy");
      const acc = Math.round(p.coords.accuracy || 0);
      setLoc(p.coords.latitude, p.coords.longitude, "gps", acc);
      setLocMsg("px.loc.ok", { acc: acc || "?" });
      showLocOnMap();
    }, err => {
      b.removeAttribute("aria-busy");
      setLocMsg(err && err.code === 1 ? "px.loc.denied" : err && err.code === 3 ? "px.loc.timeout" : "px.loc.unavailable", null, true);
    }, { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 });
  };
  $("#locPick").onclick = () => {
    if (loc) { showLocOnMap(); return; }
    setLocMsg("px.loc.tap");
    showMap(LECHERIA, 14);
  };
  $("#locClear").onclick = () => {
    loc = null; $("#locClear").hidden = true; setLocMsg(null); syncType();
    if (marker) { marker.remove(); marker = null; } if (ring) { ring.remove(); ring = null; }
    locMapEl.hidden = true; $("#locUse").focus();
  };
  /* Google Maps link: the branch / rider opens the exact pin from the WhatsApp chat */
  const locLine = () => loc ? `*Ubicación:* https://www.google.com/maps?q=${loc.lat.toFixed(6)},${loc.lng.toFixed(6)}` : "";

  try {
    const sc = JSON.parse(localStorage.getItem("amir-customer")) || {};
    ["name", "phone", "ref"].forEach(k => { if (sc[k]) form.elements[k].value = sc[k]; });
    if (sc.branch && branchById(sc.branch)) { renderBranches(); const r = form.querySelector(`input[name="branch"][value="${CSS.escape(sc.branch)}"]`); if (r) r.checked = true; }
    if (isFinite(sc.lat) && isFinite(sc.lng) && sc.lat !== null && Math.abs(sc.lat) <= 90 && Math.abs(sc.lng) <= 180) { setLoc(sc.lat, sc.lng, "saved"); setLocMsg("px.loc.saved"); }
  } catch (e) { /* ignore */ }

  const dlgTrigger = () => !matchMedia(mqSheet).matches ? "#ledgerGo" : $("#pill").offsetParent ? "#pill" : ".bnav-order";
  /* "view my order" (pill / header bag) opens on the cart; "Continue" in the desktop ledger, which already lists it, skips to delivery */
  function openSheet(at) {
    $("#done").hidden = true; form.hidden = $("#sheetFoot").hidden = false;
    syncFolds(); goStep(typeof at === "number" ? at : 0);
    openDlg(sheet, "#closeSheet", dlgTrigger());
    updateStatus(); syncType();
  }

  /* ---------- checkout steps: 0 = the cart (edit quantities, drinks upsell), 1 delivery, 2 details, 3 payment ---------- */
  const STEP_FIELDS = { 2: ["name", "phone"] };
  function shake(el) {
    const f = el.closest(".f"); f.classList.remove("shake"); void f.offsetWidth; f.classList.add("shake");   /* polish.css */
    el.addEventListener("animationend", () => f.classList.remove("shake"), { once: true });
  }
  function stepOk(n) {
    let bad = null;
    (STEP_FIELDS[n] || []).forEach(k => { const el = form.elements[k]; if (el.closest(".f").hidden) return; if (!validate(el)) { if (!bad) bad = el; shake(el); } });
    if (n === 1 && !bad && !validateBranch()) bad = $("#branchF input");
    if (n === 1 && !bad && !validateLoc()) { bad = $("#locUse"); shake(bad); }
    if (bad) bad.focus();
    return !bad;
  }
  function goStep(n) {
    step = n;
    $$("#form .ck-step").forEach(s => { s.hidden = +s.dataset.step !== n; });
    $("#steps").hidden = n === 0;
    $$("#steps li").forEach(li => { const g = +li.dataset.go; li.classList.toggle("on", g === n); li.classList.toggle("done", g < n); });
    $("#stepBack").hidden = n === 0;
    $("#stepNext").hidden = n === 3; $("#send").hidden = n !== 3;
    syncNeedLoc();
    $("#sheetTitle").textContent = t(n === 0 ? "ledger.title" : "sheet.title");
    form.scrollTop = 0;
  }
  /* delivery without a location: the box is highlighted ("Obligatorio") and Continue becomes "Marca tu ubicación",
     which asks for the GPS position (or opens the map if GPS already failed) instead of showing an error */
  function syncNeedLoc() {
    const need = isDel() && !loc, b = $("#stepNext"), ask = need && step === 1, [go, set] = b.querySelectorAll("span");
    $("#locF").classList.toggle("need", need);
    b.classList.toggle("need-loc", ask); b.querySelector(".pin").toggleAttribute("hidden", !ask);   /* SVG has no .hidden property */
    set.hidden = !ask; go.hidden = ask;
  }
  $("#stepNext").onclick = () => {
    if (step === 0 && !count()) { toast(t("cart.needOne")); return; }
    if (step === 1 && isDel() && !loc) {
      const gpsFailed = locState && locState[2] && locState[0] !== "px.loc.mapError";
      $(gpsFailed ? "#locPick" : "#locUse").click(); $("#locF").scrollIntoView({ block: "center", behavior: reduce.matches ? "auto" : "smooth" });
      return;
    }
    if (step && !stepOk(step)) return;
    goStep(step + 1);
  };
  $("#stepBack").onclick = () => goStep(step - 1);
  $$("#steps li").forEach(li => { li.onclick = () => { const g = +li.dataset.go; if (g < step) goStep(g); }; });

  /* optional fields stay folded behind "+ …" links until opened (or already filled) */
  function openFold(id, focus) {
    const f = $("#" + id); f.classList.add("open");
    const b = form.querySelector(`[data-open="${id}"]`); if (b) b.hidden = true;
    if (focus) { const i = f.querySelector("textarea,input,button"); if (i) i.focus(); }
  }
  function syncFolds() {
    if (form.elements.ref.value.trim()) openFold("refF");
    if (form.elements.notes.value.trim()) openFold("notesF");
  }
  form.addEventListener("click", e => { const b = e.target.closest("[data-open]"); if (b) openFold(b.dataset.open, true); });

  /* compact total bar: tap the total for the breakdown */
  $("#sumToggle").onclick = () => { const x = $("#sumX"), o = x.hidden; x.hidden = !o; $("#sumToggle").setAttribute("aria-expanded", String(o)); };
  $("#ledgerGo").onclick = () => openSheet(1);
  $("#pill").onclick = () => openSheet(0);
  /* bottom-nav PEDIR: with dishes in the cart it opens the order, otherwise it jumps to the menu (#carta) */
  const bnavOrder = $(".bnav-order");
  if (bnavOrder) bnavOrder.addEventListener("click", e => { if (count()) { e.preventDefault(); openSheet(0); } });
  $("#hdCart").onclick = () => { if (count()) openSheet(0); else toast(t("cart.needOne")); };

  function nextOrderId() {
    const n = caracasNow(), k = n.mm + n.dd; let s = { k: "", n: 0 };
    try { s = JSON.parse(localStorage.getItem("amir-seq")) || s; } catch (e) { /* ignore */ }
    const num = s.k === k ? s.n + 1 : 1;
    try { localStorage.setItem("amir-seq", JSON.stringify({ k, n: num })); } catch (e) { /* ignore */ }
    return `AP-${k}-${String(num).padStart(3, "0")}`;
  }
  /* lazy Leaflet only once the delivery checkout is open; show the saved pin */
  function warmMap() {
    if (loc) { if (!map || locMapEl.hidden) showLocOnMap(); }
    else loadLeaflet().catch(() => {});
  }
  function buildMessage(id) {
    const b = curBranch(), L = buildBaseMessage(id).split("\n");
    /* "*Sucursal:*" right after "*Tipo:*" */
    if (b) { const typeP = I.tEs("wa.order.type", { type: "" }).trim(), i = L.findIndex(l => l.startsWith(typeP)); L.splice(i < 0 ? 2 : i + 1, 0, `*Sucursal:* ${I.wx(b.nombre)}`); }
    /* "*Ubicación:*" after the reference point (or right before the dishes) */
    const line = isDel() ? locLine() : "";
    if (line) {
      const refP = I.tEs("wa.order.ref", { ref: "" }).trim();
      let i = L.findIndex(l => l.startsWith(refP));
      if (i < 0) i = Math.max(0, L.indexOf(I.tEs("wa.order.sep")) - 1);
      L.splice(i + 1, 0, line);
    }
    return L.join("\n");
  }
  function buildBaseMessage(id) {
    const tt = totals(), n = caracasNow(), r = rate(), F = form.elements;
    return I.buildOrderMessage({
      id, stamp: `${n.dd}/${n.mm} ${n.hh}:${n.mi}`,
      name: F.name.value, phone: F.phone.value, type: F.type.value,
      ref: F.ref.value,
      lines: Object.keys(cart).map(k => ({ qty: cart[k], name: lineName(k), total: unitPrice(k) * cart[k] })),
      subtotal: tt.sub, total: tt.total,
      bsTotal: r ? I.bs(tt.total, r, "es") : "", rate: r ? I.num(r, 2, 2, "es") : "",
      pay: F.pay.value, notes: F.notes.value
    });
  }
  function waUrl(msg) {
    const base = `https://wa.me/${waNumber()}?text=`;
    if ((base + encodeURIComponent(msg)).length <= 1900) return { url: base + encodeURIComponent(msg), cut: false };
    let m = msg; while ((base + encodeURIComponent(m + "\n…")).length > 1900) m = m.slice(0, -40);
    return { url: base + encodeURIComponent(m + "\n…"), cut: true };
  }

  let order = null;
  form.addEventListener("submit", e => {
    e.preventDefault();
    if (step < 3) { $("#stepNext").click(); return; }   /* Enter on an earlier step = Continue */
    updateStatus();
    let firstBad = null;
    ["name", "phone"].forEach(k => {
      const el = form.elements[k]; if (el.closest(".f").hidden) return;
      if (!validate(el)) { if (!firstBad) firstBad = el; shake(el); }
    });
    if (!firstBad && !validateBranch()) firstBad = $("#branchF input");
    if (!firstBad && !validateLoc()) firstBad = $("#locUse");
    if (firstBad) { goStep(+firstBad.closest(".ck-step").dataset.step); firstBad.focus(); return; }
    const r = blockReason();
    if (r) { toast(r); return; }
    const id = nextOrderId(), msg = buildMessage(id), w = waUrl(msg), tt = totals();
    order = { id, msg, url: w.url, cut: w.cut, total: tt.total, pay: form.elements.pay.value, branch: (curBranch() || {}).nombre || "" };
    const win = window.open(w.url, "_blank");
    if (win) { try { win.opener = null; } catch (er) { /* ignore */ } }
    if ($("#remember").checked) {
      const v = k => form.elements[k].value.trim();
      try { localStorage.setItem("amir-customer", JSON.stringify({ name: v("name"), phone: v("phone"), ref: v("ref"), branch: isDel() ? undefined : (curBranch() || {}).id, lat: loc ? loc.lat : null, lng: loc ? loc.lng : null })); } catch (er) { /* ignore */ }
    } else { try { localStorage.removeItem("amir-customer"); } catch (er) { /* ignore */ } }
    showDone();
  });
  function showDone(refresh) {
    const o = order, r = rate(), tot = money(o.total);
    const note = t("send.spanishNote");
    const d = $("#done");
    d.innerHTML = `<div class="ok-ic" aria-hidden="true"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.2 4.2L19 7"/></svg></div>
      <h3 id="doneH" tabindex="-1">${t("done.title", { id: `<bdi>${esc(o.id)}</bdi>` })}</h3>
      <p>${t("done.p1", { total: tot, bs: r ? ` (≈ ${I.bs(o.total, r)})` : "" })}</p>
      ${o.branch ? `<p class="note-es">${esc(t("px.branch.serves", { name: o.branch }))}</p>` : ""}
      ${note ? `<p class="note-es">${esc(note)}</p>` : ""}
      ${o.cut ? `<p class="cut">${esc(t("done.cut"))}</p>` : ""}
      <p>${esc(t("done.notOpened"))}</p>
      <div class="btns"><a class="btn btn--wine" id="waLink" href="${esc(o.url)}" target="_blank" rel="noopener">${esc(t("done.openWa"))}</a>
      <button type="button" class="btn btn--line" id="copyOrder">${esc(t("done.copy"))}</button></div>
      <div class="btns"><button type="button" class="btn btn--wine" id="clearAfter">${esc(t("done.clear"))}</button><button type="button" class="btn btn--line" id="keepCart">${esc(t("done.keep"))}</button></div>`;
    form.hidden = $("#sheetFoot").hidden = true; d.hidden = false; $("#sheetTitle").textContent = t("done.sheetTitle");
    if (!refresh) $("#doneH").focus();
    $("#copyOrder").onclick = () => copyText(o.msg).then(() => toast(t("cart.orderCopied")));
    $("#clearAfter").onclick = () => { cart = {}; $$(".dish").forEach(li => renderOne(li.dataset.id)); refreshAll(); closeDlg(sheet); toast(t("cart.clearedThanks")); };
    $("#keepCart").onclick = () => closeDlg(sheet);
  }

  /* ---------- footer + contact (no placeholders on screen) ---------- */
  const waHref = `https://wa.me/${CONFIG.whatsapp}`;
  function buildFooter() {
    const today = caracasNow().dow;
    $("#ftHours").innerHTML = [1, 2, 3, 4, 5, 6, 0].map(i => {
      const h = CONFIG.horario[DAYS[i]], c = i === today ? ' class="now"' : "";
      return `<dt${c}>${esc(I.day(i))}</dt><dd${c}>${h ? `<span class="num">${esc(I.time12(h[0]))} – ${esc(I.time12(h[1]))}</span>` : esc(t("visit.closed"))}</dd>`;
    }).join("");
  }
  $$("[data-wa]").forEach(a => { a.href = waHref; });

  /* ---------- language ---------- */
  const AR_FONTS = "/assets/fonts/arabic-pedir.css";
  function ensureArFonts() {
    if (I.lang !== "ar" || doc.querySelector("link[data-ar-fonts]")) return;
    const l = doc.createElement("link"); l.rel = "stylesheet"; l.href = AR_FONTS; l.setAttribute("data-ar-fonts", ""); doc.head.append(l);
  }
  function applyPx() {
    $$("[data-px]").forEach(el => { let v; try { v = el.dataset.pxVars ? JSON.parse(el.dataset.pxVars) : undefined; } catch (e) { v = undefined; } el.textContent = t(el.dataset.px, v); });
  }
  const canon = $('link[rel="canonical"]'), canonBase = canon ? canon.href.split("?")[0] : "";
  function renderAll(first) {
    ensureArFonts();
    I.apply(doc); applyPx();
    if (canon) { const m = /[?&]lang=(en|ar)(?:&|#|$)/.exec(location.search); canon.href = canonBase + (m ? "?lang=" + m[1] : ""); }
    if (first && I.lang === "es" && catsEl.dataset.sig === SIG) hydrate();
    else renderMenu(!first);
    renderBranches(); syncType(); renderLines(); renderMinFact();
    if ($("#eBranch").textContent) validateBranch(); updateStatus(); buildFooter();
    if (opt && isOpen(optDlg)) openOptions(opt.id, true);
    if (order && !$("#done").hidden) { showDone(true); $("#sheetTitle").textContent = t("done.sheetTitle"); }
    else $("#sheetTitle").textContent = t("sheet.title");
    $$('#form [aria-invalid="true"]').forEach(validate);
    if (locState) setLocMsg(locState[0], locState[1], locState[2]);
    if (map) locMapEl.setAttribute("aria-label", t("px.loc.mapAria"));
    if (marker) { const im = marker.getElement && marker.getElement(); if (im) { im.title = t("px.loc.pin"); im.setAttribute("aria-label", t("px.loc.pin")); } }
    if (first) {
      measure(); requestAnimationFrame(spy);
      if (I.lang !== "es" && location.hash) { const h = doc.getElementById(decodeURIComponent(location.hash.slice(1))); if (h) h.scrollIntoView({ block: "start", behavior: "instant" }); }
    }
    reveal();
  }
  function renderMinFact() {
    const m = +CONFIG.pedidoMinimo || 0;
    $("#factMin").hidden = !m;
    $("#factMinT").textContent = m ? t("pedir.factMin", { min: money(m) }) : "";
  }
  doc.addEventListener("langchange", () => renderAll(false));
  renderAll(true);
  setInterval(updateStatus, 30000);
  doc.addEventListener("visibilitychange", () => { if (!doc.hidden) updateStatus(); });
  if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(measure);
})();
