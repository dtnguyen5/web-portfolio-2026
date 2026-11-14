"use client";

import { useEffect } from "react";

// Project pages share one layout, so without this a new project would open
// at the scroll position of the previous one.
const ScrollToTop = () => {
  useEffect(() => {
    if (!window.location.hash) {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, []);

  return null;
};

export default ScrollToTop;
