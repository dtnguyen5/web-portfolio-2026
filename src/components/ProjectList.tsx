import { projects } from "@/data/portfolio";
import Arrow from "./Arrow";

const ProjectList = () => (
  <div className="flex flex-col gap-6">
    {projects.map((project, index) => (
      <a
        className="overflow-hidden rounded-2xl border border-[#30302e] bg-[#191919]"
        href="#kontakt"
        key={project.name}
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
        <div
          className="relative h-[520px] bg-cover bg-top sm:h-[800px]"
          style={{ backgroundImage: `url("${project.image}")` }}
        />
      </a>
    ))}
  </div>
);

export default ProjectList;
