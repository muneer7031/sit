import DEFAULTS from "./content.defaults.js";
import PUBLISHED from "./content.published.js";

/* Merge published text over the defaults. Only known fields are taken, with the same type and a length cap,
   so a bad or partial file can never break the page: anything missing or wrong keeps the default. */
export function mergeText(def, pub, key = "") {
  if (typeof def === "string") return typeof pub === "string" && pub.trim() ? pub.trim().slice(0, 2000) : def;
  if (Array.isArray(def)) {
    if (!Array.isArray(pub)) return def;
    if (key === "items") { // FAQ: any number of [question, answer]
      const ok = pub.filter((x) => Array.isArray(x) && x.length === 2 && x.every((y) => typeof y === "string" && y.trim())).slice(0, 30).map(([q, a]) => [q.trim().slice(0, 300), a.trim().slice(0, 2000)]);
      return ok.length ? ok : def;
    }
    return def.map((d, i) => mergeText(d, pub[i], "")); // fixed-size lists (features, steps, generations)
  }
  if (def && typeof def === "object") {
    const out = {};
    for (const k of Object.keys(def)) out[k] = mergeText(def[k], pub && typeof pub === "object" ? pub[k] : undefined, k);
    return out;
  }
  return def;
}

const C = mergeText(DEFAULTS, PUBLISHED);
export default C;

/* Founder's note: words between *stars* get the orange marker underline */
export function noteWords(text) {
  const words = [], hl = []; let on = false;
  for (const raw of String(text).split(/\s+/).filter(Boolean)) {
    let w = raw; const start = w.startsWith("*"); if (start) { on = true; w = w.slice(1); }
    const end = w.endsWith("*") || /\*[,.;:!?]$/.test(w); w = w.replace(/\*(?=[,.;:!?]?$)/, "");
    if (on) hl.push(words.length); words.push(w); if (end) on = false;
  }
  return { words, hl };
}
