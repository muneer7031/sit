import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { EASE } from "../motion.jsx";

export default function Nav({ ready }) {
  const [state, setState] = useState({ scrolled: false, dark: false });
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
          <a className="btn btn-ember" href="#contact">Request a Quote</a>
        </nav>
      </div>
    </motion.header>
  );
}
