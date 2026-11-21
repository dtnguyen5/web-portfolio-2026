/* =============================================================================
 * PROJECT LIST – karty projektů v sekci „Projekty“
 * -----------------------------------------------------------------------------
 * Karty se při scrollu skládají na sebe (efekt „stack“ – řeší styles.scss,
 * .project-stack). Data projektů jsou v data/portfolio.ts (projects).
 * Karta projektu s `detail` vede na /projekty/<slug>, ostatní na kontakt.
 * ========================================================================== */

import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { projects } from "@/data/portfolio";

const ProjectList = () => (
  <div className="project-stack flex flex-col gap-6">
    {projects.map((project, index) => {
      // Projekty bez detailu zatím vedou na kontaktní formulář. Je to obyčejný
      // <a> (ne Link), aby ho plynule odscrolloval Lenis.
      const CardLink = project.detail ? Link : "a";

      return (
        <CardLink
          className="project-stack-card flex min-h-0 flex-col overflow-hidden rounded-2xl border border-[#30302e] bg-[#191919]"
          href={project.detail ? `/projekty/${project.slug}` : "#kontakt"}
          // data-cursor="view" → nad kartou se kurzor zvětší na kolečko se šipkou (SmoothCursor)
          data-cursor={project.detail ? "view" : undefined}
          key={project.name}
          // --stack-index = pořadí karty (pro skládání), --image-ratio = poměr stran obrázku
          style={
            { "--stack-index": index, "--image-ratio": project.imageRatio } as CSSProperties
          }
        >
          {/* --- Hlavička karty: číslo, název, typ projektu --- */}
          <div className="flex min-h-26.5 items-start gap-6 p-4.5 font-mono text-xs text-[#a5a5a2] sm:min-h-24 sm:items-center sm:px-7 sm:py-0">
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong className="flex-1 text-2xl font-medium text-[#f1f0ec] sm:text-4xl">
              {project.name}
            </strong>
            <em className="absolute ml-6.5 mt-10 rounded-full border border-[#30302e] px-3 py-1.5 font-sans text-xs not-italic sm:static sm:ml-0 sm:mt-0 sm:px-4 sm:py-2.5 sm:text-base">
              {project.type}
            </em>
          </div>
          {/* --- Náhled projektu ---
              Mobily a tablety na výšku ukážou celý obrázek, širší obrazovky jím vyplní vysokou kartu. */}
          <div
            className={`project-image relative aspect-(--image-ratio) sm:landscape:aspect-auto sm:landscape:min-h-0 sm:landscape:flex-1 ${
              project.imageContain ? "bg-black" : "bg-[#080808]"
            }`}
          >
            {/* Screenshoty se ořezávají zespodu – nahoře mají navigaci a logo, ty mají zůstat vidět. */}
            <Image
              className={project.imageContain ? "object-contain" : "object-cover object-top"}
              src={project.image}
              alt={`${project.name} – ukázka projektu`}
              fill
              sizes="(max-width: 640px) calc(100vw - 48px), 88vw"
            />
          </div>
        </CardLink>
        );
    })}
  </div>
);

export default ProjectList;
