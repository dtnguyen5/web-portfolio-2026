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

const findProject = (slug: string) =>
  projects.find((project) => project.slug === slug && project.detail);

export const generateStaticParams = () =>
  projects
    .filter((project) => project.detail)
    .map((project) => ({ slug: project.slug }));

export const generateMetadata = async ({
  params,
}: PageProps<"/projekty/[slug]">): Promise<Metadata> => {
  const project = findProject((await params).slug);

  return project
    ? { title: `${project.name} — Honza`, description: project.detail?.description }
    : {};
};

// Reads the URL inside Suspense, so the nav and footer show instantly on navigation.
const ProjectContent = async ({ params }: { params: Params }) => {
  const project = findProject((await params).slug);

  if (!project?.detail) {
    notFound();
  }

  // Keyed by project, so switching projects remounts the page and its reveal animations.
  return (
    <ProjectDetail
      key={project.slug}
      project={{ ...project, detail: project.detail }}
    />
  );
};

const ProjectPage = ({ params }: PageProps<"/projekty/[slug]">) => (
  <>
    <SmoothCursor />
    <SmoothScroll />
    <main className="overflow-x-clip">
      <SiteNav base="/" />
      <Suspense fallback={<div className="min-h-svh bg-[#080808]" />}>
        <ProjectContent params={params} />
      </Suspense>
      <SiteFooter />
    </main>
  </>
);

export default ProjectPage;
