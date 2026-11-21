"use client";

/* =============================================================================
 * REVEAL DONE – úvodní animace se přehrají jen jednou
 * -----------------------------------------------------------------------------
 * Vložené v layout.tsx, nic nevykresluje. Po doběhnutí animace označí prvek
 * atributem data-reveal-done, aby se animace při návratu na stránku
 * nepřehrála znovu (viz podrobné vysvětlení níž u komponenty).
 * ========================================================================== */

import { useEffect } from "react";

// Názvy úvodních animací (@keyframes v styles.scss), které se mají přehrát jen jednou.
const revealAnimations = new Set([
  "hero-reveal",
  "hero-text-reveal",
  "hero-line-reveal",
  "block-reveal",
]);

// Pozná, jestli už React prvek „oživil“ (hydratace). React si k prvku přidá
// vlastní klíč, až když porovná jeho atributy s HTML ze serveru.
const isHydrated = (element: Element) =>
  Object.keys(element).some((key) => key.startsWith("__reactFiber$"));

// Proč to existuje: Next.js navštívené stránky nechává v dokumentu a jen je
// schová (display: none). Když se stránka znovu ukáže, CSS animace se spustí
// znovu – obsah by zmizel a znovu vyjel. Proto se prvek po doběhnutí úvodní
// animace označí a zůstane ve finálním stavu. Je to data atribut (ne třída),
// aby ho React nesmazal, když přepíše className.
//
// Animace může doběhnout dřív, než React prvek oživí (v dev režimu třeba
// hero). Kdyby se označil hned, lišily by se atributy od HTML ze serveru
// a React by hlásil chybu – takové prvky proto počkají, až budou oživené.
const RevealDone = () => {
  useEffect(() => {
    const pending = new Set<Element>();
    let timer = 0;

    // Označí čekající prvky, které už React oživil. Zbytek zkusí znovu za 250 ms.
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

    // Doběhla nějaká animace → pokud je to úvodní, zařadí prvek do fronty
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

    // Animace, které doběhly ještě předtím, než se tenhle posluchač zapnul.
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
