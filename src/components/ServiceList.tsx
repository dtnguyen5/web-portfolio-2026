"use client";

import Image from "next/image";
import { MouseEvent, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { services } from "@/data/portfolio";

const subscribeNoop = () => () => {};

const ServiceList = () => {
  const [activeService, setActiveService] = useState<number | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  // The preview lives in <body>: the section's reveal animation transforms it,
  // which would make `position: fixed` relative to the section, not the screen.
  const portalTarget = useSyncExternalStore(
    subscribeNoop,
    () => document.body,
    () => null,
  );

  const movePreview = (event: MouseEvent<HTMLElement>) => {
    const preview = previewRef.current;

    if (preview) {
      preview.style.left = `${event.clientX + 24}px`;
      preview.style.top = `${event.clientY + 24}px`;
    }
  };

  return (
    <div onMouseLeave={() => setActiveService(null)}>
      {services.map((service, index) => {
        const isActive = activeService === index;

        return (
          <article
            className={`service-row group relative min-h-60 border-t border-[#30302e] py-7 sm:min-h-0 sm:py-10 lg:grid lg:min-h-44 lg:grid-cols-[3.5rem_1fr_minmax(0,35rem)] lg:gap-6 ${
              isActive ? "is-active" : ""
            }`}
            key={service.title}
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
            <div
              className={`mt-7 overflow-hidden rounded-xl border border-[#30302e] bg-[#191919] sm:hidden ${
                isActive ? "block" : "hidden"
              }`}
            >
              <div className="relative aspect-[1.45]">
                <Image
                  className="object-cover"
                  src={service.image}
                  alt={`Ukázka oboru ${service.title}`}
                  fill
                  quality={90}
                  sizes="100vw"
                />
              </div>
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
