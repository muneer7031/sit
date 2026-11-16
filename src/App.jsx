import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, useReducedMotion } from "framer-motion";
import Lenis from "lenis";
import Preloader from "./components/Preloader.jsx";
import Nav from "./components/Nav.jsx";
import Hero from "./components/Hero.jsx";
import { ProductSheet, Products, Specs, Statement } from "./components/Sections1.jsx";
import { Contact, Faq, Footer, Gallery, Heritage, Note, Process, Routes, Values, Voices, WaFab } from "./components/Sections2.jsx";
import { PRODUCTS } from "./data.js";
import { track } from "./analytics.js";

const isServer = typeof window === "undefined";
const seenBefore = () => { try { return localStorage.getItem("sx-seen") === "1"; } catch { return false; } };

export default function App() {
  const reduce = useReducedMotion();
  const [loading, setLoading] = useState(!reduce && !isServer); // preloader every visit (skipped for reduced motion / build-time render)
  const [ready, setReady] = useState(!!reduce || isServer);       // hero intro trigger
  const [quick] = useState(() => !isServer && seenBefore());       // repeat visitors get the 3-second version
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
  const openSheet = useCallback((i) => { track("product_view", PRODUCTS[i].n); setSheet(i); lenis.current?.stop(); document.body.classList.add("sheet-open"); }, []);
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
      <Nav ready={ready} />
      <main id="top">
        <Hero ready={ready} />
        <Statement />
        <Products onOpen={openSheet} />
        <Specs />
        <Routes />
        <Heritage />
        <Values />
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
