// After `vite build` + the SSR build: inject the rendered page and structured data into dist/index.html.
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const SITE_URL = "https://sit-virid.vercel.app/"; // change here if you move to a custom domain
const dist = path.resolve("dist");
const { render } = await import(pathToFileURL(path.resolve("dist-ssr/entry-server.js")).href);
const { FAQ, PRODUCTS, ALSO, EMAIL } = await import(pathToFileURL(path.resolve("src/data.js")).href);

const html = render();

const org = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": SITE_URL + "#org",
  name: "Sithara Exports",
  url: SITE_URL,
  logo: SITE_URL + "img/sithara-exports-logo.svg",
  image: SITE_URL + "img/og.jpg",
  description: "Family-owned seafood exporter in Cochin (Kochi), Kerala, India, supplying fresh, frozen, live and dried seafood to importers worldwide, packed to the buyer's specification, since 1967.",
  foundingDate: "1967",
  founder: { "@type": "Person", name: "Mohammed" },
  email: EMAIL,
  telephone: "+919895527211",
  address: { "@type": "PostalAddress", streetAddress: "Chandiroor, near Aroor", addressLocality: "Cochin", addressRegion: "Kerala", addressCountry: "IN" },
  areaServed: ["Middle East", "Asia", "Europe", "Worldwide"],
  knowsAbout: ["Seafood export", "Frozen shrimp", "Cuttlefish", "Squid", "Indian mackerel", "Ribbon fish", "Mahi-mahi", "Live mud crabs", "Sardine", "Dried seafood"],
  contactPoint: { "@type": "ContactPoint", contactType: "sales", telephone: "+919895527211", email: EMAIL, availableLanguage: ["English", "Malayalam"] },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Seafood and agro products for export",
    itemListElement: [...PRODUCTS.map((p) => p.n), ...ALSO.map((a) => a[0])].map((n) => ({ "@type": "Offer", itemOffered: { "@type": "Product", name: n } })),
  },
};
const site = { "@context": "https://schema.org", "@type": "WebSite", name: "Sithara Exports", url: SITE_URL, publisher: { "@id": SITE_URL + "#org" } };
const faq = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
};
const ld = [org, site, faq].map((o) => `<script type="application/ld+json">${JSON.stringify(o)}</script>`).join("\n    ");

const file = path.join(dist, "index.html");
let page = fs.readFileSync(file, "utf8");
page = page.replace('<div id="root"></div>', `<div id="root">${html}</div>`).replace("</head>", `    ${ld}\n  </head>`);
fs.writeFileSync(file, page);
fs.rmSync(path.resolve("dist-ssr"), { recursive: true, force: true });
console.log(`prerendered: ${html.length} chars of HTML + ${3} JSON-LD blocks`);
