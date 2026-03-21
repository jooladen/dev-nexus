import { projects } from "@/data/projects";
import { ProjectCard } from "@/components/project-card";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {

  return (
    <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Theme Toggle */}
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      {/* Hero */}
      <header className="mb-20 text-center">
        <p className="mb-3 text-sm font-medium tracking-widest text-accent uppercase">
          Vibe Coding Lab
        </p>
        <h1 className="mb-4 text-5xl font-bold tracking-tight text-foreground sm:text-6xl">
          Dev-Nexus
        </h1>
        <p className="mx-auto max-w-2xl text-lg leading-relaxed text-muted">
          만들고 싶은 걸 만들다 보니 여기까지.{" "}
          <span className="text-foreground font-medium">
            {projects.length}개 프로젝트
          </span>
          , 각각의 이유와 인사이트.
        </p>
        <div className="mx-auto mt-6 h-px w-24 bg-gradient-to-r from-transparent via-accent to-transparent" />
      </header>

      {/* Featured Cards */}
      <section>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-20 text-center">
        <p className="text-sm text-muted">
          총 {projects.length}개의 프로젝트 &middot; 계속 늘어나는 중
        </p>
      </footer>
    </main>
  );
}
