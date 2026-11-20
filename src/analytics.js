// ANALYTICS: same setup as the original site, off until you paste your IDs.
// GA_ID    = Google Analytics 4 measurement ID, e.g. "G-XXXXXXXXXX" (visits + button clicks)
// CF_TOKEN = Cloudflare Web Analytics token (privacy-friendly visit counts)
export const GA_ID = "";
export const CF_TOKEN = "";

export function initAnalytics() {
  if (typeof window === "undefined") return;
  track("visit", location.pathname, { onlyOnce: true });
  if (CF_TOKEN) {
    const c = document.createElement("script");
    c.defer = true;
    c.src = "https://static.cloudflareinsights.com/beacon.min.js";
    c.setAttribute("data-cf-beacon", JSON.stringify({ token: CF_TOKEN }));
    document.head.appendChild(c);
  }
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  if (GA_ID) {
    const g = document.createElement("script");
    g.async = true;
    g.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_ID;
    document.head.appendChild(g);
    window.gtag("js", new Date());
    window.gtag("config", GA_ID);
  }
}

// Sithara dashboard stats ("Website stats"): private, no cookies, no IP addresses.
// A random id per browser tab visit links one visit's events together; the country is estimated
// from the device time zone by the "track" function.
const STATS_URL = "https://ocdfjuvesnkimqiexqyw.supabase.co/functions/v1/track";
function session() {
  try {
    let id = sessionStorage.getItem("sx-sid");
    if (!id) { id = (crypto.randomUUID?.() || Math.random().toString(36).slice(2) + Date.now().toString(36)).slice(0, 36); sessionStorage.setItem("sx-sid", id); }
    return id;
  } catch { return ""; }
}
function send(event, label) {
  if (typeof window === "undefined" || navigator.webdriver) return; // automated browsers aren't visitors
  const id = session(); if (!id) return;
  const body = JSON.stringify({ event, label: String(label || "").slice(0, 120), session: id, tz: Intl.DateTimeFormat().resolvedOptions().timeZone || "", w: window.innerWidth, ref: event === "visit" ? document.referrer : "" });
  try { fetch(STATS_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body, keepalive: true }).catch(() => {}); } catch { /* stats are optional */ }
}
const once = new Set();

/* Records an event such as a WhatsApp click or a product view: in the dashboard's Website stats,
   and in Google Analytics too if GA_ID is set. "once" events are counted one time per visit. */
export function track(event, where = "", { onlyOnce = false } = {}) {
  if (onlyOnce) { if (once.has(event)) return; once.add(event); }
  send(event, where);
  if (GA_ID && typeof window !== "undefined" && window.gtag) window.gtag("event", event, { location: where });
}
