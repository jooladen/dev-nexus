import { getDb } from "@/db";
import { projects } from "@/db/schema";
import { ProjectGrid } from "@/components/project-grid";
import { ThemeToggle } from "@/components/theme-toggle";
import { HeroSection } from "@/components/hero-section";
import { Github, Mail, ArrowUpRight } from "lucide-react";

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
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Theme Toggle */}
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      {/* Hero */}
      <HeroSection
        projectCount={allProjects.length}
        techCount={techCount}
      />

      {/* Project Grid with Filter */}
      <ProjectGrid projects={allProjects} />

      {/* Footer */}
      <footer className="mt-24 mb-8">
        {/* CTA */}
        <div className="glass mx-auto max-w-2xl rounded-2xl p-8 text-center sm:p-10">
          <h2 className="mb-3 text-xl font-bold text-foreground sm:text-2xl">
            함께 일하고 싶다면
          </h2>
          <p className="mb-6 text-sm text-muted">
            새로운 프로젝트, 협업, 또는 그냥 커피 한잔도 좋습니다.
          </p>
          <a
            href="mailto:hello@example.com"
            className="inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-accent/20"
            style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-secondary))" }}
          >
            이메일 보내기
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>

        {/* Bottom */}
        <div className="mt-10 flex flex-col items-center gap-4">
          <div className="flex items-center gap-3">
            <a
              href="https://github.com/example"
              target="_blank"
              rel="noopener noreferrer"
              className="glass rounded-full p-3 text-muted transition-all duration-300 hover:text-foreground hover:scale-110"
              aria-label="GitHub 프로필"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href="mailto:hello@example.com"
              className="glass rounded-full p-3 text-muted transition-all duration-300 hover:text-foreground hover:scale-110"
              aria-label="이메일 보내기"
            >
              <Mail className="h-5 w-5" />
            </a>
          </div>
          <p className="text-xs text-muted">
            {allProjects.length}개의 프로젝트 &middot; 계속 만드는 중
          </p>
        </div>
      </footer>
    </main>
  );
}
