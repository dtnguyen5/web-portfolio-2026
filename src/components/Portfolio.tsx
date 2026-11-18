"use client";

import Image from "next/image";
import { FormEvent, useEffect, useRef, useState } from "react";
import { experience, tools } from "@/data/portfolio";
import Arrow from "./Arrow";
import BlockReveal from "./BlockReveal";
import ProjectList from "./ProjectList";
import SectionLabel from "./SectionLabel";
import ServiceList from "./ServiceList";
import { contentPadding, fillHoverClass } from "./shared";
import SiteFooter from "./SiteFooter";
import SiteNav from "./SiteNav";
import SmoothCursor from "./SmoothCursor";
import SmoothScroll from "./SmoothScroll";

const buttonClass =
  "inline-flex h-13 items-center gap-6 rounded-full bg-[#f1f0ec] px-6 text-base font-medium text-[#080808]";

const Portfolio = () => {
  const [sent, setSent] = useState(false);
  const heroTitleRef = useRef<HTMLDivElement>(null);
  const heroInfoRef = useRef<HTMLDivElement>(null);
  const projectsSectionRef = useRef<HTMLElement>(null);
  const projectsHeadingRef = useRef<HTMLDivElement>(null);
  const statementSectionRef = useRef<HTMLElement>(null);
  const statementSvgRef = useRef<SVGSVGElement>(null);
  const statementTextPathRef = useRef<SVGTextPathElement>(null);
  const statementMeasureRef = useRef<SVGTextElement>(null);
  const statementStarRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const sectionRevealItems =
      document.querySelectorAll<HTMLElement>(".scroll-reveal-section");

    if (!("IntersectionObserver" in window)) {
      sectionRevealItems.forEach((item) => item.classList.add("is-visible"));
      return;
    }

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            sectionObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -8% 0px" },
    );

    sectionRevealItems.forEach((item) => sectionObserver.observe(item));

    // Fallback for fast scrolling. At most once a frame, only for sections
    // still hidden, and it stops listening once every section is shown.
    let frame = 0;
    const revealSections = () => {
      frame = 0;
      const hidden = Array.from(sectionRevealItems).filter((item) => !item.classList.contains("is-visible"));
      hidden.forEach((item) => {
        if (item.getBoundingClientRect().top < window.innerHeight * 0.92) {
          item.classList.add("is-visible");
        }
      });
      if (hidden.every((item) => item.classList.contains("is-visible"))) {
        window.removeEventListener("scroll", revealSectionsOnScroll);
      }
    };
    const revealSectionsOnScroll = () => {
      if (!frame) {
        frame = requestAnimationFrame(revealSections);
      }
    };

    revealSections();
    window.addEventListener("scroll", revealSectionsOnScroll, {
      passive: true,
    });

    return () => {
      cancelAnimationFrame(frame);
      sectionObserver.disconnect();
      window.removeEventListener("scroll", revealSectionsOnScroll);
    };
  }, []);

  useEffect(() => {
    const title = heroTitleRef.current;
    const info = heroInfoRef.current;

    if (!title || !info) {
      return;
    }

    let frame = 0;
    const main = title.closest("main");

    // Extra hero space keeps the title pinned while the next section slides over it.
    const resizeObserver = new ResizeObserver(() => {
      main?.style.setProperty("--hero-cover-space", `${title.offsetHeight}px`);
    });
    resizeObserver.observe(title);

    const updateCoverProgress = () => {
      frame = 0;
      const titleRect = title.getBoundingClientRect();
      const infoTop = info.getBoundingClientRect().top;
      const progress = Math.min(
        Math.max((titleRect.bottom - infoTop) / titleRect.height, 0),
        1,
      );
      title.style.setProperty("--hero-cover-progress", progress.toFixed(3));
    };

    const requestUpdate = () => {
      if (!frame) {
        frame = requestAnimationFrame(updateCoverProgress);
      }
    };

    updateCoverProgress();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, []);

  useEffect(() => {
    const section = projectsSectionRef.current;
    const heading = projectsHeadingRef.current;
    const title = heading?.querySelector<HTMLElement>(".projects-heading-title");

    if (!section || !heading || !title) {
      return;
    }

    let frame = 0;
    let collapse = 0;

    // The sticky heading shrinks into a compact bar, so the project cards can
    // stick right under it and stay tall. On wide screens the bar sits in the
    // same row as the nav, elsewhere right below it.
    const measure = () => {
      const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
      const isDesktop = window.matchMedia("(min-width: 40rem)").matches;
      const isWide = window.matchMedia("(min-width: 82rem)").matches;
      const titleFontSize = parseFloat(getComputedStyle(title).fontSize);
      const scale = Math.min(1, ((isDesktop ? 2 : 1.75) * rem) / titleFontSize);
      const targetTop = (isWide ? 3.125 : isDesktop ? 7.25 : 4.75) * rem;
      const compactHeight = Math.max(
        targetTop + title.offsetHeight * scale + rem,
        isWide ? 7.5 * rem : 0,
      );

      collapse = Math.max(0, heading.offsetHeight - compactHeight);
      section.style.setProperty("--projects-heading-height", `${compactHeight}px`);
      section.style.setProperty("--projects-heading-collapse", `${collapse}px`);
      heading.style.setProperty("--title-shift", `${title.offsetTop - targetTop}px`);
      heading.style.setProperty("--title-scale", scale.toFixed(3));
      update();
    };

    const update = () => {
      frame = 0;
      const scrolled = Math.max(0, -section.getBoundingClientRect().top);
      const progress = collapse ? Math.min(scrolled / collapse, 1) : 0;
      heading.style.setProperty("--compact-progress", progress.toFixed(3));
      // Set directly, Safari doesn't repaint a clip-path built from a custom property.
      heading.style.clipPath = `inset(0 0 ${(collapse * progress).toFixed(1)}px 0)`;
    };

    const requestUpdate = () => {
      if (!frame) {
        frame = requestAnimationFrame(update);
      }
    };

    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(heading);
    window.addEventListener("scroll", requestUpdate, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      window.removeEventListener("scroll", requestUpdate);
    };
  }, []);

  useEffect(() => {
    const section = statementSectionRef.current;
    const svg = statementSvgRef.current;
    const textPath = statementTextPathRef.current;
    const measureText = statementMeasureRef.current;
    const star = statementStarRef.current;
    const arc = svg?.querySelector<SVGPathElement>("#statement-arc");

    if (
      !section ||
      !svg ||
      !textPath ||
      !measureText ||
      !star ||
      !arc ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    let frame = 0;
    let startOffset = 0;
    let endOffset = 0;

    // The text slides along the arc from behind the right edge of the screen
    // until it has fully left the screen on the left.
    const measure = () => {
      const viewBoxWidth = 1800;
      const arcStartX = -40;
      const arcWidth = 1840;
      const svgRect = svg.getBoundingClientRect();
      const unitsPerPx = viewBoxWidth / svgRect.width;
      const arcLength = arc.getTotalLength();
      const lengthAtScreenX = (screenX: number) => {
        const x = (screenX - svgRect.left) * unitsPerPx;
        return Math.min(
          arcLength,
          Math.max(0, ((x - arcStartX) / arcWidth) * arcLength),
        );
      };
      const textLength = measureText.getComputedTextLength();

      startOffset = lengthAtScreenX(document.documentElement.clientWidth) + 20;
      endOffset = lengthAtScreenX(0) - textLength - 20;
      update();
    };

    const update = () => {
      frame = 0;
      // Runs only while the section is pinned, so the text starts off-screen.
      const rect = section.getBoundingClientRect();
      const pinnedDistance = rect.height - window.innerHeight;
      const progress = Math.min(
        Math.max(-rect.top / pinnedDistance, 0) / 0.9,
        1,
      );
      const offset = startOffset + (endOffset - startOffset) * progress;
      textPath.setAttribute("startOffset", offset.toFixed(1));
      star.style.transform = `rotate(${(progress * 720).toFixed(1)}deg)`;
    };

    const requestUpdate = () => {
      if (!frame) {
        frame = requestAnimationFrame(update);
      }
    };

    measure();
    document.fonts.ready.then(measure);
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", measure);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", measure);
    };
  }, []);

  const submitForm = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSent(true);
  };

  return (
    <>
      <SmoothCursor />
      <SmoothScroll />
      {/* Content blocks below the hero slide in as they scroll into view.
          The projects section is left out, its stacking cards animate on their own. */}
      <BlockReveal
        selectors={[
          "#o-mne > .font-mono",
          "#o-mne .about-sidebar",
          "#o-mne .about-content > article",
          "#o-mne article > .mt-8:has(> h3)",
          "#o-mne article > .mt-8 > .border-t",
          "#sluzby > div:first-child",
          "#sluzby .service-row",
          "#kontakt > .font-mono",
          "#kontakt > div:last-child > *",
          "main > footer > *",
        ]}
      />
      <main className="overflow-x-clip">
        <SiteNav />
      <section
        className={`scroll-stack-section scroll-stack-section-01 ${contentPadding} bg-[#080808] pb-0 pt-14 sm:pt-22`}
        id="domu"
      >
        <div className="hero-title-sticky" ref={heroTitleRef}>
        <div className="hero-reveal hero-meta flex flex-col gap-7 pb-0 pt-7 font-mono text-xs leading-6 text-[#a5a5a2] sm:flex-row sm:items-center sm:justify-between sm:pb-7 sm:pt-16">
          <span>WEB DESIGN / DEVELOPMENT / GRAFIKA</span>
        </div>
        <div className="pb-8 pt-10 font-medium tracking-[-.06em] sm:pb-14 sm:pt-0">
          <h1 className="m-0 text-[clamp(2.8125rem,8.25vw,7.4375rem)] leading-[1.08]">
            <span className="hero-title-line hero-title-line-primary" aria-label="AHOJ, JSEM HONZA">
              <span>AHOJ, JSEM HONZA</span>
            </span>
          </h1>
          <p className="m-0 text-[clamp(2.8125rem,7.64vw,6.875rem)] leading-[1.13] text-[#a5a5a2]">
            <span className="hero-title-line hero-title-line-secondary" aria-label="DESIGNÉR">
              <span>DESIGNÉR</span>
            </span>
            <span
              className="hero-title-line hero-title-line-tertiary"
              aria-label="& WEB DEVELOPER"
            >
              <span>&amp; WEB DEVELOPER</span>
            </span>
          </p>
        </div>
        </div>
        <div className="hero-info-cover bg-[#080808]" ref={heroInfoRef}>
        <div className="hero-line-reveal h-px bg-[#30302e]" aria-hidden="true" />
        <div className="flex flex-col gap-6 py-7 text-lg leading-6 sm:flex-row sm:justify-between sm:py-8 sm:text-xl sm:leading-7">
          <p className="hero-reveal hero-info-left m-0">
            Působím v Plzni.
            <br />
            Otevřený novým projektům a spolupráci.
          </p>
          <p className="hero-reveal hero-info-right m-0 text-[#a5a5a2] sm:w-[32%]">
            Designér a web developer tvořící čistá rozhraní a moderní weby.
          </p>
        </div>
        </div>
        <div className="hero-cover-spacer" aria-hidden="true" />
      </section>

      <section
        className={`scroll-stack-section scroll-stack-section-02 hero-cover-next ${contentPadding} bg-[#111] pb-20 pt-16 sm:pb-28`}
        id="o-mne"
      >
        <SectionLabel>O MNĚ</SectionLabel>
        <div className="mt-10 grid gap-10 sm:mt-12 lg:grid-cols-[minmax(0,32.5rem)_1fr] lg:gap-[6.67vw]">
          <div className="about-sidebar">
            <div className="about-sidebar-image relative h-110 overflow-hidden rounded-2xl bg-[#e7e7e7] sm:h-136 lg:h-170">
              <Image
                className="object-cover object-[50%_25%]"
                src="/portrait.jpg"
                alt="Nguyen Duy Tiep (Honza)"
                fill
                sizes="(max-width: 1024px) 100vw, 520px"
              />
            </div>
            <div className="mt-6 flex justify-between">
              <div className="flex flex-col gap-2">
                <strong className="text-2xl">Nguyen Duy Tiep (Honza)</strong>
                <span className="font-mono text-xs text-[#a5a5a2]">
                  PLZEŇ, CZ
                </span>
              </div>
            </div>
          </div>
          <div className="about-content">
            <article className="border-t border-[#30302e] py-6 sm:pb-16 sm:pt-8 sm:pr-12">
              <SectionLabel>01 / 03</SectionLabel>
              <h2 className="my-5 text-4xl leading-tight tracking-[-.05em] sm:text-[3.25rem]">
                Kdo jsem
              </h2>
              <p className="m-0 max-w-[60.625rem] text-lg sm:text-justify leading-[1.55] text-[#a5a5a2]">
                Jmenuji se Nguyen Duy Tiep (Honza), působím v Plzni a věnuji se
                webdesignu, vývoji webů i grafice. Pomáhám klientům převádět jejich nápady do funkčních a
                moderních řešení, ať už jde o web, logo, vizitky nebo plakát.
                Zakládám si na detailu, čisté typografii a
                promyšleném designu. Spojuji kreativitu designéra s logikou
                vývojáře, abych doručil ucelený výsledek. Ke každému projektu
                přistupuji individuálně a hledám řešení, které nebude jen
                hezké, ale bude i dobře fungovat.
              </p>
            </article>
            <article className="border-t border-[#30302e] py-6 !pb-0 sm:pt-10">
              <SectionLabel>02 / 03</SectionLabel>
              <h2 className="my-5 text-4xl leading-tight tracking-[-.05em] sm:text-[3.25rem]">
                Škola &amp; praxe
              </h2>
              <div className="mt-8">
                <SectionLabel>{experience.school.label}</SectionLabel>
                <h3 className="mt-3 text-2xl leading-tight sm:text-3xl">
                  {experience.school.title}
                </h3>
                <p className="mt-1 text-lg leading-[1.6] text-[#a5a5a2]">
                  {experience.school.description.map((line) => (
                    <span className="block" key={line}>
                      {line}
                    </span>
                  ))}
                </p>
              </div>
              <div className="mt-8">
                {experience.jobs.map((job) => (
                <div
                  className="border-t border-[#30302e] py-6 sm:py-7"
                  key={job.title}
                >
                  <SectionLabel>{job.label}</SectionLabel>
                  <h3 className="mt-4 text-3xl leading-tight sm:text-4xl">
                    {job.title}
                  </h3>
                  <p className="m-0 mt-3 text-xl text-[#a5a5a2] sm:text-3xl">
                    {job.description}
                  </p>
                </div>
                ))}
              </div>
            </article>
            <article className="pt-0">
              <div className="mb-7 h-px bg-[#30302e]" />
              <SectionLabel>03 / 03</SectionLabel>
              <h2 className="my-5 text-4xl leading-tight tracking-[-.05em] sm:text-[3.25rem]">
                Nástroje
              </h2>
              <div className="flex flex-wrap gap-2.5">
                {tools.map((tool) => (
                  <span
                    className="tool-glass cursor-default rounded-full border border-[#30302e] px-4 py-2.5 text-[#a5a5a2] outline-none"
                    key={tool}
                    tabIndex={0}
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </article>
          </div>
        </div>
      </section>

      <section
        className={`scroll-reveal-section scroll-stack-section-03 ${contentPadding} bg-[#080808] pb-20 pt-20 sm:pb-28 sm:pt-28`}
        id="sluzby"
      >
        <div className="max-w-162.5">
          <SectionLabel>CO UMÍM</SectionLabel>
          <h2 className="mb-8 mt-9 text-[2.6875rem] leading-tight tracking-[-.06em] sm:mb-14 sm:mt-11 sm:text-[5.5rem]">
            Moje služby
          </h2>
        </div>
        <ServiceList />
      </section>

      <section
        className={`scroll-reveal-section scroll-stack-section-04 ${contentPadding} bg-[#111] pb-20 sm:pb-28`}
        id="projekty"
        ref={projectsSectionRef}
      >
        <div
          className="projects-heading bg-[#111] pb-8 pt-16 sm:pb-10 sm:pt-24"
          ref={projectsHeadingRef}
        >
          <div className="projects-heading-label">
            <SectionLabel>PROJEKTY</SectionLabel>
          </div>
          <h2 className="projects-heading-title m-0 mt-9 whitespace-nowrap text-[clamp(2rem,9vw,2.6875rem)] leading-tight tracking-[-.06em] sm:mt-11 sm:text-[min(5.5rem,9.5vw)]">
            Zpracované projekty
          </h2>
        </div>
        <ProjectList />
      </section>

      <section
        className="statement-scroll scroll-stack-section-05 relative bg-[#080808]"
        ref={statementSectionRef}
      >
        <div className="sticky top-0 flex h-svh items-center overflow-hidden">
          <div className="relative h-90 w-full px-6 pt-8 sm:h-[38.75rem] sm:px-[5.56vw] sm:pt-10">
            <SectionLabel>OD VIZE K REALITĚ</SectionLabel>
            <svg
              className="absolute left-[-5.375rem] top-[7.25rem] h-75 w-[73.125rem] sm:left-[-2.5rem] sm:top-[7.5rem] sm:h-120 sm:w-[112.5rem]"
              viewBox="0 0 1800 480"
              aria-label="Měním vaše vize v realitu"
              role="img"
              ref={statementSvgRef}
            >
              <defs>
                <path id="statement-arc" d="M -40 420 Q 720 -20 1800 420" />
              </defs>
              <use
                href="#statement-arc"
                fill="none"
                stroke="#30302e"
                strokeWidth="1"
              />
              <text
                fill="#f1f0ec"
                fontFamily="var(--font-inter), Arial, sans-serif"
                fontSize="190"
                fontWeight="500"
                letterSpacing="-8"
              >
                <textPath
                  href="#statement-arc"
                  startOffset="1%"
                  ref={statementTextPathRef}
                >
                  MĚNÍM VAŠE VIZE V REALITU
                </textPath>
              </text>
              {/* Straight copy of the text, used only to measure its length. */}
              <text
                aria-hidden="true"
                fontFamily="var(--font-inter), Arial, sans-serif"
                fontSize="190"
                fontWeight="500"
                letterSpacing="-8"
                ref={statementMeasureRef}
                visibility="hidden"
              >
                MĚNÍM VAŠE VIZE V REALITU
              </text>
            </svg>
            <span
              className="absolute bottom-11 left-[46%] inline-block text-3xl sm:bottom-20 sm:text-5xl"
              ref={statementStarRef}
            >
              ✦
            </span>
          </div>
        </div>
      </section>

      <section
        className={`scroll-reveal-section scroll-stack-section-06 ${contentPadding} bg-[#111] pb-20 pt-16 sm:pb-28 sm:pt-24`}
        id="kontakt"
      >
        <SectionLabel>KONTAKT</SectionLabel>
        <div className="mt-8 flex flex-col gap-8 sm:mt-12 lg:grid lg:grid-cols-[minmax(0,30rem)_1fr] lg:gap-20">
          <div>
            <h2 className="mb-4 text-[2.8125rem] tracking-[-.06em] sm:text-[4rem] lg:hidden">
              Napište mi
            </h2>
            <p className="mb-8 leading-6 text-[#a5a5a2] sm:text-lg lg:hidden">
              Máte nápad, projekt nebo jen otázku? Ozvěte se mi a společně
              vymyslíme další krok.
            </p>
            <div className="relative h-[21.25rem] overflow-hidden rounded-2xl sm:h-108 lg:h-150">
              <Image
                className="object-cover"
                src="/kontakt.png"
                alt="Ruka píšící na klávesnici notebooku s otevřeným e-mailem"
                fill
                // The dark photo with text on the screen blurs at the default quality.
                quality={90}
                sizes="(max-width: 700px) 342px, 480px"
              />
            </div>
          </div>
          <form className="flex flex-col" onSubmit={submitForm}>
            <div className="hidden lg:block">
              <h2 className="m-0 text-[4rem] leading-[1.1] tracking-[-.06em]">
                Napište mi
              </h2>
              <p className="mb-7 mt-7 max-w-162.5 text-lg leading-[1.5] text-[#a5a5a2]">
                Máte projekt, který potřebuje oživit? Napište mi tu zprávu a
                domluvíme se na detailech
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              {[
                ["Jméno", "text", "Vaše jméno…"],
                ["E-mail", "email", "Váš e-mail…"],
              ].map(([label, type, placeholder]) => (
                <label
                  className="flex flex-col gap-3 text-sm font-medium"
                  key={label}
                >
                  {label}
                  <input
                    className="form-field h-[3.625rem] rounded-lg border border-[#30302e] bg-[#191919] px-5 text-base font-normal outline-none placeholder:text-[#727270]"
                    required
                    name={label.toLowerCase()}
                    type={type}
                    placeholder={placeholder}
                  />
                </label>
              ))}
            </div>
            <label className="mt-6 flex flex-col gap-3 text-sm font-medium">
              Předmět
              <span className="relative">
                <select
                  className="h-[3.625rem] w-full appearance-none rounded-lg border border-[#30302e] bg-[#191919] pl-5 pr-14 text-base font-normal text-[#a5a5a2] outline-none"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Vyberte předmět…
                  </option>
                  <option>Web design</option>
                  <option>Vývoj webu</option>
                  <option>Grafický design</option>
                  <option>Branding</option>
                </select>
                <svg
                  className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-[#a5a5a2]"
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M3 5.25 7 9.25l4-4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </label>
            <label className="mt-6 flex flex-col gap-3 text-sm font-medium">
              Zpráva
              <textarea
                className="form-field h-40 resize-y rounded-lg border border-[#30302e] bg-[#191919] px-5 pt-5 text-base font-normal outline-none placeholder:text-[#727270]"
                required
                placeholder="Vaše zpráva…"
              />
            </label>
            <button
              className={`${buttonClass} ${fillHoverClass} submit-button group mt-7 self-start before:bg-[#1f1f1f] hover:text-[#f1f0ec] focus-visible:text-[#f1f0ec]`}
              type="submit"
            >
              Odeslat{" "}
              <Arrow className="transition-[rotate,filter] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:rotate-45 group-hover:invert group-focus-visible:rotate-45 group-focus-visible:invert" />
            </button>
            {sent && (
              <p className="text-[#d9ff6a]" role="status">
                Děkuji za zprávu. Ozvu se co nejdříve.
              </p>
            )}
          </form>
        </div>
      </section>

      <SiteFooter />
      </main>
    </>
  );
};

export default Portfolio;
