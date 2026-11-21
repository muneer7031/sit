// Photos published from the dashboard ("Photos & website" → Publish).
// Online dashboard: read from Supabase public storage. Offline package: public/media/.
// Product and gallery photos live only in the dashboard.
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { GALLERY, PRODUCTS } from "./data.js";

const Ctx = createContext({ products: PRODUCTS, gallery: GALLERY, founders: {}, testimonials: [], offers: [] });
// Photos published from the online dashboard (Supabase public storage)
const SUPABASE = "https://ocdfjuvesnkimqiexqyw.supabase.co";
const ONLINE = `${SUPABASE}/storage/v1/object/public/public-media/manifest.json`;
// Public (publishable) key. The website can't read or write enquiries directly; it goes through submit-enquiry.
const PUBLIC_KEY = "sb_publishable_2jjbikbzWBwyFW_WAmmy0w_0TezcshU";

// Cloudflare Turnstile site key (public). Leave empty until Turnstile is set up; the other bot checks still run.
export const TURNSTILE_SITE_KEY = "";

/* Send a quote request through the bot-checking function. Resolves { ok, error? }. */
export async function submitEnquiry(e) {
  try {
    const r = await fetch(`${SUPABASE}/functions/v1/submit-enquiry`, { method: "POST", headers: { "Content-Type": "application/json", apikey: PUBLIC_KEY }, body: JSON.stringify(e) });
    const j = await r.json().catch(() => ({}));
    return r.ok ? { ok: true } : { ok: false, error: j.error || "" };
  } catch { return { ok: false, error: "" }; }
}
const norm = (s) => String(s || "").toLowerCase().replace(/[^a-z]/g, "");
export const formOption = (name) => { const n = norm(name); return /shrimp|prawn|vannamei|tiger|scampi|poovalan/.test(n) ? 0 : /squid|cuttle|octopus/.test(n) ? 1 : /crab/.test(n) ? 3 : 2; };

export function merge(manifest) {
  // Product photos come only from the dashboard; until it has published one, the card shows a plain panel.
  if (!manifest) return { products: PRODUCTS, gallery: GALLERY, founders: {} };
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
  const gallery = (manifest.gallery || []).map((g, i) => [`g${(i % 6) + 1} gi-${i}`, g.image, g.alt || g.caption || "Zetarah Exports seafood", g.caption || g.alt || ""]);
  // Founder photos (Heritage section): g1 Mohammed, g2 Shaji, g3 Muzammil. Missing ones keep the built-in photo.
  const founders = Object.fromEntries(Object.entries(manifest.founders || {}).filter(([k, v]) => /^g[123]$/.test(k) && typeof v === "string" && /^https:\/\//.test(v)));
  return { products, gallery, founders };
}

export function SiteMediaProvider({ children }) {
  const [manifest, setManifest] = useState(null);
  useEffect(() => {
    const get = (url) => fetch(url, { cache: "no-store" }).then((r) => (r.ok ? r.json() : null)).catch(() => null);
    // (The old offline photo package, media/manifest.json, is no longer used: asking for it gave a 404 on every visit.)
    Promise.all([get(`${ONLINE}?t=${Date.now()}`)]).then((list) => {
      const ms = list.filter((m) => m && (m.products?.length || m.gallery?.length || (m.founders && Object.keys(m.founders).length)));
      if (ms.length) setManifest({ products: ms.flatMap((m) => m.products || []), gallery: ms.flatMap((m) => m.gallery || []), founders: Object.assign({}, ...ms.map((m) => m.founders || {})) });
    });
  }, []);
  // Testimonials (dashboard → Testimonials → "Save to website") and offers (offer page → "Show on the website").
  // Always fetched fresh (a unique ?t= skips browser and CDN copies) and re-checked whenever the visitor comes back
  // to the tab, so changes saved in the dashboard show without reloading the page.
  const [testimonials, setTestimonials] = useState([]);
  const [offers, setOffers] = useState([]);
  useEffect(() => {
    const fresh = (file) => fetch(`${SUPABASE}/storage/v1/object/public/public-media/${file}?t=${Date.now()}`, { cache: "no-store" }).then((r) => (r.ok ? r.json() : null)).catch(() => undefined);
    const load = () => {
      fresh("testimonials.json").then((d) => {
        if (d === undefined) return; // network error: keep what is shown
        setTestimonials(d?.show !== false && Array.isArray(d?.items) ? d.items.filter((t) => t && t.quote && (t.company || t.name)) : []); // show:false = section switched off in the dashboard
      });
      fresh("offers.json").then((d) => {
        if (d === undefined) return;
        const today = new Date(); today.setHours(0, 0, 0, 0);
        setOffers(Array.isArray(d?.items) ? d.items.filter((o) => o && o.headline && Array.isArray(o.sizes) && (!o.validUntil || new Date(o.validUntil) >= today)) : []);
      });
    };
    load();
    const onShow = () => { if (document.visibilityState === "visible") load(); };
    document.addEventListener("visibilitychange", onShow);
    window.addEventListener("focus", onShow);
    return () => { document.removeEventListener("visibilitychange", onShow); window.removeEventListener("focus", onShow); };
  }, []);
  const value = useMemo(() => ({ ...merge(manifest), testimonials, offers }), [manifest, testimonials, offers]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useSite = () => useContext(Ctx);
