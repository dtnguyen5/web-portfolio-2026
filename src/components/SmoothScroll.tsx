"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

const SmoothScroll = () => {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.08,
      wheelMultiplier: 0.9,
      anchors: true,
    });

    return () => lenis.destroy();
  }, []);

  return null;
};

export default SmoothScroll;
