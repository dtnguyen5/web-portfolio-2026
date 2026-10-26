"use client";

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

const subscribeNoop = () => () => {};

const placePreview = (preview: HTMLElement | null, x: number, y: number) => {
  if (preview) {
    preview.style.left = `${x + 24}px`;
    preview.style.top = `${y + 24}px`;
  }
};

const ServiceList = () => {
  const [activeService, setActiveService] = useState<number | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  // The preview lives in <body>: the section's reveal animation transforms it,
  // which would make `position: fixed` relative to the section, not the screen.
  const portalTarget = useSyncExternalStore(
    subscribeNoop,
    () => document.body,
    () => null,
  );

  useEffect(() => {
    const list = listRef.current;

    if (!list) {
      return;
    }

    let frame = 0;
    let pointer: { x: number; y: number } | null = null;

    // Scrolling moves the rows under a resting cursor without any mouse
    // event, so the row under the cursor is looked up after every scroll.
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

    // `mouseover` also comes from the browser's own hover check after a
    // scroll, so the position is known even before the mouse has moved.
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

  const movePreview = (event: MouseEvent<HTMLElement>) =>
    placePreview(previewRef.current, event.clientX, event.clientY);

  return (
    <div ref={listRef} onMouseLeave={() => setActiveService(null)}>
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
            <div
              className={`flex justify-between font-mono text-xs transition-colors duration-300 ${
                isActive ? "text-[#f1f0ec]" : "text-[#a5a5a2]"
              }`}
            >
              {String(index + 1).padStart(2, "0")}
            </div>
            <h3
              className={`mt-11 text-2xl tracking-[-.04em] transition-colors duration-300 sm:mt-6 sm:text-4xl lg:mt-0 ${
                isActive ? "text-[#f1f0ec]" : "text-[#a5a5a2]"
              }`}
            >
              {service.title}
            </h3>
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
      {portalTarget &&
        createPortal(
          <div
            className={`service-preview pointer-events-none fixed left-0 top-0 z-50 hidden aspect-[1.45] w-55 -translate-y-1/2 -rotate-1 overflow-hidden rounded-xl border border-[#f1f0ec]/20 bg-[#191919] shadow-2xl transition-[opacity,transform] duration-300 ease-out md:block ${
              activeService === null ? "opacity-0" : "opacity-100 rotate-3"
            }`}
            ref={previewRef}
          >
            {/* Rendered at twice its size so it stays sharp on retina screens
                and while the card is tilted. */}
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
