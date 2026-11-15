import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { type Project, type ProjectDetail as Detail, projects } from "@/data/portfolio";
import BlockReveal from "./BlockReveal";
import ScrollToTop from "./ScrollToTop";
import { contentPadding } from "./shared";

type ProjectDetailProps = {
  project: Project & { detail: Detail };
};

const revealDelay = (ms: number) => ({ animationDelay: `${ms}ms` }) as CSSProperties;

const ProjectDetail = ({ project }: ProjectDetailProps) => {
  const { detail } = project;
  // The other case studies, shown as cards below this one.
  const otherProjects = projects.filter(
    (item) => item.detail && item.slug !== project.slug,
  );

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
        <p className="m-0 text-lg leading-[1.55] text-[#a5a5a2]">
          {detail.conclusion}
        </p>
      </div>

      {otherProjects.length > 0 && (
        <section className="mt-24 sm:mt-36">
          <div data-reveal className="flex items-center gap-6 sm:gap-8">
            <h2 className="m-0 shrink-0 text-[2rem] font-medium leading-tight tracking-[-.06em] sm:text-[3.25rem]">
              Další projekty
            </h2>
            <span className="h-px flex-1 bg-[#30302e]" aria-hidden="true" />
          </div>
          <div data-reveal className="mt-10 grid gap-12 sm:mt-14 sm:grid-cols-2 sm:gap-8">
            {otherProjects.map((item) => (
              <Link
                className="group block"
                data-cursor="view"
                href={`/projekty/${item.slug}`}
                key={item.slug}
              >
                <div
                  className={`relative aspect-video overflow-hidden rounded-2xl ${
                    item.imageContain ? "bg-black" : "bg-[#191919]"
                  }`}
                >
                  {/* Cropped from the bottom: the screenshots carry their nav and logo at the top. */}
                  <Image
                    className={`${item.imageContain ? "object-contain" : "object-cover object-top"} transition-[scale] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]`}
                    src={item.image}
                    alt={`${item.name} – ukázka projektu`}
                    fill
                    sizes="(max-width: 640px) calc(100vw - 48px), 44vw"
                  />
                </div>
                <span className="mt-6 inline-block rounded-full border border-[#30302e] px-4 py-1.5 text-sm text-[#a5a5a2]">
                  {item.type}
                </span>
                <h3 className="mb-0 mt-4 text-2xl font-medium tracking-[-.04em] sm:text-3xl">
                  {item.name}
                </h3>
                <p className="mb-0 mt-3 text-lg leading-[1.55] text-[#a5a5a2]">
                  {item.detail?.description}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
};

export default ProjectDetail;
