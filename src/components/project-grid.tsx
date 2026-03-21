import type { Project } from "@/types/project";
import { cn } from "@/lib/utils";
import { ExternalLink } from "lucide-react";

const STATUS_DOT = {
  completed: "bg-emerald-500",
  "in-progress": "bg-yellow-500",
  maintained: "bg-blue-500",
  archived: "bg-gray-500",
} as const;

type ProjectGridProps = {
  projects: Project[];
  className?: string;
};

export function ProjectGrid({ projects, className }: ProjectGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5",
        className,
      )}
    >
      {projects.map((project) => (
        <a
          key={project.id}
          href={project.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="glass group rounded-xl p-4 transition-all duration-300 hover:-translate-y-0.5"
        >
          <div className="mb-2 flex items-center gap-2">
            <span
              className={cn(
                "h-1.5 w-1.5 rounded-full",
                STATUS_DOT[project.status],
              )}
            />
            <h4 className="truncate text-sm font-medium text-foreground">
              {project.title}
            </h4>
            <ExternalLink className="ml-auto h-3 w-3 shrink-0 text-muted opacity-0 transition-opacity group-hover:opacity-100" />
          </div>
          <div className="flex flex-wrap gap-1">
            {project.techStack.slice(0, 3).map((tech) => (
              <span
                key={tech}
                className="rounded-full bg-badge-bg px-2 py-0.5 text-[10px] font-medium text-badge-text"
              >
                {tech}
              </span>
            ))}
            {project.techStack.length > 3 && (
              <span className="text-[10px] text-muted">
                +{project.techStack.length - 3}
              </span>
            )}
          </div>
        </a>
      ))}
    </div>
  );
}
