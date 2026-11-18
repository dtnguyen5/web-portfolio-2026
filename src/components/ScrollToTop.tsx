"use client";

import { useEffect, useRef } from "react";

// Project pages share one layout, so without this a new project would open
// at the scroll position of the previous one.
const ScrollToTop = () => {
  // Next.js hides visited pages instead of unmounting them, and the Effect
  // runs again when one is shown on back navigation. The ref survives that,
  // so only a freshly opened page jumps to the top.
  const done = useRef(false);

  useEffect(() => {
    if (done.current) {
      return;
    }

    done.current = true;

    if (!window.location.hash) {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, []);

  return null;
};

export default ScrollToTop;
