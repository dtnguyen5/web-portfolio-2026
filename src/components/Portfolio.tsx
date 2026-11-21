"use client";

/* =============================================================================
 * PORTFOLIO – celá úvodní stránka
 * -----------------------------------------------------------------------------
 * Sekce shora dolů (id = kotva pro odkazy v menu):
 *   1. #domu      HERO       – „AHOJ, JSEM HONZA“, nápis zůstává a další sekce ho překryje
 *   2. #o-mne     O MNĚ      – 3D postavička, Kdo jsem, Škola & praxe, Nástroje
 *   3. #sluzby    SLUŽBY     – seznam služeb s náhledem u kurzoru (ServiceList)
 *   4. #projekty  PROJEKTY   – karty projektů, které se skládají na sebe (ProjectList)
 *   5. (bez id)   STATEMENT  – „MĚNÍM VAŠE VIZE V REALITU“ jede po oblouku při scrollu
 *   6. #kontakt   KONTAKT    – fotka + formulář
 *   7. patička (SiteFooter)
 *
 * Nahoře jsou efekty (useEffect) pro scroll animace, dole samotné HTML (JSX).
 * Texty a data (škola, práce, nástroje, projekty, služby) jsou v data/portfolio.ts.
 * Styly a animace (třídy jako hero-*, projects-*, statement-*) jsou v styles.scss.
 * ========================================================================== */

import Image from "next/image";
import dynamic from "next/dynamic";
import { FormEvent, useEffect, useRef, useState } from "react";
import { experience, tools } from "@/data/portfolio";
import Arrow from "./Arrow";
import BlockReveal from "./BlockReveal";
import ProjectList from "./ProjectList";
import SectionLabel from "./SectionLabel";
import ServiceList from "./ServiceList";
import { contentPadding, fillHoverClass } from "./shared";
import SiteFooter from "./SiteFooter";

// three.js běží jen v prohlížeči – načteme ho bez SSR a v samostatném bundlu.
const Avatar3D = dynamic(() => import("./Avatar3D"), { ssr: false });
import SiteNav from "./SiteNav";
import SmoothCursor from "./SmoothCursor";
import SmoothScroll from "./SmoothScroll";

// Vzhled hlavního tlačítka (světlá „pilulka“) – používá tlačítko Odeslat
const buttonClass =
  "inline-flex h-13 items-center gap-6 rounded-full bg-[#f1f0ec] px-6 text-base font-medium text-[#080808]";

const Portfolio = () => {
  /* ===========================================================================
   * STAV A ODKAZY NA PRVKY
   * ======================================================================== */

  // true po odeslání formuláře → zobrazí se poděkování
  const [sent, setSent] = useState(false);
  // Ref = odkaz na konkrétní HTML prvek, aby s ním šlo pracovat v efektech níž
  const heroTitleRef = useRef<HTMLDivElement>(null);
  const heroInfoRef = useRef<HTMLDivElement>(null);
  const projectsSectionRef = useRef<HTMLElement>(null);
  const projectsHeadingRef = useRef<HTMLDivElement>(null);
  const statementSectionRef = useRef<HTMLElement>(null);
  const statementSvgRef = useRef<SVGSVGElement>(null);
  const statementTextPathRef = useRef<SVGTextPathElement>(null);
  const statementMeasureRef = useRef<SVGTextElement>(null);
  const statementStarRef = useRef<HTMLSpanElement>(null);

  /* ===========================================================================
   * EFEKT 1: SEKCE VYJEDOU PŘI SCROLLU
   * ---------------------------------------------------------------------------
   * Sekce s třídou .scroll-reveal-section dostanou .is-visible, jakmile se
   * objeví na obrazovce (animace je v styles.scss). Každá jen jednou.
   * ======================================================================== */
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

    // Pojistka pro rychlé scrollování (observer může sekci „přeskočit“).
    // Max. jednou za snímek, jen pro ještě schované sekce, a jakmile jsou
    // vidět všechny, přestane scroll vůbec poslouchat.
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

  /* ===========================================================================
   * EFEKT 2: HERO – NÁPIS ZŮSTANE A SEKCE „O MNĚ“ HO PŘEKRYJE
   * ---------------------------------------------------------------------------
   * Spočítá, jak moc už spodní část hera (text + čára) překryla velký nápis,
   * a pošle to do CSS jako --hero-cover-progress (0 = vůbec, 1 = úplně).
   * ======================================================================== */
  useEffect(() => {
    const title = heroTitleRef.current;
    const info = heroInfoRef.current;

    if (!title || !info) {
      return;
    }

    let frame = 0;
    const main = title.closest("main");

    // Místo navíc v heru (výška nápisu) drží nápis na místě, zatímco přes něj
    // najíždí další sekce. Přepočítá se při změně velikosti nápisu.
    const resizeObserver = new ResizeObserver(() => {
      main?.style.setProperty("--hero-cover-space", `${title.offsetHeight}px`);
    });
    resizeObserver.observe(title);

    // 0–1 podle toho, kolik nápisu už je překryto
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

  /* ===========================================================================
   * EFEKT 3: PROJEKTY – NADPIS SE PŘI SCROLLU ZMENŠÍ DO LIŠTY
   * ---------------------------------------------------------------------------
   * Velký nadpis „Zpracované projekty“ je přilepený nahoře a při scrollu se
   * zmenší do malé lišty, aby pod ním měly karty projektů dost místa.
   * Hodnoty jdou do CSS proměnných (--compact-progress, --title-scale…).
   * ======================================================================== */
  useEffect(() => {
    const section = projectsSectionRef.current;
    const heading = projectsHeadingRef.current;
    const title = heading?.querySelector<HTMLElement>(".projects-heading-title");

    if (!section || !heading || !title) {
      return;
    }

    let frame = 0;
    let collapse = 0;

    // Změří, jak velká má být kompaktní lišta. Na širokých obrazovkách
    // (82rem+) je lišta ve stejné řadě jako navigace, jinde hned pod ní.
    // 40rem = tablet/počítač, 82rem = široký monitor.
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

    // Při scrollu: kolik je odscrollováno → jak moc je nadpis zmenšený (0–1)
    const update = () => {
      frame = 0;
      const scrolled = Math.max(0, -section.getBoundingClientRect().top);
      const progress = collapse ? Math.min(scrolled / collapse, 1) : 0;
      heading.style.setProperty("--compact-progress", progress.toFixed(3));
      // Nastaveno přímo – Safari nepřekreslí clip-path, který je složený z CSS proměnné.
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

  /* ===========================================================================
   * EFEKT 4: STATEMENT – TEXT JEDE PO OBLOUKU + HVĚZDA SE TOČÍ
   * ---------------------------------------------------------------------------
   * Sekce se při scrollu „přilepí“ a text „MĚNÍM VAŠE VIZE V REALITU“ projede
   * po oblouku zprava doleva. Hvězda ✦ se mezitím otočí 2× dokola (720°).
   * ======================================================================== */
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

    // Text vyjede zpoza pravého okraje obrazovky a jede, dokud celý nezmizí
    // za levým. Tady se spočítá, kde na oblouku má začít a kde skončit.
    // (Čísla 1800 / -40 / 1840 odpovídají viewBoxu a cestě oblouku v SVG níž.)
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
      // Pohyb běží jen během „přilepení“ sekce, takže text začíná mimo obrazovku.
      // / 0.9 = text dojede o kousek dřív, než přilepení skončí.
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
    // Po načtení fontu se změří znovu (jiný font = jiná délka textu)
    document.fonts.ready.then(measure);
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", measure);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", measure);
    };
  }, []);

  /* ===========================================================================
   * ODESLÁNÍ FORMULÁŘE
   * ---------------------------------------------------------------------------
   * POZOR: zatím se zpráva nikam neposílá – jen se zobrazí poděkování.
   * Pro skutečné odesílání je potřeba napojit službu (např. Formspree, Resend).
   * ======================================================================== */
  const submitForm = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSent(true);
  };

  /* ===========================================================================
   * HTML STRÁNKY
   * ======================================================================== */
  return (
    <>
      {/* Vlastní kurzor a plynulý scroll (nic viditelného nevykreslují do obsahu) */}
      <SmoothCursor />
      <SmoothScroll />
      {/* Bloky obsahu pod herem vyjedou zespodu, když se k nim doscrolluje.
          Sekce projektů tu není – její karty mají vlastní animaci skládání. */}
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
        {/* Navigace (plovoucí lišta nahoře / hamburger menu na mobilu) */}
        <SiteNav />

      {/* =====================================================================
          1. HERO  (#domu)
          ================================================================== */}
      <section
        className={`scroll-stack-section scroll-stack-section-01 ${contentPadding} bg-[#080808] pb-0 pt-14 sm:pt-22`}
        id="domu"
      >
        {/* Velký nápis – zůstává přilepený a sekce O mně ho překryje */}
        <div className="hero-title-sticky" ref={heroTitleRef}>
        {/* Malý popisek nad nápisem */}
        <div className="hero-reveal hero-meta flex flex-col gap-7 pb-0 pt-7 font-mono text-xs leading-6 text-[#a5a5a2] sm:flex-row sm:items-center sm:justify-between sm:pb-7 sm:pt-16">
          <span>WEB DESIGN / DEVELOPMENT / GRAFIKA</span>
        </div>
        {/* Hlavní nadpis ve třech řádcích (každý vyjede zvlášť – .hero-title-line) */}
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
        {/* Spodní část hera: čára + dva krátké texty (vlevo / vpravo) */}
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
        {/* Prázdné místo, během kterého nápis zůstává a sekce O mně najíždí přes něj */}
        <div className="hero-cover-spacer" aria-hidden="true" />
      </section>

      {/* =====================================================================
          2. O MNĚ  (#o-mne)
          Vlevo: 3D postavička + jméno (na počítači přilepené při scrollu)
          Vpravo: 01 Kdo jsem, 02 Škola & praxe, 03 Nástroje
          ================================================================== */}

      <section
        className={`scroll-stack-section scroll-stack-section-02 hero-cover-next ${contentPadding} bg-[#111] pb-20 pt-16 sm:pb-28`}
        id="o-mne"
      >
        <SectionLabel>O MNĚ</SectionLabel>
        <div className="mt-10 grid gap-10 sm:mt-12 lg:grid-cols-[minmax(0,32.5rem)_1fr] lg:gap-[6.67vw]">
          {/* --- Levý sloupec: postavička + jméno --- */}
          <div className="about-sidebar">
            {/* Box s 3D postavičkou. Výška: mobil h-110, tablet h-136, počítač
                podle výšky okna (.about-sidebar-image v styles.scss) */}
            <div className="about-sidebar-image relative h-110 overflow-hidden rounded-2xl sm:h-136 lg:h-170">
              <div
                className="absolute inset-0"
                role="img"
                aria-label="3D postavička Honzy, jak píše na notebooku"
              >
                <Avatar3D />
              </div>
            </div>
            {/* Jméno a město pod postavičkou */}
            <div className="mt-6 flex justify-between">
              <div className="flex flex-col gap-2">
                <strong className="text-2xl">Nguyen Duy Tiep (Honza)</strong>
                <span className="font-mono text-xs text-[#a5a5a2]">
                  PLZEŇ, CZ
                </span>
              </div>
            </div>
          </div>
          {/* --- Pravý sloupec: texty --- */}
          <div className="about-content">
            {/* 01 / 03 – Kdo jsem */}
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
            {/* 02 / 03 – Škola & praxe (data: experience v data/portfolio.ts) */}
            <article className="border-t border-[#30302e] py-6 !pb-0 sm:pt-10">
              <SectionLabel>02 / 03</SectionLabel>
              <h2 className="my-5 text-4xl leading-tight tracking-[-.05em] sm:text-[3.25rem]">
                Škola &amp; praxe
              </h2>
              {/* Škola */}
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
              {/* Pracovní zkušenosti – jedna položka za každou práci */}
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
            {/* 03 / 03 – Nástroje (data: tools v data/portfolio.ts) */}
            <article className="pt-0">
              <div className="mb-7 h-px bg-[#30302e]" />
              <SectionLabel>03 / 03</SectionLabel>
              <h2 className="my-5 text-4xl leading-tight tracking-[-.05em] sm:text-[3.25rem]">
                Nástroje
              </h2>
              {/* Štítky nástrojů (efekt skla při hoveru – .tool-glass v styles.scss) */}
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

      {/* =====================================================================
          3. SLUŽBY  (#sluzby)
          ================================================================== */}
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
        {/* Řádky služeb s náhledem u kurzoru */}
        <ServiceList />
      </section>

      {/* =====================================================================
          4. PROJEKTY  (#projekty)
          Nadpis se při scrollu zmenší do lišty (EFEKT 3), karty se skládají
          ================================================================== */}
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
        {/* Karty projektů */}
        <ProjectList />
      </section>

      {/* =====================================================================
          5. STATEMENT – „MĚNÍM VAŠE VIZE V REALITU“ po oblouku (EFEKT 4)
          Sekce je vyšší než obrazovka; vnitřek je sticky, takže „stojí“ na místě
          a scroll mezitím posouvá text po oblouku.
          ================================================================== */}
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
              {/* Oblouk, po kterém text jede (M = začátek, Q = křivka přes bod 720,-20 do 1800,420) */}
              <defs>
                <path id="statement-arc" d="M -40 420 Q 720 -20 1800 420" />
              </defs>
              {/* Tenká šedá čára oblouku */}
              <use
                href="#statement-arc"
                fill="none"
                stroke="#30302e"
                strokeWidth="1"
              />
              {/* Samotný text na oblouku (startOffset posouvá EFEKT 4) */}
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
              {/* Neviditelná rovná kopie textu – jen kvůli změření jeho délky. */}
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
            {/* Hvězda, která se při scrollu točí */}
            <span
              className="absolute bottom-11 left-[46%] inline-block text-3xl sm:bottom-20 sm:text-5xl"
              ref={statementStarRef}
            >
              ✦
            </span>
          </div>
        </div>
      </section>

      {/* =====================================================================
          6. KONTAKT  (#kontakt) – fotka vlevo, formulář vpravo
          ================================================================== */}
      <section
        className={`scroll-reveal-section scroll-stack-section-06 ${contentPadding} bg-[#111] pb-20 pt-16 sm:pb-28 sm:pt-24`}
        id="kontakt"
      >
        <SectionLabel>KONTAKT</SectionLabel>
        <div className="mt-8 flex flex-col gap-8 sm:mt-12 lg:grid lg:grid-cols-[minmax(0,30rem)_1fr] lg:gap-20">
          {/* --- Levý sloupec: nadpis (jen mobil/tablet) + fotka --- */}
          <div>
            {/* Na mobilu je nadpis nad fotkou, na počítači (lg) je ve formuláři */}
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
                // Tmavá fotka s textem na displeji je při výchozí kvalitě (75) rozmazaná.
                quality={90}
                sizes="(max-width: 700px) 342px, 480px"
              />
            </div>
          </div>
          {/* --- Pravý sloupec: formulář --- */}
          <form className="flex flex-col" onSubmit={submitForm}>
            {/* Nadpis a text – jen na počítači (lg) */}
            <div className="hidden lg:block">
              <h2 className="m-0 text-[4rem] leading-[1.1] tracking-[-.06em]">
                Napište mi
              </h2>
              <p className="mb-7 mt-7 max-w-162.5 text-lg leading-[1.5] text-[#a5a5a2]">
                Máte projekt, který potřebuje oživit? Napište mi tu zprávu a
                domluvíme se na detailech
              </p>
            </div>
            {/* Jméno + E-mail vedle sebe. Každé pole: [popisek, typ, placeholder] */}
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
            {/* Předmět – rozbalovací výběr s vlastní šipkou */}
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
            {/* Zpráva */}
            <label className="mt-6 flex flex-col gap-3 text-sm font-medium">
              Zpráva
              <textarea
                className="form-field h-40 resize-y rounded-lg border border-[#30302e] bg-[#191919] px-5 pt-5 text-base font-normal outline-none placeholder:text-[#727270]"
                required
                placeholder="Vaše zpráva…"
              />
            </label>
            {/* Tlačítko Odeslat – při hoveru se zespodu vyplní tmavou a šipka se otočí */}
            <button
              className={`${buttonClass} ${fillHoverClass} submit-button group mt-7 self-start before:bg-[#1f1f1f] hover:text-[#f1f0ec] focus-visible:text-[#f1f0ec]`}
              type="submit"
            >
              Odeslat{" "}
              <Arrow className="transition-[rotate,filter] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:rotate-45 group-hover:invert group-focus-visible:rotate-45 group-focus-visible:invert" />
            </button>
            {/* Poděkování po odeslání */}
            {sent && (
              <p className="text-[#d9ff6a]" role="status">
                Děkuji za zprávu. Ozvu se co nejdříve.
              </p>
            )}
          </form>
        </div>
      </section>

      {/* =====================================================================
          7. PATIČKA
          ================================================================== */}
      <SiteFooter />
      </main>
    </>
  );
};

export default Portfolio;
