"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useTranslations } from "next-intl";

type PhaseMotionValues = {
  opacity: MotionValue<number>;
  y: MotionValue<number>;
  scale: MotionValue<number>;
  filter: MotionValue<string>;
};

// All phase motion values are computed via this hook at the top of the
// component, in a fixed order. Calling useTransform inside a map/callback
// would violate the Rules of Hooks (the order must be deterministic across
// renders), so each phase's transforms are extracted here.
function usePhaseMotionValues(
  progress: MotionValue<number>,
  range: [number, number],
  fadeOutSpan: number,
  intro?: "welcome",
): PhaseMotionValues {
  const [s, e] = range;
  const mid = s + (e - s) * 0.25;
  const fadeIn = Math.min(0.04, (e - s) * 0.4);
  const isWelcome = intro === "welcome";

  const opacity = useTransform(
    progress,
    fadeOutSpan > 0
      ? [s, s + fadeIn, e, e + fadeOutSpan]
      : [s, s + fadeIn],
    fadeOutSpan > 0 ? [0, 1, 1, 0] : [0, 1],
  );
  const y = useTransform(
    progress,
    [s, mid],
    isWelcome ? [0, 0] : [40, 0],
  );
  const scale = useTransform(
    progress,
    [s, mid],
    isWelcome ? [3, 1] : [0.95, 1],
  );
  const blur = useTransform(
    progress,
    [s, mid],
    isWelcome ? [12, 0] : [0, 0],
  );
  const filter = useTransform(blur, (b) => `blur(${b}px)`);

  return { opacity, y, scale, filter };
}

export function BrowserSequence() {
  const t = useTranslations("BrowserSequence");
  const ref = useRef<HTMLDivElement>(null);
  // SSR-safe reduced-motion check. We deliberately avoid framer-motion's
  // useReducedMotion: its internal `useState(prefersReducedMotion.current)`
  // initializer is `null` on the server and the actual value on the client,
  // which produced a React #418 hydration mismatch for users with the OS
  // "reduce motion" preference on.
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const frameY = useTransform(scrollYProgress, [0, 0.18], [120, 0]);
  const frameScale = useTransform(scrollYProgress, [0, 0.18], [0.78, 1]);
  const bgScale = useTransform(scrollYProgress, [0, 0.1875], [0.92, 1.08]);

  // Pre-compute all six phase motion values at the top, in declaration order,
  // so the hook list stays stable across renders.
  const p1 = usePhaseMotionValues(scrollYProgress, [0.08, 0.22], 0.04, "welcome");
  const p2 = usePhaseMotionValues(scrollYProgress, [0.22, 0.36], 0.04);
  const p3 = usePhaseMotionValues(scrollYProgress, [0.36, 0.5], 0.04);
  const p4 = usePhaseMotionValues(scrollYProgress, [0.5, 0.66], 0.04);
  const p5 = usePhaseMotionValues(scrollYProgress, [0.66, 0.82], 0.04);
  const p6 = usePhaseMotionValues(scrollYProgress, [0.82, 1.0], 0);

  if (reduced) {
    return (
      <section className="mx-auto max-w-3xl px-6 py-20 space-y-10 text-center">
        <p className="text-4xl font-mono tracking-widest">{t("reduced.brand")}</p>
        <p className="text-neutral-500">{t("reduced.tagline")}</p>
      </section>
    );
  }

  return (
    <section
      ref={ref}
      className="relative w-full h-[500vh]"
      aria-label="Villahermosa Open Solutions F.P. intro sequence"
    >
      {/* Sticky stage */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <motion.div
          style={{
            scale: bgScale,
            transformOrigin: "center center",
            backgroundImage: "url(/images/hero-bg.webp)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          className="absolute inset-0"
        />
        <motion.div
          style={{
            y: frameY,
            scale: frameScale,
            transformOrigin: "bottom center",
          }}
          className="relative flex h-full w-full items-center justify-center px-4 py-8 lg:px-6"
        >
          <div className="w-full max-w-7xl border border-zinc-800 bg-zinc-950 rounded-sm overflow-hidden shadow-2xl">
            <div className="flex h-10 items-center justify-between border-b border-zinc-800 bg-zinc-900 px-4">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-zinc-600" />
                <span className="h-3 w-3 rounded-full bg-zinc-600" />
                <span className="h-3 w-3 rounded-full bg-zinc-600" />
              </div>
              <span className="font-mono text-xs text-zinc-400">
                {t("titleBar")}
              </span>
              <div className="w-16" />
            </div>

            <div className="relative h-[420px] lg:h-[560px] bg-zinc-950 overflow-hidden">
              <PhaseShell mv={p1} className="text-4xl md:text-6xl lg:text-6xl font-normal tracking-tight text-zinc-100">
                {t("welcome")}
              </PhaseShell>
              <PhaseShell mv={p2} className="text-3xl md:text-5xl lg:text-6xl font-mono text-zinc-100" style={{ letterSpacing: "0.1em" }}>
                {t("brand")}
              </PhaseShell>
              <PhaseShell mv={p3} className="text-2xl md:text-3xl lg:text-4xl font-normal tracking-tight text-zinc-500">
                {t("teamFor")}
              </PhaseShell>
              <SnakeDesigners opacity={p4.opacity} text={t("snakeText")} />
              <PhaseShell mv={p5} className="text-xl md:text-2xl lg:text-3xl font-normal tracking-tight text-zinc-100">
                {t.rich("andBuilders", {
                  accent: (chunks) => (
                    <span className="font-pixel-square" style={{ opacity: 0.4 }}>
                      {chunks}
                    </span>
                  ),
                })}
              </PhaseShell>
              <PhaseShell mv={p6} className="text-xl md:text-3xl lg:text-4xl font-normal tracking-tight text-white">
                {t("weAllShare")}
              </PhaseShell>

              <KeepScrolling progress={scrollYProgress} label={t("keepScrolling")} />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function PhaseShell({
  mv,
  children,
  className,
  style,
}: {
  mv: PhaseMotionValues;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <motion.p
      style={{
        opacity: mv.opacity,
        y: mv.y,
        scale: mv.scale,
        filter: mv.filter,
        willChange: "transform, opacity, filter",
        ...style,
      }}
      className={`absolute inset-0 flex items-center justify-center px-6 md:px-12 text-center leading-[1.1] max-w-4xl m-auto whitespace-pre-line ${className ?? ""}`}
    >
      {children}
    </motion.p>
  );
}

function SnakeDesigners({ opacity, text }: { opacity: MotionValue<number>; text: string }) {
  return (
    <motion.div
      style={{ opacity }}
      className="absolute inset-0 pointer-events-none"
    >
      <svg
        viewBox="0 0 1000 500"
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <defs>
          <path
            id="snake-curve"
            d="M -200 -30 C 0 80, 50 280, 280 320 S 750 180, 850 380 C 900 460, 1000 520, 1200 530"
            fill="none"
          />
        </defs>
        <text
          className="fill-zinc-700"
          style={{
            fontSize: 96,
            fontWeight: 500,
            letterSpacing: "-0.02em",
          }}
        >
          <textPath href="#snake-curve" startOffset="0%">
            {text}
          </textPath>
        </text>
      </svg>
    </motion.div>
  );
}

function KeepScrolling({ progress, label }: { progress: MotionValue<number>; label: string }) {
  const opacity = useTransform(progress, [0.05, 0.12, 0.18], [0, 1, 0]);
  return (
    <motion.div
      style={{ opacity }}
      className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 font-mono text-xs text-zinc-500"
    >
      <span>{label}</span>
      <motion.span
        animate={{ y: [0, 4, 0] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
      >
        ↓
      </motion.span>
    </motion.div>
  );
}
