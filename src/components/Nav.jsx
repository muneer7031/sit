import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { EASE } from "../motion.jsx";

/* Dark / light switch. Dark is the default; the choice is remembered on this device. */
function ThemeToggle() {
  const [theme, setTheme] = useState("dark");
  useEffect(() => { setTheme(document.documentElement.dataset.theme === "light" ? "light" : "dark"); }, []);
  const flip = () => {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    // tell the browser the page's own look, so built-in "dark mode for websites" doesn't repaint it
    document.querySelector('meta[name="color-scheme"]')?.setAttribute("content", `${next} only`);
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

const LINKS = [["#about", "About"], ["#products", "Products"], ["#offers", "Available now"], ["#routes", "Where we ship"], ["#heritage", "Heritage"], ["#process", "How we work"], ["#faq", "FAQ"], ["#contact", "Contact"]];

/* Phone menu: a button in the header opens a full-screen list of the sections */
function PhoneMenu() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    window.__sxLenis?.stop(); document.body.style.overflow = "hidden";
    const esc = (e) => e.key === "Escape" && setOpen(false);
    addEventListener("keydown", esc);
    return () => { window.__sxLenis?.start(); document.body.style.overflow = ""; removeEventListener("keydown", esc); };
  }, [open]);
  const go = (href) => (e) => {
    e.preventDefault(); setOpen(false);
    setTimeout(() => { const t = document.querySelector(href); if (!t) return; if (window.__sxLenis) window.__sxLenis.scrollTo(t, { duration: 1.1 }); else t.scrollIntoView({ behavior: "smooth" }); }, 60);
  };
  return (
    <>
      <button type="button" className="menu-btn" aria-label="Open menu" aria-expanded={open} onClick={() => setOpen(true)}>
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
      </button>
      {typeof document !== "undefined" && createPortal(<AnimatePresence>
        {open && (
          <motion.div className="pmenu" role="dialog" aria-modal="true" aria-label="Menu" data-lenis-prevent
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
            <div className="pmenu-top">
              <span className="brand"><img src="img/zetarah-exports-logo.svg" alt="" />Zetarah Exports</span>
              <button type="button" className="menu-btn" aria-label="Close menu" onClick={() => setOpen(false)} autoFocus>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
              </button>
            </div>
            <nav aria-label="Sections">
              {LINKS.filter(([h]) => typeof document === "undefined" || document.querySelector(h)).map(([h, l], i) => (
                <motion.a key={h} href={h} onClick={go(h)} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: EASE, delay: 0.04 * i }}>{l}</motion.a>
              ))}
            </nav>
            <div className="pmenu-foot">
              <ThemeToggle />
              <a className="btn btn-ember" href="#contact" onClick={go("#contact")}>Request a Quote</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>, document.body)}
    </>
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
        <a className="brand" href="#top"><img src="img/zetarah-exports-logo.svg" alt="" />Zetarah Exports</a>
        <nav aria-label="Sections">
          <a href="#about">About</a>
          <a href="#products">Products</a>
          <a href="#heritage">Heritage</a>
          <a href="#process">Process</a>
          <a href="#faq">FAQ</a>
          <PhoneMenu />
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
