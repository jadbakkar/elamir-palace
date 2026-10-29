/* =====================================================================
   EL AMIR PALACE · CARTA (pedir.html)
   El dueño edita SOLO este archivo para cambiar platos, precios o descripciones.
   Formato: ["Categoría", "nota", [ ["Plato", precioUSD, "descripción", opciones?], ... ]]
   Después de editar:
     1) node scripts/prerender-menu.js   (actualiza el HTML estático para Google/IA)
     2) en la consola del navegador: I18N.missing(MENU)  (platos sin traducir)
   ===================================================================== */
const OPT_SH = {label:"Proteína", choices:["Pollo","Carne","Mixto"]};
const OPT_ARROZ = {label:"Proteína", choices:["Pollo","Cordero"]};
const OPT_BAT = {label:"Preparación", choices:["En agua","En leche"]};
/* Shawarma especial / súper especial: el cliente elige 1 o 2 extras incluidos (6º dato del plato); aparte = puede pedirlos fuera del pan */
const EXTRAS_SH = ["Crema de berenjena","Crema de garbanzo","Crema de pimentón","Falafel","Kibbe frito","Papas fritas","Tabbule","Tabaquitos de uva","Tabaquitos de repollo"];
const PICK = (n, aparte) => ({label: n > 1 ? "Elige 2 extras" : "Elige 1 extra", n, items: EXTRAS_SH, aparte: !!aparte});
/* Platos "con 2 contornos": el cliente elige sus 2 contornos (incluidos). Se asigna abajo, junto a los adicionales. */
const CONTORNOS_2 = {label:"Elige 2 contornos", n:2, items:["Papas fritas","Papas bravas","Papas rústicas","Puré","Vegetales al vapor","Ensalada mixta","Arroz"]};
const OPT_SALSA_TENDERS = {label:"Salsa", choices:["Salsa rosa","Sweet chili"]};
/* Extras opcionales (5º dato del plato): el cliente marca los que quiera y se suman al precio. Precios: CONFIRMAR con el cliente. */
const ADDON = {
  papas:["Papas fritas",6], hummus:["Hummus",8], tabbule:["Tabbule",11], camaron:["Camarón",7],
  kafta:["Pincho de kafta",8], lomito:["Pincho de lomito",8], pollo:["Pincho de pollo",8], tocineta:["Tocineta",4],
  veg:["Vegetales salteados",5], arroz:["Arroz",4], shCarne:["Carne de shawarma",5], shPollo:["Pollo de shawarma",5]
};
const ADD = (...keys) => ({label:"Adicionales", items:keys.map(k => ADDON[k])});
const PROTEINAS = ["pollo","lomito","kafta","camaron","shCarne","shPollo"];
const EXTRA_SIDES = ADD(...Object.keys(ADDON));   /* lista completa (la usan algunos platos del MENU; abajo se reemplaza por la de su categoría) */
const MENU = [
 ["Entradas Árabes","Por ración",[
  ["Hummus",8,"Crema de garbanzos"],["Mutabal",8,"Crema de berenjenas"],["Muhammara",8,"Crema de pimentón"],["Labne",8,"Crema de yogurt"],
  ["Cremas mixtas",11,"Selección especial de cremas de la casa."],["Makanek",11,"Salchicha árabe"],["Basterma",11,"Carne curada"],["Sawda Djaj",11,"Hígado de pollo"],
  ["Garbanzo con lomito",15,"Garbanzos acompañados con jugoso lomito."],["Kibbe crudo",12],["Kibbe frito",12],["Kibbe horneado",13,"Kibbe horneado con especias tradicionales."],["Falafel",8,"Croquetas crujientes de garbanzo con especias."],["Falafel especial",10,"Falafel servido con toques y acompañantes especiales de la casa."],
  ["Tabaquitos de uva",12,"Hojas de uva rellenas de arroz y carne sazonada."],["Tabaquitos de repollo",12,"Hojas de repollo rellenas de arroz y carne sazonada."],["Tabaquitos mixtos",12,"Combinación de tabaquitos de uva y repollo."]]],
 ["Entradas Mediterráneas","",[
  ["Carpaccio de lomito",17,"Láminas de lomito con especias, confit de cherry, rúgula, champiñones, parmesano, sal ahumada y pesto"],
  ["Ceviche de camarón",17,"Con crema de ají amarillo y toques cítricos, casabitos tostados y chips de plátano"],
  ["Berenjena frita",10,"Rebozadas, con queso de cabra y miel de pepperoncini"],["Dedos de mozzarella",9,"Crujientes dedos de queso mozzarella empanizados."],["Tequeños",9,"8 unidades"],["Papas fritas",6,"Porción de papas fritas crujientes."]]],
 ["Sopas y Cremas","",[
  ["Fosforera",17,"Sofrito criollo, camarones, calamares, pulpo y conchas con aceite ahumado de ají dulce"],
  ["Sopa de pollo con vegetales",12,"Aromática con vegetales frescos"],["Crema de pollo",12,"Velouté cremosa del chef"],
  ["Crema de auyama",12,"Auyama rostizada, ají dulce y tropezones de mozzarella frita"]]],
 ["Ensaladas","",[
  ["Tabbule",11,"Ensalada tradicional de perejil, tomate, cebolla, trigo y limón."],["Fattoush",17,"Mezcla de vegetales frescos con pan árabe frito y aderezo de sumac."],["Libanesa",15,"Lechuga, tomate, cebolla, perejil, pimentón, hierbabuena, pepino, rábano y aderezo de limón de la casa"],
  ["Armenia",12,"Vegetales frescos con salsa balsámica"],["Yogurt con pepino",11],["Ensalada de cangrejo",16,"Cangrejo mezclado con vegetales y aderezo especial."],
  ["Ensalada de burrata",17,"Rúgula, nueces, jamón serrano, cherry y burrata con reducción de balsámico"],
  ["Ensalada César",13,"Clásica ensalada con lechuga, crutones, queso parmesano y aderezo César."],["Ensalada César con pollo",19,"Ensalada César acompañada de jugosos trozos de pollo."],["Ensalada César con berro y pollo",19,"Variación de la ensalada César con berro fresco y pollo."],["Ensalada César con camarón",20,"Ensalada César servida con camarones salteados."],
  ["Rúgula de la casa",13,"Ensalada de rúgula fresca con aderezo especial de la casa."],["Ensalada de palmitos",12,"Palmitos frescos con aderezo y vegetales seleccionados."],["Ensalada mixta",8,"Variedad de vegetales frescos de temporada."],["Ensalada de camarones",16,"Camarones acompañados de vegetales y aderezo especial."]]],
 ["Platos Árabes Especiales","",[
  ["Fatte",15,"Carne molida, garbanzo y pan frito al yogurt con almendras"],["Fatte de berenjena",15,"Carne molida, garbanzo, berenjena y pan frito al yogurt con almendras"],
  ["Plato mixto",19,"1 pincho de pollo, 1 kibbe, tabaquitos, 2 falafel, cremas mixtas, tabbule y makanek"],
  ["Plato mixto con lomito",21,"1 pincho de lomito, 1 kibbe, tabaquitos, 2 falafel, cremas mixtas, tabbule y makanek"],
  ["Plato vegetariano árabe",18,"Tabbule, arroz blanco, falafel, vegetales salteados y cremas mixtas"],
  ["Plato de shawarma",35,"Carne y pollo tipo shawarma, vegetales, pepinillos, nabos, crema de ajo y tahini"],
  ["Kibbe al yogurt",17,"5 unidades de kibbe al yogurt"],["Arroz libanés con pollo o cordero",19,"Con frutos secos y pan frito",OPT_ARROZ],
  ["Bandeja árabe (2 personas)",50,"Pinchos de pollo y lomito, tabbule, tabaquitos, makanek, kibbes, falafel y cremas mixtas"],
  ["Bandeja árabe (3 personas)",65,"3 pinchos, 4 kibbe fritos, 8 tabaquitos, 4 falafel, makanek, kibbe crudo y horneado, tabbule, cremas"],
  ["Bandeja árabe (4 personas)",75,"4 pinchos, 6 kibbes fritos, 6 falafel, 10 tabaquitos, makanek, kibbe crudo y horneado, tabbule, cremas"]]],
 ["Shawarmas y Sándwiches","Todos los sándwiches vienen con papas fritas",[
  ["Shawarma",8,"Proteína de tu preferencia y vegetales tradicionales",OPT_SH],["Shawarma especial",10,"Con 1 ingrediente extra (tabbule, falafel, pimentones…)",OPT_SH,null,PICK(1,true)],
  ["Shawarma súper especial",12,"Con 2 ingredientes extra",OPT_SH,null,PICK(2,true)],["Shawarma abierto",10,"Servido abierto en plato con la proteína de tu preferencia y vegetales.",OPT_SH],["Shawarma especial abierto",12,"Servido abierto en plato con vegetales tradicionales y un ingrediente especial extra.",OPT_SH,null,PICK(1)],["Shawarma súper especial abierto",13,"Servido abierto en plato con vegetales tradicionales y dos ingredientes especiales extra.",OPT_SH,null,PICK(2)],
  ["Sándwich de falafel",8,"Croquetas de falafel y vegetales tradicionales"],
  ["Fajita",14,"Salsa de aguacate, pimentón, cebolla, mozzarella, pollo"],["Philadelphia",15,"Salsa de aguacate, pimentón, cebolla, mozzarella, carne"],
  ["Tawook",13,"Pollo a la brasa, salsa de ajo, pepinillo, papas"],["Camarón",14,"Camarón, lechuga, pepinillo, salsa rosada"],
  ["Lomito",14,"Lomito a la brasa, crema de garbanzo, cebolla, perejil, tomate, pepinillo"],["Kebab",13,"Kebab a la brasa, crema de garbanzo, vegetales"],
  ["Makanek",13,"Salchicha árabe, ajo, tomate, limón, pepinillo"],["Hígado de pollo",13,"Hígado de pollo, papas, ajo, granadina"],
  ["Falafel especial",10,"Croquetas de falafel con ingredientes especiales y papas fritas."],["Kibbe frito",11,"Sándwich de kibbe frito acompañado de papas fritas."]]],
 ["Brochetas y Parrillas","",[
  ["Brochetas El Amir",65,"2 pinchos de pollo, 3 de kafta, 2 de lomito, 8 alas, 8 makanek, vegetales a la brasa, papas y pan"],
  ["Brocheta de kafta",20,"Pinchos de carne molida sazonada a la brasa."],["Brocheta de pollo",21,"Pinchos de pechuga de pollo marinada a la brasa.",null,EXTRA_SIDES],["Brocheta de lomito",24,"Pinchos de lomito tierno a la brasa."],["Brocheta mixta",24],
  ["Parrilla El Amir",26,"Pechuga, churrasco de lomito, 2 ruedas de kafta, makanek y papas"],
  ["Parrilla mar y tierra",26,"Parrilla de carnes y mariscos."],["Parrilla de mariscos",26,"Parrilla con mariscos variados."],["Parrilla de pollo",20,"Parrilla con pollo.",null,EXTRA_SIDES],["Parrilla de lomito",24,"Parrilla con lomito."],["Parrilla mixta",24,"Parrilla con pollo y lomito."]]],
 ["Carnes y Aves","Acompañados con 2 contornos: papas fritas, bravas, rústicas, puré, vegetales al vapor, ensalada mixta o arroz",[
  ["Pollo a la brasa El Amir",34,"Con chorizos, pimentones asados, papas, ensalada rallada y arroz especial"],
  ["Envoltini de pollo",20,"Relleno de espinaca, pimentón y mozzarella con salsa de ajo porro"],["Pollo a la brasa",17,"300 g de pechuga deshuesada"],
  ["Pollo a la canasta",16,"Escalopines empanizados con papas"],["Tenders de pollo crispy",16,"Con salsa rosa o sweet chili y papas",OPT_SALSA_TENDERS],
  ["Suprema de pollo crispy",24,"300 g en salsa blanca con camarones"],["Filet mignon",24,"Lomito con tocineta y salsa de champiñones"],
  ["Cordon bleu de lomito",23,"Lomito relleno de jamón y queso, empanizado, con salsa blanca."],["Cordon bleu de pollo",22,"Pollo relleno de jamón y queso, empanizado, con salsa blanca."],["Centro de lomito a la plancha",20,"300 g"],
  ["Pollo a la milanesa",19,"Gratinado con mozzarella, parmesano y salsa napoli"],["Pollo al champiñón",20,"Pechuga de pollo en salsa de champiñones."],["Pollo a la plancha",16,"300 g de pechuga"]]],
 ["Pescados y Mariscos","",[
  ["Mero en 2 salsas",22,"Al carbón con salsa de alcaparras y amatriciana"],["Mero a la plancha",24],["Mero al ajillo",24],
  ["Cazuela de mariscos",17],["Dynamite shrimp",21,"Cóctel de camarones con toques asiáticos y papas"],
  ["Camarones a la plancha",20,"Con 2 contornos"],["Camarones al ajillo",20,"Con 2 contornos"],["Camarones rebozados",20,"Con 2 contornos"],
  ["Calamares al ajillo",18,"Con 2 contornos"],["Calamares rebozados",20,"Con 2 contornos"],["Langostinos",25,"Con 2 contornos"],
  ["Pulpo al grill",28,"Con chimichurri"],["Asopado de mariscos (2 personas)",50],["Arroz a la marinera",50]]],
 ["Arroces","",[
  ["Risotto al pesto con escalopines de pollo",19],["Risotto con calabaza y calamares acevichados",19],
  ["Paella (2 personas)",50],["Paella (3 personas)",60],["Paella (4 personas)",75],
  ["Fideuá (2 personas)",50],["Fideuá (3 personas)",60],["Fideuá (4 personas)",75]]],
 ["Pastas","",[
  ["Fettuccine con ragú de mero",24],["Cartoccio de lomito",24,"Linguini en salsa blanca con lomito en salsa de champiñones"],
  ["Rigatoni cremoso con tocineta y champiñones",20,"Rigatoni en salsa blanca con tomates cherry confitados, champiñones, tocineta ahumada, toques de pesto y pimentón rostizado."],["Linguini con camarones",21,"Linguini en delicada salsa acompañado de camarones."],["Linguini al fileto",20,"Linguini en salsa de tomates frescos y albahaca."],["Linguini marinera",21,"Linguini con variedad de mariscos de la casa."],
  ["Linguini carbonara",18,"Linguini con cremosa salsa carbonara y tocineta."],["Pasta bologna",11,"Pasta con salsa de carne y tomate."],["Pasta napoli",11,"Pasta con salsa clásica de tomate y hierbas."],["Pasticho tradicional",11,"Capas de pasta rellenas de carne molida, salsa bechamel y queso."]]],
 ["Hamburguesas","Todas vienen con papas fritas",[
  ["Cheeseburger",13,"150 g de solomo, pan de mantequilla, mozzarella frita y salsa rosa"],
  ["Oh My Burger!",13,"150 g de solomo, mozzarella frita, mermelada de pimentón y tocineta"],
  ["Pollo crispy",13,"Pollo frito crocante, tocineta, queso americano y mostaza miel"],["Gordon burger",13,"Pollo crispy relleno de jamón y queso, tocineta y salsa de la casa"]]],
 ["Batidos y Yogurt","",[
  ["Batido de fresa",4,"",OPT_BAT],["Batido de melón",4,"",OPT_BAT],["Batido de piña",4,"",OPT_BAT],["Batido de melocotón",4,"",OPT_BAT],["Batido de guanábana",4,"",OPT_BAT],["Batido de lechosa",4,"",OPT_BAT],
  ["Batido de parchita",4,"",OPT_BAT],["Batido de mora",4,"",OPT_BAT],["Limonada",4],["Limonada con hierbabuena",4],["Merengada de frutas",6],
  ["Yogurt con hierbabuena",6],["Yogurt con frutas",6]]],
 ["Bebidas","",[
  ["Agua mineral",1.5,"Agua mineral embotellada."],["Nestea",2],["Jarra de Nestea (x4)",12],["Té Lipton",3,"Té frío Lipton de limón, 500 ml."],["Gatorade",3,"Bebida hidratante deportiva."],["Refresco de lata",2,"Refresco variado en lata."],
  ["Refresco 1L",3,"Refresco variado en botella de 1 litro."],["Refresco 1.5L",4],["Sparkling",3],["Soda",3]]],
 ["Licores y Cócteles","Solo mayores de edad",[
  ["Cerveza nacional",1.5],["Cerveza importada",5],["Copa de vino",5],["Botella de anís",30],
  ["Botella de whisky 8 años",45],["Botella de whisky 12 años",60],["Botella de whisky 18 años",115]]]
];
const DRINK_CATS = ["Batidos y Yogurt","Bebidas","Licores y Cócteles"];
/* Adicionales por categoría (las que no aparecen aquí: sin adicionales — entradas, sopas, bebidas).
   Sin tocineta en la comida árabe; sin arroz en arroces. Un plato nunca se ofrece a sí mismo como adicional. */
const PRINCIPAL = ADD("papas","arroz","veg","hummus","tabbule",...PROTEINAS);
const EXTRAS_POR_CATEGORIA = {
  "Ensaladas": ADD("pollo","camaron","shCarne","shPollo"),
  "Platos Árabes Especiales": PRINCIPAL,
  "Shawarmas y Sándwiches": PRINCIPAL,
  "Brochetas y Parrillas": PRINCIPAL,
  "Carnes y Aves": PRINCIPAL,
  "Pescados y Mariscos": PRINCIPAL,
  "Arroces": ADD(...PROTEINAS),
  "Pastas": ADD("camaron","pollo","lomito","tocineta","veg"),
  "Hamburguesas": ADD("papas","tocineta","veg")
};
/* excepciones por plato (nombre exacto o que empiece por…) */
const EXTRAS_POR_PLATO = [
  [/^Ensalada César/, ADD("pollo","camaron","shCarne","shPollo","tocineta")],
  /* Plato mixto: solo pinchos extra (shish taouk / kafta / lahme) */
  [/^Plato mixto$/, ADD("pollo","kafta","lomito")],
  /* shawarmas: sin adicionales, solo quitar ingredientes (gratis) */
  [/^Shawarma/, {label:"¿Quitamos algo?", items:[["Sin lechuga",0],["Sin tomate",0],["Sin cebolla",0],["Sin pepinillo",0],["Sin perejil",0],["Sin salsa de ajo",0]]}]
];
/* Para quitarle los adicionales a un plato concreto: añade su nombre a NO_EXTRAS. */
const NO_EXTRAS = ["Plato mixto con lomito"];
/* Lleva 2 contornos a elegir: los de "Carnes y Aves" (salvo los que ya traen su guarnición en la descripción) y los que dicen "2 contornos" */
const CON_CONTORNOS = (cat, it) => /2 contornos/i.test(it[2] || "") || (cat === "Carnes y Aves" && !/papas|arroz/i.test(it[2] || ""));
/* Adicionales que no se ofrecen en un plato */
const PROTE_NOMBRES = PROTEINAS.map(k => ADDON[k][0]);
const YA_LO_TRAE = (cat, it, n) => {
  const t = (it[0] + " " + (it[2] || "")).toLowerCase();
  return ((n === "Papas fritas" || n === "Arroz") && CON_CONTORNOS(cat, it))   /* ya son contornos gratis: con el mismo nombre se cobrarían */
    || (/vegetarian|falafel/i.test(it[0]) && PROTE_NOMBRES.includes(n));          /* platos vegetarianos: sin carne ni mariscos */
};
MENU.forEach(([cat, , list]) => list.forEach(it => {
  if (CON_CONTORNOS(cat, it)) it[5] = it[5] || CONTORNOS_2;
  const hit = EXTRAS_POR_PLATO.find(([re]) => re.test(it[0])), base = hit ? hit[1] : EXTRAS_POR_CATEGORIA[cat];
  const items = base && !NO_EXTRAS.includes(it[0]) ? base.items.filter(x => x[0] !== it[0] && !YA_LO_TRAE(cat, it, x[0])) : [];
  if (items.length) { it[2] = it[2] || ""; it[3] = it[3] || null; it[4] = {label: base.label, items}; }
  else if (it[4]) it[4] = null;
}));
const UPSELL =[["Batidos y Yogurt","Limonada con hierbabuena"],["Bebidas","Agua mineral"],["Bebidas","Refresco de lata"]];

/* Fotos reales por plato (id = slug(categoría)--slug(plato)). Solo se muestran si existen.
   Para ocultarlas, cambia PHOTOS = PHOTOS_OFF por PHOTOS = {} y ejecuta: node scripts/prerender-menu.js */
const PHOTOS_OFF = {
  "entradas-arabes--tabaquitos-de-uva": "img/tabaquitos-uva",
  "entradas-arabes--tabaquitos-de-repollo": "img/tabaquitos-repollo-480",
  "entradas-mediterraneas--carpaccio-de-lomito": "img/carpaccio-480",
  "sopas-y-cremas--crema-de-auyama": "img/crema-auyama-480",
  "ensaladas--ensalada-de-cangrejo": "img/ensalada-cangrejo-480",
  "ensaladas--ensalada-de-burrata": "img/ensalada-burrata-480",
  "platos-arabes-especiales--plato-de-shawarma": "img/photos/shawarma-plato-640",
  "platos-arabes-especiales--bandeja-arabe-2-personas": "img/photos/bandeja-arabe-640",
  "platos-arabes-especiales--bandeja-arabe-3-personas": "img/pya/platos-arabes-especiales--bandeja-arabe-3-personas.jpg",
  "shawarmas-y-sandwiches--shawarma": "img/photos/shawarma-wrap-640",
  "brochetas-y-parrillas--brochetas-el-amir": "img/brochetas-el-amir-480",
  "brochetas-y-parrillas--parrilla-mixta": "img/photos/parrilla-mixta-640",
  "carnes-y-aves--pollo-a-la-brasa-el-amir": "img/pollo-brasa-el-amir-480",
  "pescados-y-mariscos--mero-en-2-salsas": "img/mero-2-salsas-480",
  "pescados-y-mariscos--dynamite-shrimp": "img/photos/dynamite-shrimp-640",
  "arroces--risotto-al-pesto-con-escalopines-de-pollo": "img/photos/risotto-pesto-640",
  "arroces--risotto-con-calabaza-y-calamares-acevichados": "img/risotto-calabaza-480",
  "arroces--fideua-2-personas": "img/photos/fideua-640",
  "pastas--rigatoni-cremoso-con-tocineta-y-champinones": "img/rigatoni-480",
  "hamburguesas--oh-my-burger": "img/oh-my-burger-480",
  /* PedidosYa (fotos enviadas por el cliente; miniaturas en el mismo archivo -th.jpg) */
  "shawarmas-y-sandwiches--sandwich-de-falafel": "img/pya/shawarmas-y-sandwiches--sandwich-de-falafel.jpg",
  "shawarmas-y-sandwiches--shawarma-especial": "img/pya/shawarmas-y-sandwiches--shawarma-especial.jpg",
  "shawarmas-y-sandwiches--shawarma-abierto": "img/pya/shawarmas-y-sandwiches--shawarma-abierto.jpg",
  "shawarmas-y-sandwiches--shawarma-super-especial": "img/pya/shawarmas-y-sandwiches--shawarma-super-especial.jpg",
  "shawarmas-y-sandwiches--shawarma-especial-abierto": "img/pya/shawarmas-y-sandwiches--shawarma-especial-abierto.jpg",
  "shawarmas-y-sandwiches--shawarma-super-especial-abierto": "img/pya/shawarmas-y-sandwiches--shawarma-super-especial-abierto.jpg",
  "shawarmas-y-sandwiches--falafel-especial": "img/pya/shawarmas-y-sandwiches--falafel-especial.jpg",
  "shawarmas-y-sandwiches--tawook": "img/pya/shawarmas-y-sandwiches--tawook.jpg",
  "shawarmas-y-sandwiches--lomito": "img/pya/shawarmas-y-sandwiches--lomito.jpg",
  "shawarmas-y-sandwiches--fajita": "img/pya/shawarmas-y-sandwiches--fajita.jpg",
  "shawarmas-y-sandwiches--camaron": "img/pya/shawarmas-y-sandwiches--camaron.jpg",
  "shawarmas-y-sandwiches--philadelphia": "img/pya/shawarmas-y-sandwiches--philadelphia.jpg",
  "hamburguesas--cheeseburger": "img/pya/hamburguesas--cheeseburger.jpg",
  "hamburguesas--pollo-crispy": "img/pya/hamburguesas--pollo-crispy.jpg",
  "hamburguesas--gordon-burger": "img/pya/hamburguesas--gordon-burger.jpg",
  "entradas-mediterraneas--papas-fritas": "img/pya/entradas-mediterraneas--papas-fritas.jpg",
  "entradas-mediterraneas--dedos-de-mozzarella": "img/pya/entradas-mediterraneas--dedos-de-mozzarella.jpg",
  "entradas-mediterraneas--tequenos": "img/pya/entradas-mediterraneas--tequenos.jpg",
  "entradas-mediterraneas--berenjena-frita": "img/pya/entradas-mediterraneas--berenjena-frita.jpg",
  "entradas-mediterraneas--ceviche-de-camaron": "img/pya/entradas-mediterraneas--ceviche-de-camaron.jpg",
  "platos-arabes-especiales--fatte": "img/pya/platos-arabes-especiales--fatte.jpg",
  "platos-arabes-especiales--fatte-de-berenjena": "img/pya/platos-arabes-especiales--fatte.jpg",
  "platos-arabes-especiales--bandeja-arabe-4-personas": "img/pya/platos-arabes-especiales--bandeja-arabe-4-personas.jpg",
  "entradas-arabes--sawda-djaj": "img/pya/entradas-arabes--sawda-djaj.jpg",
  "pescados-y-mariscos--calamares-rebozados": "img/pya/pescados-y-mariscos--calamares-rebozados.jpg",
  "platos-arabes-especiales--plato-vegetariano-arabe": "img/pya/platos-arabes-especiales--plato-vegetariano-arabe.jpg",
  "brochetas-y-parrillas--parrilla-el-amir": "img/pya/brochetas-y-parrillas--parrilla-el-amir.jpg",
  "brochetas-y-parrillas--parrilla-mar-y-tierra": "img/pya/brochetas-y-parrillas--parrilla-mar-y-tierra.jpg",
  "brochetas-y-parrillas--parrilla-de-mariscos": "img/pya/brochetas-y-parrillas--parrilla-de-mariscos.jpg",
  "sopas-y-cremas--sopa-de-pollo-con-vegetales": "img/pya/sopas-y-cremas--sopa-de-pollo-con-vegetales.jpg",
  "sopas-y-cremas--crema-de-pollo": "img/pya/sopas-y-cremas--crema-de-pollo.jpg",
  "sopas-y-cremas--fosforera": "img/pya/sopas-y-cremas--fosforera.jpg",
  "entradas-arabes--falafel": "img/pya/entradas-arabes--falafel.jpg",
  "entradas-arabes--falafel-especial": "img/pya/entradas-arabes--falafel-especial.jpg",
  "entradas-arabes--makanek": "img/pya/entradas-arabes--makanek.jpg",
  "entradas-arabes--basterma": "img/pya/entradas-arabes--basterma.jpg",
  "entradas-arabes--cremas-mixtas": "img/pya/entradas-arabes--cremas-mixtas.jpg",
  "entradas-arabes--muhammara": "img/pya/entradas-arabes--muhammara.jpg",
  "entradas-arabes--tabaquitos-mixtos": "img/pya/entradas-arabes--tabaquitos-mixtos.jpg",
  "entradas-arabes--kibbe-horneado": "img/pya/entradas-arabes--kibbe-horneado.jpg",
  "entradas-arabes--garbanzo-con-lomito": "img/pya/entradas-arabes--garbanzo-con-lomito.jpg",
  "ensaladas--ensalada-mixta": "img/pya/ensaladas--ensalada-mixta.jpg",
  "ensaladas--tabbule": "img/pya/ensaladas--tabbule-2.jpg",
  "ensaladas--ensalada-de-palmitos": "img/pya/ensaladas--ensalada-de-palmitos.jpg",
  "ensaladas--ensalada-cesar": "img/pya/ensaladas--ensalada-cesar.jpg",
  "ensaladas--rugula-de-la-casa": "img/pya/ensaladas--rugula-de-la-casa.jpg",
  "ensaladas--libanesa": "img/pya/ensaladas--libanesa.jpg",
  "ensaladas--ensalada-de-camarones": "img/pya/ensaladas--ensalada-de-camarones.jpg",
  "ensaladas--fattoush": "img/pya/ensaladas--fattoush.jpg",
  "ensaladas--ensalada-cesar-con-pollo": "img/pya/ensaladas--ensalada-cesar-con-pollo.jpg",
  "ensaladas--ensalada-cesar-con-berro-y-pollo": "img/pya/ensaladas--ensalada-cesar-con-berro-y-pollo.jpg",
  "ensaladas--ensalada-cesar-con-camaron": "img/pya/ensaladas--ensalada-cesar-con-camaron.jpg",
  "brochetas-y-parrillas--brocheta-de-kafta": "img/pya/brochetas-y-parrillas--brocheta-de-kafta.jpg",
  "brochetas-y-parrillas--brocheta-de-pollo": "img/pya/brochetas-y-parrillas--brocheta-de-pollo.jpg",
  "brochetas-y-parrillas--brocheta-de-lomito": "img/pya/brochetas-y-parrillas--brocheta-de-lomito.jpg",
  "carnes-y-aves--pollo-a-la-canasta": "img/pya/carnes-y-aves--pollo-a-la-canasta.jpg",
  "carnes-y-aves--tenders-de-pollo-crispy": "img/pya/carnes-y-aves--tenders-de-pollo-crispy.jpg",
  "carnes-y-aves--pollo-a-la-plancha": "img/pya/carnes-y-aves--pollo-a-la-plancha.jpg",
  "carnes-y-aves--pollo-a-la-milanesa": "img/pya/carnes-y-aves--pollo-a-la-milanesa.jpg",
  "carnes-y-aves--centro-de-lomito-a-la-plancha": "img/pya/carnes-y-aves--centro-de-lomito-a-la-plancha.jpg",
  "carnes-y-aves--pollo-al-champinon": "img/pya/carnes-y-aves--pollo-al-champinon.jpg",
  "carnes-y-aves--envoltini-de-pollo": "img/pya/carnes-y-aves--envoltini-de-pollo.jpg",
  "carnes-y-aves--cordon-bleu-de-pollo": "img/pya/carnes-y-aves--cordon-bleu-de-pollo.jpg",
  "carnes-y-aves--cordon-bleu-de-lomito": "img/pya/carnes-y-aves--cordon-bleu-de-lomito.jpg",
  "carnes-y-aves--filet-mignon": "img/pya/carnes-y-aves--filet-mignon.jpg",
  "carnes-y-aves--suprema-de-pollo-crispy": "img/pya/carnes-y-aves--suprema-de-pollo-crispy.jpg",
  "pastas--pasta-bologna": "img/pya/pastas--pasta-bologna.jpg",
  "pastas--pasta-napoli": "img/pya/pastas--pasta-napoli.jpg",
  "pastas--pasticho-tradicional": "img/pya/pastas--pasticho-tradicional.jpg",
  "pastas--linguini-carbonara": "img/pya/pastas--linguini-carbonara.jpg",
  "pastas--linguini-al-fileto": "img/pya/pastas--linguini-al-fileto.jpg",
  "pastas--linguini-con-camarones": "img/pya/pastas--linguini-con-camarones.jpg",
  "pastas--linguini-marinera": "img/pya/pastas--linguini-marinera.jpg",
  "pastas--cartoccio-de-lomito": "img/pya/pastas--cartoccio-de-lomito.jpg",
  "bebidas--agua-mineral": "img/pya/bebidas--agua-mineral.jpg",
  "bebidas--refresco-de-lata": "img/pya/bebidas--refresco-de-lata.jpg",
  "bebidas--te-lipton": "img/pya/bebidas--te-lipton.jpg",
  "bebidas--refresco-1l": "img/pya/bebidas--refresco-1l.jpg",
  /* fotos nuevas del cliente (img/pya, convertidas a 640×480 + -th 240×180) */
  "entradas-arabes--kibbe-crudo": "img/pya/entradas-arabes--kibbe-crudo.jpg",
  "entradas-arabes--kibbe-frito": "img/pya/entradas-arabes--kibbe-frito.jpg",
  "shawarmas-y-sandwiches--kebab": "img/pya/shawarmas-y-sandwiches--kebab.jpg",
  "shawarmas-y-sandwiches--makanek": "img/pya/shawarmas-y-sandwiches--makanek.jpg",
  "shawarmas-y-sandwiches--kibbe-frito": "img/pya/shawarmas-y-sandwiches--kibbe-frito.jpg",
  "platos-arabes-especiales--plato-mixto": "img/pya/platos-arabes-especiales--plato-mixto.jpg",
  "platos-arabes-especiales--kibbe-al-yogurt": "img/pya/platos-arabes-especiales--kibbe-al-yogurt.jpg",
  "platos-arabes-especiales--arroz-libanes-con-pollo-o-cordero": "img/pya/platos-arabes-especiales--arroz-libanes-con-pollo-o-cordero.jpg",
  "pescados-y-mariscos--mero-al-ajillo": "img/pya/pescados-y-mariscos--mero-al-ajillo.jpg",
  "pescados-y-mariscos--cazuela-de-mariscos": "img/pya/pescados-y-mariscos--cazuela-de-mariscos.jpg",
  "pastas--fettuccine-con-ragu-de-mero": "img/pya/pastas--fettuccine-con-ragu-de-mero.jpg",
  "carnes-y-aves--pollo-a-la-brasa": "img/pya/carnes-y-aves--pollo-a-la-brasa.jpg",
  "arroces--paella-2-personas": "img/pya/arroces--paella-2-personas.jpg",
  "arroces--paella-3-personas": "img/pya/arroces--paella-2-personas.jpg",
  "arroces--paella-4-personas": "img/pya/arroces--paella-2-personas.jpg",
  "arroces--fideua-3-personas": "img/pya/arroces--fideua-3-personas.jpg",
  "arroces--fideua-4-personas": "img/pya/arroces--fideua-3-personas.jpg",
  "ensaladas--yogurt-con-pepino": "img/pya/ensaladas--yogurt-con-pepino.jpg",
  "entradas-arabes--hummus": "img/pya/entradas-arabes--hummus.jpg",
  "entradas-arabes--mutabal": "img/pya/entradas-arabes--mutabal.jpg",
  "pescados-y-mariscos--pulpo-al-grill": "img/pya/pescados-y-mariscos--pulpo-al-grill.jpg",
  "brochetas-y-parrillas--parrilla-de-pollo": "img/pya/brochetas-y-parrillas--parrilla-de-pollo.jpg",
  "brochetas-y-parrillas--parrilla-de-lomito": "img/pya/brochetas-y-parrillas--parrilla-de-lomito.jpg",
  "brochetas-y-parrillas--brocheta-mixta": "img/pya/brochetas-y-parrillas--brocheta-mixta.jpg",
  "pescados-y-mariscos--arroz-a-la-marinera": "img/pya/pescados-y-mariscos--arroz-a-la-marinera.jpg",
  "pescados-y-mariscos--asopado-de-mariscos-2-personas": "img/pya/pescados-y-mariscos--asopado-de-mariscos.jpg",
  "pescados-y-mariscos--calamares-al-ajillo": "img/pya/pescados-y-mariscos--calamares-al-ajillo.jpg",
  "pescados-y-mariscos--camarones-al-ajillo": "img/pya/pescados-y-mariscos--camarones-al-ajillo.jpg",
  "pescados-y-mariscos--mero-a-la-plancha": "img/pya/pescados-y-mariscos--mero-a-la-plancha.jpg"
};
const PHOTOS = PHOTOS_OFF;
