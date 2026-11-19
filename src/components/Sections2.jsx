import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useAnimate, useScroll, useTransform } from "framer-motion";
import { useSite } from "../site.jsx";
import { CHAPTERS, DEST, EMAIL, FAQ, FAR, FORM_PRODUCTS, GENERATIONS, HOME, PHONE_DISPLAY, QUOTES, STEPS, VALUES, proj, wa } from "../data.js";
import { track } from "../analytics.js";
import { Arrow, Counter, EASE, EASE_IO, Magnetic, MaskLines, Reveal, ScrollWords, ShipIcon, WaIcon, useParallax } from "../motion.jsx";

const VIEW = { once: true, margin: "0px 0px -10% 0px" };

/* ---------------- Shipping lanes ---------------- */
function arc(x1, y1, x2, y2, bend) {
  const mx = (x1 + x2) / 2, my = (y1 + y2) / 2, dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy) || 1;
  let nx = -dy / len, ny = dx / len; if (ny > 0) { nx = -nx; ny = -ny; }
  const off = len * bend;
  return `M${x1.toFixed(1)} ${y1.toFixed(1)} Q${(mx + nx * off).toFixed(1)} ${(my + ny * off).toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`;
}

export function Routes() {
  const [region, setRegion] = useState("all");
  const lanes = useMemo(() => [
    ...DEST.map((d) => { const [x, y] = proj(d.lon, d.lat); return { ...d, x, y, d: arc(HOME[0], HOME[1], x, y, 0.22) }; }),
    ...FAR.map(([x, y]) => ({ r: "far", far: true, d: arc(HOME[0], HOME[1], x, y, 0.12) })),
  ], []);
  const paths = useRef([]), ships = useRef([]), map = useRef(null);
  useEffect(() => {
    const lens = paths.current.map((p) => p.getTotalLength());
    const place = (t) => ships.current.forEach((s, i) => {
      const f = ((t / (6500 + (i % 5) * 900)) + i * 0.137) % 1;
      const pt = paths.current[i].getPointAtLength(f * lens[i]);
      s.setAttribute("cx", pt.x.toFixed(1)); s.setAttribute("cy", pt.y.toFixed(1));
      s.setAttribute("opacity", Math.min(1, Math.sin(f * Math.PI) * 1.6).toFixed(2));
    });
    place(2600);
    let raf = 0;
    const loop = (t) => { place(t); raf = requestAnimationFrame(loop); };
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !raf) raf = requestAnimationFrame(loop);
      else if (!e.isIntersecting && raf) { cancelAnimationFrame(raf); raf = 0; }
    });
    io.observe(map.current);
    return () => { cancelAnimationFrame(raf); io.disconnect(); };
  }, []);
  const dim = (r) => (region !== "all" && r !== region ? " dim" : "");
  return (
    <section className="routes" id="routes" aria-labelledby="routes-title">
      <div className="wrap routes-grid">
        <div>
          <p className="eyebrow">Shipping lanes</p>
          <Reveal as="h2" id="routes-title" className="h-lg" style={{ marginTop: "1.2rem" }}>From Cochin to <em className="s">almost every part of the world.</em></Reveal>
          <Reveal as="p" className="lead" style={{ marginTop: "1.2rem" }} delay={0.08}>Over the decades we have shipped to buyers in almost every part of the world, especially the Middle East and Asia, and to parts of Europe. Every order is dispatched from Cochin.</Reveal>
          <Reveal className="lane-filter" role="group" aria-label="Show shipping lanes by region" delay={0.14}>
            {[["all", "All lanes"], ["me", "Middle East"], ["as", "Asia"], ["eu", "Europe"]].map(([r, l]) => (
              <motion.button key={r} type="button" aria-pressed={region === r} onClick={() => setRegion(r)} whileTap={{ scale: 0.95 }}>
                {region === r && <motion.span layoutId="lane-pill" className="lane-pill" transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
                <span className="lane-label">{l}</span>
              </motion.button>
            ))}
          </Reveal>
        </div>
        <Reveal className="map" ref={map}>
          <svg viewBox="0 0 640 310" role="img" aria-label="Shipping lanes from Cochin to destinations across the Middle East, Asia and Europe">
            <defs>
              <pattern id="dots" width="10" height="10" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1" fill="#F2E8D0" fillOpacity="0.2" /></pattern>
              <radialGradient id="fade" cx="55%" cy="60%" r="65%"><stop offset="0" stopColor="#fff" /><stop offset="1" stopColor="#fff" stopOpacity="0" /></radialGradient>
              <mask id="mapmask"><rect width="640" height="310" fill="url(#fade)" /></mask>
            </defs>
            <rect width="640" height="310" fill="url(#dots)" mask="url(#mapmask)" />
            {[["EUROPE", 92, 26], ["MIDDLE EAST", 226, 112], ["ASIA", 540, 84]].map(([t, x, y]) => <text key={t} x={x} y={y} className="region" textAnchor="middle">{t}</text>)}
            {lanes.map((l, i) => l.far
              ? <path key={i} ref={(el) => (paths.current[i] = el)} className="lane far" d={l.d} />
              : <motion.path key={i} ref={(el) => (paths.current[i] = el)} className={"lane" + dim(l.r)} d={l.d}
                  initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true, margin: "0px 0px -15% 0px" }}
                  transition={{ duration: 1.4, ease: "easeInOut", delay: i * 0.07 }} />)}
            {lanes.map((l, i) => <circle key={i} ref={(el) => (ships.current[i] = el)} className={"mship" + (l.far ? " far" : "") + dim(l.r)} r={l.far ? 2.2 : 2.8} />)}
            {lanes.filter((l) => !l.far).map((l, i) => (
              <g key={l.n} className={dim(l.r).trim()}>
                <circle className="ring" cx={l.x} cy={l.y} r="3" style={{ animationDelay: `${(i * 0.37) % 2.6}s` }} />
                <motion.circle className="node" cx={l.x} cy={l.y} r="3" initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 400, damping: 12, delay: 0.6 + i * 0.07 }} style={{ transformBox: "fill-box", transformOrigin: "center" }} />
                <text x={l.x + l.dx} y={l.y + l.dy} textAnchor={l.a}>{l.n}</text>
              </g>
            ))}
            <circle className="ring home" cx={HOME[0]} cy={HOME[1]} r="5" />
            <circle className="node home" cx={HOME[0]} cy={HOME[1]} r="5" />
            <text x={HOME[0] - 4} y={HOME[1] + 20} textAnchor="middle" className="home-t">Cochin</text>
            <text x={HOME[0] - 4} y={HOME[1] + 32} textAnchor="middle" className="sm">PORT OF LOADING</text>
            <text x="20" y="286" className="sm">AND BEYOND</text>
          </svg>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- Heritage ---------------- */
function Stat({ to, from, plus, label, i }) {
  return (
    <motion.div className="stat anim" initial="h" whileInView="s" viewport={VIEW} transition={{ delayChildren: (i % 2) * 0.12 }}>
      <motion.i style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg,#EE7A42,#F6B48A 30%,transparent 70%)", transformOrigin: "left" }}
        variants={{ h: { scaleX: 0 }, s: { scaleX: 1 } }} transition={{ duration: 1.3, ease: EASE_IO }} />
      <b>
        <span className="mask"><motion.span className="n" variants={{ h: { y: "105%", rotate: 4 }, s: { y: "0%", rotate: 0 } }} transition={{ duration: 1.4, ease: EASE }}>
          <Counter to={to} from={from} />
        </motion.span></span>
        {plus && <motion.span className="plus" variants={{ h: { scale: 0, rotate: -90 }, s: { scale: 1, rotate: 0 } }} transition={{ type: "spring", stiffness: 300, damping: 10, delay: 0.6 }}>+</motion.span>}
      </b>
      <motion.span className="l" variants={{ h: { opacity: 0, y: 18, filter: "blur(6px)" }, s: { opacity: 1, y: 0, filter: "blur(0px)" } }} transition={{ duration: 1, ease: EASE, delay: 0.35 }}>{label}</motion.span>
    </motion.div>
  );
}

function Generation({ g }) {
  const [on, setOn] = useState(false);
  const side = g.rev ? -70 : 70;
  return (
    <motion.article className={`fam${g.rev ? " rev" : ""}${on ? " on" : ""}`} initial="h" whileInView="s" viewport={{ once: true, margin: "0px 0px -22% 0px" }} onViewportEnter={() => setOn(true)}>
      <div className="fr">
        <motion.div className="frame" variants={{ h: { scale: 0.6, rotate: g.rev ? 25 : -25, opacity: 0 }, s: { scale: 1, rotate: 0, opacity: 1 } }} transition={{ duration: 1.3, ease: EASE }} whileHover={{ scale: 1.03 }}>
          <div className="ph0"><motion.img src={g.img} alt={g.alt} loading="lazy" variants={{ h: { scale: 1.35 }, s: { scale: 1 } }} transition={{ duration: 1.6, ease: EASE }} /></div>
        </motion.div>
      </div>
      <motion.div className="gt" variants={{ s: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } } }}>
        {[
          <div className="dr" key="dr">{g.years[0]}<em className="s">{g.years[1]}</em>{g.years[2]}</div>,
          <small key="w">{g.who}</small>,
          <h3 key="h">{g.h}</h3>,
          <p key="p">{g.p}</p>,
        ].map((el) => (
          <motion.div key={el.key} variants={{ h: { x: side, opacity: 0, filter: "blur(8px)" }, s: { x: 0, opacity: 1, filter: "blur(0px)" } }} transition={{ duration: 1.1, ease: EASE }}>{el}</motion.div>
        ))}
      </motion.div>
    </motion.article>
  );
}

export function Heritage() {
  const wall = useRef(null);
  const { scrollYProgress } = useScroll({ target: wall, offset: ["start 0.7", "end 0.6"] });
  return (
    <section className="dark heritage" id="heritage" aria-labelledby="heritage-title" data-nav="dark">
      <div className="glow a" /><div className="glow b" />
      <div className="wrap">
        <p className="eyebrow">Our heritage</p>
        <MaskLines as="h2" id="heritage-title" className="h-xl" style={{ marginTop: "1.2rem" }}
          lines={["Three generations.", <em className="s" style={{ color: "var(--cream)" }}>One promise.</em>]} />
        <Reveal as="p" className="lead" style={{ marginTop: "1.4rem" }}>Since 1967, Sithara Exports has been a family business, and every shipment carries that name.</Reveal>
        <div className="stats">
          <Stat i={0} to={1967} from={1900} label="The year Mohammed began exporting shrimp from Chandiroor" />
          <Stat i={1} to={3} label="Generations of one family, one name on every shipment" />
          <Stat i={2} to={20} plus label="Seafood varieties sourced on request" />
          <Stat i={3} to={4} label="Forms we supply: fresh, frozen, live and dried" />
        </div>

        <div className="wall" ref={wall}>
          <div className="wall-line" aria-hidden="true"><motion.span style={{ scaleY: scrollYProgress }} /></div>
          {GENERATIONS.map((g) => <Generation key={g.h} g={g} />)}
        </div>

        <ScrollWords as="p" className="wallq" parts={[{ t: "The family lineage continues." }, { t: "Always aspiring, in every shipment.", em: true }]} />

        <Reveal className="namecard">
          <small>The name</small>
          <div className="big">
            <motion.span id="sithara-word" aria-label="Sithara" initial="h" whileInView="s" viewport={VIEW} variants={{ s: { transition: { staggerChildren: 0.06 } } }}>
              {[..."Sithara"].map((c, i) => <motion.span key={i} aria-hidden="true" variants={{ h: { y: "110%" }, s: { y: "0%" } }} transition={{ duration: 1.4, ease: EASE }}>{c}</motion.span>)}
            </motion.span>{" "}<i>/ aspiring star</i>
          </div>
          <p>“Sithara” means aspiring star, a name we have carried for three generations.</p>
        </Reveal>

        <div className="chaps">
          {CHAPTERS.map((c) => (
            <Reveal className="chap" key={c.ct}>
              <div className="ct">{c.ct}</div>
              <div><h3>{c.h}</h3><p>{c.p}</p>{c.chips && <div className="chips">{c.chips.map((x) => <span key={x}>{x}</span>)}</div>}</div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Values bento ---------------- */
export function Values() {
  const spot = (e) => { const t = e.currentTarget, r = t.getBoundingClientRect(); t.style.setProperty("--mx", e.clientX - r.left + "px"); t.style.setProperty("--my", e.clientY - r.top + "px"); };
  return (
    <section className="values" aria-labelledby="values-title">
      <div className="wrap">
        <div className="head center">
          <p className="eyebrow">What we stand for</p>
          <Reveal as="h2" id="values-title" className="h-lg">Disciplined, customer focused <em className="s">and easy to work with.</em></Reveal>
        </div>
        <div className="bento">
          {VALUES.map((v, i) => (
            <Reveal key={v.h} className={`tile ${v.cls || ""}`} delay={(i % 3) * 0.08} onPointerMove={spot}>
              {v.photo ? (<><img src={v.photo} alt="" loading="lazy" /><div><h3>{v.h}</h3><p>{v.p}</p></div></>)
                : (<><span className="k">{v.k}</span><h3>{v.h}</h3><p>{v.p}</p></>)}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Note from the third generation ---------------- */
const NOTE = "Every shipment we send carries three generations of effort, and I take that seriously. Honest dealings, packing the way you ask for it, and the same care from the first order to the hundredth.";
const HL = [5, 6, 7, 8]; // "three generations of effort," gets a marker underline
export function Note() {
  const words = NOTE.split(" ");
  const NOTE_VIEW = { once: true, margin: "0px 0px -18% 0px" };
  return (
    <section className="note" aria-label="A note from the third generation">
      <div className="wrap inner">
        <p className="eyebrow">A note from the third generation</p>
        <motion.div className="note-mark" aria-hidden="true" initial={{ opacity: 0, scale: 0.4, rotate: -24 }} whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
          viewport={NOTE_VIEW} transition={{ type: "spring", stiffness: 170, damping: 13 }}>“</motion.div>
        <motion.blockquote initial="h" whileInView="s" viewport={NOTE_VIEW} variants={{ s: { transition: { staggerChildren: 0.045, delayChildren: 0.3 } } }}>
          {words.map((w, i) => (
            <motion.span key={i} className={"nw" + (HL.includes(i) ? " hl" : "")}
              variants={{
                h: { opacity: 0, y: 14, filter: "blur(6px)", ...(HL.includes(i) ? { backgroundSize: "0% 34%" } : {}) },
                s: { opacity: 1, y: 0, filter: "blur(0px)", ...(HL.includes(i) ? { backgroundSize: "100% 34%" } : {}) },
              }}
              transition={{ duration: 0.7, ease: EASE, ...(HL.includes(i) ? { backgroundSize: { duration: 0.5, delay: 1.9 + (i - HL[0]) * 0.12, ease: "easeOut" } } : {}) }}>
              {w}{i < words.length - 1 ? " " : ""}
            </motion.span>
          ))}
        </motion.blockquote>
        <Reveal as="p" className="more" delay={0.3}>My grandfather, Mohammed, started Sithara Exports in 1967. In 1996 he handed it to my father, Shaji, and today it is my turn to carry it forward. Whether you have worked with us for years or are writing to us for the first time, I would be glad to hear from you personally.</Reveal>
        <motion.div className="sig" initial="h" whileInView="s" viewport={{ once: true, margin: "0px 0px -6% 0px" }}>
          <span className="sig-photo">
            <motion.img src="img/muzammil-third-generation-of-sithara-exp.webp" alt="" variants={{ h: { scale: 0.8, opacity: 0 }, s: { scale: 1, opacity: 1 } }} transition={{ type: "spring", stiffness: 220, damping: 16, delay: 0.1 }} />
            <svg viewBox="0 0 64 64" aria-hidden="true">
              <motion.circle cx="32" cy="32" r="30" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round"
                variants={{ h: { pathLength: 0 }, s: { pathLength: 1 } }} transition={{ duration: 1.4, ease: EASE, delay: 0.2 }} />
            </svg>
          </span>
          <div>
            <motion.span className="sig-hand" aria-label="Muzammil"
              variants={{ h: { clipPath: "inset(0 100% 0 0)" }, s: { clipPath: "inset(0 0% 0 0)" } }} transition={{ duration: 1.8, ease: [0.65, 0, 0.35, 1], delay: 0.45 }}>Muzammil</motion.span>
            <motion.span className="sig-role" variants={{ h: { opacity: 0, y: 6 }, s: { opacity: 1, y: 0 } }} transition={{ duration: 0.8, delay: 1.5 }}>Third generation, Sithara Exports</motion.span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ---------------- Process ---------------- */
export function Process() {
  const track = useRef(null);
  const { scrollYProgress } = useScroll({ target: track, offset: ["start 0.8", "end 0.55"] });
  const left = useTransform(scrollYProgress, (v) => `${(v * 100).toFixed(2)}%`);
  return (
    <section className="process" id="process" aria-labelledby="process-title">
      <div className="wrap">
        <div className="head">
          <p className="eyebrow">How we work</p>
          <Reveal as="h2" id="process-title" className="h-lg">Tell us the catch. <em className="s">We’ll handle the rest.</em></Reveal>
          <Reveal as="p" className="lead" delay={0.08}>A simple, transparent path from your inquiry to your port.</Reveal>
        </div>
        <div className="track" ref={track}>
          <div className="track-line">
            <motion.span style={{ scaleX: scrollYProgress }} />
            <motion.span className="tship" aria-hidden="true" style={{ left }}><ShipIcon /></motion.span>
          </div>
          <ol className="steps">
            {STEPS.map(([h, p], i) => <Reveal as="li" key={h} delay={i * 0.08}><h3>{h}</h3><p>{p}</p></Reveal>)}
          </ol>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Gallery ---------------- */
function Shot({ i, cls, src, alt, cap, hidden, onOpen }) {
  const [ref, y] = useParallax(8);
  return (
    <Reveal as="figure" className={cls} ref={ref}>
      <button type="button" className="shot-btn" onClick={() => onOpen(i)} aria-label={`Open photo: ${cap}`}>
        {!hidden && (
          <motion.div className="shot-frame" layoutId={`shot-${i}`} transition={{ type: "spring", stiffness: 260, damping: 30 }}>
            <motion.img src={src} alt={alt} loading="lazy" style={{ y }} />
          </motion.div>
        )}
      </button>
      <figcaption>{cap}</figcaption>
    </Reveal>
  );
}

/* Photo expands from its tile to full screen (shared-layout animation) */
function Lightbox({ i, origin, onClose, onNav }) {
  const { gallery: GALLERY } = useSite();
  const [, src, alt, cap] = GALLERY[i];
  const closeRef = useRef(null);
  useEffect(() => {
    closeRef.current?.focus();
    window.__sxLenis?.stop(); document.body.classList.add("sheet-open");
    const key = (e) => { if (e.key === "Escape") onClose(); if (e.key === "ArrowRight") onNav(1); if (e.key === "ArrowLeft") onNav(-1); };
    addEventListener("keydown", key);
    return () => { removeEventListener("keydown", key); window.__sxLenis?.start(); document.body.classList.remove("sheet-open"); };
  }, [onClose, onNav]);
  return (
    <motion.div className="lightbox" role="dialog" aria-modal="true" aria-label={cap} initial={{ opacity: 1 }} exit={{ opacity: 1 }}>
      <motion.div className="lb-scrim" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }} />
      <motion.div className="lb-frame" layoutId={`shot-${origin}`} transition={{ type: "spring", stiffness: 260, damping: 30 }}>
        <AnimatePresence initial={false}>
          <motion.img key={src} src={src} alt={alt} initial={{ opacity: 0, scale: 1.03 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.45, ease: EASE }} />
        </AnimatePresence>
      </motion.div>
      <motion.div className="lb-bar" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.25 } }} exit={{ opacity: 0, transition: { duration: 0.15 } }}>
        <button type="button" onClick={() => onNav(-1)} aria-label="Previous photo">‹</button>
        <span>{cap} · {i + 1} / {GALLERY.length}</span>
        <button type="button" onClick={() => onNav(1)} aria-label="Next photo">›</button>
        <button type="button" ref={closeRef} onClick={onClose} aria-label="Close photo" className="lb-x">✕</button>
      </motion.div>
    </motion.div>
  );
}

export function Gallery() {
  const { gallery: GALLERY } = useSite();
  const [open, setOpen] = useState(null);     // photo being shown
  const [origin, setOrigin] = useState(null); // tile it expanded from (it shrinks back there)
  const openAt = useCallback((i) => { setOrigin(i); setOpen(i); }, []);
  const close = useCallback(() => { setOpen(null); }, []);
  const nav = useCallback((d) => setOpen((o) => (o + d + GALLERY.length) % GALLERY.length), [GALLERY.length]);
  if (!GALLERY.length) return null; // nothing published from the dashboard yet
  return (
    <section className="gallery-s" id="gallery" aria-labelledby="gallery-title">
      <div className="wrap">
        <div className="head"><div><p className="eyebrow">Product gallery</p><Reveal as="h2" id="gallery-title" className="h-lg">Straight from <em className="s">the packing floor.</em></Reveal></div></div>
        <div className="gallery">{GALLERY.map(([c, s, a, cap], i) => <Shot key={c} i={i} cls={c} src={s} alt={a} cap={cap} hidden={open !== null && origin === i} onOpen={openAt} />)}</div>
      </div>
      <AnimatePresence>{open !== null && <Lightbox key="lb" i={open} origin={origin} onClose={close} onNav={nav} />}</AnimatePresence>
    </section>
  );
}

/* ---------------- Testimonials ---------------- */
export function Voices() {
  return (
    <section className="voices" id="testimonials" aria-labelledby="t-title">
      <div className="wrap">
        <div className="head center">
          <p className="eyebrow">Testimonials</p>
          <Reveal as="h2" id="t-title" className="h-lg">In our buyers’ <em className="s">own words.</em></Reveal>
          <Reveal as="p" className="lead" delay={0.08}>What importers say about working with Sithara Exports.</Reveal>
        </div>
        <div className="quotes">
          {QUOTES.map(([q, n, r], i) => (
            <Reveal as="figure" key={n} delay={i * 0.1} whileHover={{ y: -4 }}>
              <div className="mark" aria-hidden="true">“</div>
              <blockquote>{q}</blockquote>
              <figcaption><span className="av" aria-hidden="true">{n[0]}</span><div><b>{n}</b><span>{r}</span></div></figcaption>
            </Reveal>
          ))}
        </div>
        <p className="share">Worked with Sithara Exports? We’d love to hear from you. <a href={wa("Hello Sithara Exports, I'd like to share my experience.")} target="_blank" rel="noopener">Share your experience ›</a></p>
      </div>
    </section>
  );
}

/* ---------------- FAQ ---------------- */
function QA({ q, a, open, onToggle }) {
  return (
    <div className="faq-item">
      <button type="button" className="faq-q" aria-expanded={open} onClick={onToggle}>
        {q}<span className={`pm${open ? " open" : ""}`} aria-hidden="true" />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div className="ans" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.5, ease: EASE }}>
            <p>{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
export function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <section className="faq-s" id="faq" aria-labelledby="faq-title">
      <div className="wrap faq-grid">
        <div className="head">
          <p className="eyebrow">FAQ</p>
          <Reveal as="h2" id="faq-title" className="h-lg">Questions importers <em className="s">often ask.</em></Reveal>
          <Reveal as="p" className="lead" delay={0.08}>Can’t find your answer? Message us on WhatsApp and we’ll reply personally.</Reveal>
        </div>
        <div className="faq">{FAQ.map(([q, a], i) => <QA key={q} q={q} a={a} open={open === i} onToggle={() => setOpen(open === i ? -1 : i)} />)}</div>
      </div>
    </section>
  );
}

/* ---------------- Contact ---------------- */
export function Contact({ prefill }) {
  const [f, setF] = useState({ name: "", company: "", email: "", country: "", product: 0, req: "" });
  const [err, setErr] = useState(""), [msg, setMsg] = useState(""), [status, setStatus] = useState("");
  useEffect(() => {
    if (!prefill) return;
    setF((s) => ({ ...s, product: prefill.opt, req: s.req.trim() ? s.req : `Product: ${prefill.n}\nGrade / size: \nQuantity: \nPacking: \nDestination port: ` }));
  }, [prefill]);
  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }));
  const submit = (e) => {
    e.preventDefault();
    const missing = [];
    if (!f.name.trim()) missing.push("your name");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) missing.push("a valid email");
    if (!f.country.trim()) missing.push("your country");
    if (missing.length) { setErr("Add " + missing.join(", ") + " so we can reply."); setMsg(""); return; }
    setErr(""); setStatus(""); track("inquiry_prepared", FORM_PRODUCTS[f.product]);
    setMsg(`Inquiry for Sithara Exports\nName: ${f.name}${f.company.trim() ? "\nCompany: " + f.company : ""}\nEmail: ${f.email}\nCountry: ${f.country}\nProduct: ${FORM_PRODUCTS[f.product]}${f.req.trim() ? "\nRequirement: " + f.req.trim() : ""}`);
  };
  const copy = () => navigator.clipboard.writeText(msg).then(() => setStatus(`Copied. Paste it into an email to ${EMAIL}`), () => setStatus("Select the text above and press Ctrl+C to copy."));
  return (
    <section className="dark contact-s" id="contact" aria-labelledby="contact-title" data-nav="dark">
      <div className="glow a" style={{ top: "auto", bottom: -200, right: "10%" }} /><div className="glow b" style={{ bottom: "auto", top: -200 }} />
      <div className="wrap contact">
        <div>
          <p className="eyebrow">Contact</p>
          <MaskLines as="h2" id="contact-title" className="h-xl" lines={["Let’s talk about", <em className="s">your next order.</em>]} />
          <Reveal as="p" className="lead">Send your requirement and we’ll respond with specifications and availability.</Reveal>
          <Reveal as="dl" className="lines" delay={0.08}>
            <div><dt>Location</dt><dd>Chandiroor, near Aroor, Cochin, Kerala, India</dd></div>
            <div><dt>Email</dt><dd>{EMAIL}</dd></div>
            <div><dt>Phone / WhatsApp</dt><dd>{PHONE_DISPLAY}</dd></div>
          </Reveal>
          <Magnetic className="btn wa" href={wa()} target="_blank" rel="noopener"><WaIcon /> Chat on WhatsApp</Magnetic>
        </div>
        <Reveal as="form" className="inq" noValidate onSubmit={submit}>
          <div className="f"><label htmlFor="q-name">Name</label><input id="q-name" autoComplete="name" value={f.name} onChange={set("name")} required /></div>
          <div className="f"><label htmlFor="q-company">Company</label><input id="q-company" autoComplete="organization" value={f.company} onChange={set("company")} /></div>
          <div className="f"><label htmlFor="q-email">Email</label><input id="q-email" type="email" autoComplete="email" value={f.email} onChange={set("email")} required /></div>
          <div className="f"><label htmlFor="q-country">Country</label><input id="q-country" autoComplete="country-name" value={f.country} onChange={set("country")} required /></div>
          <div className="f full"><label htmlFor="q-product">Product</label>
            <select id="q-product" value={f.product} onChange={(e) => setF((s) => ({ ...s, product: Number(e.target.value) }))}>
              {FORM_PRODUCTS.map((p, i) => <option key={p} value={i}>{p}</option>)}
            </select></div>
          <div className="f full"><label htmlFor="q-req">Requirement</label><textarea id="q-req" value={f.req} onChange={set("req")} placeholder="Grade, quantity, packing and destination port" /></div>
          {err && <p className="form-err">{err}</p>}
          <div className="form-foot">
            <Magnetic as="button" className="btn btn-ember" type="submit">Send Inquiry <Arrow /></Magnetic>
            <span className="hint">Prepares your inquiry for WhatsApp or email.</span>
          </div>
          <AnimatePresence>
            {msg && (
              <motion.div className="ready" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.6, ease: EASE }}>
                <div className="ready-h">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <motion.circle cx="12" cy="12" r="10" fill="none" stroke="#34D399" strokeWidth="1.6" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, ease: EASE }} />
                    <motion.path d="M7.5 12.5l3 3 6-6.5" fill="none" stroke="#34D399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.45, delay: 0.45, ease: EASE }} />
                  </svg>
                  Your inquiry is ready to send
                </div>
                <pre>{msg}</pre>
                <div className="row">
                  <a className="btn wa" href={wa(msg)} target="_blank" rel="noopener" style={{ margin: 0 }}>Send on WhatsApp</a>
                  <button className="ghost" type="button" onClick={copy}>Copy for email</button>
                  <span className="status">{status}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- Footer ---------------- */
export function Footer() {
  return (
    <footer data-nav="dark">
      <div className="wrap">
        <div className="horizon" aria-hidden="true"><span className="boat"><ShipIcon /></span></div>
        <div className="foot-top">
          <div><a className="brand" href="#top"><img src="img/sithara-exports-logo.svg" alt="" />Sithara Exports</a><p>Three generations. One family. One standard.<br />Seafood exporter since 1967.</p></div>
          <div><b>Company</b><a href="#about">About</a><a href="#heritage">Heritage</a><a href="#testimonials">Testimonials</a></div>
          <div><b>Seafood</b><a href="#products">Shrimps</a><a href="#products">Cuttlefish &amp; Squid</a><a href="#products">Live Mud Crabs</a></div>
          <div><b>Contact</b><span>{EMAIL}</span><a href={wa()} target="_blank" rel="noopener">{PHONE_DISPLAY}</a><span>Chandiroor · Cochin · Kerala</span></div>
        </div>
        <div className="foot-base"><span>Copyright © {new Date().getFullYear()} Sithara Exports. All rights reserved.</span><span>Three generations · Since 1967</span></div>
      </div>
    </footer>
  );
}

/* ---------------- Floating WhatsApp ---------------- */
export function WaFab({ ready }) {
  const [scope, animate] = useAnimate();
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!ready) return;
    const reduce = false; // full animations on every phone, even with 'reduce motion' / battery saver on (owner's choice)
    const t1 = setTimeout(() => setOpen(true), 1900), t2 = setTimeout(() => setOpen(false), 6600);
    let iv;
    if (!reduce) iv = setInterval(() => {
      if (document.hidden || scope.current?.matches(":hover")) return;
      animate(".wa-ic svg", { rotate: [0, -16, 14, -10, 8, 0], scale: [1, 1.18, 1.18, 1.1, 1, 1] }, { duration: 0.9, ease: "easeInOut" });
    }, 12000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearInterval(iv); };
  }, [ready, animate, scope]);
  return (
    <motion.a ref={scope} className={`wa-fab${open ? " open" : ""}`} href={wa("Hello Sithara Exports, I'd like to request a quote.")} target="_blank" rel="noopener" aria-label="Contact now on WhatsApp"
      initial={{ scale: 0, rotate: -35 }} animate={ready ? { scale: 1, rotate: 0 } : undefined}
      transition={{ type: "spring", stiffness: 420, damping: 14, delay: 1.4 }} whileTap={{ scale: 0.9 }} whileHover={{ scale: 1.04 }}>
      <span className="wa-ring" aria-hidden="true" /><span className="wa-ring r2" aria-hidden="true" />
      <span className="wa-label"><small>Online · replies fast</small>Contact now on WhatsApp</span>
      <span className="wa-ic" aria-hidden="true"><WaIcon /><i className="wa-dot" /></span>
    </motion.a>
  );
}
