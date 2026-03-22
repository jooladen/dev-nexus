"use client";

import { cn } from "@/lib/utils";

type TechFilterProps = {
  allTechs: string[];
  selectedTechs: Set<string>;
  onToggle: (tech: string) => void;
  onReset: () => void;
  resultCount: number;
  totalCount: number;
};

export function TechFilter({
  allTechs,
  selectedTechs,
  onToggle,
  onReset,
  resultCount,
  totalCount,
}: TechFilterProps) {
  const hasFilter = selectedTechs.size > 0;

  return (
    <div className="mb-10">
      <div className="flex flex-wrap items-center justify-center gap-2">
        {allTechs.map((tech) => {
          const isActive = selectedTechs.has(tech);
          return (
            <button
              key={tech}
              type="button"
              onClick={() => onToggle(tech)}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-200 cursor-pointer",
                "border",
                isActive
                  ? "bg-accent/20 text-accent border-accent/30 dark:bg-accent/15 dark:border-accent/25"
                  : "bg-transparent text-muted border-card-border hover:text-foreground hover:border-foreground/20",
              )}
            >
              {tech}
            </button>
          );
        })}
        {hasFilter && (
          <button
            type="button"
            onClick={onReset}
            className="ml-2 text-xs text-muted underline underline-offset-2 hover:text-foreground transition-colors cursor-pointer"
          >
            초기화
          </button>
        )}
      </div>
      {hasFilter && (
        <p className="mt-3 text-center text-xs text-muted">
          {resultCount}/{totalCount}개 프로젝트
        </p>
      )}
    </div>
  );
}
