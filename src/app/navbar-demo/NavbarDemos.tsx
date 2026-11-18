"use client";

// TEMPORARY: navbar design options to compare. Delete this folder
// (src/app/navbar-demo) once a variant is chosen.

import Image from "next/image";
import { type ReactNode, useRef, useState } from "react";
import { fillHoverClass } from "@/components/shared";

const links = ["Domů", "O mně", "Služby", "Projekty"];

const Logo = ({ size = 30 }: { size?: number }) => (
  <Image src="/Osobní značka.svg" alt="Honza" width={size} height={size} />
);

const Dot = () => (
  <span className="relative flex h-2 w-2">
    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#4ade80] opacity-60" />
    <span className="relative inline-flex h-2 w-2 rounded-full bg-[#4ade80]" />
  </span>
);

// A slice of the hero behind each variant, so the nav is seen in context.
const Stage = ({ title, note, children }: { title: string; note: string; children: ReactNode }) => (
  <section className="border-b border-[#30302e] py-16">
    <div className="mb-6 px-[5.56vw]">
      <h2 className="m-0 font-mono text-xs uppercase tracking-wide text-[#a5a5a2]">{title}</h2>
      <p className="m-0 mt-2 max-w-160 text-sm text-[#727270]">{note}</p>
    </div>
    <div className="relative mx-[5.56vw] h-72 overflow-hidden rounded-2xl border border-[#30302e] bg-[#080808]">
      <div className="pointer-events-none absolute inset-x-10 bottom-8 select-none text-[clamp(2.5rem,7vw,6rem)] font-medium leading-none tracking-[-.06em] text-[#f1f0ec]/90">
        AHOJ, JSEM HONZA
      </div>
      <div className="absolute inset-x-0 top-0">{children}</div>
    </div>
  </section>
);

// A: what the site has now.
const Current = () => (
  <div className="flex justify-center pt-6">
    <div className="flex items-center gap-4 rounded-full bg-[#141414]/70 py-2.5 pl-9 pr-6 text-base font-medium shadow-[inset_0_1px_0_rgb(255_255_255/0.06)] backdrop-blur-xl">
      <Logo />
      <div className="flex items-center gap-7 px-3">
        {links.map((label) => (
          <a className="transition-colors duration-500 hover:text-[#a5a5a2]" href="#" key={label}>
            {label}
          </a>
        ))}
      </div>
      <a className={`${fillHoverClass} rounded-full bg-[#1f1f1f] px-5 py-2.5 before:bg-[#f1f0ec] hover:text-[#080808]`} href="#">
        Napište mi
      </a>
    </div>
  </div>
);

// B: glass pill with a highlight that glides to the hovered link.
const GlidingGlass = () => {
  const listRef = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState<{ left: number; width: number } | null>(null);
  const [active, setActive] = useState(0);

  const moveTo = (element: HTMLElement) => {
    setBox({ left: element.offsetLeft, width: element.offsetWidth });
  };

  return (
    <div className="flex justify-center pt-6">
      <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] p-1.5 text-[0.9375rem] font-medium shadow-[inset_0_1px_0_rgb(255_255_255/0.12),0_12px_32px_-12px_rgb(0_0_0/0.8)] backdrop-blur-xl">
        <span className="flex h-10 w-10 items-center justify-center">
          <Logo size={24} />
        </span>
        <div
          className="relative flex"
          ref={listRef}
          onMouseLeave={() => {
            const current = listRef.current?.children[active + 1] as HTMLElement | undefined;
            if (current) moveTo(current);
          }}
        >
          <span
            aria-hidden="true"
            className="absolute inset-y-0 rounded-full border border-white/15 bg-white/[0.08] shadow-[inset_0_1px_0_rgb(255_255_255/0.2)] transition-[left,width,opacity] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
            style={{ left: box?.left ?? 0, width: box?.width ?? 0, opacity: box ? 1 : 0 }}
          />
          {links.map((label, index) => (
            <a
              className={`relative rounded-full px-4 py-2.5 transition-colors duration-500 ${index === active ? "text-[#f1f0ec]" : "text-[#a5a5a2] hover:text-[#f1f0ec]"}`}
              href="#"
              key={label}
              onClick={(event) => {
                event.preventDefault();
                setActive(index);
              }}
              onMouseEnter={(event) => moveTo(event.currentTarget)}
            >
              {label}
            </a>
          ))}
        </div>
        <a className="rounded-full bg-[#f1f0ec] px-5 py-2.5 text-[#080808] transition-opacity duration-500 hover:opacity-85" href="#">
          Napište mi
        </a>
      </div>
    </div>
  );
};

// C: full width, nothing boxed in. Logo left, links in the middle with an
// underline that grows on hover, availability and contact on the right.
const Split = () => (
  <div className="flex items-center justify-between px-10 pt-7 text-[0.9375rem] font-medium">
    <span className="flex items-center gap-3">
      <Logo />
      <span className="text-sm text-[#a5a5a2]">Honza — Plzeň</span>
    </span>
    <div className="flex gap-9">
      {links.map((label) => (
        <a
          className="group relative py-1 text-[#a5a5a2] transition-colors duration-500 hover:text-[#f1f0ec]"
          href="#"
          key={label}
        >
          {label}
          <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-[#f1f0ec] transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-x-100" />
        </a>
      ))}
    </div>
    <span className="flex items-center gap-5">
      <span className="flex items-center gap-2.5 text-sm text-[#a5a5a2]">
        <Dot /> K dispozici
      </span>
      <a className={`${fillHoverClass} rounded-full border border-[#30302e] px-5 py-2.5 before:bg-[#f1f0ec] hover:text-[#080808]`} href="#">
        Napište mi
      </a>
    </span>
  </div>
);

// D: three separate floating glass pills: logo, links, contact.
const Islands = () => {
  const glass =
    "rounded-full border border-white/10 bg-white/[0.04] shadow-[inset_0_1px_0_rgb(255_255_255/0.12)] backdrop-blur-xl";

  return (
    <div className="flex items-center justify-between px-8 pt-6 text-[0.9375rem] font-medium">
      <span className={`${glass} flex h-13 w-13 items-center justify-center`}>
        <Logo size={26} />
      </span>
      <div className={`${glass} flex gap-1 p-1.5`}>
        {links.map((label) => (
          <a
            className="rounded-full px-4 py-2.5 text-[#a5a5a2] transition-[color,background-color] duration-500 hover:bg-white/[0.07] hover:text-[#f1f0ec]"
            href="#"
            key={label}
          >
            {label}
          </a>
        ))}
      </div>
      <a className={`${glass} flex h-13 items-center gap-3 px-5 transition-colors duration-500 hover:bg-white/[0.08]`} href="#">
        <Dot /> Napište mi
      </a>
    </div>
  );
};

// E: minimal. Logo and a "Menu" button that opens a full-screen panel.
const Minimal = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="relative z-10 flex items-center justify-between px-10 pt-7 text-[0.9375rem] font-medium">
        <Logo />
        <span className="hidden items-center gap-2.5 font-mono text-xs uppercase tracking-wide text-[#a5a5a2] sm:flex">
          <Dot /> Právě k dispozici
        </span>
        <button
          className="group flex items-center gap-3 rounded-full border border-[#30302e] py-2 pl-5 pr-2 transition-colors duration-500 hover:border-[#f1f0ec]"
          type="button"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? "Zavřít" : "Menu"}
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f1f0ec] text-[#080808]">
            <span className={`text-lg leading-none transition-transform duration-500 ${open ? "rotate-45" : ""}`}>+</span>
          </span>
        </button>
      </div>
      <div
        className={`absolute inset-x-0 top-0 h-72 bg-[#111] px-10 pt-24 transition-[clip-path] duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] ${
          open ? "[clip-path:inset(0_0_0_0)]" : "[clip-path:inset(0_0_100%_0)]"
        }`}
      >
        <div className="flex gap-10 text-4xl font-medium tracking-[-.04em]">
          {[...links, "Kontakt"].map((label) => (
            <a className="transition-colors duration-500 hover:text-[#a5a5a2]" href="#" key={label}>
              {label}
            </a>
          ))}
        </div>
      </div>
    </>
  );
};

const NavbarDemos = () => (
  <main className="min-h-svh bg-[#080808] pb-24 pt-10">
    <header className="px-[5.56vw] pb-6">
      <h1 className="m-0 text-4xl font-medium tracking-[-.04em]">Návrhy navbaru</h1>
      <p className="m-0 mt-3 text-[#a5a5a2]">Najeď na ně kurzorem. Varianta E se otevře kliknutím na „Menu“.</p>
    </header>
    <Stage title="A — Současný" note="Pilulka uprostřed: logo, odkazy a tlačítko.">
      <Current />
    </Stage>
    <Stage title="B — Skleněná pilulka s jezdcem" note="Stejné rozložení, ale ze skla. Pod kurzorem se mezi odkazy plynule posouvá skleněné zvýraznění, kliknutím se označí aktivní sekce. Ladí s novým hoverem u nástrojů.">
      <GlidingGlass />
    </Stage>
    <Stage title="C — Přes celou šířku" note="Nic v rámečku, působí volněji a víc „studiově“. Pod odkazy se při najetí vykreslí linka, vpravo je zelená tečka dostupnosti.">
      <Split />
    </Stage>
    <Stage title="D — Tři ostrůvky" note="Logo, odkazy a kontakt jako tři samostatné skleněné pilulky. Moderní a čisté, logo i tlačítko mají vlastní místo.">
      <Islands />
    </Stage>
    <Stage title="E — Minimalistický" note="Jen logo, info o dostupnosti a tlačítko Menu, které otevře velký panel s odkazy. Nejvíc místa pro obsah, typické pro portfolia.">
      <Minimal />
    </Stage>
  </main>
);

export default NavbarDemos;
