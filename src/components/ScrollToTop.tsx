"use client";

import { useEffect, useRef } from "react";

/* =============================================================================
 * SCROLL TO TOP – nově otevřený projekt začne nahoře
 * -----------------------------------------------------------------------------
 * Stránky projektů sdílejí jeden layout, takže bez tohohle by se nový projekt
 * otevřel na stejné pozici scrollu jako ten předchozí.
 * ========================================================================== */
const ScrollToTop = () => {
  // Next.js navštívené stránky jen schovává (neodstraňuje) a při návratu zpět
  // se tenhle efekt spustí znovu. Ref to přežije, takže nahoru skočí jen
  // čerstvě otevřená stránka, ne ta, na kterou se vracíš.
  const done = useRef(false);

  useEffect(() => {
    if (done.current) {
      return;
    }

    done.current = true;

    // Když adresa míří na kotvu (#neco), necháme prohlížeč odscrollovat tam
    if (!window.location.hash) {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, []);

  return null;
};

export default ScrollToTop;
