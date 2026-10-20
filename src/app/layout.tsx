import type { Metadata } from "next";
import type { ReactNode } from "react";
import { IBM_Plex_Mono, Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
});
const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Honza — Web designér a developer",
  description: "Portfolio Nguyen Duy Tiep — web design, development a grafika.",
};

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <html
      lang="cs"
      className={`${inter.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[#080808] font-sans text-[#f1f0ec]">
        {children}
      </body>
    </html>
  );
};

export default RootLayout;
