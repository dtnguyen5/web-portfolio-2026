"use client";

import Image from "next/image";
import { CSSProperties, useEffect, useState } from "react";
import { contact } from "@/data/portfolio";
import Arrow from "./Arrow";
import { fillHoverClass, socialLinks } from "./shared";

const navLinkClass =
  "transition-colors duration-500 ease-in-out hover:text-[#a5a5a2]";

type SiteNavProps = {
  // Prefix for the section anchors, "/" on pages other than the home page.
  base?: string;
};

const SiteNav = ({ base = "" }: SiteNavProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [navCompact, setNavCompact] = useState(false);
  const [navActive, setNavActive] = useState(false);
  const links = [
    ["Domů", `${base}#domu`],
    ["O mně", `${base}#o-mne`],
    ["Služby", `${base}#sluzby`],
    ["Projekty", `${base}#projekty`],
  ];

  useEffect(() => {
    let frame = 0;
    let lastY = window.scrollY;

    // The desktop nav shrinks to the logo and button while scrolling down and
    // opens again on scrolling up or near the top of the page.
    const update = () => {
      frame = 0;
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

    // The page underneath must not scroll while the mobile menu is open.
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
      <nav className="hero-reveal fixed inset-x-0 top-0 z-70 flex items-center justify-between bg-[#080808]/80 px-6 py-4 backdrop-blur-md sm:top-8 sm:h-19 sm:justify-center sm:bg-transparent sm:px-[5.56vw] sm:py-0 sm:backdrop-blur-none">
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
        {/* While compact only the logo and button show; hovering or
            focusing the pill opens the links again. */}
        <div
          className={`hidden items-center gap-4 rounded-full border border-[#1f1f1f] bg-[#080808] py-2.5 text-base font-medium text-[#f1f0ec] transition-[padding] duration-600 ease-[cubic-bezier(0.65,0,0.35,1)] sm:flex ${
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
          <a href={`${base}#domu`} aria-label="Domů">
            <Image
              src="/Osobní značka.svg"
              alt="Honza"
              width={30}
              height={30}
            />
          </a>
          <div
            className={`grid transition-[grid-template-columns,opacity] duration-600 ease-[cubic-bezier(0.65,0,0.35,1)] ${
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
        <button
          className="flex h-11 w-11 items-center justify-center rounded-full border border-[#f5f2e9] sm:hidden"
          type="button"
          onClick={() => setMenuOpen((isOpen) => !isOpen)}
          aria-label={menuOpen ? "Zavřít menu" : "Otevřít menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
        >
          {/* The two lines turn into a cross while the menu is open. */}
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
      {/* The panel grows as a circle out of the burger button, then the
          links rise from behind a mask like the hero headline. */}
      <div
        className={`mobile-menu fixed inset-0 z-60 flex flex-col overflow-y-auto bg-[#080808] px-6 pb-10 pt-4 sm:hidden ${
          menuOpen ? "is-open" : ""
        }`}
        id="mobile-menu"
        inert={!menuOpen}
        data-lenis-prevent
      >
        {/* Space for the fixed nav bar, whose logo and button stay on top of the menu. */}
        <div className="h-11 shrink-0" aria-hidden="true" />
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
                <span className="overflow-hidden">
                  <span className="mobile-menu-reveal block">
                    <span className="block transition-[color,translate] duration-500 ease-[cubic-bezier(0.33,1,0.68,1)] group-hover:translate-x-2 group-hover:text-[#a5a5a2] group-active:text-[#a5a5a2]">
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
