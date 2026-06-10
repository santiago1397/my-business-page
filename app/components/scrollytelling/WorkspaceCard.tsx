"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";

interface WorkspaceCardProps {
  progress: MotionValue<number>;
}

export function WorkspaceCard({ progress }: WorkspaceCardProps) {
  // The folder fades in just before the cards start flying in, stays for the fold
  const opacity = useTransform(
    progress,
    [0.46, 0.52, 0.80, 0.86],
    [0, 1, 1, 0]
  );

  // The 3D perspective rotates as the cards come in (matches save.design's rotateX(-65+59*x) trick)
  const folderRotateX = useTransform(progress, [0.46, 0.80], [65, 6]);

  return (
    <motion.div
      style={{ opacity }}
      className="absolute left-1/2 bottom-[3%] -translate-x-1/2 z-10"
    >
      {/* Folder — 3D perspective wrapper that opens as cards come in */}
      <div
        className="relative w-[min(78vw,640px)] h-[min(36vh,360px)]"
        style={{ perspective: "1400px" }}
      >
        <motion.div
          className="relative w-full h-full origin-bottom"
          style={{
            transformStyle: "preserve-3d",
            rotateX: folderRotateX,
            willChange: "transform",
          }}
        >
          {/* Folder body (frosted glass) */}
          <div
            className="absolute inset-0 rounded-t-md border border-neutral-200/40 dark:border-neutral-700/50 shadow-2xl overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.45)",
              backdropFilter: "blur(10px) saturate(140%)",
              WebkitBackdropFilter: "blur(10px) saturate(140%)",
            }}
          >
            {/* Folder tab on top (the manila-folder protrusion) */}
            <div
              className="absolute -top-3 left-8 w-32 h-3 rounded-t-md border border-neutral-200/40 dark:border-neutral-700/50 border-b-0"
              style={{
                background: "rgba(255,255,255,0.55)",
                backdropFilter: "blur(10px) saturate(140%)",
                WebkitBackdropFilter: "blur(10px) saturate(140%)",
              }}
            />

            {/* Subtle radial highlight (matches original) */}
            <div
              className="absolute inset-0 pointer-events-none rounded-t-md"
              style={{
                background:
                  "radial-gradient(ellipse 120% 80% at 50% 100%, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 40%, transparent 80%)",
                zIndex: 30,
              }}
            />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
