import type { Project } from "@/types/project";
import { cn } from "@/lib/utils";
import { getTechGradientCSS } from "@/lib/tech-colors";
import { ExternalLink, Sparkles } from "lucide-react";

type ProjectCardProps = {
  project: Project;
  className?: string;
  isSelf?: boolean;
};

export function ProjectCard({ project, className, isSelf }: ProjectCardProps) {
  const gradientCSS = getTechGradientCSS(project.techStack[0] ?? "");

  return (
    <article
      className={cn(
        "glass group relative flex h-full flex-col rounded-2xl p-6 transition-all duration-500",
        "hover:-translate-y-1 hover:scale-[1.02]",
        isSelf && "ring-1 ring-accent/30",
        className,
      )}
    >
      <div className="card-gradient-bar" style={{ background: isSelf ? "linear-gradient(135deg, var(--accent), var(--accent-secondary), #22d3ee)" : gradientCSS }} />

      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center gap-2">
          {isSelf && <Sparkles className="h-4 w-4 text-accent" />}
          <h3 className="text-lg font-bold tracking-tight text-foreground">{project.title}</h3>
        </div>
        <a
          href={project.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 rounded-lg p-2 text-muted transition-colors hover:bg-black/5 dark:hover:bg-white/5 hover:text-accent"
          aria-label={`${project.title} GitHub 링크`}
        >
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>

      {isSelf && (
        <p className="mb-3 text-xs font-medium text-accent">You are here</p>
      )}

      <p className="mb-3 line-clamp-2 text-sm leading-relaxed text-muted italic">{project.motivation}</p>
      <p className="mb-4 line-clamp-1 text-sm font-medium leading-relaxed text-foreground">{project.outcome}</p>

      <div className="mb-4 flex flex-wrap gap-1.5">
        {project.features.map((feature) => (
          <span key={feature} className="rounded-full border border-card-border px-2.5 py-0.5 text-xs text-muted">
            {feature}
          </span>
        ))}
      </div>

      <div className="mt-auto border-t border-card-border pt-3">
        <div className="flex flex-wrap gap-1.5">
          {project.techStack.map((tech) => (
            <span key={tech} className="rounded-full bg-badge-bg px-2.5 py-0.5 text-[11px] font-medium font-mono tracking-wide text-badge-text">
              {tech}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}
