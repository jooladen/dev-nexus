import type { Project } from "@/types/project";
import { cn } from "@/lib/utils";
import { ExternalLink } from "lucide-react";

const STATUS_STYLES = {
  completed: { label: "완료", color: "bg-emerald-500" },
  "in-progress": { label: "진행중", color: "bg-yellow-500" },
  maintained: { label: "유지보수", color: "bg-blue-500" },
  archived: { label: "아카이브", color: "bg-gray-500" },
} as const;

type ProjectCardProps = {
  project: Project;
  className?: string;
};

export function ProjectCard({ project, className }: ProjectCardProps) {
  const status = STATUS_STYLES[project.status];

  return (
    <article
      className={cn(
        "glass group relative rounded-2xl p-6 transition-all duration-500",
        "hover:-translate-y-1",
        className,
      )}
    >
      <div className="mb-4 flex items-start justify-between">
        <div className="flex-1">
          <div className="mb-2 flex items-center gap-2">
            <span
              className={cn("h-2 w-2 rounded-full", status.color)}
              title={status.label}
            />
            <span className="text-xs tracking-wide text-muted uppercase">
              {status.label}
            </span>
          </div>
          <h3 className="text-lg font-semibold tracking-tight text-foreground">
            {project.title}
          </h3>
        </div>
        <a
          href={project.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg p-2 text-muted transition-colors hover:bg-black/5 dark:hover:bg-white/5 hover:text-foreground"
          aria-label={`${project.title} GitHub 링크`}
        >
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>

      <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-muted">
        {project.description}
      </p>

      <div className="mb-4 flex flex-wrap gap-1.5">
        {project.techStack.map((tech) => (
          <span
            key={tech}
            className="rounded-full bg-badge-bg px-2.5 py-0.5 text-xs font-medium text-badge-text"
          >
            {tech}
          </span>
        ))}
      </div>

      <div className="border-t border-card-border pt-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <p className="text-xs leading-relaxed text-accent italic">
          &ldquo;{project.insight}&rdquo;
        </p>
      </div>
    </article>
  );
}
