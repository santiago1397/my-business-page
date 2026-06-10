"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";
import { WordReveal } from "./WordReveal";
import { FloatingCards } from "./FloatingCards";
import { introPhases } from "@/app/lib/scrollytelling.config";

interface PinnedSequenceProps {
  progress: MotionValue<number>;
}

export function PinnedSequence({ progress }: PinnedSequenceProps) {
  // Subtle background gradient that shifts through the scroll
  const bgOpacity = useTransform(
    progress,
    [0, 0.3, 0.7, 1],
    [0.4, 0.7, 0.7, 0.4]
  );

  return (
    <div className="sticky top-0 h-screen w-full overflow-hidden bg-neutral-950">
      {/* Dot grid background (matches save.design's subtle + pattern) */}
      <div
        className="absolute inset-0 -z-10 opacity-50"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.08) 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Background gradient layer */}
      <motion.div
        className="absolute inset-0 -z-10"
        style={{
          opacity: bgOpacity,
          background:
            "radial-gradient(circle at 30% 20%, rgba(173,70,251,0.15), transparent 50%), radial-gradient(circle at 70% 80%, rgba(87,240,226,0.10), transparent 50%)",
        }}
      />

      {/* Floating cards around the text, then flying into the folder */}
      <FloatingCards progress={progress} />

      <WordReveal progress={progress} phases={introPhases} />

      {/* Scroll hint at start */}
      <motion.div
        style={{ opacity: useTransform(progress, [0, 0.04], [1, 0]) }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-xs font-mono text-neutral-400 flex flex-col items-center gap-2 z-30"
      >
        <span>scroll</span>
        <motion.div
          animate={{ y: [0, 4, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          className="h-6 w-px bg-neutral-400"
        />
      </motion.div>
    </div>
  );
}
