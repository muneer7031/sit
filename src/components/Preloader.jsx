import { useEffect, useRef } from "react";
import { stagger, useAnimate, useMotionValue } from "framer-motion";
import { EASE, EASE_IO } from "../motion.jsx";

const FISH = "M-20 0 C-12 -9 8 -9 14 0 C8 9 -12 9 -20 0 Z M14 0 L25 -8 L23 0 L25 8 Z";
const wave = (y) => { let d = `M-60 ${y}`; for (let i = 0; i < 46; i++) d += " q13 -6 26 0 t26 0"; return d; };

/* Act 0: the Sithara seal spins in and flies into the brand mark.
   Acts 1–3: fish into the carton → lid and stamp → crane lifts it onto the ship → ship sails.
   Everything runs as one framer-motion sequence; carton / ship / hook move on motion values. */
export default function Preloader({ onReveal, onDone, quick = false }) {
  const [scope, animate] = useAnimate();
  const cx = useMotionValue(220), cy = useMotionValue(220), cs = useMotionValue(1), shipX = useMotionValue(0), prog = useMotionValue(0);
  const carton = useRef(null), ship = useRef(null), hook = useRef(null), pct = useRef(null), bar = useRef(null);
  const exiting = useRef(false), seq = useRef(null);

  useEffect(() => {
    const draw = () => {
      const x = cx.get(), y = cy.get(), s = cs.get();
      carton.current?.setAttribute("transform", `translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${s.toFixed(3)})`);
      const hx = (x + 60 * s).toFixed(1);
      hook.current?.setAttribute("x1", hx); hook.current?.setAttribute("x2", hx); hook.current?.setAttribute("y2", (y - 11 * s).toFixed(1));
    };
    const unsub = [cx.on("change", draw), cy.on("change", draw), cs.on("change", draw),
      shipX.on("change", (v) => ship.current?.setAttribute("transform", `translate(${v.toFixed(1)} 0)`)),
      prog.on("change", (v) => { if (pct.current) pct.current.textContent = Math.round(v) + "%"; if (bar.current) bar.current.style.transform = `scaleX(${v / 100})`; })];
    draw();
    return () => unsub.forEach((u) => u());
  }, [cx, cy, cs, shipX, prog]);

  async function exit() {
    if (exiting.current) return; exiting.current = true;
    seq.current?.stop();
    setTimeout(onReveal, quick ? 150 : 350);
    await animate(scope.current, { clipPath: ["inset(0% 0% 0% 0%)", "inset(0% 0% 100% 0%)"] }, { duration: quick ? 0.55 : 1.1, ease: EASE_IO });
    onDone();
  }

  useEffect(() => {
    const root = scope.current;
    root.querySelectorAll(".draw").forEach((p) => { const L = p.getTotalLength().toFixed(1); p.setAttribute("stroke-dasharray", L); p.setAttribute("stroke-dashoffset", L); });
    const a = root.querySelector(".pl-seal img").getBoundingClientRect();
    const b = root.querySelector("#pl-brand-img").getBoundingClientRect();
    const dx = (b.left + b.width / 2) - (a.left + a.width / 2), dy = (b.top + b.height / 2) - (a.top + a.height / 2), s = b.width / a.width;
    const o = 1.45;
    const cap = (i, at) => [
      [`.pl-cap span:nth-child(${i})`, { opacity: 0, y: -12 }, { duration: 0.5, at }],
      [`.pl-cap span:nth-child(${i + 1})`, { opacity: [0, 1], y: [12, 0] }, { duration: 0.5, at }],
    ];
    seq.current = animate([
      [".pl-seal", { opacity: [0, 1], scale: [0.35, 1], rotate: [-160, 0] }, { duration: 1.1, ease: EASE, at: 0 }],
      [".pl-seal .halo", { opacity: [0, 1], scale: [0.6, 1] }, { duration: 0.9, at: 0.15 }],
      [".pl-seal .ringline", { opacity: [0, 1], scale: [0.7, 1.15] }, { duration: 1.2, ease: EASE, at: 0.2 }],
      [".pl-in > *", { opacity: [0, 1], y: [18, 0] }, { duration: 0.8, ease: EASE, delay: stagger(0.06), at: 1.2 }],
      [".pl-seal .halo, .pl-seal .ringline", { opacity: 0 }, { duration: 0.35, at: 1.25 }],
      [".pl-seal", { x: dx, y: dy, scale: s, rotate: 360 }, { duration: 0.85, ease: EASE_IO, at: 1.25 }],
      ["#pl-brand-img", { opacity: 1 }, { duration: 0.01, at: 2.1 }],
      [".pl-seal", { opacity: 0 }, { duration: 0.01, at: 2.1 }],
      [".draw", { strokeDashoffset: 0 }, { duration: 0.9, ease: "easeInOut", delay: stagger(0.05), at: o + 0.05 }],
      ["#pl-star", { opacity: [0, 1], scale: [0, 1], rotate: [-90, 0] }, { duration: 0.9, ease: "backOut", at: o + 0.3 }],
      [".pl-fish", { y: [-170, 0], opacity: [0, 1], rotate: [-30, 0] }, { duration: 0.6, ease: "backOut", delay: stagger(0.16), at: o + 0.45 }],
      ...cap(1, o + 1.4),
      ["#pl-lid", { y: [-80, 0], opacity: [0, 1], rotate: [-6, 0] }, { duration: 0.45, ease: "easeIn", at: o + 1.4 }],
      ["#pl-stamp", { scale: [1.7, 1], opacity: [0, 1] }, { duration: 0.3, ease: "easeIn", at: o + 1.85 }],
      ...cap(2, o + 2.25),
      ["#pl-hook", { opacity: 1 }, { duration: 0.01, at: o + 2.2 }],
      [cy, 112, { duration: 0.5, ease: "easeInOut", at: o + 2.25 }],
      [cx, 594, { duration: 0.75, ease: "easeInOut", at: o + 2.75 }],
      [cs, 0.5, { duration: 0.75, ease: "easeInOut", at: o + 2.75 }],
      [cy, 231, { duration: 0.42, ease: "easeIn", at: o + 3.5 }],
      ["#pl-hook", { opacity: 0 }, { duration: 0.2, at: o + 3.92 }],
      [shipX, 400, { duration: 1.15, ease: "easeIn", at: o + 3.95 }],
      [cx, 994, { duration: 1.15, ease: "easeIn", at: o + 3.95 }],
      [prog, 100, { duration: o + 4.9, ease: "linear", at: 0 }],
    ]);
    // Repeat visitors: same story, played fast so the whole preloader takes about 3 seconds
    if (quick) seq.current.speed = (o + 5.05) / 2.4;
    seq.current.then(() => setTimeout(exit, quick ? 0 : 150));
    return () => seq.current?.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="pl" ref={scope} role="status" aria-label="Loading Sithara Exports">
      <div className="pl-glow" />
      <button className="pl-skip" type="button" onClick={exit}>Skip</button>
      <div className="pl-seal" aria-hidden="true"><span className="halo" /><span className="ringline" /><img src="img/sithara-exports-logo.svg" alt="" /></div>
      <div className="pl-in">
        <div className="pl-brand" style={{ opacity: 0 }}><img id="pl-brand-img" src="img/sithara-exports-logo.svg" alt="" style={{ opacity: 0 }} /><div><b>Sithara Exports</b><span>Exporting seafood since 1967</span></div></div>
        <svg className="scene" viewBox="0 0 800 330" aria-hidden="true" style={{ opacity: 0 }}>
          <path id="pl-star" opacity="0" d="M700 30 C701.6 41 704 43.4 715 45 C704 46.6 701.6 49 700 60 C698.4 49 696 46.6 685 45 C696 43.4 698.4 41 700 30Z" fill="#F2E8D0" />
          <path className="stroke draw" d="M420 290 V96" />
          <path className="stroke draw" d="M180 96 H700" />
          <path className="stroke draw" d="M420 146 L470 96 M420 146 L370 96" />
          <path className="stroke faint draw" d="M404 290 L420 270 L436 290" />
          <path className="stroke draw" d="M90 290 H440" />
          <path className="stroke faint draw" d="M112 290 V314 M220 290 V314 M330 290 V314 M420 290 V314" />
          <g ref={ship}>
            <path className="stroke draw" d="M450 266 H790 L764 300 H478 Z" />
            <g className="stroke">
              <rect x="470" y="231" width="60" height="35" rx="2" />
              <rect x="532" y="231" width="60" height="35" rx="2" />
              <rect x="501" y="196" width="60" height="35" rx="2" />
              <rect x="563" y="196" width="60" height="35" rx="2" />
              <rect x="700" y="206" width="40" height="60" rx="2" />
              <path d="M708 220 H732 M708 230 H732" />
              <path className="faint" d="M482 236 V261 M494 236 V261 M506 236 V261 M518 236 V261 M544 236 V261 M556 236 V261 M568 236 V261 M580 236 V261" />
            </g>
            <rect x="714" y="188" width="12" height="18" rx="1" fill="none" stroke="#EE7A42" strokeWidth="1.5" />
            <text x="610" y="288" textAnchor="middle" fontFamily="Geist, sans-serif" fontSize="9" letterSpacing="3" fill="rgba(245,245,247,0.55)">SITHARA · COCHIN</text>
          </g>
          <g className="wv"><path className="stroke faint" d={wave(306)} /></g>
          <g className="wv b"><path className="stroke faint" d={wave(320)} /></g>
          <line ref={hook} id="pl-hook" x1="280" y1="96" x2="280" y2="200" stroke="rgba(245,245,247,0.6)" strokeWidth="1" opacity="0" />
          <g ref={carton} transform="translate(220 220)">
            {[[32, -2, -18, "#0D1A24"], [62, -5, 8, "#12324A"], [92, -2, -10, "#0D1A24"]].map(([x, y, r, f], i) => (
              <g key={i} transform={`translate(${x},${y}) rotate(${r})`}>
                <g className="pl-fish" opacity="0">
                  <path d={FISH} fill={f} stroke="#F5F5F7" strokeWidth="1.3" strokeLinejoin="round" />
                  <circle cx="-12" cy="-2" r="1.4" fill="#F5F5F7" />
                </g>
              </g>
            ))}
            <rect x="0" y="0" width="120" height="70" rx="3" fill="#050607" stroke="#F5F5F7" strokeWidth="1.5" />
            <g id="pl-stamp" opacity="0">
              <rect x="22" y="19" width="76" height="32" rx="2" fill="none" stroke="#EE7A42" strokeWidth="1" />
              <text x="60" y="33" textAnchor="middle" fontFamily="Geist, sans-serif" fontWeight="600" fontSize="8" letterSpacing="1.8" fill="#EE7A42">SITHARA</text>
              <text x="60" y="44" textAnchor="middle" fontFamily="Geist, sans-serif" fontSize="5.6" letterSpacing="1.2" fill="#F2E8D0">EXPORT · COCHIN</text>
            </g>
            <rect id="pl-lid" opacity="0" x="-4" y="-11" width="128" height="11" rx="2" fill="#050607" stroke="#F5F5F7" strokeWidth="1.5" />
          </g>
        </svg>
        <div className="pl-cap" style={{ opacity: 0 }}>
          <span><b>01</b>Graded and packed in Cochin</span>
          <span><b>02</b>Sealed and labelled</span>
          <span><b>03</b>On its way to your port</span>
        </div>
        <div className="pl-prog" style={{ opacity: 0 }}><div className="pl-bar"><i ref={bar} /></div><span ref={pct}>0%</span></div>
        <p className="pl-loc" style={{ opacity: 0 }}>Chandiroor · Cochin · Kerala, India</p>
      </div>
    </div>
  );
}
