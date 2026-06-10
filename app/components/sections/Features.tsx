"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Workflow, CodeXml, ArrowUpRight } from "lucide-react";

const introIcons = [Workflow, CodeXml, ArrowUpRight];

const BRAND_LABEL = "Villahermosa Open Solutions F.P.";

const featureImages = [
  {
    src: "/1_aww.png",
    alt: "Interactive marketing website with scroll-driven 3D and gradient hero",
  },
  {
    src: "/2_web.png",
    alt: "Dark mode SaaS admin dashboard with KPIs, charts, and data table",
  },
  {
    src: "/3_crm.png",
    alt: "AI agent automation interface connected to a CRM workflow",
  },
  {
    src: "/4_agents.webp",
    alt: "Voice AI agent call interface with live transcript and controls",
  },
  {
    src: "/5_rag.jpg",
    alt: "RAG-powered document search and chat interface with citations",
  },
];

function BrowserMockup({
  imageSrc,
  imageAlt,
}: {
  imageSrc: string;
  imageAlt: string;
}) {
  return (
    <div className="w-full h-full flex flex-col border border-neutral-800 bg-zinc-900">
      <div className="flex h-10 items-center justify-between border-b border-neutral-800 bg-black px-4">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 border border-neutral-700" />
          <span className="h-3 w-3 border border-neutral-700" />
          <span className="h-3 w-3 border border-neutral-700" />
        </div>
        <span className="font-mono text-xs text-neutral-500/70 tracking-wide">
          {BRAND_LABEL}
        </span>
        <div className="w-16" />
      </div>
      <div className="flex-1 relative overflow-hidden bg-zinc-900">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          sizes="(min-width: 1024px) 60vw, 100vw"
          className="object-cover"
        />
      </div>
    </div>
  );
}

function FeatureBlockRow({
  title,
  paragraphs,
  ctaLabel,
  index,
  hasCta,
  imageSrc,
  imageAlt,
}: {
  title: string;
  paragraphs: string[];
  ctaLabel: string;
  index: number;
  hasCta: boolean;
  imageSrc: string;
  imageAlt: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const textOnLeft = index % 2 === 0;

  return (
    <section
      ref={ref}
      className="border-t border-neutral-800 relative bg-black"
    >
      {/* Diamond marker at top border, offset toward the column boundary */}
      <div className="hidden lg:block absolute inset-0 pointer-events-none z-10">
        <div
          className="absolute w-2.5 h-2.5 border border-neutral-800 bg-black rotate-45 -translate-x-1/2 -translate-y-1/2"
          style={{
            left: textOnLeft
              ? "calc(-1px - 13.3333rem + 50vw)"
              : "calc(-1px + 13.3333rem + 50vw)",
            top: 0,
          }}
        />
      </div>

      {textOnLeft ? (
        // narrow-left text + wide-right mockup
        <div className="grid lg:grid-cols-[calc(50vw-80rem/6-1px)_1fr]">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col justify-center px-5 py-16 lg:py-24 lg:pl-8 lg:pr-12"
          >
            <h2 className="mb-6 text-2xl font-normal tracking-tight lg:text-3xl font-pixel-square text-neutral-100">
              {title}
            </h2>
            <div className="space-y-4 text-sm text-neutral-400">
              {paragraphs.map((p, i) => (
                <p key={i} className="leading-relaxed font-mono">
                  {p}
                </p>
              ))}
            </div>
            {hasCta && (
              <div className="mt-8">
                <a
                  href="mailto:info@santiagoproperties.uk?subject=New%20project"
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-mono transition-all duration-150 active:scale-[0.98] h-10 px-6 text-xs rounded-sm border border-neutral-700 bg-black hover:bg-neutral-900 text-neutral-100"
                >
                  {ctaLabel}
                </a>
              </div>
            )}
          </motion.div>

          <div className="relative bg-zinc-900 lg:border-l border-neutral-800">
            <div className="relative aspect-[4/3] w-full lg:aspect-auto lg:h-full lg:min-h-[600px] flex items-center justify-center p-4 lg:p-8">
              <BrowserMockup imageSrc={imageSrc} imageAlt={imageAlt} />
            </div>
          </div>
        </div>
      ) : (
        // wide-left mockup + narrow-right text (use direction: rtl trick)
        <div className="grid lg:grid-cols-[1fr_calc(50vw+80rem/6-1px)] lg:[direction:rtl]">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col justify-center px-5 py-16 lg:py-24 lg:[direction:ltr] lg:pl-12 lg:pr-8"
          >
            <h2 className="mb-6 text-2xl font-normal tracking-tight lg:text-3xl font-pixel-square text-neutral-100">
              {title}
            </h2>
            <div className="space-y-4 text-sm text-neutral-400">
              {paragraphs.map((p, i) => (
                <p key={i} className="leading-relaxed font-mono">
                  {p}
                </p>
              ))}
            </div>
            {hasCta && (
              <div className="mt-8">
                <a
                  href="mailto:info@santiagoproperties.uk?subject=New%20project"
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-mono transition-all duration-150 active:scale-[0.98] h-10 px-6 text-xs rounded-sm border border-neutral-700 bg-black hover:bg-neutral-900 text-neutral-100"
                >
                  {ctaLabel}
                </a>
              </div>
            )}
          </motion.div>

          <div className="relative bg-zinc-900 lg:[direction:ltr] lg:border-r border-neutral-800">
            <div className="relative aspect-[4/3] w-full lg:aspect-auto lg:h-full lg:min-h-[600px] flex items-center justify-center p-4 lg:p-8">
              <BrowserMockup imageSrc={imageSrc} imageAlt={imageAlt} />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export function Features() {
  const t = useTranslations("Features");
  const introItems = t.raw("intro") as Array<{ title: string; desc: string }>;
  const blocks = t.raw("blocks") as Array<{
    title: string;
    paragraphs: string[];
    ctaLabel: string;
  }>;

  return (
    <div id="features" className="relative w-full bg-black text-neutral-100">
      {/* Top three-column intro */}
      <section className="border-t border-neutral-800">
        <div className="grid grid-cols-1 md:grid-cols-3">
          {introItems.map((item, i) => {
            const Icon = introIcons[i] ?? ArrowUpRight;
            return (
              <div
                key={item.title}
                className={`px-6 py-12 lg:px-10 lg:py-16 ${
                  i > 0 ? "md:border-l md:border-neutral-800" : ""
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-neutral-800 bg-black text-neutral-100">
                    <Icon className="h-5 w-5" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="font-pixel-square text-lg text-neutral-100 leading-snug">
                      {item.title}
                    </h3>
                    <p className="mt-2 font-mono text-sm text-neutral-400 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Alternating feature blocks */}
      {blocks.map((b, i) => (
        <FeatureBlockRow
          key={b.title}
          title={b.title}
          paragraphs={b.paragraphs}
          ctaLabel={b.ctaLabel}
          index={i}
          hasCta={i === 0}
          imageSrc={featureImages[i].src}
          imageAlt={featureImages[i].alt}
        />
      ))}

      {/* Bottom border to close the last section */}
      <div className="border-t border-neutral-800" />
    </div>
  );
}
