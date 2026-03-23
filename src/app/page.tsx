import { getDb } from "@/db";
import { projects } from "@/db/schema";
import { ProjectGrid } from "@/components/project-grid";
import { ThemeToggle } from "@/components/theme-toggle";
import { Github, Mail } from "lucide-react";

export const dynamic = "force-dynamic";

function getTechCount(techStacks: string[][]) {
  const unique = new Set(techStacks.flat());
  return unique.size;
}

export default async function Home() {
  const db = getDb();
  const allProjects = await db.select().from(projects);
  const techCount = getTechCount(allProjects.map((p) => p.techStack));

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
            {allProjects.length}개 프로젝트
          </span>
          , 각각의 이유와 인사이트.
        </p>
        <div className="mx-auto mt-6 h-px w-24 bg-gradient-to-r from-transparent via-accent to-transparent" />
        <p className="mt-4 text-xs text-muted">
          {techCount}+ Technologies &middot; {allProjects.length} Projects &middot;
          Full-Stack
        </p>
      </header>

      {/* Project Grid with Filter */}
      <ProjectGrid projects={allProjects} />

      {/* Footer */}
      <footer className="mt-20 text-center">
        <p className="text-sm text-muted">
          총 {allProjects.length}개의 프로젝트 &middot; 계속 늘어나는 중
        </p>
        <div className="mt-4 flex items-center justify-center gap-4">
          <a
            href="https://github.com/example"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg p-2 text-muted transition-colors hover:text-foreground"
            aria-label="GitHub 프로필"
          >
            <Github className="h-4 w-4" />
          </a>
          <a
            href="mailto:hello@example.com"
            className="rounded-lg p-2 text-muted transition-colors hover:text-foreground"
            aria-label="이메일 보내기"
          >
            <Mail className="h-4 w-4" />
          </a>
        </div>
      </footer>
    </main>
  );
}
