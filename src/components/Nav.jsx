import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { EASE } from "../motion.jsx";

/* Dark / light switch. Dark is the default; the choice is remembered on this device. */
function ThemeToggle() {
  const [theme, setTheme] = useState("dark");
  useEffect(() => { setTheme(document.documentElement.dataset.theme === "light" ? "light" : "dark"); }, []);
  const flip = () => {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem("sx-theme", next); } catch { /* private mode: applies to this visit only */ }
    setTheme(next);
  };
  const dark = theme === "dark";
  return (
    <button type="button" className="theme-toggle" onClick={flip} aria-label={dark ? "Switch to light mode" : "Switch to dark mode"} title={dark ? "Light mode" : "Dark mode"}>
      <motion.svg key={theme} viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
        initial={{ rotate: -90, scale: 0.6, opacity: 0 }} animate={{ rotate: 0, scale: 1, opacity: 1 }} transition={{ duration: 0.4, ease: EASE }}>
        {dark
          ? <><circle cx="12" cy="12" r="4.2" /><path d="M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4L6 18M18 6l1.4-1.4" /></>
          : <path d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5a8.5 8.5 0 1 0 10.7 10.7z" />}
      </motion.svg>
    </button>
  );
}

export default function Nav({ ready }) {
  const [state, setState] = useState({ scrolled: false, dark: false });
  // While the hero's own "Request a Quote" button is visible, the header shows the dark/light switch
  // in its place; once that button scrolls away, the switch turns into "Request a Quote".
  const [heroCta, setHeroCta] = useState(true);
  useEffect(() => {
    const el = document.querySelector(".hero-ctas");
    if (!el || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(([e]) => setHeroCta(e.isIntersecting), { rootMargin: "-64px 0px 0px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    const probe = 32;
    const update = () => {
      const zones = document.querySelectorAll("[data-nav='dark']");
      let overDark = false;
      zones.forEach((z) => { const r = z.getBoundingClientRect(); if (r.top <= probe && r.bottom > probe) overDark = true; });
      const hero = zones[0]?.getBoundingClientRect();
      const atHero = hero ? hero.bottom > probe : false;
      const y = window.scrollY;
      setState({ scrolled: y > 20 && !overDark, dark: y > 20 && overDark && !atHero });
    };
    update();
    addEventListener("scroll", update, { passive: true });
    return () => removeEventListener("scroll", update);
  }, []);
  return (
    <motion.header className={`lnav${state.scrolled ? " scrolled" : ""}${state.dark ? " on-dark" : ""}`}
      initial={{ y: -24, opacity: 0 }} animate={ready ? { y: 0, opacity: 1 } : undefined} transition={{ duration: 1.2, ease: EASE, delay: 0.5 }}>
      <div className="wrap">
        <a className="brand" href="#top"><img src="img/sithara-exports-logo.svg" alt="" />Sithara Exports</a>
        <nav aria-label="Sections">
          <a href="#about">About</a>
          <a href="#products">Products</a>
          <a href="#heritage">Heritage</a>
          <a href="#process">Process</a>
          <a href="#specs">Specs</a>
          <a href="#faq">FAQ</a>
          <span className="nav-swap">
            <AnimatePresence mode="popLayout" initial={false}>
              {heroCta
                ? <motion.span key="theme" className="swap-item" initial={{ opacity: 0, scale: 0.6, rotate: -45 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} exit={{ opacity: 0, scale: 0.6, rotate: 45 }} transition={{ duration: 0.35, ease: EASE }}><ThemeToggle /></motion.span>
                : <motion.a key="quote" className="btn btn-ember swap-item" href="#contact" initial={{ opacity: 0, scale: 0.85, y: 6 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.85, y: -6 }} transition={{ duration: 0.35, ease: EASE }}>Request a Quote</motion.a>}
            </AnimatePresence>
          </span>
        </nav>
      </div>
    </motion.header>
  );
}
