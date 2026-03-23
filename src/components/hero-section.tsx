"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

type HeroSectionProps = {
  projectCount: number;
  techCount: number;
};

function CountUp({ target, duration = 1.5 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const increment = target / (duration * 60);
    let rafId: number;

    function step() {
      start += increment;
      if (start >= target) {
        setCount(target);
        return;
      }
      setCount(Math.floor(start));
      rafId = requestAnimationFrame(step);
    }

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [isInView, target, duration]);

  return <span ref={ref}>{count}</span>;
}

export function HeroSection({ projectCount, techCount }: HeroSectionProps) {
  return (
    <header className="relative mb-6 overflow-hidden rounded-3xl py-10 sm:py-14">
      <div className="hero-bg" aria-hidden="true">
        <div className="hero-orb" />
      </div>

      <div className="relative z-10 text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-4 text-sm font-semibold tracking-[0.25em] text-accent uppercase"
        >
          Vibe Coding Lab
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mb-6 text-6xl font-black tracking-tight sm:text-7xl lg:text-8xl"
        >
          <span className="gradient-text">Dev-Nexus</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed text-muted sm:text-xl"
        >
          만들고 싶은 걸 만들다 보니 여기까지.{" "}
          <span className="font-semibold text-foreground">
            <CountUp target={projectCount} />개 프로젝트
          </span>
          , 각각의 이유와 인사이트.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="flex items-center justify-center gap-3 text-xs text-muted"
        >
          <span className="rounded-full border border-card-border bg-card/50 px-4 py-1.5 backdrop-blur-sm">
            <span className="font-semibold text-accent"><CountUp target={techCount} />+</span> Technologies
          </span>
          <span className="rounded-full border border-card-border bg-card/50 px-4 py-1.5 backdrop-blur-sm">
            <span className="font-semibold text-accent"><CountUp target={projectCount} /></span> Projects
          </span>
          <span className="rounded-full border border-card-border bg-card/50 px-4 py-1.5 backdrop-blur-sm">
            Full-Stack
          </span>
        </motion.div>
      </div>
    </header>
  );
}
