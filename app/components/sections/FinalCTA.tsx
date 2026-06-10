"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { AsciiBackground } from "@/app/components/sections/AsciiBackground";

export function FinalCTA() {
  const t = useTranslations("FinalCTA");

  return (
    <section className="relative flex items-center justify-center overflow-hidden min-h-[50vh] border-t border-neutral-200 dark:border-neutral-800">
      <AsciiBackground />

      <div className="relative z-10 mx-auto w-full px-5 py-14 lg:py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8 }}
          className="mx-auto max-w-4xl"
        >
          <div className="flex flex-col items-center text-center">
            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="text-[clamp(1.75rem,4vw,2.625rem)] font-normal leading-[1.1] tracking-[-0.02em] whitespace-pre-line"
            >
              {t.rich("headline", {
                accent: (chunks) => (
                  <span className="font-pixel-square">{chunks}</span>
                ),
              })}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mt-4 mb-8 text-sm text-neutral-500 dark:text-neutral-400"
            >
              {t("subtitle")}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ delay: 0.35, duration: 0.6 }}
              className="flex flex-col gap-3 sm:flex-row"
            >
              <a
                href="mailto:info@santiagoproperties.uk?subject=New%20project"
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-mono transition-all duration-150 h-10 rounded-[2px] px-6 text-xs bg-brand-purple text-white hover:bg-brand-purple/90 active:scale-[0.98] backdrop-blur-sm"
              >
                {t("startProject")}
              </a>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
