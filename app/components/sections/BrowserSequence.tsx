"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";
import { useTranslations } from "next-intl";

type Phase = {
  /** Scroll range [start, end] within the section (0–1). */
  range: [number, number];
  render: (p: MotionValue<number>) => React.ReactNode;
};

/**
 * Fade-in over the start of the range, hold visible all the way to `end`,
 * and only fade out across [end, end + fadeOutSpan]. When `fadeOutSpan` is 0,
 * the panel never fades out (useful for the final phrase).
 */
function usePanelOpacity(
  progress: MotionValue<number>,
  [start, end]: [number, number],
  fadeOutSpan = 0.04
) {
  const fadeIn = Math.min(0.04, (end - start) * 0.4);
  if (fadeOutSpan <= 0) {
    return useTransform(progress, [start, start + fadeIn], [0, 1]);
  }
  return useTransform(
    progress,
    [start, start + fadeIn, end, end + fadeOutSpan],
    [0, 1, 1, 0]
  );
}

export function BrowserSequence() {
  const t = useTranslations("BrowserSequence");
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const frameY = useTransform(scrollYProgress, [0, 0.18], [120, 0]);
  const frameScale = useTransform(scrollYProgress, [0, 0.18], [0.78, 1]);

  // Background image: starts slightly smaller (visible mountain margin) and
  // grows to full cover as the user scrolls into the section — parallax zoom.
  const bgScale = useTransform(scrollYProgress, [0, 0.1875], [0.92, 1.08]);

  // Phase ranges spread across the scroll (after the intro slide-up).
  const phases: Phase[] = [
    {
      range: [0.08, 0.22],
      render: (p) => (
        <PhaseText
          opacity={usePanelOpacity(p, [0.08, 0.22])}
          progress={p}
          range={[0.08, 0.22]}
          intro="welcome"
          className="text-4xl md:text-6xl lg:text-6xl font-normal tracking-tight text-zinc-100"
        >
          {t("welcome")}
        </PhaseText>
      ),
    },
    {
      range: [0.22, 0.36],
      render: (p) => (
        <PhaseText
          opacity={usePanelOpacity(p, [0.22, 0.36])}
          progress={p}
          range={[0.22, 0.36]}
          className="text-3xl md:text-5xl lg:text-6xl font-mono text-zinc-100"
          style={{ letterSpacing: "0.1em" }}
        >
          {t("brand")}
        </PhaseText>
      ),
    },
    {
      range: [0.36, 0.5],
      render: (p) => (
        <PhaseText
          opacity={usePanelOpacity(p, [0.36, 0.5])}
          progress={p}
          range={[0.36, 0.5]}
          className="text-2xl md:text-3xl lg:text-4xl font-normal tracking-tight text-zinc-500"
        >
          {t("teamFor")}
        </PhaseText>
      ),
    },
    {
      range: [0.5, 0.66],
      render: (p) => (
        <SnakeDesigners opacity={usePanelOpacity(p, [0.5, 0.66])} text={t("snakeText")} />
      ),
    },
    {
      range: [0.66, 0.82],
      render: (p) => (
        <PhaseText
          opacity={usePanelOpacity(p, [0.66, 0.82])}
          progress={p}
          range={[0.66, 0.82]}
          className="text-xl md:text-2xl lg:text-3xl font-normal tracking-tight text-zinc-100"
        >
          {t.rich("andBuilders", {
            accent: (chunks) => (
              <span className="font-pixel-square" style={{ opacity: 0.4 }}>
                {chunks}
              </span>
            ),
          })}
        </PhaseText>
      ),
    },
    {
      range: [0.82, 1.0],
      render: (p) => (
        <PhaseText
          opacity={usePanelOpacity(p, [0.82, 1.0], 0)}
          progress={p}
          range={[0.82, 1.0]}
          className="text-xl md:text-3xl lg:text-4xl font-normal tracking-tight text-white"
        >
          {t("weAllShare")}
        </PhaseText>
      ),
    },
  ];

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
        {/* Mountain background — stays positionally static, but scales up
            slightly as the user scrolls into the section (parallax zoom). */}
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
        {/* Browser frame */}
        <motion.div
          style={{
            y: frameY,
            scale: frameScale,
            transformOrigin: "bottom center",
          }}
          className="relative flex h-full w-full items-center justify-center px-4 py-8 lg:px-6"
        >
          <div className="w-full max-w-7xl border border-zinc-800 bg-zinc-950 rounded-sm overflow-hidden shadow-2xl">
            {/* Title bar */}
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

            {/* Stage area */}
            <div className="relative h-[420px] lg:h-[560px] bg-zinc-950 overflow-hidden">
              {phases.map((phase, i) => (
                <div
                  key={i}
                  className="absolute inset-0 flex items-center justify-center px-6 md:px-12"
                >
                  {phase.render(scrollYProgress)}
                </div>
              ))}

              {/* Keep scrolling hint — fades out once we're past the intro */}
              <KeepScrolling progress={scrollYProgress} label={t("keepScrolling")} />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ---------- Phase pieces ---------- */

function PhaseText({
  children,
  opacity,
  progress,
  range,
  className,
  style,
  intro,
}: {
  children: React.ReactNode;
  opacity: MotionValue<number>;
  progress: MotionValue<number>;
  range: [number, number];
  className?: string;
  style?: React.CSSProperties;
  /** "welcome" gets the zoom-in-from-3x blurred entrance from the reference. */
  intro?: "welcome";
}) {
  const [s, e] = range;
  const mid = s + (e - s) * 0.25;

  // Most phases: enter from y=28-40 + scale 0.95 → settle.
  const y = useTransform(progress, [s, mid], intro === "welcome" ? [0, 0] : [40, 0]);
  const scale = useTransform(
    progress,
    [s, mid],
    intro === "welcome" ? [3, 1] : [0.95, 1]
  );
  const blur = useTransform(progress, [s, mid], intro === "welcome" ? [12, 0] : [0, 0]);
  const filter = useTransform(blur, (b) => `blur(${b}px)`);

  return (
    <motion.p
      style={{
        opacity,
        y,
        scale,
        filter,
        willChange: "transform, opacity, filter",
        ...style,
      }}
      className={`text-center leading-[1.1] max-w-4xl whitespace-pre-line ${className ?? ""}`}
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
