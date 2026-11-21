"use client";

/* =============================================================================
 * BLOCK REVEAL – bloky obsahu vyjedou zespodu, když se doscrolluje k nim
 * -----------------------------------------------------------------------------
 * Dostane seznam CSS selektorů (v Portfolio.tsx), najde ty prvky a ve chvíli,
 * kdy se objeví na obrazovce, jim dá atribut data-revealed. Samotná animace
 * (@keyframes block-reveal) je v styles.scss.
 * ========================================================================== */

import { useEffect } from "react";

type BlockRevealProps = {
  // Selektory prvků, které mají při scrollu vyjet (např. "#o-mne .about-sidebar").
  selectors: string[];
};

const BlockReveal = ({ selectors }: BlockRevealProps) => {
  const selector = selectors.join(", ");

  useEffect(() => {
    // Kdo má v systému vypnuté animace, vidí vše hned bez efektu
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    // Už zobrazené bloky zůstanou zobrazené. Next.js nechává navštívené stránky
    // v dokumentu, takže tohle proběhne znovu i při návratu zpět.
    const revealBlocks = [
      ...document.querySelectorAll<HTMLElement>(selector),
    ].filter((item) => !item.hasAttribute("data-revealed"));

    // Hodně starý prohlížeč bez IntersectionObserveru → ukázat vše hned
    if (!("IntersectionObserver" in window)) {
      revealBlocks.forEach((item) => item.setAttribute("data-revealed", ""));
      return;
    }

    // Prvek se objevil na obrazovce → spustit animaci. Víc prvků najednou
    // vyjede postupně (každý o 140 ms později, max. 4 kroky zpoždění).
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
    // -10 % zespodu = prvek musí být kousek nad spodním okrajem obrazovky
    const observer = new IntersectionObserver(reveal, {
      rootMargin: "0px 0px -10% 0px",
    });
    // Patička je na konci stránky, takže její poslední řádky se nikdy
    // nedostanou nad ten spodní okraj – má proto vlastní observer bez něj.
    const footerObserver = new IntersectionObserver(reveal);

    revealBlocks.forEach((item) =>
      (item.closest("footer") ? footerObserver : observer).observe(item),
    );

    return () => {
      observer.disconnect();
      footerObserver.disconnect();
    };
  }, [selector]);

  // Stav je v data atributech, ne ve třídách: React při změně className
  // (třeba při hoveru) přepíše celý atribut class a přidané třídy by smazal.
  //
  // Tenhle <style> schová bloky už v HTML ze serveru. Jinak by je prohlížeč
  // vykreslil dřív, než naběhne skript, a ukázaly by se dvakrát – jednou bez
  // animace a pak znovu s ní. Bez JavaScriptu zůstanou normálně vidět.
  return (
    <style>
      {`@media (scripting: enabled) and (prefers-reduced-motion: no-preference) { :is(${selector}):not([data-revealed]) { opacity: 0; } }`}
    </style>
  );
};

export default BlockReveal;
