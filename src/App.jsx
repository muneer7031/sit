import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import Lenis from "lenis";
import Preloader from "./components/Preloader.jsx";
import Nav from "./components/Nav.jsx";
import Hero from "./components/Hero.jsx";
import { Offers, ProductSheet, Products, Statement } from "./components/Sections1.jsx";
import { Contact, Faq, Footer, Gallery, Heritage, Note, Process, Routes, Voices, WaFab } from "./components/Sections2.jsx";
import { formOption, SiteMediaProvider, useSite } from "./site.jsx";
import { track } from "./analytics.js";
import { ScrollProgress } from "./motion.jsx";

const isServer = typeof window === "undefined";
const seenBefore = () => { try { return localStorage.getItem("sx-seen") === "1"; } catch { return false; } };
// Phones always get the short intro (the same story, about 2.5 seconds) so the page is ready sooner
const isPhone = () => { try { return matchMedia("(max-width: 760px), (pointer: coarse)").matches; } catch { return false; } };

export default function App() {
  return <SiteMediaProvider><Site /></SiteMediaProvider>;
}

function Site() {
  const { products: PRODUCTS } = useSite();
  const reduce = false; // full animations on every phone, even with 'reduce motion' / battery saver on (owner's choice)
  const [loading, setLoading] = useState(!reduce && !isServer); // preloader every visit (skipped only for the build-time render)
  const [ready, setReady] = useState(!!reduce || isServer);       // hero intro trigger
  const [quick] = useState(() => !isServer && (seenBefore() || isPhone())); // repeat visitors and phones get the short version
  const [sheet, setSheet] = useState(null);
  const [prefill, setPrefill] = useState(null);
  const lenis = useRef(null);

  /* html.mo enables the "hidden until animated" CSS states */
  useEffect(() => { if (!reduce) document.documentElement.classList.add("mo"); }, [reduce]);
  useEffect(() => { document.body.classList.toggle("pl-lock", loading); }, [loading]);

  /* Lenis smooth scroll, started once the preloader is gone */
  useEffect(() => {
    if (loading || reduce) return;
    const l = new Lenis({ lerp: 0.085, smoothWheel: true });
    lenis.current = l;
    window.__sxLenis = l;
    let raf = requestAnimationFrame(function loop(t) { l.raf(t); raf = requestAnimationFrame(loop); });
    return () => { cancelAnimationFrame(raf); l.destroy(); lenis.current = null; };
  }, [loading, reduce]);

  /* Smooth in-page anchors */
  useEffect(() => {
    const onClick = (e) => {
      const wa = e.target.closest('a[href*="wa.me"]');
      if (wa) track("whatsapp_click", wa.closest("section, footer, .wa-fab, .sheet")?.id || wa.className);
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute("href");
      const t = id.length > 1 ? document.querySelector(id) : document.body;
      if (!t) return;
      e.preventDefault();
      if (lenis.current) lenis.current.scrollTo(t, { offset: id === "#top" ? 0 : -20, duration: 1.6, easing: (x) => 1 - Math.pow(1 - x, 4) });
      else t.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [reduce]);

  /* Product sheet open/close: pause page scroll underneath */
  const openSheet = useCallback((i) => { track("product_view", PRODUCTS[i]?.n); setSheet(i); lenis.current?.stop(); document.body.classList.add("sheet-open"); }, [PRODUCTS]);
  const closeSheet = useCallback(() => { setSheet(null); lenis.current?.start(); document.body.classList.remove("sheet-open"); }, []);
  const quote = useCallback((p) => {
    closeSheet();
    setPrefill({ ...p, t: Date.now() });
    setTimeout(() => {
      const t = document.getElementById("contact");
      if (lenis.current) lenis.current.scrollTo(t, { duration: 1.4 }); else t.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => document.getElementById("q-name")?.focus({ preventScroll: true }), 1400);
    }, 300);
  }, [closeSheet]);

  return (
    <>
      {loading && <Preloader quick={quick} onReveal={() => setReady(true)}
        onDone={() => { setLoading(false); try { localStorage.setItem("sx-seen", "1"); } catch { /* private mode */ } }} />}
      <ScrollProgress />
      <Nav ready={ready} />
      <main id="top">
        <Hero ready={ready} />
        <Statement />
        <Products onOpen={openSheet} />
        <Offers onRequest={(o) => { track("offer_request", `${o.ref} ${o.headline}`); quote({ n: o.headline, opt: formOption(`${o.product} ${o.category} ${o.headline}`), offer: o }); }} />
        <Routes />
        <Heritage />
        <Note />
        <Process />
        <Gallery />
        <Voices />
        <Faq />
        <Contact prefill={prefill} />
      </main>
      <Footer />
      <AnimatePresence>
        {sheet !== null && (
          <ProductSheet key="sheet" index={sheet} onClose={closeSheet} onQuote={quote}
            onNav={(d) => setSheet((s) => (s + d + PRODUCTS.length) % PRODUCTS.length)} />
        )}
      </AnimatePresence>
      <WaFab ready={ready} />
    </>
  );
}
