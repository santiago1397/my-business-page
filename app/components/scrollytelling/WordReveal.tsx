"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";
import { useTranslations } from "next-intl";
import type { IntroPhase } from "@/app/lib/scrollytelling.config";

interface WordRevealProps {
  progress: MotionValue<number>;
  phases: IntroPhase[];
}

const sizeClass: Record<NonNullable<IntroPhase["size"]>, string> = {
  sm: "text-2xl md:text-3xl",
  md: "text-4xl md:text-5xl lg:text-6xl",
  lg: "text-5xl md:text-6xl lg:text-7xl",
  xl: "text-6xl md:text-7xl lg:text-8xl",
};

const accentClass: Record<NonNullable<IntroPhase["accent"]>, string> = {
  purple: "text-brand-purple",
  mint: "text-brand-mint",
  magenta: "text-brand-magenta",
  lime: "text-brand-lime",
};

export function WordReveal({ progress, phases }: WordRevealProps) {
  const t = useTranslations();

  return (
    <div className="absolute inset-0 flex items-center justify-center px-6">
      {phases.map((phase, i) => {
        const [start, end] = phase.range;
        // The phase is fully visible from fadeIn to fadeOutStart,
        // then fades to 0 by `end` so the next phase (or the demo) takes over cleanly.
        const fadeIn = start + 0.025;
        const fadeOutStart = Math.max(fadeIn, end - 0.05);
        const outEnd = end + 0.02;

        const opacity = useTransform(
          progress,
          [start, fadeIn, fadeOutStart, outEnd],
          [0, 1, 1, 0]
        );
        const y = useTransform(
          progress,
          [start, fadeIn, fadeOutStart, outEnd],
          [30, 0, 0, -20]
        );
        const scale = useTransform(
          progress,
          [start, fadeIn, fadeOutStart, outEnd],
          [0.96, 1, 1, 0.98]
        );

        return (
          <motion.h2
            key={i}
            style={{ opacity, y, scale }}
            className={`absolute inset-0 flex flex-col items-center justify-center font-sans font-medium tracking-tight ${
              sizeClass[phase.size ?? "md"]
            } ${phase.accent ? accentClass[phase.accent] : "text-white"}`}
          >
            {phase.wordKeys.map((key, j) => (
              <span key={j}>{t(key)}</span>
            ))}
          </motion.h2>
        );
      })}
    </div>
  );
}
