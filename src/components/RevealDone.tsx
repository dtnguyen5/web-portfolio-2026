"use client";

import { useEffect } from "react";

// Entrance animations that should play only once.
const revealAnimations = new Set([
  "hero-reveal",
  "hero-text-reveal",
  "hero-line-reveal",
  "block-reveal",
]);

// Next.js keeps visited pages in the document and only hides them
// (display: none). Showing a page again restarts its CSS animations, so the
// content would vanish and slide in a second time. Once an entrance animation
// has finished, its element is marked so it keeps its final state. A data
// attribute, so React re-rendering the className doesn't remove it.
const RevealDone = () => {
  useEffect(() => {
    const markDone = (event: AnimationEvent) => {
      if (revealAnimations.has(event.animationName)) {
        (event.target as Element).setAttribute("data-reveal-done", "");
      }
    };

    document.addEventListener("animationend", markDone);

    return () => document.removeEventListener("animationend", markDone);
  }, []);

  return null;
};

export default RevealDone;
