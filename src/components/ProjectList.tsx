import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { projects } from "@/data/portfolio";

const ProjectList = () => (
  <div className="project-stack flex flex-col gap-6">
    {projects.map((project, index) => {
      // Projects without a case study yet lead to the contact form, a plain
      // anchor so the smooth scroll handles it.
      const CardLink = project.detail ? Link : "a";

      return (
        <CardLink
          className="project-stack-card flex min-h-0 flex-col overflow-hidden rounded-2xl border border-[#30302e] bg-[#191919]"
          href={project.detail ? `/projekty/${project.slug}` : "#kontakt"}
          data-cursor={project.detail ? "view" : undefined}
          key={project.name}
          style={
            { "--stack-index": index, "--image-ratio": project.imageRatio } as CSSProperties
          }
        >
          <div className="flex min-h-26.5 items-start gap-6 p-4.5 font-mono text-xs text-[#a5a5a2] sm:min-h-24 sm:items-center sm:px-7 sm:py-0">
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong className="flex-1 text-2xl font-medium text-[#f1f0ec] sm:text-4xl">
              {project.name}
            </strong>
            <em className="absolute ml-6.5 mt-10 rounded-full border border-[#30302e] px-3 py-1.5 font-sans text-xs not-italic sm:static sm:ml-0 sm:mt-0 sm:px-4 sm:py-2.5 sm:text-base">
              {project.type}
            </em>
          </div>
          {/* Phones and upright tablets show the whole image, landscape screens fill the tall card. */}
          <div className="project-image relative aspect-(--image-ratio) bg-[#080808] sm:landscape:aspect-auto sm:landscape:min-h-0 sm:landscape:flex-1">
            {/* Cropped from the bottom: the screenshots carry their nav and logo at the top. */}
            <Image
              className="object-cover object-top"
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
