"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/app/components/ui/accordion";

function CornerMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      className={className}
      aria-hidden="true"
    >
      <path d="M7 0V14" />
      <path d="M0 7H14" />
    </svg>
  );
}

export function FAQ() {
  const t = useTranslations("FAQ");
  const faqs = t.raw("items") as Array<{ q: string; a: string }>;

  return (
    <section id="faq" className="py-20 sm:py-32 px-4 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative border-y border-neutral-800"
        >
          <CornerMark className="pointer-events-none absolute -left-px -top-px h-3.5 w-3.5 text-neutral-700" />
          <CornerMark className="pointer-events-none absolute -right-px -top-px h-3.5 w-3.5 text-neutral-700" />
          <CornerMark className="pointer-events-none absolute -bottom-px -left-px h-3.5 w-3.5 text-neutral-700" />
          <CornerMark className="pointer-events-none absolute -bottom-px -right-px h-3.5 w-3.5 text-neutral-700" />

          <div className="grid md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
            <div className="relative md:border-r border-neutral-800 px-6 sm:px-10 py-10 md:py-14 flex items-start">
              <h2 className="font-sans font-semibold tracking-tight text-3xl sm:text-4xl text-neutral-100 leading-none">
                {t("heading")}
              </h2>
            </div>

            <div>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((item, i) => (
                  <AccordionItem
                    key={i}
                    value={`item-${i}`}
                    className={
                      i === 0
                        ? "border-t-0"
                        : "border-neutral-800"
                    }
                  >
                    <AccordionTrigger className="px-6 sm:px-10">
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="px-6 sm:px-10">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
