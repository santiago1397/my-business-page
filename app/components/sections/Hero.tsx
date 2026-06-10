"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

export function Hero() {
  const t = useTranslations("Hero");

  return (
    <section className="relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 px-8 pt-28 pb-4 lg:pb-8 lg:px-10"
      >
        <div>
          <div className="overflow-hidden">
            <motion.h1
              initial={{ y: 40 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-[clamp(1.75rem,4vw,2.625rem)] font-normal leading-[1.1] tracking-[-0.02em]"
            >
              {t.rich("headline", {
                accent: (chunks) => (
                  <span className="font-pixel-square">{chunks}</span>
                ),
              })}
            </motion.h1>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-6 max-w-md text-sm leading-relaxed text-neutral-500 dark:text-neutral-400"
          >
            {t("subtitle")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.6 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <a
              href="mailto:info@santiagoproperties.uk?subject=New%20project"
              className="inline-flex h-10 items-center justify-center rounded-sm bg-neutral-900 px-6 font-mono text-xs text-white transition-all duration-150 hover:bg-neutral-800 active:scale-[0.98] dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-200"
            >
              {t("startProject")}
            </a>
            <a
              href="#features"
              className="inline-flex h-10 items-center justify-center rounded-sm border border-neutral-200 bg-transparent px-6 font-mono text-xs text-neutral-900 transition-all duration-150 hover:bg-neutral-100 active:scale-[0.98] dark:border-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-900"
            >
              {t("ourServices")}
            </a>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
