"use client";

import { useEffect } from "react";

// Entrance animations that should play only once.
const revealAnimations = new Set([
  "hero-reveal",
  "hero-text-reveal",
  "hero-line-reveal",
  "block-reveal",
]);

// React attaches its own key to an element once it has hydrated it, after
// comparing the element's attributes with the server HTML.
const isHydrated = (element: Element) =>
  Object.keys(element).some((key) => key.startsWith("__reactFiber$"));

// Next.js keeps visited pages in the document and only hides them
// (display: none). Showing a page again restarts its CSS animations, so the
// content would vanish and slide in a second time. Once an entrance animation
// has finished, its element is marked so it keeps its final state. A data
// attribute, so React re-rendering the className doesn't remove it.
//
// An animation can finish before React has hydrated its element (the hero
// does in development). Marking it then would make the attributes differ
// from the server HTML, so such elements wait until they are hydrated.
const RevealDone = () => {
  useEffect(() => {
    const pending = new Set<Element>();
    let timer = 0;

    const markPending = () => {
      timer = 0;
      pending.forEach((element) => {
        if (!element.isConnected) {
          pending.delete(element);
        } else if (isHydrated(element)) {
          element.setAttribute("data-reveal-done", "");
          pending.delete(element);
        }
      });
      if (pending.size) {
        timer = window.setTimeout(markPending, 250);
      }
    };

    const markDone = (event: AnimationEvent) => {
      if (!revealAnimations.has(event.animationName)) {
        return;
      }
      pending.add(event.target as Element);
      if (!timer) {
        markPending();
      }
    };

    document.addEventListener("animationend", markDone);

    // Animations that finished before this listener was added.
    document.getAnimations().forEach((animation) => {
      const target = (animation.effect as KeyframeEffect | null)?.target;
      if (
        animation instanceof CSSAnimation &&
        revealAnimations.has(animation.animationName) &&
        animation.playState === "finished" &&
        target
      ) {
        pending.add(target);
      }
    });
    markPending();

    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("animationend", markDone);
    };
  }, []);

  return null;
};

export default RevealDone;
