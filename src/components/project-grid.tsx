"use client";

import { useMemo, useState, useCallback } from "react";
import type { Project } from "@/types/project";
import { ProjectCard } from "@/components/project-card";
import { TechFilter } from "@/components/tech-filter";

const MIN_PROJECT_COUNT = 2;

type ProjectGridProps = {
  projects: Project[];
};

export function ProjectGrid({ projects }: ProjectGridProps) {
  const [selectedTechs, setSelectedTechs] = useState<Set<string>>(new Set());

  const allTechs = useMemo(() => {
    const techCount = new Map<string, number>();
    for (const project of projects) {
      for (const tech of project.techStack) {
        techCount.set(tech, (techCount.get(tech) ?? 0) + 1);
      }
    }

    return Array.from(techCount.entries())
      .filter(([, count]) => count >= MIN_PROJECT_COUNT)
      .sort((a, b) => b[1] - a[1])
      .map(([tech]) => tech);
  }, [projects]);

  const filteredProjects = useMemo(() => {
    if (selectedTechs.size === 0) return projects;
    return projects.filter((p) =>
      p.techStack.some((tech) => selectedTechs.has(tech)),
    );
  }, [projects, selectedTechs]);

  const handleToggle = useCallback((tech: string) => {
    setSelectedTechs((prev) => {
      const next = new Set(prev);
      if (next.has(tech)) {
        next.delete(tech);
      } else {
        next.add(tech);
      }
      return next;
    });
  }, []);

  const handleReset = useCallback(() => {
    setSelectedTechs(new Set());
  }, []);

  return (
    <section>
      <TechFilter
        allTechs={allTechs}
        selectedTechs={selectedTechs}
        onToggle={handleToggle}
        onReset={handleReset}
        resultCount={filteredProjects.length}
        totalCount={projects.length}
      />

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))
        ) : (
          <div className="col-span-full py-20 text-center">
            <p className="text-muted">
              선택한 기술을 사용한 프로젝트가 없습니다.
            </p>
            <button
              type="button"
              onClick={handleReset}
              className="mt-3 text-sm text-accent underline underline-offset-2 hover:text-accent/80 transition-colors cursor-pointer"
            >
              필터 초기화
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
