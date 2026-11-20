import { useEffect, useMemo, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Arrow, EASE, Magnetic, MaskLines } from "../motion.jsx";

/* Slow ocean-depth contour lines that drift toward the pointer */
function useContours(ref) {
  useEffect(() => {
    const c = ref.current, ctx = c.getContext("2d");
    const reduce = false; // full animations on every phone, even with 'reduce motion' / battery saver on (owner's choice)
    let w = 0, h = 0, t = 0, raf = 0, vis = true, mx = 0, my = 0, tx = 0, ty = 0;
    function draw() {
      ctx.clearRect(0, 0, w, h);
      const N = 34, hi = Math.floor(N * 0.58);
      for (let i = 0; i < N; i++) {
        const k = i / (N - 1), base = h * 0.12 + k * h * 0.98;
        ctx.beginPath();
        for (let x = -20; x <= w + 20; x += 10) {
          const nx = x / Math.max(w, 1);
          const y = base + Math.sin(nx * 3.1 + i * 0.33 + t * 0.5) * 16 * (0.4 + k) + Math.sin(nx * 7.3 - i * 0.21 + t * 0.3) * 6
            - Math.pow(nx, 1.5) * h * 0.16 * (1 - k) + mx * 26 * (k - 0.5) + my * 12 * k;
          x === -20 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        if (i === hi) { ctx.strokeStyle = "rgba(238,122,66,0.6)"; ctx.lineWidth = 1.4; }
        else { ctx.strokeStyle = "rgba(242,232,208," + (0.03 + 0.11 * Math.sin(k * Math.PI)).toFixed(3) + ")"; ctx.lineWidth = 1; }
        ctx.stroke();
      }
    }
    function size() {
      const d = Math.min(window.devicePixelRatio || 1, 2), r = c.getBoundingClientRect();
      w = r.width; h = r.height; c.width = Math.round(w * d); c.height = Math.round(h * d);
      ctx.setTransform(d, 0, 0, d, 0, 0); draw();
    }
    const loop = () => { t += 0.0035; mx += (tx - mx) * 0.035; my += (ty - my) * 0.035; draw(); raf = vis ? requestAnimationFrame(loop) : 0; };
    const move = (e) => { tx = e.clientX / innerWidth - 0.5; ty = e.clientY / innerHeight - 0.5; };
    size(); addEventListener("resize", size);
    let io;
    if (!reduce) {
      io = new IntersectionObserver(([e]) => { vis = e.isIntersecting; if (vis && !raf) raf = requestAnimationFrame(loop); });
      io.observe(c);
      addEventListener("pointermove", move, { passive: true });
    }
    return () => { cancelAnimationFrame(raf); io?.disconnect(); removeEventListener("resize", size); removeEventListener("pointermove", move); };
  }, [ref]);
}

export default function Hero({ ready }) {
  const reduce = false; // full animations on every phone, even with 'reduce motion' / battery saver on (owner's choice)
  const hero = useRef(null), canvas = useRef(null);
  useContours(canvas);
  const { scrollYProgress: p } = useScroll({ target: hero, offset: ["start start", "end start"] });
  const stageY = useTransform(p, [0, 0.7], ["0%", "-14%"]);
  const stageO = useTransform(p, [0, 0.7], [1, 0]);
  const contentY = useTransform(p, [0.3, 1], ["0%", "-14%"]);
  const contentO = useTransform(p, [0.3, 1], [1, 0]);
  const canvasY = useTransform(p, [0, 1], ["0%", "16%"]);
  const canvasO = useTransform(p, [0, 1], [1, 0.25]);

  const dust = useMemo(() => Array.from({ length: 26 }, () => {
    const sz = (Math.random() * 1.8 + 0.8).toFixed(1);
    return { left: `${(Math.random() * 100).toFixed(1)}%`, top: `${(20 + Math.random() * 78).toFixed(1)}%`, width: `${sz}px`, height: `${sz}px`,
      "--dx": `${(Math.random() * 40 - 20).toFixed(0)}px`, animationDuration: `${(6 + Math.random() * 7).toFixed(1)}s`, animationDelay: `-${(Math.random() * 10).toFixed(1)}s` };
  }), []);

  const on = ready || reduce;
  const flicker = { opacity: [0, 0.7, 0.05, 0.85, 0.25, 1] };
  const flickerT = { duration: 1, times: [0, 0.07, 0.19, 0.25, 0.39, 1], delay: 0.05 };
  const fade = (i) => ({
    initial: { opacity: 0, y: 26, filter: "blur(8px)" },
    animate: on ? { opacity: 1, y: 0, filter: "blur(0px)" } : undefined,
    transition: { duration: 1.3, ease: EASE, delay: 0.75 + i * 0.1 },
  });

  return (
    <section className="hero" ref={hero} aria-labelledby="hero-title" data-nav="dark">
      <motion.div style={{ position: "absolute", inset: 0, y: canvasY, opacity: canvasO }}>
        <motion.canvas className="hero-canvas" ref={canvas} aria-hidden="true"
          initial={{ opacity: 0, scale: 1.06 }} animate={on ? { opacity: 1, scale: 1 } : undefined} transition={{ duration: 2.6, ease: "easeOut" }} />
      </motion.div>
      <div className="hero-aura" aria-hidden="true" />

      <motion.div className="stage" aria-hidden="true" style={{ y: stageY, opacity: stageO }}>
        <div className="light">
          <motion.div className="beam" initial={{ opacity: 0 }} animate={on ? flicker : undefined} transition={flickerT} />
          <motion.div className="beam core" initial={{ opacity: 0 }} animate={on ? flicker : undefined} transition={flickerT} />
          <motion.div className="lamp" initial={{ opacity: 0 }} animate={on ? flicker : undefined} transition={flickerT} />
        </div>
        {/* side rim lights: angled spotlights from the top-left and top-right corners */}
        {["l", "r"].map((s) => (
          <motion.div key={s} className={`side-light ${s}`} initial={{ opacity: 0 }}
            animate={on ? { opacity: [0, 0.8, 0.15, 1] } : undefined}
            transition={{ duration: 0.9, times: [0, 0.2, 0.45, 1], delay: s === "l" ? 0.7 : 0.9 }}>
            <div className="side-flick"><div className="side-beam" /><div className="side-beam core" /><div className="side-lamp" /></div>
          </motion.div>
        ))}
        <motion.div className="dust" initial={{ opacity: 0 }} animate={on ? { opacity: 1 } : undefined} transition={{ duration: 1.4, delay: 0.8 }}>
          {!reduce && dust.map((s, i) => <span key={i} style={s} />)}
        </motion.div>
      </motion.div>

      <motion.div className="hero-content" style={{ y: contentY, opacity: contentO }}>
        <div className="wrap hero-center">
          {/* The prawn sits in the same column as the text, so it can never collide with the pill at any screen size */}
          <motion.div className="prawn-wrap" aria-hidden="true" initial={{ y: 36 }} animate={on ? { y: 0 } : undefined} transition={{ duration: 2, ease: EASE, delay: 0.45 }}>
            <motion.div className="pool" initial={{ opacity: 0 }} animate={on ? { opacity: 1 } : undefined} transition={{ duration: 1.4, delay: 0.8 }} />
            <div className="prawn-float" style={{ "--prawn-mask": 'url("img/prawn.webp")' }}>
              <motion.img className="prawn" src="img/prawn.webp" alt="" width="677" height="369" fetchpriority="high"
                initial={{ opacity: 0, filter: "brightness(0.15) blur(6px)" }}
                animate={on ? { opacity: 1, filter: "brightness(1) blur(0px)" } : undefined}
                transition={{ duration: 1.8, ease: "easeOut", delay: 0.45 }} />
            </div>
          </motion.div>
          <motion.p className="eyebrow" {...fade(0)}>Est. 1967 · Chandiroor, Kerala</motion.p>
          <MaskLines as="h1" id="hero-title" play={on} delay={0.25}
            lines={["From the Kerala coast", <>to your <em className="s">cold chain.</em></>]} />
          <motion.p className="hero-sub" {...fade(1)}>Family-owned seafood exporter in Cochin (Kochi), supplying fresh, frozen, live and dried seafood to importers worldwide, packed to your specification.</motion.p>
          <motion.div className="hero-ctas" {...fade(2)}>
            <Magnetic className="btn btn-ember" href="#contact">Request a Quote <Arrow /></Magnetic>
            <Magnetic className="btn btn-glass" href="#products">Explore products</Magnetic>
          </motion.div>
          <motion.dl className="ship-strip" aria-label="Shipment details" {...fade(3)}>
            <div><dt>Port of loading</dt><dd>Cochin, India</dd></div>
            <div><dt>Cargo</dt><dd>Fresh · Frozen · Live · Dried</dd></div>
            <div><dt>Packing</dt><dd>Your carton &amp; brand</dd></div>
            <div><dt>Status</dt><dd className="live">Accepting inquiries</dd></div>
          </motion.dl>
        </div>
      </motion.div>
      <div className="scroll-cue" aria-hidden="true" />
    </section>
  );
}
