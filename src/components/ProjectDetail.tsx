import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { type Project, type ProjectDetail as Detail, projects } from "@/data/portfolio";
import Arrow from "./Arrow";
import BlockReveal from "./BlockReveal";
import ScrollToTop from "./ScrollToTop";
import { contentPadding } from "./shared";

type ProjectDetailProps = {
  project: Project & { detail: Detail };
};

const revealDelay = (ms: number) => ({ animationDelay: `${ms}ms` }) as CSSProperties;

const ProjectDetail = ({ project }: ProjectDetailProps) => {
  const { detail } = project;
  // The next case study in the list; with only one, the link leads back to all projects.
  const caseStudies = projects.filter((item) => item.detail);
  const index = caseStudies.findIndex((item) => item.slug === project.slug);
  const next = caseStudies[(index + 1) % caseStudies.length];
  const nextLink =
    next && next.slug !== project.slug
      ? { href: `/projekty/${next.slug}`, label: "Další projekt" }
      : { href: "/#projekty", label: "Všechny projekty" };

  return (
    <article className={`${contentPadding} bg-[#080808] pb-20 pt-32 sm:pb-28 sm:pt-48`}>
      <ScrollToTop />
      <BlockReveal selectors={["[data-reveal] > *", "main > footer > *"]} />
      <header className="hero-reveal mx-auto max-w-180 text-center">
        <h1 className="m-0 text-[2.8125rem] font-medium leading-tight tracking-[-.06em] sm:text-[4.5rem]">
          {project.name}
        </h1>
        <p className="mx-auto mb-0 mt-5 max-w-160 text-lg leading-normal text-[#a5a5a2]">
          {detail.description}
        </p>
      </header>

      <dl
        className="hero-reveal m-0 mt-14 grid auto-cols-fr grid-flow-col gap-x-4 text-center sm:mt-20 sm:gap-x-6"
        style={revealDelay(200)}
      >
        {detail.facts.map(({ label, value }) => (
          <div key={label}>
            <dt className="text-base font-medium sm:text-lg">{label}</dt>
            <dd className="m-0 mt-2 text-sm text-[#a5a5a2] sm:text-base">{value}</dd>
          </div>
        ))}
      </dl>

      <div
        className="hero-reveal relative mt-14 overflow-hidden rounded-2xl bg-[#191919] sm:mt-20"
        style={{ ...revealDelay(400), aspectRatio: project.imageRatio }}
      >
        <Image
          className="object-cover"
          src={project.image}
          alt={`${project.name} – ukázka projektu`}
          fill
          priority
          sizes="(max-width: 640px) calc(100vw - 48px), 89vw"
        />
      </div>

      <div data-reveal className="mt-16 grid gap-x-[6.67vw] gap-y-12 sm:mt-24 md:grid-cols-2">
        {detail.sections.map(({ title, text }) => (
          <section key={title}>
            <h2 className="m-0 text-lg font-semibold uppercase tracking-wide">
              {title}
            </h2>
            <p className="mb-0 mt-4 text-lg leading-[1.55] text-[#a5a5a2]">
              {text}
            </p>
          </section>
        ))}
      </div>

      {detail.gallery.length > 0 && (
        <div data-reveal className="mt-16 grid gap-4 sm:mt-24 sm:grid-cols-2 sm:gap-6">
          {detail.gallery.map(({ label, image, ratio, wide }) => (
            <div
              // Images set their own aspect ratio, placeholders use the layout from the design.
              className={`relative overflow-hidden rounded-2xl border border-[#30302e] bg-[#191919] ${wide ? "sm:col-span-2" : ""} ${
                ratio ? "" : wide ? "aspect-16/10 sm:aspect-2/1" : "aspect-4/3"
              }`}
              key={label}
              style={ratio ? { aspectRatio: ratio } : undefined}
            >
              {image ? (
                <Image
                  className="object-cover"
                  src={image}
                  alt={`${project.name} – ${label}`}
                  fill
                  // Screenshots are mostly text, which blurs at the default quality.
                  quality={90}
                  sizes={wide ? "(max-width: 640px) calc(100vw - 48px), 89vw" : "(max-width: 640px) calc(100vw - 48px), 44vw"}
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 font-mono text-xs uppercase tracking-wide text-[#727270]">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="9" cy="9" r="2" />
                    <path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21" />
                  </svg>
                  {label}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div data-reveal className="mt-16 grid gap-6 sm:mt-24 md:grid-cols-2 md:gap-[6.67vw]">
        <h2 className="m-0 text-2xl font-medium tracking-[-.04em] sm:text-3xl">
          Závěr
        </h2>
        <div>
          <p className="m-0 text-lg leading-[1.55] text-[#a5a5a2]">
            {detail.conclusion}
          </p>
          <Link
            className="group mt-10 flex items-center justify-end gap-2 text-base font-medium transition-colors duration-500 hover:text-[#a5a5a2]"
            href={nextLink.href}
          >
            {nextLink.label}
            <Arrow
              className="brightness-0 invert transition-[rotate] duration-500 ease-[cubic-bezier(0.33,1,0.68,1)] group-hover:rotate-45"
              size={16}
            />
          </Link>
        </div>
      </div>
    </article>
  );
};

export default ProjectDetail;
