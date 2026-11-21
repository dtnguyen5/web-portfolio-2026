/* =============================================================================
 * PROJEKTY/[SLUG]/PAGE.TSX – detail projektu (např. /projekty/zadyfit)
 * -----------------------------------------------------------------------------
 * [slug] v názvu složky = proměnná část adresy. Pro každý projekt, který má
 * v data/portfolio.ts vyplněné `detail`, se při buildu vytvoří vlastní stránka.
 * Obsah detailu vykresluje komponenta ProjectDetail.
 * ========================================================================== */

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import ProjectDetail from "@/components/ProjectDetail";
import SiteFooter from "@/components/SiteFooter";
import SiteNav from "@/components/SiteNav";
import SmoothCursor from "@/components/SmoothCursor";
import SmoothScroll from "@/components/SmoothScroll";
import { projects } from "@/data/portfolio";

type Params = PageProps<"/projekty/[slug]">["params"];

/* --- Pomocné funkce --- */

// Najde projekt podle adresy. Projekt bez `detail` se bere jako neexistující.
const findProject = (slug: string) =>
  projects.find((project) => project.slug === slug && project.detail);

// Seznam adres, které se mají předgenerovat při buildu (jedna za každý projekt s detailem)
export const generateStaticParams = () =>
  projects
    .filter((project) => project.detail)
    .map((project) => ({ slug: project.slug }));

// Titulek a popis stránky v záložce / na Googlu, např. „ZadyFit — Honza“
export const generateMetadata = async ({
  params,
}: PageProps<"/projekty/[slug]">): Promise<Metadata> => {
  const project = findProject((await params).slug);

  return project
    ? { title: `${project.name} — Honza`, description: project.detail?.description }
    : {};
};

/* --- Obsah detailu --- */

// Čte adresu uvnitř Suspense, takže navigace a patička se při přechodu
// zobrazí okamžitě a obsah projektu se doplní hned za nimi.
const ProjectContent = async ({ params }: { params: Params }) => {
  const project = findProject((await params).slug);

  // Neexistující projekt → stránka 404
  if (!project?.detail) {
    notFound();
  }

  // key podle projektu: při přepnutí na jiný projekt se stránka postaví znovu
  // a její animace se přehrají od začátku.
  return (
    <ProjectDetail
      key={project.slug}
      project={{ ...project, detail: project.detail }}
    />
  );
};

/* --- Celá stránka: kurzor, plynulý scroll, navigace, obsah, patička --- */
const ProjectPage = ({ params }: PageProps<"/projekty/[slug]">) => (
  <>
    <SmoothCursor />
    <SmoothScroll />
    <main className="overflow-x-clip">
      {/* base="/" → odkazy v menu vedou zpátky na úvodní stránku (/#o-mne…) */}
      <SiteNav base="/" />
      {/* Než se obsah načte, drží místo tmavý prázdný blok na výšku obrazovky */}
      <Suspense fallback={<div className="min-h-svh bg-[#080808]" />}>
        <ProjectContent params={params} />
      </Suspense>
      <SiteFooter />
    </main>
  </>
);

export default ProjectPage;
