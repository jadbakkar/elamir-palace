/* =====================================================================
   El Amir Palace - i18n.js   (ES / EN / AR)
   Self-contained, plain script, no build step. Exposes window.I18N.

   Load it in <head>, BEFORE the page scripts. Either sync (no defer/async) so <html lang> / dir
   are set before first paint, or with `defer` on pages that set <html data-static-lang> and run a
   tiny inline bootstrap that sets lang/dir (see index.html):

     <script src="i18n.js"></script>

   Quick API
     I18N.lang                      current language: "es" | "en" | "ar"
     I18N.set("ar")                 switch (persists in localStorage "amir-lang",
                                    sets <html lang dir>, re-applies data-i18n,
                                    fires "langchange" on document)
     I18N.t("cart.empty", vars)     UI string with {placeholders}; falls back to es
     I18N.tp("cart.dishes", n)      plural-aware string (cart.dishes.one / .other ...)
     I18N.tEs(key, vars)            ALWAYS Spanish (used for WhatsApp output)
     I18N.dish(esName, esDesc?, esCat?)  -> {name, desc}
     I18N.cat(esCat)                -> translated category name
     I18N.note(esNote)              -> translated category note
     I18N.opt(esText)               -> translated option label / choice
     I18N.catDesc(esCat)            -> home page "carta" teaser line for a category
     I18N.apply(root)               fill data-i18n / data-i18n-attr / data-i18n-html
     I18N.money(n) / num / bs       "$12", "$1.50" in every language (USD, Western digits);
                                    num(n,min,max,lang) and bs(usd,rate,lang) accept a forced language
     I18N.time12 / day / when / status    open-hours helpers
     I18N.buildOrderMessage(o) / buildReservationMessage(r)   WhatsApp text, ALWAYS Spanish
     I18N.searchKey(esName, esDesc, esCat) language-independent search haystack
     I18N.missing(MENU)             audit a MENU array for untranslated entries

   WhatsApp policy: whatever language the customer browses in, the text that is
   sent to the restaurant is ALWAYS Spanish (the staff read Spanish). When the
   customer browses in English/Arabic one extra line is added:
        *Idioma del cliente:* English      /      *Idioma del cliente:* العربية
   Cart keys, <input value>s, dish ids/slugs and #anchors stay Spanish too.
   Only what the visitor SEES is translated.

   Conventions
     - Labels such as "Historia" are stored in natural case. Apply
       text-transform:uppercase in CSS where the design wants caps
       (see .i18n-uc in i18n.css). Never upper-case Arabic with letter-spacing.
     - Prices are USD everywhere: "$12". Digits are always Western (0-9), also in Arabic.
     - Strings used with data-i18n-html / innerHTML are TRUSTED dictionary strings
       (they contain <b>). Variables passed to them must already be escaped.
   ===================================================================== */
(function (global) {
  "use strict";

  var LANGS = ["es", "en", "ar"];
  var STORE_KEY = "amir-lang";
  var NAMES = { es: "Español", en: "English", ar: "العربية" };
  var LOCALES = { es: "es-VE", en: "en-US", ar: "ar-u-nu-latn" };
  var OG_LOCALE = { es: "es_VE", en: "en_US", ar: "ar_AR" };
  var DAYKEYS = ["dom", "lun", "mar", "mie", "jue", "vie", "sab"]; /* Sunday = 0 (JS getDay) */

  /* =====================================================================
     1. UI DICTIONARY
     ===================================================================== */
  var dict = {};

  /* ----------------------------- ESPAÑOL ----------------------------- */
  dict.es = {
    /* page meta */
    "meta.index.title": "El Amir Palace | Restaurante libanés en Lechería y Puerto La Cruz",
    "meta.index.description": "Restaurante libanés y mediterráneo desde 1997, con sucursales en Lechería y Puerto La Cruz (Anzoátegui). Shawarma, bandejas árabes y parrillas. Pide delivery o para retirar por WhatsApp.",
    "meta.index.ogDescription": "Cocina libanesa desde 1997 en Lechería y Puerto La Cruz. Pide delivery o para retirar por WhatsApp.",
    "meta.pedir.title": "Pedir a domicilio | El Amir Palace",
    "meta.pedir.description": "Restaurante libanés y mediterráneo. Mezze, shawarmas, parrillas y más. Pide delivery o retiro y confirma por WhatsApp.",
    "meta.pedir.ogDescription": "Mezze, shawarmas y parrillas libanesas. Delivery o retiro, confirmación por WhatsApp.",

    /* brand + language switcher */
    "brand.name": "El Amir Palace",
    "brand.arName": "قصر الأمير",
    "brand.cuisine": "Cocina libanesa y mediterránea",
    "lang.label": "Idioma",
    "lang.es": "Español",
    "lang.en": "English",
    "lang.ar": "العربية",

    /* navigation (home) */
    "nav.homeAria": "El Amir Palace, inicio",
    "bnav.aria": "Navegación principal", "bnav.home": "Inicio", "bnav.menu": "Carta", "bnav.order": "Pedir", "bnav.branches": "Sucursales", "bnav.wa": "WhatsApp",
    "nav.historia": "Historia",
    "nav.especialidades": "Especialidades",
    "nav.carta": "Carta",
    "nav.visitanos": "Visítanos",
    "nav.reservar": "Reservar",
    "nav.pedir": "Pedir",
    "nav.footerAria": "Pie de página",

    /* home: hero */
    "hero.since": "Desde 1997",
    "hero.tagline": "Cocina libanesa y mediterránea, con las recetas de siempre y la generosidad de la mesa árabe.",
    "hero.ctaOrder": "Pedir a domicilio",
    "hero.ctaReserve": "Reservar mesa",
    "hero.plateAlt": "Bandeja árabe con kibbe, falafel, tabaquitos, makanek, tabbule y pinchos",

    /* home: story */
    "story.label": "Nuestra historia",
    "story.title": "La mesa del cedro",
    "story.lead": "El cedro del Líbano es símbolo de hospitalidad y de raíces profundas. Desde 1997 lo llevamos en nuestro escudo, y en cada plato que sale de la cocina.",
    "story.body": "Kibbe horneado, tabaquitos de uva enrollados a mano, cremas de garbanzo y berenjena, pinchos a la brasa. La cocina libanesa se comparte, y en El Amir Palace la servimos como en casa: en bandejas para toda la mesa.",
    "story.stat1": "abrimos nuestras puertas",
    "story.stat2": "platos en la carta",
    "story.stat3": "personas por bandeja",

    /* home: signature dishes */
    "sig.label": "Especialidades de la casa",
    "sig.title": "Para compartir",
    "sig.order": "Pedir ahora",
    "sig.d1.label": "Brochetas y pinchos",
    "sig.d1.title": "Brochetas El Amir",
    "sig.d1.desc": "Dos pinchos de pollo, tres de kafta y dos de lomito, ocho alas rebozadas y ocho makanek, con tomates, cebollas y pimentones a la brasa, papas fritas y pan especial de la casa.",
    "sig.d1.alt": "Brochetas El Amir sobre tabla de madera",
    "sig.d2.label": "Carnes y aves",
    "sig.d2.title": "Pollo a la brasa El Amir",
    "sig.d2.desc": "Pollo a la brasa con chorizos, pimentones asados, papas francesas, ensalada rallada y nuestro arroz especial.",
    "sig.d2.alt": "Pollo a la brasa El Amir con papas, pimentones y arroz",
    "sig.d3.label": "Entradas árabes",
    "sig.d3.title": "Tabaquitos de uva",
    "sig.d3.desc": "Hojas de parra enrolladas a mano y servidas con limón. Un clásico de la mesa libanesa, también en versión de repollo.",
    "sig.d3.alt": "Tabaquitos de hoja de uva con limón",

    /* home: more from the menu */
    "more.title": "Más de la carta",
    "more.all": "Ver todo",
    "more.railAria": "Platos destacados",

    /* home: menu teaser */
    "carta.label": "La carta",
    "carta.title": "Del horno, la brasa y el mar",
    "carta.text": "Catorce secciones, de las cremas y el kibbe a las parrillas, los mariscos y las paellas. Pide a domicilio o mira la carta completa.",
    "carta.order": "Pedir a domicilio",
    "carta.pdf": "Carta en PDF",
    "carta.catdesc.entradas-arabes": "Hummus, kibbe, tabaquitos",
    "carta.catdesc.entradas-mediterraneas": "Carpaccio, ceviche",
    "carta.catdesc.sopas-y-cremas": "Fosforera, auyama",
    "carta.catdesc.ensaladas": "Fattoush, tabbule, burrata",
    "carta.catdesc.platos-arabes-especiales": "Fatte, bandejas árabes",
    "carta.catdesc.shawarmas-y-sandwiches": "Shawarma, tawook, falafel",
    "carta.catdesc.brochetas-y-parrillas": "Kafta, lomito, mar y tierra",
    "carta.catdesc.carnes-y-aves": "Filet mignon, pollo a la brasa",
    "carta.catdesc.pescados-y-mariscos": "Mero, pulpo, langostinos",
    "carta.catdesc.arroces": "Paella, fideuá, risotto",
    "carta.catdesc.pastas": "Linguini, fettuccine",
    "carta.catdesc.hamburguesas": "Oh My Burger!, pollo crispy",
    "carta.catdesc.batidos-y-yogurt": "Frutas naturales",
    "carta.catdesc.bebidas": "Refrescos, té, agua",

    /* home: reservation form */
    "res.label": "Reservaciones",
    "res.title": "Reserva tu mesa",
    "res.lead": "Cuéntanos cuándo vienes y cuántos son. Te confirmamos la reserva por WhatsApp.",
    "res.name": "Nombre",
    "res.people": "Personas",
    "res.more8": "Más de 8",
    "res.date": "Fecha",
    "res.time": "Hora",
    "res.notes": "Ocasión o notas (opcional)",
    "res.notesPh": "Cumpleaños, mesa con arguile…",
    "res.submit": "Reservar por WhatsApp",
    "res.err": "Completa nombre, fecha y hora para reservar.",
    "send.spanishNote": "",

    /* home: visit */
    "visit.title": "Visítanos",
    "visit.address": "Dirección",
    "visit.map": "Ver en Google Maps",
    "visit.hours": "Horario",
    "visit.closed": "Cerrado",
    "visit.contact": "Contacto",
    "visit.whatsapp": "WhatsApp",
    "visit.instagram": "Instagram {handle}",

    /* footer (both pages) */
    "footer.logoAlt": "El Amir Palace, desde 1997",
    "footer.copy": "© {year} El Amir Palace. Los precios no incluyen IVA.",
    "footer.prices": "Precios en dólares, sin IVA.",
    "footer.hours": "Horario",
    "footer.visit": "Visítanos",
    "footer.explore": "Explorar", "footer.contact": "Contacto",

    /* days / time / units */
    "day.lun": "Lunes", "day.mar": "Martes", "day.mie": "Miércoles", "day.jue": "Jueves",
    "day.vie": "Viernes", "day.sab": "Sábado", "day.dom": "Domingo",
    "time.am": "am", "time.pm": "pm",
    "unit.min": "min",
    "when.today": "hoy",
    "when.tomorrow": "mañana",
    "when.onDay": "el {day}",

    /* opening status (pill, closed bar, checkout note) */
    "status.checking": "Verificando horario…",
    "status.openUntil": "Abierto ahora · hasta las {time}",
    "status.closed": "Cerrado ahora",
    "status.closedOpensAt": "Cerrado ahora · Abrimos {when} a las {time}",
    "status.opensAt": "Abrimos {when} a las {time}",
    "status.closedNote": "{status}. Puedes armar tu pedido, pero no enviarlo todavía.",

    /* ordering page: hero + toolbar */
    "pedir.skip": "Saltar al menú",
    "pedir.heroAria": "Pedir a domicilio",
    "pedir.back": "El Amir Palace",
    "pedir.waTop": "Escríbenos por WhatsApp",
    "pedir.title": "Pide a domicilio",
    "pedir.sub": "La carta completa de El Amir Palace. Arma tu pedido y lo confirmamos por WhatsApp.",
    "pedir.factDelivery": "<b>Delivery</b> o retiro",
    "pedir.factPay": "Pago móvil, efectivo (Bs. o divisas), Binance o Zinli",
    "pedir.factMin": "Pedido mínimo de {min}, sin contar el delivery",
    "pedir.noscript": "Necesitas activar JavaScript para ver el menú y pedir en línea. Escríbenos por WhatsApp.",
    "search.placeholder": "Buscar: shawarma, kibbe…",
    "search.aria": "Buscar en el menú",
    "search.clear": "Borrar búsqueda",
    "search.none": "No encontramos ese plato. Prueba con otro nombre o revisa las categorías.",
    "chips.aria": "Categorías",
    "chips.featured": "Destacados",

    /* dish rows (aria-labels) */
    "dish.add": "Agregar {name}",
    "dish.addAnother": "Agregar otro: {name}",
    "dish.removeOne": "Quitar uno: {name}",
    "dish.chooseOptions": "Elegir opciones: {name}",
    "dish.chooseOptionsQty": "Elegir opciones: {name}, {qty} en tu pedido",
    "dish.inOrder": "{qty} en tu pedido",

    /* cart: ledger, pill, lines */
    "ledger.aria": "Tu pedido",
    "ledger.title": "Tu pedido",
    "ledger.clear": "Vaciar",
    "ledger.subtotal": "Subtotal",
    "ledger.hint": "Delivery según tu zona. Precios sin IVA.",
    "ledger.go": "Continuar con el pedido",
    "ledger.addOne": "Agrega un plato para continuar.",
    "ledger.greet": "أهلاً",
    "ledger.empty": "Toca + en cualquier plato para empezar tu pedido.",
    "upsell.title": "¿Agregar una bebida?",
    "pill.view": "Ver mi pedido",
    "pill.aria": "Ver mi pedido, {items}, {total}",
    "cart.dishes.one": "{n} plato",
    "cart.dishes.other": "{n} platos",
    "cart.added": "{name} agregado",
    "cart.max": "Máximo {max} por plato",
    "cart.cleared": "Pedido vaciado",
    "cart.clearedThanks": "Carrito vaciado. ¡Gracias!",
    "cart.undo": "Deshacer",
    "cart.copied": "Copiado",
    "cart.orderCopied": "Pedido copiado",
    "cart.min": "Te faltan {missing} para el pedido mínimo ({min}).",
    "cart.needOne": "Agrega al menos un plato.",

    /* option dialog */
    "opt.required": "(obligatorio)",
    "opt.pick": "Elige una opción: {label}.",
    "opt.add": "Agregar · {total}",
    "opt.less": "Menos",
    "opt.more": "Más",
    "opt.close": "Cerrar",

    /* checkout sheet */
    "sheet.title": "Finalizar pedido",
    "sheet.close": "Cerrar",
    "sheet.how": "¿Cómo lo recibes?",
    "type.delivery": "Delivery",
    "type.pickup": "Retiro en tienda",
    "sheet.data": "Tus datos",
    "f.name": "Nombre",
    "f.phone": "Teléfono (WhatsApp)",
    "f.phonePh": "0414-0000000",
    "f.zone": "Zona de entrega",
    "f.zonePh": "Elige tu zona…",
    "f.addr": "Dirección de entrega",
    "f.addrPh": "Urbanización, calle, edificio, apto.",
    "f.ref": "Punto de referencia (opcional)",
    "f.refPh": "Frente a la panadería…",
    "sheet.pay": "Forma de pago",
    "pay.pagomovil": "Pago móvil",
    "pay.cash": "Efectivo divisas ($)",
    "pay.zelle": "Zelle",
    "pay.pos": "Punto de venta",
    "f.cash": "¿Con cuánto pagas? (opcional)",
    "f.cashPh": "Ej. billete de $20",
    "f.notes": "Notas para la cocina (opcional)",
    "f.notesPh": "Sin cebolla, salsa aparte, alergias…",
    "f.remember": "Recordar mis datos en este dispositivo",
    "zone.info": "Delivery {fee} · {eta}",
    "pay.mm.intro": "Pagarás por Pago móvil.",
    "pay.mm.data": "Datos del pago.",
    "pay.mm.dataBs": "Datos del pago (monto en Bs. a tasa BCV).",
    "pay.mm.send": "Envía la referencia del pago por el chat de WhatsApp; confirmaremos al recibirlo.",
    "pay.mm.totalNoRate": "Total: <b>{total}</b> (el monto en Bs. te lo confirmamos por WhatsApp).",
    "pay.zelle.info": "Te daremos el correo de Zelle al enviar el pedido. Total: <b>{total}</b>.",
    "kv.bank": "Banco",
    "kv.phone": "Teléfono",
    "kv.id": "Cédula/RIF",
    "kv.amount": "Monto",
    "kv.email": "Correo",
    "kv.copy": "Copiar",
    "kv.copyAria": "Copiar {label}",
    "kv.copyZelle": "Copiar correo Zelle",

    /* totals */
    "totals.subtotal": "Subtotal",
    "totals.delivery": "Delivery",
    "totals.free": "Gratis",
    "totals.chooseZone": "Elige tu zona",
    "totals.total": "Total",
    "totals.totalNoDelivery": "Total (sin delivery)",
    "totals.bsLine": "≈ {bs} · Tasa BCV {rate}{date}",
    "totals.bsDate": " ({date})",
    "totals.bsStale": " · tasa desactualizada, se confirmará",
    "totals.bcvHelp": "Tasa BCV: tipo de cambio oficial del Banco Central de Venezuela",
    "totals.eta": "Tiempo estimado: {eta}",

    /* send button + validation */
    "send.whatsapp": "Enviar pedido por WhatsApp",
    "send.closed": "Cerrado por ahora",
    "err.name": "Escribe tu nombre.",
    "err.phone": "Escribe un teléfono válido, ej. 0414-0000000.",
    "err.zone": "Elige tu zona de entrega.",
    "err.addr": "Escribe la dirección para el delivery.",

    /* success panel */
    "done.sheetTitle": "Pedido listo",
    "done.title": "Pedido {id} listo",
    "done.p1": "Se abrió WhatsApp con tu pedido. <b>Pulsa “Enviar” en WhatsApp para confirmarlo.</b> Total: <b>{total}</b>{bs}.",
    "done.cut": "El pedido es largo y se acortó en el enlace. Usa “Copiar pedido” y pégalo en el chat.",
    "done.notOpened": "¿No se abrió? Usa el botón:",
    "done.openWa": "Abrir WhatsApp",
    "done.copy": "Copiar pedido",
    "done.zelle": "Envía <b>{total}</b> por Zelle a:",
    "done.zelleProof": "Manda el comprobante por el chat.",
    "done.cash": "Pagarás <b>{total}</b> en efectivo al recibir.",
    "done.pos": "Pagarás <b>{total}</b> con punto de venta al recibir.",
    "done.clear": "Ya lo envié: vaciar carrito",
    "done.keep": "Volver y mantener mi carrito",

    /* WhatsApp templates: ALWAYS Spanish. Only defined in "es" on purpose;
       use I18N.tEs() / I18N.build*Message(), never t() with the UI language. */
    "wa.order.title": "*NUEVO PEDIDO #{id}*",
    "wa.order.client": "*Cliente:* {name} | *Tel:* {phone}",
    "wa.order.type": "*Tipo:* {type}",
    "wa.order.zone": "*Zona:* {zone} ({eta})",
    "wa.order.addr": "*Dirección:* {addr}",
    "wa.order.ref": "*Referencia:* {ref}",
    "wa.order.sep": "-----",
    "wa.order.line": "{qty}x {name} - {price}",
    "wa.order.subtotal": "Subtotal: {amount}",
    "wa.order.delivery": "Delivery ({zone}): {amount}",
    "wa.order.total": "*TOTAL: {amount}*",
    "wa.order.totalBs": " (≈ {bs} a tasa BCV {rate})",
    "wa.order.pay": "*Pago:* {pay}",
    "wa.order.payCash": " (paga con {cash})",
    "wa.order.payMobile": " (envío el comprobante por aquí)",
    "wa.order.payRef": " · *Ref:* {ref}",
    "wa.order.payLater": " (pago al recibir)",
    "wa.order.paid": " · *YA PAGADO* (envío el comprobante en este chat)",
    "wa.order.notes": "*Notas:* {notes}",
    "wa.clientLang": "*Idioma del cliente:* {lang}",
    "wa.res.title": "*Reserva · {name}*",
    "wa.res.name": "*Nombre:* {v}",
    "wa.res.branch": "*Sucursal:* {v}",
    "wa.res.people": "*Personas:* {v}",
    "wa.res.date": "*Fecha:* {v}",
    "wa.res.time": "*Hora:* {v}",
    "wa.res.notes": "*Notas:* {v}",
    "wa.value.delivery": "Delivery",
    "wa.value.pickup": "Retiro en tienda",
    "wa.value.pagoMovil": "Pago móvil",
    "wa.value.cash": "Efectivo ($)",
    "wa.value.zelle": "Zelle",
    "wa.value.pos": "Punto de venta",
    "wa.value.more8": "Más de 8"
  };

  /* ----------------------------- ENGLISH ----------------------------- */
  dict.en = {
    "meta.index.title": "El Amir Palace | Lebanese Restaurant in Lechería & Puerto La Cruz",
    "meta.index.description": "Lebanese and Mediterranean restaurant since 1997, with branches in Lechería and Puerto La Cruz, Anzoátegui. Shawarma, Arabic platters and grills. Order delivery or pickup on WhatsApp.",
    "meta.index.ogDescription": "Lebanese food since 1997 in Lechería and Puerto La Cruz. Order delivery or pickup on WhatsApp.",
    "meta.pedir.title": "Order Delivery | El Amir Palace",
    "meta.pedir.description": "Lebanese and Mediterranean restaurant. Mezze, shawarmas, grills and more. Order delivery or pickup and confirm on WhatsApp.",
    "meta.pedir.ogDescription": "Lebanese mezze, shawarmas and grills. Delivery or pickup, confirmed on WhatsApp.",

    "brand.name": "El Amir Palace",
    "brand.arName": "قصر الأمير",
    "brand.cuisine": "Lebanese & Mediterranean cuisine",
    "lang.label": "Language",
    "lang.es": "Español",
    "lang.en": "English",
    "lang.ar": "العربية",

    "nav.homeAria": "El Amir Palace, home",
    "bnav.aria": "Main navigation", "bnav.home": "Home", "bnav.menu": "Menu", "bnav.order": "Order", "bnav.branches": "Locations", "bnav.wa": "WhatsApp",
    "nav.historia": "Our Story",
    "nav.especialidades": "Specialties",
    "nav.carta": "Menu",
    "nav.visitanos": "Visit Us",
    "nav.reservar": "Book a Table",
    "nav.pedir": "Order",
    "nav.footerAria": "Footer",

    "hero.since": "Since 1997",
    "hero.tagline": "Lebanese and Mediterranean cooking, with the recipes we have always made and the generosity of the Arabic table.",
    "hero.ctaOrder": "Order Delivery",
    "hero.ctaReserve": "Book a Table",
    "hero.plateAlt": "Arabic platter with kibbe, falafel, stuffed grape leaves, makanek sausages, tabbouleh and skewers",

    "story.label": "Our Story",
    "story.title": "The Table of the Cedar",
    "story.lead": "The cedar of Lebanon is a symbol of hospitality and deep roots. Since 1997 we have carried it on our crest, and in every dish that leaves the kitchen.",
    "story.body": "Baked kibbe, hand-rolled stuffed grape leaves, chickpea and eggplant dips, charcoal-grilled skewers. Lebanese food is meant to be shared, and at El Amir Palace we serve it the way we do at home: on platters for the whole table.",
    "story.stat1": "we opened our doors",
    "story.stat2": "dishes on the menu",
    "story.stat3": "people per platter",

    "sig.label": "House Specialties",
    "sig.title": "To Share",
    "sig.order": "Order Now",
    "sig.d1.label": "Skewers & Grills",
    "sig.d1.title": "El Amir Skewers",
    "sig.d1.desc": "Two chicken skewers, three kafta and two tenderloin, eight breaded wings and eight makanek (Lebanese sausages), with charcoal-grilled tomatoes, onions and bell peppers, french fries and the house special bread.",
    "sig.d1.alt": "El Amir skewers on a wooden board",
    "sig.d2.label": "Meat & Poultry",
    "sig.d2.title": "El Amir Charcoal-Grilled Chicken",
    "sig.d2.desc": "Charcoal-grilled chicken with chorizo sausages, roasted bell peppers, french fries, shredded salad and our special rice.",
    "sig.d2.alt": "El Amir charcoal-grilled chicken with potatoes, bell peppers and rice",
    "sig.d3.label": "Arabic Starters",
    "sig.d3.title": "Stuffed Grape Leaves (Tabaquitos)",
    "sig.d3.desc": "Vine leaves rolled by hand and served with lemon. A classic of the Lebanese table, also available in a cabbage version.",
    "sig.d3.alt": "Stuffed grape leaves with lemon",

    "more.title": "More from the Menu",
    "more.all": "See All",
    "more.railAria": "Featured dishes",

    "carta.label": "The Menu",
    "carta.title": "From the Oven, the Grill and the Sea",
    "carta.text": "Fourteen sections, from dips and kibbe to grills, seafood and paellas. Order delivery or browse the full menu.",
    "carta.order": "Order Delivery",
    "carta.pdf": "Menu (PDF)",
    "carta.catdesc.entradas-arabes": "Hummus, kibbe, stuffed grape leaves",
    "carta.catdesc.entradas-mediterraneas": "Carpaccio, ceviche",
    "carta.catdesc.sopas-y-cremas": "Fosforera (seafood soup), pumpkin",
    "carta.catdesc.ensaladas": "Fattoush, tabbouleh, burrata",
    "carta.catdesc.platos-arabes-especiales": "Fatteh, Arabic platters",
    "carta.catdesc.shawarmas-y-sandwiches": "Shawarma, tawook, falafel",
    "carta.catdesc.brochetas-y-parrillas": "Kafta, tenderloin, surf and turf",
    "carta.catdesc.carnes-y-aves": "Filet mignon, charcoal-grilled chicken",
    "carta.catdesc.pescados-y-mariscos": "Grouper, octopus, prawns",
    "carta.catdesc.arroces": "Paella, fideuà, risotto",
    "carta.catdesc.pastas": "Linguine, fettuccine",
    "carta.catdesc.hamburguesas": "Oh My Burger!, crispy chicken",
    "carta.catdesc.batidos-y-yogurt": "Fresh fruit",
    "carta.catdesc.bebidas": "Sodas, tea, water",

    "res.label": "Reservations",
    "res.title": "Book Your Table",
    "res.lead": "Tell us when you are coming and how many of you there are. We will confirm your booking on WhatsApp.",
    "res.name": "Name",
    "res.people": "Guests",
    "res.more8": "More than 8",
    "res.date": "Date",
    "res.time": "Time",
    "res.notes": "Occasion or notes (optional)",
    "res.notesPh": "Birthday, table with hookah…",
    "res.submit": "Book via WhatsApp",
    "res.err": "Please fill in your name, date and time to book.",
    "send.spanishNote": "Heads-up: your message to the restaurant is written in Spanish so our team can read it.",

    "visit.title": "Visit Us",
    "visit.address": "Address",
    "visit.map": "View on Google Maps",
    "visit.hours": "Opening Hours",
    "visit.closed": "Closed",
    "visit.contact": "Contact",
    "visit.whatsapp": "WhatsApp",
    "visit.instagram": "Instagram {handle}",

    "footer.logoAlt": "El Amir Palace, since 1997",
    "footer.copy": "© {year} El Amir Palace. Prices do not include VAT.",
    "footer.prices": "Prices in US dollars, VAT not included.",
    "footer.hours": "Opening Hours",
    "footer.visit": "Visit Us",
    "footer.explore": "Explore", "footer.contact": "Contact",

    "day.lun": "Monday", "day.mar": "Tuesday", "day.mie": "Wednesday", "day.jue": "Thursday",
    "day.vie": "Friday", "day.sab": "Saturday", "day.dom": "Sunday",
    "time.am": "am", "time.pm": "pm",
    "unit.min": "min",
    "when.today": "today",
    "when.tomorrow": "tomorrow",
    "when.onDay": "on {day}",

    "status.checking": "Checking opening hours…",
    "status.openUntil": "Open now · until {time}",
    "status.closed": "Closed now",
    "status.closedOpensAt": "Closed now · We open {when} at {time}",
    "status.opensAt": "We open {when} at {time}",
    "status.closedNote": "{status}. You can build your order, but you cannot send it yet.",

    "pedir.skip": "Skip to menu",
    "pedir.heroAria": "Order delivery",
    "pedir.back": "El Amir Palace",
    "pedir.waTop": "Message us on WhatsApp",
    "pedir.title": "Order Delivery",
    "pedir.sub": "The full El Amir Palace menu. Build your order and we will confirm it on WhatsApp.",
    "pedir.factDelivery": "<b>Delivery</b> or pickup",
    "pedir.factPay": "Pago Móvil (local bank transfer), cash (Bs. or USD), Binance or Zinli",
    "pedir.factMin": "Minimum order {min}, before delivery",
    "pedir.noscript": "You need to enable JavaScript to view the menu and order online. Message us on WhatsApp.",
    "search.placeholder": "Search: shawarma, kibbe…",
    "search.aria": "Search the menu",
    "search.clear": "Clear search",
    "search.none": "We could not find that dish. Try another name or browse the categories.",
    "chips.aria": "Categories",
    "chips.featured": "Featured",

    "dish.add": "Add {name}",
    "dish.addAnother": "Add another: {name}",
    "dish.removeOne": "Remove one: {name}",
    "dish.chooseOptions": "Choose options: {name}",
    "dish.chooseOptionsQty": "Choose options: {name}, {qty} in your order",
    "dish.inOrder": "{qty} in your order",

    "ledger.aria": "Your order",
    "ledger.title": "Your Order",
    "ledger.clear": "Clear",
    "ledger.subtotal": "Subtotal",
    "ledger.hint": "Delivery fee depends on your zone. Prices exclude VAT.",
    "ledger.go": "Continue with order",
    "ledger.addOne": "Add a dish to continue.",
    "ledger.greet": "أهلاً",
    "ledger.empty": "Tap + on any dish to start your order.",
    "upsell.title": "Add a drink?",
    "pill.view": "View my order",
    "pill.aria": "View my order, {items}, {total}",
    "cart.dishes.one": "{n} dish",
    "cart.dishes.other": "{n} dishes",
    "cart.added": "{name} added",
    "cart.max": "Maximum {max} per dish",
    "cart.cleared": "Order cleared",
    "cart.clearedThanks": "Cart cleared. Thank you!",
    "cart.undo": "Undo",
    "cart.copied": "Copied",
    "cart.orderCopied": "Order copied",
    "cart.min": "You are {missing} short of the minimum order ({min}).",
    "cart.needOne": "Add at least one dish.",

    "opt.required": "(required)",
    "opt.pick": "Please choose an option: {label}.",
    "opt.add": "Add · {total}",
    "opt.less": "Less",
    "opt.more": "More",
    "opt.close": "Close",

    "sheet.title": "Complete Your Order",
    "sheet.close": "Close",
    "sheet.how": "How would you like to receive it?",
    "type.delivery": "Delivery",
    "type.pickup": "Pickup at the restaurant",
    "sheet.data": "Your details",
    "f.name": "Name",
    "f.phone": "Phone (WhatsApp)",
    "f.phonePh": "0414-0000000",
    "f.zone": "Delivery zone",
    "f.zonePh": "Choose your zone…",
    "f.addr": "Delivery address",
    "f.addrPh": "Neighborhood, street, building, apt.",
    "f.ref": "Landmark (optional)",
    "f.refPh": "Across from the bakery…",
    "sheet.pay": "Payment method",
    "pay.pagomovil": "Pago Móvil",
    "pay.cash": "Cash (USD)",
    "pay.zelle": "Zelle",
    "pay.pos": "Card (POS terminal)",
    "f.cash": "How much will you pay with? (optional)",
    "f.cashPh": "E.g. a $20 bill",
    "f.notes": "Notes for the kitchen (optional)",
    "f.notesPh": "No onions, sauce on the side, allergies…",
    "f.remember": "Remember my details on this device",
    "zone.info": "Delivery {fee} · {eta}",
    "pay.mm.intro": "You will pay by Pago Móvil (instant bank transfer from your phone).",
    "pay.mm.data": "Payment details.",
    "pay.mm.dataBs": "Payment details (amount in Bs. at the BCV rate).",
    "pay.mm.send": "Send the payment reference in the WhatsApp chat; we will confirm once we receive it.",
    "pay.mm.totalNoRate": "Total: <b>{total}</b> (we will confirm the amount in Bs. on WhatsApp).",
    "pay.zelle.info": "We will give you our Zelle email when you send the order. Total: <b>{total}</b>.",
    "kv.bank": "Bank",
    "kv.phone": "Phone",
    "kv.id": "ID / RIF (tax ID)",
    "kv.amount": "Amount",
    "kv.email": "Email",
    "kv.copy": "Copy",
    "kv.copyAria": "Copy {label}",
    "kv.copyZelle": "Copy Zelle email",

    "totals.subtotal": "Subtotal",
    "totals.delivery": "Delivery",
    "totals.free": "Free",
    "totals.chooseZone": "Choose your zone",
    "totals.total": "Total",
    "totals.totalNoDelivery": "Total (excl. delivery)",
    "totals.bsLine": "≈ {bs} · BCV rate {rate}{date}",
    "totals.bsDate": " ({date})",
    "totals.bsStale": " · rate out of date, will be confirmed",
    "totals.bcvHelp": "BCV rate: the official exchange rate of the Central Bank of Venezuela",
    "totals.eta": "Estimated time: {eta}",

    "send.whatsapp": "Send order via WhatsApp",
    "send.closed": "Closed for now",
    "err.name": "Please enter your name.",
    "err.phone": "Enter a valid phone number, e.g. 0414-0000000.",
    "err.zone": "Choose your delivery zone.",
    "err.addr": "Enter the delivery address.",

    "done.sheetTitle": "Order ready to send",
    "done.title": "Order {id} is ready to send",
    "done.p1": "WhatsApp opened with your order. <b>Tap “Send” in WhatsApp to confirm it.</b> Total: <b>{total}</b>{bs}.",
    "done.cut": "The order is long and was shortened in the link. Use “Copy order” and paste it into the chat.",
    "done.notOpened": "Did it not open? Use the button:",
    "done.openWa": "Open WhatsApp",
    "done.copy": "Copy order",
    "done.zelle": "Send <b>{total}</b> via Zelle to:",
    "done.zelleProof": "Send the receipt in the chat.",
    "done.cash": "You will pay <b>{total}</b> in cash when you receive your order.",
    "done.pos": "You will pay <b>{total}</b> by card (POS terminal) when you receive your order.",
    "done.clear": "I have sent it: clear my cart",
    "done.keep": "Go back and keep my cart"
  };

  /* ----------------------------- العربية ----------------------------- */
  dict.ar = {
    "meta.index.title": "El Amir Palace | مطعم لبناني في ليتشيريا وبويرتو لا كروز",
    "meta.index.description": "قصر الأمير (El Amir Palace): مطعم لبناني ومتوسطي منذ 1997، بفرعين في ليتشيريا وبويرتو لا كروز، أنزواتيغي. شاورما وصوانٍ عربية ومشاوي. اطلب التوصيل أو الاستلام عبر واتساب.",
    "meta.index.ogDescription": "مطبخ لبناني منذ 1997 في ليتشيريا وبويرتو لا كروز. اطلب التوصيل أو الاستلام عبر واتساب.",
    "meta.pedir.title": "اطلب التوصيل | El Amir Palace",
    "meta.pedir.description": "مطعم لبناني ومتوسطي. مقبلات ومازات وشاورما ومشاوي وأكثر. اطلب التوصيل أو الاستلام من المطعم وأكّد طلبك عبر واتساب.",
    "meta.pedir.ogDescription": "مقبلات وشاورما ومشاوي لبنانية. توصيل أو استلام، والتأكيد عبر واتساب.",

    "brand.name": "El Amir Palace",
    "brand.arName": "قصر الأمير",
    "brand.cuisine": "مطبخ لبناني ومتوسطي",
    "lang.label": "اللغة",
    "lang.es": "Español",
    "lang.en": "English",
    "lang.ar": "العربية",

    "nav.homeAria": "قصر الأمير، الصفحة الرئيسية",
    "bnav.aria": "التنقل الرئيسي", "bnav.home": "الرئيسية", "bnav.menu": "القائمة", "bnav.order": "اطلب", "bnav.branches": "الفروع", "bnav.wa": "واتساب",
    "nav.historia": "قصتنا",
    "nav.especialidades": "أطباقنا المميزة",
    "nav.carta": "القائمة",
    "nav.visitanos": "زورونا",
    "nav.reservar": "احجز طاولة",
    "nav.pedir": "اطلب",
    "nav.footerAria": "تذييل الصفحة",

    "hero.since": "منذ عام 1997",
    "hero.tagline": "مطبخ لبناني ومتوسطي، بالوصفات التي عرفناها دائماً وبكرم المائدة العربية.",
    "hero.ctaOrder": "اطلب التوصيل",
    "hero.ctaReserve": "احجز طاولة",
    "hero.plateAlt": "صينية عربية مع كبة وفلافل وورق عنب ومقانق وتبولة وأسياخ",

    "story.label": "قصتنا",
    "story.title": "مائدة الأرزة",
    "story.lead": "أرزة لبنان رمزٌ للضيافة والجذور العميقة. منذ عام 1997 نحملها في شعارنا وفي كل طبق يخرج من مطبخنا.",
    "story.body": "كبة بالفرن، وورق عنب ملفوف باليد، ومعجون الحمص والباذنجان، وأسياخ مشوية على الفحم. المطبخ اللبناني يُشارَك، وفي قصر الأمير نقدّمه كما في البيت: في صواني تكفي المائدة كلها.",
    "story.stat1": "افتتحنا أبوابنا",
    "story.stat2": "طبقاً في القائمة",
    "story.stat3": "أشخاص لكل صينية",

    "sig.label": "أطباق البيت المميزة",
    "sig.title": "للمشاركة",
    "sig.order": "اطلب الآن",
    "sig.d1.label": "الأسياخ والمشاوي",
    "sig.d1.title": "أسياخ الأمير",
    "sig.d1.desc": "سيخان من الدجاج وثلاثة من الكفتة وسيخان من الفيليه، وثمانية أجنحة مقرمشة وثماني قطع مقانق، مع الطماطم والبصل والفلفل الرومي المشوي على الفحم، والبطاطا المقلية وخبز البيت الخاص.",
    "sig.d1.alt": "أسياخ الأمير على لوح خشبي",
    "sig.d2.label": "اللحوم والدواجن",
    "sig.d2.title": "دجاج الأمير المشوي على الفحم",
    "sig.d2.desc": "دجاج مشوي على الفحم مع نقانق الشوريزو والفلفل الرومي المشوي والبطاطا المقلية والسلطة المبشورة وأرزنا الخاص.",
    "sig.d2.alt": "دجاج الأمير المشوي مع البطاطا والفلفل الرومي والأرز",
    "sig.d3.label": "المقبلات العربية",
    "sig.d3.title": "ورق العنب (تاباكيتوس)",
    "sig.d3.desc": "أوراق عنب ملفوفة باليد وتُقدَّم مع الليمون. من كلاسيكيات المائدة اللبنانية، ومتوفرة أيضاً بالملفوف.",
    "sig.d3.alt": "ورق عنب محشي مع الليمون",

    "more.title": "المزيد من القائمة",
    "more.all": "عرض الكل",
    "more.railAria": "أطباق مختارة",

    "carta.label": "القائمة",
    "carta.title": "من الفرن والجمر والبحر",
    "carta.text": "أربعة عشر قسماً، من المقبلات والكبة إلى المشاوي والمأكولات البحرية والباييلا. اطلب التوصيل أو تصفّح القائمة كاملة.",
    "carta.order": "اطلب التوصيل",
    "carta.pdf": "القائمة بصيغة PDF",
    "carta.catdesc.entradas-arabes": "حمص، كبة، ورق عنب",
    "carta.catdesc.entradas-mediterraneas": "كارباتشيو، سيفيتشي",
    "carta.catdesc.sopas-y-cremas": "فوسفوريرا، يقطين",
    "carta.catdesc.ensaladas": "فتوش، تبولة، بوراتا",
    "carta.catdesc.platos-arabes-especiales": "فتّة، صواني عربية",
    "carta.catdesc.shawarmas-y-sandwiches": "شاورما، طاووق، فلافل",
    "carta.catdesc.brochetas-y-parrillas": "كفتة، فيليه، بر وبحر",
    "carta.catdesc.carnes-y-aves": "فيليه مينيون، دجاج مشوي",
    "carta.catdesc.pescados-y-mariscos": "هامور، أخطبوط، جمبري",
    "carta.catdesc.arroces": "باييلا، فيدوا، ريزوتو",
    "carta.catdesc.pastas": "لينغويني، فيتوتشيني",
    "carta.catdesc.hamburguesas": "أوه ماي برغر!، دجاج مقرمش",
    "carta.catdesc.batidos-y-yogurt": "فواكه طبيعية",
    "carta.catdesc.bebidas": "مشروبات غازية، شاي، ماء",

    "res.label": "الحجوزات",
    "res.title": "احجز طاولتك",
    "res.lead": "أخبرنا متى ستأتي وكم عددكم، وسنؤكد لك الحجز عبر واتساب.",
    "res.name": "الاسم",
    "res.people": "عدد الأشخاص",
    "res.more8": "أكثر من 8",
    "res.date": "التاريخ",
    "res.time": "الوقت",
    "res.notes": "المناسبة أو ملاحظات (اختياري)",
    "res.notesPh": "عيد ميلاد، طاولة مع أرجيلة…",
    "res.submit": "احجز عبر واتساب",
    "res.err": "يرجى إدخال الاسم والتاريخ والوقت لإتمام الحجز.",
    "send.spanishNote": "تنبيه: رسالتك إلى المطعم تُكتب بالإسبانية ليتمكن فريقنا من قراءتها.",

    "visit.title": "زورونا",
    "visit.address": "العنوان",
    "visit.map": "عرض على خرائط جوجل",
    "visit.hours": "ساعات العمل",
    "visit.closed": "مغلق",
    "visit.contact": "التواصل",
    "visit.whatsapp": "واتساب",
    "visit.instagram": "إنستغرام {handle}",

    "footer.logoAlt": "قصر الأمير، منذ عام 1997",
    "footer.copy": "© {year} قصر الأمير. الأسعار لا تشمل ضريبة القيمة المضافة.",
    "footer.prices": "الأسعار بالدولار الأمريكي، غير شاملة ضريبة القيمة المضافة.",
    "footer.hours": "ساعات العمل",
    "footer.visit": "زورونا",
    "footer.explore": "استكشف", "footer.contact": "التواصل",

    "day.lun": "الاثنين", "day.mar": "الثلاثاء", "day.mie": "الأربعاء", "day.jue": "الخميس",
    "day.vie": "الجمعة", "day.sab": "السبت", "day.dom": "الأحد",
    "time.am": "ص", "time.pm": "م",
    "unit.min": "دقيقة",
    "when.today": "اليوم",
    "when.tomorrow": "غداً",
    "when.onDay": "يوم {day}",

    "status.checking": "جارٍ التحقق من ساعات العمل…",
    "status.openUntil": "مفتوح الآن · حتى الساعة {time}",
    "status.closed": "مغلق حالياً",
    "status.closedOpensAt": "مغلق حالياً · نفتح {when} الساعة {time}",
    "status.opensAt": "نفتح {when} الساعة {time}",
    "status.closedNote": "{status}. يمكنك تجهيز طلبك لكن لا يمكن إرساله الآن.",

    "pedir.skip": "تخطَّ إلى القائمة",
    "pedir.heroAria": "اطلب التوصيل",
    "pedir.back": "قصر الأمير",
    "pedir.waTop": "راسلنا عبر واتساب",
    "pedir.title": "اطلب التوصيل",
    "pedir.sub": "قائمة طعام قصر الأمير كاملة. جهّز طلبك ونؤكده معك عبر واتساب.",
    "pedir.factDelivery": "<b>توصيل</b> أو استلام",
    "pedir.factPay": "Pago Móvil (تحويل بنكي محلي) أو نقداً (بوليفار أو دولار) أو Binance أو Zinli",
    "pedir.factMin": "الحد الأدنى للطلب {min}، دون احتساب التوصيل",
    "pedir.noscript": "يجب تفعيل جافاسكريبت لعرض القائمة والطلب عبر الإنترنت. راسلنا عبر واتساب.",
    "search.placeholder": "ابحث: شاورما، كبة…",
    "search.aria": "البحث في القائمة",
    "search.clear": "مسح البحث",
    "search.none": "لم نجد هذا الطبق. جرّب اسماً آخر أو تصفّح الأقسام.",
    "chips.aria": "الأقسام",
    "chips.featured": "أطباق مميزة",

    "dish.add": "أضف {name}",
    "dish.addAnother": "إضافة واحد آخر: {name}",
    "dish.removeOne": "إزالة واحد: {name}",
    "dish.chooseOptions": "اختر الخيارات: {name}",
    "dish.chooseOptionsQty": "اختر الخيارات: {name}، {qty} في طلبك",
    "dish.inOrder": "{qty} في طلبك",

    "ledger.aria": "طلبك",
    "ledger.title": "طلبك",
    "ledger.clear": "إفراغ",
    "ledger.subtotal": "المجموع الفرعي",
    "ledger.hint": "رسوم التوصيل حسب منطقتك. الأسعار لا تشمل ضريبة القيمة المضافة.",
    "ledger.go": "متابعة الطلب",
    "ledger.addOne": "أضف طبقاً للمتابعة.",
    "ledger.greet": "أهلاً",
    "ledger.empty": "اضغط على + بجانب أي طبق لتبدأ طلبك.",
    "upsell.title": "هل تود إضافة مشروب؟",
    "pill.view": "عرض طلبي",
    "pill.aria": "عرض طلبي، {items}، {total}",
    "cart.dishes.zero": "{n} طبق",
    "cart.dishes.one": "طبق واحد",
    "cart.dishes.two": "طبقان",
    "cart.dishes.few": "{n} أطباق",
    "cart.dishes.many": "{n} طبقاً",
    "cart.dishes.other": "{n} طبق",
    "cart.added": "تمت إضافة {name}",
    "cart.max": "الحد الأقصى {max} لكل طبق",
    "cart.cleared": "تم إفراغ الطلب",
    "cart.clearedThanks": "تم إفراغ السلة. شكراً لك!",
    "cart.undo": "تراجع",
    "cart.copied": "تم النسخ",
    "cart.orderCopied": "تم نسخ الطلب",
    "cart.min": "يتبقى {missing} للوصول إلى الحد الأدنى للطلب ({min}).",
    "cart.needOne": "أضف طبقاً واحداً على الأقل.",

    "opt.required": "(مطلوب)",
    "opt.pick": "يرجى اختيار أحد الخيارات: {label}.",
    "opt.add": "إضافة · {total}",
    "opt.less": "أقل",
    "opt.more": "أكثر",
    "opt.close": "إغلاق",

    "sheet.title": "إتمام الطلب",
    "sheet.close": "إغلاق",
    "sheet.how": "كيف تريد استلام طلبك؟",
    "type.delivery": "توصيل",
    "type.pickup": "استلام من المطعم",
    "sheet.data": "بياناتك",
    "f.name": "الاسم",
    "f.phone": "الهاتف (واتساب)",
    "f.phonePh": "0414-0000000",
    "f.zone": "منطقة التوصيل",
    "f.zonePh": "اختر منطقتك…",
    "f.addr": "عنوان التوصيل",
    "f.addrPh": "الحي، الشارع، المبنى، الشقة",
    "f.ref": "معلم قريب (اختياري)",
    "f.refPh": "مقابل المخبز…",
    "sheet.pay": "طريقة الدفع",
    "pay.pagomovil": "Pago Móvil",
    "pay.cash": "نقداً (بالدولار)",
    "pay.zelle": "Zelle",
    "pay.pos": "بطاقة (جهاز نقاط البيع)",
    "f.cash": "بكم ستدفع؟ (اختياري)",
    "f.cashPh": "مثال: ورقة بقيمة 20$",
    "f.notes": "ملاحظات للمطبخ (اختياري)",
    "f.notesPh": "بدون بصل، الصلصة جانباً، حساسية…",
    "f.remember": "تذكّر بياناتي على هذا الجهاز",
    "zone.info": "التوصيل {fee} · {eta}",
    "pay.mm.intro": "ستدفع عبر Pago Móvil (تحويل بنكي فوري من هاتفك).",
    "pay.mm.data": "بيانات الدفع.",
    "pay.mm.dataBs": "بيانات الدفع (المبلغ بالبوليفار وفق سعر BCV).",
    "pay.mm.send": "أرسل مرجع الدفع في محادثة واتساب، وسنؤكد عند وصوله.",
    "pay.mm.totalNoRate": "المجموع: <b>{total}</b> (سنؤكد لك المبلغ بالبوليفار عبر واتساب).",
    "pay.zelle.info": "سنرسل لك بريد Zelle عند إرسال الطلب. المجموع: <b>{total}</b>.",
    "kv.bank": "البنك",
    "kv.phone": "الهاتف",
    "kv.id": "رقم الهوية / RIF",
    "kv.amount": "المبلغ",
    "kv.email": "البريد",
    "kv.copy": "نسخ",
    "kv.copyAria": "نسخ {label}",
    "kv.copyZelle": "نسخ بريد Zelle",

    "totals.subtotal": "المجموع الفرعي",
    "totals.delivery": "التوصيل",
    "totals.free": "مجاني",
    "totals.chooseZone": "اختر منطقتك",
    "totals.total": "المجموع",
    "totals.totalNoDelivery": "المجموع (دون التوصيل)",
    "totals.bsLine": "≈ {bs} · سعر صرف BCV {rate}{date}",
    "totals.bsDate": " ({date})",
    "totals.bsStale": " · السعر غير محدَّث وسيتم تأكيده",
    "totals.bcvHelp": "سعر BCV: سعر الصرف الرسمي للبنك المركزي الفنزويلي",
    "totals.eta": "الوقت المتوقع: {eta}",

    "send.whatsapp": "أرسل الطلب عبر واتساب",
    "send.closed": "مغلق حالياً",
    "err.name": "يرجى كتابة اسمك.",
    "err.phone": "أدخل رقم هاتف صحيحاً، مثال: 0414-0000000.",
    "err.zone": "اختر منطقة التوصيل.",
    "err.addr": "اكتب عنوان التوصيل.",

    "done.sheetTitle": "الطلب جاهز للإرسال",
    "done.title": "الطلب {id} جاهز للإرسال",
    "done.p1": "تم فتح واتساب مع طلبك. <b>اضغط «إرسال» في واتساب لتأكيده.</b> المجموع: <b>{total}</b>{bs}.",
    "done.cut": "الطلب طويل وتم اختصاره في الرابط. استخدم «نسخ الطلب» والصقه في المحادثة.",
    "done.notOpened": "لم يُفتح؟ استخدم الزر:",
    "done.openWa": "فتح واتساب",
    "done.copy": "نسخ الطلب",
    "done.zelle": "أرسل <b>{total}</b> عبر Zelle إلى:",
    "done.zelleProof": "أرسل إيصال التحويل في المحادثة.",
    "done.cash": "ستدفع <b>{total}</b> نقداً عند استلام طلبك.",
    "done.pos": "ستدفع <b>{total}</b> بالبطاقة (جهاز نقاط البيع) عند استلام طلبك.",
    "done.clear": "أرسلته: أفرغ السلة",
    "done.keep": "العودة والاحتفاظ بسلتي"
  };

  /* =====================================================================
     2. MENU TRANSLATIONS  (keyed by the SPANISH name used in MENU)
        menu["Hummus"] = { es:{name,desc}, en:{name,desc}, ar:{name,desc}, cat:"Entradas Árabes" }
        Categories: menu["Bebidas"] = { isCat:true, es:{name}, en:{name}, ar:{name} }
        Duplicate Spanish names (Makanek, Falafel especial, Kibbe frito appear in two
        categories) keep the first as base and the others in menu[name].variants[].
     ===================================================================== */
  var menu = {};
  var notes = {};   /* category notes, keyed by Spanish text */
  var opts = {};    /* option labels + choices, keyed by Spanish text */
  var curCat = "";

  function C(esCat, en, ar, note) {
    curCat = esCat;
    menu[esCat] = { isCat: true, note: note ? note[0] : "", es: { name: esCat }, en: { name: en }, ar: { name: ar } };
    if (note) notes[note[0]] = { es: note[0], en: note[1], ar: note[2] };
  }
  function D(es, esDesc, en, ar) {
    var rec = {
      cat: curCat,
      es: { name: es, desc: esDesc || "" },
      en: { name: en[0], desc: en[1] || "" },
      ar: { name: ar[0], desc: ar[1] || "" }
    };
    if (!menu[es]) menu[es] = rec;
    else (menu[es].variants = menu[es].variants || []).push(rec);
  }
  function A(es, en, ar) { /* alias: short names used on the home page cards */
    menu[es] = { alias: true, cat: "", es: { name: es, desc: "" }, en: { name: en, desc: "" }, ar: { name: ar, desc: "" } };
  }
  function O(es, en, ar) { opts[es] = { es: es, en: en, ar: ar }; }

  /* ---- options ---- */
  O("Proteína", "Protein", "نوع البروتين");
  O("Pollo", "Chicken", "دجاج");
  O("Carne", "Beef", "لحم بقري");
  O("Mixto", "Mixed", "مشكّل");
  O("Cordero", "Lamb", "لحم ضأن");
  O("Preparación", "Preparation", "طريقة التحضير");
  O("En agua", "Made with water", "بالماء");
  O("En leche", "Made with milk", "بالحليب");
  O("Agrega un acompañante", "Add a side", "أضف طبقاً جانبياً");
  O("Adicionales", "Add-ons", "إضافات");
  O("¿Quitamos algo?", "Leave anything out?", "هل نزيل شيئاً؟");
  O("Sin lechuga", "No lettuce", "بدون خس");
  O("Sin tomate", "No tomato", "بدون طماطم");
  O("Sin cebolla", "No onion", "بدون بصل");
  O("Sin pepinillo", "No pickles", "بدون مخلل");
  O("Sin perejil", "No parsley", "بدون بقدونس");
  O("Sin salsa de ajo", "No garlic sauce", "بدون صلصة الثوم");
  O("Camarón", "Shrimp", "روبيان");
  O("Pincho de kafta", "Kafta skewer", "سيخ كفتة");
  O("Pincho de lomito", "Beef tenderloin skewer", "سيخ فيليه لحم");
  O("Pincho de pollo", "Chicken skewer", "سيخ دجاج");
  O("Tocineta", "Bacon", "لحم مقدد");
  O("Vegetales salteados", "Sautéed vegetables", "خضار سوتيه");
  O("Arroz", "Rice", "أرز");
  O("Carne de shawarma", "Beef shawarma", "شاورما لحم");
  O("Pollo de shawarma", "Chicken shawarma", "شاورما دجاج");
  O("Papas fritas", "French fries", "بطاطا مقلية");
  O("Hummus", "Hummus", "حمص");
  O("Tabbule", "Tabbouleh", "تبولة");

  /* ---- 1. Entradas Árabes ---- */
  C("Entradas Árabes", "Arabic Starters (Mezze)", "مقبلات عربية", ["Por ración", "Per portion", "سعر الحصة الواحدة"]);
  D("Hummus", "Crema de garbanzos", ["Hummus", "Creamy chickpea dip"], ["حمص", "معجون الحمص"]);
  D("Mutabal", "Crema de berenjenas", ["Mutabal", "Creamy eggplant dip"], ["متبّل", "معجون الباذنجان"]);
  D("Muhammara", "Crema de pimentón", ["Muhammara", "Red bell pepper dip"], ["محمّرة", "معجون الفلفل الأحمر"]);
  D("Labne", "Crema de yogurt", ["Labneh", "Creamy strained-yogurt dip"], ["لبنة", "زبادي مصفّى كريمي"]);
  D("Cremas mixtas", "Selección especial de cremas de la casa.", ["Mixed Dips", "A special selection of the house dips."], ["معجونات مشكّلة", "تشكيلة خاصة من مقبلات البيت المهروسة."]);
  D("Makanek", "Salchicha árabe", ["Makanek", "Lebanese-style sausage"], ["مقانق", "نقانق عربية"]);
  D("Basterma", "Carne curada", ["Basterma", "Cured beef"], ["بسطرمة", "لحم مقدّد"]);
  D("Sawda Djaj", "Hígado de pollo", ["Sawda Djaj", "Chicken livers"], ["سودة دجاج", "كبدة دجاج"]);
  D("Garbanzo con lomito", "Garbanzos acompañados con jugoso lomito.", ["Chickpeas with Beef Tenderloin", "Chickpeas topped with juicy beef tenderloin."], ["حمص مع لحم الفيليه", "حمص مع قطع فيليه لحم بقري طرية."]);
  D("Kibbe crudo", "", ["Raw Kibbe (Kibbe Nayyeh)", ""], ["كبة نيّة", ""]);
  D("Kibbe frito", "", ["Fried Kibbe", ""], ["كبة مقلية", ""]);
  D("Kibbe horneado", "Kibbe horneado con especias tradicionales.", ["Baked Kibbe", "Baked kibbe with traditional spices."], ["كبة بالفرن", "كبة بالصينية بالبهارات التقليدية."]);
  D("Falafel", "Croquetas crujientes de garbanzo con especias.", ["Falafel", "Crispy spiced chickpea croquettes."], ["فلافل", "أقراص حمص مقرمشة بالبهارات."]);
  D("Falafel especial", "Falafel servido con toques y acompañantes especiales de la casa.", ["Special Falafel", "Falafel served with the house's special toppings and sides."], ["فلافل مميّز", "فلافل مع إضافات ومرافقات خاصة من البيت."]);
  D("Tabaquitos de uva", "Hojas de uva rellenas de arroz y carne sazonada.", ["Stuffed Grape Leaves (Tabaquitos)", "Grape leaves stuffed with rice and seasoned meat."], ["ورق عنب", "ورق عنب محشو بالأرز واللحم المتبّل."]);
  D("Tabaquitos de repollo", "Hojas de repollo rellenas de arroz y carne sazonada.", ["Stuffed Cabbage Rolls (Tabaquitos)", "Cabbage leaves stuffed with rice and seasoned meat."], ["ملفوف محشي", "ورق ملفوف محشو بالأرز واللحم المتبّل."]);
  D("Tabaquitos mixtos", "Combinación de tabaquitos de uva y repollo.", ["Mixed Stuffed Rolls (Tabaquitos)", "A mix of stuffed grape leaves and cabbage rolls."], ["لفائف محشية مشكّلة", "تشكيلة من ورق العنب والملفوف المحشي."]);

  /* ---- 2. Entradas Mediterráneas ---- */
  C("Entradas Mediterráneas", "Mediterranean Starters", "مقبلات متوسطية");
  D("Carpaccio de lomito", "Láminas de lomito con especias, confit de cherry, rúgula, champiñones, parmesano, sal ahumada y pesto",
    ["Beef Tenderloin Carpaccio", "Thin slices of spiced tenderloin with cherry tomato confit, arugula, mushrooms, Parmesan, smoked salt and pesto"],
    ["كارباتشيو لحم الفيليه", "شرائح رقيقة من الفيليه المتبّل مع طماطم كرزية كونفي وجرجير وفطر وجبن بارميزان وملح مدخّن وصلصة بيستو"]);
  D("Ceviche de camarón", "Con crema de ají amarillo y toques cítricos, casabitos tostados y chips de plátano",
    ["Shrimp Ceviche", "With yellow ají cream and citrus notes, toasted casabe (cassava flatbread) crisps and plantain chips"],
    ["سيفيتشي الروبيان", "مع كريمة الفلفل الأصفر (آجي) ولمسات حمضية، ومقرمشات الكاسابي المحمّصة (خبز الكسافا) ورقائق الموز الأخضر"]);
  D("Berenjena frita", "Rebozadas, con queso de cabra y miel de pepperoncini",
    ["Fried Eggplant", "Battered, with goat cheese and pepperoncini honey"],
    ["باذنجان مقلي", "مغطّى بعجينة مقرمشة مع جبن الماعز وعسل الفلفل الحار"]);
  D("Dedos de mozzarella", "Crujientes dedos de queso mozzarella empanizados.", ["Mozzarella Sticks", "Crispy breaded mozzarella sticks."], ["أصابع الموزاريلا", "أصابع موتزاريلا مقرمشة مغطاة بالبقسماط."]);
  D("Tequeños", "8 unidades", ["Tequeños (Venezuelan cheese sticks)", "8 pieces"], ["تيكينيوس (أصابع الجبن الفنزويلية)", "8 قطع"]);
  D("Papas fritas", "Porción de papas fritas crujientes.", ["French Fries", "A portion of crispy French fries."], ["بطاطا مقلية", "حصة من البطاطا المقلية المقرمشة."]);

  /* ---- 3. Sopas y Cremas ---- */
  C("Sopas y Cremas", "Soups & Cream Soups", "شوربات وكريمات");
  D("Fosforera", "Sofrito criollo, camarones, calamares, pulpo y conchas con aceite ahumado de ají dulce",
    ["Fosforera (Venezuelan seafood soup)", "Creole sofrito, shrimp, squid, octopus and clams with smoked sweet ají pepper oil"],
    ["فوسفوريرا (شوربة المأكولات البحرية الفنزويلية)", "صوفريتو كريولي مع الروبيان والحبار والأخطبوط والمحار وزيت فلفل آجي حلو مدخّن"]);
  D("Sopa de pollo con vegetales", "Aromática con vegetales frescos",
    ["Chicken Vegetable Soup", "Aromatic, with fresh vegetables"], ["شوربة الدجاج بالخضار", "عطرة مع خضار طازجة"]);
  D("Crema de pollo", "Velouté cremosa del chef",
    ["Cream of Chicken Soup", "The chef's creamy velouté"], ["كريمة الدجاج", "فيلوتيه كريمي من إعداد الشيف"]);
  D("Crema de auyama", "Auyama rostizada, ají dulce y tropezones de mozzarella frita",
    ["Cream of Pumpkin (Auyama)", "Roasted pumpkin, sweet ají pepper and chunks of fried mozzarella"],
    ["كريمة اليقطين (أوياما)", "يقطين محمّص وفلفل آجي حلو وقطع موزاريلا مقلية"]);

  /* ---- 4. Ensaladas ---- */
  C("Ensaladas", "Salads", "سلطات");
  D("Tabbule", "Ensalada tradicional de perejil, tomate, cebolla, trigo y limón.", ["Tabbouleh", "Traditional salad of parsley, tomato, onion, bulgur and lemon."], ["تبّولة", "سلطة تقليدية من البقدونس والطماطم والبصل والبرغل والليمون."]);
  D("Fattoush", "Mezcla de vegetales frescos con pan árabe frito y aderezo de sumac.", ["Fattoush", "Fresh vegetables with fried pita bread and sumac dressing."], ["فتّوش", "خضار طازجة مع خبز عربي مقلي وصلصة السماق."]);
  D("Libanesa", "Lechuga, tomate, cebolla, perejil, pimentón, hierbabuena, pepino, rábano y aderezo de limón de la casa",
    ["Lebanese Salad", "Lettuce, tomato, onion, parsley, bell pepper, mint, cucumber, radish and our house lemon dressing"],
    ["سلطة لبنانية", "خس وطماطم وبصل وبقدونس وفلفل رومي ونعناع وخيار وفجل وتتبيلة الليمون الخاصة بالبيت"]);
  D("Armenia", "Vegetales frescos con salsa balsámica",
    ["Armenian Salad", "Fresh vegetables with balsamic dressing"], ["سلطة أرمنية", "خضار طازجة مع صلصة البلسميك"]);
  D("Yogurt con pepino", "", ["Cucumber Yogurt", ""], ["زبادي بالخيار", ""]);
  D("Ensalada de cangrejo", "Cangrejo mezclado con vegetales y aderezo especial.", ["Crab Salad", "Crab mixed with vegetables and a special dressing."], ["سلطة السلطعون", "سلطعون مع خضار وصلصة خاصة."]);
  D("Ensalada de burrata", "Rúgula, nueces, jamón serrano, cherry y burrata con reducción de balsámico",
    ["Burrata Salad", "Arugula, walnuts, serrano ham, cherry tomatoes and burrata with balsamic reduction"],
    ["سلطة البوراتا", "جرجير وجوز ولحم سيرانو وطماطم كرزية وجبن بوراتا مع صلصة البلسميك المركّزة"]);
  D("Ensalada César", "Clásica ensalada con lechuga, crutones, queso parmesano y aderezo César.", ["Caesar Salad", "Classic salad with lettuce, croutons, Parmesan and Caesar dressing."], ["سلطة سيزر", "سلطة كلاسيكية بالخس والخبز المحمص والبارميزان وصلصة السيزر."]);
  D("Ensalada César con pollo", "Ensalada César acompañada de jugosos trozos de pollo.", ["Chicken Caesar Salad", "Caesar salad with juicy chicken pieces."], ["سلطة سيزر بالدجاج", "سلطة سيزر مع قطع دجاج طرية."]);
  D("Ensalada César con berro y pollo", "Variación de la ensalada César con berro fresco y pollo.", ["Chicken Caesar Salad with Watercress", "A Caesar salad variation with fresh watercress and chicken."], ["سلطة سيزر بالدجاج والجرجير المائي", "سلطة سيزر مع الجرجير المائي الطازج والدجاج."]);
  D("Ensalada César con camarón", "Ensalada César servida con camarones salteados.", ["Shrimp Caesar Salad", "Caesar salad served with sautéed shrimp."], ["سلطة سيزر بالروبيان", "سلطة سيزر مع روبيان سوتيه."]);
  D("Rúgula de la casa", "Ensalada de rúgula fresca con aderezo especial de la casa.", ["House Arugula Salad", "Fresh arugula salad with the house dressing."], ["سلطة الجرجير الخاصة", "سلطة جرجير طازج مع صلصة البيت الخاصة."]);
  D("Ensalada de palmitos", "Palmitos frescos con aderezo y vegetales seleccionados.", ["Hearts of Palm Salad", "Hearts of palm with dressing and selected vegetables."], ["سلطة قلب النخيل", "قلوب النخيل مع صلصة وخضار مختارة."]);
  D("Ensalada mixta", "Variedad de vegetales frescos de temporada.", ["Mixed Salad", "A mix of fresh seasonal vegetables."], ["سلطة مشكّلة", "تشكيلة من الخضار الطازجة الموسمية."]);
  D("Ensalada de camarones", "Camarones acompañados de vegetales y aderezo especial.", ["Shrimp Salad", "Shrimp with vegetables and a special dressing."], ["سلطة الروبيان", "روبيان مع خضار وصلصة خاصة."]);

  /* ---- 5. Platos Árabes Especiales ---- */
  C("Platos Árabes Especiales", "Special Arabic Dishes", "أطباق عربية مميزة");
  D("Fatte", "Carne molida, garbanzo y pan frito al yogurt con almendras",
    ["Fatteh", "Ground beef, chickpeas and fried bread in yogurt, topped with almonds"],
    ["فتّة", "لحم مفروم وحمص وخبز مقلي باللبن مع اللوز"]);
  D("Fatte de berenjena", "Carne molida, garbanzo, berenjena y pan frito al yogurt con almendras",
    ["Eggplant Fatteh", "Ground beef, chickpeas, eggplant and fried bread in yogurt, topped with almonds"],
    ["فتّة الباذنجان", "لحم مفروم وحمص وباذنجان وخبز مقلي باللبن مع اللوز"]);
  D("Plato mixto", "1 pincho de pollo, 1 kibbe, tabaquitos, 2 falafel, cremas mixtas, tabbule y makanek",
    ["Mixed Plate", "1 chicken skewer, 1 kibbe, stuffed rolls (tabaquitos), 2 falafel, mixed dips, tabbouleh and makanek"],
    ["طبق مشكّل", "سيخ دجاج وقطعة كبة ولفائف محشية (تاباكيتوس) وقطعتا فلافل ومعجونات مشكّلة وتبّولة ومقانق"]);
  D("Plato mixto con lomito", "1 pincho de lomito, 1 kibbe, tabaquitos, 2 falafel, cremas mixtas, tabbule y makanek",
    ["Mixed Plate with Tenderloin", "1 tenderloin skewer, 1 kibbe, stuffed rolls (tabaquitos), 2 falafel, mixed dips, tabbouleh and makanek"],
    ["طبق مشكّل مع الفيليه", "سيخ فيليه وقطعة كبة ولفائف محشية (تاباكيتوس) وقطعتا فلافل ومعجونات مشكّلة وتبّولة ومقانق"]);
  D("Plato vegetariano árabe", "Tabbule, arroz blanco, falafel, vegetales salteados y cremas mixtas",
    ["Arabic Vegetarian Plate", "Tabbouleh, white rice, falafel, sautéed vegetables and mixed dips"],
    ["طبق نباتي عربي", "تبّولة وأرز أبيض وفلافل وخضار سوتيه ومعجونات مشكّلة"]);
  D("Plato de shawarma", "Carne y pollo tipo shawarma, vegetales, pepinillos, nabos, crema de ajo y tahini",
    ["Shawarma Plate", "Beef and chicken shawarma-style, vegetables, pickled cucumbers, pickled turnips, garlic sauce and tahini"],
    ["طبق شاورما", "لحم ودجاج بطريقة الشاورما مع خضار ومخلل الخيار والملفوف واللفت وصلصة الثوم والطحينة"]);
  D("Kibbe al yogurt", "5 unidades de kibbe al yogurt",
    ["Kibbe in Yogurt (Kibbeh Labanieh)", "5 pieces of kibbe in yogurt sauce"], ["كبة لبنية", "5 قطع من الكبة باللبن"]);
  D("Arroz libanés con pollo o cordero", "Con frutos secos y pan frito",
    ["Lebanese Rice with Chicken or Lamb", "With nuts and fried bread"],
    ["أرز لبناني بالدجاج أو لحم الضأن", "مع المكسرات والخبز المقلي"]);
  D("Bandeja árabe (2 personas)", "Pinchos de pollo y lomito, tabbule, tabaquitos, makanek, kibbes, falafel y cremas mixtas",
    ["Arabic Platter (serves 2)", "Chicken and tenderloin skewers, tabbouleh, stuffed rolls (tabaquitos), makanek, kibbe, falafel and mixed dips"],
    ["صينية عربية (لشخصين)", "أسياخ دجاج وفيليه وتبّولة ولفائف محشية (تاباكيتوس) ومقانق وكبة وفلافل ومعجونات مشكّلة"]);
  D("Bandeja árabe (3 personas)", "3 pinchos, 4 kibbe fritos, 8 tabaquitos, 4 falafel, makanek, kibbe crudo y horneado, tabbule, cremas",
    ["Arabic Platter (serves 3)", "3 skewers, 4 fried kibbe, 8 stuffed rolls (tabaquitos), 4 falafel, makanek, raw and baked kibbe, tabbouleh, dips"],
    ["صينية عربية (لثلاثة أشخاص)", "3 أسياخ و4 كبب مقلية و8 لفائف محشية (تاباكيتوس) و4 فلافل ومقانق وكبة نيّة وكبة بالفرن وتبّولة ومعجونات"]);
  D("Bandeja árabe (4 personas)", "4 pinchos, 6 kibbes fritos, 6 falafel, 10 tabaquitos, makanek, kibbe crudo y horneado, tabbule, cremas",
    ["Arabic Platter (serves 4)", "4 skewers, 6 fried kibbe, 6 falafel, 10 stuffed rolls (tabaquitos), makanek, raw and baked kibbe, tabbouleh, dips"],
    ["صينية عربية (لأربعة أشخاص)", "4 أسياخ و6 كبب مقلية و6 فلافل و10 لفائف محشية (تاباكيتوس) ومقانق وكبة نيّة وكبة بالفرن وتبّولة ومعجونات"]);

  /* ---- 6. Shawarmas y Sándwiches ---- */
  C("Shawarmas y Sándwiches", "Shawarmas & Sandwiches", "شاورما وساندويتشات",
    ["Todos los sándwiches vienen con papas fritas", "All sandwiches come with french fries", "تُقدَّم جميع الساندويتشات مع البطاطا المقلية"]);
  D("Shawarma", "Proteína de tu preferencia y vegetales tradicionales",
    ["Shawarma", "Your choice of protein with traditional vegetables"], ["شاورما", "بالبروتين الذي تختاره مع الخضار التقليدية"]);
  D("Shawarma especial", "Con 1 ingrediente extra (tabbule, falafel, pimentones…)",
    ["Special Shawarma", "With 1 extra ingredient (tabbouleh, falafel, bell peppers…)"],
    ["شاورما مميّزة", "مع إضافة واحدة (تبّولة، فلافل، فلفل رومي…)"]);
  D("Shawarma súper especial", "Con 2 ingredientes extra",
    ["Super Special Shawarma", "With 2 extra ingredients"], ["شاورما سوبر مميّزة", "مع إضافتين"]);
  D("Shawarma abierto", "Servido abierto en plato con la proteína de tu preferencia y vegetales.", ["Open-Faced Shawarma", "Served open on a plate with your choice of protein and vegetables."], ["شاورما مفتوحة", "يُقدَّم مفتوحاً في طبق مع البروتين الذي تختاره والخضار."]);
  D("Shawarma especial abierto", "Servido abierto en plato con vegetales tradicionales y un ingrediente especial extra.", ["Open-Faced Special Shawarma", "Served open on a plate with traditional vegetables and one extra special ingredient."], ["شاورما مميّزة مفتوحة", "يُقدَّم مفتوحاً في طبق مع الخضار التقليدية ومكوّن خاص إضافي."]);
  D("Shawarma súper especial abierto", "Servido abierto en plato con vegetales tradicionales y dos ingredientes especiales extra.", ["Open-Faced Super Special Shawarma", "Served open on a plate with traditional vegetables and two extra special ingredients."], ["شاورما سوبر مميّزة مفتوحة", "يُقدَّم مفتوحاً في طبق مع الخضار التقليدية ومكوّنين خاصّين إضافيين."]);
  D("Sándwich de falafel", "Croquetas de falafel y vegetales tradicionales",
    ["Falafel Sandwich", "Falafel croquettes and traditional vegetables"], ["ساندويتش فلافل", "أقراص فلافل مع الخضار التقليدية"]);
  D("Fajita", "Salsa de aguacate, pimentón, cebolla, mozzarella, pollo",
    ["Fajita", "Avocado sauce, bell pepper, onion, mozzarella, chicken"], ["فاهيتا", "صلصة الأفوكادو وفلفل رومي وبصل وموزاريلا ودجاج"]);
  D("Philadelphia", "Salsa de aguacate, pimentón, cebolla, mozzarella, carne",
    ["Philadelphia", "Avocado sauce, bell pepper, onion, mozzarella, beef"], ["فيلادلفيا", "صلصة الأفوكادو وفلفل رومي وبصل وموزاريلا ولحم بقري"]);
  D("Tawook", "Pollo a la brasa, salsa de ajo, pepinillo, papas",
    ["Tawook", "Charcoal-grilled chicken, garlic sauce, pickles, fries"], ["شيش طاووق", "دجاج مشوي على الفحم وصلصة الثوم ومخلل وبطاطا"]);
  D("Camarón", "Camarón, lechuga, pepinillo, salsa rosada",
    ["Shrimp Sandwich", "Shrimp, lettuce, pickles, pink sauce"], ["ساندويتش الروبيان", "روبيان وخس ومخلل وصلصة وردية"]);
  D("Lomito", "Lomito a la brasa, crema de garbanzo, cebolla, perejil, tomate, pepinillo",
    ["Tenderloin Sandwich", "Charcoal-grilled tenderloin, chickpea dip, onion, parsley, tomato, pickles"],
    ["ساندويتش الفيليه", "فيليه مشوي على الفحم ومعجون الحمص وبصل وبقدونس وطماطم ومخلل"]);
  D("Kebab", "Kebab a la brasa, crema de garbanzo, vegetales",
    ["Kebab Sandwich", "Charcoal-grilled kebab, chickpea dip, vegetables"], ["ساندويتش الكباب", "كباب مشوي على الفحم ومعجون الحمص وخضار"]);
  D("Makanek", "Salchicha árabe, ajo, tomate, limón, pepinillo",
    ["Makanek Sandwich", "Lebanese-style sausage, garlic, tomato, lemon, pickles"], ["ساندويتش المقانق", "نقانق عربية وثوم وطماطم وليمون ومخلل"]);
  D("Hígado de pollo", "Hígado de pollo, papas, ajo, granadina",
    ["Chicken Liver Sandwich", "Chicken liver, fries, garlic, pomegranate molasses"], ["ساندويتش كبدة الدجاج", "كبدة دجاج وبطاطا وثوم ودبس الرمان"]);
  D("Falafel especial", "Croquetas de falafel con ingredientes especiales y papas fritas.", ["Special Falafel Sandwich", "Falafel croquettes with special ingredients and French fries."], ["ساندويتش فلافل مميّز", "أقراص فلافل مع مكوّنات خاصة وبطاطا مقلية."]);
  D("Kibbe frito", "Sándwich de kibbe frito acompañado de papas fritas.", ["Fried Kibbe Sandwich", "Fried kibbe sandwich served with French fries."], ["ساندويتش كبة مقلية", "ساندويتش كبة مقلية مع بطاطا مقلية."]);

  /* ---- 7. Brochetas y Parrillas ---- */
  C("Brochetas y Parrillas", "Skewers & Grills", "أسياخ ومشاوي");
  D("Brochetas El Amir", "2 pinchos de pollo, 3 de kafta, 2 de lomito, 8 alas, 8 makanek, vegetales a la brasa, papas y pan",
    ["El Amir Skewers", "2 chicken skewers, 3 kafta, 2 tenderloin, 8 wings, 8 makanek, charcoal-grilled vegetables, fries and bread"],
    ["أسياخ الأمير", "سيخان من الدجاج و3 من الكفتة وسيخان من الفيليه و8 أجنحة و8 مقانق وخضار مشوية على الفحم وبطاطا وخبز"]);
  D("Brocheta de kafta", "Pinchos de carne molida sazonada a la brasa.", ["Kafta Skewer", "Charcoal-grilled skewers of seasoned ground meat."], ["سيخ كفتة", "أسياخ لحم مفروم متبّل على الفحم."]);
  D("Brocheta de pollo", "Pinchos de pechuga de pollo marinada a la brasa.", ["Chicken Skewer", "Charcoal-grilled skewers of marinated chicken breast."], ["سيخ دجاج", "أسياخ صدر دجاج متبّل على الفحم."]);
  D("Brocheta de lomito", "Pinchos de lomito tierno a la brasa.", ["Tenderloin Skewer", "Charcoal-grilled skewers of tender beef tenderloin."], ["سيخ فيليه", "أسياخ فيليه لحم بقري طري على الفحم."]);
  D("Brocheta mixta", "", ["Mixed Skewer", ""], ["سيخ مشكّل", ""]);
  D("Parrilla El Amir", "Pechuga, churrasco de lomito, 2 ruedas de kafta, makanek y papas",
    ["El Amir Grill", "Chicken breast, tenderloin steak, 2 kafta patties, makanek and fries"],
    ["مشاوي الأمير", "صدر دجاج وشريحة فيليه مشوية وقرصان من الكفتة ومقانق وبطاطا"]);
  D("Parrilla mar y tierra", "Parrilla de carnes y mariscos.", ["Surf & Turf Grill", "Grill of meats and seafood."], ["مشاوي البر والبحر", "مشاوي لحوم وثمار بحر."]);
  D("Parrilla de mariscos", "Parrilla con mariscos variados.", ["Seafood Grill", "Grill with assorted seafood."], ["مشاوي المأكولات البحرية", "مشاوي ثمار بحر متنوعة."]);
  D("Parrilla de pollo", "Parrilla con pollo.", ["Chicken Grill", "Chicken grill."], ["مشاوي الدجاج", "مشاوي دجاج."]);
  D("Parrilla de lomito", "Parrilla con lomito.", ["Tenderloin Grill", "Beef tenderloin grill."], ["مشاوي الفيليه", "مشاوي فيليه لحم بقري."]);
  D("Parrilla mixta", "Parrilla con pollo y lomito.", ["Mixed Grill", "Grill with chicken and beef tenderloin."], ["مشاوي مشكّلة", "مشاوي دجاج وفيليه لحم بقري."]);

  /* ---- 8. Carnes y Aves ---- */
  C("Carnes y Aves", "Meat & Poultry", "لحوم ودواجن",
    ["Acompañados con 2 contornos: papas fritas, bravas, rústicas, puré, vegetales al vapor, ensalada mixta o arroz",
     "Served with 2 sides: french fries, patatas bravas, rustic potatoes, mashed potatoes, steamed vegetables, mixed salad or rice",
     "تُقدَّم مع صنفين جانبيين: بطاطا مقلية أو بطاطا برافاس أو بطاطا ريفية أو بطاطا مهروسة أو خضار على البخار أو سلطة مشكّلة أو أرز"]);
  D("Pollo a la brasa El Amir", "Con chorizos, pimentones asados, papas, ensalada rallada y arroz especial",
    ["El Amir Charcoal-Grilled Chicken", "With chorizo sausages, roasted bell peppers, fries, shredded salad and special rice"],
    ["دجاج الأمير المشوي على الفحم", "مع نقانق الشوريزو والفلفل الرومي المشوي والبطاطا والسلطة المبشورة والأرز الخاص"]);
  D("Envoltini de pollo", "Relleno de espinaca, pimentón y mozzarella con salsa de ajo porro",
    ["Chicken Roulade (Envoltini)", "Stuffed with spinach, bell pepper and mozzarella, with leek and garlic sauce"],
    ["لفائف الدجاج المحشوة (إنفولتيني)", "محشوة بالسبانخ والفلفل الرومي والموزاريلا مع صلصة الكراث والثوم"]);
  D("Pollo a la brasa", "300 g de pechuga deshuesada",
    ["Charcoal-Grilled Chicken Breast", "300 g boneless breast"], ["صدر دجاج مشوي على الفحم", "300 غ صدر دجاج بدون عظم"]);
  D("Pollo a la canasta", "Escalopines empanizados con papas",
    ["Chicken Basket", "Breaded chicken cutlets with fries"], ["سلة الدجاج", "شرائح دجاج مقرمشة مع البطاطا"]);
  D("Tenders de pollo crispy", "Con salsa rosa o sweet chili y papas",
    ["Crispy Chicken Tenders", "With pink sauce or sweet chili, and fries"], ["أصابع دجاج مقرمشة", "مع الصلصة الوردية أو السويت تشيلي والبطاطا"]);
  D("Suprema de pollo crispy", "300 g en salsa blanca con camarones",
    ["Crispy Chicken Suprême", "300 g in white sauce with shrimp"], ["سوبريم الدجاج المقرمش", "300 غ في صلصة بيضاء مع الروبيان"]);
  D("Filet mignon", "Lomito con tocineta y salsa de champiñones",
    ["Filet Mignon", "Tenderloin with bacon and mushroom sauce"], ["فيليه مينيون", "فيليه لحم مع لحم مقدّد وصلصة الفطر"]);
  D("Cordon bleu de lomito", "Lomito relleno de jamón y queso, empanizado, con salsa blanca.", ["Tenderloin Cordon Bleu", "Breaded beef tenderloin stuffed with ham and cheese, with white sauce."], ["كوردون بلو بالفيليه", "فيليه لحم بقري محشو بالجامبون والجبن ومغطى بالبقسماط مع صلصة بيضاء."]);
  D("Cordon bleu de pollo", "Pollo relleno de jamón y queso, empanizado, con salsa blanca.", ["Chicken Cordon Bleu", "Breaded chicken stuffed with ham and cheese, with white sauce."], ["كوردون بلو بالدجاج", "دجاج محشو بالجامبون والجبن ومغطى بالبقسماط مع صلصة بيضاء."]);
  D("Centro de lomito a la plancha", "300 g",
    ["Pan-Seared Tenderloin Center Cut", "300 g"], ["قلب الفيليه على الصاج", "300 غ"]);
  D("Pollo a la milanesa", "Gratinado con mozzarella, parmesano y salsa napoli",
    ["Chicken Milanese", "Gratinated with mozzarella, Parmesan and napoli sauce"], ["دجاج ميلانيزي", "مغطّى بالموزاريلا والبارميزان ومحمّر في الفرن مع صلصة نابولي"]);
  D("Pollo al champiñón", "Pechuga de pollo en salsa de champiñones.", ["Chicken in Mushroom Sauce", "Chicken breast in mushroom sauce."], ["دجاج بصلصة الفطر", "صدر دجاج بصلصة الفطر."]);
  D("Pollo a la plancha", "300 g de pechuga",
    ["Pan-Seared Chicken Breast", "300 g breast"], ["صدر دجاج على الصاج", "300 غ صدر دجاج"]);

  /* ---- 9. Pescados y Mariscos ---- */
  C("Pescados y Mariscos", "Fish & Seafood", "أسماك ومأكولات بحرية");
  D("Mero en 2 salsas", "Al carbón con salsa de alcaparras y amatriciana",
    ["Grouper in Two Sauces", "Charcoal-grilled, with caper sauce and amatriciana"], ["سمك الهامور بصلصتين", "مشوي على الفحم مع صلصة الكبار وصلصة أماتريتشانا"]);
  D("Mero a la plancha", "", ["Pan-Seared Grouper", ""], ["هامور على الصاج", ""]);
  D("Mero al ajillo", "", ["Garlic Grouper (al ajillo)", ""], ["هامور بالثوم", ""]);
  D("Cazuela de mariscos", "", ["Seafood Casserole", ""], ["طاجن المأكولات البحرية", ""]);
  D("Dynamite shrimp", "Cóctel de camarones con toques asiáticos y papas",
    ["Dynamite Shrimp", "Shrimp cocktail with an Asian twist, served with fries"], ["روبيان داينمايت", "كوكتيل روبيان بلمسات آسيوية مع البطاطا"]);
  D("Camarones a la plancha", "Con 2 contornos", ["Pan-Seared Shrimp", "With 2 sides"], ["روبيان على الصاج", "مع صنفين جانبيين"]);
  D("Camarones al ajillo", "Con 2 contornos", ["Garlic Shrimp", "With 2 sides"], ["روبيان بالثوم", "مع صنفين جانبيين"]);
  D("Camarones rebozados", "Con 2 contornos", ["Breaded Shrimp", "With 2 sides"], ["روبيان مقرمش", "مع صنفين جانبيين"]);
  D("Calamares al ajillo", "Con 2 contornos", ["Garlic Squid", "With 2 sides"], ["حبّار بالثوم", "مع صنفين جانبيين"]);
  D("Calamares rebozados", "Con 2 contornos", ["Breaded Squid (Calamari)", "With 2 sides"], ["كالاماري مقرمش", "مع صنفين جانبيين"]);
  D("Langostinos", "Con 2 contornos", ["King Prawns", "With 2 sides"], ["جمبري ملكي", "مع صنفين جانبيين"]);
  D("Pulpo al grill", "Con chimichurri", ["Grilled Octopus", "With chimichurri"], ["أخطبوط مشوي", "مع صلصة تشيميتشوري"]);
  D("Asopado de mariscos (2 personas)", "", ["Seafood Asopado (soupy rice stew, serves 2)", ""], ["أسوبادو المأكولات البحرية (أرز بمرق، لشخصين)", ""]);
  D("Arroz a la marinera", "", ["Marinera-Style Seafood Rice", ""], ["أرز بحري على الطريقة المارينيرا", ""]);

  /* ---- 10. Arroces ---- */
  C("Arroces", "Rice Dishes", "أطباق الأرز");
  D("Risotto al pesto con escalopines de pollo", "", ["Pesto Risotto with Chicken Scaloppine", ""], ["ريزوتو بالبيستو مع شرائح الدجاج", ""]);
  D("Risotto con calabaza y calamares acevichados", "", ["Pumpkin Risotto with Ceviche-Style Squid", ""], ["ريزوتو اليقطين مع الحبّار بنكهة السيفيتشي", ""]);
  D("Paella (2 personas)", "", ["Paella (serves 2)", ""], ["باييلا (لشخصين)", ""]);
  D("Paella (3 personas)", "", ["Paella (serves 3)", ""], ["باييلا (لثلاثة أشخاص)", ""]);
  D("Paella (4 personas)", "", ["Paella (serves 4)", ""], ["باييلا (لأربعة أشخاص)", ""]);
  D("Fideuá (2 personas)", "", ["Fideuà (noodle paella, serves 2)", ""], ["فيدوا (باييلا بالشعيرية، لشخصين)", ""]);
  D("Fideuá (3 personas)", "", ["Fideuà (noodle paella, serves 3)", ""], ["فيدوا (باييلا بالشعيرية، لثلاثة أشخاص)", ""]);
  D("Fideuá (4 personas)", "", ["Fideuà (noodle paella, serves 4)", ""], ["فيدوا (باييلا بالشعيرية، لأربعة أشخاص)", ""]);

  /* ---- 11. Pastas ---- */
  C("Pastas", "Pasta", "معكرونة");
  D("Fettuccine con ragú de mero", "", ["Fettuccine with Grouper Ragù", ""], ["فيتوتشيني بصلصة راغو الهامور", ""]);
  D("Cartoccio de lomito", "Linguini en salsa blanca con lomito en salsa de champiñones",
    ["Tenderloin Cartoccio", "Linguine in white sauce with tenderloin in mushroom sauce"], ["كارتوتشو الفيليه", "لينغويني بالصلصة البيضاء مع الفيليه بصلصة الفطر"]);
  D("Rigatoni cremoso con tocineta y champiñones", "Rigatoni en salsa blanca con tomates cherry confitados, champiñones, tocineta ahumada, toques de pesto y pimentón rostizado.", ["Creamy Rigatoni with Bacon and Mushrooms", "Rigatoni in white sauce with confit cherry tomatoes, mushrooms, smoked bacon, a touch of pesto and roasted pepper."], ["ريغاتوني كريمي مع لحم مقدّد وفطر", "ريغاتوني بالصلصة البيضاء مع طماطم كرزية مطهوة وفطر ولحم مقدد مدخن ولمسة بيستو وفلفل مشوي."]);
  D("Linguini con camarones", "Linguini en delicada salsa acompañado de camarones.", ["Linguine with Shrimp", "Linguine in a delicate sauce with shrimp."], ["لينغويني بالروبيان", "لينغويني بصلصة خفيفة مع الروبيان."]);
  D("Linguini al fileto", "Linguini en salsa de tomates frescos y albahaca.", ["Linguine al Fileto (tomato sauce)", "Linguine in fresh tomato and basil sauce."], ["لينغويني بصلصة الطماطم (فيليتو)", "لينغويني بصلصة الطماطم الطازجة والريحان."]);
  D("Linguini marinera", "Linguini con variedad de mariscos de la casa.", ["Linguine Marinera (seafood)", "Linguine with the house's assorted seafood."], ["لينغويني بالمأكولات البحرية (مارينيرا)", "لينغويني مع تشكيلة ثمار البحر."]);
  D("Linguini carbonara", "Linguini con cremosa salsa carbonara y tocineta.", ["Linguine Carbonara", "Linguine in creamy carbonara sauce with bacon."], ["لينغويني كاربونارا", "لينغويني بصلصة الكاربونارا الكريمية ولحم مقدد."]);
  D("Pasta bologna", "Pasta con salsa de carne y tomate.", ["Pasta Bolognese", "Pasta with a rich meat and tomato sauce."], ["باستا بولونيز", "باستا بصلصة اللحم والطماطم."]);
  D("Pasta napoli", "Pasta con salsa clásica de tomate y hierbas.", ["Pasta Napoli (tomato sauce)", "Pasta with classic tomato and herb sauce."], ["باستا نابولي", "باستا بصلصة الطماطم الكلاسيكية والأعشاب."]);
  D("Pasticho tradicional", "Capas de pasta rellenas de carne molida, salsa bechamel y queso.", ["Traditional Pasticho (Venezuelan lasagna)", "Layers of pasta with ground meat, béchamel sauce and cheese."], ["باستيتشو تقليدي (لازانيا فنزويلية)", "طبقات باستا محشوة باللحم المفروم وصلصة البشاميل والجبن."]);

  /* ---- 12. Hamburguesas ---- */
  C("Hamburguesas", "Burgers", "برغر",
    ["Todas vienen con papas fritas", "All come with french fries", "تُقدَّم جميعها مع البطاطا المقلية"]);
  D("Cheeseburger", "150 g de solomo, pan de mantequilla, mozzarella frita y salsa rosa",
    ["Cheeseburger", "150 g sirloin, butter bun, fried mozzarella and pink sauce"], ["تشيز برغر", "150 غ لحم سيرلوين وخبز بالزبدة وموزاريلا مقلية وصلصة وردية"]);
  D("Oh My Burger!", "150 g de solomo, mozzarella frita, mermelada de pimentón y tocineta",
    ["Oh My Burger!", "150 g sirloin, fried mozzarella, bell pepper jam and bacon"], ["أوه ماي برغر!", "150 غ لحم سيرلوين وموزاريلا مقلية ومربى الفلفل الرومي ولحم مقدّد"]);
  D("Pollo crispy", "Pollo frito crocante, tocineta, queso americano y mostaza miel",
    ["Crispy Chicken Burger", "Crunchy fried chicken, bacon, American cheese and honey mustard"], ["برغر الدجاج المقرمش", "دجاج مقلي مقرمش ولحم مقدّد وجبن أمريكي وخردل بالعسل"]);
  D("Gordon burger", "Pollo crispy relleno de jamón y queso, tocineta y salsa de la casa",
    ["Gordon Burger", "Crispy chicken stuffed with ham and cheese, bacon and house sauce"], ["غوردون برغر", "دجاج مقرمش محشو بالجبن والجامبون مع لحم مقدّد وصلصة البيت"]);

  /* ---- 13. Batidos y Yogurt ---- */
  C("Batidos y Yogurt", "Shakes & Yogurt", "عصائر مخفوقة وزبادي");
  D("Batido de fresa", "", ["Strawberry Shake", ""], ["مخفوق الفراولة", ""]);
  D("Batido de melón", "", ["Melon Shake", ""], ["مخفوق الشمام", ""]);
  D("Batido de piña", "", ["Pineapple Shake", ""], ["مخفوق الأناناس", ""]);
  D("Batido de melocotón", "", ["Peach Shake", ""], ["مخفوق الدرّاق", ""]);
  D("Batido de guanábana", "", ["Soursop (Guanábana) Shake", ""], ["مخفوق القشطة الحامضة (غوانابانا)", ""]);
  D("Batido de lechosa", "", ["Papaya (Lechosa) Shake", ""], ["مخفوق البابايا (ليتشوسا)", ""]);
  D("Batido de parchita", "", ["Passion Fruit (Parchita) Shake", ""], ["مخفوق فاكهة الآلام (باركيتا)", ""]);
  D("Batido de mora", "", ["Blackberry Shake", ""], ["مخفوق التوت الأسود", ""]);
  D("Limonada", "", ["Lemonade", ""], ["ليموناضة", ""]);
  D("Limonada con hierbabuena", "", ["Mint Lemonade", ""], ["ليموناضة بالنعناع", ""]);
  D("Merengada de frutas", "", ["Fruit Merengada (milkshake)", ""], ["ميرينغادا الفواكه (ميلك شيك)", ""]);
  D("Yogurt con hierbabuena", "", ["Mint Yogurt Drink", ""], ["لبن بالنعناع", ""]);
  D("Yogurt con frutas", "", ["Yogurt with Fruit", ""], ["زبادي بالفواكه", ""]);

  /* ---- 14. Bebidas ---- */
  C("Bebidas", "Drinks", "مشروبات");
  D("Agua mineral", "Agua mineral embotellada.", ["Mineral Water", "Bottled mineral water."], ["مياه معدنية", "مياه معدنية معبأة."]);
  D("Nestea", "", ["Nestea (iced tea)", ""], ["نستي (شاي مثلّج)", ""]);
  D("Jarra de Nestea (x4)", "", ["Nestea Pitcher (serves 4)", ""], ["إبريق نستي (لأربعة)", ""]);
  D("Té Lipton", "Té frío Lipton de limón, 500 ml.", ["Lipton Tea", "Lipton lemon iced tea, 500 ml."], ["شاي ليبتون", "شاي ليبتون مثلج بالليمون، 500 مل."]);
  D("Gatorade", "Bebida hidratante deportiva.", ["Gatorade (sports drink)", "Sports hydration drink."], ["غاتوريد (مشروب رياضي)", "مشروب رياضي للترطيب."]);
  D("Refresco de lata", "Refresco variado en lata.", ["Canned Soda", "Assorted canned soda."], ["مشروب غازي (علبة)", "مشروب غازي متنوع في علبة."]);
  D("Refresco 1L", "Refresco variado en botella de 1 litro.", ["Soda 1 L", "Assorted soda, 1-liter bottle."], ["مشروب غازي 1 لتر", "مشروب غازي متنوع، زجاجة 1 لتر."]);
  D("Refresco 1.5L", "", ["Soda 1.5 L", ""], ["مشروب غازي 1.5 لتر", ""]);
  D("Sparkling", "", ["Sparkling Water", ""], ["مياه فوّارة", ""]);
  D("Soda", "", ["Club Soda", ""], ["مياه الصودا", ""]);

  /* ---- 15. Licores y Cócteles ---- */
  C("Licores y Cócteles", "Spirits & Cocktails", "مشروبات كحولية وكوكتيلات",
    ["Solo mayores de edad", "Adults only (legal drinking age)", "للبالغين فقط"]);
  D("Cerveza nacional", "", ["Local Beer", ""], ["بيرة محلية", ""]);
  D("Cerveza importada", "", ["Imported Beer", ""], ["بيرة مستوردة", ""]);
  D("Copa de vino", "", ["Glass of Wine", ""], ["كأس نبيذ", ""]);
  D("Botella de anís", "", ["Bottle of Anís (aniseed spirit, similar to arak)", ""], ["زجاجة آنيسون (مشروب يشبه العرق)", ""]);
  D("Botella de whisky 8 años", "", ["Whisky, 8 Years (bottle)", ""], ["زجاجة ويسكي عمر 8 سنوات", ""]);
  D("Botella de whisky 12 años", "", ["Whisky, 12 Years (bottle)", ""], ["زجاجة ويسكي عمر 12 سنة", ""]);
  D("Botella de whisky 18 años", "", ["Whisky, 18 Years (bottle)", ""], ["زجاجة ويسكي عمر 18 سنة", ""]);

  /* ---- aliases: short names shown on the home page cards ---- */
  A("Risotto con calabaza y calamares", "Pumpkin & Squid Risotto", "ريزوتو اليقطين والحبّار");
  A("Rigatoni cremoso", "Creamy Rigatoni", "ريغاتوني كريمي");

  /* =====================================================================
     3. ENGINE
     ===================================================================== */
  var I18N = {
    lang: "es",
    langs: LANGS,
    langNames: NAMES,
    dict: dict,
    menu: menu,
    notes: notes,
    opts: opts,
    debug: false
  };

  var warned = {};
  function warn(msg) {
    if (!I18N.debug || warned[msg]) return;
    warned[msg] = 1;
    if (global.console && console.warn) console.warn("[I18N] " + msg);
  }
  function has(o, k) { return Object.prototype.hasOwnProperty.call(o, k); }

  /* In Arabic, LTR-only tokens (money, Bs. amounts, rates, dates, order ids,
     @handles) are wrapped in Unicode isolates (LRI ... PDI) so the bidi algorithm
     cannot reorder "$28", "Bs. 1,022.00" or "AP-1012-001" inside RTL sentences. */
  var LTR_VARS = { total: 1, fee: 1, min: 1, missing: 1, bs: 1, rate: 1, date: 1, id: 1, handle: 1, amount: 1, year: 1 };
  function interp(s, vars, lang) {
    if (!vars) return s;
    return String(s).replace(/\{(\w+)\}/g, function (m, k) {
      if (!has(vars, k) || vars[k] == null) return m;
      var v = vars[k];
      return lang === "ar" && LTR_VARS[k] && v !== "" ? "⁦" + v + "⁩" : v;
    });
  }
  function lookup(lang, key) {
    if (dict[lang] && has(dict[lang], key)) return dict[lang][key];
    if (has(dict.es, key)) { if (lang !== "es") warn("missing " + lang + ":" + key); return dict.es[key]; }
    warn("unknown key " + key);
    return key;
  }

  I18N.has = function (key) { return has(dict.es, key); };
  I18N.t = function (key, vars, lang) { lang = lang || I18N.lang; return interp(lookup(lang, key), vars, lang); };
  I18N.tEs = function (key, vars) { return interp(has(dict.es, key) ? dict.es[key] : key, vars); };

  /* Plural-aware: tp("cart.dishes", 3) -> "3 platos" / "3 dishes" / "3 أطباق".
     Looks for key.<zero|one|two|few|many|other>, falls back to .other. */
  var prCache = {};
  function pluralCat(lang, n) {
    try {
      var pr = prCache[lang] || (prCache[lang] = new Intl.PluralRules(lang));
      return pr.select(n);
    } catch (e) { return n === 1 ? "one" : "other"; }
  }
  I18N.tp = function (key, n, vars, lang) {
    lang = lang || I18N.lang;
    var cat = pluralCat(lang, n), k = key + "." + cat;
    if (!(dict[lang] && has(dict[lang], k))) k = key + ".other";
    var v = {}; if (vars) for (var p in vars) if (has(vars, p)) v[p] = vars[p];
    v.n = String(n);
    return interp(lookup(lang, k), v, lang);
  };

  /* ---------- numbers, money, time ---------- */
  var nfCache = {};
  function nf(lang, min, max) {
    var id = lang + min + max;
    return nfCache[id] || (nfCache[id] = new Intl.NumberFormat(LOCALES[lang], { minimumFractionDigits: min, maximumFractionDigits: max }));
  }
  I18N.num = function (n, min, max, lang) {
    min = min == null ? 0 : min; max = max == null ? Math.max(min, 2) : max;
    try { return nf(lang || I18N.lang, min, max).format(n); } catch (e) { return String(n); }
  };
  /* USD, always "$" prefix, Western digits, no ".00" on whole amounts: $12, $1.50 */
  I18N.money = function (n) {
    n = +n || 0;
    var whole = Math.abs(n - Math.round(n)) < 0.005;
    return "$" + (whole ? String(Math.round(n)) : n.toFixed(2));
  };
  /* Bolívares: "Bs. 1.234,56" (es) / "Bs. 1,234.56" (en, ar). */
  I18N.bs = function (usd, rate, lang) { return "Bs. " + I18N.num(usd * rate, 2, 2, lang); };

  I18N.time12 = function (hhmm, lang) {
    lang = lang || I18N.lang;
    var p = String(hhmm).split(":"), h = +p[0], m = +p[1] || 0;
    var ap = lookup(lang, h % 24 < 12 ? "time.am" : "time.pm");
    return ((h % 12) || 12) + ":" + (m < 10 ? "0" : "") + m + " " + ap;
  };
  /* day(i)  i = 0..6 with Sunday = 0 (JS getDay)  OR a CONFIG key: "lun","mar","mie","jue","vie","sab","dom" */
  I18N.day = function (i, lang) {
    var key = typeof i === "number" ? DAYKEYS[((i % 7) + 7) % 7] : i;
    return lookup(lang || I18N.lang, "day." + key);
  };
  I18N.dayKeys = DAYKEYS;
  /* when(daysAhead, dow) -> "hoy" | "mañana" | "el martes" / "today" | "tomorrow" | "on Tuesday" */
  I18N.when = function (daysAhead, dow, lang) {
    lang = lang || I18N.lang;
    if (daysAhead === 0) return lookup(lang, "when.today");
    if (daysAhead === 1) return lookup(lang, "when.tomorrow");
    var d = I18N.day(dow, lang); if (lang === "es") d = d.toLowerCase();
    return interp(lookup(lang, "when.onDay"), { day: d });
  };
  /* status({open:true, until:"22:00"}) or
     status({open:false, daysAhead:0|1|n, dow:0..6, time:"12:00"}) or status({open:false})
     -> {open, text, short, note}   (same wording as the original pedir.html) */
  I18N.status = function (st) {
    if (st.open) return { open: true, text: I18N.t("status.openUntil", { time: I18N.time12(st.until) }), short: "", note: "" };
    var text, short = "";
    if (st.time != null) {
      var v = { when: I18N.when(st.daysAhead, st.dow), time: I18N.time12(st.time) };
      text = I18N.t("status.closedOpensAt", v); short = I18N.t("status.opensAt", v);
    } else text = I18N.t("status.closed");
    return { open: false, text: text, short: short, note: I18N.t("status.closedNote", { status: text }) };
  };
  /* eta("30-45 min") -> "30-45 min" / "30-45 دقيقة" (CONFIG keeps "min") */
  I18N.eta = function (s) { return String(s).replace(/\bmin\b/g, I18N.t("unit.min")); };

  /* ---------- menu helpers ---------- */
  function pick(rec, lang, field, esFallback) {
    var v = rec[lang] && rec[lang][field];
    return v ? v : esFallback;
  }
  /* dish(esName[, esDesc[, esCat]]) -> {name, desc}
     - Pass esDesc (and/or esCat) so duplicated names resolve to the right variant
       (Makanek / Falafel especial / Kibbe frito exist in two categories).
     - Unknown dish (new item the owner added to MENU): returns the Spanish text. */
  I18N.dish = function (esName, esDesc, esCat) {
    var rec = menu[esName], lang = I18N.lang;
    if (!rec) { warn("untranslated dish: " + esName); return { name: esName, desc: esDesc || "" }; }
    var all = [rec].concat(rec.variants || []), hit = rec;
    if (all.length > 1) {
      hit = null;
      var i;
      if (esCat) for (i = 0; i < all.length && !hit; i++) if (all[i].cat === esCat) hit = all[i];
      if (!hit && esDesc != null) for (i = 0; i < all.length && !hit; i++) if (all[i].es.desc === esDesc) hit = all[i];
      if (!hit) hit = rec;
    }
    var baseDesc = esDesc != null ? esDesc : hit.es.desc;
    if (lang === "es") return { name: esName, desc: baseDesc };
    var desc = baseDesc ? pick(hit, lang, "desc", baseDesc) : "";
    if (esDesc != null && esDesc !== hit.es.desc && esDesc !== "") desc = esDesc; /* owner changed the text: don't show a stale translation */
    return { name: pick(hit, lang, "name", esName), desc: desc };
  };
  I18N.cat = function (esCat) {
    var rec = menu[esCat]; if (!rec || !rec.isCat) { warn("untranslated category: " + esCat); return esCat; }
    return pick(rec, I18N.lang, "name", esCat);
  };
  I18N.note = function (esNote) {
    var rec = notes[esNote]; if (!rec) { if (esNote) warn("untranslated note: " + esNote); return esNote; }
    return rec[I18N.lang] || esNote;
  };
  I18N.opt = function (esText) {
    var rec = opts[esText]; if (!rec) { warn("untranslated option: " + esText); return esText; }
    return rec[I18N.lang] || esText;
  };
  /* same slug as the site's own slug(): used for catdesc keys and #anchors */
  I18N.slug = function (s) {
    return String(s).normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/gi, "-").replace(/^-+|-+$/g, "").toLowerCase();
  };
  I18N.catDesc = function (esCat) {
    var k = "carta.catdesc." + I18N.slug(esCat);
    return has(dict.es, k) ? I18N.t(k) : "";
  };

  /* Search that works in every language: fold accents/Arabic marks, lower-case.
     searchKey() returns es+en+ar text of the dish so a guest can type "chicken",
     "pollo" or "دجاج" in any UI language. Put it in data-s instead of the slug. */
  I18N.fold = function (s) {
    return String(s).normalize("NFKD")
      .replace(/[̀-ͯؐ-ًؚ-ٰٟـ]/g, "")
      .replace(/[آأإ]/g, "ا").replace(/ى/g, "ي").replace(/ة/g, "ه")
      .toLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim();
  };
  I18N.searchKey = function (esName, esDesc, esCat) {
    var rec = menu[esName], parts = [esName, esDesc || ""];
    if (rec) {
      var all = [rec].concat(rec.variants || []), hit = rec;
      for (var i = 0; i < all.length; i++) if ((esCat && all[i].cat === esCat) || (esDesc != null && all[i].es.desc === esDesc)) { hit = all[i]; break; }
      parts.push(hit.en.name, hit.en.desc, hit.ar.name, hit.ar.desc);
    }
    if (esCat && menu[esCat]) parts.push(menu[esCat].en.name, menu[esCat].ar.name);
    return I18N.fold(parts.join(" "));
  };

  /* Audit a MENU array ([cat, note, [[name, price, desc, opts], ...]]) against the
     dictionary. Returns a list of strings that have no translation yet. */
  I18N.missing = function (MENU) {
    var out = [];
    (MENU || []).forEach(function (c) {
      var cat = c[0], note = c[1], list = c[2] || [];
      if (!menu[cat] || !menu[cat].isCat) out.push("category: " + cat);
      if (note && !notes[note]) out.push("note: " + note);
      list.forEach(function (d) {
        var rec = menu[d[0]];
        if (!rec) { out.push("dish: " + d[0]); return; }
        var all = [rec].concat(rec.variants || []), ok = false;
        all.forEach(function (v) { if ((v.es.desc || "") === (d[2] || "")) ok = true; });
        if (!ok) out.push("desc changed or new: " + d[0] + " -> " + d[2]);
        if (d[3]) { if (!opts[d[3].label]) out.push("option label: " + d[3].label); (d[3].choices || []).forEach(function (x) { if (!opts[x]) out.push("option: " + x); }); }
      });
    });
    return out;
  };

  /* =====================================================================
     4. DOM: data-i18n, switcher, language state
     ===================================================================== */
  function parseVars(el) {
    var raw = el.getAttribute("data-i18n-vars");
    if (!raw) return null;
    try { return JSON.parse(raw); } catch (e) { return null; }
  }
  function applyNode(el) {
    var vars = parseVars(el), k;
    if ((k = el.getAttribute("data-i18n"))) el.textContent = I18N.t(k, vars);
    if ((k = el.getAttribute("data-i18n-html"))) el.innerHTML = I18N.t(k, vars); /* trusted dictionary strings only */
    if ((k = el.getAttribute("data-i18n-attr"))) {
      k.split(";").forEach(function (pair) {
        var i = pair.indexOf(":"); if (i < 1) return;
        var attr = pair.slice(0, i).trim(), key = pair.slice(i + 1).trim();
        if (attr && key) el.setAttribute(attr, I18N.t(key, vars));
      });
    }
  }
  function applyMeta() {
    var doc = global.document, page = doc.documentElement.getAttribute("data-i18n-page");
    if (!page) return;
    var T = function (n) { var k = "meta." + page + "." + n; return has(dict.es, k) ? I18N.t(k) : null; };
    var title = T("title"), desc = T("description"), og = T("ogDescription");
    if (title) doc.title = title;
    var set = function (sel, val) { var m = doc.querySelector(sel); if (m && val) m.setAttribute("content", val); };
    set('meta[name="description"]', desc);
    set('meta[property="og:title"]', title);
    set('meta[property="og:description"]', og || desc);
    set('meta[property="og:locale"]', OG_LOCALE[I18N.lang]);
  }
  function syncSwitchers() {
    var doc = global.document;
    var btns = doc.querySelectorAll("[data-set-lang]");
    for (var i = 0; i < btns.length; i++) {
      var on = btns[i].getAttribute("data-set-lang") === I18N.lang;
      btns[i].setAttribute("aria-pressed", on ? "true" : "false");
      if (on) btns[i].setAttribute("aria-current", "true"); else btns[i].removeAttribute("aria-current");
    }
  }
  I18N.apply = function (root) {
    var doc = global.document; if (!doc) return;
    root = root || doc;
    var sel = "[data-i18n],[data-i18n-attr],[data-i18n-html]";
    if (root.nodeType === 1 && root.matches && root.matches(sel)) applyNode(root);
    var nodes = root.querySelectorAll ? root.querySelectorAll(sel) : [];
    for (var i = 0; i < nodes.length; i++) applyNode(nodes[i]);
    if (root === doc || root === doc.documentElement || root === doc.body) applyMeta();
    syncSwitchers();
  };

  I18N.dir = function (lang) { return (lang || I18N.lang) === "ar" ? "rtl" : "ltr"; };
  I18N.isRTL = function () { return I18N.lang === "ar"; };

  function setDocLang(lang) {
    var h = global.document && global.document.documentElement; if (!h) return;
    h.lang = lang;
    h.dir = I18N.dir(lang);
    /* Arabic fonts load on demand (was an @import in i18n.css for every visitor) */
    var d = global.document;
    if (lang === "ar" && d.head && !d.getElementById("i18n-ar-fonts")) {
      var k = d.createElement("link");
      k.rel = "stylesheet"; k.id = "i18n-ar-fonts";
      k.href = "/assets/fonts/arabic.css";
      d.head.appendChild(k);
    }
  }

  I18N.set = function (lang, opt) {
    if (LANGS.indexOf(lang) < 0) lang = "es";
    var prev = I18N.lang;
    I18N.lang = lang;
    if (!(opt && opt.persist === false)) { try { global.localStorage.setItem(STORE_KEY, lang); } catch (e) { /* private mode */ } }
    setDocLang(lang);
    I18N.apply(global.document);
    if (global.document && lang !== prev) {
      var ev;
      try { ev = new CustomEvent("langchange", { bubbles: true, detail: { lang: lang, previous: prev, dir: I18N.dir(lang) } }); }
      catch (e) { ev = global.document.createEvent("CustomEvent"); ev.initCustomEvent("langchange", true, false, { lang: lang, previous: prev, dir: I18N.dir(lang) }); }
      global.document.dispatchEvent(ev);
    }
    return lang;
  };

  /* initial language: ?lang= (links / QA) -> /en/ or /ar/ URL -> saved choice -> page's static language -> es.
     The browser language (navigator.languages) is deliberately NOT used: crawlers (Googlebot is en-US)
     and first-time visitors must get the Spanish page that is indexed. Use I18N.suggest() to offer a switch. */
  function detect() {
    var m;
    try { m = /[?&]lang=(es|en|ar)(?:&|#|$)/.exec(global.location.search); if (m) return m[1]; } catch (e) { /* ignore */ }
    try { m = /^\/(en|ar)\//.exec(global.location.pathname); if (m) return m[1]; } catch (e) { /* ignore */ }
    try { var s = global.localStorage.getItem(STORE_KEY); if (LANGS.indexOf(s) > -1) return s; } catch (e) { /* ignore */ }
    try { var st = global.document.documentElement.getAttribute("data-static-lang"); if (LANGS.indexOf(st) > -1) return st; } catch (e) { /* ignore */ }
    return "es";
  }
  I18N.detect = detect;
  /* suggest(): browser language worth offering (never applied automatically), or null */
  I18N.suggest = function () {
    try {
      if (global.localStorage.getItem(STORE_KEY)) return null;
      var list = global.navigator.languages && global.navigator.languages.length ? global.navigator.languages : [global.navigator.language];
      for (var i = 0; i < list.length; i++) {
        var l = String(list[i] || "").toLowerCase().slice(0, 2);
        if (LANGS.indexOf(l) > -1) return l === I18N.lang ? null : l;
      }
    } catch (e) { /* ignore */ }
    return null;
  };

  /* =====================================================================
     5. WhatsApp builders - ALWAYS Spanish (staff read Spanish)
     ===================================================================== */
  /* WhatsApp formatting characters typed by the guest are swapped for look-alikes. */
  I18N.wx = function (s) {
    return String(s == null ? "" : s).replace(/[\r\n]+/g, " ").replace(/\*/g, "＊").replace(/_/g, "＿").replace(/~/g, "～").replace(/`/g, "ˋ").trim();
  };
  function clientLangLine(lang) {
    return lang && lang !== "es" ? I18N.tEs("wa.clientLang", { lang: NAMES[lang] || lang }) : null;
  }
  /* o = { id, stamp:"dd/mm hh:mi", name, phone, type:"Delivery"|"Retiro en tienda",
           zone:{name,eta}|null, addr, ref, lines:[{qty, name, total}], subtotal, fee, total,
           bsTotal?:"Bs. 1.234,56", rate?:"36,50", pay:"Pago móvil"|"Efectivo ($)"|"Zelle"|"Punto de venta",
           cash?, notes?, lang?, payRef? (payment reference), elec? (paid before delivery) }
     All dish names / values must be the SPANISH ones (as stored in the cart).
     Money is formatted here ("$12", "$1.50"). */
  I18N.buildOrderMessage = function (o) {
    var E = I18N.tEs, wx = I18N.wx, M = I18N.money, del = o.type === E("wa.value.delivery") && o.zone;
    var L = [E("wa.order.title", { id: o.id }), o.stamp,
      E("wa.order.client", { name: wx(o.name), phone: wx(o.phone) })];
    var cl = clientLangLine(o.lang == null ? I18N.lang : o.lang); if (cl) L.push(cl);
    L.push(E("wa.order.type", { type: o.type }));
    if (del) {
      L.push(E("wa.order.zone", { zone: wx(o.zone.name), eta: wx(o.zone.eta) }), E("wa.order.addr", { addr: wx(o.addr) }));
      if (o.ref && wx(o.ref)) L.push(E("wa.order.ref", { ref: wx(o.ref) }));
    }
    L.push(E("wa.order.sep"));
    (o.lines || []).forEach(function (l) { L.push(E("wa.order.line", { qty: l.qty, name: wx(l.name), price: M(l.total) })); });
    L.push(E("wa.order.sep"), E("wa.order.subtotal", { amount: M(o.subtotal) }));
    if (del) L.push(E("wa.order.delivery", { zone: wx(o.zone.name), amount: M(o.fee) }));
    L.push(E("wa.order.total", { amount: M(o.total) }) + (o.bsTotal ? E("wa.order.totalBs", { bs: o.bsTotal, rate: o.rate }) : ""));
    var payRef = o.payRef && wx(o.payRef);
    L.push(E("wa.order.pay", { pay: o.pay }) +
      (o.pay === E("wa.value.cash") && o.cash && wx(o.cash) ? E("wa.order.payCash", { cash: wx(o.cash) }) : "") +
      (o.payLater ? E("wa.order.payLater") : o.paid ? E("wa.order.paid") : payRef ? E("wa.order.payRef", { ref: payRef }) : (o.elec || o.pay === E("wa.value.pagoMovil")) ? E("wa.order.payMobile") : ""));
    if (o.notes && wx(o.notes)) L.push(E("wa.order.notes", { notes: wx(o.notes) }));
    return L.join("\n");
  };
  /* r = { name, people:"2".."8"|"Más de 8", dateISO:"2026-10-20", time:"19:30", notes?, lang?, branch? (e.g. "Lechería") } */
  I18N.buildReservationMessage = function (r) {
    var E = I18N.tEs, wx = I18N.wx;
    var d = new Date(r.dateISO + "T12:00").toLocaleDateString("es-VE", { weekday: "long", day: "numeric", month: "long" });
    var L = [E("wa.res.title", { name: (global.CONFIG && global.CONFIG.nombre) || "El Amir Palace" }), ""];
    if (r.branch && wx(r.branch)) L.push(E("wa.res.branch", { v: wx(r.branch) })); /* optional: Spanish branch name */
    L.push(E("wa.res.name", { v: wx(r.name) }));
    var cl = clientLangLine(r.lang == null ? I18N.lang : r.lang); if (cl) L.push(cl);
    L.push(E("wa.res.people", { v: r.people }), E("wa.res.date", { v: d }), E("wa.res.time", { v: I18N.time12(r.time, "es") }));
    if (r.notes && wx(r.notes)) L.push(E("wa.res.notes", { v: wx(r.notes) }));
    return L.join("\n");
  };

  /* =====================================================================
     6. BOOT
     ===================================================================== */
  global.I18N = I18N;
  I18N.lang = detect();
  setDocLang(I18N.lang);

  var doc = global.document;
  if (doc) {
    /* switcher buttons: <button data-set-lang="en"> works anywhere, no extra JS */
    doc.addEventListener("click", function (e) {
      var b = e.target && e.target.closest ? e.target.closest("[data-set-lang]") : null;
      if (b) { e.preventDefault(); I18N.set(b.getAttribute("data-set-lang")); }
    });
    /* keep two open tabs (home + order page) in sync */
    global.addEventListener("storage", function (e) {
      if (e.key === STORE_KEY && LANGS.indexOf(e.newValue) > -1 && e.newValue !== I18N.lang) I18N.set(e.newValue, { persist: false });
    });
    /* Pages with <html data-static-lang="xx"> ship pre-rendered text in that language and may load this
       file late (defer / injected after load), before their page dictionaries (e.g. assets/v3/i18n-v3.js).
       On those pages the page script calls I18N.apply() once its keys are merged and only when the language
       differs from the pre-rendered one (keeps LCP intact, no flash of raw keys). Other pages: unchanged. */
    var root = doc.documentElement, staticLang = root && root.getAttribute("data-static-lang");
    var boot = function () { if (staticLang) { syncSwitchers(); return; } I18N.apply(doc); };
    if (doc.readyState === "loading" || (staticLang && doc.readyState === "interactive")) doc.addEventListener("DOMContentLoaded", boot); else boot();
  }
})(typeof window !== "undefined" ? window : this);
