export const PHONE = "919895527211";
export const PHONE_DISPLAY = "+91 98955 27211";
export const EMAIL = "sitharaexports@gmail.com";
export const wa = (text) => `https://wa.me/${PHONE}${text ? "?text=" + encodeURIComponent(text) : ""}`;

export const FORM_PRODUCTS = [
  "Shrimps",
  "Cuttlefish & Squid",
  "Fish (mackerel, ribbon fish, sardine, other)",
  "Live Mud Crabs",
  "Dried Seafood",
  "Meat, Coconut, Spices or Vegetables",
];

export const PRODUCTS = [
  { n: "Shrimps", alt: "Frozen shrimp", tag: "Frozen", desc: "Frozen shrimp, graded by count.", form: "Frozen", grade: "By size, to your requirement", opt: 0 },
  { n: "Cuttlefish", alt: "Frozen cuttlefish", tag: "Frozen", desc: "Frozen cuttlefish.", form: "Frozen", grade: "By size, to your requirement", opt: 1 },
  { n: "Squid", alt: "Frozen squid", tag: "Frozen", desc: "Frozen squid.", form: "Frozen", grade: "By size, to your requirement", opt: 1 },
  { n: "Indian Mackerel", alt: "Indian mackerel", tag: "Frozen", desc: "Frozen, graded by size.", form: "Frozen", grade: "Graded by size", opt: 2 },
  { n: "Ribbon Fish", alt: "Frozen ribbon fish", tag: "Frozen", desc: "Frozen, graded by size.", form: "Frozen", grade: "By size, to your requirement", opt: 2 },
  { n: "Mahi-Mahi", alt: "Mahi-mahi", tag: "Seafood", desc: "Mahi-mahi (dolphinfish).", form: "Fresh", grade: "By size, to your requirement", opt: 2 },
  { n: "Live Mud Crabs", alt: "Live mud crab", tag: "Live", desc: "Live, graded by weight.", form: "Live", grade: "By size, to your requirement", opt: 3 },
  { n: "Sardine", alt: "Frozen sardines", tag: "Frozen", desc: "Boxed, frozen.", form: "Frozen, boxed", grade: "By size, to your requirement", opt: 2 },
];

export const ALSO = [
  ["Dried Seafood", "Shark cartilage, chitin and chitosan."],
  ["Meat", "Indian buffalo meat, supplied through partner exporters."],
  ["Coconut & Cassava", "Husked coconut, frozen shredded coconut, ready-to-cook tapioca."],
  ["Spices & Veg", "Whole and curry-powder spices, frozen Indian vegetables."],
];

/* Equirectangular projection for the lanes map: lon -15..150, lat 65..-15 */
const K = 3.879;
export const proj = (lon, lat) => [(lon + 15) * K, (65 - lat) * K];
export const HOME = proj(76.3, 9.9);
export const DEST = [
  { r: "me", n: "UAE", lon: 55.3, lat: 25.2, dx: 0, dy: -10, a: "middle" },
  { r: "me", n: "Saudi Arabia", lon: 39.2, lat: 21.5, dx: -9, dy: 4, a: "end" },
  { r: "me", n: "Kuwait", lon: 48.0, lat: 29.4, dx: -8, dy: -6, a: "end" },
  { r: "me", n: "Oman", lon: 54.0, lat: 17.0, dx: -9, dy: 10, a: "end" },
  { r: "eu", n: "Netherlands", lon: 4.5, lat: 51.9, dx: 9, dy: -4, a: "start" },
  { r: "eu", n: "Spain", lon: -0.4, lat: 39.5, dx: 0, dy: 16, a: "middle" },
  { r: "eu", n: "Italy", lon: 12.5, lat: 41.9, dx: 9, dy: -6, a: "start" },
  { r: "eu", n: "Greece", lon: 23.7, lat: 37.9, dx: 9, dy: 10, a: "start" },
  { r: "as", n: "China", lon: 121.5, lat: 31.2, dx: -9, dy: 4, a: "end" },
  { r: "as", n: "South Korea", lon: 129.0, lat: 35.1, dx: 0, dy: -11, a: "middle" },
  { r: "as", n: "Japan", lon: 139.7, lat: 35.7, dx: 0, dy: 17, a: "middle" },
  { r: "as", n: "Hong Kong", lon: 114.2, lat: 22.3, dx: 9, dy: 4, a: "start" },
  { r: "as", n: "Thailand", lon: 100.5, lat: 13.7, dx: -2, dy: -10, a: "end" },
  { r: "as", n: "Vietnam", lon: 106.7, lat: 10.8, dx: 9, dy: 4, a: "start" },
  { r: "as", n: "Singapore", lon: 103.8, lat: 1.3, dx: 9, dy: 4, a: "start" },
  { r: "as", n: "Indonesia", lon: 106.8, lat: -6.2, dx: 9, dy: 6, a: "start" },
];
export const FAR = [
  { n: "AFRICA", x: 214, y: 268, tx: 214, ty: 288, a: "middle" },
  { n: "AMERICAS", x: 2, y: 196, tx: 8, ty: 212, a: "start" },
  { n: "AUSTRALIA", x: 600, y: 306, tx: 632, ty: 296, a: "end" },
];

export const GENERATIONS = [
  { img: "img/mohammed-founder-of-sithara-exports.webp", alt: "Mohammed, founder of Sithara Exports", years: ["1967 ", "–", " 1996"], who: "Mohammed · First generation · Founder", h: "It all began in Chandiroor",
    p: "Our grandfather, Mohammed, worked in real estate before he founded Sithara Exports and began exporting shrimp. When the business did well, he built a seafood processing plant with freezing and cold storage facilities near the family home, and processed seafood there himself." },
  { img: "img/shaji-second-generation-of-sithara-expor.webp", alt: "Shaji, second generation of Sithara Exports", years: ["1996 ", "onwards", ""], who: "Shaji · Second generation", h: "The next chapter", rev: true,
    p: "Our father, Shaji, took the business forward as a sourcing agent, matching buyers with reliable processors, shippers and packers. He also explored beyond seafood, as Sithara reached buyers across the Middle East, Asia and parts of Europe." },
  { img: "img/muzammil-third-generation-of-sithara-exp.webp", alt: "Muzammil, third generation of Sithara Exports", years: ["", "Today", ""], who: "Muzammil · Third generation", h: "Carrying the legacy ahead",
    p: "Muzammil, the third generation, steps forward with a modern approach and the same values: discipline, customer focus and being easy to work with." },
];

export const STEPS = [
  ["Inquiry", "Send the product, grade or size, packing, volume and destination port."],
  ["Sourcing", "We match your order with reliable processors, shippers and packers."],
  ["Packing", "Checked and packed in your carton and brand before loading."],
  ["Shipment", "Dispatched from Cochin to importers around the world."],
];

// Gallery photos come from the Sithara dashboard ("Gallery photos" → Publish to website).
export const GALLERY = [];

export const FAQ = [
  ["Where is Sithara Exports based?", "We are based in Chandiroor, near Aroor, the seafood hub of Cochin (Kochi), Kerala, India, where the family has been in the seafood trade since 1967."],
  ["Which products do you export?", "Fresh, frozen, live and dried seafood, including shrimp, cuttlefish, squid, mackerel, ribbon fish, mahi-mahi, sardine and live mud crabs. We source more than 20 seafood varieties, and we also supply meat, coconut, spices and vegetables."],
  ["Do you process the seafood yourselves?", "Our founder, Mohammed, processed seafood at his own plant in Chandiroor. Since 1996 we have worked as a sourcing agent: we match your order with reliable processors, shippers and packers around Aroor and see it packed to your specification."],
  ["Which countries do you ship to?", "We ship to buyers in every part of the world, most often in the Middle East, Asia and Europe."],
  ["How do I request a quote?", "Send us the product, grade, quantity and destination through the form on this page or on WhatsApp, and we will reply with details and availability."],
  ["How long have you been in business?", "Since 1967. Sithara Exports is now in its third generation of family ownership."],
];
