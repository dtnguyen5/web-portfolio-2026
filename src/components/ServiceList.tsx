"use client";

import Image from "next/image";
import { MouseEvent, useRef, useState } from "react";
import { services } from "@/data/portfolio";

const ServiceList = () => {
  const [activeService, setActiveService] = useState<number | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);

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
            className={`service-row group relative min-h-[241px] border-t border-[#30302e] py-7 sm:grid sm:min-h-[182px] sm:grid-cols-[56px_1fr_560px] sm:gap-6 sm:py-10 ${
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
            onMouseEnter={() => setActiveService(index)}
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
              className={`mt-11 text-[25px] tracking-[-.04em] transition-colors duration-300 sm:mt-0 sm:text-[34px] ${
                isActive ? "text-[#f1f0ec]" : "text-[#a5a5a2]"
              }`}
            >
              {service.title}
            </h3>
            <div
              className={`mt-6 grid grid-cols-2 gap-x-6 gap-y-2.5 text-sm transition-colors duration-300 sm:mt-0 sm:text-base ${
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
                  sizes="100vw"
                />
              </div>
            </div>
          </article>
        );
      })}
      <div
        className={`service-preview pointer-events-none fixed left-0 top-0 z-[90] hidden aspect-[1.45] w-[220px] -translate-y-1/2 rotate-[-4deg] overflow-hidden rounded-xl border border-[#f1f0ec]/20 bg-[#191919] shadow-2xl transition-[opacity,transform] duration-300 ease-out md:block ${
          activeService === null ? "opacity-0" : "opacity-100 rotate-[3deg]"
        }`}
        ref={previewRef}
      >
        {activeService !== null && (
          <Image
            className="object-cover"
            src={services[activeService].image}
            alt={`Ukázka oboru ${services[activeService].title}`}
            fill
            sizes="220px"
          />
        )}
      </div>
    </div>
  );
};

export default ServiceList;
