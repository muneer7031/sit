import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionTemplate, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { ALSO, SPECS, wa } from "../data.js";
import { useSite } from "../site.jsx";
import { EASE, Reveal, ScrollWords, useParallax } from "../motion.jsx";

/* ---------------- About statement ---------------- */
const FEATURES = [
  ["Sourcing agent", "Reliable shippers and packers, matched to your requirement.", <><circle cx="9" cy="8" r="3.2" /><circle cx="17" cy="9.5" r="2.6" /><path d="M3 19c.6-3.2 3-5 6-5s5.4 1.8 6 5M14.5 14.6c2.6-.4 5.6.9 6.5 4.4" /></>],
  ["Buyer-specific packing", "Packed as per your packing requirements, every order.", <><path d="M3 7l9-4 9 4v10l-9 4-9-4z" /><path d="M3 7l9 4 9-4M12 11v10" /></>],
  ["Global inquiries", "We welcome export inquiries and orders from all over the world.", <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z" /></>],
];

export function Statement() {
  const photo = useRef(null);
  const { scrollYProgress } = useScroll({ target: photo, offset: ["start 0.95", "start 0.25"] });
  const clipPath = useTransform(scrollYProgress, (v) => {
    const k = 1 - v;
    return `inset(${(10 * k).toFixed(2)}% ${(9 * k).toFixed(2)}% ${(10 * k).toFixed(2)}% ${(9 * k).toFixed(2)}% round ${(40 - 8 * v).toFixed(1)}px)`;
  });
  const [pref, py] = useParallax(8);
  return (
    <section className="statement" id="about" aria-labelledby="about-title">
      <div className="wrap">
        <p className="eyebrow">About us</p>
        <ScrollWords as="h2" id="about-title" className="big"
          parts={[{ t: "We measure every shipment by" }, { t: "your satisfaction.", em: true }]} />
        <div className="features">
          {FEATURES.map(([h, p, icon], i) => (
            <Reveal className="feature" key={h} delay={i * 0.08}>
              <div className="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{icon}</svg></div>
              <h3>{h}</h3><p>{p}</p>
            </Reveal>
          ))}
        </div>
        <motion.div className="wide-photo" ref={(el) => { photo.current = el; pref.current = el; }} style={{ clipPath }}>
          <motion.img src="img/frozen-shrimp-packed-in-export-trays.webp" alt="Frozen shrimp packed in export trays" loading="lazy" style={{ y: py }} />
          <div className="cap"><small>Based in</small><b>Chandiroor, near Aroor · Cochin, Kerala</b></div>
        </motion.div>
      </div>
    </section>
  );
}

/* ---------------- Products: pinned horizontal reel ---------------- */
const Plus = () => <svg viewBox="0 0 16 16" fill="none"><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>;

/* Card tilts toward the cursor on a spring, with a soft glare that follows it */
function Card({ p, i, onOpen }) {
  const reduce = useReducedMotion();
  const fine = typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const rx = useMotionValue(0), ry = useMotionValue(0), gx = useMotionValue(50), gy = useMotionValue(50), go = useMotionValue(0);
  const spring = { stiffness: 220, damping: 20, mass: 0.6 };
  const rotateX = useSpring(rx, spring), rotateY = useSpring(ry, spring), glareO = useSpring(go, spring);
  const glare = useMotionTemplate`radial-gradient(260px circle at ${gx}% ${gy}%, rgba(255,255,255,0.28), transparent 62%)`;
  const move = (e) => {
    if (!fine || reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
    ry.set((px - 0.5) * 12); rx.set(-(py - 0.5) * 10); gx.set(px * 100); gy.set(py * 100); go.set(1);
  };
  const leave = () => { rx.set(0); ry.set(0); go.set(0); };
  return (
    <motion.article className="p-card" tabIndex={0} role="button" aria-label={`View ${p.n} details`}
      onClick={() => onOpen(i)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onOpen(i); } }}
      onPointerMove={move} onPointerLeave={leave}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      whileHover={{ y: -4 }} whileTap={{ scale: 0.98 }} transition={{ type: "spring", stiffness: 300, damping: 24 }}>
      <motion.span className="glare" aria-hidden="true" style={{ background: glare, opacity: glareO }} />
      <div className="ph"><span className="stamp" aria-hidden="true">EXPORT · COCHIN</span>{p.img ? <img src={p.img} alt={p.alt} loading="lazy" /> : <span className="ph-empty" aria-hidden="true" />}</div>
      <div className="tx">
        <div><small>{p.tag}</small><h3>{p.n}</h3><p>{p.desc}</p></div>
        <span className="go" aria-hidden="true"><Plus /></span>
      </div>
    </motion.article>
  );
}

function usePinMode() {
  const q = "(min-width: 900px) and (min-height: 680px)";
  const [pin, setPin] = useState(() => typeof window !== "undefined" && window.matchMedia(q).matches && !window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  useEffect(() => {
    const m = window.matchMedia(q);
    const f = () => setPin(m.matches && !window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    m.addEventListener("change", f); return () => m.removeEventListener("change", f);
  }, []);
  return pin;
}

export function Products({ onOpen }) {
  const { products: PRODUCTS } = useSite();
  const pin = usePinMode();
  const track = useRef(null), reel = useRef(null);
  const [dist, setDist] = useState(0);
  const [nativeP, setNativeP] = useState(0);
  useEffect(() => {
    if (!pin) return;
    const measure = () => setDist(Math.max(0, reel.current.scrollWidth - window.innerWidth));
    measure(); addEventListener("resize", measure);
    return () => removeEventListener("resize", measure);
  }, [pin]);
  const { scrollYProgress } = useScroll({ target: track, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, (v) => -v * dist);
  const bar = useTransform(scrollYProgress, [0, 1], [0.12, 1]);

  const head = (
    <div className="wrap">
      <div className="reel-head">
        <div>
          <p className="eyebrow">Our seafood</p>
          <Reveal as="h2" id="products-title" className="h-lg" style={{ marginTop: "1.2rem" }}>Catch, selected <em className="s">and packed.</em></Reveal>
          <Reveal as="p" className="lead" delay={0.08}>A selection from our range. Tap any product for details. Don’t see your species? We source more than 20 varieties on request.</Reveal>
        </div>
        <div className="reel-meta"><span>{pin ? "Scroll to explore" : "Swipe to explore"} · {PRODUCTS.length} lines</span>
          <div className="reel-progress"><motion.span style={{ scaleX: pin ? bar : 0.12 + nativeP * 0.88, transformOrigin: "left" }} /></div>
        </div>
      </div>
    </div>
  );
  const cards = PRODUCTS.map((p, i) => <Card key={p.n} p={p} i={i} onOpen={onOpen} />);

  return (
    <section className="products" id="products" aria-labelledby="products-title">
      {pin ? (
        <div className="products-track" ref={track} style={{ height: `calc(100vh + ${dist}px)` }}>
          <div className="products-sticky">
            {head}
            <motion.div className="reel pinned" ref={reel} style={{ x }} aria-label="Seafood products">{cards}</motion.div>
          </div>
        </div>
      ) : (
        <div className="products-pin">
          {head}
          <div className="reel" ref={reel} tabIndex={0} aria-label="Seafood products"
            onScroll={(e) => { const r = e.currentTarget; setNativeP(r.scrollLeft / Math.max(1, r.scrollWidth - r.clientWidth)); }}>{cards}</div>
        </div>
      )}
      <div className="wrap" style={{ paddingBottom: "clamp(5rem,10vw,7rem)" }}>
        <div className="also">
          {ALSO.map(([h, p], i) => <Reveal key={h} delay={i * 0.06}><small>Also</small><h3>{h}</h3><p>{p}</p></Reveal>)}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Product detail sheet ---------------- */
export function ProductSheet({ index, onClose, onNav, onQuote }) {
  const { products: PRODUCTS } = useSite();
  const p = PRODUCTS[index];
  const panel = useRef(null), closeBtn = useRef(null), dir = useRef(0);
  useEffect(() => { closeBtn.current?.focus(); }, []);
  const go = (d) => { dir.current = d; onNav(d); };
  const onKey = (e) => {
    if (e.key === "Escape") onClose();
    else if (e.key === "ArrowRight") go(1);
    else if (e.key === "ArrowLeft") go(-1);
    else if (e.key === "Tab") {
      const f = [...panel.current.querySelectorAll("button, a[href]")];
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    }
  };
  return (
    <motion.div className="sheet" role="dialog" aria-modal="true" aria-labelledby="sh-title" onKeyDown={onKey}
      initial={{ opacity: 1 }} exit={{ opacity: 1 }}>
      <motion.div className="sheet-scrim" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} />
      <motion.div className="sheet-panel" ref={panel}
        initial={{ y: 90, opacity: 0, scale: 0.97 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 60, opacity: 0, transition: { duration: 0.25 } }}
        transition={{ type: "spring", stiffness: 260, damping: 28 }}>
        <button className="sheet-x" ref={closeBtn} type="button" onClick={onClose} aria-label="Close product details">
          <svg viewBox="0 0 16 16" width="14" height="14" fill="none" aria-hidden="true"><path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
        </button>
        <div className="sheet-media">
          <AnimatePresence initial={false} mode="popLayout">
            {p.img ? <motion.img key={p.img} src={p.img} alt={p.alt}
              initial={{ opacity: 0, x: dir.current * 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: dir.current * -40 }}
              transition={{ duration: 0.45, ease: EASE }} /> : <span key={"e" + p.n} className="ph-empty" aria-hidden="true" />}
          </AnimatePresence>
          <span className="stamp" aria-hidden="true">EXPORT · COCHIN</span>
        </div>
        <motion.div className="sheet-body" key={p.n} initial="h" animate="s" variants={{ s: { transition: { staggerChildren: 0.04 } } }}>
          {[
            <p className="eyebrow" key="t">{p.tag}</p>,
            <h2 id="sh-title" key="h">{p.n}</h2>,
            <p className="sheet-desc" key="d">{p.desc} Don’t see your grade or species? We source more than 20 varieties on request.</p>,
            <dl className="sheet-specs" key="s">
              <div><dt>Form</dt><dd>{p.form}</dd></div>
              <div><dt>Grading</dt><dd>{p.grade}</dd></div>
              <div><dt>Packing</dt><dd>To your specification and brand needs</dd></div>
              <div><dt>Ships from</dt><dd>Cochin, Kerala, India</dd></div>
            </dl>,
            <div className="sheet-actions" key="a">
              <motion.button className="btn btn-accent" type="button" onClick={() => onQuote(p)} whileTap={{ scale: 0.96 }}>Request a quote</motion.button>
              <motion.a className="btn sheet-wa" href={wa(`Hello Sithara Exports, I'd like a quote for ${p.n}.`)} target="_blank" rel="noopener" whileTap={{ scale: 0.96 }}>Ask on WhatsApp</motion.a>
            </div>,
          ].map((el) => (
            <motion.div key={el.key} variants={{ h: { opacity: 0, y: 10 }, s: { opacity: 1, y: 0 } }} transition={{ duration: 0.4, ease: EASE }}>{el}</motion.div>
          ))}
          <div className="sheet-nav">
            <button type="button" onClick={() => go(-1)} aria-label="Previous product">‹</button>
            <span>{index + 1} / {PRODUCTS.length}</span>
            <button type="button" onClick={() => go(1)} aria-label="Next product">›</button>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

/* ---------------- Specification ---------------- */
export function Specs() {
  return (
    <section className="specs-s" id="specs" aria-labelledby="specs-title">
      <div className="wrap">
        <div className="specs-head">
          <div>
            <p className="eyebrow">Specification</p>
            <Reveal as="h2" id="specs-title" className="h-lg" style={{ marginTop: "1.2rem" }}>Your order, <em className="s">your specification.</em></Reveal>
          </div>
          <Reveal as="p" className="lead" delay={0.08}>Every order is packed to the buyer’s own requirements. Send us these details and we’ll reply with availability.</Reveal>
        </div>
        <div className="spec-grid">
          {SPECS.map(([k, h, p], i) => (
            <Reveal className="spec" key={k} delay={(i % 3) * 0.08}><span className="k">{k}</span><h3>{h}</h3><p>{p}</p></Reveal>
          ))}
        </div>
        <Reveal as="p" className="specs-cta"><a href="#contact">Have your specification ready? Request a quote ›</a></Reveal>
      </div>
    </section>
  );
}
