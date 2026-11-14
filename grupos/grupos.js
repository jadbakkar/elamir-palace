/* El Amir Palace · reservas para grupos de diciembre (sin backend). Textos en ES / EN / AR (ver grupos-i18n.js).
   Tres formas de pedir: a la carta, presupuesto por persona, o Plato navideño + bebida para todos.
   MENU = copia de api/menu.json (nombre, categoría y precio en USD). Solo lectura del sitio. */
(function () {
  "use strict";

  var I = window.I18N;
  var MENU = [{"id":"entradas-arabes--hummus","cat":"Entradas Árabes","name":"Hummus","price":8},{"id":"entradas-arabes--mutabal","cat":"Entradas Árabes","name":"Mutabal","price":8},{"id":"entradas-arabes--muhammara","cat":"Entradas Árabes","name":"Muhammara","price":8},{"id":"entradas-arabes--labne","cat":"Entradas Árabes","name":"Labne","price":8},{"id":"entradas-arabes--cremas-mixtas","cat":"Entradas Árabes","name":"Cremas mixtas","price":11},{"id":"entradas-arabes--makanek","cat":"Entradas Árabes","name":"Makanek","price":11},{"id":"entradas-arabes--basterma","cat":"Entradas Árabes","name":"Basterma","price":11},{"id":"entradas-arabes--sawda-djaj","cat":"Entradas Árabes","name":"Sawda Djaj","price":11},{"id":"entradas-arabes--garbanzo-con-lomito","cat":"Entradas Árabes","name":"Garbanzo con lomito","price":15},{"id":"entradas-arabes--kibbe-crudo","cat":"Entradas Árabes","name":"Kibbe crudo","price":12},{"id":"entradas-arabes--kibbe-frito","cat":"Entradas Árabes","name":"Kibbe frito","price":12},{"id":"entradas-arabes--kibbe-horneado","cat":"Entradas Árabes","name":"Kibbe horneado","price":13},{"id":"entradas-arabes--falafel","cat":"Entradas Árabes","name":"Falafel","price":8},{"id":"entradas-arabes--falafel-especial","cat":"Entradas Árabes","name":"Falafel especial","price":10},{"id":"entradas-arabes--tabaquitos-de-uva","cat":"Entradas Árabes","name":"Tabaquitos de uva","price":12},{"id":"entradas-arabes--tabaquitos-de-repollo","cat":"Entradas Árabes","name":"Tabaquitos de repollo","price":12},{"id":"entradas-arabes--tabaquitos-mixtos","cat":"Entradas Árabes","name":"Tabaquitos mixtos","price":12},{"id":"entradas-mediterraneas--carpaccio-de-lomito","cat":"Entradas Mediterráneas","name":"Carpaccio de lomito","price":17},{"id":"entradas-mediterraneas--ceviche-de-camaron","cat":"Entradas Mediterráneas","name":"Ceviche de camarón","price":17},{"id":"entradas-mediterraneas--berenjena-frita","cat":"Entradas Mediterráneas","name":"Berenjena frita","price":10},{"id":"entradas-mediterraneas--dedos-de-mozzarella","cat":"Entradas Mediterráneas","name":"Dedos de mozzarella","price":9},{"id":"entradas-mediterraneas--tequenos","cat":"Entradas Mediterráneas","name":"Tequeños","price":9},{"id":"entradas-mediterraneas--papas-fritas","cat":"Entradas Mediterráneas","name":"Papas fritas","price":6},{"id":"sopas-y-cremas--fosforera","cat":"Sopas y Cremas","name":"Fosforera","price":17},{"id":"sopas-y-cremas--sopa-de-pollo-con-vegetales","cat":"Sopas y Cremas","name":"Sopa de pollo con vegetales","price":12},{"id":"sopas-y-cremas--crema-de-pollo","cat":"Sopas y Cremas","name":"Crema de pollo","price":12},{"id":"sopas-y-cremas--crema-de-auyama","cat":"Sopas y Cremas","name":"Crema de auyama","price":12},{"id":"ensaladas--tabbule","cat":"Ensaladas","name":"Tabbule","price":11},{"id":"ensaladas--fattoush","cat":"Ensaladas","name":"Fattoush","price":17},{"id":"ensaladas--libanesa","cat":"Ensaladas","name":"Libanesa","price":15},{"id":"ensaladas--armenia","cat":"Ensaladas","name":"Armenia","price":12},{"id":"ensaladas--yogurt-con-pepino","cat":"Ensaladas","name":"Yogurt con pepino","price":11},{"id":"ensaladas--ensalada-de-cangrejo","cat":"Ensaladas","name":"Ensalada de cangrejo","price":16},{"id":"ensaladas--ensalada-de-burrata","cat":"Ensaladas","name":"Ensalada de burrata","price":17},{"id":"ensaladas--ensalada-cesar","cat":"Ensaladas","name":"Ensalada César","price":13},{"id":"ensaladas--ensalada-cesar-con-pollo","cat":"Ensaladas","name":"Ensalada César con pollo","price":19},{"id":"ensaladas--ensalada-cesar-con-berro-y-pollo","cat":"Ensaladas","name":"Ensalada César con berro y pollo","price":19},{"id":"ensaladas--ensalada-cesar-con-camaron","cat":"Ensaladas","name":"Ensalada César con camarón","price":20},{"id":"ensaladas--rugula-de-la-casa","cat":"Ensaladas","name":"Rúgula de la casa","price":13},{"id":"ensaladas--ensalada-de-palmitos","cat":"Ensaladas","name":"Ensalada de palmitos","price":12},{"id":"ensaladas--ensalada-mixta","cat":"Ensaladas","name":"Ensalada mixta","price":8},{"id":"ensaladas--ensalada-de-camarones","cat":"Ensaladas","name":"Ensalada de camarones","price":16},{"id":"platos-arabes-especiales--fatte","cat":"Platos Árabes Especiales","name":"Fatte","price":15},{"id":"platos-arabes-especiales--fatte-de-berenjena","cat":"Platos Árabes Especiales","name":"Fatte de berenjena","price":15},{"id":"platos-arabes-especiales--plato-mixto","cat":"Platos Árabes Especiales","name":"Plato mixto","price":19},{"id":"platos-arabes-especiales--plato-mixto-con-lomito","cat":"Platos Árabes Especiales","name":"Plato mixto con lomito","price":21},{"id":"platos-arabes-especiales--plato-vegetariano-arabe","cat":"Platos Árabes Especiales","name":"Plato vegetariano árabe","price":18},{"id":"platos-arabes-especiales--plato-de-shawarma","cat":"Platos Árabes Especiales","name":"Plato de shawarma","price":35},{"id":"platos-arabes-especiales--kibbe-al-yogurt","cat":"Platos Árabes Especiales","name":"Kibbe al yogurt","price":17},{"id":"platos-arabes-especiales--arroz-libanes-con-pollo-o-cordero","cat":"Platos Árabes Especiales","name":"Arroz libanés con pollo o cordero","price":19},{"id":"platos-arabes-especiales--bandeja-arabe-2-personas","cat":"Platos Árabes Especiales","name":"Bandeja árabe (2 personas)","price":50},{"id":"platos-arabes-especiales--bandeja-arabe-3-personas","cat":"Platos Árabes Especiales","name":"Bandeja árabe (3 personas)","price":65},{"id":"platos-arabes-especiales--bandeja-arabe-4-personas","cat":"Platos Árabes Especiales","name":"Bandeja árabe (4 personas)","price":75},{"id":"medias-porciones--medio-hummus","cat":"Medias Porciones","name":"Medio hummus","price":4},{"id":"medias-porciones--medio-mutabal","cat":"Medias Porciones","name":"Medio mutabal","price":4},{"id":"medias-porciones--media-muhammara","cat":"Medias Porciones","name":"Media muhammara","price":4},{"id":"medias-porciones--medio-labne","cat":"Medias Porciones","name":"Medio labne","price":6},{"id":"medias-porciones--media-crema-mixta","cat":"Medias Porciones","name":"Media crema mixta","price":6},{"id":"medias-porciones--medio-kibbe-crudo","cat":"Medias Porciones","name":"Medio kibbe crudo","price":6},{"id":"medias-porciones--medio-kibbe-frito","cat":"Medias Porciones","name":"Medio kibbe frito","price":6},{"id":"medias-porciones--medio-kibbe-horneado","cat":"Medias Porciones","name":"Medio kibbe horneado","price":7},{"id":"medias-porciones--medio-falafel","cat":"Medias Porciones","name":"Medio falafel","price":5},{"id":"medias-porciones--medio-tabaquito-de-uva","cat":"Medias Porciones","name":"Medio tabaquito de uva","price":6},{"id":"medias-porciones--medio-tabaquito-de-repollo","cat":"Medias Porciones","name":"Medio tabaquito de repollo","price":6},{"id":"medias-porciones--medio-tabbule","cat":"Medias Porciones","name":"Medio tabbule","price":6},{"id":"medias-porciones--medio-plato-de-shawarma","cat":"Medias Porciones","name":"Medio plato de shawarma","price":18},{"id":"shawarmas-y-sandwiches--shawarma","cat":"Shawarmas y Sándwiches","name":"Shawarma","price":8},{"id":"shawarmas-y-sandwiches--shawarma-especial","cat":"Shawarmas y Sándwiches","name":"Shawarma especial","price":10},{"id":"shawarmas-y-sandwiches--shawarma-super-especial","cat":"Shawarmas y Sándwiches","name":"Shawarma súper especial","price":12},{"id":"shawarmas-y-sandwiches--shawarma-abierto","cat":"Shawarmas y Sándwiches","name":"Shawarma abierto","price":10},{"id":"shawarmas-y-sandwiches--shawarma-especial-abierto","cat":"Shawarmas y Sándwiches","name":"Shawarma especial abierto","price":12},{"id":"shawarmas-y-sandwiches--shawarma-super-especial-abierto","cat":"Shawarmas y Sándwiches","name":"Shawarma súper especial abierto","price":13},{"id":"shawarmas-y-sandwiches--salsa-de-ajo","cat":"Shawarmas y Sándwiches","name":"Salsa de ajo","price":1},{"id":"shawarmas-y-sandwiches--sandwich-de-falafel","cat":"Shawarmas y Sándwiches","name":"Sándwich de falafel","price":8},{"id":"shawarmas-y-sandwiches--fajita","cat":"Shawarmas y Sándwiches","name":"Fajita","price":14},{"id":"shawarmas-y-sandwiches--philadelphia","cat":"Shawarmas y Sándwiches","name":"Philadelphia","price":15},{"id":"shawarmas-y-sandwiches--tawook","cat":"Shawarmas y Sándwiches","name":"Tawook","price":13},{"id":"shawarmas-y-sandwiches--camaron","cat":"Shawarmas y Sándwiches","name":"Camarón","price":14},{"id":"shawarmas-y-sandwiches--lomito","cat":"Shawarmas y Sándwiches","name":"Lomito","price":14},{"id":"shawarmas-y-sandwiches--kebab","cat":"Shawarmas y Sándwiches","name":"Kebab","price":13},{"id":"shawarmas-y-sandwiches--makanek","cat":"Shawarmas y Sándwiches","name":"Makanek","price":13},{"id":"shawarmas-y-sandwiches--higado-de-pollo","cat":"Shawarmas y Sándwiches","name":"Hígado de pollo","price":13},{"id":"shawarmas-y-sandwiches--falafel-especial","cat":"Shawarmas y Sándwiches","name":"Falafel especial","price":10},{"id":"shawarmas-y-sandwiches--kibbe-frito","cat":"Shawarmas y Sándwiches","name":"Kibbe frito","price":11},{"id":"brochetas-y-parrillas--brochetas-el-amir","cat":"Brochetas y Parrillas","name":"Brochetas El Amir","price":65},{"id":"brochetas-y-parrillas--brocheta-de-kafta","cat":"Brochetas y Parrillas","name":"Brocheta de kafta","price":20},{"id":"brochetas-y-parrillas--brocheta-de-pollo","cat":"Brochetas y Parrillas","name":"Brocheta de pollo","price":21},{"id":"brochetas-y-parrillas--brocheta-de-lomito","cat":"Brochetas y Parrillas","name":"Brocheta de lomito","price":24},{"id":"brochetas-y-parrillas--brocheta-mixta","cat":"Brochetas y Parrillas","name":"Brocheta mixta","price":24},{"id":"brochetas-y-parrillas--parrilla-el-amir","cat":"Brochetas y Parrillas","name":"Parrilla El Amir","price":26},{"id":"brochetas-y-parrillas--parrilla-mar-y-tierra","cat":"Brochetas y Parrillas","name":"Parrilla mar y tierra","price":26},{"id":"brochetas-y-parrillas--parrilla-de-mariscos","cat":"Brochetas y Parrillas","name":"Parrilla de mariscos","price":26},{"id":"brochetas-y-parrillas--parrilla-de-pollo","cat":"Brochetas y Parrillas","name":"Parrilla de pollo","price":20},{"id":"brochetas-y-parrillas--parrilla-de-lomito","cat":"Brochetas y Parrillas","name":"Parrilla de lomito","price":24},{"id":"brochetas-y-parrillas--parrilla-mixta","cat":"Brochetas y Parrillas","name":"Parrilla mixta","price":24},{"id":"carnes-y-aves--plato-navideno","cat":"Carnes y Aves","name":"Plato navideño","price":16},{"id":"carnes-y-aves--pollo-a-la-brasa-el-amir","cat":"Carnes y Aves","name":"Pollo a la brasa El Amir","price":34},{"id":"carnes-y-aves--envoltini-de-pollo","cat":"Carnes y Aves","name":"Envoltini de pollo","price":20},{"id":"carnes-y-aves--pollo-a-la-brasa","cat":"Carnes y Aves","name":"Pollo a la brasa","price":17},{"id":"carnes-y-aves--pollo-a-la-canasta","cat":"Carnes y Aves","name":"Pollo a la canasta","price":16},{"id":"carnes-y-aves--tenders-de-pollo-crispy","cat":"Carnes y Aves","name":"Tenders de pollo crispy","price":16},{"id":"carnes-y-aves--suprema-de-pollo-crispy","cat":"Carnes y Aves","name":"Suprema de pollo crispy","price":24},{"id":"carnes-y-aves--filet-mignon","cat":"Carnes y Aves","name":"Filet mignon","price":24},{"id":"carnes-y-aves--cordon-bleu-de-lomito","cat":"Carnes y Aves","name":"Cordon bleu de lomito","price":23},{"id":"carnes-y-aves--cordon-bleu-de-pollo","cat":"Carnes y Aves","name":"Cordon bleu de pollo","price":22},{"id":"carnes-y-aves--centro-de-lomito-a-la-plancha","cat":"Carnes y Aves","name":"Centro de lomito a la plancha","price":20},{"id":"carnes-y-aves--pollo-a-la-milanesa","cat":"Carnes y Aves","name":"Pollo a la milanesa","price":19},{"id":"carnes-y-aves--pollo-al-champinon","cat":"Carnes y Aves","name":"Pollo al champiñón","price":20},{"id":"carnes-y-aves--pollo-a-la-plancha","cat":"Carnes y Aves","name":"Pollo a la plancha","price":16},{"id":"pescados-y-mariscos--mero-en-2-salsas","cat":"Pescados y Mariscos","name":"Mero en 2 salsas","price":22},{"id":"pescados-y-mariscos--mero-a-la-plancha","cat":"Pescados y Mariscos","name":"Mero a la plancha","price":24},{"id":"pescados-y-mariscos--mero-al-ajillo","cat":"Pescados y Mariscos","name":"Mero al ajillo","price":24},{"id":"pescados-y-mariscos--cazuela-de-mariscos","cat":"Pescados y Mariscos","name":"Cazuela de mariscos","price":17},{"id":"pescados-y-mariscos--dynamite-shrimp","cat":"Pescados y Mariscos","name":"Dynamite shrimp","price":21},{"id":"pescados-y-mariscos--camarones-a-la-plancha","cat":"Pescados y Mariscos","name":"Camarones a la plancha","price":20},{"id":"pescados-y-mariscos--camarones-al-ajillo","cat":"Pescados y Mariscos","name":"Camarones al ajillo","price":20},{"id":"pescados-y-mariscos--camarones-rebozados","cat":"Pescados y Mariscos","name":"Camarones rebozados","price":20},{"id":"pescados-y-mariscos--calamares-al-ajillo","cat":"Pescados y Mariscos","name":"Calamares al ajillo","price":18},{"id":"pescados-y-mariscos--calamares-rebozados","cat":"Pescados y Mariscos","name":"Calamares rebozados","price":20},{"id":"pescados-y-mariscos--pulpo-al-grill","cat":"Pescados y Mariscos","name":"Pulpo al grill","price":28},{"id":"pescados-y-mariscos--asopado-de-mariscos-2-personas","cat":"Pescados y Mariscos","name":"Asopado de mariscos (2 personas)","price":50},{"id":"arroces--risotto-al-pesto-con-escalopines-de-pollo","cat":"Arroces","name":"Risotto al pesto con escalopines de pollo","price":19},{"id":"arroces--risotto-con-calabaza-y-calamares-acevichados","cat":"Arroces","name":"Risotto con calabaza y calamares acevichados","price":19},{"id":"arroces--paella-2-personas","cat":"Arroces","name":"Paella (2 personas)","price":50},{"id":"arroces--paella-3-personas","cat":"Arroces","name":"Paella (3 personas)","price":60},{"id":"arroces--paella-4-personas","cat":"Arroces","name":"Paella (4 personas)","price":75},{"id":"arroces--fideua-2-personas","cat":"Arroces","name":"Fideuá (2 personas)","price":50},{"id":"arroces--fideua-3-personas","cat":"Arroces","name":"Fideuá (3 personas)","price":60},{"id":"arroces--fideua-4-personas","cat":"Arroces","name":"Fideuá (4 personas)","price":75},{"id":"arroces--arroz-a-la-marinera-2-personas","cat":"Arroces","name":"Arroz a la marinera (2 personas)","price":50},{"id":"pastas--fettuccine-con-ragu-de-mero","cat":"Pastas","name":"Fettuccine con ragú de mero","price":24},{"id":"pastas--cartoccio-de-lomito","cat":"Pastas","name":"Cartoccio de lomito","price":24},{"id":"pastas--rigatoni-cremoso-con-tocineta-y-champinones","cat":"Pastas","name":"Rigatoni cremoso con tocineta y champiñones","price":20},{"id":"pastas--linguini-con-camarones","cat":"Pastas","name":"Linguini con camarones","price":21},{"id":"pastas--linguini-al-fileto","cat":"Pastas","name":"Linguini al fileto","price":20},{"id":"pastas--linguini-marinera","cat":"Pastas","name":"Linguini marinera","price":21},{"id":"pastas--linguini-carbonara","cat":"Pastas","name":"Linguini carbonara","price":18},{"id":"pastas--pasta-bologna","cat":"Pastas","name":"Pasta bologna","price":11},{"id":"pastas--pasta-napoli","cat":"Pastas","name":"Pasta napoli","price":11},{"id":"pastas--pasticho-tradicional","cat":"Pastas","name":"Pasticho tradicional","price":11},{"id":"hamburguesas--cheeseburger","cat":"Hamburguesas","name":"Cheeseburger","price":13},{"id":"hamburguesas--oh-my-burger","cat":"Hamburguesas","name":"Oh My Burger!","price":13},{"id":"hamburguesas--pollo-crispy","cat":"Hamburguesas","name":"Pollo crispy","price":13},{"id":"hamburguesas--gordon-burger","cat":"Hamburguesas","name":"Gordon burger","price":13},{"id":"batidos-y-yogurt--batido-de-fresa","cat":"Batidos y Yogurt","name":"Batido de fresa","price":4},{"id":"batidos-y-yogurt--batido-de-melon","cat":"Batidos y Yogurt","name":"Batido de melón","price":4},{"id":"batidos-y-yogurt--batido-de-pina","cat":"Batidos y Yogurt","name":"Batido de piña","price":4},{"id":"batidos-y-yogurt--batido-de-melocoton","cat":"Batidos y Yogurt","name":"Batido de melocotón","price":4},{"id":"batidos-y-yogurt--batido-de-guanabana","cat":"Batidos y Yogurt","name":"Batido de guanábana","price":4},{"id":"batidos-y-yogurt--batido-de-lechosa","cat":"Batidos y Yogurt","name":"Batido de lechosa","price":4},{"id":"batidos-y-yogurt--batido-de-parchita","cat":"Batidos y Yogurt","name":"Batido de parchita","price":4},{"id":"batidos-y-yogurt--batido-de-mora","cat":"Batidos y Yogurt","name":"Batido de mora","price":4},{"id":"batidos-y-yogurt--limonada","cat":"Batidos y Yogurt","name":"Limonada","price":4},{"id":"batidos-y-yogurt--limonada-con-hierbabuena","cat":"Batidos y Yogurt","name":"Limonada con hierbabuena","price":4},{"id":"batidos-y-yogurt--merengada-de-frutas","cat":"Batidos y Yogurt","name":"Merengada de frutas","price":6},{"id":"batidos-y-yogurt--yogurt-con-hierbabuena","cat":"Batidos y Yogurt","name":"Yogurt con hierbabuena","price":6},{"id":"batidos-y-yogurt--yogurt-con-frutas","cat":"Batidos y Yogurt","name":"Yogurt con frutas","price":6},{"id":"bebidas--agua-mineral","cat":"Bebidas","name":"Agua mineral","price":1.5},{"id":"bebidas--nestea","cat":"Bebidas","name":"Nestea","price":2},{"id":"bebidas--jarra-de-nestea-x4","cat":"Bebidas","name":"Jarra de Nestea (x4)","price":12},{"id":"bebidas--te-lipton","cat":"Bebidas","name":"Té Lipton","price":3},{"id":"bebidas--gatorade","cat":"Bebidas","name":"Gatorade","price":3},{"id":"bebidas--refresco-de-lata","cat":"Bebidas","name":"Refresco de lata","price":2},{"id":"bebidas--refresco-1l","cat":"Bebidas","name":"Refresco 1L","price":3},{"id":"bebidas--refresco-1-5l","cat":"Bebidas","name":"Refresco 1.5L","price":4},{"id":"bebidas--sparkling","cat":"Bebidas","name":"Sparkling","price":3},{"id":"bebidas--soda","cat":"Bebidas","name":"Soda","price":3},{"id":"bebidas--agua-de-manzana","cat":"Bebidas","name":"Agua de manzana","price":2},{"id":"licores-y-cocteles--cerveza-nacional","cat":"Licores y Cócteles","name":"Cerveza nacional","price":1.5},{"id":"licores-y-cocteles--cerveza-importada","cat":"Licores y Cócteles","name":"Cerveza importada","price":5},{"id":"licores-y-cocteles--copa-de-vino","cat":"Licores y Cócteles","name":"Copa de vino","price":5},{"id":"licores-y-cocteles--botella-de-anis","cat":"Licores y Cócteles","name":"Botella de anís","price":30},{"id":"licores-y-cocteles--botella-de-whisky-8-anos","cat":"Licores y Cócteles","name":"Botella de whisky 8 años","price":45},{"id":"licores-y-cocteles--botella-de-whisky-12-anos","cat":"Licores y Cócteles","name":"Botella de whisky 12 años","price":60},{"id":"licores-y-cocteles--botella-de-whisky-18-anos","cat":"Licores y Cócteles","name":"Botella de whisky 18 años","price":115}];
  var FEATURED = "carnes-y-aves--plato-navideno";
  var DRINK_CATS = ["Bebidas", "Batidos y Yogurt", "Licores y Cócteles"];
  var AREAS = ["", "terraza", "baja", "alta", "terrazaSup"];   /* "" = wherever there is room; only Lechería has areas */
  var SERV = 0.10;
  var TAX = 0.16;                    /* already inside every total; the page never names it */
  var STORE = "amir-grupo";          /* sessionStorage: the form, saved while the host picks plates or drinks on the order page (pedir.js ?grupo=1) */
  var CART_P = "amir-grupo-platos-cart";   /* localStorage: the order page's own cart for the plates */
  var CART = "amir-grupo-cart";      /* localStorage: that page's own cart for the bottles */
  var CART_D = "amir-grupo-pp-cart"; /* localStorage: the order page's own cart for "a drink for each person" */
  var WA = { "Lechería": "584248060218", "Puerto La Cruz": "584127505025" }; /* mismos números que config.js */
  var CLIENT_LANG = { en: "English", ar: "العربية" };

  function isDrink(d) { return DRINK_CATS.indexOf(d.cat) !== -1; }
  var ITEMS = {};
  MENU.forEach(function (d) { ITEMS[d.id] = d; });
  var ORDER = (ITEMS[FEATURED] ? [ITEMS[FEATURED]] : []).concat(MENU.filter(function (d) { return d.id !== FEATURED; }));

  var plates = [];                  /* [{ id, name (Spanish), ui, price }]: the dishes the guests can order, chosen on the order page */
  var drinks = [];                  /* [{ qty, name (Spanish), ui, total }]: drinks and bottles by quantity, chosen on the order page */
  var pending = null;               /* select values to put back after a trip to the order page */
  var drinksPP = [];                /* [{ key, per, name (Spanish), ui, unit }]: a drink for each person, chosen on the order page (per = how many per person) */

  /* ---------- language helpers ---------- */
  function L() { return I.lang || "es"; }
  function T(k, v, lang) { return I.t(k, v, lang); }
  /* a dish name in the language on screen; the WhatsApp text always asks for "es", which is the menu's own name */
  function dn(es, lang) {
    lang = lang || L();
    if (lang === "es") return es;
    if (es.indexOf(" + ") > -1) return es.split(" + ").map(function (p) { return dn(p, lang); }).join(" + ");
    try { var r = I.dish(es); return (r && r.name) || es; } catch (e) { return es; }
  }

  /* ---------- helpers ---------- */
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(t) { return String(t).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function r2(n) { return Math.round(n * 100) / 100; }
  function fin(n) { return isFinite(n) ? n : 0; }
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function isoOf(d) { return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }
  var NUM_LOC = { es: "es-VE", en: "en-US", ar: "en-US" };      /* numbers: Western digits in every language */
  var DATE_LOC = { es: "es-VE", en: "en-US", ar: "ar-u-nu-latn" };
  var NFS = {};
  function nf(lang, fixed) {
    var key = lang + (fixed ? "b" : "a");
    return NFS[key] || (NFS[key] = new Intl.NumberFormat(NUM_LOC[lang] || "es-VE", fixed ? { minimumFractionDigits: 2, maximumFractionDigits: 2 } : { minimumFractionDigits: 0, maximumFractionDigits: 2 }));
  }
  function usd(n, lang) { var v = r2(fin(n)); return "$" + nf(lang || L(), Math.abs(v - Math.round(v)) > 0.001).format(v); }
  function d2(n, lang) { return nf(lang || L(), true).format(r2(fin(n))); }
  function filled(el) { return !!el && String(el.value).trim() !== ""; }
  function flag(el, bad) { if (!el) return; el.setAttribute("aria-invalid", bad ? "true" : "false"); el.classList.toggle("bad", !!bad); }
  /* a number from an input, or null when it is empty, not a number, out of range or not whole (when int) */
  function num(el, min, max, int) {
    if (!el) return null;
    var raw = String(el.value).replace(/\s/g, "").replace(",", ".");
    if (raw === "") return null;
    var n = Number(raw);
    if (!isFinite(n) || n < min || n > max || (int && Math.floor(n) !== n)) return null;
    return n;
  }
  function fmtDate(iso, lang) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return "";
    var d = new Date(iso + "T12:00:00");
    return isNaN(d.getTime()) ? "" : d.toLocaleDateString(DATE_LOC[lang || L()] || "es-VE", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  }
  function mode() { var r = $('input[name="modo"]:checked'); return r ? r.value : "presupuesto"; }

  /* the same rules as the reservation form */
  function validPhone(p) { var d = String(p).replace(/\D/g, ""); return d.length >= 10 && d.length <= 13; }
  function validDocid(s) { return /^[VEJGP]?\d{6,12}$/.test(String(s).replace(/[\s.-]/g, "").toUpperCase()); }
  /* "v-12.345.678" -> "V-12345678" (what the branch sees) */
  function normDocid(s) { var d = String(s).replace(/[\s.-]/g, "").toUpperCase(); return /^[VEJGP]/.test(d) ? d[0] + "-" + d.slice(1) : d; }
  function validDate(v) { return /^\d{4}-\d{2}-\d{2}$/.test(v) && v >= isoOf(new Date()); }

  /* ---------- time: any hour is fine; only a time that already passed today is refused ---------- */
  function timePast(iso, hhmm) {
    var now = new Date();
    if (iso !== isoOf(now) || !/^\d{2}:\d{2}$/.test(hhmm)) return false;
    return (+hhmm.slice(0, 2)) * 60 + (+hhmm.slice(3, 5)) < now.getHours() * 60 + now.getMinutes();
  }
  function renderAreas() {
    var sel = $("#area"), keep = sel.value;
    sel.innerHTML = AREAS.map(function (a) { return '<option value="' + a + '">' + esc(T(a ? "g.area." + a : "g.area.any")) + "</option>"; }).join("");
    var lech = $("#branch").value === "Lechería";
    $("#areaRow").hidden = !lech; $("#areaHint").hidden = !lech;
    sel.value = lech ? keep : "";
  }
  function renderPP() {
    var n = num($("#people"), 1, 300, true) || 0;
    $("#ppSummary").innerHTML = drinksPP.length ? drinksPP.map(function (d) {
      return "<li><span>" + esc(dn(d.name)) + "<small>" + esc(T("g.line.pk", { per: d.per, n: n }) + " · " + usd(d.unit)) + "</small></span><b>" + esc(usd(n * d.per * d.unit)) + "</b></li>";
    }).join("") : '<li class="empty">' + esc(T("g.pp.empty")) + "</li>";
    $("#btnPP").textContent = T(drinksPP.length ? "g.pp.edit" : "g.pp.pick");
  }
  /* only the cards of the chosen way of ordering are shown */
  function paintMode() {
    var m = mode();
    $$("[data-modes]").forEach(function (el) { el.hidden = (" " + el.getAttribute("data-modes") + " ").indexOf(" " + m + " ") < 0; });
  }

  /* ---------- plates: chosen on the order page (only its food sections, only the dishes that fit the amount per person) ---------- */
  function plateOf(d) { return { id: d.id, name: d.name, ui: d.name, price: d.price }; }
  function renderPlates() {
    $("#plateSummary").innerHTML = plates.length ? plates.map(function (p) {
      return "<li><span>" + esc(dn(p.name)) + (p.id === FEATURED ? ' <em class="feat">' + esc(T("g.feat.k")) + "</em>" : "") + "</span><b>" + esc(usd(p.price)) + "</b></li>";
    }).join("") : '<li class="empty">' + esc(T("g.pl.empty")) + "</li>";
    $("#btnPlates").textContent = T(plates.length ? "g.pl.edit" : "g.pl.pick");
  }

  /* drinks and bottles: chosen on the order page (only its drinks sections), with quantities; they come back here and are charged by unit */
  function renderDrinks() {
    $("#drinkSummary").innerHTML = drinks.length ? drinks.map(function (d) {
      return "<li><span>" + esc(dn(d.name)) + "<small>" + esc(T("g.line.tbl", { q: d.qty, unit: usd(d.total / d.qty) })) + "</small></span><b>" + esc(usd(d.total)) + "</b></li>";
    }).join("") : '<li class="empty">' + esc(T("g.dr.empty")) + "</li>";
    $("#btnDrinks").textContent = T(drinks.length ? "g.dr.edit" : "g.dr.pick");
  }
  function formState() {
    return { name: $("#name").value, phone: $("#phone").value, docid: $("#docid").value, date: $("#date").value, time: $("#time").value, people: $("#people").value,
      branch: $("#branch").value, area: $("#area").value, notes: $("#notes").value, mode: mode(), budget: $("#budgetPP").value, serv: $("#optServicio").checked };
  }
  function readStore() { try { var v = JSON.parse(sessionStorage.getItem(STORE) || "null"); return v && v.form ? v : null; } catch (e) { return null; } }
  /* the plates and the drinks are chosen on the order page, which sends the host back here ("Listo") */
  function go(where) {
    var b = num($("#budgetPP"), 0.01, 5000, false);
    var data = { form: formState(), plates: plates, dishes: drinks, drinksPP: drinksPP, sub: 0, back: location.pathname + "#" + where };
    try {
      sessionStorage.setItem(STORE, JSON.stringify(data));
      if (where === "platos") { /* the plates already chosen come selected */
        var pre = {}; plates.forEach(function (p) { if (!b || p.price <= b) pre[p.id] = 1; });
        localStorage.setItem(CART_P, JSON.stringify(pre));
      } else if (where === "porpersona") { /* the drinks already chosen come selected, with their quantity per person */
        var pp = {}; drinksPP.forEach(function (d) { pp[d.key] = d.per; });
        localStorage.setItem(CART_D, JSON.stringify(pp));
      } else if (!drinks.length) localStorage.removeItem(CART);
    } catch (e) { return; } /* storage blocked: the form could not be kept, so stay here */
    location.href = new URL($("#btnDrinks").getAttribute("data-href"), location.href).href + "?presupuesto=1&grupo=1" +
      (where === "platos" ? "&modo=platos" + (b ? "&max=" + b : "") : where === "porpersona" ? "&modo=porpersona" : "");
  }
  /* back from the order page: the form as it was, plus what was chosen (true when the host is coming back) */
  function restore() {
    var nav = performance.getEntriesByType ? performance.getEntriesByType("navigation")[0] : null;
    var back = location.hash === "#platos" || location.hash === "#bebidas" || location.hash === "#porpersona" || !!(nav && nav.type === "back_forward");   /* "Listo", or the browser's Back button */
    if (!back) { try { sessionStorage.removeItem(STORE); } catch (e) { /* ignore */ } return false; }
    var v = readStore(); if (!v) return false;
    var f = v.form || {};
    ["name", "phone", "docid", "notes"].forEach(function (k) { $("#" + k).value = f[k] || ""; });
    if (f.date) $("#date").value = f.date;
    if (f.people != null) $("#people").value = f.people;
    if (f.branch) $("#branch").value = f.branch;
    if (f.budget != null) $("#budgetPP").value = f.budget;
    $("#optServicio").checked = !!f.serv;
    var r = $('input[name="modo"][value="' + f.mode + '"]'); if (r) r.checked = true;
    pending = { time: f.time || "", area: f.area || "" };   /* the selects are filled first, then these are put back */
    plates = Array.isArray(v.plates) ? v.plates.filter(function (p) { return p && p.id; }) : [];
    drinks = Array.isArray(v.dishes) ? v.dishes.filter(function (d) { return d && d.qty > 0; }) : [];
    drinksPP = Array.isArray(v.drinksPP) ? v.drinksPP.filter(function (d) { return d && d.per > 0 && d.unit > 0; }) : [];
    return true;
  }

  /* ---------- the quote (presupuesto): the price is final, no tax, service only if the host asks for it ---------- */
  function calc() {
    var m = mode(), errs = [], warn = [], lines = [], opts = [];
    var pEl = $("#people"), people = num(pEl, 1, 300, true), N = people || 0;
    flag(pEl, people === null);
    if (people === null) errs.push(T("g.err.people"));

    var b = null, base = 0, extraSub = 0, hasExtras = false, priced = true;
    if (m === "presupuesto") {
      var bEl = $("#budgetPP"); b = num(bEl, 0.01, 5000, false);
      flag(bEl, filled(bEl) && b === null);
      if (b === null) { errs.push(T("g.err.amount")); priced = false; }
      else {
        opts = plates.map(function (p) { return { id: p.id, name: p.name, price: p.price, kind: "plato" }; });
        base = r2(b * N);
        lines.push({ t: "pp", qty: N, unit: b, amount: base });
        if (!opts.length) errs.push(T("g.err.noopt"));
        var over = opts.filter(function (o) { return o.price > b; });
        if (over.length) warn.push(T("g.warn.over", { b: usd(b), names: over.map(function (o) { return dn(o.name); }).join(", ") }));
      }
    } else if (m === "paquete") {
      var plate = ITEMS[FEATURED];
      lines.push({ t: "pk", name: plate.name, per: 1, n: N, qty: N, unit: plate.price, amount: r2(N * plate.price) });
      base = r2(N * plate.price);
    } else priced = false;   /* a la carta: no price up front */

    /* a drink for each person (optional, picked on the order page): each one times the number of guests */
    if (m === "presupuesto") drinksPP.forEach(function (d) {
      var dAmt = r2(N * d.per * d.unit);
      lines.push({ t: "pk", drink: true, name: d.name, per: d.per, n: N, qty: N * d.per, unit: d.unit, amount: dAmt });
      base = r2(base + dAmt);
    });

    /* drinks and bottles from the order page: counted by quantity, on top of the per-person total */
    if (m !== "carta") drinks.forEach(function (d) {
      lines.push({ t: "x", name: d.name, qty: d.qty, unit: r2(d.total / d.qty), amount: r2(d.total) });
      extraSub += d.total; hasExtras = true;
    });
    var useServ = m !== "carta" && $("#optServicio").checked;
    var sub = r2(base + extraSub);
    var serv = useServ ? r2(sub * SERV) : 0;
    return { mode: m, N: N, b: b, lines: lines, opts: opts, errs: errs, warn: warn, sub: sub, serv: serv, total: r2((sub + serv) * (1 + TAX)), hasServ: useServ, hasExtras: hasExtras, priced: priced && N > 0 };
  }
  function lineLabel(l, lang) { return l.t === "pp" ? T("g.line.pp", null, lang) : dn(l.name, lang); }
  function lineDetail(l, lang) {
    if (l.t === "pp") return T("g.line.ppd", { amount: usd(l.unit, lang), n: l.qty }, lang);
    if (l.t === "pk") return T("g.line.pk", { per: l.per, n: l.n }, lang) + " · " + usd(l.unit, lang);
    return T("g.line.tbl", { q: l.qty, unit: usd(l.unit, lang) }, lang);
  }
  function modeName(m, lang) { return T("g.mode." + m + ".t", null, lang); }
  function timeText(lang) { var t = $("#time").value; return t ? I.time12(t, lang) : ""; }
  function areaText(lang) { var a = $("#area").value; return a && $("#branch").value === "Lechería" ? T("g.area." + a, null, lang) : ""; }

  function renderCard(c) {
    var ds = fmtDate($("#date").value), tm = timeText(), nm = $("#name").value.trim(), ph = $("#phone").value.trim();
    $("#qClient").innerHTML = "<p><b>" + esc(nm || T("g.noname")) + "</b> · " + esc(ph || T("g.nophone")) + "</p>" +
      "<p>" + esc((ds || T("g.nodate")) + (tm ? " · " + tm : "") + " · " + (c.N ? T("g.guests", { n: c.N }) : T("g.guests.undef"))) + "</p>" +
      "<p>" + esc($("#branch").value + (areaText() ? " · " + areaText() : "") + " · " + modeName(c.mode)) + "</p>";
    $("#qLines").innerHTML = c.mode === "carta" ? '<li class="empty">' + esc(T("g.carta.lines")) + "</li>"
      : c.lines.length ? c.lines.map(function (l) {
        return "<li><span>" + esc(lineLabel(l)) + "<small>" + esc(lineDetail(l)) + "</small></span><b>" + esc(usd(l.amount)) + "</b></li>";
      }).join("") : '<li class="empty">' + esc(T("g.noLines")) + "</li>";
    $("#qOpts").innerHTML = c.opts.length ? "<h3>" + esc(T("g.opts", { n: c.opts.length })) + "</h3><ul class=\"q-opts\">" +
      c.opts.map(function (o) { return "<li><span>" + esc(dn(o.name)) + "</span><b>" + esc(usd(o.price)) + "</b></li>"; }).join("") + "</ul>" : "";
    if (c.mode === "carta") $("#qTot").innerHTML = "";
    else if (!c.priced) $("#qTot").innerHTML = '<p class="q-none">' + esc(T("g.needTotal")) + "</p>";
    else {
      $("#qTot").innerHTML = '<dl class="q-tot">' +
        (c.hasServ ? "<div><dt>" + esc(T("g.service")) + "</dt><dd>" + usd(c.serv) + "</dd></div>" : "") +
        '<div class="grand"><dt>' + esc(T("g.total")) + "</dt><dd>" + usd(c.total) + "</dd></div>" +
        (c.hasExtras ? "" : "<div><dt>" + esc(T("g.perPerson")) + "</dt><dd>" + usd(c.total / c.N) + "</dd></div>") + "</dl>";
    }
    $("#qWarn").innerHTML = c.errs.map(function (e) { return '<p class="q-msg err">' + esc(e) + "</p>"; }).join("") +
      c.warn.map(function (w) { return '<p class="q-msg">' + esc(w) + "</p>"; }).join("");
  }

  /* the WhatsApp text is ALWAYS Spanish (the staff read Spanish), like the rest of the site; a non-Spanish guest gets one extra line */
  function buildMessage(c, maxPlates) {
    var E = function (k, v) { return T(k, v, "es"); }, U = function (n) { return usd(n, "es"); };
    var L2 = ["*Reserva de grupo - El Amir Palace*", "",
      "Sucursal: " + $("#branch").value];
    if (areaText("es")) L2.push("Zona: " + areaText("es"));
    L2.push("Nombre: " + $("#name").value.trim(), "C.I / RIF: " + normDocid($("#docid").value), "Teléfono: " + $("#phone").value.trim(),
      "Fecha: " + fmtDate($("#date").value, "es"), "Hora: " + timeText("es"), "Personas: " + c.N, "Modalidad: " + modeName(c.mode, "es"));
    if (CLIENT_LANG[L()]) L2.push("*Idioma del cliente:* " + CLIENT_LANG[L()]);
    var nt = $("#notes").value.trim();
    if (nt) L2.push("Notas: " + nt);
    if (c.mode === "carta") {
      L2.push("", E("g.carta.lines"), "", "Presupuesto sujeto a confirmación del restaurante.");
      return L2.join("\n");
    }
    var pers = function (l) { return "- " + l.name + ": " + E("g.line.pk", { per: l.per, n: l.n }) + " = " + U(l.amount); };
    var main = c.lines.filter(function (l) { return l.t === "pp" || (l.t === "pk" && !l.drink); }), dr = c.lines.filter(function (l) { return l.drink; }), ex = c.lines.filter(function (l) { return l.t === "x"; });
    if (c.mode === "presupuesto") L2.push("", "*Presupuesto por persona*", E("g.line.ppd", { amount: U(c.b), n: c.N }) + ": " + U(main[0].amount));
    else { L2.push("", "*Plato navideño para todos*"); main.forEach(function (l) { L2.push(pers(l)); }); }
    if (dr.length) { L2.push("", "*Bebida para cada persona*"); dr.forEach(function (l) { L2.push(pers(l)); }); }
    if (ex.length) { L2.push("", "*Botellas y bebidas para la mesa (por unidad, no por persona)*"); ex.forEach(function (l) { L2.push("- " + l.name + ": " + l.qty + " × " + U(l.unit) + " = " + U(l.amount)); }); }
    L2.push("", "*Total*");
    if (c.hasServ) L2.push("Servicio 10%: " + U(c.serv));
    L2.push("*Total: " + U(c.total) + "*");
    if (!c.hasExtras) L2.push("Por persona: " + U(c.total / c.N));
    if (c.opts.length) { /* last: if the list is very long, it is the only thing that gets shortened (names only, to keep the link short) */
      var names = c.opts.map(function (o) { return o.name; }), shown = maxPlates && names.length > maxPlates ? names.slice(0, maxPlates) : names;
      L2.push("", "*Platos que pueden elegir los invitados (" + names.length + ")*",
        shown.join(", ") + (shown.length < names.length ? " … y " + (names.length - shown.length) + " más (lista completa en el presupuesto adjunto)" : ""));
    }
    L2.push("", "Precios en dólares. Presupuesto sujeto a confirmación del restaurante.");
    return L2.join("\n");
  }
  /* the link, shortened until it fits (the same 1900 characters the reservation page allows) */
  function waUrl(c) {
    var base = "https://wa.me/" + (WA[$("#branch").value] || WA["Lechería"]) + "?text=", max = c.opts.length, url = base + encodeURIComponent(buildMessage(c));
    while (url.length > 1900 && max > 5) { max = Math.floor(max * 0.8); url = base + encodeURIComponent(buildMessage(c, max)); }
    return { url: url, trimmed: max < c.opts.length };
  }

  /* ---------- branded presupuesto document (print / PDF) ---------- */
  var BIZ = { name: "El Amir Palace C.A.", rif: "J-304241330", addr: "Av. Monagas, calle 5, Lechería, Edo. Anzoátegui", tel: "0424-806 0218", mail: "elamirpalace25@gmail.com", web: "www.elamirpalace.com" };
  /* amount in Spanish words, like the restaurant's own documents ("CIENTO CUARENTA CON 36/100"); only on the Spanish document */
  function words(n) {
    var U = ["", "UNO", "DOS", "TRES", "CUATRO", "CINCO", "SEIS", "SIETE", "OCHO", "NUEVE", "DIEZ", "ONCE", "DOCE", "TRECE", "CATORCE", "QUINCE", "DIECISÉIS", "DIECISIETE", "DIECIOCHO", "DIECINUEVE", "VEINTE", "VEINTIUNO", "VEINTIDÓS", "VEINTITRÉS", "VEINTICUATRO", "VEINTICINCO", "VEINTISÉIS", "VEINTISIETE", "VEINTIOCHO", "VEINTINUEVE"];
    var D = ["", "", "", "TREINTA", "CUARENTA", "CINCUENTA", "SESENTA", "SETENTA", "OCHENTA", "NOVENTA"];
    var C = ["", "CIENTO", "DOSCIENTOS", "TRESCIENTOS", "CUATROCIENTOS", "QUINIENTOS", "SEISCIENTOS", "SETECIENTOS", "OCHOCIENTOS", "NOVECIENTOS"];
    function lt100(x) { return x < 30 ? U[x] : D[Math.floor(x / 10)] + (x % 10 ? " Y " + U[x % 10] : ""); }
    function lt1000(x) { if (x === 100) return "CIEN"; return ((C[Math.floor(x / 100)] || "") + " " + lt100(x % 100)).trim(); }
    function full(x) {
      if (x === 0) return "CERO";
      var out = "", m = Math.floor(x / 1e6), k = Math.floor((x % 1e6) / 1000), r = x % 1000;
      if (m) out += (m === 1 ? "UN MILLÓN" : full(m) + " MILLONES") + " ";
      if (k) out += (k === 1 ? "MIL" : lt1000(k) + " MIL") + " ";
      if (r) out += lt1000(r);
      return out.trim();
    }
    var v = r2(fin(n)), ent = Math.floor(v), cts = Math.round((v - ent) * 100);
    return full(ent) + " CON " + pad(cts) + "/100";
  }
  function ddmmyyyy(d) { return pad(d.getDate()) + "/" + pad(d.getMonth() + 1) + "/" + d.getFullYear(); }
  function renderDoc(c) {
    var now = new Date(), due = new Date(now.getTime() + 7 * 864e5);
    var no = String(now.getFullYear()).slice(2) + pad(now.getMonth() + 1) + pad(now.getDate()) + "-" + pad(now.getHours()) + pad(now.getMinutes());
    var nm = $("#name").value.trim(), ph = $("#phone").value.trim(), ci = $("#docid").value.trim() ? normDocid($("#docid").value) : "", nt = $("#notes").value.trim();
    var tm = timeText(), ar = areaText();
    var h = "";
    h += '<header class="doc-head"><div class="doc-brand"><img src="logo.svg" alt="" width="64" height="64"><div><p class="doc-name">El Amir Palace</p>' +
      "<p>" + esc(BIZ.name) + " · RIF " + esc(BIZ.rif) + "</p><p>" + esc(BIZ.addr) + '</p><p dir="ltr">' + esc(T("g.d.tel")) + " " + esc(BIZ.tel) + " · " + esc(BIZ.mail) + "</p></div></div>" +
      '<div class="doc-no"><p class="doc-kind">' + esc(T("g.d.title")) + '</p><p class="doc-num">' + esc(T("g.d.no")) + " " + no + "</p>" +
      "<dl><div><dt>" + esc(T("g.d.issued")) + "</dt><dd>" + ddmmyyyy(now) + "</dd></div><div><dt>" + esc(T("g.d.valid")) + "</dt><dd>" + ddmmyyyy(due) + "</dd></div></dl></div></header>";
    h += '<section class="doc-client"><div><p class="doc-lbl">' + esc(T("g.d.client")) + '</p><p class="doc-big">' + esc(nm || "—") + '</p><p dir="ltr">' + esc([ph, ci].filter(Boolean).join(" · ")) + "</p></div>" +
      '<div><p class="doc-lbl">' + esc(T("g.d.event")) + '</p><p class="doc-big">' + esc((fmtDate($("#date").value) || "—") + (tm ? " · " + tm : "")) + "</p><p>" +
      esc((c.N ? T("g.guests", { n: c.N }) + " · " : "") + T("g.d.branch", { b: $("#branch").value }) + (ar ? " · " + ar : "")) + "</p></div>" +
      '<div><p class="doc-lbl">' + esc(T("g.d.mode")) + '</p><p class="doc-big">' + esc(modeName(c.mode)) + "</p><p>" + esc(c.mode === "presupuesto" && c.b !== null ? T("g.d.ppLine", { amount: usd(c.b) }) : "") + "</p></div></section>";
    if (c.mode === "carta") h += '<p class="doc-note">' + esc(T("g.carta.lines")) + "</p>";
    else if (c.lines.length) {
      h += '<table class="doc-table"><thead><tr><th>#</th><th>' + esc(T("g.d.desc")) + '</th><th class="n">' + esc(T("g.d.qty")) + '</th><th class="n">' + esc(T("g.d.unit")) + '</th><th class="n">' + esc(T("g.d.tot")) + "</th></tr></thead><tbody>" +
        c.lines.map(function (l, i) {
          return "<tr><td>" + (i + 1) + "</td><td><b>" + esc(lineLabel(l)) + "</b><small>" + esc(lineDetail(l)) + '</small></td><td class="n">' + l.qty + '</td><td class="n">' + d2(l.unit) + '</td><td class="n">' + d2(l.amount) + "</td></tr>";
        }).join("") + "</tbody></table>";
    }
    if (c.opts.length) {
      h += '<section class="doc-opts"><p class="doc-lbl">' + esc(T("g.d.opts", { n: c.opts.length })) + "</p><ul>" +
        c.opts.map(function (o) { return "<li><span>" + esc(dn(o.name)) + "</span><b>" + d2(o.price) + "</b></li>"; }).join("") + "</ul></section>";
    }
    if (c.priced) {
      var w = L() === "es" ? T("g.d.words", { w: words(c.total) }) : "";
      h += '<section class="doc-sum"><div class="doc-words">' + esc(w) +
        (nt ? '<p class="doc-notes"><b>' + esc(T("g.d.notes")) + "</b> " + esc(nt) + "</p>" : "") + "</div><dl>" +
        (c.hasServ ? "<div><dt>" + esc(T("g.service")) + "</dt><dd>" + d2(c.serv) + "</dd></div>" : "") +
        '<div class="doc-grand"><dt>' + esc(T("g.d.grand")) + "</dt><dd>" + d2(c.total) + "</dd></div></dl></section>";
    } else if (nt) h += '<p class="doc-note"><b>' + esc(T("g.d.notes")) + "</b> " + esc(nt) + "</p>";
    h += '<footer class="doc-foot"><p>' + esc(T("g.d.foot1")) + "</p><p>" + esc(BIZ.web) + " · " + esc(T("g.d.foot2")) + "</p></footer>";
    $("#doc").innerHTML = h;
  }

  function showErr(list) {
    $("#formErr").innerHTML = list.length ? "<ul>" + list.map(function (e) { return "<li>" + esc(e) + "</li>"; }).join("") + "</ul>" : "";
  }

  /* texts that are not plain data-i18n nodes */
  function paintStatic() {
    document.title = T("g.title");
    var price = ITEMS[FEATURED] ? ITEMS[FEATURED].price : 16;
    $("#featP").innerHTML = esc(T("g.feat.p", { price: "\u0001" })).replace("\u0001", "<b>" + esc(usd(price)) + "</b>");
    $("#pkHint").textContent = T("g.pk.hint", { price: usd(price) });
  }

  /* ---------- live update ---------- */
  function update() {
    $$("[data-usd]").forEach(function (el) { el.textContent = usd(Number(el.getAttribute("data-usd"))); });
    paintStatic(); paintMode();
    renderPlates(); renderPP(); renderDrinks();
    var c = calc();
    renderCard(c);
    renderDoc(c);
    $("#mTot").textContent = !c.priced ? "—" : usd(c.total);
    return c;
  }

  document.addEventListener("input", function (e) {
    update();
  });
  document.addEventListener("change", function (e) {
    var id = e.target.id;
    if (id === "branch") renderAreas();
    update();
  });
  /* the guest switched language: redraw the lists (dish names) and every text */
  document.addEventListener("langchange", function () {
    renderAreas();
    update(); hours();
  });
  $("#btnPlates").addEventListener("click", function () { go("platos"); });
  $("#btnDrinks").addEventListener("click", function () { go("bebidas"); });
  $("#btnPP").addEventListener("click", function () { go("porpersona"); });
  $("#form").addEventListener("submit", function (e) { e.preventDefault(); });

  $("#btnWa").addEventListener("click", function () {
    var c = update(), errs = c.errs.slice();
    var nmEl = $("#name"), phEl = $("#phone"), ciEl = $("#docid"), dtEl = $("#date"), tmEl = $("#time");
    var bad = {
      name: nmEl.value.trim().length < 2,
      phone: !validPhone(phEl.value),
      docid: !validDocid(ciEl.value),
      date: !validDate(dtEl.value),
      time: !tmEl.value || timePast(dtEl.value, tmEl.value)
    };
    flag(nmEl, bad.name); flag(phEl, bad.phone); flag(ciEl, bad.docid); flag(dtEl, bad.date); flag(tmEl, bad.time && !bad.date);
    var list = [];
    if (bad.name) list.push(T("g.err.name"));
    if (bad.phone) list.push(T("g.err.phone"));
    if (bad.docid) list.push(T("g.err.docid"));
    if (bad.date) list.push(T("g.err.date"));
    else if (bad.time) list.push(tmEl.value ? T("g.err.past") : T("g.err.time"));
    errs = list.concat(errs);
    if (errs.length) {
      showErr(errs);
      (bad.name ? nmEl : bad.phone ? phEl : bad.docid ? ciEl : bad.date ? dtEl : bad.time ? tmEl : $("#people")).focus();
      return;
    }
    var w = waUrl(c), url = w.url;
    showErr(w.trimmed ? [T("g.err.long")] : []);
    var win = window.open(url, "_blank");
    if (!win) location.href = url;
  });
  $("#btnPrint").addEventListener("click", function () { update(); window.print(); });

  /* the quote as a PNG: the same document as the PDF, drawn off screen. The drawing library loads only when it is needed.
     On a phone the share sheet opens (save to the gallery, or send it on WhatsApp); on a computer the file is downloaded. */
  var H2C = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
  function loadH2C() {
    if (window.html2canvas) return Promise.resolve(window.html2canvas);
    return new Promise(function (res, rej) {
      var s = document.createElement("script"); s.src = H2C;
      s.onload = function () { window.html2canvas ? res(window.html2canvas) : rej(new Error("no library")); };
      s.onerror = function () { rej(new Error("library not loaded")); };
      document.head.appendChild(s);
    });
  }
  function saveImage() {
    var btn = $("#btnImg"), label = btn.textContent;
    update();
    btn.disabled = true; btn.textContent = T("g.img.busy"); showErr([]);
    var wrap = document.createElement("div");
    wrap.setAttribute("aria-hidden", "true");
    wrap.style.cssText = "position:fixed;left:-10000px;top:0;width:794px;padding:40px;background:#fff;color:#111;box-sizing:border-box";
    var page = document.createElement("div"); page.className = "doc"; page.style.display = "block"; page.innerHTML = $("#doc").innerHTML;
    wrap.appendChild(page); document.body.appendChild(wrap);
    var slug = $("#name").value.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 30);
    var file = "presupuesto-el-amir-palace" + (slug ? "-" + slug : "") + ".png";
    /* the logo is an SVG without a fixed size, which the drawing library skips: give it one (and its colour) as a data address */
    var logoReady = fetch("logo.svg").then(function (r) { return r.text(); }).then(function (t) {
      var img = page.querySelector(".doc-brand img"); if (!img) return;
      img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(t.replace("<svg ", '<svg width="128" height="128" '));
      return img.decode ? img.decode().catch(function () {}) : null;
    }).catch(function () { /* without the logo the image is still fine */ });
    Promise.all([loadH2C(), document.fonts && document.fonts.ready, logoReady]).then(function (r) {
      return r[0](wrap, { scale: 2, backgroundColor: "#ffffff", useCORS: true, logging: false });
    }).then(function (canvas) {
      return new Promise(function (res) { canvas.toBlob(res, "image/png"); });
    }).then(function (blob) {
      if (!blob) throw new Error("no image");
      var f = typeof File === "function" ? new File([blob], file, { type: "image/png" }) : null;
      if (f && navigator.canShare && navigator.canShare({ files: [f] }) && window.matchMedia("(pointer:coarse)").matches) {
        return navigator.share({ files: [f] }).catch(function (e) { if (!e || e.name !== "AbortError") throw e; });   /* closing the share sheet is not an error */
      }
      var a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = file; document.body.appendChild(a); a.click();
      setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1500);
    }).catch(function () { showErr([T("g.img.fail")]); }).then(function () { wrap.remove(); btn.disabled = false; btn.textContent = label; });
  }
  $("#btnImg").addEventListener("click", saveImage);

  /* footer hours, in the language on screen (same as the reservation page; config.js holds the hours) */
  function hours() {
    var C = typeof CONFIG !== "undefined" ? CONFIG : null, box = $("#ftHours"); if (!box || !C || !C.horario) return;
    var today = new Date().getDay(); box.textContent = "";
    [1, 2, 3, 4, 5, 6, 0].forEach(function (i) {
      var h = C.horario[I.dayKeys[i]], dt = document.createElement("dt"), dd = document.createElement("dd");
      dt.textContent = I.day(i);
      if (h) { var s = document.createElement("span"); s.className = "num"; s.textContent = I.time12(h[0]) + " – " + I.time12(h[1]); dd.appendChild(s); }
      else dd.textContent = T("visit.closed");
      if (i === today) { dt.className = "now"; dd.className = "now"; }
      box.appendChild(dt); box.appendChild(dd);
    });
  }

  /* ---------- start ---------- */
  function init() {
    var today = new Date(), dec = new Date(today.getFullYear(), 11, 19);
    if (dec < today) dec = new Date(today.getFullYear() + 1, 11, 19);
    var dEl = $("#date");
    dEl.min = isoOf(today);
    if (!dEl.value) dEl.value = isoOf(dec);
    var back = restore();
    if (!back && ITEMS[FEATURED]) plates = [plateOf(ITEMS[FEATURED])];   /* the first time: the Plato navideño is already on the list */
    renderAreas();
    if (pending) { /* back from the order page: the selects as they were */
      if (pending.time) $("#time").value = pending.time;
      if ($("#branch").value === "Lechería") $("#area").value = pending.area;
    }
    update(); hours();
    var h = location.hash === "#platos" ? $("#h-pl") : location.hash === "#bebidas" ? $("#h-dr") : location.hash === "#porpersona" ? $("#h-pd") : null;
    if (back && h) h.scrollIntoView({ block: "start" });
    document.documentElement.classList.remove("i18n-wait"); /* the page was held back until the texts were ready (non-Spanish visits) */
  }
  init();
})();
