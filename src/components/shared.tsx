/* =============================================================================
 * SHARED – věci sdílené napříč komponentami
 * -----------------------------------------------------------------------------
 *   contentPadding  – boční okraje obsahu (stejné ve všech sekcích)
 *   fillHoverClass  – efekt „výplň zespodu“ při najetí myší na tlačítko
 *   socialLinks     – odkazy na sociální sítě (patička, mobilní menu)
 * ========================================================================== */

// Boční okraje sekcí: na mobilu 24 px, od tabletu 5,56 % šířky okna
export const contentPadding = "px-6 sm:px-[5.56vw]";

// Výplň, která se při hoveru zvedne zespodu (zaoblená vlna → rovná plocha).
// Barvu výplně přidej zvlášť třídou `before:bg-*`, např. before:bg-[#f1f0ec].
export const fillHoverClass =
  "relative isolate overflow-hidden transition-colors duration-600 ease-[cubic-bezier(0.33,1,0.68,1)] before:absolute before:inset-x-0 before:-bottom-1/4 before:-z-10 before:h-[150%] before:translate-y-full before:rounded-[50%_50%_0_0] before:transition-[translate,border-radius] before:duration-600 before:ease-[cubic-bezier(0.33,1,0.68,1)] hover:before:translate-y-0 hover:before:rounded-none focus-visible:before:translate-y-0 focus-visible:before:rounded-none";

// Sociální sítě. `icon` = vnitřek SVG ikony (obrys, kreslí se čarou).
// Novou síť přidáš dalším objektem se stejnou strukturou.
export const socialLinks = [
  /* --- Instagram --- */
  {
    label: "Instagram",
    href: "https://www.instagram.com/dtnguyen5_/",
    icon: (
      <>
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <path d="M17.5 6.5h.01" />
      </>
    ),
  },
  /* --- LinkedIn --- */
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/duy-tiep-nguyen-7325002a3/",
    icon: (
      <>
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </>
    ),
  },
  /* --- GitHub --- */
  {
    label: "GitHub",
    href: "https://github.com/dtnguyen5",
    icon: (
      <>
        <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
        <path d="M9 18c-4.51 2-5-2-7-2" />
      </>
    ),
  },
];
