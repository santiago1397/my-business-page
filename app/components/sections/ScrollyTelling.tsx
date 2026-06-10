"use client";

import { useEffect, useRef, useState } from "react";
import { useScroll } from "framer-motion";
import { useTranslations } from "next-intl";
import { PinnedSequence } from "../scrollytelling/PinnedSequence";
import { introPhases } from "@/app/lib/scrollytelling.config";

export function ScrollyTelling() {
  const t = useTranslations("Scrolly");
  const ref = useRef<HTMLDivElement>(null);
  // SSR-safe reduced-motion check. framer-motion's useReducedMotion
  // initializes its useState from prefersReducedMotion.current, which is
  // `null` on the server and the actual boolean on the client — that caused
  // a React #418 hydration mismatch for users with the OS reduce-motion
  // preference on. We mirror the preference ourselves, post-mount.
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

  if (reduced) {
    return (
      <section className="mx-auto max-w-3xl px-6 py-20 space-y-32">
        {introPhases.map((p, i) => (
          <div key={i} className="text-center text-3xl md:text-4xl font-medium">
            {p.wordKeys.map((k) => t(k)).join(" ")}
          </div>
        ))}
        <div className="text-center text-neutral-500 font-mono text-sm">
          {t("reducedFallback")}
        </div>
      </section>
    );
  }

  return (
    <section
      ref={ref}
      className="relative h-[330vh] w-full"
      aria-label="What is Villahermosa Open Solutions F.P."
    >
      <PinnedSequence progress={scrollYProgress} />
    </section>
  );
}
