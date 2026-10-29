/* =====================================================================
   CONFIG — EL DUEÑO EDITA SOLO ESTE BLOQUE. Todo lo marcado "<<< CAMBIAR"
   son valores de ejemplo que hay que reemplazar.
   ===================================================================== */
const CONFIG = {
  nombre: "El Amir Palace",
  whatsapp: "584248060218",            // WhatsApp principal (sucursal Lechería, delivery 0424-806 0218)
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
  // Sucursales: cada una recibe por WhatsApp los pedidos de sus zonas.
  sucursales: [
    // lat/lng: coordenadas del local (Google Maps → clic derecho sobre el local → copiar). Necesarias para el delivery por distancia.
    { id: "lecheria", nombre: "Lechería",       whatsapp: "584248060218", telefono: "0424-806 0218", lat: null, lng: null }, // <<< CAMBIAR
    { id: "plc",      nombre: "Puerto La Cruz", whatsapp: "584127505025", telefono: "0412-750 5025", lat: null, lng: null }  // <<< CAMBIAR
  ],
  // Delivery por distancia: si el cliente marca su ubicación en el mapa, el precio sale de la distancia
  // (en línea recta) desde la sucursal que atiende su zona. Tramos en orden: hastaKm = hasta cuántos km, fee = USD.
  // Más lejos que el último tramo, o sin ubicación marcada → se usa el fee de la zona (o "se confirma por WhatsApp").
  // Vacío [] = apagado. Ejemplo: [{ hastaKm: 2, fee: 1 }, { hastaKm: 4, fee: 2 }, { hastaKm: 6, fee: 3 }, { hastaKm: 10, fee: 4 }]
  deliveryPorKm: [],                   // <<< CAMBIAR
  // Zonas de delivery. fee: tarifa en USD, o null = "se confirma por WhatsApp".
  // sucursal: qué sucursal atiende la zona  <<< CONFIRMAR con el cliente (asignación por cercanía)
  zonas: [
    { name: "Lechería",        sucursal: "lecheria", fee: null, eta: "" },
    { name: "Nueva Barcelona", sucursal: "lecheria", fee: null, eta: "" },
    { name: "Barcelona",       sucursal: "lecheria", fee: null, eta: "" },
    { name: "Puerto La Cruz",  sucursal: "plc",      fee: null, eta: "" },
    { name: "Guanta",          sucursal: "plc",      fee: null, eta: "" }
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
