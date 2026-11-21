"use client";

/* =============================================================================
 * SMOOTH CURSOR – vlastní kurzor (bílý kroužek, který plynule dojíždí za myší)
 * -----------------------------------------------------------------------------
 * Nativní kurzor je schovaný (styles.scss → cursor: none). Nad prvky
 * s data-cursor="view" (karty projektů) se kroužek zvětší na velké světlé
 * kolečko se šipkou. Jen na počítači (md a víc), na mobilu se neukazuje.
 * ========================================================================== */

import { useEffect, useRef } from "react";

const SmoothCursor = () => {
  // cursorRef = malý kroužek, viewRef = velké kolečko se šipkou
  const cursorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const view = viewRef.current;

    if (!cursor || !view) {
      return;
    }

    // target = kde je myš, current = kde je teď kroužek (dojíždí za target).
    // Začíná mimo obrazovku (-100), dokud se myš nepohne.
    let targetX = -100;
    let targetY = -100;
    let currentX = targetX;
    let currentY = targetY;
    let animationFrame = 0;
    let checkFrame = 0;

    /* --- Velké kolečko nad kartami projektů --- */
    // Nad prvky s `data-cursor="view"` se přes kroužek zvětší světlé kolečko.
    // Cíl události nemusí být HTML prvek (Firefox umí poslat `document` nebo
    // textový uzel) a ty `closest` nemají. U textu se vezme jeho rodič,
    // cokoli jiného bez `closest` se bere jako „není nad kartou“.
    const updateView = (target: EventTarget | null) => {
      const node = target as Node | null;
      const element = (node?.nodeType === 3 ? node.parentElement : node) as Element | null;
      const isOverView =
        typeof element?.closest === "function" && !!element.closest('[data-cursor="view"]');
      view.toggleAttribute("data-active", isOverView);
    };

    /* --- Pohyb myši → nový cíl pro kroužek --- */
    const moveCursor = (event: MouseEvent) => {
      targetX = event.clientX;
      targetY = event.clientY;
      cursor.style.opacity = "1";
      updateView(event.target);
    };

    /* --- Scroll bez pohybu myši ---
       Stránka se může posunout pod stojící myší (třeba na kartu projektu).
       Kontroluje se maximálně jednou za snímek. */
    const checkUnderCursor = () => {
      if (!checkFrame) {
        checkFrame = requestAnimationFrame(() => {
          checkFrame = 0;
          updateView(document.elementFromPoint(targetX, targetY));
        });
      }
    };

    /* --- Myš opustila okno → schovat kurzor --- */
    const hideCursor = () => {
      cursor.style.opacity = "0";
      updateView(null);
    };

    /* --- Animace: každý snímek posune kroužek o 5 % zbývající vzdálenosti ---
       (0.05 níž = rychlost dojíždění; větší číslo = kurzor je rychlejší) */
    const animateCursor = () => {
      // Když už kroužek myš dohnal, nic se nepřepisuje (šetří výkon).
      if (Math.abs(targetX - currentX) > 0.1 || Math.abs(targetY - currentY) > 0.1) {
        currentX += (targetX - currentX) * 0.05;
        currentY += (targetY - currentY) * 0.05;
        cursor.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`;
        view.style.transform = cursor.style.transform;
      }
      animationFrame = requestAnimationFrame(animateCursor);
    };

    /* --- Zapnutí posluchačů + úklid při odchodu ze stránky --- */
    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("scroll", checkUnderCursor, { passive: true });
    document.documentElement.addEventListener("mouseleave", hideCursor);
    animationFrame = requestAnimationFrame(animateCursor);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("scroll", checkUnderCursor);
      document.documentElement.removeEventListener("mouseleave", hideCursor);
      cancelAnimationFrame(animationFrame);
      cancelAnimationFrame(checkFrame);
    };
  }, []);

  return (
    <>
      {/* Malý bílý kroužek */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[100] hidden h-8 w-8 rounded-full border-2 border-transparent opacity-0 transition-opacity duration-200 md:block"
        ref={cursorRef}
        style={{ borderColor: "#ffffff" }}
      />
      {/* Velké kolečko se šipkou ↗ (nad kartami projektů, styl .view-cursor v styles.scss) */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[101] hidden md:block"
        ref={viewRef}
      >
        <div className="view-cursor grid h-20 w-20 place-items-center rounded-full bg-[#f1f0ec] text-[#080808]">
          <svg
            width="22"
            height="22"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          >
            <path d="M14.166 14.166V5.834H5.834M14.166 5.834L5.834 14.166" />
          </svg>
        </div>
      </div>
    </>
  );
};

export default SmoothCursor;
