/* =============================================================================
 * LAYOUT.TSX – kostra celého webu
 * -----------------------------------------------------------------------------
 * Obaluje každou stránku (úvodní i detail projektu): <html>, <body>, fonty,
 * globální styly a titulek stránky pro Google / záložku prohlížeče.
 * ========================================================================== */

import type { Metadata } from "next";
import type { ReactNode } from "react";
import { IBM_Plex_Mono, Inter } from "next/font/google";
import RevealDone from "@/components/RevealDone";
import "./globals.css"; // Tailwind
import "./styles.scss"; // vlastní styly a animace

/* --- Fonty (stahují se z Google Fonts při buildu, ne v prohlížeči) --- */

// Inter – hlavní písmo (nadpisy, text). latin-ext kvůli češtině (ř, ě, ů…)
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
});
// IBM Plex Mono – strojové písmo na drobné popisky („O MNĚ“, „01 / 03“…)
const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

/* --- Titulek a popis stránky (záložka prohlížeče, Google, sdílení) --- */
export const metadata: Metadata = {
  title: "Honza — Web designér a developer",
  description: "Portfolio Nguyen Duy Tiep — web design, development a grafika.",
};

/* --- Samotná kostra --- */
const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <html
      lang="cs"
      className={`${inter.variable} ${plexMono.variable} h-full antialiased`}
    >
      {/* Tmavé pozadí a světlý text pro celý web */}
      <body className="min-h-full bg-[#080808] font-sans text-[#f1f0ec]">
        {/* Hlídá, aby se úvodní animace nepřehrávaly znovu při návratu zpět */}
        <RevealDone />
        {/* Sem se vloží obsah konkrétní stránky (page.tsx) */}
        {children}
      </body>
    </html>
  );
};

export default RootLayout;
