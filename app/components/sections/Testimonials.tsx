"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import { useTranslations } from "next-intl";

type Platform = "linkedin" | "twitter";

interface Testimonial {
  name: string;
  role: string;
  quote: string;
  socialUrl?: string;
  platform?: Platform;
  websiteUrl?: string;
}

const AUTO_ADVANCE_MS = 5000;

function ChevronLeft() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <path d="M10 3L5 8L10 13" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <path d="M6 3L11 8L6 13" />
    </svg>
  );
}

function ArrowUpRight() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <path d="M6 3.5L11 3.5L11 8.5" />
      <path d="M11 3.5L5 9.5" />
    </svg>
  );
}

function DitherCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let raf = 0;
    let running = true;

    // 4x4 Bayer matrix for ordered dithering (values 0..15 normalized to 0..1)
    const bayer = [
      0, 8, 2, 10,
      12, 4, 14, 6,
      3, 11, 1, 9,
      15, 7, 13, 5,
    ].map((v) => (v + 0.5) / 16);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    };
    resize();

    // Off-screen low-res buffer for the dither — much cheaper than per-pixel work on the visible canvas.
    const scale = 4; // each "pixel" of the effect = 4 device pixels
    const buf = document.createElement("canvas");
    const bctx = buf.getContext("2d");
    if (!bctx) return;

    const setupBuffer = () => {
      buf.width = Math.max(2, Math.ceil(canvas.width / scale));
      buf.height = Math.max(2, Math.ceil(canvas.height / scale));
    };
    setupBuffer();

    const onResize = () => {
      resize();
      setupBuffer();
    };
    window.addEventListener("resize", onResize);

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const draw = (t: number) => {
      if (!running) return;
      const bw = buf.width;
      const bh = buf.height;
      const img = bctx.createImageData(bw, bh);
      const data = img.data;

      const time = t * 0.00015;
      const cx = bw * 0.5;
      const cy = bh * 0.5;
      const maxR = Math.hypot(cx, cy);

      for (let y = 0; y < bh; y++) {
        for (let x = 0; x < bw; x++) {
          // Two slowly drifting radial gradients + a sine wave — produces a smooth "field"
          const dx = x - cx;
          const dy = y - cy;
          const r = Math.hypot(dx, dy) / maxR;
          const wave =
            0.5 +
            0.5 *
              Math.sin(
                r * 6.0 - time * 4.0 + Math.sin((x + y) * 0.05 + time * 2.0)
              );
          const falloff = 1.0 - r * 0.85;
          const value = Math.max(0, Math.min(1, wave * falloff));

          // Ordered dither: threshold against Bayer matrix → binary on/off pixel
          const threshold = bayer[(x & 3) + (y & 3) * 4];
          const on = value > threshold;

          const i = (y * bw + x) * 4;
          if (on) {
            // Neutral monochrome — picks up via CSS opacity/blend
            data[i] = 220;
            data[i + 1] = 220;
            data[i + 2] = 230;
            data[i + 3] = 110;
          } else {
            data[i + 3] = 0;
          }
        }
      }

      bctx.putImageData(img, 0, 0);

      // Scale the buffer up to the visible canvas with nearest-neighbor for crisp dither dots.
      ctx.imageSmoothingEnabled = false;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(buf, 0, 0, canvas.width, canvas.height);

      if (!reduceMotion) raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full" />;
}

function SocialIcon({ platform }: { platform: Platform }) {
  if (platform === "linkedin") {
    return (
      <svg
        className="w-4 h-4"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    );
  }
  return (
    <svg
      className="w-4 h-4"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export function Testimonials() {
  const t = useTranslations("Testimonials");
  const cards = t.raw("cards") as Array<{ name: string; quote: string }>;
  const testimonials: Testimonial[] = cards.map((c) => ({
    name: c.name,
    role: "",
    quote: c.quote,
  }));
  const TRIPLE = [...testimonials, ...testimonials, ...testimonials];
  const TOTAL = testimonials.length;

  const sectionRef = useRef<HTMLElement>(null);
  const trackWrapRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const isHovered = useRef(false);

  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const inView = useInView(sectionRef, { once: true, margin: "-100px" });
  const controls = useAnimation();

  const measure = useCallback(() => {
    if (typeof window === "undefined" || !trackWrapRef.current) {
      return { width: 0, gap: 0 };
    }
    const parentWidth = trackWrapRef.current.clientWidth;
    const width = window.innerWidth >= 1024 ? parentWidth * 0.42 : parentWidth * 0.85;
    const gap = window.innerWidth >= 1024 ? 24 : 16;
    return { width, gap };
  }, []);

  const goTo = useCallback(
    (target: number, instant = false) => {
      const { width, gap } = measure();
      const offset = -(target * (width + gap));
      setProgress(0);
      setIndex(target);
      if (instant) {
        void controls.set({ x: offset });
      } else {
        void controls.start({
          x: offset,
          transition: { type: "spring", stiffness: 300, damping: 35, mass: 0.8 },
        });
      }
    },
    [controls, measure]
  );

  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  // Wrap after the spring settles so the carousel feels seamless.
  const handleAnimationComplete = useCallback(() => {
    if (isDragging.current) return;
    setIndex((current) => {
      if (current < 0) {
        goTo(current + TOTAL, true);
        return current;
      }
      if (current >= TOTAL) {
        goTo(current - TOTAL, true);
        return current;
      }
      return current;
    });
  }, [goTo, TOTAL]);

  // Initial position + reset on resize.
  useEffect(() => {
    goTo(0, true);
    const onResize = () => goTo(index, true);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Arrow key navigation.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!inView) return;
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [inView, next, prev]);

  // Auto-advance with progress fill.
  useEffect(() => {
    if (!inView || isHovered.current || isDragging.current) return;
    let frame = 0;
    let start: number | null = null;
    let cancelled = false;
    const tick = (t: number) => {
      if (cancelled) return;
      if (start === null) start = t;
      const ratio = Math.min((t - start) / AUTO_ADVANCE_MS, 1);
      setProgress(ratio);
      if (ratio >= 1) {
        next();
        return;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
    };
  }, [inView, index, next]);

  const handleDragEnd = (
    _e: unknown,
    info: { offset: { x: number }; velocity: { x: number } }
  ) => {
    isDragging.current = false;
    isHovered.current = false;
    setProgress(0);
    const { width } = measure();
    const flick = info.velocity.x > 300 ? 1 : info.velocity.x < -300 ? -1 : 0;
    const drag = flick || (Math.abs(info.offset.x) > width * 0.15 ? (info.offset.x > 0 ? -1 : 1) : 0);
    goTo(index + drag);
  };

  const displayIndex = ((index % TOTAL) + TOTAL) % TOTAL;

  return (
    <section
      id="manifesto"
      ref={sectionRef}
      className="border-t border-neutral-200 dark:border-neutral-800"
    >
      <style>{`:root{--testimonials-card-width:85vw;--testimonials-card-gap:16px}@media(min-width:1024px){:root{--testimonials-card-width:42vw;--testimonials-card-gap:24px}}`}</style>

      <div className="relative overflow-hidden py-16 lg:py-24">
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none will-change-transform">
          <div className="absolute inset-0 opacity-55 mix-blend-screen dark:mix-blend-screen">
            <DitherCanvas />
          </div>
          <div className="absolute inset-0 bg-[linear-gradient(to_top,var(--background),transparent_60%)]" />
        </div>

        <div className="relative z-20 px-5 lg:px-12 mb-12 lg:mb-16 flex items-end justify-between gap-6">
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-pixel-square text-2xl lg:text-4xl font-normal tracking-tight text-neutral-900 dark:text-neutral-100"
            >
              {t("heading")}
            </motion.h2>

            <div className="mt-4 flex items-center gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    isHovered.current = false;
                    goTo(i);
                  }}
                  aria-label={`${t("heading")} ${i + 1}`}
                  className="relative h-px w-8 bg-neutral-900/25 dark:bg-neutral-100/25 overflow-hidden hover:bg-neutral-900/40 dark:hover:bg-neutral-100/40 transition-colors"
                >
                  <div
                    className="absolute inset-y-0 left-0 bg-neutral-900 dark:bg-neutral-100"
                    style={{
                      width:
                        i === displayIndex
                          ? `${progress * 100}%`
                          : i < displayIndex
                          ? "100%"
                          : "0%",
                    }}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={prev}
              aria-label="Previous"
              className="w-10 h-10 border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-950/50 backdrop-blur-sm flex items-center justify-center text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:border-neutral-900 dark:hover:border-neutral-100 transition-colors"
            >
              <ChevronLeft />
            </button>
            <button
              onClick={next}
              aria-label="Next"
              className="w-10 h-10 border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-950/50 backdrop-blur-sm flex items-center justify-center text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:border-neutral-900 dark:hover:border-neutral-100 transition-colors"
            >
              <ChevronRight />
            </button>
          </div>
        </div>

        <div ref={trackWrapRef} className="overflow-hidden">
          <motion.div
            className="flex relative z-10 pl-5 lg:pl-12 cursor-grab active:cursor-grabbing"
            style={{ gap: "var(--testimonials-card-gap)" }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.1}
            onDragStart={() => {
              isDragging.current = true;
              isHovered.current = true;
            }}
            onDragEnd={handleDragEnd}
            onMouseEnter={() => (isHovered.current = true)}
            onMouseLeave={() => (isHovered.current = false)}
            onTouchStart={() => (isHovered.current = true)}
            onTouchEnd={() => (isHovered.current = false)}
            animate={controls}
            onAnimationComplete={handleAnimationComplete}
          >
            {TRIPLE.map((card, i) => {
              const cardNumber = String((i % TOTAL) + 1).padStart(2, "0");
              const cardTotal = String(TOTAL).padStart(2, "0");
              return (
                <blockquote
                  key={`${card.name}-${i}`}
                  className="shrink-0 select-none"
                  style={{ width: "var(--testimonials-card-width)" }}
                >
                  <div className="group/card relative h-full border border-neutral-200/60 dark:border-neutral-800/60 rounded-sm p-6 lg:p-8 flex flex-col justify-between overflow-hidden transition-all duration-300 bg-white/40 dark:bg-neutral-950/40 backdrop-blur-md min-h-[420px]">
                    <span
                      aria-hidden="true"
                      className="absolute top-3 right-7 lg:top-3 lg:right-7 font-pixel-square text-[120px] lg:text-[160px] leading-none select-none pointer-events-none text-neutral-900/[0.04] dark:text-neutral-100/[0.06]"
                    >
                      ”
                    </span>

                    <div className="relative">
                      <span className="font-mono text-xs text-neutral-500/60 dark:text-neutral-400/60 block mb-6 lg:mb-10">
                        {cardNumber} / {cardTotal}
                      </span>
                      <p className="font-pixel-square text-lg lg:text-xl leading-relaxed text-neutral-900/95 dark:text-neutral-100/95">
                        “{card.quote}”
                      </p>
                    </div>

                    <div className="relative mt-8 lg:mt-12 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="hidden lg:flex w-10 h-10 border border-neutral-200 dark:border-neutral-800 items-center justify-center">
                          <span className="font-mono text-sm text-neutral-500 dark:text-neutral-400">
                            {card.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <span className="font-mono text-sm font-medium block text-neutral-900 dark:text-neutral-100">
                            {card.name}
                          </span>
                          {card.role && (
                            <span className="font-mono text-xs text-neutral-500 dark:text-neutral-400 block mt-0.5">
                              {card.role}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        {card.websiteUrl && (
                          <a
                            href={card.websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`${card.name} website`}
                            className="w-10 h-10 border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-950/50 backdrop-blur-sm flex items-center justify-center text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:border-neutral-900 dark:hover:border-neutral-100 transition-colors"
                          >
                            <ArrowUpRight />
                          </a>
                        )}
                        {card.socialUrl && card.platform && (
                          <a
                            href={card.socialUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`${card.name} on ${card.platform}`}
                            className="w-10 h-10 border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-950/50 backdrop-blur-sm flex items-center justify-center text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:border-neutral-900 dark:hover:border-neutral-100 transition-colors"
                          >
                            <SocialIcon platform={card.platform} />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </blockquote>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
