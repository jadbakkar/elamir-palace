/* =====================================================================
   CONFIG — EL DUEÑO EDITA SOLO ESTE BLOQUE. Todo lo marcado "<<< CAMBIAR"
   son valores de ejemplo que hay que reemplazar.
   ===================================================================== */
const CONFIG = {
  nombre: "El Amir Palace",
  whatsapp: "584248060218",            // WhatsApp principal (respaldo si una sucursal no tiene número)
  direccion: "[DIRECCIÓN: calle, edificio, ciudad]", // <<< CAMBIAR
  telefono: "0424-806 0218",           // teléfono principal (Lechería)
  instagram: "@tu_instagram",          // <<< CAMBIAR
  sitioWeb: "https://TU-DOMINIO.com/", // <<< CAMBIAR (también en <link canonical> y og: del <head>)
  tz: "America/Caracas",
  pruebaSinHorario: true,              // TEST: true = se puede enviar pedidos aunque esté cerrado. Poner false al publicar.
  // Horario por día: ["apertura","cierre"] en 24h, o null si cierra ese día. Si cierra pasada la medianoche (ej. "02:00") funciona.
  horario: {                           // <<< CAMBIAR
    lun: ["11:30","22:00"], mar: ["11:30","22:00"], mie: ["11:30","22:00"], jue: ["11:30","22:00"],
    vie: ["11:30","23:00"], sab: ["11:30","23:00"], dom: ["11:30","21:00"]
  },
  // Sucursales. Delivery: el cliente DEBE marcar su ubicación y el pedido va al WhatsApp de la sucursal más cercana
  // (distancia en línea recta). Retiro: el cliente elige la sucursal.
  // lat/lng: coordenadas del local (Google Maps → clic derecho sobre el local → copiar). SIN ellas todo el delivery va a la primera sucursal.
  sucursales: [
    { id: "lecheria", nombre: "Lechería",       whatsapp: "584248060218", telefono: "0424-806 0218", lat: 10.196197, lng: -64.691991 },
    { id: "plc",      nombre: "Puerto La Cruz", whatsapp: "584127505025", telefono: "0412-750 5025", lat: 10.220758, lng: -64.639242 }
  ],
  // Zonas donde hay delivery: solo se listan en la página principal (el precio del delivery no se muestra en el pedido).
  zonas: [
    { name: "Lechería" },
    { name: "Nueva Barcelona" },
    { name: "Barcelona" },
    { name: "Puerto La Cruz" },
    { name: "Guanta" }
  ],
  pedidoMinimo: 0,                   // <<< CAMBIAR: USD (subtotal de platos). 0 = sin mínimo
  bcv: { tasa: 0, fecha: "" },         // <<< CAMBIAR: tasa en Bs por USD (0 = oculta los Bs) y fecha "AAAA-MM-DD"
  // Formas de pago. activo: true = aparece en el pedido, false = se oculta.
  // Si un dato sigue entre [corchetes], el cliente ve "te enviaremos los datos por WhatsApp".
  // !!! DEMO: datos de ejemplo para mostrar al cliente. REEMPLAZAR por los reales ANTES de publicar !!!
  pagoMovil: { activo: true, banco: "Banesco 0134", telefono: "0414-1234567", cedula: "V-12345678" }, // DEMO <<< CAMBIAR
  efectivoBs: { activo: true },        // efectivo en bolívares (monto a tasa BCV)
  efectivo: { activo: true },          // efectivo en divisas ($)
  binance: { activo: true, payId: "123456789" },                  // DEMO <<< CAMBIAR
  zinli: { activo: true, correo: "pagos@elamirpalace.com" },      // DEMO <<< CAMBIAR
  zelle: { activo: true, email: "zelle@elamirpalace.com" },       // DEMO <<< CAMBIAR
  puntoVenta: { activo: false },       // apagado por ahora (el cliente no lo pidió)
  transferencia: { activo: false, banco: "[BANCO]", cuenta: "[0000-0000-00-0000000000]", titular: "[NOMBRE DEL TITULAR]", cedula: "[V-00000000 / J-000000000]" } // apagado
};
/* ===================================================================== */
