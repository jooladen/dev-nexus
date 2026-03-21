import { projects } from "@/data/projects";
import { ProjectCard } from "@/components/project-card";
import { ProjectGrid } from "@/components/project-grid";
import { ThemeToggle } from "@/components/theme-toggle";

const FEATURED_COUNT = 10;
const GRID_COUNT = 10;

export default function Home() {
  const featured = projects.slice(0, FEATURED_COUNT);
  const grid = projects.slice(FEATURED_COUNT, FEATURED_COUNT + GRID_COUNT);

  return (
    <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Theme Toggle */}
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      {/* Hero */}
      <header className="mb-20 text-center">
        <p className="mb-3 text-sm font-medium tracking-widest text-accent uppercase">
          20 Years of Engineering
        </p>
        <h1 className="mb-4 text-5xl font-bold tracking-tight text-foreground sm:text-6xl">
          Dev-Nexus
        </h1>
        <p className="mx-auto max-w-2xl text-lg leading-relaxed text-muted">
          풀스택, AI, 인프라, 금융, IoT —{" "}
          <span className="text-foreground font-medium">50개 프로젝트</span>로
          보는 20년의 개발 여정
        </p>
        <div className="mx-auto mt-6 h-px w-24 bg-gradient-to-r from-transparent via-accent to-transparent" />
      </header>

      {/* Featured Cards */}
      <section className="mb-20">
        <h2 className="mb-8 text-sm font-medium tracking-widest text-muted uppercase">
          Featured Projects
        </h2>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>

      {/* Compact Grid */}
      <section>
        <h2 className="mb-8 text-sm font-medium tracking-widest text-muted uppercase">
          More Projects
        </h2>
        <ProjectGrid projects={grid} />
      </section>

      {/* Footer */}
      <footer className="mt-20 text-center">
        <p className="text-sm text-muted">
          총 {projects.length}개 프로젝트 &middot; 2005 — 2026
        </p>
      </footer>
    </main>
  );
}
