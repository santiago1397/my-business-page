import { Logo } from "./Logo";
import { ScrambleReveal } from "./ScrambleReveal";
import { Linkedin, Mail } from "lucide-react";
import { getTranslations } from "next-intl/server";

const techBadges = [
  { label: "Next.js" },
  { label: "Three.js" },
  { label: "TypeScript" },
  { label: "Vercel" },
];

export async function Footer() {
  const t = await getTranslations("Footer");

  return (
    <footer className="border-t border-neutral-200 dark:border-neutral-800 bg-[#F3F3F3] dark:bg-[#0a0a0a]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="space-y-3">
            <Logo />
            <p className="text-xs text-neutral-500 max-w-xs leading-relaxed">
              {t("tagline")}
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <div className="text-xs uppercase tracking-wider text-neutral-400">
              {t("contact")}
            </div>
            <address className="not-italic text-sm text-neutral-600 dark:text-neutral-400 space-y-1 leading-relaxed">
              <a
                href="tel:+584126080650"
                className="block hover:text-brand-purple transition-colors"
              >
                +58 412 608 0650
              </a>
              <a
                href="mailto:info@villahermosaos.com"
                className="block hover:text-brand-purple transition-colors"
              >
                info@villahermosaos.com
              </a>
              <span className="block">
                Av. Sur 17, Edificio El Puente, Piso 2, Apto. 2
                <br />
                Zona La Candelaria, Caracas
                <br />
                Distrito Capital 1010, Venezuela
              </span>
            </address>
          </div>
          <div className="flex flex-col gap-3">
            <div className="text-xs uppercase tracking-wider text-neutral-400">
              {t("connect")}
            </div>
            <div className="flex items-center gap-2">
              <a
                href="#"
                aria-label={t("linkedin")}
                className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-brand-purple hover:border-brand-purple transition-colors"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                href="mailto:info@villahermosaos.com"
                aria-label={t("email")}
                className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-brand-purple hover:border-brand-purple transition-colors"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-6 md:flex-row md:items-center md:justify-between pt-6 border-t border-neutral-200 dark:border-neutral-800">
          <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-500">
            <span>{t("copyright")}</span>
            <span className="text-neutral-300 dark:text-neutral-700">·</span>
            <ScrambleReveal text={t("founded")} flag="🇻🇪" />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {techBadges.map((b) => (
              <span
                key={b.label}
                className="font-mono text-[10px] tracking-wider uppercase px-2 py-1 border border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400"
              >
                {b.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
