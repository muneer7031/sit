// Photos published from the Sithara dashboard ("Photos & website" → Publish).
// Online dashboard: read from Supabase public storage. Offline package: public/media/.
// Product and gallery photos live only in the dashboard.
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { GALLERY, PRODUCTS } from "./data.js";

const Ctx = createContext({ products: PRODUCTS, gallery: GALLERY });
// Photos published from the online dashboard (Supabase public storage)
const SUPABASE = "https://ocdfjuvesnkimqiexqyw.supabase.co";
const ONLINE = `${SUPABASE}/storage/v1/object/public/public-media/manifest.json`;
// Public (publishable) key: the database only lets the website ADD an enquiry, never read one.
const PUBLIC_KEY = "sb_publishable_2jjbikbzWBwyFW_WAmmy0w_0TezcshU";

/* Save a quote request to the Sithara dashboard ("Website enquiries"). Resolves true when saved. */
export async function saveEnquiry(e) {
  try {
    const r = await fetch(`${SUPABASE}/rest/v1/enquiries`, {
      method: "POST",
      headers: { apikey: PUBLIC_KEY, Authorization: `Bearer ${PUBLIC_KEY}`, "Content-Type": "application/json", Prefer: "return=minimal" },
      body: JSON.stringify({ name: e.name.slice(0, 120), company: e.company.slice(0, 160) || null, email: e.email.slice(0, 200), country: e.country.slice(0, 80), product: e.product.slice(0, 120), requirement: e.requirement.slice(0, 3000) || null, source: "website" }),
    });
    return r.ok;
  } catch { return false; }
}
const norm = (s) => String(s || "").toLowerCase().replace(/[^a-z]/g, "");
const formOption = (name) => { const n = norm(name); return /shrimp|prawn|vannamei|tiger|scampi|poovalan/.test(n) ? 0 : /squid|cuttle|octopus/.test(n) ? 1 : /crab/.test(n) ? 3 : 2; };

export function merge(manifest) {
  // Product photos come only from the dashboard; until it has published one, the card shows a plain panel.
  if (!manifest) return { products: PRODUCTS, gallery: GALLERY };
  const list = manifest.products || [];
  const products = PRODUCTS.map((p) => {
    const hit = list.find((m) => norm(m.name) === norm(p.n)) || list.find((m) => norm(m.name).startsWith(norm(p.n)) || norm(p.n).startsWith(norm(m.name)));
    return hit ? { ...p, img: hit.image, alt: hit.alt || p.alt } : p;
  });
  for (const m of manifest.products || []) {
    if (products.some((p) => p.img === m.image)) continue;
    products.push({ n: m.name, img: m.image, alt: m.alt || m.name, tag: m.tag || "Frozen", desc: m.desc || "Packed to order.", form: m.form || m.tag || "Frozen", grade: m.grade || "By size, to your requirement", opt: formOption(m.name) });
  }
  // Layout classes g1–g6 repeat, so any number of photos keeps the mosaic shape
  const gallery = (manifest.gallery || []).map((g, i) => [`g${(i % 6) + 1} gi-${i}`, g.image, g.alt || g.caption || "Sithara Exports seafood", g.caption || g.alt || ""]);
  return { products, gallery };
}

export function SiteMediaProvider({ children }) {
  const [manifest, setManifest] = useState(null);
  useEffect(() => {
    const get = (url) => fetch(url, { cache: "no-cache" }).then((r) => (r.ok ? r.json() : null)).catch(() => null);
    Promise.all([get("media/manifest.json"), get(ONLINE)]).then((list) => {
      const ms = list.filter((m) => m && (m.products?.length || m.gallery?.length));
      if (ms.length) setManifest({ products: ms.flatMap((m) => m.products || []), gallery: ms.flatMap((m) => m.gallery || []) });
    });
  }, []);
  const value = useMemo(() => merge(manifest), [manifest]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useSite = () => useContext(Ctx);
