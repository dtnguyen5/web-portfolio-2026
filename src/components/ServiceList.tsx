"use client";

/* =============================================================================
 * SERVICE LIST – seznam služeb v sekci „Služby“
 * -----------------------------------------------------------------------------
 * Řádky služeb (Web design, Vývoj, Grafika…). Při najetí myší se řádek
 * zvýrazní a vedle kurzoru se objeví náhledový obrázek, který ho následuje.
 * Data služeb jsou v data/portfolio.ts (services).
 * ========================================================================== */

import Image from "next/image";
import {
  MouseEvent,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { createPortal } from "react-dom";
import { services } from "@/data/portfolio";

// Prázdné „přihlášení“ pro useSyncExternalStore níž (nic se nemění)
const subscribeNoop = () => () => {};

// Posune náhledový obrázek kousek vpravo dolů od kurzoru (o 24 px)
const placePreview = (preview: HTMLElement | null, x: number, y: number) => {
  if (preview) {
    preview.style.left = `${x + 24}px`;
    preview.style.top = `${y + 24}px`;
  }
};

const ServiceList = () => {
  // Index právě zvýrazněné služby (null = žádná)
  const [activeService, setActiveService] = useState<number | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  // Náhled se vkládá přímo do <body>: animace sekce používá transform a ten
  // by způsobil, že `position: fixed` počítá pozici od sekce, ne od obrazovky.
  // (Na serveru <body> není → null, náhled se vykreslí až v prohlížeči.)
  const portalTarget = useSyncExternalStore(
    subscribeNoop,
    () => document.body,
    () => null,
  );

  /* --- Zvýraznění řádku při scrollu (myš stojí, stránka se hýbe) --- */
  useEffect(() => {
    const list = listRef.current;

    if (!list) {
      return;
    }

    let frame = 0;
    let pointer: { x: number; y: number } | null = null;

    // Scroll posouvá řádky pod stojícím kurzorem bez jakékoli události myši,
    // proto se po každém scrollu dohledá, nad kterým řádkem kurzor je.
    const update = () => {
      frame = 0;

      if (!pointer) {
        setActiveService(null);
        return;
      }

      const row = document
        .elementFromPoint(pointer.x, pointer.y)
        ?.closest<HTMLElement>(".service-row");

      if (row && list.contains(row)) {
        placePreview(previewRef.current, pointer.x, pointer.y);
        setActiveService(Number(row.dataset.index));
      } else {
        setActiveService(null);
      }
    };

    // `mouseover` posílá prohlížeč i sám po scrollu, takže pozici známe,
    // i když se myš ještě nepohnula. Dotyky (prst) se ignorují.
    const trackPointer = (event: globalThis.MouseEvent) => {
      if (!(event instanceof PointerEvent) || event.pointerType === "mouse") {
        pointer = { x: event.clientX, y: event.clientY };
      }
    };

    const requestUpdate = () => {
      if (!frame) {
        frame = requestAnimationFrame(update);
      }
    };

    window.addEventListener("pointermove", trackPointer, { passive: true });
    window.addEventListener("mouseover", trackPointer, { passive: true });
    window.addEventListener("scroll", requestUpdate, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", trackPointer);
      window.removeEventListener("mouseover", trackPointer);
      window.removeEventListener("scroll", requestUpdate);
    };
  }, []);

  // Náhled následuje kurzor
  const movePreview = (event: MouseEvent<HTMLElement>) =>
    placePreview(previewRef.current, event.clientX, event.clientY);

  return (
    <div ref={listRef} onMouseLeave={() => setActiveService(null)}>
      {/* --- Řádky služeb ---
          Zvýraznění: myší (hover), klávesnicí (Tab → focus) i klepnutím na mobilu */}
      {services.map((service, index) => {
        const isActive = activeService === index;

        return (
          <article
            className={`service-row group relative min-h-60 border-t border-[#30302e] py-7 sm:min-h-0 sm:py-10 lg:grid lg:min-h-44 lg:grid-cols-[3.5rem_1fr_minmax(0,35rem)] lg:gap-6 ${
              isActive ? "is-active" : ""
            }`}
            key={service.title}
            data-index={index}
            tabIndex={0}
            onFocus={() => setActiveService(index)}
            onBlur={() => setActiveService(null)}
            onClick={() =>
              setActiveService((current) =>
                current === index ? null : index,
              )
            }
            onMouseEnter={(event) => {
              movePreview(event);
              setActiveService(index);
            }}
            onMouseLeave={() => setActiveService(null)}
            onMouseMove={movePreview}
          >
            {/* Číslo služby (01, 02…) */}
            <div
              className={`flex justify-between font-mono text-xs transition-colors duration-300 ${
                isActive ? "text-[#f1f0ec]" : "text-[#a5a5a2]"
              }`}
            >
              {String(index + 1).padStart(2, "0")}
            </div>
            {/* Název služby */}
            <h3
              className={`mt-11 text-2xl tracking-[-.04em] transition-colors duration-300 sm:mt-6 sm:text-4xl lg:mt-0 ${
                isActive ? "text-[#f1f0ec]" : "text-[#a5a5a2]"
              }`}
            >
              {service.title}
            </h3>
            {/* Dovednosti ve dvou sloupcích */}
            <div
              className={`mt-6 grid grid-cols-2 gap-x-6 gap-y-2.5 text-sm transition-colors duration-300 sm:text-base lg:mt-0 ${
                isActive ? "text-[#f1f0ec]" : "text-[#a5a5a2]"
              }`}
            >
              {service.skills.map((skill) => (
                <span key={skill}>{skill}</span>
              ))}
            </div>
          </article>
        );
      })}
      {/* --- Náhledový obrázek u kurzoru (jen na počítači, md a víc) --- */}
      {portalTarget &&
        createPortal(
          <div
            className={`service-preview pointer-events-none fixed left-0 top-0 z-50 hidden aspect-[1.45] w-55 -translate-y-1/2 -rotate-1 overflow-hidden rounded-xl border border-[#f1f0ec]/20 bg-[#191919] shadow-2xl transition-[opacity,transform] duration-300 ease-out md:block ${
              activeService === null ? "opacity-0" : "opacity-100 rotate-3"
            }`}
            ref={previewRef}
          >
            {/* Načítá se v dvojnásobné velikosti, aby byl ostrý na retina
                displejích i když je kartička natočená. */}
            {activeService !== null && (
              <Image
                className="object-cover"
                src={services[activeService].image}
                alt={`Ukázka oboru ${services[activeService].title}`}
                fill
                quality={90}
                sizes="440px"
              />
            )}
          </div>,
          portalTarget,
        )}
    </div>
  );
};

export default ServiceList;
