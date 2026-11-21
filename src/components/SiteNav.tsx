"use client";

/* =============================================================================
 * SITE NAV – navigace
 * -----------------------------------------------------------------------------
 * Počítač/tablet (sm+): plovoucí „pilulka“ uprostřed nahoře (logo, odkazy,
 *   Napište mi). Při scrollu dolů se zmenší jen na logo + „Právě k dispozici“,
 *   při scrollu nahoru nebo najetí myší se zase rozbalí.
 * Mobil: lišta s logem a hamburgerem; po kliknutí se otevře menu přes celou
 *   obrazovku (kruh vyroste z tlačítka – animace .mobile-menu v styles.scss).
 * ========================================================================== */

import Image from "next/image";
import { CSSProperties, useEffect, useLayoutEffect, useRef, useState } from "react";
import { contact } from "@/data/portfolio";
import Arrow from "./Arrow";
import { fillHoverClass, socialLinks } from "./shared";

// Vzhled odkazů v pilulce (při hoveru zešednou)
const navLinkClass =
  "transition-colors duration-500 ease-in-out hover:text-[#a5a5a2]";

type SiteNavProps = {
  // Předpona odkazů na sekce: na úvodní stránce "" (#o-mne), jinde "/" (/#o-mne).
  base?: string;
};

const SiteNav = ({ base = "" }: SiteNavProps) => {
  /* --- Stav --- */
  const [menuOpen, setMenuOpen] = useState(false); // mobilní menu otevřené
  const [navCompact, setNavCompact] = useState(false); // pilulka zmenšená (scroll dolů)
  const [navActive, setNavActive] = useState(false); // myš/focus na pilulce → rozbalit
  // Vypne animaci rozbalení/zabalení, když se navigace (znovu) objeví.
  const [navInstant, setNavInstant] = useState(true);
  const navRef = useRef<HTMLElement>(null);
  // Odkazy v menu: [text, kam vede]. Nový odkaz přidej sem.
  const links = [
    ["Domů", `${base}#domu`],
    ["O mně", `${base}#o-mne`],
    ["Služby", `${base}#sluzby`],
    ["Projekty", `${base}#projekty`],
  ];

  /* --- Návrat na stránku (tlačítko Zpět) ---
     Next.js stránku při přechodu jen schová a při návratu ji znovu ukáže.
     Navigace se pak objeví v posledním stavu bez animace a hover i mobilní
     menu se vynulují, aby se nikdy nevrátila napůl otevřená. */
  useLayoutEffect(() => {
    setNavInstant(true);
    let frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => setNavInstant(false));
    });

    return () => {
      cancelAnimationFrame(frame);
      setNavActive(false);
      setMenuOpen(false);
    };
  }, []);

  useEffect(() => {
    let frame = 0;
    let lastY = window.scrollY;

    /* --- Zmenšení pilulky při scrollu ---
       Při scrollu dolů se zmenší na logo + tlačítko, při scrollu nahoru nebo
       u horního okraje stránky (prvních 120 px) se zase rozbalí.
       4 px = drobné pohyby se ignorují, aby to necukalo. */
    const update = () => {
      frame = 0;
      // Schovaná stránka (display: none) nemá rozměry. Její navigace si nechá
      // svůj stav – scroll patří stránce, která je zrovna vidět.
      if (!navRef.current?.getClientRects().length) {
        return;
      }
      const y = window.scrollY;
      const delta = y - lastY;

      if (y < 120) {
        setNavCompact(false);
      } else if (delta > 4) {
        setNavCompact(true);
      } else if (delta < -4) {
        setNavCompact(false);
      }

      if (Math.abs(delta) > 4) {
        lastY = y;
      }
    };

    const requestUpdate = () => {
      if (!frame) {
        frame = requestAnimationFrame(update);
      }
    };

    window.addEventListener("scroll", requestUpdate, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", requestUpdate);
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) {
      return;
    }

    /* --- Otevřené mobilní menu ---
       Stránka pod ním se nesmí scrollovat. Menu zavře klávesa Escape
       nebo roztažení okna na velikost tabletu/počítače (40rem+). */
    const root = document.documentElement;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };
    const closeOnDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) {
        setMenuOpen(false);
      }
    };
    const desktopQuery = window.matchMedia("(min-width: 40rem)");

    root.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    desktopQuery.addEventListener("change", closeOnDesktop);

    return () => {
      root.style.overflow = "";
      window.removeEventListener("keydown", closeOnEscape);
      desktopQuery.removeEventListener("change", closeOnDesktop);
    };
  }, [menuOpen]);

  return (
    <>
      {/* ===================== HORNÍ LIŠTA ===================== */}
      <nav ref={navRef} className="hero-reveal fixed inset-x-0 top-0 z-70 flex items-center justify-between bg-[#080808]/80 px-6 py-4 backdrop-blur-md sm:top-8 sm:h-19 sm:justify-center sm:bg-transparent sm:px-[5.56vw] sm:py-0 sm:backdrop-blur-none">
        {/* Logo – jen mobil */}
        <a
          className="sm:hidden"
          href={`${base}#domu`}
          aria-label="Domů"
          onClick={() => setMenuOpen(false)}
        >
          <Image
            src="/Osobní značka.svg"
            alt="Honza"
            width={34}
            height={34}
          />
        </a>
        {/* --- Pilulka (jen tablet/počítač) ---
            Zmenšená ukazuje jen logo a tlačítko; najetí myší nebo focus
            (klávesnice) ji zase rozbalí. */}
        <div
          className={`hidden items-center gap-4 rounded-full bg-[#141414]/70 py-2.5 shadow-[inset_0_1px_0_rgb(255_255_255/0.06)] backdrop-blur-xl text-base font-medium text-[#f1f0ec] transition-[padding] duration-600 ease-[cubic-bezier(0.65,0,0.35,1)] sm:flex ${navInstant ? "transition-none!" : ""} ${
            navCompact && !navActive ? "pl-6 pr-2.5" : "pl-9 pr-6"
          }`}
          onMouseEnter={() => setNavActive(true)}
          onMouseLeave={() => setNavActive(false)}
          onFocus={() => setNavActive(true)}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) {
              setNavActive(false);
            }
          }}
        >
          {/* Logo v pilulce */}
          <a href={`${base}#domu`} aria-label="Domů">
            <Image
              src="/Osobní značka.svg"
              alt="Honza"
              width={30}
              height={30}
            />
          </a>
          {/* Odkazy – při zmenšení se „sbalí“ na nulovou šířku (grid 0fr ↔ 1fr) */}
          <div
            className={`grid transition-[grid-template-columns,opacity] duration-600 ease-[cubic-bezier(0.65,0,0.35,1)] ${navInstant ? "transition-none!" : ""} ${
              navCompact && !navActive
                ? "grid-cols-[0fr] opacity-0"
                : "grid-cols-[1fr] opacity-100"
            }`}
          >
            <div className="overflow-hidden">
              <div className="flex items-center gap-7 whitespace-nowrap px-3">
                {links.map(([label, href]) => (
                  <a className={navLinkClass} href={href} key={href}>
                    {label}
                  </a>
                ))}
              </div>
            </div>
          </div>
          {/* Vpravo: zmenšená → „Právě k dispozici“, rozbalená → tlačítko Napište mi */}
          {navCompact && !navActive ? (
            <span className="flex items-center gap-3 whitespace-nowrap py-2.5 pr-3">
              <span
                className="h-1.5 w-1.5 rounded-full bg-[#f1f0ec]"
                aria-hidden="true"
              />
              Právě k dispozici
            </span>
          ) : (
            <a
              className={`${fillHoverClass} whitespace-nowrap rounded-full bg-[#1f1f1f] px-5 py-2.5 before:bg-[#f1f0ec] hover:text-[#080808] focus-visible:text-[#080808]`}
              href={`${base}#kontakt`}
            >
              Napište mi
            </a>
          )}
        </div>
        {/* Hamburger – jen mobil */}
        <button
          className="flex h-11 w-11 items-center justify-center rounded-full border border-[#f5f2e9] sm:hidden"
          type="button"
          onClick={() => setMenuOpen((isOpen) => !isOpen)}
          aria-label={menuOpen ? "Zavřít menu" : "Otevřít menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
        >
          {/* Dvě čárky se při otevření menu změní na křížek. */}
          <span className="relative h-1.75 w-5.5" aria-hidden="true">
            <span
              className={`absolute inset-x-0 top-0 h-px bg-[#f5f2e9] transition-[translate,rotate] duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] ${
                menuOpen ? "translate-y-0.75 rotate-45" : ""
              }`}
            />
            <span
              className={`absolute inset-x-0 bottom-0 h-px bg-[#f5f2e9] transition-[translate,rotate] duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] ${
                menuOpen ? "-translate-y-0.75 -rotate-45" : ""
              }`}
            />
          </span>
        </button>
      </nav>
      {/* ===================== MOBILNÍ MENU =====================
          Panel vyroste jako kruh z hamburgeru a pak odkazy vyjedou zpoza
          masky stejně jako nadpis v heru. inert = zavřené menu nejde
          ovládat klávesnicí; data-lenis-prevent = Lenis tu nescrolluje. */}
      <div
        className={`mobile-menu fixed inset-0 z-60 flex flex-col overflow-y-auto bg-[#080808] px-6 pb-10 pt-4 sm:hidden ${
          menuOpen ? "is-open" : ""
        }`}
        id="mobile-menu"
        inert={!menuOpen}
        data-lenis-prevent
      >
        {/* Místo pro horní lištu – její logo a tlačítko zůstávají nad menu. */}
        <div className="h-11 shrink-0" aria-hidden="true" />
        {/* Odkazy (+ Napište mi navíc). Každý vyjede o 90 ms později než předchozí. */}
        <nav className="mt-16 flex flex-col">
          {[...links, ["Napište mi", `${base}#kontakt`]].map(
            ([label, href], index) => (
              <a
                className="mobile-menu-link group relative flex items-center justify-between py-5 text-[1.75rem] font-medium tracking-[-.04em] text-[#f1f0ec]"
                href={href}
                key={href}
                onClick={() => setMenuOpen(false)}
                style={{ "--item-delay": `${index * 90}ms` } as CSSProperties}
              >
                {/* Posun při hoveru hýbe celou maskou, takže text nikdy
                    neořízne jeho vlastní obal s overflow-hidden. */}
                <span className="overflow-hidden transition-[translate] duration-500 ease-[cubic-bezier(0.33,1,0.68,1)] group-hover:translate-x-2">
                  <span className="mobile-menu-reveal block">
                    <span className="block transition-colors duration-500 ease-[cubic-bezier(0.33,1,0.68,1)] group-hover:text-[#a5a5a2] group-active:text-[#a5a5a2]">
                      {label}
                    </span>
                  </span>
                </span>
                <span className="mobile-menu-fade">
                  <Arrow
                    className="brightness-0 invert transition-[rotate] duration-500 ease-[cubic-bezier(0.33,1,0.68,1)] group-hover:rotate-45 group-active:rotate-45"
                    size={18}
                  />
                </span>
                <span
                  aria-hidden="true"
                  className="mobile-menu-line absolute inset-x-0 bottom-0 h-px bg-[#30302e]"
                />
              </a>
            ),
          )}
        </nav>
        {/* Kontakty a sociální sítě dole v menu */}
        <div
          className="mobile-menu-fade mt-10 flex flex-col gap-3"
          style={{ "--item-delay": "450ms" } as CSSProperties}
        >
          <a className="text-lg text-[#f1f0ec] transition-colors duration-500 hover:text-[#a5a5a2]" href={`tel:${contact.phone.replace(/\s/g, "")}`}>
            {contact.phone}
          </a>
          <a className="text-sm text-[#a5a5a2] transition-colors duration-500 hover:text-[#f1f0ec]" href={`mailto:${contact.email}`}>
            {contact.email}
          </a>
          <div className="mt-6 flex gap-3 text-[#f1f0ec]">
            {socialLinks.map(({ label, href, icon }) => (
              <a
                aria-label={label}
                className={`${fillHoverClass} flex h-11 w-11 items-center justify-center rounded-full border before:bg-[#f1f0ec] hover:text-[#080808] focus-visible:text-[#080808]`}
                href={href}
                key={label}
                rel="noopener noreferrer"
                target="_blank"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  {icon}
                </svg>
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default SiteNav;
