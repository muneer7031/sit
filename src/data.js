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
  { n: "Shrimps", img: "img/frozen-shrimp.webp", alt: "Frozen shrimp", tag: "Frozen", desc: "Frozen shrimp, packed to order.", form: "Frozen", grade: "By size, to your requirement", opt: 0 },
  { n: "Cuttlefish", img: "img/frozen-cuttlefish.webp", alt: "Frozen cuttlefish", tag: "Frozen", desc: "Frozen cuttlefish.", form: "Frozen", grade: "By size, to your requirement", opt: 1 },
  { n: "Squid", img: "img/frozen-squid.webp", alt: "Frozen squid", tag: "Frozen", desc: "Frozen squid.", form: "Frozen", grade: "By size, to your requirement", opt: 1 },
  { n: "Indian Mackerel", img: "img/indian-mackerel.webp", alt: "Indian mackerel", tag: "Frozen", desc: "Frozen, graded by size.", form: "Frozen", grade: "Graded by size", opt: 2 },
  { n: "Ribbon Fish", img: "img/frozen-ribbon-fish.webp", alt: "Frozen ribbon fish", tag: "Frozen", desc: "Frozen, packed to order.", form: "Frozen", grade: "By size, to your requirement", opt: 2 },
  { n: "Mahi-Mahi", img: "img/mahi-mahi.webp", alt: "Mahi-mahi", tag: "Seafood", desc: "Mahi-mahi (dolphinfish).", form: "Fresh", grade: "By size, to your requirement", opt: 2 },
  { n: "Live Mud Crabs", img: "img/live-mud-crab.webp", alt: "Live mud crab", tag: "Live", desc: "Live, packed to your requirement.", form: "Live", grade: "By size, to your requirement", opt: 3 },
  { n: "Sardine", img: "img/frozen-sardines.webp", alt: "Frozen sardines", tag: "Frozen", desc: "Boxed, frozen.", form: "Frozen, boxed", grade: "By size, to your requirement", opt: 2 },
];

export const ALSO = [
  ["Dried Seafood", "Shark cartilage, stingray skin, fins, chitin and chitosan."],
  ["Meat", "Indian buffalo meat, supplied through partner exporters."],
  ["Coconut & Cassava", "Husked coconut, frozen shredded coconut, ready-to-cook tapioca."],
  ["Spices & Veg", "Whole and curry-powder spices, frozen Indian vegetables."],
];

export const SPECS = [
  ["Product & form", "Fresh, frozen, live or dried", "Tell us the species and the form you need. We source more than 20 seafood varieties."],
  ["Size & grade", "Graded to your requirement", "Seafood is graded by size, to the grade you specify."],
  ["Packing", "Packed your way", "Packed according to your packing requirements, every order."],
  ["Branding", "Your brand needs", "Packed according to your specification and brand needs."],
  ["Volume", "The quantity you need", "Tell us the volume, and we’ll come back with availability."],
  ["Destination", "Dispatched from Cochin", "Shipped to your port across the Middle East, Asia, Europe and beyond."],
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
export const FAR = [[14, 296], [632, 300]];

export const VALUES = [
  { k: "The first principle", h: "Disciplined", p: "Our grandfather and our father both ran the business with discipline. We hold ourselves to the same standard.", cls: "wide navy" },
  { k: "Buyers first", h: "Customer focused", p: "Buyers have always come first. We measure every shipment by your satisfaction." },
  { k: "Straightforward", h: "Easy to work with", p: "Suppliers and buyers have always found us straightforward and easy to work with. We intend to keep that reputation." },
  { photo: "img/cleaned-frozen-shrimp.webp", h: "Packed your way", p: "Every order is packed according to the buyer’s own packing requirements.", cls: "photo" },
  { k: "Home", h: "Rooted in Chandiroor", p: "The family has worked in Chandiroor, beside Aroor, the seafood city of Cochin, since 1967." },
  { k: "Reach", h: "Worldwide reach", p: "From the Middle East and Asia to parts of Europe, we ship to buyers across the world." },
  { k: "Ownership", h: "Family owned", p: "Three generations of the same family, with the same name on every shipment." },
  { k: "Range", h: "Beyond seafood", p: "From shrimp and fish to meat, coconut, spices and vegetables, our range has grown with each generation." },
  { k: "Experience", h: "The people behind the work", p: "Some of the people who work with us have been with the family for many years. Their experience is part of every shipment we send.", cls: "wide" },
  { k: "The name", h: "Always aspiring", p: "Sithara means aspiring star. We keep aiming higher, shipment after shipment." },
];

export const GENERATIONS = [
  { img: "img/mohammed-founder-of-sithara-exports.webp", alt: "Mohammed, founder of Sithara Exports", years: ["1967 ", "–", " 1996"], who: "Mohammed · First generation · Founder", h: "It all began in Chandiroor",
    p: "Our grandfather, Mohammed, worked in real estate before he founded Sithara Exports and began exporting shrimp. When the business did well, he built a seafood processing plant with freezing and cold storage facilities near the family home, and processed seafood there himself." },
  { img: "img/shaji-second-generation-of-sithara-expor.webp", alt: "Shaji, second generation of Sithara Exports", years: ["1996 ", "onwards", ""], who: "Shaji · Second generation", h: "The next chapter", rev: true,
    p: "Our father, Shaji, took the business forward as a sourcing agent, matching buyers with reliable processors, shippers and packers. He also explored beyond seafood, as Sithara reached buyers across the Middle East, Asia and parts of Europe." },
  { img: "img/muzammil-third-generation-of-sithara-exp.webp", alt: "Muzammil, third generation of Sithara Exports", years: ["", "Today", ""], who: "Muzammil · Third generation", h: "Carrying the legacy ahead",
    p: "Muzammil, the third generation, steps forward with a modern approach and the same values: discipline, customer focus and being easy to work with." },
];

export const CHAPTERS = [
  { ct: "1967", h: "From real estate to the sea", p: "Before 1967, our grandfather worked in real estate. He then began exporting shrimp from Chandiroor, where Sithara Exports is still based today." },
  { ct: "Chandiroor", h: "A processing plant close to home", p: "As the business did well, our grandfather built a seafood processing plant in Chandiroor, near the family home, with freezing and cold storage facilities, and processed seafood there himself. Chandiroor remains our base, close to Aroor, the seafood city of Cochin." },
  { ct: "1996", h: "A sourcing agent, and beyond seafood", p: "When our father took over, Sithara became a sourcing agent, connecting buyers with reliable processors and packers. He also explored beyond seafood: today the range also covers meat, coconut, spices and Indian agro products." },
  { ct: "Worldwide", h: "Shipping across the world", p: "Over the decades we have shipped to buyers in almost every part of the world, especially the Middle East and Asia, and to parts of Europe.", chips: ["Middle East", "Asia", "Europe", "And beyond"] },
];

export const STEPS = [
  ["Inquiry", "Tell us the product, grade, volume and destination."],
  ["Sourcing", "We match your order with reliable processors, shippers and packers."],
  ["Packing", "Packed according to your specification and brand needs."],
  ["Shipment", "Dispatched from Cochin to importers around the world."],
];

export const GALLERY = [
  ["g1", "img/shrimp-on-packing-table.webp", "Shrimp on packing table", "Shrimp on the packing table"],
  ["g2", "img/fresh-mahi-mahi.webp", "Fresh mahi-mahi", "Fresh mahi-mahi"],
  ["g3", "img/frozen-squid-blocks.webp", "Frozen squid blocks", "Frozen squid blocks"],
  ["g4", "img/boxed-indian-mackerel.webp", "Boxed Indian mackerel", "Boxed Indian mackerel"],
  ["g5", "img/cleaned-frozen-shrimp.webp", "Cleaned frozen shrimp", "Cleaned frozen shrimp"],
  ["g6", "img/frozen-fish-trays.webp", "Frozen fish trays", "Frozen fish trays"],
];

export const QUOTES = [
  ["The seafood quality and freshness have been excellent. Their attention to product standards, careful handling and consistency make them a reliable export partner. We are very satisfied with the overall experience.", "Sathar", "Buyer · UAE"],
  ["Working with the team has been a positive experience. They are responsive, transparent and committed to delivering quality products. Their reliability and personal approach make business easy.", "David", "Buyer · Netherlands"],
  ["What stands out is their commitment to quality and professionalism. The packaging is handled carefully, communication is smooth, and shipments are coordinated efficiently. A dependable partner for seafood exports.", "Saji", "Buyer · South Korea"],
];

export const FAQ = [
  ["Where is Sithara Exports based?", "We are based in Chandiroor, near Aroor, the seafood hub of Cochin (Kochi), Kerala, India, where the family has been in the seafood trade since 1967."],
  ["Which products do you export?", "Fresh, frozen, live and dried seafood, including shrimp, cuttlefish, squid, mackerel, ribbon fish, mahi-mahi, sardine and live mud crabs. We source more than 20 seafood varieties, and we also supply meat, coconut, spices and vegetables."],
  ["Do you process the seafood yourselves?", "Our founder, Mohammed, processed seafood at his own plant in Chandiroor. Since 1996 we have worked as a sourcing agent: we match your order with reliable processors, shippers and packers around Aroor and see it packed to your specification."],
  ["Can you pack to my specification?", "Yes. Orders are packed according to the buyer’s packing requirements."],
  ["Which countries do you ship to?", "We ship to buyers in almost every part of the world, especially the Middle East and Asia, and to parts of Europe."],
  ["How do I request a quote?", "Send us the product, grade, quantity and destination through the form on this page or on WhatsApp, and we will reply with details and availability."],
  ["How long have you been in business?", "Since 1967. Sithara Exports is now in its third generation of family ownership."],
];
