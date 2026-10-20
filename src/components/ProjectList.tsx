import type { CSSProperties } from "react";
import Image from "next/image";
import { projects } from "@/data/portfolio";
import Arrow from "./Arrow";

const ProjectList = () => (
  <div className="project-stack flex flex-col gap-6">
    {projects.map((project, index) => (
      <a
        className="project-stack-card flex h-[calc(100svh-144px)] min-h-0 flex-col overflow-hidden rounded-2xl border border-[#30302e] bg-[#191919] sm:h-[calc(100svh-180px)]"
        href="#kontakt"
        key={project.name}
        style={{ "--stack-index": index } as CSSProperties}
      >
        <div className="flex min-h-[106px] items-start gap-6 p-[18px] font-mono text-xs text-[#a5a5a2] sm:min-h-24 sm:items-center sm:px-7 sm:py-0">
          <span>{String(index + 1).padStart(2, "0")}</span>
          <strong className="flex-1 text-2xl font-medium text-[#f1f0ec] sm:text-[34px]">
            {project.name}
          </strong>
          <em className="absolute ml-[26px] mt-10 rounded-full border border-[#30302e] px-3 py-1.5 font-sans text-xs not-italic sm:static sm:ml-0 sm:mt-0 sm:px-4 sm:py-2.5 sm:text-base">
            {project.type}
          </em>
          <span className="mt-3 grid h-11 w-11 place-items-center rounded-full bg-[#f1f0ec] text-2xl text-[#080808] sm:mt-0">
            <Arrow />
          </span>
        </div>
        <div className="project-image relative min-h-0 flex-1 bg-[#080808]">
          <Image
            className="object-cover"
            src={project.image}
            alt={`${project.name} – ukázka projektu`}
            fill
            sizes="(max-width: 640px) calc(100vw - 48px), 88vw"
          />
        </div>
      </a>
    ))}
  </div>
);

export default ProjectList;
