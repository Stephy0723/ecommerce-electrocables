import "./setup.js";
import "./style.css";
(() => {
"use strict";
const $ = (s, c = document) => c.querySelector(s), $$ = (s, c = document) => [...c.querySelectorAll(s)];
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const hasG = typeof gsap !== "undefined";
if (hasG) { gsap.registerPlugin(ScrollTrigger); if (typeof Flip !== "undefined") gsap.registerPlugin(Flip); }
const store = { get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }, set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} } };
const money = (n) => "RD$" + Math.round(n).toLocaleString("en-US");
const U = (id, w = 1200) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=72`;
const IMG = {
  neon: U("1550745165-9bc0b252726f", 2000), setup: U("1593305841991-05c297ba4575", 2000), fluid: U("1620641788421-7a1c342ea42e", 2000), prism: U("1618005182384-a83a8bd57fbe", 2000),
  phones: U("1511707171634-5f897ff02aa9", 1600), laptop: U("1496181133206-80ce9b88a853", 1600), audio: U("1505740420928-5e560c06d30e", 1600), watch: U("1546868871-7041f2a55e12", 1400),
  camera: U("1516035069371-29a1b244cc32", 1400), drone: U("1473968512647-3e447244af8f", 1400), pad: U("1544244015-0df4b3ffc6b0", 1400), keys: U("1587829741301-dc798b83add3", 1400),
  speaker: U("1608043152269-423dbba4e7e1", 1400), pads: U("1606144042614-b2417e99c4e3", 1400), buds: U("1606220588913-b3aacb4d2f46", 1400), desk: U("1517336714731-489689fd1ca8", 1600),
};
const pic = (src, cls = "ph", alt = "") => `<img class="${cls}" src="${src}" alt="${alt}" loading="lazy" decoding="async" onerror="this.classList.add('broken')">`;

const CATS = [
  { id: "audio", es: "Audio", en: "Audio", img: IMG.audio },
  { id: "phones", es: "Smartphones", en: "Smartphones", img: IMG.phones },
  { id: "computing", es: "Computación", en: "Computing", img: IMG.laptop },
  { id: "wearables", es: "Wearables", en: "Wearables", img: IMG.watch },
  { id: "cameras", es: "Cámaras", en: "Cameras", img: IMG.camera },
  { id: "drones", es: "Drones", en: "Drones", img: IMG.drone },
  { id: "gaming", es: "Gaming", en: "Gaming", img: IMG.pads },
  { id: "home", es: "Smart Home", en: "Smart Home", img: IMG.speaker },
];
const P = (id, cat, brand, price, offer, stock, rating, sold, tags, imgs, es, en, specs) => ({ id, cat, brand, price, offer, stock, rating, sold, tags, imgs: imgs.map((x) => U(x, 1000)), es, en, specs });
const PRODUCTS = [
  P("p01", "audio", "Aurion", 18900, 15900, 34, 4.9, 412, ["best", "sale"], ["1505740420928-5e560c06d30e", "1583394838336-acd977736f90"], ["Aurion Max · audífonos ANC", "Cancelación de ruido adaptativa, audio espacial y 40 horas de batería."], ["Aurion Max · ANC headphones", "Adaptive noise cancelling, spatial audio and 40-hour battery."], { battery: "40 h", conn: "BT 5.4", anc: "Adaptativa", weight: "254 g" }),
  P("p02", "audio", "Aurion", 9900, 8490, 88, 4.8, 640, ["best"], ["1606220588913-b3aacb4d2f46", "1600294037681-c80b4cb5b434"], ["Aurion Pods Pro 2", "Auriculares inalámbricos con ANC, estuche con carga inalámbrica y resistencia IPX5."], ["Aurion Pods Pro 2", "Wireless earbuds with ANC, wireless-charging case and IPX5 rating."], { battery: "30 h", conn: "BT 5.3", anc: "Activa", ip: "IPX5" }),
  P("p03", "wearables", "Pulse", 21500, 18990, 21, 4.8, 233, ["new", "sale"], ["1546868871-7041f2a55e12", "1579586337278-3befd40fd17a"], ["Pulse Watch S9", "Pantalla AMOLED siempre activa, ECG, GPS doble banda y 3 días de batería."], ["Pulse Watch S9", "Always-on AMOLED, ECG, dual-band GPS and 3-day battery."], { screen: "1.9\" AMOLED", battery: "72 h", ip: "5 ATM", weight: "38 g" }),
  P("p04", "phones", "Nexa", 64900, 58900, 17, 4.9, 380, ["best", "sale"], ["1511707171634-5f897ff02aa9", "1598327105666-5b89351aff97"], ["Nexa One Ultra 256 GB", "Cámara de 200 MP, pantalla de 120 Hz y chip de 3 nm con IA integrada."], ["Nexa One Ultra 256 GB", "200 MP camera, 120 Hz display and 3 nm chip with on-device AI."], { screen: "6.8\" 120 Hz", chip: "N3 · 3 nm", storage: "256 GB", cam: "200 MP" }),
  P("p05", "computing", "Vanta", 98500, 89900, 9, 4.9, 154, ["new", "low"], ["1496181133206-80ce9b88a853", "1517336714731-489689fd1ca8"], ["Vanta Book Pro 14\"", "Pantalla mini-LED, 32 GB de RAM y hasta 20 horas de batería en 1.5 kg."], ["Vanta Book Pro 14\"", "Mini-LED display, 32 GB RAM and up to 20 hours of battery in 1.5 kg."], { screen: "14\" mini-LED", chip: "V4 Max", ram: "32 GB", storage: "1 TB" }),
  P("p06", "computing", "Vanta", 62900, 0, 26, 4.7, 198, ["new"], ["1593642632559-0c6d3fc62b89", "1531297484001-80022131f5a1"], ["Vanta Air 13\"", "Ultraligera, sin ventilador y con carga rápida USB-C de 70 W."], ["Vanta Air 13\"", "Ultralight, fanless, with 70 W USB-C fast charging."], { screen: "13.6\" IPS", chip: "V4", ram: "16 GB", storage: "512 GB" }),
  P("p07", "computing", "Lumo", 38900, 34900, 31, 4.7, 176, ["sale"], ["1544244015-0df4b3ffc6b0", "1563986768609-322da13575f3"], ["Lumo Tab 11 + lápiz", "Tablet de 11\" a 120 Hz con lápiz de baja latencia incluido."], ["Lumo Tab 11 + pen", "11\" 120 Hz tablet with low-latency pen included."], { screen: "11\" 120 Hz", chip: "L2", storage: "256 GB", weight: "470 g" }),
  P("p08", "cameras", "Orbix", 79900, 72900, 12, 4.9, 87, ["best", "low"], ["1516035069371-29a1b244cc32", "1502920917128-1aa500764cbd"], ["Orbix Z7 sin espejo + 24-70", "Sensor full frame de 33 MP, video 4K 60 y estabilización en cuerpo."], ["Orbix Z7 mirrorless + 24-70", "33 MP full-frame sensor, 4K60 video and in-body stabilization."], { res: "33 MP", video: "4K 60", sensor: "Full frame", weight: "658 g" }),
  P("p09", "cameras", "Orbix", 6900, 5990, 64, 4.6, 302, ["sale"], ["1526170375885-4d8ecf77b99f", "1502920917128-1aa500764cbd"], ["Orbix Snap instantánea", "Fotos impresas al momento, flash automático y modo selfie."], ["Orbix Snap instant camera", "Instant prints, auto flash and selfie mode."], { res: "Instant", battery: "100 fotos", weight: "307 g", conn: "—" }),
  P("p10", "drones", "Kairo", 54900, 49900, 14, 4.8, 96, ["new", "sale"], ["1473968512647-3e447244af8f", "1507582020474-9a35b7d455d9"], ["Kairo Air 3 Combo", "Video 4K HDR, 46 minutos de vuelo y detección de obstáculos 360°."], ["Kairo Air 3 Combo", "4K HDR video, 46-minute flights and 360° obstacle sensing."], { video: "4K HDR", battery: "46 min", range: "20 km", weight: "720 g" }),
  P("p11", "home", "Zenit", 12900, 10900, 47, 4.7, 265, ["sale"], ["1608043152269-423dbba4e7e1", "1545454675-3531b543be5d"], ["Zenit Boom bocina portátil", "Sonido 360°, graves profundos, 24 h de batería y resistente al agua."], ["Zenit Boom portable speaker", "360° sound, deep bass, 24 h battery and waterproof."], { battery: "24 h", conn: "BT 5.3", ip: "IP67", weight: "1.1 kg" }),
  P("p12", "home", "Halo", 5900, 4990, 120, 4.6, 520, ["best", "sale"], ["1589003077984-894e133dabab", "1545454675-3531b543be5d"], ["Halo Dot asistente de voz", "Controla luces, música y rutinas del hogar con tu voz."], ["Halo Dot voice assistant", "Control lights, music and home routines with your voice."], { conn: "Wi-Fi 6", mic: "4 mics", weight: "340 g", ip: "—" }),
  P("p13", "gaming", "Strix", 8900, 7490, 58, 4.8, 344, ["best", "sale"], ["1587829741301-dc798b83add3", "1595225476474-87563907a212"], ["Strix K75 teclado mecánico RGB", "Switches hot-swap, aluminio CNC y conexión triple modo."], ["Strix K75 RGB mechanical keyboard", "Hot-swap switches, CNC aluminum and tri-mode connection."], { layout: "75%", conn: "2.4G · BT · USB-C", battery: "200 h", weight: "980 g" }),
  P("p14", "gaming", "Strix", 4900, 0, 73, 4.7, 287, ["new"], ["1527864550417-7fd91fc51a46", "1593305841991-05c297ba4575"], ["Strix Viper mouse 26K", "Sensor óptico de 26,000 DPI, 58 g y switches ópticos."], ["Strix Viper 26K mouse", "26,000 DPI optical sensor, 58 g and optical switches."], { dpi: "26K", weight: "58 g", conn: "2.4G", battery: "90 h" }),
  P("p15", "gaming", "Novu", 5490, 4790, 40, 4.8, 410, ["sale"], ["1606144042614-b2417e99c4e3", "1550745165-9bc0b252726f"], ["Novu Pad control inalámbrico", "Gatillos adaptativos, vibración háptica y compatible con PC y consolas."], ["Novu Pad wireless controller", "Adaptive triggers, haptic feedback, PC and console ready."], { conn: "BT · USB-C", battery: "15 h", weight: "280 g", haptic: "HD" }),
];
const SPEC_LABEL = { es: { battery: "Batería", conn: "Conexión", anc: "Cancelación", weight: "Peso", ip: "Resistencia", screen: "Pantalla", chip: "Procesador", storage: "Almacenamiento", cam: "Cámara", ram: "Memoria", res: "Resolución", video: "Video", sensor: "Sensor", range: "Alcance", mic: "Micrófonos", layout: "Formato", dpi: "Sensor", haptic: "Háptica" },
  en: { battery: "Battery", conn: "Connection", anc: "Noise cancel", weight: "Weight", ip: "Rating", screen: "Display", chip: "Chip", storage: "Storage", cam: "Camera", ram: "Memory", res: "Resolution", video: "Video", sensor: "Sensor", range: "Range", mic: "Microphones", layout: "Layout", dpi: "Sensor", haptic: "Haptics" } };
const T = {
  es: {
    nav: { home: "Inicio", shop: "Tienda", deals: "Ofertas", favs: "Favoritos", admin: "Panel", depts: "Categorías", search: "Buscar gadgets…", cart: "Carrito", theme: "Tema" },
    ticker: ["Envío gratis desde RD$15,000", "Hasta 12 cuotas sin intereses", "Entrega express en 24 h", "Garantía oficial de 12 meses", "Trade-in: entrega tu equipo y estrena", "Devoluciones gratis por 30 días"],
    tags: { best: "Top ventas", sale: "Oferta", new: "Nuevo", low: "Últimas unidades" },
    home: {
      eyebrow: "Tecnología · Drop 2026", title: ["El futuro", "ya está", "en stock"], lede: "Audio, smartphones, laptops, wearables y gaming de última generación. Envío en 24 horas, cuotas sin intereses y garantía oficial.",
      cta1: "Explorar tienda", cta2: "Ver ofertas", live: "comprando ahora", rating: "4.9 · 12K reseñas", ship: "Envío 24 h", stats: [[48000, "+", "Clientes felices"], [24, "h", "Entrega express"], [12, "", "Cuotas sin interés"], [99, "%", "Pedidos a tiempo"]],
      catsEyebrow: "Categorías", catsTitle: ["Explora por", "universo"], items: "productos",
      featEyebrow: "Top ventas", featTitle: ["Lo más", "deseado"],
      proEyebrow: "Steliant Trade-in", proTitle: ["Entrega tu equipo,", "estrena hoy"], proText: "Cotizamos tu smartphone, laptop o tablet al instante y aplicamos el valor como descuento en tu compra. Sin filas ni papeleo.", proCta: "Cotizar mi equipo", proOk: "Cotización enviada (demo). Te escribimos en minutos.",
      steps: [["Elige", "Compara specs y precios en segundos."], ["Paga", "Tarjeta, transferencia o hasta 12 cuotas."], ["Recibe", "En 24 h en Santo Domingo, 48 h al resto del país."]],
      brandsEyebrow: "Marcas", quotesEyebrow: "Reseñas", quotes: [["Pedí los audífonos a las 10 y antes de las 4 ya los tenía. El empaque y la experiencia, de otro nivel.", "Camila R.", "Compradora verificada"], ["El comparador de specs me ayudó a elegir la laptop perfecta para diseño. Pagué en cuotas sin complicaciones.", "Andrés M.", "Diseñador"], ["Hice trade-in de mi teléfono viejo y me quedó la mitad del precio. Rapidísimo.", "Luis P.", "Cliente frecuente"]],
    },
    shop: { eyebrow: "Tienda", title: ["Toda la", "tecnología"], lede: "Filtra por categoría, marca, precio y disponibilidad.", filters: "Filtros", cats: "Categorías", brands: "Marcas", price: "Precio máximo", stock: "Solo disponibles", sort: "Ordenar", sorts: { pop: "Más vendidos", low: "Menor precio", high: "Mayor precio", rate: "Mejor valorados" }, results: "resultados", clear: "Limpiar", none: "Sin resultados con esos filtros." },
    deals: { eyebrow: "Flash sale", title: ["Ofertas", "de la semana"], lede: "Descuentos reales por tiempo limitado. Terminan el domingo a medianoche.", ends: "Termina en" },
    favs: { eyebrow: "Favoritos", title: ["Tu lista", "de deseos"], lede: "Guarda lo que te gusta para comparar o comprar después.", empty: "Aún no tienes favoritos. Toca el corazón en cualquier producto." },
    prod: { add: "Agregar al carrito", added: "Agregado al carrito", qty: "Cantidad", specs: "Especificaciones", stock: "disponibles", sku: "SKU", ship: "Llega mañana en Santo Domingo", warranty: "Garantía oficial 12 meses", related: "También te puede gustar", back: "Volver a la tienda", save: "Ahorras", reviews: "reseñas", zoom: "Zoom" },
    cart: { title: "Tu carrito", empty: "Tu carrito está vacío.", subtotal: "Subtotal", ship: "Envío", free: "Gratis", toFree: "Te faltan {x} para envío gratis", gotFree: "¡Tienes envío gratis!", checkout: "Finalizar compra", keep: "Seguir comprando", remove: "Quitar" },
    co: { title: "Finalizar compra", steps: ["Envío", "Pago"], name: "Nombre completo", phone: "Teléfono", address: "Dirección", city: "Ciudad", card: "Número de tarjeta", holder: "Titular", exp: "Vence", cvc: "CVC", next: "Continuar al pago", back: "Atrás", pay: "Pagar", processing: "Procesando pago…", approved: "Pago aprobado", packing: "Preparando tu pedido…", done: "¡Pedido confirmado! Síguelo en el botón flotante.", need: "Completa los datos de envío.", needCard: "Completa la tarjeta (cualquier número de prueba sirve).", itbis: "ITBIS (18%)", total: "Total", secure: "Pago cifrado · Demostración: no se cobra nada.", card2: "Tarjeta", transfer: "Transferencia", cod: "Contra entrega", transferTxt: "Te enviaremos los datos bancarios por correo al confirmar.", codTxt: "Pagas en efectivo o tarjeta al recibir." },
    order: { title: "Tu pedido", track: "Seguir pedido", fab: "Mi pedido", steps: ["Confirmado", "Preparando", "En camino", "Entregado"], eta: "Entrega estimada", items: "artículos", number: "Pedido" },
    admin: { eyebrow: "Panel administrativo", title: ["Tu tienda,", "en tiempo real"], lede: "Vista de demostración del panel incluido en la plantilla: ventas, inventario, pedidos y clientes.", kpis: [["Ventas del mes", "RD$"], ["Pedidos", ""], ["Ticket promedio", "RD$"], ["Clientes nuevos", ""]], sales: "Ventas · últimos 12 meses", byCat: "Ventas por categoría", orders: "Pedidos recientes", low: "Stock bajo", status: { paid: "Pagado", ship: "En camino", prep: "Preparando", done: "Entregado" }, client: "Cliente", amount: "Monto", state: "Estado", units: "unid." },
    footer: { tag: "Tecnología de última generación, entregada en 24 horas.", credit: "Plantilla diseñada por Steliant · Vista previa", news: "Drops y ofertas en tu correo", subscribe: "Suscribirme", subscribed: "Suscripción de demostración registrada." },
    c: { sample: "Contenido de ejemplo", from: "Desde", off: "dto." },
  },
  en: {
    nav: { home: "Home", shop: "Shop", deals: "Deals", favs: "Favorites", admin: "Dashboard", depts: "Categories", search: "Search gadgets…", cart: "Cart", theme: "Theme" },
    ticker: ["Free shipping over RD$15,000", "Up to 12 interest-free payments", "24-hour express delivery", "12-month official warranty", "Trade-in: hand over your device and upgrade", "Free returns for 30 days"],
    tags: { best: "Top seller", sale: "Sale", new: "New", low: "Last units" },
    home: {
      eyebrow: "Technology · Drop 2026", title: ["The future", "is now", "in stock"], lede: "Next-gen audio, smartphones, laptops, wearables and gaming. 24-hour delivery, interest-free payments and official warranty.",
      cta1: "Explore the shop", cta2: "See deals", live: "shopping now", rating: "4.9 · 12K reviews", ship: "24 h delivery", stats: [[48000, "+", "Happy customers"], [24, "h", "Express delivery"], [12, "", "Interest-free payments"], [99, "%", "Orders on time"]],
      catsEyebrow: "Categories", catsTitle: ["Explore by", "universe"], items: "products",
      featEyebrow: "Top sellers", featTitle: ["Most", "wanted"],
      proEyebrow: "Steliant Trade-in", proTitle: ["Trade your device,", "upgrade today"], proText: "We value your smartphone, laptop or tablet instantly and apply it as a discount on your purchase. No lines, no paperwork.", proCta: "Value my device", proOk: "Quote sent (demo). We'll write back in minutes.",
      steps: [["Choose", "Compare specs and prices in seconds."], ["Pay", "Card, transfer or up to 12 payments."], ["Receive", "24 h in Santo Domingo, 48 h nationwide."]],
      brandsEyebrow: "Brands", quotesEyebrow: "Reviews", quotes: [["I ordered the headphones at 10 and had them before 4. Packaging and experience on another level.", "Camila R.", "Verified buyer"], ["The spec comparison helped me pick the perfect design laptop. Paid in installments, no hassle.", "Andrés M.", "Designer"], ["I traded in my old phone and paid half the price. Super fast.", "Luis P.", "Frequent customer"]],
    },
    shop: { eyebrow: "Shop", title: ["All the", "tech"], lede: "Filter by category, brand, price and availability.", filters: "Filters", cats: "Categories", brands: "Brands", price: "Max price", stock: "In stock only", sort: "Sort", sorts: { pop: "Best selling", low: "Lowest price", high: "Highest price", rate: "Top rated" }, results: "results", clear: "Clear", none: "No results for those filters." },
    deals: { eyebrow: "Flash sale", title: ["This week's", "deals"], lede: "Real discounts for a limited time. They end Sunday at midnight.", ends: "Ends in" },
    favs: { eyebrow: "Favorites", title: ["Your", "wishlist"], lede: "Save what you like to compare or buy later.", empty: "No favorites yet. Tap the heart on any product." },
    prod: { add: "Add to cart", added: "Added to cart", qty: "Quantity", specs: "Specifications", stock: "available", sku: "SKU", ship: "Arrives tomorrow in Santo Domingo", warranty: "12-month official warranty", related: "You may also like", back: "Back to shop", save: "You save", reviews: "reviews", zoom: "Zoom" },
    cart: { title: "Your cart", empty: "Your cart is empty.", subtotal: "Subtotal", ship: "Shipping", free: "Free", toFree: "{x} away from free shipping", gotFree: "You've got free shipping!", checkout: "Checkout", keep: "Keep shopping", remove: "Remove" },
    co: { title: "Checkout", steps: ["Shipping", "Payment"], name: "Full name", phone: "Phone", address: "Address", city: "City", card: "Card number", holder: "Cardholder", exp: "Expires", cvc: "CVC", next: "Continue to payment", back: "Back", pay: "Pay", processing: "Processing payment…", approved: "Payment approved", packing: "Packing your order…", done: "Order confirmed! Track it from the floating button.", need: "Fill in the shipping details.", needCard: "Fill in the card (any test number works).", itbis: "ITBIS (18%)", total: "Total", secure: "Encrypted payment · Demo: nothing is charged.", card2: "Card", transfer: "Transfer", cod: "Cash on delivery", transferTxt: "We'll email the bank details when you confirm.", codTxt: "Pay cash or card on delivery." },
    order: { title: "Your order", track: "Track order", fab: "My order", steps: ["Confirmed", "Packing", "On the way", "Delivered"], eta: "Estimated delivery", items: "items", number: "Order" },
    admin: { eyebrow: "Admin dashboard", title: ["Your store,", "in real time"], lede: "Demo view of the dashboard included in the template: sales, inventory, orders and customers.", kpis: [["Monthly sales", "RD$"], ["Orders", ""], ["Average ticket", "RD$"], ["New customers", ""]], sales: "Sales · last 12 months", byCat: "Sales by category", orders: "Recent orders", low: "Low stock", status: { paid: "Paid", ship: "On the way", prep: "Packing", done: "Delivered" }, client: "Customer", amount: "Amount", state: "Status", units: "units" },
    footer: { tag: "Next-gen technology, delivered in 24 hours.", credit: "Template designed by Steliant · Preview", news: "Drops and deals in your inbox", subscribe: "Subscribe", subscribed: "Demo subscription registered." },
    c: { sample: "Sample content", from: "From", off: "off" },
  },
};
let lang = store.get("sn-lang") || ((navigator.language || "es").startsWith("en") ? "en" : "es");
const t = () => T[lang];
const get = (p) => p.split(".").reduce((o, k) => (o == null ? o : o[k]), t());
const L = (o) => o[lang] || o.es;
const pName = (p) => (lang === "en" ? p.en : p.es)[0], pDesc = (p) => (lang === "en" ? p.en : p.es)[1];
const catName = (id) => L(CATS.find((c) => c.id === id));
const pr = (p) => (p.offer || p.price);
/* ---------- State ---------- */
const load = (k, d) => { try { return JSON.parse(store.get(k)) ?? d; } catch (e) { return d; } };
let cart = load("sn-cart", {}), favs = load("sn-favs", []), order = load("sn-order", null);
let current = "inicio", pid = "p01", filt = { cats: [], brands: [], max: 100000, stock: false, sort: "pop" };
const saveCart = () => store.set("sn-cart", JSON.stringify(cart));
const byId = (id) => PRODUCTS.find((p) => p.id === id);
const FREE = 15000;

/* ---------- Helpers ---------- */
let tt; const toast = (m) => { const e = $("#toast"); e.textContent = m; e.classList.add("is-on"); clearTimeout(tt); tt = setTimeout(() => e.classList.remove("is-on"), 3200); };
const chars = (lines) => lines.map((l, i) => `<span class="ln${i === lines.length - 1 ? " accent" : ""}">${l.split(" ").map((w) => `<span class="wd">${[...w].map((c) => `<span class="ch">${c}</span>`).join("")}</span>`).join(" ")}</span>`).join("");
const stars = (r) => `<span class="stars" style="--r:${(r / 5) * 100}%" aria-label="${r}/5">★★★★★</span>`;
const heartSvg = `<svg viewBox="0 0 24 24"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/></svg>`;
function card(p, i = 0) {
  const off = p.offer ? Math.round((1 - p.offer / p.price) * 100) : 0, fav = favs.includes(p.id);
  return `<article class="pc" data-flip-id="${p.id}" data-tilt style="--i:${i}">
    <a href="#producto-${p.id}" class="pc-img" data-cursor="${t().prod.add.split(" ")[0]}">${pic(p.imgs[0], "ph a", pName(p))}${pic(p.imgs[1], "ph b", "")}<span class="pc-tags">${p.tags.map((g) => `<i class="tg ${g}">${t().tags[g]}</i>`).join("")}</span>${off ? `<b class="pc-off">-${off}%</b>` : ""}</a>
    <button type="button" class="heart${fav ? " on" : ""}" data-fav="${p.id}" aria-pressed="${fav}" aria-label="Favorito">${heartSvg}</button>
    <div class="pc-body"><span class="pc-brand">${p.brand} · ${catName(p.cat)}</span><a href="#producto-${p.id}" class="pc-name">${pName(p)}</a>
      <div class="pc-specs">${Object.values(p.specs).slice(0, 3).map((v) => `<span>${v}</span>`).join("")}</div>
      <div class="pc-row"><div class="pc-price"><b>${money(pr(p))}</b>${p.offer ? `<s>${money(p.price)}</s>` : ""}</div>${stars(p.rating)}</div>
      <div class="pc-stock"><i style="--s:${Math.min(100, (p.stock / 120) * 100)}%"></i><small>${p.stock} ${t().prod.stock}</small></div>
    </div>
    <button type="button" class="pc-add" data-add="${p.id}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg><span>${t().prod.add}</span></button>
  </article>`;
}

/* ---------- Static render ---------- */
const VIEWS = [["inicio", "home"], ["catalogo", "shop"], ["ofertas", "deals"], ["favoritos", "favs"], ["panel", "admin"]];
function renderStatic() {
  document.documentElement.lang = lang;
  $$("[data-t]").forEach((el) => { const v = get(el.dataset.t); if (typeof v === "string") { if (el.tagName === "INPUT") el.placeholder = v; else el.textContent = v; } });
  $$("[data-split]").forEach((el) => (el.innerHTML = chars(get(el.dataset.split))));
  $$("img[data-src]").forEach((im) => { if (!im.getAttribute("src")) { im.src = IMG[im.dataset.src]; im.onerror = () => im.classList.add("broken"); } });
  $("#palQ").placeholder = t().nav.search;
  const tk = t().ticker.map((x) => `<span><b>✦</b>${x}</span>`).join(""); $("#tickerTrack").innerHTML = tk + tk + tk;
  $("#menuList").innerHTML = VIEWS.map(([id, k], i) => `<li><a href="#${id}" data-view="${id}"><span>0${i}</span>${t().nav[k]}</a></li>`).join("");
  $("#footNav").innerHTML = `<p class="eyebrow">Steliant Nova</p>` + VIEWS.map(([id, k]) => `<a href="#${id}">${t().nav[k]}</a>`).join("");
  $("#giant").innerHTML = "STELIANT NOVA".split("").map((c) => `<span>${c === " " ? "&nbsp;" : c}</span>`).join("");
  $("#megaIn").innerHTML = `<div class="mega-cats">${CATS.map((c, i) => `<a href="#catalogo" data-cat="${c.id}" class="mega-cat" style="--i:${i}"><span class="mc-img">${pic(c.img)}</span><b>${L(c)}</b><small>${PRODUCTS.filter((p) => p.cat === c.id).length} ${t().home.items}</small></a>`).join("")}</div>
    <a href="#producto-p13" class="mega-feat"><span class="mf-img">${pic(byId("p04").imgs[0])}</span><span class="tg sale">${t().tags.sale}</span><b>${pName(byId("p04"))}</b><em>${money(pr(byId("p04")))}</em></a>`;
  renderHero(); renderHome(); renderFilters(); renderShop(); renderDeals(); renderFavs(); renderDash(); renderCart(); renderOrderCard(); movePill(); markActive();
  if (current.startsWith("producto")) renderPdp();
}
function movePill() { $$("[data-lang]").forEach((b) => b.setAttribute("aria-pressed", b.dataset.lang === lang)); const on = $(`[data-lang="${lang}"]`), p = $("#seg .pill"); p.style.width = on.offsetWidth + "px"; p.style.transform = `translateX(${on.offsetLeft - 3}px)`; }

/* ---------- Hero ---------- */
const HERO = ["neon", "fluid", "setup"];
let heroI = 0;
function renderHero() {
  if (!$("#heroBg").children.length) $("#heroBg").innerHTML = HERO.map((k, i) => `<span class="hb${i === 0 ? " on" : ""}">${pic(IMG[k], "ph")}</span>`).join("");
  const feat = ["p01", "p04", "p03", "p05", "p10", "p04", "p08", "p02"].map(byId);
  $("#ring").innerHTML = feat.map((p, i) => `<a href="#producto-${p.id}" class="rc" style="--a:${i * 45}deg">${pic(p.imgs[0], "ph", pName(p))}<span><b>${pName(p).split("·")[0]}</b><em>${money(pr(p))}</em></span></a>`).join("");
  $("#heroStats").innerHTML = t().home.stats.map(([v, s, l]) => `<div><strong data-count="${v}" data-suffix="${s}">${v.toLocaleString("en-US")}${s}</strong><span>${l}</span></div>`).join("");
  buildCircuit();
}
function buildCircuit() {
  const svg = $("#circuit"); if (!svg || svg.children.length) return;
  let s = "", seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  for (let k = 0; k < 16; k++) {
    let x = rnd() < 0.5 ? -20 : 1460, y = 80 + rnd() * 760, d = `M${x} ${y}`; const dir = x < 0 ? 1 : -1;
    for (let j = 0; j < 4; j++) { x += dir * (120 + rnd() * 220); d += ` H${x.toFixed(0)}`; y += (rnd() - 0.5) * 220; d += ` V${y.toFixed(0)}`; }
    const len = 1600; s += `<path class="tr" d="${d}"/><path class="pulse-tr" d="${d}" style="--d:${(3 + rnd() * 5).toFixed(2)}s;--o:${(rnd() * -8).toFixed(2)}s"/><circle class="node" cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="4"/>`;
  }
  svg.innerHTML = s;
}
setInterval(() => {
  if (current !== "inicio") return;
  const hb = $$(".hb"); if (!hb.length) return; const prev = hb[heroI]; heroI = (heroI + 1) % hb.length; const next = hb[heroI];
  if (!hasG || reduce) { prev.classList.remove("on"); next.classList.add("on"); return; }
  next.classList.add("on"); next.style.zIndex = 2; prev.style.zIndex = 1;
  gsap.fromTo(next, { clipPath: "circle(0% at 70% 50%)" }, { clipPath: "circle(150% at 70% 50%)", duration: 1.8, ease: "expo.inOut", onComplete: () => { prev.classList.remove("on"); prev.style.zIndex = ""; } });
  gsap.fromTo(next.querySelector(".ph"), { scale: 1.3 }, { scale: 1.05, duration: 3, ease: "expo.out" });
}, 6000);
// Live voltage meter + waveform
let ph = 0;
setInterval(() => {
  const v = $("#volt"); if (!v || current !== "inicio") return;
  v.textContent = (1240 + Math.round(Math.random() * 60)).toLocaleString("en-US"); $("#navTag").textContent = `${v.textContent} ONLINE`;
}, 900);
if (!reduce) (function wave() { ph += 0.12; const w = $("#wave"); if (w && current === "inicio") { let d = "M0 15"; for (let x = 0; x <= 120; x += 3) d += ` L${x} ${(15 + Math.sin(x / 9 + ph) * 9 * Math.sin(ph / 4 + 1)).toFixed(1)}`; w.setAttribute("d", d); } requestAnimationFrame(wave); })();
// 3D product ring: auto-rotate + drag
let ringA = 0, ringV = 0.12, dragging = false, lastX = 0;
(function spin() { if (!dragging) { ringA += ringV; ringV += (0.12 - ringV) * 0.02; } const r = $("#ring"); if (r && current === "inicio") r.style.transform = `translateZ(-320px) rotateX(-8deg) rotateY(${ringA}deg)`; requestAnimationFrame(spin); })();
$("#ringWrap").addEventListener("pointerdown", (e) => { dragging = true; lastX = e.clientX; });
addEventListener("pointermove", (e) => { if (!dragging) return; const dx = e.clientX - lastX; lastX = e.clientX; ringA += dx * 0.35; ringV = dx * 0.35; });
addEventListener("pointerup", () => (dragging = false));

/* ---------- Home sections ---------- */
function renderHome() {
  $("#catGrid").innerHTML = CATS.map((c, i) => `<a href="#catalogo" class="cat${i === 0 ? " big" : i === 7 ? " wide" : ""}" data-cat="${c.id}" data-cursor="${L(c)}"><span class="cat-img">${pic(c.img)}</span><span class="cat-n">0${i + 1}</span><b>${L(c)}</b><small>${PRODUCTS.filter((p) => p.cat === c.id).length} ${t().home.items}</small><svg class="cat-arr" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M5 19L19 5M8 5h11v11"/></svg></a>`).join("");
  $("#ftrack").innerHTML = [...PRODUCTS].sort((a, b) => b.sold - a.sold).slice(0, 8).map((p, i) => `<div class="fwrap"><span class="frank">#${i + 1}</span>${card(p, i)}</div>`).join("");
  $("#steps3").innerHTML = t().home.steps.map(([a, b], i) => `<li><span>0${i + 1}</span><b>${a}</b><small>${b}</small></li>`).join("");
  $("#mosaic").innerHTML = ["setup", "watch", "prism", "buds", "keys", "desk", "drone"].map((k, i) => `<figure class="mo m${i}" data-speed="${[-14, 10, -6, 16, -10, 8, -18][i]}">${pic(IMG[k])}</figure>`).join("");
  $("#qGrid").innerHTML = t().home.quotes.map(([q, n, r]) => `<figure class="q-card" data-tilt><span class="q-mark">“</span><blockquote>${q}</blockquote><figcaption><b>${n}</b><small>${r}</small></figcaption></figure>`).join("");
  const br = [...new Set(PRODUCTS.map((p) => p.brand))].map((b) => `<span>${b}</span>`).join("<i>✦</i>"); $("#brands").innerHTML = br + "<i>✦</i>" + br + "<i>✦</i>";
}

/* ---------- Catalog ---------- */
function renderFilters() {
  const brands = [...new Set(PRODUCTS.map((p) => p.brand))].sort();
  const S = t().shop;
  $("#filtersSide").innerHTML = `<div class="fs-head"><b>${S.filters}</b><button type="button" class="link" data-clear>${S.clear}</button></div>
    <div class="fs-group"><p class="eyebrow">${S.cats}</p>${CATS.map((c) => `<label class="chk"><input type="checkbox" data-fcat="${c.id}" ${filt.cats.includes(c.id) ? "checked" : ""}><i></i>${L(c)}<em>${PRODUCTS.filter((p) => p.cat === c.id).length}</em></label>`).join("")}</div>
    <div class="fs-group"><p class="eyebrow">${S.price}: <b id="maxOut">${money(filt.max)}</b></p><input type="range" class="range" id="maxR" min="4000" max="100000" step="500" value="${filt.max}"></div>
    <div class="fs-group"><p class="eyebrow">${S.brands}</p><div class="bchips">${brands.map((b) => `<button type="button" class="bchip${filt.brands.includes(b) ? " on" : ""}" data-fbrand="${b}">${b}</button>`).join("")}</div></div>
    <label class="switch"><input type="checkbox" id="stockOnly" ${filt.stock ? "checked" : ""}><i></i>${S.stock}</label>`;
  $("#sortSel").innerHTML = Object.entries(S.sorts).map(([k, v]) => `<option value="${k}" ${k === filt.sort ? "selected" : ""}>${v}</option>`).join("");
}
function filtered() {
  let l = PRODUCTS.filter((p) => (!filt.cats.length || filt.cats.includes(p.cat)) && (!filt.brands.length || filt.brands.includes(p.brand)) && pr(p) <= filt.max && (!filt.stock || p.stock > 15));
  const s = { pop: (a, b) => b.sold - a.sold, low: (a, b) => pr(a) - pr(b), high: (a, b) => pr(b) - pr(a), rate: (a, b) => b.rating - a.rating }[filt.sort];
  return l.sort(s);
}
function renderShop(flip) {
  const st = flip && hasG && !reduce && typeof Flip !== "undefined" ? Flip.getState("#pgrid .pc") : null;
  const l = filtered();
  $("#resCount").innerHTML = `<b>${l.length}</b> ${t().shop.results}`;
  $("#pgrid").innerHTML = l.length ? l.map(card).join("") : `<p class="empty">${t().shop.none}</p>`;
  if (st) Flip.from(st, { duration: 0.8, ease: "expo.inOut", absolute: true, scale: true, onEnter: (els) => gsap.fromTo(els, { opacity: 0, scale: 0.7, y: 40 }, { opacity: 1, scale: 1, y: 0, duration: 0.7, stagger: 0.03 }), onLeave: (els) => gsap.to(els, { opacity: 0, scale: 0.7, duration: 0.35 }) });
}
document.addEventListener("change", (e) => {
  const c = e.target.dataset.fcat; if (c) { filt.cats = e.target.checked ? [...filt.cats, c] : filt.cats.filter((x) => x !== c); renderShop(true); }
  if (e.target.id === "stockOnly") { filt.stock = e.target.checked; renderShop(true); }
  if (e.target.id === "sortSel") { filt.sort = e.target.value; renderShop(true); }
  if (e.target.id === "maxR") renderShop(true);
});
document.addEventListener("input", (e) => { if (e.target.id === "maxR") { filt.max = +e.target.value; $("#maxOut").textContent = money(filt.max); } });
document.addEventListener("click", (e) => {
  const b = e.target.closest("[data-fbrand]"); if (b) { const x = b.dataset.fbrand; filt.brands = filt.brands.includes(x) ? filt.brands.filter((y) => y !== x) : [...filt.brands, x]; b.classList.toggle("on"); renderShop(true); }
  if (e.target.closest("[data-clear]")) { filt = { cats: [], brands: [], max: 100000, stock: false, sort: filt.sort }; renderFilters(); renderShop(true); }
  const cc = e.target.closest("[data-cat]"); if (cc) { filt.cats = [cc.dataset.cat]; renderFilters(); renderShop(); closeMega(); }
});

/* ---------- Product page ---------- */
function renderPdp() {
  const p = byId(pid), P2 = t().prod, off = p.offer ? p.price - p.offer : 0;
  const rel = PRODUCTS.filter((x) => x.cat === p.cat && x.id !== p.id).concat(PRODUCTS.filter((x) => x.cat !== p.cat)).slice(0, 4);
  $("#pdp").innerHTML = `<a href="#catalogo" class="back">← ${P2.back}</a>
  <div class="pdp-grid">
    <div class="gal"><div class="gal-main" id="galMain" data-cursor="${P2.zoom}">${pic(p.imgs[0], "ph", pName(p))}<span class="lens" id="lens"></span></div><div class="gal-thumbs">${p.imgs.map((im, i) => `<button type="button" class="${i === 0 ? "on" : ""}" data-thumb="${i}">${pic(im)}</button>`).join("")}</div></div>
    <div class="pdp-info">
      <p class="eyebrow">${p.brand} · ${catName(p.cat)}</p>
      <h1 class="chars pdp-title">${chars([pName(p)])}</h1>
      <div class="pdp-rate">${stars(p.rating)}<span>${p.rating} · ${p.sold} ${P2.reviews}</span><span class="sku">${P2.sku} SN-${p.id.toUpperCase()}</span></div>
      <div class="pdp-price"><b>${money(pr(p))}</b>${p.offer ? `<s>${money(p.price)}</s><em>${P2.save} ${money(off)}</em>` : ""}</div>
      <p class="pdp-desc">${pDesc(p)}</p>
      <div class="pdp-stock"><span class="dot"></span>${p.stock} ${P2.stock}<i style="--s:${Math.min(100, (p.stock / 120) * 100)}%"></i></div>
      <div class="pdp-buy"><div class="stepper big"><button type="button" data-q="-1">−</button><b id="qty">1</b><button type="button" data-q="1">+</button></div><button type="button" class="btn btn-accent magnetic pdp-add" data-add="${p.id}" data-qty><span>${P2.add}</span></button><button type="button" class="heart big${favs.includes(p.id) ? " on" : ""}" data-fav="${p.id}" aria-label="Favorito">${heartSvg}</button></div>
      <ul class="perks"><li>🚚 ${P2.ship}</li><li>🛡️ ${P2.warranty}</li></ul>
      <div class="datasheet"><p class="eyebrow">${P2.specs}</p><dl>${Object.entries(p.specs).map(([k, v]) => `<div><dt>${SPEC_LABEL[lang][k] || k}</dt><dd>${v}</dd></div>`).join("")}</dl></div>
    </div>
  </div>
  <div class="related"><div class="sec-title"><h2 class="chars">${chars([P2.related])}</h2></div><div class="pgrid wide">${rel.map(card).join("")}</div></div>`;
}
document.addEventListener("click", (e) => {
  const th = e.target.closest("[data-thumb]"); if (th) { const p = byId(pid), im = $("#galMain .ph"); $$("[data-thumb]").forEach((b) => b.classList.toggle("on", b === th)); hasG && !reduce ? gsap.to(im, { opacity: 0, scale: 1.08, duration: 0.25, onComplete: () => { im.src = p.imgs[+th.dataset.thumb]; gsap.to(im, { opacity: 1, scale: 1, duration: 0.6, ease: "expo.out" }); } }) : (im.src = p.imgs[+th.dataset.thumb]); }
  const q = e.target.closest("[data-q]"); if (q) { const el = $("#qty"); el.textContent = Math.max(1, Math.min(99, +el.textContent + +q.dataset.q)); hasG && gsap.fromTo(el, { scale: 1.5 }, { scale: 1, duration: 0.4, ease: "back.out(3)" }); }
});
document.addEventListener("mousemove", (e) => {
  const g = e.target.closest("#galMain"); if (!g) return; const r = g.getBoundingClientRect(), x = ((e.clientX - r.left) / r.width) * 100, y = ((e.clientY - r.top) / r.height) * 100;
  const lens = $("#lens"); lens.style.left = e.clientX - r.left + "px"; lens.style.top = e.clientY - r.top + "px"; lens.style.backgroundImage = `url("${$("#galMain .ph").src}")`; lens.style.backgroundPosition = `${x}% ${y}%`;
});

/* ---------- Deals, favorites ---------- */
function renderDeals() { $("#dealsGrid").innerHTML = PRODUCTS.filter((p) => p.offer).sort((a, b) => b.price - b.offer - (a.price - a.offer)).map(card).join(""); }
function renderFavs() { const l = favs.map(byId).filter(Boolean); $("#favGrid").innerHTML = l.length ? l.map(card).join("") : `<p class="empty">${t().favs.empty}</p>`; $("#favCount").textContent = favs.length; $("#favCount").hidden = !favs.length; }
setInterval(() => {
  const el = $("#countdown"); if (!el) return; const d = new Date(), e2 = new Date(d); e2.setDate(d.getDate() + ((7 - d.getDay()) % 7 || 7)); e2.setHours(0, 0, 0, 0);
  let s = Math.floor((e2 - d) / 1000); const parts = [Math.floor(s / 86400), Math.floor(s / 3600) % 24, Math.floor(s / 60) % 60, s % 60];
  el.innerHTML = `<small>${t().deals.ends}</small>` + parts.map((n, i) => `<span><b>${String(n).padStart(2, "0")}</b>${["d", "h", "m", "s"][i]}</span>`).join("");
}, 1000);
document.addEventListener("click", (e) => {
  const h = e.target.closest("[data-fav]"); if (!h) return; e.preventDefault();
  const id = h.dataset.fav, on = !favs.includes(id); favs = on ? [...favs, id] : favs.filter((x) => x !== id); store.set("sn-favs", JSON.stringify(favs));
  $$(`[data-fav="${id}"]`).forEach((b) => { b.classList.toggle("on", on); b.setAttribute("aria-pressed", on); });
  if (on && hasG && !reduce) { gsap.fromTo(h, { scale: 0.6 }, { scale: 1, duration: 0.6, ease: "elastic.out(1,.4)" }); const r = h.getBoundingClientRect(); for (let k = 0; k < 10; k++) { const d = document.createElement("i"); d.className = "spark"; document.body.appendChild(d); const a = (k / 10) * Math.PI * 2; gsap.fromTo(d, { x: r.left + r.width / 2, y: r.top + r.height / 2, scale: 1 }, { x: r.left + r.width / 2 + Math.cos(a) * 40, y: r.top + r.height / 2 + Math.sin(a) * 40, scale: 0, duration: 0.7, ease: "expo.out", onComplete: () => d.remove() }); } }
  $("#favCount").textContent = favs.length; $("#favCount").hidden = !favs.length; hasG && gsap.fromTo("#favCount", { scale: 1.8 }, { scale: 1, duration: 0.5, ease: "back.out(3)" });
  if (current === "favoritos") renderFavs();
});

/* ---------- Cart ---------- */
const cartLines = () => Object.entries(cart).map(([id, q]) => ({ p: byId(id), q })).filter((l) => l.p);
const subtotal = () => cartLines().reduce((s, l) => s + pr(l.p) * l.q, 0);
const shipping = () => (subtotal() >= FREE || !subtotal() ? 0 : 450);
function renderCart() {
  const C = t().cart, lines = cartLines(), sub = subtotal(), pct = Math.min(100, (sub / FREE) * 100);
  $("#cartCount").textContent = lines.reduce((s, l) => s + l.q, 0); $("#cartTotal").textContent = money(sub);
  $("#cartPanel").innerHTML = `<div class="cd-head"><b>${C.title}</b><button type="button" class="icon-btn" data-cart-close aria-label="Cerrar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>
    <div class="freebar"><p>${sub >= FREE ? C.gotFree : C.toFree.replace("{x}", money(FREE - sub))}</p><span><i style="width:${pct}%"></i><em style="left:${pct}%">✦</em></span></div>
    ${lines.length ? `<ul class="cl">${lines.map(({ p, q }) => `<li><span class="cl-img">${pic(p.imgs[0])}</span><div><b>${pName(p)}</b><small>${p.brand} · ${money(pr(p))}</small><div class="stepper sm"><button type="button" data-cq="${p.id}|-1">−</button><b>${q}</b><button type="button" data-cq="${p.id}|1">+</button></div></div><div class="cl-r"><b>${money(pr(p) * q)}</b><button type="button" class="link" data-cq="${p.id}|0">${C.remove}</button></div></li>`).join("")}</ul>` : `<div class="cart-empty"><svg viewBox="0 0 120 80"><path d="M10 60 H40 L52 30 L68 70 L80 50 H110" fill="none" stroke="currentColor" stroke-width="3" stroke-dasharray="6 6"/></svg><p>${C.empty}</p></div>`}
    <div class="cd-foot"><div><span>${C.subtotal}</span><b>${money(sub)}</b></div><div><span>${C.ship}</span><b>${shipping() ? money(shipping()) : C.free}</b></div><button type="button" class="btn btn-accent" data-checkout ${lines.length ? "" : "disabled"}>${C.checkout}</button><button type="button" class="link" data-cart-close>${C.keep}</button></div>`;
}
function addToCart(id, q, from) {
  cart[id] = (cart[id] || 0) + q; saveCart(); renderCart();
  toast(`${t().prod.added} · ${pName(byId(id))}`);
  if (!hasG || reduce || !from) return;
  const img = from.closest(".pc, .pdp-grid")?.querySelector(".ph"), cb = $("#cartBtn").getBoundingClientRect();
  if (img) { const r = img.getBoundingClientRect(), c = img.cloneNode(); c.className = "fly"; Object.assign(c.style, { left: r.left + "px", top: r.top + "px", width: r.width + "px", height: r.height + "px" }); document.body.appendChild(c);
    gsap.to(c, { left: cb.left + cb.width / 2 - 20, top: cb.top + cb.height / 2 - 20, width: 40, height: 40, borderRadius: 40, rotate: 25, duration: 0.9, ease: "power3.in", onComplete: () => { c.remove(); gsap.fromTo("#cartBtn", { scale: 1.2 }, { scale: 1, duration: 0.6, ease: "elastic.out(1,.4)" }); gsap.fromTo("#cartCount", { y: -10, scale: 1.6 }, { y: 0, scale: 1, duration: 0.5, ease: "back.out(3)" }); } }); }
}
function openCart() { renderCart(); $("#cartDrawer").classList.add("is-open"); document.body.classList.add("lock"); hasG && !reduce && gsap.from(".cl li", { x: 60, opacity: 0, stagger: 0.06, duration: 0.7, ease: "expo.out", delay: 0.25 }); }
function closeCart() { $("#cartDrawer").classList.remove("is-open"); document.body.classList.remove("lock"); }
document.addEventListener("click", (e) => {
  const a = e.target.closest("[data-add]"); if (a) { e.preventDefault(); addToCart(a.dataset.add, a.hasAttribute("data-qty") ? +$("#qty").textContent : 1, a); return; }
  if (e.target.closest("#cartBtn")) return openCart();
  if (e.target.closest("[data-cart-close]")) return closeCart();
  const q = e.target.closest("[data-cq]"); if (q) { const [id, d] = q.dataset.cq.split("|"); const n = +d === 0 ? 0 : (cart[id] || 0) + +d; if (n <= 0) delete cart[id]; else cart[id] = n; saveCart(); renderCart(); }
  if (e.target.closest("[data-checkout]")) { closeCart(); setTimeout(openCo, 350); }
});

/* ---------- Checkout ---------- */
let coStep = 0, pay = "card", ship = { name: "", phone: "", address: "", city: "Santo Domingo" }, cardD = { num: "", holder: "", exp: "", cvc: "" };
const brandOf = (n) => (/^4/.test(n) ? "VISA" : /^5[1-5]|^2[2-7]/.test(n) ? "MASTERCARD" : /^3[47]/.test(n) ? "AMEX" : "");
const itbis = () => Math.round(subtotal() * 0.18);
function renderCo() {
  const C = t().co, lines = cartLines(), total = subtotal() + itbis() + shipping();
  $("#coSum").innerHTML = `<p class="eyebrow">${C.title}</p><ul class="co-items">${lines.map(({ p, q }) => `<li><span class="ci-img">${pic(p.imgs[0])}<em>${q}</em></span><b>${pName(p)}</b><span>${money(pr(p) * q)}</span></li>`).join("")}</ul>
    <dl><div><dt>${t().cart.subtotal}</dt><dd>${money(subtotal())}</dd></div><div><dt>${C.itbis}</dt><dd>${money(itbis())}</dd></div><div><dt>${t().cart.ship}</dt><dd>${shipping() ? money(shipping()) : t().cart.free}</dd></div></dl>
    <div class="co-total"><span>${C.total}</span><b>${money(total)}</b></div><p class="co-secure">🔒 ${C.secure}</p>`;
  const steps = `<div class="co-steps">${C.steps.map((s, i) => `<span class="${i === coStep ? "on" : i < coStep ? "done" : ""}"><b>${i + 1}</b>${s}</span>`).join("<i></i>")}</div>`;
  if (coStep === 0) {
    $("#coMain").innerHTML = `<h3>${C.title}</h3>${steps}<div class="fl-grid">${[["name", C.name, "wide"], ["phone", C.phone, ""], ["city", C.city, ""], ["address", C.address, "wide"]].map(([k, l, w]) => `<div class="fl ${w}${ship[k].trim().length > 2 ? " valid" : ""}"><input id="sh-${k}" data-sh="${k}" placeholder=" " value="${ship[k]}" autocomplete="off"><label for="sh-${k}">${l}</label><i class="ok"></i></div>`).join("")}</div>
      <div class="mini-map" aria-hidden="true"><svg viewBox="0 0 400 120"><path d="M0 90 C 80 40, 160 110, 240 60 S 360 30, 400 50" class="mm-road"/><circle cx="330" cy="40" r="7" class="mm-pin"/></svg><span>${ship.city}</span></div>
      <button type="button" class="paybtn" data-co-next><span class="pb-label">${C.next}</span></button>`;
  } else {
    const br = brandOf(cardD.num.replace(/\s/g, ""));
    $("#coMain").innerHTML = `<h3>${C.title}</h3>${steps}<div class="co-methods">${[["card", C.card2], ["transfer", C.transfer], ["cod", C.cod]].map(([k, l]) => `<button type="button" class="${pay === k ? "on" : ""}" data-pay="${k}">${l}</button>`).join("")}<span class="co-ink"></span></div>
      ${pay === "card" ? `<div class="holo" id="holo" data-brand="${br}"><div class="holo-in"><div class="hf"><span class="cc-chip"></span><span class="hbr" id="hBrand">${br || "STELIANT"}</span><span class="hn" id="hNum">${cardD.num || "•••• •••• •••• ••••"}</span><span class="hr"><span id="hHolder">${cardD.holder || C.holder}</span><span id="hExp">${cardD.exp || "MM/AA"}</span></span></div><div class="hk"><span class="cc-stripe"></span><span class="cc-cvc" id="hCvc">${cardD.cvc || "•••"}</span></div></div></div>
        <div class="fl-grid">${[["num", C.card, "wide"], ["holder", C.holder, "wide"], ["exp", C.exp, ""], ["cvc", C.cvc, ""]].map(([k, l, w]) => `<div class="fl ${w}"><input id="cc-${k}" data-cc="${k}" inputmode="${k === "holder" ? "text" : "numeric"}" placeholder=" " value="${cardD[k]}" autocomplete="off"><label for="cc-${k}">${l}</label><i class="ok"></i></div>`).join("")}</div>`
      : `<div class="alt-pay"><span>${pay === "transfer" ? "🏦" : "💵"}</span><p>${pay === "transfer" ? C.transferTxt : C.codTxt}</p></div>`}
      <div class="co-actions"><button type="button" class="btn btn-ghost" data-co-back>${C.back}</button><button type="button" class="paybtn" id="payBtn"><span class="pb-label">${C.pay} ${money(total)}</span><svg class="pb-ring" viewBox="0 0 40 40"><circle cx="20" cy="20" r="16"/></svg><svg class="pb-check" viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></button></div>
      <div class="packing" id="packing" hidden><svg viewBox="0 0 200 140" class="box"><path class="box-body" d="M40 60 L100 40 L160 60 L160 120 L100 140 L40 120 Z"/><path class="box-mid" d="M40 60 L100 80 L160 60 M100 80 V140"/><path class="flap-l" d="M40 60 L100 80 L70 95 L10 75 Z"/><path class="flap-r" d="M160 60 L100 80 L130 95 L190 75 Z"/><path class="tape" d="M100 80 V140"/></svg><p>${C.packing}</p></div>`;
    markCard();
  }
  if (hasG && !reduce) { const on = $(".co-methods .on"), ink = $(".co-ink"); if (on && ink) gsap.to(ink, { x: on.offsetLeft - 4, width: on.offsetWidth, duration: 0.5, ease: "expo.out" }); gsap.from("#coMain > *", { y: 20, opacity: 0, stagger: 0.04, duration: 0.6, ease: "expo.out" }); }
}
function markCard() { const v = { num: cardD.num.replace(/\s/g, "").length >= 15, holder: cardD.holder.trim().length > 2, exp: /^(0[1-9]|1[0-2])\/\d{2}$/.test(cardD.exp), cvc: cardD.cvc.length >= 3 }; Object.entries(v).forEach(([k, ok]) => { const el = $(`[data-cc="${k}"]`); if (el) el.parentElement.classList.toggle("valid", ok); }); return Object.values(v).every(Boolean); }
function openCo() { coStep = 0; renderCo(); $("#co").classList.add("is-open"); document.body.classList.add("lock"); hasG && !reduce && gsap.fromTo(".co-panel", { y: 80, rotateX: 12, opacity: 0 }, { y: 0, rotateX: 0, opacity: 1, duration: 1, ease: "expo.out" }); }
function closeCo() { $("#co").classList.remove("is-open"); document.body.classList.remove("lock"); }
document.addEventListener("click", (e) => {
  if (e.target.closest("[data-co-close]") && !$("#co").classList.contains("busy")) return closeCo();
  if (e.target.closest("[data-co-next]")) { if (["name", "phone", "address"].some((k) => ship[k].trim().length < 3)) { toast(t().co.need); hasG && gsap.fromTo(".fl-grid", { x: -10 }, { x: 0, duration: 0.5, ease: "elastic.out(1,.3)" }); return; } coStep = 1; renderCo(); hasG && !reduce && gsap.fromTo("#holo", { rotateY: -40 }, { rotateY: 0, duration: 1.4, ease: "elastic.out(1,.6)" }); return; }
  if (e.target.closest("[data-co-back]")) { coStep = 0; renderCo(); return; }
  const pm = e.target.closest("[data-pay]"); if (pm) { pay = pm.dataset.pay; renderCo(); return; }
  if (e.target.closest("#payBtn")) placeOrder();
});
document.addEventListener("input", (e) => {
  const k = e.target.dataset.sh; if (k) { ship[k] = e.target.value; e.target.parentElement.classList.toggle("valid", ship[k].trim().length > 2); if (k === "city") { const s = $(".mini-map span"); if (s) s.textContent = ship.city; } }
  const c = e.target.dataset.cc; if (!c) return; let v = e.target.value;
  if (c === "num") v = v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  if (c === "exp") { const d = v.replace(/\D/g, "").slice(0, 4); v = d.length > 2 ? d.slice(0, 2) + "/" + d.slice(2) : d; }
  if (c === "cvc") v = v.replace(/\D/g, "").slice(0, 4); if (c === "holder") v = v.toUpperCase();
  e.target.value = v; cardD[c] = v;
  const m = { num: ["#hNum", "•••• •••• •••• ••••"], holder: ["#hHolder", t().co.holder], exp: ["#hExp", "MM/AA"], cvc: ["#hCvc", "•••"] }; const el = $(m[c][0]); if (el) el.textContent = v || m[c][1];
  if (c === "num") { const br = brandOf(v.replace(/\s/g, "")), hb = $("#hBrand"); if (hb && hb.textContent !== (br || "STELIANT")) { hb.textContent = br || "STELIANT"; $("#holo").dataset.brand = br; hasG && gsap.fromTo(hb, { y: -14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "back.out(2)" }); } }
  markCard();
});
document.addEventListener("focusin", (e) => { if (e.target.dataset.cc === "cvc") $("#holo")?.classList.add("flip"); });
document.addEventListener("focusout", (e) => { if (e.target.dataset.cc === "cvc") $("#holo")?.classList.remove("flip"); });
document.addEventListener("mousemove", (e) => { const h = e.target.closest("#holo"); if (!h) return; const r = h.getBoundingClientRect(), px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height; h.style.setProperty("--rx", `${(0.5 - py) * 16}deg`); h.style.setProperty("--ry", `${(px - 0.5) * 22}deg`); h.style.setProperty("--gx", px * 100 + "%"); h.style.setProperty("--gy", py * 100 + "%"); });
function placeOrder() {
  const C = t().co;
  if (pay === "card" && !markCard()) { toast(C.needCard); hasG && gsap.fromTo(".fl-grid", { x: -10 }, { x: 0, duration: 0.5, ease: "elastic.out(1,.3)" }); return; }
  const btn = $("#payBtn"), co = $("#co"); co.classList.add("busy"); btn.classList.add("processing"); btn.querySelector(".pb-label").textContent = C.processing;
  setTimeout(() => {
    btn.classList.remove("processing"); btn.classList.add("done"); btn.querySelector(".pb-label").textContent = C.approved;
    setTimeout(() => {
      const pk = $("#packing"); pk.hidden = false;
      if (hasG && !reduce) { gsap.timeline().from(".box", { y: 60, opacity: 0, duration: 0.6, ease: "back.out(2)" }).fromTo(".flap-l", { rotate: -60, transformOrigin: "100px 80px" }, { rotate: 0, duration: 0.5, ease: "power2.out" }).fromTo(".flap-r", { rotate: 60, transformOrigin: "100px 80px" }, { rotate: 0, duration: 0.5, ease: "power2.out" }, "<0.1").fromTo(".tape", { strokeDashoffset: 60 }, { strokeDashoffset: 0, duration: 0.5 }); }
      setTimeout(() => {
        const lines = cartLines();
        order = { no: "SN-" + Math.floor(10000 + Math.random() * 89999), items: lines.map((l) => ({ id: l.p.id, q: l.q })), total: subtotal() + itbis() + shipping(), at: Date.now(), city: ship.city };
        store.set("sn-order", JSON.stringify(order)); cart = {}; saveCart(); renderCart();
        co.classList.remove("busy"); closeCo(); cardD = { num: "", holder: "", exp: "", cvc: "" };
        go("inicio");
        setTimeout(() => { renderOrderCard(); toast(C.done); showFab(true); hasG && !reduce && gsap.fromTo("#orderCard", { y: 60, opacity: 0, scale: 0.96 }, { y: 0, opacity: 1, scale: 1, duration: 1.2, ease: "expo.out", delay: 0.5 }); }, 1400);
      }, 2600);
    }, 900);
  }, 1800);
}

/* ---------- Order card + FAB ---------- */
function orderStage() { if (!order) return 0; const m = (Date.now() - order.at) / 60000; return m < 2 ? 1 : m < 10 ? 2 : 3; }
function renderOrderCard() {
  const el = $("#orderCard"); if (!order) { el.hidden = true; $("#fab").hidden = true; return; }
  const O = t().order, st = orderStage(), items = order.items.reduce((s, i) => s + i.q, 0), eta = new Date(order.at + 864e5);
  el.hidden = false;
  el.innerHTML = `<div class="oc-head"><div><p class="eyebrow">${O.title}</p><b>${O.number} ${order.no}</b><small>${items} ${O.items} · ${money(order.total)} · ${order.city}</small></div><div class="oc-thumbs">${order.items.slice(0, 4).map((i) => `<span>${pic(byId(i.id).imgs[0])}</span>`).join("")}</div></div>
    <div class="oc-track"><span class="oc-line"><i style="width:${(st / 3) * 100}%"></i><em class="oc-truck" style="left:${(st / 3) * 100}%">🚚</em></span>${O.steps.map((s, i) => `<div class="${i < st ? "done" : i === st ? "now" : ""}"><span></span><b>${s}</b></div>`).join("")}</div>
    <p class="oc-eta">${O.eta}: <b>${eta.toLocaleDateString(lang === "en" ? "en-US" : "es-DO", { weekday: "long", day: "numeric", month: "long" })}</b></p>`;
  showFab(false);
}
function showFab(b) { const f = $("#fab"); if (!order) return; f.hidden = false; if (b && hasG && !reduce) gsap.fromTo(f, { scale: 0, rotate: -40 }, { scale: 1, rotate: 0, duration: 1.2, ease: "elastic.out(1,.5)" }); }
$("#fab").addEventListener("click", () => { if (current !== "inicio") go("inicio"); setTimeout(() => { const c = $("#orderCard"); scrollTo({ top: c.getBoundingClientRect().top + scrollY - 120, behavior: "smooth" }); hasG && gsap.fromTo(c, { boxShadow: "0 0 0 0 rgba(139,109,255,.8)" }, { boxShadow: "0 0 0 18px rgba(139,109,255,0)", duration: 1.2, repeat: 1 }); }, current === "inicio" ? 0 : 1600); });
setInterval(() => { if (order && current === "inicio") { const st = orderStage(), i = $(".oc-line i"); if (i && i.style.width !== `${(st / 3) * 100}%`) renderOrderCard(); } }, 5000);

/* ---------- Dashboard ---------- */
function renderDash() {
  const A = t().admin, sales = [182, 210, 196, 248, 265, 241, 290, 312, 298, 345, 372, 410], months = lang === "en" ? ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"] : ["E", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
  const W = 640, H = 220, mx = Math.max(...sales) * 1.1, xs = (i) => 30 + (i / 11) * (W - 50), ys = (v) => H - 24 - (v / mx) * (H - 44);
  const path = sales.map((v, i) => `${i ? "L" : "M"}${xs(i).toFixed(1)} ${ys(v).toFixed(1)}`).join(" ");
  const kv = [[4120000, "RD$"], [1284, ""], [32090, "RD$"], [846, ""]];
  const byCat = CATS.slice(0, 6).map((c, i) => [L(c), [34, 26, 18, 9, 7, 6][i]]);
  const rows = [["SN-48213", "Camila Rojas", 64900, "ship"], ["SN-48212", "Luis Martínez", 8490, "paid"], ["SN-48211", "Estudio Prisma", 179800, "prep"], ["SN-48210", "María Peña", 4990, "done"], ["SN-48209", "Andrés Mejía", 89900, "done"]];
  $("#dash").innerHTML = `<div class="kpis">${A.kpis.map(([l, pre], i) => `<div class="kpi"><small>${l}</small><b>${pre}<span data-count="${kv[i][0]}">${kv[i][0].toLocaleString("en-US")}</span></b><em class="up">▲ ${[12, 8, 4, 19][i]}%</em><svg viewBox="0 0 100 30" class="spark-l"><path d="M0 ${25 - i * 2} ${sales.slice(4).map((v, k) => `L${(k + 1) * 12.5} ${(30 - (v / mx) * 28).toFixed(1)}`).join(" ")}"/></svg></div>`).join("")}</div>
    <div class="dash-grid">
      <div class="panel chart"><p class="eyebrow">${A.sales}</p><svg viewBox="0 0 ${W} ${H}" class="line-chart"><defs><linearGradient id="lg" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="var(--accent)" stop-opacity=".35"/><stop offset="1" stop-color="var(--accent)" stop-opacity="0"/></linearGradient></defs>${[0, 1, 2, 3].map((k) => `<line x1="30" x2="${W - 20}" y1="${20 + k * 50}" y2="${20 + k * 50}" class="grid-l"/>`).join("")}<path d="${path} L${xs(11)} ${H - 24} L${xs(0)} ${H - 24} Z" fill="url(#lg)" class="area"/><path d="${path}" class="line"/>${sales.map((v, i) => `<circle cx="${xs(i)}" cy="${ys(v)}" r="${i === 11 ? 6 : 3.5}" class="pt${i === 11 ? " last" : ""}"/><text x="${xs(i)}" y="${H - 6}" class="mx">${months[i]}</text>`).join("")}<text x="${xs(11) - 8}" y="${ys(410) - 14}" text-anchor="end" class="val">RD$4.1M</text></svg></div>
      <div class="panel bars"><p class="eyebrow">${A.byCat}</p>${byCat.map(([n, v]) => `<div class="bar"><span>${n}</span><i><b style="--w:${v * 2.4}%"></b></i><em>${v}%</em></div>`).join("")}</div>
      <div class="panel orders"><p class="eyebrow">${A.orders}</p><table><thead><tr><th>#</th><th>${A.client}</th><th>${A.amount}</th><th>${A.state}</th></tr></thead><tbody>${rows.map(([n, c, a, s]) => `<tr><td>${n}</td><td>${c}</td><td>${money(a)}</td><td><span class="st ${s}">${A.status[s]}</span></td></tr>`).join("")}</tbody></table></div>
      <div class="panel lowst"><p class="eyebrow">${A.low}</p>${PRODUCTS.filter((p) => p.stock < 22).sort((a, b) => a.stock - b.stock).map((p) => `<div class="ls"><span class="ls-img">${pic(p.imgs[0])}</span><div><b>${pName(p)}</b><i><em style="--s:${(p.stock / 22) * 100}%"></em></i></div><small>${p.stock} ${A.units}</small></div>`).join("")}</div>
    </div>`;
}

/* ---------- Search palette ---------- */
function openPal() { $("#pal").classList.add("is-open"); document.body.classList.add("lock"); const q = $("#palQ"); q.value = ""; renderPal(""); setTimeout(() => q.focus(), 50); hasG && !reduce && gsap.fromTo(".pal-box", { y: -30, scale: 0.96, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: 0.6, ease: "expo.out" }); }
function closePal() { $("#pal").classList.remove("is-open"); document.body.classList.remove("lock"); }
function renderPal(q) {
  q = q.toLowerCase().trim(); const l = PRODUCTS.filter((p) => !q || (pName(p) + p.brand + catName(p.cat) + Object.values(p.specs).join(" ")).toLowerCase().includes(q)).slice(0, 7);
  $("#palRes").innerHTML = l.length ? l.map((p, i) => `<a href="#producto-${p.id}" class="pr-row${i === 0 ? " on" : ""}"><span class="pr-img">${pic(p.imgs[0])}</span><span><b>${pName(p)}</b><small>${p.brand} · ${catName(p.cat)} · ${Object.values(p.specs)[0]}</small></span><em>${money(pr(p))}</em></a>`).join("") : `<p class="empty">${t().shop.none}</p>`;
}
$("#searchBtn").addEventListener("click", openPal);
$("#palQ").addEventListener("input", (e) => renderPal(e.target.value));
$("#palQ").addEventListener("keydown", (e) => { if (e.key === "Enter") { const a = $(".pr-row.on"); if (a) { go(a.getAttribute("href").slice(1)); closePal(); } } if (e.key === "ArrowDown" || e.key === "ArrowUp") { e.preventDefault(); const rows = $$(".pr-row"), i = rows.findIndex((r) => r.classList.contains("on")); if (!rows.length) return; rows[i]?.classList.remove("on"); rows[(i + (e.key === "ArrowDown" ? 1 : -1) + rows.length) % rows.length].classList.add("on"); } });
document.addEventListener("click", (e) => { if (e.target.closest("[data-pal-close]") || e.target.closest(".pr-row")) closePal(); });
addEventListener("keydown", (e) => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); openPal(); } if (e.key === "Escape") { closePal(); closeCart(); if (!$("#co").classList.contains("busy")) closeCo(); closeMega(); } });

/* ---------- Mega + menu ---------- */
let megaT;
function openMega() { clearTimeout(megaT); const m = $("#mega"); if (m.classList.contains("is-open")) return; m.classList.add("is-open"); $("#megaBtn").setAttribute("aria-expanded", "true"); if (hasG && !reduce) { gsap.fromTo(".mega-cat", { y: 30, opacity: 0, rotateX: -30 }, { y: 0, opacity: 1, rotateX: 0, stagger: 0.04, duration: 0.7, ease: "expo.out" }); gsap.fromTo(".mega-feat", { x: 30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8, ease: "expo.out", delay: 0.15 }); } }
function closeMega() { $("#mega").classList.remove("is-open"); $("#megaBtn").setAttribute("aria-expanded", "false"); }
$("#megaBtn").addEventListener("mouseenter", openMega); $("#megaBtn").addEventListener("click", () => ($("#mega").classList.contains("is-open") ? closeMega() : openMega()));
$("#nav").addEventListener("mouseleave", () => (megaT = setTimeout(closeMega, 220))); $("#mega").addEventListener("mouseenter", () => clearTimeout(megaT));
$("#mega").addEventListener("click", (e) => { if (e.target.closest("a")) closeMega(); });
$$(".nav2-links .nl").forEach((a) => a.addEventListener("mouseenter", () => { const ink = $(".nl-ink"); ink.style.width = a.offsetWidth + "px"; ink.style.transform = `translateX(${a.offsetLeft}px)`; ink.style.opacity = 1; }));
$(".nav2-links").addEventListener("mouseleave", markActive);
$("#burger").addEventListener("click", () => { $("#menu").classList.add("is-open"); document.body.classList.add("menu-open"); hasG && !reduce && gsap.fromTo(".menu li", { yPercent: 100, opacity: 0 }, { yPercent: 0, opacity: 1, stagger: 0.05, duration: 0.9, ease: "expo.out", delay: 0.25 }); });
$("#menuClose").addEventListener("click", () => { $("#menu").classList.remove("is-open"); document.body.classList.remove("menu-open"); });
$("#proBtn").addEventListener("click", () => toast(t().home.proOk));
$("#news").addEventListener("submit", (e) => { e.preventDefault(); toast(t().footer.subscribed); e.target.reset(); });

/* ---------- Theme + language ---------- */
const root = document.documentElement;
const saved = store.get("sn-theme"); if (saved) root.dataset.theme = saved;
const isDark = () => (root.dataset.theme ? root.dataset.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches);
$("#themeBtn").addEventListener("click", (e) => {
  const next = isDark() ? "light" : "dark", swap = () => { root.dataset.theme = next; store.set("sn-theme", next); };
  if (!document.startViewTransition || reduce) return swap();
  const r = e.currentTarget.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2, end = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  document.startViewTransition(swap).ready.then(() => root.animate({ clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${end}px at ${x}px ${y}px)`] }, { duration: 850, easing: "cubic-bezier(.19,1,.22,1)", pseudoElement: "::view-transition-new(root)" })).catch(() => {});
});
$$("[data-lang]").forEach((b) => b.addEventListener("click", () => { if (b.dataset.lang === lang) return; lang = b.dataset.lang; store.set("sn-lang", lang); document.body.classList.add("swapping"); setTimeout(() => { renderStatic(); document.body.classList.remove("swapping"); buildMotion(false); }, 230); }));

/* ---------- Views ---------- */
function markActive() {
  const key = current.startsWith("producto") ? "catalogo" : current;
  $$("[data-view]").forEach((a) => a.classList.toggle("is-active", a.dataset.view === key));
  const on = $(".nav2-links .is-active"), ink = $(".nl-ink");
  if (on) { ink.style.width = on.offsetWidth + "px"; ink.style.transform = `translateX(${on.offsetLeft}px)`; ink.style.opacity = 1; } else ink.style.opacity = 0;
}
function showView(hash, animate) {
  let id = hash || "inicio";
  if (id.startsWith("producto-")) { pid = byId(id.slice(9)) ? id.slice(9) : "p01"; }
  else if (!VIEWS.some(([v]) => v === id)) id = "inicio";
  const viewId = id.startsWith("producto") ? "producto" : id;
  const swap = () => {
    if (viewId === "producto") renderPdp(); if (viewId === "favoritos") renderFavs(); if (viewId === "catalogo") renderShop();
    $$(".view").forEach((v) => v.classList.toggle("on", v.id === "v-" + viewId));
    current = id; document.body.classList.toggle("at-home", viewId === "inicio"); markActive(); scrollTo(0, 0); closeMega();
    $("#menu").classList.remove("is-open"); document.body.classList.remove("menu-open");
    buildMotion(true);
  };
  if (!animate || !hasG || reduce) return swap();
  const c = $("#curtain"), span = c.querySelector("span"), path = c.querySelector("path"); const k = VIEWS.find(([v]) => v === viewId); span.textContent = k ? t().nav[k[1]] : pName(byId(pid)).split("·")[0];
  const Lp = path.getTotalLength(); gsap.set(path, { strokeDasharray: Lp, strokeDashoffset: Lp });
  gsap.timeline().set(c, { visibility: "visible" })
    .fromTo(c.querySelectorAll("i"), { scaleY: 0, transformOrigin: "50% 100%" }, { scaleY: 1, duration: 0.6, stagger: 0.08, ease: "expo.inOut" })
    .to(path, { strokeDashoffset: 0, duration: 0.6, ease: "power2.inOut" }, 0.3)
    .fromTo(span, { yPercent: 100, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.5, ease: "expo.out" }, 0.4)
    .add(swap)
    .to([span, path], { opacity: 0, duration: 0.3 }, "+=0.1")
    .to([...c.querySelectorAll("i")].reverse(), { scaleY: 0, transformOrigin: "50% 0%", duration: 0.7, stagger: 0.08, ease: "expo.inOut" }, "-=0.1")
    .set([span, path], { opacity: 1 }).set(c, { visibility: "hidden" });
}
function go(id) { try { history.pushState(null, "", "#" + id); } catch (e) {} showView(id, true); }
document.addEventListener("click", (e) => { const a = e.target.closest('a[href^="#"]'); if (!a || e.defaultPrevented) return; const id = a.getAttribute("href").slice(1); if (!id) return; e.preventDefault(); go(id); });
addEventListener("popstate", () => showView(location.hash.slice(1), true));
addEventListener("hashchange", () => { const id = location.hash.slice(1); if (id && id !== current) showView(id, true); });

/* ---------- Scroll, cursor, magnetic, tilt ---------- */
let last = 0;
addEventListener("scroll", () => {
  const n = $("#nav"), y = scrollY; n.classList.toggle("compact", y > 60); document.body.classList.toggle("scrolled", y > 60);
  if (y > 700 && y > last + 4 && !$("#mega").classList.contains("is-open")) n.classList.add("is-hidden"); if (y < last - 4) n.classList.remove("is-hidden"); last = y;
  const h = document.documentElement.scrollHeight - innerHeight; $(".scroll-prog i").style.transform = `scaleX(${h > 0 ? y / h : 0})`;
}, { passive: true });
if (!reduce && matchMedia("(hover:hover) and (pointer:fine)").matches) {
  document.body.classList.add("has-cursor");
  const c = $(".cursor"); let mx = innerWidth / 2, my = innerHeight / 2, cx = mx, cy = my;
  addEventListener("mousemove", (e) => {
    mx = e.clientX; my = e.clientY;
    const m = e.target.closest(".magnetic"); if (m) { const r = m.getBoundingClientRect(); m.style.transform = `translate(${(mx - r.left - r.width / 2) * 0.22}px,${(my - r.top - r.height / 2) * 0.32}px)`; }
    const tl = e.target.closest("[data-tilt]"); if (tl) { const r = tl.getBoundingClientRect(), px = (mx - r.left) / r.width, py = (my - r.top) / r.height; tl.style.setProperty("--mx", px * 100 + "%"); tl.style.setProperty("--my", py * 100 + "%"); tl.style.transform = `perspective(1000px) rotateY(${(px - 0.5) * 8}deg) rotateX(${(0.5 - py) * 8}deg)`; }
    if (current === "inicio") { const hx = (mx / innerWidth - 0.5), hy = (my / innerHeight - 0.5); const gf = $("#orb"); if (gf) gf.style.transform = `translate(${hx * 30}px, ${hy * 22}px)`; $$(".hb.on .ph").forEach((im) => (im.style.translate = `${hx * -18}px ${hy * -12}px`)); }
  });
  document.addEventListener("mouseout", (e) => { [".magnetic", "[data-tilt]"].forEach((s) => { const el = e.target.closest(s); if (el && !el.contains(e.relatedTarget)) { el.style.transition = "transform .7s cubic-bezier(.19,1,.22,1)"; el.style.transform = ""; setTimeout(() => (el.style.transition = ""), 700); } }); });
  document.addEventListener("mouseover", (e) => { const v = e.target.closest("[data-cursor]"), h = e.target.closest("a,button,select,input,label"); c.classList.toggle("is-view", !!v); c.dataset.label = v ? v.dataset.cursor : ""; c.classList.toggle("is-hover", !v && !!h); });
  (function loop() { cx += (mx - cx) * 0.18; cy += (my - cy) * 0.18; c.style.transform = `translate(${cx}px,${cy}px)`; requestAnimationFrame(loop); })();
}

/* ---------- Motion ---------- */
let mm = null;
function countUp(el) { const end = +el.dataset.count, s = el.dataset.suffix || ""; if (!hasG || reduce) return; const o = { v: 0 }; gsap.to(o, { v: end, duration: 2.2, ease: "power3.out", onUpdate: () => (el.textContent = Math.round(o.v).toLocaleString("en-US") + s) }); }
const charIn = (els, extra = {}) => gsap.from(els, { yPercent: 120, rotateX: -80, opacity: 0, transformOrigin: "50% 100%", stagger: 0.018, duration: 1.1, ease: "expo.out", ...extra });
function buildMotion(entering) {
  if (!hasG || reduce) return;
  ScrollTrigger.getAll().forEach((s) => s.kill()); if (mm) mm.revert();
  const view = $(".view.on"); if (!view) return; const q = (s) => view.querySelectorAll(s);
  if (entering) q(".page-head").forEach((h) => { charIn(h.querySelectorAll(".ch"), { delay: 0.55 }); gsap.from(h.querySelectorAll(".ph-in"), { y: 24, opacity: 0, duration: 1.1, stagger: 0.08, ease: "expo.out", delay: 0.85 }); gsap.fromTo(h.querySelector(".ph-bg"), { clipPath: "inset(12% 8% 12% 8% round 24px)", scale: 1.2 }, { clipPath: "inset(0% 0% 0% 0% round 0px)", scale: 1, duration: 1.8, ease: "expo.inOut" }); });
  q(".page-head .ph-bg").forEach((b) => gsap.to(b, { yPercent: 18, ease: "none", scrollTrigger: { trigger: b.parentElement, start: "top top", end: "bottom top", scrub: true } }));
  q(".sec-title .chars, .pro .chars").forEach((h) => charIn(h.querySelectorAll(".ch"), { scrollTrigger: { trigger: h, start: "top 88%" } }));
  q(".rv-group").forEach((g) => gsap.from(g.children, { y: 60, opacity: 0, duration: 1.1, stagger: 0.08, ease: "expo.out", scrollTrigger: { trigger: g, start: "top 86%" } }));
  q(".eyebrow").forEach((e) => { if (!e.closest(".page-head") && !e.closest(".hero")) gsap.from(e, { x: -30, opacity: 0, duration: 1, ease: "expo.out", scrollTrigger: { trigger: e, start: "top 92%" } }); });
  q("[data-count]").forEach((el) => ScrollTrigger.create({ trigger: el, start: "top 95%", once: true, onEnter: () => countUp(el) }));
  q(".pgrid").forEach((g) => gsap.from(g.querySelectorAll(".pc"), { y: 90, opacity: 0, rotate: (i) => (i % 2 ? 2 : -2), stagger: 0.06, duration: 1.1, ease: "expo.out", scrollTrigger: { trigger: g, start: "top 90%" } }));
  if (view.id === "v-inicio") {
    if (entering) { const d = firstPaint ? 1.8 : 0.6; charIn(".hero-title .ch", { delay: d }); gsap.from(".hero-in", { y: 40, opacity: 0, duration: 1.2, stagger: 0.1, ease: "expo.out", delay: d + 0.3 }); gsap.from("#heroStats > div", { y: 30, opacity: 0, stagger: 0.08, duration: 1, ease: "expo.out", delay: d + 0.6, onStart: () => $$("#heroStats [data-count]").forEach(countUp) }); gsap.from(".chip", { scale: 0, opacity: 0, stagger: 0.15, duration: 1.2, ease: "back.out(2)", delay: d + 0.8 }); gsap.from("#orb", { scale: 0.3, opacity: 0, duration: 2.2, ease: "expo.out", delay: d - 0.4 }); gsap.from("#ringWrap", { scale: 0.6, rotateY: -90, opacity: 0, duration: 2, ease: "expo.out", delay: d + 0.2 }); }
    gsap.to("#heroBg", { yPercent: 20, scale: 1.08, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
    gsap.from(".cat", { clipPath: "inset(100% 0 0 0 round 22px)", stagger: 0.07, duration: 1.4, ease: "expo.inOut", scrollTrigger: { trigger: "#catGrid", start: "top 80%" } });
    mm = gsap.matchMedia();
    mm.add("(min-width: 900px)", () => {
      const tr = $("#ftrack"), dist = () => tr.scrollWidth - innerWidth + 32;
      gsap.to(tr, { x: () => -dist(), ease: "none", scrollTrigger: { trigger: "#feat", start: "top top", end: () => "+=" + dist(), pin: true, scrub: 0.8, invalidateOnRefresh: true, onUpdate: (s) => gsap.set(".fprog i", { scaleX: s.progress }) } });
      gsap.from(".fwrap", { y: 140, rotate: (i) => (i % 2 ? 4 : -4), opacity: 0, stagger: 0.07, duration: 1.3, ease: "expo.out", scrollTrigger: { trigger: "#feat", start: "top 75%" } });
    });
    gsap.fromTo(".pro-bg .ph", { yPercent: -12, scale: 1.2 }, { yPercent: 12, scale: 1, ease: "none", scrollTrigger: { trigger: ".pro", scrub: true } });
    gsap.from(".steps3 li", { x: 60, opacity: 0, stagger: 0.12, duration: 1.1, ease: "expo.out", scrollTrigger: { trigger: ".steps3", start: "top 82%" } });
    $$(".mo").forEach((f) => gsap.fromTo(f, { yPercent: +f.dataset.speed }, { yPercent: -f.dataset.speed, ease: "none", scrollTrigger: { trigger: ".mosaic", start: "top bottom", end: "bottom top", scrub: true } }));
    gsap.from(".mo", { clipPath: "inset(50% 50% 50% 50% round 20px)", stagger: 0.06, duration: 1.4, ease: "expo.inOut", scrollTrigger: { trigger: ".mosaic", start: "top 75%" } });
    gsap.fromTo(".mo-text span:first-child", { xPercent: 25 }, { xPercent: -20, ease: "none", scrollTrigger: { trigger: ".mosaic", start: "top bottom", end: "bottom top", scrub: true } });
    gsap.fromTo(".mo-text span:last-child", { xPercent: -25 }, { xPercent: 20, ease: "none", scrollTrigger: { trigger: ".mosaic", start: "top bottom", end: "bottom top", scrub: true } });
  }
  if (view.id === "v-catalogo") gsap.from(".filters-side > *", { x: -40, opacity: 0, stagger: 0.06, duration: 1, ease: "expo.out", delay: entering ? 0.7 : 0 });
  if (view.id === "v-producto" && entering) { gsap.fromTo(".gal-main", { clipPath: "inset(0 100% 0 0 round 24px)" }, { clipPath: "inset(0 0% 0 0 round 24px)", duration: 1.4, ease: "expo.inOut", delay: 0.4 }); charIn(".pdp-title .ch", { delay: 0.7 }); gsap.from(".pdp-info > *:not(h1)", { y: 30, opacity: 0, stagger: 0.06, duration: 1, ease: "expo.out", delay: 0.8 }); gsap.from(".datasheet dl div", { x: 30, opacity: 0, stagger: 0.05, duration: 0.7, ease: "expo.out", delay: 1.2 }); }
  if (view.id === "v-panel") {
    gsap.from(".kpi", { y: 50, opacity: 0, stagger: 0.08, duration: 1, ease: "expo.out", delay: entering ? 0.8 : 0, onStart: () => $$(".kpi [data-count]").forEach(countUp) });
    const line = $(".line-chart .line"); if (line) { const l = line.getTotalLength(); gsap.fromTo(line, { strokeDasharray: l, strokeDashoffset: l }, { strokeDashoffset: 0, duration: 2.2, ease: "power2.inOut", scrollTrigger: { trigger: ".line-chart", start: "top 85%" } }); }
    gsap.from(".line-chart .area", { opacity: 0, duration: 1.4, delay: 1, scrollTrigger: { trigger: ".line-chart", start: "top 85%" } });
    gsap.from(".line-chart .pt", { scale: 0, transformOrigin: "center", stagger: 0.08, duration: 0.5, ease: "back.out(3)", scrollTrigger: { trigger: ".line-chart", start: "top 85%" } });
    gsap.from(".bar b", { scaleX: 0, transformOrigin: "left", stagger: 0.08, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: ".bars", start: "top 85%" } });
    gsap.from(".orders tr", { x: -30, opacity: 0, stagger: 0.06, duration: 0.8, ease: "expo.out", scrollTrigger: { trigger: ".orders", start: "top 85%" } });
    gsap.from(".ls em", { scaleX: 0, transformOrigin: "left", stagger: 0.06, duration: 1, ease: "expo.out", scrollTrigger: { trigger: ".lowst", start: "top 85%" } });
  }
  gsap.fromTo("#giant span", { yPercent: 110, rotate: 8 }, { yPercent: 0, rotate: 0, stagger: 0.04, ease: "none", scrollTrigger: { trigger: ".footer", start: "top bottom", end: "bottom bottom", scrub: 0.6 } });
  requestAnimationFrame(() => ScrollTrigger.refresh());
}

/* ---------- Boot ---------- */
let firstPaint = true;
renderStatic();
const h0 = location.hash.slice(1);
showView(h0, false);
const ld = $("#loader");
if (!hasG || reduce) { ld.style.display = "none"; firstPaint = false; }
else {
  ld.style.animation = "none";
  const o = { v: 0 }, tl = gsap.timeline({ onComplete: () => (firstPaint = false) });
  tl.fromTo(".ld-trace", { strokeDashoffset: 300 }, { strokeDashoffset: 0, duration: 1.1, ease: "power2.inOut" }, 0)
    .to(o, { v: 100, duration: 1.1, ease: "power3.inOut", onUpdate: () => ($("#ldV").textContent = String(Math.round(o.v)).padStart(3, "0")) }, 0)
    .to(ld, { clipPath: "inset(0 0 100% 0)", duration: 0.95, ease: "expo.inOut" }, 1.35).set(ld, { display: "none" });
}
})();
