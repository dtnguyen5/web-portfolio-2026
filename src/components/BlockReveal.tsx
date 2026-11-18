"use client";

import { useEffect } from "react";

type BlockRevealProps = {
  // Elements that slide in as they scroll into view.
  selectors: string[];
};

const BlockReveal = ({ selectors }: BlockRevealProps) => {
  const selector = selectors.join(", ");

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    // Blocks already shown stay shown. Next.js keeps visited pages in the
    // document, so this runs again when one is shown again on back navigation.
    const revealBlocks = [
      ...document.querySelectorAll<HTMLElement>(selector),
    ].filter((item) => !item.hasAttribute("data-revealed"));

    if (!("IntersectionObserver" in window)) {
      revealBlocks.forEach((item) => item.setAttribute("data-revealed", ""));
      return;
    }

    const reveal: IntersectionObserverCallback = (entries, observer) => {
      entries
        .filter((entry) => entry.isIntersecting)
        .forEach((entry, index) => {
          const item = entry.target as HTMLElement;
          item.style.setProperty("--reveal-delay", `${Math.min(index, 4) * 140}ms`);
          item.setAttribute("data-revealed", "");
          observer.unobserve(item);
        });
    };
    const observer = new IntersectionObserver(reveal, {
      rootMargin: "0px 0px -10% 0px",
    });
    // The footer ends the page, so its last rows can never scroll above the
    // bottom margin used for the other blocks.
    const footerObserver = new IntersectionObserver(reveal);

    revealBlocks.forEach((item) =>
      (item.closest("footer") ? footerObserver : observer).observe(item),
    );

    return () => {
      observer.disconnect();
      footerObserver.disconnect();
    };
  }, [selector]);

  // State lives in data attributes, not classes: React rewrites the whole
  // class attribute whenever a block's className changes (e.g. on hover),
  // which would wipe classes added here and hide the block again.
  //
  // The style tag hides the blocks already in the server HTML. Otherwise the browser paints
  // them before the script runs, and they show once without the animation
  // and then a second time sliding in. Without scripts they stay visible.
  return (
    <style>
      {`@media (scripting: enabled) and (prefers-reduced-motion: no-preference) { :is(${selector}):not([data-revealed]) { opacity: 0; } }`}
    </style>
  );
};

export default BlockReveal;
