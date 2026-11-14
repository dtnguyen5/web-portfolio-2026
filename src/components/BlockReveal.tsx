"use client";

import { useEffect } from "react";

type BlockRevealProps = {
  // Elements that slide in as they scroll into view.
  selectors: string[];
};

const BlockReveal = ({ selectors }: BlockRevealProps) => {
  const selector = selectors.join(", ");

  useEffect(() => {
    if (
      !("IntersectionObserver" in window) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const revealBlocks = [...document.querySelectorAll<HTMLElement>(selector)];

    revealBlocks.forEach((item) => item.classList.add("block-reveal"));

    const reveal: IntersectionObserverCallback = (entries, observer) => {
      entries
        .filter((entry) => entry.isIntersecting)
        .forEach((entry, index) => {
          const item = entry.target as HTMLElement;
          item.style.setProperty("--reveal-delay", `${Math.min(index, 4) * 140}ms`);
          item.classList.add("is-visible");
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
      revealBlocks.forEach((item) => item.classList.remove("block-reveal", "is-visible"));
    };
  }, [selector]);

  return null;
};

export default BlockReveal;
