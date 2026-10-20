"use client";

import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";
import { contact, experience, tools } from "@/data/portfolio";
import Arrow from "./Arrow";
import ProjectList from "./ProjectList";
import SectionLabel from "./SectionLabel";
import ServiceList from "./ServiceList";
import SmoothCursor from "./SmoothCursor";

const contentPadding = "px-6 sm:px-[5.56vw]";
const buttonClass =
  "inline-flex h-[52px] items-center gap-6 rounded-full bg-[#f1f0ec] px-6 text-base font-medium text-[#080808]";

const Portfolio = () => {
  const [sent, setSent] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const revealItems = document.querySelectorAll<HTMLElement>(".about-reveal");
    const sectionRevealItems =
      document.querySelectorAll<HTMLElement>(".scroll-reveal-section");

    if (!("IntersectionObserver" in window)) {
      revealItems.forEach((item) => item.classList.add("is-visible"));
      sectionRevealItems.forEach((item) => item.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18 },
    );

    revealItems.forEach((item) => observer.observe(item));

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

    const revealSectionsOnScroll = () => {
      sectionRevealItems.forEach((item) => {
        if (item.getBoundingClientRect().top < window.innerHeight * 0.92) {
          item.classList.add("is-visible");
        }
      });
    };

    revealSectionsOnScroll();
    window.addEventListener("scroll", revealSectionsOnScroll, {
      passive: true,
    });

    return () => {
      observer.disconnect();
      sectionObserver.disconnect();
      window.removeEventListener("scroll", revealSectionsOnScroll);
    };
  }, []);

  const submitForm = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSent(true);
  };

  return (
    <>
      <SmoothCursor />
      <main className="overflow-x-clip">
      <section
        className={`scroll-stack-section scroll-stack-section-01 ${contentPadding} min-h-screen bg-[#080808] pb-0 pt-[54px] sm:pt-[88px]`}
        id="domu"
      >
        <nav className="hero-reveal fixed inset-x-0 top-5 z-50 flex h-[44px] items-center justify-between bg-transparent px-6 sm:top-8 sm:h-[76px] sm:justify-center sm:px-[5.56vw]">
          <a className="sm:hidden" href="#domu" aria-label="Domů">
            <Image
              src="/Osobní značka.svg"
              alt="Honza"
              width={34}
              height={34}
            />
          </a>
          <div className="hidden items-center gap-6 rounded-full border border-[#1f1f1f] bg-[#080808] px-3 py-2.5 text-base font-medium text-[#f1f0ec] sm:flex sm:w-[470px] sm:justify-center">
            <a href="#domu" aria-label="Domů">
              <Image
                src="/Osobní značka.svg"
                alt="Honza"
                width={30}
                height={30}
              />
            </a>
            <div className="flex items-center gap-6">
              <a className="hover:text-[#a5a5a2]" href="#domu">
                Domů
              </a>
              <a className="hover:text-[#a5a5a2]" href="#o-mne">
                O mně
              </a>
              <a className="hover:text-[#a5a5a2]" href="#projekty">
                Projekty
              </a>
            </div>
            <a
              className="rounded-full bg-[#1f1f1f] px-5 py-2.5 hover:bg-[#30302e]"
              href="#kontakt"
            >
              Napište mi
            </a>
          </div>
          <button
            className="flex h-11 w-11 items-center justify-center rounded-full border border-[#f5f2e9] sm:hidden"
            type="button"
            onClick={() => setMenuOpen((isOpen) => !isOpen)}
            aria-label="Otevřít menu"
            aria-expanded={menuOpen}
          >
            <span className="flex w-[22px] flex-col gap-1.5" aria-hidden="true">
              <span className="h-px w-full bg-[#f5f2e9]" />
              <span className="h-px w-full bg-[#f5f2e9]" />
            </span>
          </button>
        </nav>
        {menuOpen && (
          <div className="mt-5 flex flex-col gap-4 rounded-lg border border-[#30302e] p-4 text-sm text-[#a5a5a2] sm:hidden">
            {[
              ["Domů", "#domu"],
              ["O mně", "#o-mne"],
              ["Projekty", "#projekty"],
              ["Napište mi", "#kontakt"],
            ].map(([label, href]) => (
              <a
                href={href}
                key={href}
                onClick={() => setMenuOpen(false)}
                className="hover:text-[#f1f0ec]"
              >
                {label}
              </a>
            ))}
          </div>
        )}
        <div className="hero-reveal hero-meta flex flex-col gap-7 pb-0 pt-7 font-mono text-xs leading-6 text-[#a5a5a2] sm:flex-row sm:items-center sm:justify-between sm:pb-[30px] sm:pt-16">
          <span>WEB DESIGN / DEVELOPMENT / GRAFIKA</span>
        </div>
        <div className="pb-8 pt-10 font-medium tracking-[-.06em] sm:pb-14 sm:pt-0">
          <h1 className="m-0 text-[clamp(45px,8.25vw,119px)] leading-[1.08]">
            <span className="hero-title-line hero-title-line-primary" aria-label="AHOJ, JSEM HONZA">
              <span>AHOJ, JSEM HONZA</span>
            </span>
          </h1>
          <p className="m-0 text-[clamp(45px,7.64vw,110px)] leading-[1.13] text-[#a5a5a2]">
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
      </section>

      <section
        className={`scroll-reveal-section scroll-stack-section-02 ${contentPadding} bg-[#111] pb-20 pt-16 sm:pb-28`}
        id="o-mne"
      >
        <SectionLabel>O MNĚ</SectionLabel>
        <div className="mt-10 grid gap-10 sm:mt-12 sm:grid-cols-[520px_1fr] sm:gap-[6.67vw]">
          <div className="about-sidebar">
            <div className="about-sidebar-image relative h-[440px] overflow-hidden rounded-2xl sm:h-[680px]">
              <Image
                className="object-cover"
                src="/workspace.png"
                alt="Pracovní prostor designéra"
                fill
                sizes="(max-width: 700px) 342px, 520px"
              />
            </div>
            <div className="mt-6 flex justify-between">
              <div className="flex flex-col gap-2">
                <strong className="text-[22px]">Nguyen Duy Tiep (Honza)</strong>
                <span className="font-mono text-xs text-[#a5a5a2]">
                  PLZEŇ, CZ
                </span>
              </div>
            </div>
          </div>
          <div className="about-content">
            <article className="about-reveal border-t border-[#30302e] py-6 sm:pb-16 sm:pt-8 sm:pr-12">
              <SectionLabel>01 / 03</SectionLabel>
              <h2 className="my-5 text-[38px] leading-tight tracking-[-.05em] sm:text-[52px]">
                Kdo jsem
              </h2>
              <p className="m-0 max-w-[970px] text-lg leading-[1.55] text-[#a5a5a2]">
                Jmenuji se Nguyen Duy Tiep (Honza) a jsem webový designér a
                developer z Plzně. Pomáhám klientům převádět jejich nápady do
                funkčních a moderních webových řešení. Zakládám si na detailu,
                čisté typografii a responzivním designu. Spojuji kreativitu
                designéra s logikou vývojáře, abych doručil komplexní a
                bezproblémový výsledek.
              </p>
            </article>
            <article className="about-reveal border-t border-[#30302e] py-6 !pb-0 sm:pt-10">
              <SectionLabel>02 / 03</SectionLabel>
              <h2 className="my-5 text-[38px] leading-tight tracking-[-.05em] sm:text-[52px]">
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
                  <h3 className="mt-4 text-3xl leading-tight sm:text-[34px]">
                    {job.title}
                  </h3>
                  <p className="m-0 mt-3 text-xl text-[#a5a5a2] sm:text-[28px]">
                    {job.description}
                  </p>
                </div>
                ))}
              </div>
            </article>
            <article className="pt-0">
              <div className="mb-7 h-px bg-[#30302e]" />
              <SectionLabel>03 / 03</SectionLabel>
              <h2 className="my-5 text-[38px] leading-tight tracking-[-.05em] sm:text-[52px]">
                Nástroje
              </h2>
              <div className="flex flex-wrap gap-2.5">
                {tools.map((tool) => (
                  <span
                    className="cursor-default rounded-full border border-[#30302e] px-4 py-2.5 text-[#a5a5a2] transition-colors duration-300 hover:border-[#f1f0ec] hover:bg-[#f1f0ec] hover:text-[#080808] focus-visible:border-[#f1f0ec] focus-visible:bg-[#f1f0ec] focus-visible:text-[#080808]"
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
        <div className="max-w-[650px]">
          <SectionLabel>CO UMÍM</SectionLabel>
          <h2 className="mb-8 mt-9 text-[43px] leading-tight tracking-[-.06em] sm:mb-14 sm:mt-11 sm:text-[88px]">
            Moje služby
          </h2>
        </div>
        <ServiceList />
      </section>

      <section
        className={`scroll-reveal-section scroll-stack-section-04 ${contentPadding} bg-[#111] pb-20 pt-16 sm:pb-28 sm:pt-24`}
        id="projekty"
      >
        <SectionLabel number="03">PROJEKTY</SectionLabel>
        <h2 className="mb-8 mt-9 text-[43px] leading-tight tracking-[-.06em] sm:mb-14 sm:mt-11 sm:text-[88px]">
          Zpracované projekty
        </h2>
        <ProjectList />
      </section>

      <section className="scroll-reveal-section scroll-stack-section-05 relative h-[360px] overflow-hidden bg-[#080808] px-6 pt-8 sm:h-[620px] sm:px-[5.56vw] sm:pt-10">
        <SectionLabel>OD VIZE K REALITĚ</SectionLabel>
        <svg
          className="absolute left-[-86px] top-[116px] h-[300px] w-[1170px] sm:left-[-40px] sm:top-[120px] sm:h-[480px] sm:w-[1800px]"
          viewBox="0 0 1800 480"
          aria-label="Měním vaše vize v realitu"
          role="img"
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
            <textPath href="#statement-arc" startOffset="1%">
              MĚNÍM VAŠE VIZE V REALITU
            </textPath>
          </text>
        </svg>
        <span className="absolute bottom-11 left-[46%] text-3xl sm:bottom-20 sm:text-[40px]">
          ✦
        </span>
      </section>

      <section
        className={`scroll-reveal-section scroll-stack-section-06 ${contentPadding} bg-[#111] pb-20 pt-16 sm:pb-28 sm:pt-24`}
        id="kontakt"
      >
        <SectionLabel number="04">KONTAKT</SectionLabel>
        <div className="mt-8 flex flex-col gap-8 sm:mt-12 sm:grid sm:grid-cols-[480px_1fr] sm:gap-20">
          <div>
            <h2 className="mb-4 text-[45px] tracking-[-.06em] sm:hidden">
              Napište mi
            </h2>
            <p className="mb-8 leading-6 text-[#a5a5a2] sm:hidden">
              Máte nápad, projekt nebo jen otázku? Ozvěte se mi a společně
              vymyslíme další krok.
            </p>
            <div className="relative h-[340px] overflow-hidden rounded-2xl sm:h-[720px]">
              <Image
                className="object-cover"
                src="/workspace-detail.png"
                alt="Detail pracovního prostoru"
                fill
                sizes="(max-width: 700px) 342px, 480px"
              />
              <span className="absolute bottom-4 left-4 bg-[#080808] px-3 py-2.5 font-mono text-xs text-[#a5a5a2]">
                KONCEPČNÍ VIZUÁL
              </span>
            </div>
          </div>
          <form className="flex flex-col" onSubmit={submitForm}>
            <div className="hidden sm:block">
              <h2 className="m-0 text-[64px] leading-[1.1] tracking-[-.06em]">
                Napište mi
              </h2>
              <p className="mb-7 mt-7 max-w-[650px] text-[18px] leading-[1.5] text-[#a5a5a2]">
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
                    className="h-[58px] rounded-lg border border-[#30302e] bg-[#191919] px-5 text-base font-normal outline-none placeholder:text-[#727270]"
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
              <select
                className="h-[58px] rounded-lg border border-[#30302e] bg-[#191919] px-5 text-base font-normal text-[#a5a5a2] outline-none"
                defaultValue=""
              >
                <option value="" disabled>
                  Vyberte předmět…
                </option>
                <option>Web design</option>
                <option>Vývoj webu</option>
                <option>Grafika</option>
              </select>
            </label>
            <label className="mt-6 flex flex-col gap-3 text-sm font-medium">
              Zpráva
              <textarea
                className="h-40 resize-y rounded-lg border border-[#30302e] bg-[#191919] px-5 pt-5 text-base font-normal outline-none placeholder:text-[#727270]"
                required
                placeholder="Vaše zpráva…"
              />
            </label>
            <button className={`${buttonClass} mt-7 self-start`} type="submit">
              Odeslat <Arrow />
            </button>
            {sent && (
              <p className="text-[#d9ff6a]" role="status">
                Děkuji za zprávu. Ozvu se co nejdříve.
              </p>
            )}
          </form>
        </div>
      </section>

      <footer className={`scroll-reveal-section scroll-stack-section-07 ${contentPadding} bg-[#080808] pb-9 pt-16 sm:pt-[88px]`}>
        <SectionLabel>PŘIPRAVENÝ TVOŘIT NĚCO NOVÉHO</SectionLabel>
        <div className="my-10 flex items-center justify-between sm:my-14">
          <h2 className="m-0 text-[53px] tracking-[-.08em] sm:text-[9vw]">
            POJĎME TVOŘIT
          </h2>
        </div>
        <div className="h-px bg-[#30302e]" />
        <div className="flex flex-col gap-3 py-7 text-xl sm:flex-row sm:justify-between sm:py-10 sm:text-[44px]">
          <a href={`mailto:${contact.email}`}>{contact.email}</a>
          <a href={`tel:${contact.phone.replace(/\s/g, "")}`}>
            {contact.phone}
          </a>
        </div>
        <div className="h-px bg-[#30302e]" />
        <div className="grid gap-5 pt-6 font-mono text-[10px] text-[#a5a5a2] sm:flex sm:items-center sm:justify-between">
          <span>©2026 HONZA</span>
          <div className="order-3 flex justify-between gap-2 text-[#f1f0ec] sm:order-none sm:gap-7">
            <a className="flex items-center gap-1.5" href="#">
              INSTAGRAM <Arrow className="brightness-0 invert" size={12} />
            </a>
            <a className="flex items-center gap-1.5" href="#">
              LINKEDIN <Arrow className="brightness-0 invert" size={12} />
            </a>
            <a className="flex items-center gap-1.5" href="#">
              GITHUB <Arrow className="brightness-0 invert" size={12} />
            </a>
          </div>
          <span>DESIGNED &amp; DEVELOPED BY ME</span>
        </div>
      </footer>
      </main>
    </>
  );
};

export default Portfolio;
