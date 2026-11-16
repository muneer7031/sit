// ANALYTICS: same setup as the original site, off until you paste your IDs.
// GA_ID    = Google Analytics 4 measurement ID, e.g. "G-XXXXXXXXXX" (visits + button clicks)
// CF_TOKEN = Cloudflare Web Analytics token (privacy-friendly visit counts)
export const GA_ID = "";
export const CF_TOKEN = "";

export function initAnalytics() {
  if (typeof window === "undefined") return;
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

/* Records an event such as a WhatsApp click or a product view (no-op until GA_ID is set). */
export function track(event, where = "") {
  if (GA_ID && typeof window !== "undefined" && window.gtag) window.gtag("event", event, { location: where });
}
