/* El Amir Palace · prototipo de reservas para grupos de diciembre (sin backend).
   MENU = copia de api/menu.json (nombre, categoría y precio en USD). Solo lectura del sitio. */
(function () {
  "use strict";

  var MENU = [{"id":"entradas-arabes--hummus","cat":"Entradas Árabes","name":"Hummus","price":8},{"id":"entradas-arabes--mutabal","cat":"Entradas Árabes","name":"Mutabal","price":8},{"id":"entradas-arabes--muhammara","cat":"Entradas Árabes","name":"Muhammara","price":8},{"id":"entradas-arabes--labne","cat":"Entradas Árabes","name":"Labne","price":8},{"id":"entradas-arabes--cremas-mixtas","cat":"Entradas Árabes","name":"Cremas mixtas","price":11},{"id":"entradas-arabes--makanek","cat":"Entradas Árabes","name":"Makanek","price":11},{"id":"entradas-arabes--basterma","cat":"Entradas Árabes","name":"Basterma","price":11},{"id":"entradas-arabes--sawda-djaj","cat":"Entradas Árabes","name":"Sawda Djaj","price":11},{"id":"entradas-arabes--garbanzo-con-lomito","cat":"Entradas Árabes","name":"Garbanzo con lomito","price":15},{"id":"entradas-arabes--kibbe-crudo","cat":"Entradas Árabes","name":"Kibbe crudo","price":12},{"id":"entradas-arabes--kibbe-frito","cat":"Entradas Árabes","name":"Kibbe frito","price":12},{"id":"entradas-arabes--kibbe-horneado","cat":"Entradas Árabes","name":"Kibbe horneado","price":13},{"id":"entradas-arabes--falafel","cat":"Entradas Árabes","name":"Falafel","price":8},{"id":"entradas-arabes--falafel-especial","cat":"Entradas Árabes","name":"Falafel especial","price":10},{"id":"entradas-arabes--tabaquitos-de-uva","cat":"Entradas Árabes","name":"Tabaquitos de uva","price":12},{"id":"entradas-arabes--tabaquitos-de-repollo","cat":"Entradas Árabes","name":"Tabaquitos de repollo","price":12},{"id":"entradas-arabes--tabaquitos-mixtos","cat":"Entradas Árabes","name":"Tabaquitos mixtos","price":12},{"id":"entradas-mediterraneas--carpaccio-de-lomito","cat":"Entradas Mediterráneas","name":"Carpaccio de lomito","price":17},{"id":"entradas-mediterraneas--ceviche-de-camaron","cat":"Entradas Mediterráneas","name":"Ceviche de camarón","price":17},{"id":"entradas-mediterraneas--berenjena-frita","cat":"Entradas Mediterráneas","name":"Berenjena frita","price":10},{"id":"entradas-mediterraneas--dedos-de-mozzarella","cat":"Entradas Mediterráneas","name":"Dedos de mozzarella","price":9},{"id":"entradas-mediterraneas--tequenos","cat":"Entradas Mediterráneas","name":"Tequeños","price":9},{"id":"entradas-mediterraneas--papas-fritas","cat":"Entradas Mediterráneas","name":"Papas fritas","price":6},{"id":"sopas-y-cremas--fosforera","cat":"Sopas y Cremas","name":"Fosforera","price":17},{"id":"sopas-y-cremas--sopa-de-pollo-con-vegetales","cat":"Sopas y Cremas","name":"Sopa de pollo con vegetales","price":12},{"id":"sopas-y-cremas--crema-de-pollo","cat":"Sopas y Cremas","name":"Crema de pollo","price":12},{"id":"sopas-y-cremas--crema-de-auyama","cat":"Sopas y Cremas","name":"Crema de auyama","price":12},{"id":"ensaladas--tabbule","cat":"Ensaladas","name":"Tabbule","price":11},{"id":"ensaladas--fattoush","cat":"Ensaladas","name":"Fattoush","price":17},{"id":"ensaladas--libanesa","cat":"Ensaladas","name":"Libanesa","price":15},{"id":"ensaladas--armenia","cat":"Ensaladas","name":"Armenia","price":12},{"id":"ensaladas--yogurt-con-pepino","cat":"Ensaladas","name":"Yogurt con pepino","price":11},{"id":"ensaladas--ensalada-de-cangrejo","cat":"Ensaladas","name":"Ensalada de cangrejo","price":16},{"id":"ensaladas--ensalada-de-burrata","cat":"Ensaladas","name":"Ensalada de burrata","price":17},{"id":"ensaladas--ensalada-cesar","cat":"Ensaladas","name":"Ensalada César","price":13},{"id":"ensaladas--ensalada-cesar-con-pollo","cat":"Ensaladas","name":"Ensalada César con pollo","price":19},{"id":"ensaladas--ensalada-cesar-con-berro-y-pollo","cat":"Ensaladas","name":"Ensalada César con berro y pollo","price":19},{"id":"ensaladas--ensalada-cesar-con-camaron","cat":"Ensaladas","name":"Ensalada César con camarón","price":20},{"id":"ensaladas--rugula-de-la-casa","cat":"Ensaladas","name":"Rúgula de la casa","price":13},{"id":"ensaladas--ensalada-de-palmitos","cat":"Ensaladas","name":"Ensalada de palmitos","price":12},{"id":"ensaladas--ensalada-mixta","cat":"Ensaladas","name":"Ensalada mixta","price":8},{"id":"ensaladas--ensalada-de-camarones","cat":"Ensaladas","name":"Ensalada de camarones","price":16},{"id":"platos-arabes-especiales--fatte","cat":"Platos Árabes Especiales","name":"Fatte","price":15},{"id":"platos-arabes-especiales--fatte-de-berenjena","cat":"Platos Árabes Especiales","name":"Fatte de berenjena","price":15},{"id":"platos-arabes-especiales--plato-mixto","cat":"Platos Árabes Especiales","name":"Plato mixto","price":19},{"id":"platos-arabes-especiales--plato-mixto-con-lomito","cat":"Platos Árabes Especiales","name":"Plato mixto con lomito","price":21},{"id":"platos-arabes-especiales--plato-vegetariano-arabe","cat":"Platos Árabes Especiales","name":"Plato vegetariano árabe","price":18},{"id":"platos-arabes-especiales--plato-de-shawarma","cat":"Platos Árabes Especiales","name":"Plato de shawarma","price":35},{"id":"platos-arabes-especiales--kibbe-al-yogurt","cat":"Platos Árabes Especiales","name":"Kibbe al yogurt","price":17},{"id":"platos-arabes-especiales--arroz-libanes-con-pollo-o-cordero","cat":"Platos Árabes Especiales","name":"Arroz libanés con pollo o cordero","price":19},{"id":"platos-arabes-especiales--bandeja-arabe-2-personas","cat":"Platos Árabes Especiales","name":"Bandeja árabe (2 personas)","price":50},{"id":"platos-arabes-especiales--bandeja-arabe-3-personas","cat":"Platos Árabes Especiales","name":"Bandeja árabe (3 personas)","price":65},{"id":"platos-arabes-especiales--bandeja-arabe-4-personas","cat":"Platos Árabes Especiales","name":"Bandeja árabe (4 personas)","price":75},{"id":"medias-porciones--medio-hummus","cat":"Medias Porciones","name":"Medio hummus","price":4},{"id":"medias-porciones--medio-mutabal","cat":"Medias Porciones","name":"Medio mutabal","price":4},{"id":"medias-porciones--media-muhammara","cat":"Medias Porciones","name":"Media muhammara","price":4},{"id":"medias-porciones--medio-labne","cat":"Medias Porciones","name":"Medio labne","price":6},{"id":"medias-porciones--media-crema-mixta","cat":"Medias Porciones","name":"Media crema mixta","price":6},{"id":"medias-porciones--medio-kibbe-crudo","cat":"Medias Porciones","name":"Medio kibbe crudo","price":6},{"id":"medias-porciones--medio-kibbe-frito","cat":"Medias Porciones","name":"Medio kibbe frito","price":6},{"id":"medias-porciones--medio-kibbe-horneado","cat":"Medias Porciones","name":"Medio kibbe horneado","price":7},{"id":"medias-porciones--medio-falafel","cat":"Medias Porciones","name":"Medio falafel","price":5},{"id":"medias-porciones--medio-tabaquito-de-uva","cat":"Medias Porciones","name":"Medio tabaquito de uva","price":6},{"id":"medias-porciones--medio-tabaquito-de-repollo","cat":"Medias Porciones","name":"Medio tabaquito de repollo","price":6},{"id":"medias-porciones--medio-tabbule","cat":"Medias Porciones","name":"Medio tabbule","price":6},{"id":"medias-porciones--medio-plato-de-shawarma","cat":"Medias Porciones","name":"Medio plato de shawarma","price":18},{"id":"shawarmas-y-sandwiches--shawarma","cat":"Shawarmas y Sándwiches","name":"Shawarma","price":8},{"id":"shawarmas-y-sandwiches--shawarma-especial","cat":"Shawarmas y Sándwiches","name":"Shawarma especial","price":10},{"id":"shawarmas-y-sandwiches--shawarma-super-especial","cat":"Shawarmas y Sándwiches","name":"Shawarma súper especial","price":12},{"id":"shawarmas-y-sandwiches--shawarma-abierto","cat":"Shawarmas y Sándwiches","name":"Shawarma abierto","price":10},{"id":"shawarmas-y-sandwiches--shawarma-especial-abierto","cat":"Shawarmas y Sándwiches","name":"Shawarma especial abierto","price":12},{"id":"shawarmas-y-sandwiches--shawarma-super-especial-abierto","cat":"Shawarmas y Sándwiches","name":"Shawarma súper especial abierto","price":13},{"id":"shawarmas-y-sandwiches--salsa-de-ajo","cat":"Shawarmas y Sándwiches","name":"Salsa de ajo","price":1},{"id":"shawarmas-y-sandwiches--sandwich-de-falafel","cat":"Shawarmas y Sándwiches","name":"Sándwich de falafel","price":8},{"id":"shawarmas-y-sandwiches--fajita","cat":"Shawarmas y Sándwiches","name":"Fajita","price":14},{"id":"shawarmas-y-sandwiches--philadelphia","cat":"Shawarmas y Sándwiches","name":"Philadelphia","price":15},{"id":"shawarmas-y-sandwiches--tawook","cat":"Shawarmas y Sándwiches","name":"Tawook","price":13},{"id":"shawarmas-y-sandwiches--camaron","cat":"Shawarmas y Sándwiches","name":"Camarón","price":14},{"id":"shawarmas-y-sandwiches--lomito","cat":"Shawarmas y Sándwiches","name":"Lomito","price":14},{"id":"shawarmas-y-sandwiches--kebab","cat":"Shawarmas y Sándwiches","name":"Kebab","price":13},{"id":"shawarmas-y-sandwiches--makanek","cat":"Shawarmas y Sándwiches","name":"Makanek","price":13},{"id":"shawarmas-y-sandwiches--higado-de-pollo","cat":"Shawarmas y Sándwiches","name":"Hígado de pollo","price":13},{"id":"shawarmas-y-sandwiches--falafel-especial","cat":"Shawarmas y Sándwiches","name":"Falafel especial","price":10},{"id":"shawarmas-y-sandwiches--kibbe-frito","cat":"Shawarmas y Sándwiches","name":"Kibbe frito","price":11},{"id":"brochetas-y-parrillas--brochetas-el-amir","cat":"Brochetas y Parrillas","name":"Brochetas El Amir","price":65},{"id":"brochetas-y-parrillas--brocheta-de-kafta","cat":"Brochetas y Parrillas","name":"Brocheta de kafta","price":20},{"id":"brochetas-y-parrillas--brocheta-de-pollo","cat":"Brochetas y Parrillas","name":"Brocheta de pollo","price":21},{"id":"brochetas-y-parrillas--brocheta-de-lomito","cat":"Brochetas y Parrillas","name":"Brocheta de lomito","price":24},{"id":"brochetas-y-parrillas--brocheta-mixta","cat":"Brochetas y Parrillas","name":"Brocheta mixta","price":24},{"id":"brochetas-y-parrillas--parrilla-el-amir","cat":"Brochetas y Parrillas","name":"Parrilla El Amir","price":26},{"id":"brochetas-y-parrillas--parrilla-mar-y-tierra","cat":"Brochetas y Parrillas","name":"Parrilla mar y tierra","price":26},{"id":"brochetas-y-parrillas--parrilla-de-mariscos","cat":"Brochetas y Parrillas","name":"Parrilla de mariscos","price":26},{"id":"brochetas-y-parrillas--parrilla-de-pollo","cat":"Brochetas y Parrillas","name":"Parrilla de pollo","price":20},{"id":"brochetas-y-parrillas--parrilla-de-lomito","cat":"Brochetas y Parrillas","name":"Parrilla de lomito","price":24},{"id":"brochetas-y-parrillas--parrilla-mixta","cat":"Brochetas y Parrillas","name":"Parrilla mixta","price":24},{"id":"carnes-y-aves--plato-navideno","cat":"Carnes y Aves","name":"Plato navideño","price":16},{"id":"carnes-y-aves--pollo-a-la-brasa-el-amir","cat":"Carnes y Aves","name":"Pollo a la brasa El Amir","price":34},{"id":"carnes-y-aves--envoltini-de-pollo","cat":"Carnes y Aves","name":"Envoltini de pollo","price":20},{"id":"carnes-y-aves--pollo-a-la-brasa","cat":"Carnes y Aves","name":"Pollo a la brasa","price":17},{"id":"carnes-y-aves--pollo-a-la-canasta","cat":"Carnes y Aves","name":"Pollo a la canasta","price":16},{"id":"carnes-y-aves--tenders-de-pollo-crispy","cat":"Carnes y Aves","name":"Tenders de pollo crispy","price":16},{"id":"carnes-y-aves--suprema-de-pollo-crispy","cat":"Carnes y Aves","name":"Suprema de pollo crispy","price":24},{"id":"carnes-y-aves--filet-mignon","cat":"Carnes y Aves","name":"Filet mignon","price":24},{"id":"carnes-y-aves--cordon-bleu-de-lomito","cat":"Carnes y Aves","name":"Cordon bleu de lomito","price":23},{"id":"carnes-y-aves--cordon-bleu-de-pollo","cat":"Carnes y Aves","name":"Cordon bleu de pollo","price":22},{"id":"carnes-y-aves--centro-de-lomito-a-la-plancha","cat":"Carnes y Aves","name":"Centro de lomito a la plancha","price":20},{"id":"carnes-y-aves--pollo-a-la-milanesa","cat":"Carnes y Aves","name":"Pollo a la milanesa","price":19},{"id":"carnes-y-aves--pollo-al-champinon","cat":"Carnes y Aves","name":"Pollo al champiñón","price":20},{"id":"carnes-y-aves--pollo-a-la-plancha","cat":"Carnes y Aves","name":"Pollo a la plancha","price":16},{"id":"pescados-y-mariscos--mero-en-2-salsas","cat":"Pescados y Mariscos","name":"Mero en 2 salsas","price":22},{"id":"pescados-y-mariscos--mero-a-la-plancha","cat":"Pescados y Mariscos","name":"Mero a la plancha","price":24},{"id":"pescados-y-mariscos--mero-al-ajillo","cat":"Pescados y Mariscos","name":"Mero al ajillo","price":24},{"id":"pescados-y-mariscos--cazuela-de-mariscos","cat":"Pescados y Mariscos","name":"Cazuela de mariscos","price":17},{"id":"pescados-y-mariscos--dynamite-shrimp","cat":"Pescados y Mariscos","name":"Dynamite shrimp","price":21},{"id":"pescados-y-mariscos--camarones-a-la-plancha","cat":"Pescados y Mariscos","name":"Camarones a la plancha","price":20},{"id":"pescados-y-mariscos--camarones-al-ajillo","cat":"Pescados y Mariscos","name":"Camarones al ajillo","price":20},{"id":"pescados-y-mariscos--camarones-rebozados","cat":"Pescados y Mariscos","name":"Camarones rebozados","price":20},{"id":"pescados-y-mariscos--calamares-al-ajillo","cat":"Pescados y Mariscos","name":"Calamares al ajillo","price":18},{"id":"pescados-y-mariscos--calamares-rebozados","cat":"Pescados y Mariscos","name":"Calamares rebozados","price":20},{"id":"pescados-y-mariscos--pulpo-al-grill","cat":"Pescados y Mariscos","name":"Pulpo al grill","price":28},{"id":"pescados-y-mariscos--asopado-de-mariscos-2-personas","cat":"Pescados y Mariscos","name":"Asopado de mariscos (2 personas)","price":50},{"id":"arroces--risotto-al-pesto-con-escalopines-de-pollo","cat":"Arroces","name":"Risotto al pesto con escalopines de pollo","price":19},{"id":"arroces--risotto-con-calabaza-y-calamares-acevichados","cat":"Arroces","name":"Risotto con calabaza y calamares acevichados","price":19},{"id":"arroces--paella-2-personas","cat":"Arroces","name":"Paella (2 personas)","price":50},{"id":"arroces--paella-3-personas","cat":"Arroces","name":"Paella (3 personas)","price":60},{"id":"arroces--paella-4-personas","cat":"Arroces","name":"Paella (4 personas)","price":75},{"id":"arroces--fideua-2-personas","cat":"Arroces","name":"Fideuá (2 personas)","price":50},{"id":"arroces--fideua-3-personas","cat":"Arroces","name":"Fideuá (3 personas)","price":60},{"id":"arroces--fideua-4-personas","cat":"Arroces","name":"Fideuá (4 personas)","price":75},{"id":"arroces--arroz-a-la-marinera-2-personas","cat":"Arroces","name":"Arroz a la marinera (2 personas)","price":50},{"id":"pastas--fettuccine-con-ragu-de-mero","cat":"Pastas","name":"Fettuccine con ragú de mero","price":24},{"id":"pastas--cartoccio-de-lomito","cat":"Pastas","name":"Cartoccio de lomito","price":24},{"id":"pastas--rigatoni-cremoso-con-tocineta-y-champinones","cat":"Pastas","name":"Rigatoni cremoso con tocineta y champiñones","price":20},{"id":"pastas--linguini-con-camarones","cat":"Pastas","name":"Linguini con camarones","price":21},{"id":"pastas--linguini-al-fileto","cat":"Pastas","name":"Linguini al fileto","price":20},{"id":"pastas--linguini-marinera","cat":"Pastas","name":"Linguini marinera","price":21},{"id":"pastas--linguini-carbonara","cat":"Pastas","name":"Linguini carbonara","price":18},{"id":"pastas--pasta-bologna","cat":"Pastas","name":"Pasta bologna","price":11},{"id":"pastas--pasta-napoli","cat":"Pastas","name":"Pasta napoli","price":11},{"id":"pastas--pasticho-tradicional","cat":"Pastas","name":"Pasticho tradicional","price":11},{"id":"hamburguesas--cheeseburger","cat":"Hamburguesas","name":"Cheeseburger","price":13},{"id":"hamburguesas--oh-my-burger","cat":"Hamburguesas","name":"Oh My Burger!","price":13},{"id":"hamburguesas--pollo-crispy","cat":"Hamburguesas","name":"Pollo crispy","price":13},{"id":"hamburguesas--gordon-burger","cat":"Hamburguesas","name":"Gordon burger","price":13},{"id":"batidos-y-yogurt--batido-de-fresa","cat":"Batidos y Yogurt","name":"Batido de fresa","price":4},{"id":"batidos-y-yogurt--batido-de-melon","cat":"Batidos y Yogurt","name":"Batido de melón","price":4},{"id":"batidos-y-yogurt--batido-de-pina","cat":"Batidos y Yogurt","name":"Batido de piña","price":4},{"id":"batidos-y-yogurt--batido-de-melocoton","cat":"Batidos y Yogurt","name":"Batido de melocotón","price":4},{"id":"batidos-y-yogurt--batido-de-guanabana","cat":"Batidos y Yogurt","name":"Batido de guanábana","price":4},{"id":"batidos-y-yogurt--batido-de-lechosa","cat":"Batidos y Yogurt","name":"Batido de lechosa","price":4},{"id":"batidos-y-yogurt--batido-de-parchita","cat":"Batidos y Yogurt","name":"Batido de parchita","price":4},{"id":"batidos-y-yogurt--batido-de-mora","cat":"Batidos y Yogurt","name":"Batido de mora","price":4},{"id":"batidos-y-yogurt--limonada","cat":"Batidos y Yogurt","name":"Limonada","price":4},{"id":"batidos-y-yogurt--limonada-con-hierbabuena","cat":"Batidos y Yogurt","name":"Limonada con hierbabuena","price":4},{"id":"batidos-y-yogurt--merengada-de-frutas","cat":"Batidos y Yogurt","name":"Merengada de frutas","price":6},{"id":"batidos-y-yogurt--yogurt-con-hierbabuena","cat":"Batidos y Yogurt","name":"Yogurt con hierbabuena","price":6},{"id":"batidos-y-yogurt--yogurt-con-frutas","cat":"Batidos y Yogurt","name":"Yogurt con frutas","price":6},{"id":"bebidas--agua-mineral","cat":"Bebidas","name":"Agua mineral","price":1.5},{"id":"bebidas--nestea","cat":"Bebidas","name":"Nestea","price":2},{"id":"bebidas--jarra-de-nestea-x4","cat":"Bebidas","name":"Jarra de Nestea (x4)","price":12},{"id":"bebidas--te-lipton","cat":"Bebidas","name":"Té Lipton","price":3},{"id":"bebidas--gatorade","cat":"Bebidas","name":"Gatorade","price":3},{"id":"bebidas--refresco-de-lata","cat":"Bebidas","name":"Refresco de lata","price":2},{"id":"bebidas--refresco-1l","cat":"Bebidas","name":"Refresco 1L","price":3},{"id":"bebidas--refresco-1-5l","cat":"Bebidas","name":"Refresco 1.5L","price":4},{"id":"bebidas--sparkling","cat":"Bebidas","name":"Sparkling","price":3},{"id":"bebidas--soda","cat":"Bebidas","name":"Soda","price":3},{"id":"bebidas--agua-de-manzana","cat":"Bebidas","name":"Agua de manzana","price":2},{"id":"licores-y-cocteles--cerveza-nacional","cat":"Licores y Cócteles","name":"Cerveza nacional","price":1.5},{"id":"licores-y-cocteles--cerveza-importada","cat":"Licores y Cócteles","name":"Cerveza importada","price":5},{"id":"licores-y-cocteles--copa-de-vino","cat":"Licores y Cócteles","name":"Copa de vino","price":5},{"id":"licores-y-cocteles--botella-de-anis","cat":"Licores y Cócteles","name":"Botella de anís","price":30},{"id":"licores-y-cocteles--botella-de-whisky-8-anos","cat":"Licores y Cócteles","name":"Botella de whisky 8 años","price":45},{"id":"licores-y-cocteles--botella-de-whisky-12-anos","cat":"Licores y Cócteles","name":"Botella de whisky 12 años","price":60},{"id":"licores-y-cocteles--botella-de-whisky-18-anos","cat":"Licores y Cócteles","name":"Botella de whisky 18 años","price":115}];
  var FEATURED = "carnes-y-aves--plato-navideno";
  var DRINK_CATS = ["Bebidas", "Batidos y Yogurt", "Licores y Cócteles"];
  var REF_DRINKS = ["bebidas--refresco-de-lata", "bebidas--nestea", "bebidas--agua-mineral", "batidos-y-yogurt--limonada", "licores-y-cocteles--cerveza-nacional"];
  var TAX = 0.16, SERV = 0.10, PER_TABLE = 8;
  var WA = { "Lechería": "584248060218", "Puerto La Cruz": "584127505025" }; /* mismos números que config.js */
  var MODE_NAMES = { carta: "A. A la carta", presupuesto: "B. Presupuesto por persona", limitado: "C. Menú limitado", paquete: "D. Paquete fijo", exactas: "E. Cantidades exactas" };

  function isDrink(d) { return DRINK_CATS.indexOf(d.cat) !== -1; }
  var ITEMS = {};
  MENU.forEach(function (d) { ITEMS[d.id] = d; });
  /* the featured dish first, then the rest of the menu in site order */
  var ORDER = (ITEMS[FEATURED] ? [ITEMS[FEATURED]] : []).concat(MENU.filter(function (d) { return d.id !== FEATURED; }));

  var S = {};                       /* settings, re-read from the page on every change */
  var selB = {};                    /* presupuesto: options the host ticked (missing = ticked) */
  var selC = {};                    /* menú limitado: items ticked (missing = not ticked) */
  selC[FEATURED] = true;

  /* ---------- helpers ---------- */
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(t) { return String(t).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function r2(n) { return Math.round(n * 100) / 100; }
  function fin(n) { return isFinite(n) ? n : 0; }
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function isoOf(d) { return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }
  var NF = new Intl.NumberFormat("es-VE", { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  var NFB = new Intl.NumberFormat("es-VE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  function usd(n) { var v = r2(fin(n)); return "$" + (v % 1 ? NFB : NF).format(v); }
  function money(n) { var s = usd(n); if (S.bs && S.rate) s += " (Bs " + NFB.format(r2(fin(n) * S.rate)) + ")"; return s; }
  function rng(a, b) { return a === b ? money(a) : money(a) + " a " + money(b); }
  function isOn(map, id, def) { return Object.prototype.hasOwnProperty.call(map, id) ? !!map[id] : def; }
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
  function radio(name) { var r = $('input[name="' + name + '"]:checked'); return r ? r.value : ""; }
  function fmtDate(iso) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return "";
    var d = new Date(iso + "T12:00:00");
    return isNaN(d.getTime()) ? "" : d.toLocaleDateString("es-VE", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  }
  function validPhone(p) { var d = p.replace(/\D/g, ""); return /^\+?[\d\s()\-]+$/.test(p) && d.length >= 7 && d.length <= 15; }
  function validDate(v) { return /^\d{4}-\d{2}-\d{2}$/.test(v) && v >= isoOf(new Date()); }

  /* ---------- settings (the "Opciones del prototipo" panel) ---------- */
  function readSettings() {
    var rateEl = $("#rate"), rate = num(rateEl, 0.0001, 1000000, false), bs = radio("moneda") === "bs";
    S = { iva: radio("iva") || "add", serv: $("#optServicio").checked, scope: radio("scope") || "all", bs: bs, rate: rate };
    flag(rateEl, bs && filled(rateEl) && rate === null);
    $("#rateHint").textContent = bs && rate === null ? "Escribe la tasa para ver los Bs. Mientras tanto se muestran solo dólares." : "";
  }

  /* ---------- lists ---------- */
  function pickRow(id, name, price, on, note) {
    return '<label class="pick"><input type="checkbox" data-pick="' + esc(id) + '"' + (on ? " checked" : "") + '>' +
      '<span class="pick-name">' + esc(name) + (id === FEATURED ? ' <em class="feat">Destacado</em>' : "") + (note ? ' <em class="note">' + esc(note) + "</em>" : "") + "</span>" +
      '<span class="pick-price" data-usd="' + price + '"></span></label>';
  }
  function grp(title, rows) { return '<div class="grp">' + (title ? "<h4>" + esc(title) + "</h4>" : "") + rows + "</div>"; }
  /* the whole menu, featured dish first, then by category */
  function grouped(rowFn) {
    var cats = [], map = {}, html = "";
    ORDER.forEach(function (d) { if (d.id === FEATURED) return; if (!map[d.cat]) { map[d.cat] = []; cats.push(d.cat); } map[d.cat].push(d); });
    if (ITEMS[FEATURED]) html += grp("Destacado", rowFn(ITEMS[FEATURED]));
    cats.forEach(function (c) { html += grp(c, map[c].map(rowFn).join("")); });
    return html;
  }

  /* options that fit a budget per person. Food-only: dishes and drinks that fit, drinks marked "aparte".
     Food + drink: the same, plus combos (dish + one of the reference drinks) whose sum fits. */
  function budgetOptions(b, scope) {
    var out = [];
    ORDER.forEach(function (d) { if (d.price <= b) out.push({ id: d.id, name: d.name, price: d.price, kind: isDrink(d) ? "bebida" : "plato" }); });
    if (scope === "all") {
      ORDER.filter(function (d) { return !isDrink(d); }).forEach(function (d) {
        REF_DRINKS.forEach(function (k) {
          var dr = ITEMS[k];
          if (!dr || d.price + dr.price > b) return;
          out.push({ id: "combo|" + d.id + "|" + k, name: d.name + " + " + dr.name, price: d.price + dr.price, kind: "combo" });
        });
      });
    }
    return out;
  }
  /* default ticks in mode B: single dishes and drinks that fit are offered, combos start unticked (the host adds them) */
  function defOn(o) { return o.id === FEATURED; } /* start with only Plato navideño ticked; host adds the rest */
  function renderBudget() {
    readSettings();
    var box = $("#budgetList"), bEl = $("#budgetPP"), b = num(bEl, 0.01, 5000, false);
    flag(bEl, filled(bEl) && b === null);
    if (b === null) { box.innerHTML = '<p class="hint">Escribe un presupuesto por persona para ver qué platos y bebidas caben.</p>'; return; }
    var opts = budgetOptions(b, S.scope);
    var singles = opts.filter(function (o) { return o.kind !== "combo"; });
    var combos = opts.filter(function (o) { return o.kind === "combo"; });
    var html = '<p class="hint">Con ' + usd(b) + ' por persona caben ' + singles.length + " platos y bebidas" + (S.scope === "all" ? " y " + combos.length + " combos plato + bebida" : "") + ". Desmarca los que no quieres ofrecer y marca los combos que sí.</p>";
    html += grp("Platos y bebidas que caben", singles.map(function (o) {
      return pickRow(o.id, o.name, o.price, isOn(selB, o.id, defOn(o)), o.kind === "bebida" && S.scope === "food" ? "aparte" : "");
    }).join(""));
    if (combos.length) {
      html += '<details class="combos"><summary>Combos plato + bebida (' + combos.length + ")</summary>" +
        grp("", combos.map(function (o) { return pickRow(o.id, o.name, o.price, isOn(selB, o.id, defOn(o)), ""); }).join("")) + "</details>";
    }
    box.innerHTML = html;
  }
  function renderLimit() { $("#limitList").innerHTML = grouped(function (d) { return pickRow(d.id, d.name, d.price, isOn(selC, d.id, false), ""); }); }
  function renderExact() {
    $("#exactList").innerHTML = grouped(function (d) {
      return '<div class="qrow"><span class="qname">' + esc(d.name) + '</span><span class="pick-price" data-usd="' + d.price + '"></span>' +
        '<input type="number" inputmode="numeric" min="0" max="999" step="1" value="0" data-qty="' + esc(d.id) + '" aria-label="Cantidad de ' + esc(d.name) + '"></div>';
    });
  }
  function buildDrinkSelect() {
    $("#pkDrink").innerHTML = ORDER.filter(function (d) { return d.cat === "Bebidas"; }).map(function (d) {
      return '<option value="' + esc(d.id) + '"' + (d.id === "bebidas--refresco-de-lata" ? " selected" : "") + ">" + esc(d.name) + " (" + usd(d.price) + ")</option>";
    }).join("");
  }
  function setAll(sel, map, v) {
    $$(sel + " input[data-pick]").forEach(function (i) { i.checked = v; map[i.getAttribute("data-pick")] = v; });
    update();
  }

  /* ---------- the quote (presupuesto) ---------- */
  function totals(sub) {
    sub = r2(fin(sub));
    var serv = S.serv ? r2(sub * SERV) : 0, base = r2(sub + serv), iva, total;
    if (S.iva === "incl") { total = base; iva = r2(base - base / (1 + TAX)); }   /* prices already carry IVA */
    else { iva = r2(base * TAX); total = r2(base + iva); }                         /* IVA on top */
    return { sub: sub, serv: serv, iva: iva, total: total };
  }
  function toOpt(d) { return { id: d.id, name: d.name, price: d.price, kind: isDrink(d) ? "bebida" : "plato" }; }

  function calc() {
    var mode = radio("modo"), errs = [], warn = [], lines = [], opts = [];
    var pEl = $("#people"), people = num(pEl, 1, 300, true), N = people || 0;
    flag(pEl, people === null);
    if (people === null) errs.push("El número de personas debe ser un entero entre 1 y 300.");
    else if (people < 20 || people > 40) warn.push("Pensado para 20 a 40 personas. Con " + people + " conviene confirmar la mesa con el restaurante.");
    var lo = 0, hi = 0, hasTotal = true;

    if (mode === "carta") {
      var cEl = $("#cartaBudget"), est = num(cEl, 0.01, 5000, false);
      flag(cEl, filled(cEl) && est === null);
      if (est === null) { hasTotal = false; warn.push("Sin estimado: el total no se calcula, cada invitado paga su consumo."); }
      else { lines.push({ label: "Estimado por persona", detail: money(est) + " × " + N + " personas", amount: est * N }); lo = hi = est * N; }
    }

    else if (mode === "presupuesto") {
      var bEl = $("#budgetPP"), b = num(bEl, 0.01, 5000, false);
      flag(bEl, filled(bEl) && b === null);
      if (b === null) errs.push("Escribe el presupuesto por persona (mayor a 0).");
      else {
        opts = budgetOptions(b, S.scope).filter(function (o) { return isOn(selB, o.id, defOn(o)); });
        lines.push({ label: "Presupuesto por persona", detail: (S.scope === "food" ? "cubre solo comida" : "cubre comida y bebida") + " · " + money(b) + " × " + N + " personas", amount: b * N });
        lo = hi = b * N;
        if (!opts.length) errs.push("No marcaste ninguna opción para los invitados.");
      }
    }

    else if (mode === "limitado") {
      opts = ORDER.filter(function (d) { return isOn(selC, d.id, false); }).map(toOpt);
      if (!opts.length) errs.push("Marca al menos un plato o bebida.");
      else {
        var ps = opts.map(function (o) { return o.price; });
        var mn = Math.min.apply(null, ps), mx = Math.max.apply(null, ps);
        lines.push({ label: "Rango por persona (más barato a más caro que marcaste)", detail: rng(mn, mx) + " por persona", amount: null });
        lo = mn * N; hi = mx * N;
      }
    }

    else if (mode === "paquete") {
      var plEl = $("#pkPlato"), dqEl = $("#pkDrinkQty"), nwEl = $("#pkWine"), tbEl = $("#pkTables"), wpEl = $("#pkWinePrice");
      var pl = num(plEl, 0, 10, true), dq = num(dqEl, 0, 10, true), nW = num(nwEl, 0, 999, true), tb = num(tbEl, 1, 300, true), wp = num(wpEl, 0, 100000, false);
      flag(plEl, pl === null); flag(dqEl, dq === null); flag(nwEl, nW === null); flag(tbEl, tb === null); flag(wpEl, filled(wpEl) && wp === null);
      if (pl === null || dq === null || nW === null || tb === null) errs.push("Revisa las cantidades del paquete (números enteros).");
      var plato = ITEMS[FEATURED], dk = ITEMS[$("#pkDrink").value] || ITEMS["bebidas--refresco-de-lata"];
      var platoQ = pl || 0, drinkQ = dq || 0, wine = nW || 0, tables = tb || 0;
      var unit = radio("pkWineUnit") || "mesa", bottles = unit === "mesa" ? wine * tables : wine;
      if (plato) lines.push({ label: plato.name, detail: platoQ + " por persona × " + N + " personas", amount: platoQ * plato.price * N });
      lines.push({ label: dk.name, detail: drinkQ + " por persona × " + N + " personas", amount: drinkQ * dk.price * N });
      if (wine > 0) {
        if (wp === null) warn.push("La botella de vino no está en la carta: escribe su precio para sumarla al total.");
        lines.push({ label: "Botellas de vino", detail: bottles + " botella(s): " + (unit === "mesa" ? wine + " por mesa × " + tables + " mesas" : "en total") + (wp === null ? " · precio por confirmar" : " · " + money(wp) + " c/u"), amount: bottles * (wp || 0) });
      }
      lo = hi = lines.reduce(function (s, l) { return s + fin(l.amount); }, 0);
    }

    else if (mode === "exactas") {
      $$("#exactList input[data-qty]").forEach(function (i) {
        var q = num(i, 0, 999, true);
        flag(i, filled(i) && q === null);
        if (q === null || q === 0) return;
        var d = ITEMS[i.getAttribute("data-qty")];
        lines.push({ label: d.name, detail: q + " × " + money(d.price), amount: q * d.price });
        lo += q * d.price;
      });
      hi = lo;
      if (!lines.length) errs.push("Escribe la cantidad de al menos un plato o bebida.");
    }

    if (mode === "presupuesto" || mode === "limitado") warn.push("Precios de la carta vigente. El restaurante confirma el presupuesto final.");
    return { mode: mode, N: N, lines: lines, opts: opts, errs: errs, warn: warn, hasTotal: hasTotal, tLo: totals(lo), tHi: totals(hi) };
  }

  function renderCard(c) {
    var t = c.tLo, u = c.tHi, ds = fmtDate($("#date").value), nm = $("#name").value.trim(), ph = $("#phone").value.trim();
    $("#qClient").innerHTML = "<p><b>" + esc(nm || "Sin nombre") + "</b> · " + esc(ph || "sin teléfono") + "</p>" +
      "<p>" + esc(ds || "Sin fecha") + " · " + (c.N ? c.N + " personas" : "personas sin definir") + "</p>" +
      "<p>" + esc($("#branch").value) + " · " + esc(MODE_NAMES[c.mode] || "") + "</p>";
    $("#qLines").innerHTML = c.lines.length ? c.lines.map(function (l) {
      return "<li><span>" + esc(l.label) + "<small>" + esc(l.detail) + "</small></span>" + (l.amount === null ? "" : "<b>" + esc(money(l.amount)) + "</b>") + "</li>";
    }).join("") : '<li class="empty">Aún no hay líneas de precio.</li>';
    $("#qOpts").innerHTML = c.opts.length ? "<h3>Opciones para los invitados (" + c.opts.length + ")</h3><ul class=\"q-opts\">" +
      c.opts.map(function (o) { return "<li><span>" + esc(o.name) + "</span><b>" + esc(money(o.price)) + "</b></li>"; }).join("") + "</ul>" : "";
    if (!c.N) {
      $("#qTot").innerHTML = '<p class="q-none">Escribe el número de personas para calcular el total.</p>';
    } else if (!c.hasTotal) {
      $("#qTot").innerHTML = '<p class="q-none">Sin total: cada invitado paga su consumo.</p>';
    } else {
      $("#qTot").innerHTML = '<dl class="q-tot">' +
        "<div><dt>Subtotal</dt><dd>" + rng(t.sub, u.sub) + "</dd></div>" +
        (S.serv ? "<div><dt>Servicio 10%</dt><dd>" + rng(t.serv, u.serv) + "</dd></div>" : "") +
        "<div><dt>" + (S.iva === "incl" ? "IVA 16% incluido" : "IVA 16%") + "</dt><dd>" + rng(t.iva, u.iva) + "</dd></div>" +
        '<div class="grand"><dt>Total</dt><dd>' + rng(t.total, u.total) + "</dd></div>" +
        (c.N ? "<div><dt>Por persona</dt><dd>" + rng(r2(t.total / c.N), r2(u.total / c.N)) + "</dd></div>" : "") +
        "</dl>";
    }
    $("#qWarn").innerHTML = c.errs.map(function (e) { return '<p class="q-msg err">' + esc(e) + "</p>"; }).join("") +
      c.warn.map(function (w) { return '<p class="q-msg">' + esc(w) + "</p>"; }).join("");
  }

  function buildMessage(c) {
    var L = ["*Reserva de grupo - El Amir Palace*", "",
      "Sucursal: " + $("#branch").value, "Modo: " + (MODE_NAMES[c.mode] || ""),
      "Nombre: " + $("#name").value.trim(), "Teléfono: " + $("#phone").value.trim(),
      "Fecha: " + fmtDate($("#date").value), "Personas: " + c.N];
    var nt = $("#notes").value.trim();
    if (nt) L.push("Notas: " + nt);
    L.push("", "*Detalle*");
    c.lines.forEach(function (l) { L.push("- " + l.label + " (" + l.detail + ")" + (l.amount === null ? "" : ": " + money(l.amount))); });
    if (c.opts.length) { /* names only, to keep the WhatsApp link short; the prices are in the detail above */
      var plain = c.opts.filter(function (o) { return o.kind !== "combo"; }), cb = c.opts.filter(function (o) { return o.kind === "combo"; });
      L.push("", "*Opciones que pueden elegir los invitados (" + c.opts.length + ")*");
      if (plain.length) L.push("Platos y bebidas: " + plain.map(function (o) { return o.name; }).join(", "));
      if (cb.length) L.push("Combos: " + cb.map(function (o) { return o.name; }).join(", "));
    }
    L.push("", "*Totales*");
    if (!c.hasTotal) L.push("Sin total: cada invitado paga su consumo.");
    else {
      var t = c.tLo, u = c.tHi;
      L.push("Subtotal: " + rng(t.sub, u.sub));
      if (S.serv) L.push("Servicio 10%: " + rng(t.serv, u.serv));
      L.push((S.iva === "incl" ? "IVA 16% incluido: " : "IVA 16%: ") + rng(t.iva, u.iva));
      L.push("*Total: " + rng(t.total, u.total) + "*");
      if (c.N) L.push("Por persona: " + rng(r2(t.total / c.N), r2(u.total / c.N)));
    }
    L.push("", "Precios en dólares" + (S.bs && S.rate ? " con equivalente en Bs a tasa " + S.rate : "") + ". Presupuesto sujeto a confirmación del restaurante.");
    return L.join("\n");
  }

  function showErr(list) {
    $("#formErr").innerHTML = list.length ? "<ul>" + list.map(function (e) { return "<li>" + esc(e) + "</li>"; }).join("") + "</ul>" : "";
  }

  /* ---------- live update ---------- */
  function update() {
    readSettings();
    $$("[data-usd]").forEach(function (el) { el.textContent = money(Number(el.getAttribute("data-usd"))); });
    var tb = $("#pkTables"), pv = num($("#people"), 1, 300, true);
    if (tb.getAttribute("data-auto") === "1") tb.value = String(Math.max(1, Math.ceil((pv || 0) / PER_TABLE)));
    var mode = radio("modo");
    $$(".panel").forEach(function (p) { p.hidden = p.getAttribute("data-mode") !== mode; });
    var c = calc();
    renderCard(c);
    return c;
  }

  document.addEventListener("input", function (e) {
    var t = e.target;
    if (t.id === "budgetPP") renderBudget();
    if (t.id === "pkTables") t.setAttribute("data-auto", "0");
    update();
  });
  document.addEventListener("change", function (e) {
    var t = e.target;
    if (t.matches && t.matches("[data-pick]")) {
      var map = t.closest("#budgetList") ? selB : selC;
      map[t.getAttribute("data-pick")] = t.checked;
    }
    if (t.name === "scope") renderBudget();
    update();
  });
  $("#budgetAll").addEventListener("click", function () { setAll("#budgetList", selB, true); });
  $("#budgetNone").addEventListener("click", function () { setAll("#budgetList", selB, false); });
  $("#limitAll").addEventListener("click", function () { setAll("#limitList", selC, true); });
  $("#limitNone").addEventListener("click", function () { setAll("#limitList", selC, false); });
  $("#form").addEventListener("submit", function (e) { e.preventDefault(); });

  $("#btnWa").addEventListener("click", function () {
    var c = update(), errs = c.errs.slice();
    var nmEl = $("#name"), phEl = $("#phone"), dtEl = $("#date");
    var nm = nmEl.value.trim(), ph = phEl.value.trim(), dt = dtEl.value;
    var badName = !nm, badPhone = !validPhone(ph), badDate = !validDate(dt);
    flag(nmEl, badName); flag(phEl, badPhone); flag(dtEl, badDate);
    if (badDate) errs.unshift("Elige una fecha desde hoy.");
    if (badPhone) errs.unshift("Escribe un teléfono válido (al menos 7 dígitos).");
    if (badName) errs.unshift("Escribe el nombre de quien reserva.");
    if (errs.length) {
      showErr(errs);
      (badName ? nmEl : badPhone ? phEl : badDate ? dtEl : $("#people")).focus();
      return;
    }
    var url = "https://wa.me/" + (WA[$("#branch").value] || WA["Lechería"]) + "?text=" + encodeURIComponent(buildMessage(c));
    showErr(url.length > 3500 ? ["Aviso: el mensaje es muy largo y WhatsApp podría cortarlo. Reduce la lista o imprime el presupuesto."] : []);
    var win = window.open(url, "_blank");
    if (!win) location.href = url;
  });
  $("#btnPrint").addEventListener("click", function () { update(); window.print(); });

  /* ---------- start ---------- */
  function init() {
    var today = new Date(), dec = new Date(today.getFullYear(), 11, 19);
    if (dec < today) dec = new Date(today.getFullYear() + 1, 11, 19);
    var dEl = $("#date");
    dEl.min = isoOf(today);
    if (!dEl.value) dEl.value = isoOf(dec);
    buildDrinkSelect();
    renderBudget(); renderLimit(); renderExact();
    update();
  }
  init();
})();
