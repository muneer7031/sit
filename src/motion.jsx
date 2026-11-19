import { forwardRef, useEffect, useRef } from "react";
import { animate, motion, useInView, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";

export const EASE = [0.22, 1, 0.36, 1];
export const EASE_IO = [0.87, 0, 0.13, 1];
const VIEW = { once: true, margin: "0px 0px -8% 0px" };

/* Fade + lift into place the first time it enters the viewport */
export const Reveal = forwardRef(function Reveal({ as = "div", delay = 0, y = 28, children, ...rest }, ref) {
  const C = motion[as];
  return (
    <C ref={ref} initial={{ opacity: 0, y }} whileInView={{ opacity: 1, y: 0 }} viewport={VIEW}
       transition={{ duration: 1.1, ease: EASE, delay }} {...rest}>
      {children}
    </C>
  );
});

/* Heading whose lines rise out of a mask. `play` drives it manually (hero); otherwise it plays in view. */
export function MaskLines({ as = "h2", lines, play, delay = 0, ...rest }) {
  const C = motion[as];
  const manual = play !== undefined;
  return (
    <C {...rest} initial="hide" {...(manual ? { animate: play ? "show" : "hide" } : { whileInView: "show", viewport: VIEW })}>
      {lines.map((ln, i) => (
        <span className="line" key={i}>
          <motion.span
            variants={{ hide: { y: "118%", rotate: 3 }, show: { y: "0%", rotate: 0 } }}
            transition={{ duration: 1.4, ease: EASE, delay: delay + i * 0.11 }}>
            {ln}
          </motion.span>
        </span>
      ))}
    </C>
  );
}

/* Apple-keynote word light-up, scrubbed by scroll. parts: [{ t: "text", em?: true }] */
function Word({ progress, range, children }) {
  const opacity = useTransform(progress, range, [0.12, 1]);
  return <motion.span className="w" style={{ opacity }}>{children}</motion.span>;
}
export function ScrollWords({ as = "p", parts, ...rest }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.5"] });
  const words = [];
  parts.forEach((p) => p.t.split(/\s+/).filter(Boolean).forEach((w) => words.push({ w, em: !!p.em })));
  const C = as;
  return (
    <C ref={ref} {...rest}>
      {words.map((x, i) => {
        const range = [i / words.length, (i + 1) / words.length];
        const word = <Word key={i} progress={scrollYProgress} range={range}>{x.w}</Word>;
        return (
          <span key={i}>
            {x.em ? <em className="s">{word}</em> : word}
            {i < words.length - 1 ? " " : ""}
          </span>
        );
      })}
    </C>
  );
}

/* Number that counts up once in view */
export function Counter({ to, from = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  useEffect(() => {
    if (!inView || !ref.current) return;
    const reduce = false; // full animations on every phone, even with 'reduce motion' / battery saver on (owner's choice)
    if (reduce) { ref.current.textContent = to; return; }
    const c = animate(from, to, { duration: 2.2, ease: [0.16, 1, 0.3, 1], onUpdate: (v) => { if (ref.current) ref.current.textContent = Math.round(v); } });
    return () => c.stop();
  }, [inView, from, to]);
  return <span ref={ref}>{from}</span>;
}

/* Inner image drifts inside its frame while the frame scrolls past */
export function useParallax(range = 8) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [`-${range}%`, `${range}%`]);
  return [ref, y];
}

/* Button that leans toward the cursor on a spring */
export function Magnetic({ as = "a", className, children, strength = [0.28, 0.38], ...rest }) {
  const C = motion[as];
  const mx = useMotionValue(0), my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 260, damping: 14, mass: 0.6 });
  const y = useSpring(my, { stiffness: 260, damping: 14, mass: 0.6 });
  const fine = typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  return (
    <C className={className} style={{ x, y }} whileTap={{ scale: 0.96 }}
      onPointerMove={fine ? (e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left - r.width / 2) * strength[0]);
        my.set((e.clientY - r.top - r.height / 2) * strength[1]);
      } : undefined}
      onPointerLeave={() => { mx.set(0); my.set(0); }}
      {...rest}>
      {children}
    </C>
  );
}

/* Thin reading-progress line across the top of the page */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });
  return <motion.div className="scroll-progress" style={{ scaleX }} aria-hidden="true" />;
}

export const Arrow = () => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
);
export const WaIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 2s.8 2.3.9 2.5c.1.2 1.6 2.5 4 3.5 1.5.6 2 .7 2.8.6.4-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2l-.5-.3z" /></svg>
);
export const ShipIcon = () => (
  <svg viewBox="0 0 32 20" aria-hidden="true"><path d="M2 13h28l-3.5 5H5.5z" fill="currentColor" /><rect x="6" y="7" width="6" height="5.5" rx=".6" fill="currentColor" /><rect x="13" y="7" width="6" height="5.5" rx=".6" fill="currentColor" opacity=".65" /><rect x="9.5" y="1.5" width="6" height="5" rx=".6" fill="currentColor" opacity=".8" /><rect x="22" y="3" width="4.5" height="9.5" rx=".6" fill="currentColor" /></svg>
);
