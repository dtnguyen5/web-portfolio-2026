"use client";

/* =============================================================================
 * SMOOTH SCROLL – plynulé scrollování (knihovna Lenis)
 * -----------------------------------------------------------------------------
 * Místo trhaného skákání kolečkem myši stránka „dojíždí“. Nic nevykresluje,
 * jen zapne Lenis po načtení stránky. Kdo má v systému vypnuté animace
 * (prefers-reduced-motion), má normální scroll.
 * ========================================================================== */

import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

const SmoothScroll = () => {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const lenis = new Lenis({
      autoRaf: true, // Lenis si sám běží každý snímek
      lerp: 0.08, // plynulost dojezdu (menší = delší a měkčí dojezd)
      wheelMultiplier: 0.9, // citlivost kolečka myši (1 = normální)
      anchors: true, // odkazy typu #kontakt taky scrollují plynule
    });

    // Úklid při opuštění stránky
    return () => lenis.destroy();
  }, []);

  return null;
};

export default SmoothScroll;
