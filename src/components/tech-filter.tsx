"use client";

import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

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
    <div className="glass sticky top-4 z-40 mb-10 rounded-2xl p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-center gap-2">
        {allTechs.map((tech) => {
          const isActive = selectedTechs.has(tech);
          return (
            <motion.button
              key={tech}
              type="button"
              onClick={() => onToggle(tech)}
              layout
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-medium transition-colors duration-200 cursor-pointer",
                "border",
                isActive
                  ? "bg-accent/20 text-accent border-accent/30 dark:bg-accent/15 dark:border-accent/25 shadow-sm shadow-accent/10"
                  : "bg-transparent text-muted border-card-border hover:text-foreground hover:border-foreground/20",
              )}
            >
              {tech}
            </motion.button>
          );
        })}
        <AnimatePresence>
          {hasFilter && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              type="button"
              onClick={onReset}
              className="ml-2 text-xs text-muted underline underline-offset-2 hover:text-foreground transition-colors cursor-pointer"
            >
              초기화
            </motion.button>
          )}
        </AnimatePresence>
      </div>
      <AnimatePresence>
        {hasFilter && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 text-center text-xs text-muted"
          >
            <span className="font-semibold text-accent">{resultCount}</span>
            /{totalCount}개 프로젝트
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
