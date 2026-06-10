"use client";

import { useLocale, useTranslations } from "next-intl";
import { useTransition } from "react";
import { LOCALES, LOCALE_COOKIE, type Locale } from "../../../i18n/config";
import { cn } from "@/app/lib/utils";

export function LocaleSwitcher() {
  const locale = useLocale() as Locale;
  const t = useTranslations("LocaleSwitcher");
  const [isPending, startTransition] = useTransition();

  const switchTo = (next: Locale) => {
    if (next === locale) return;
    document.cookie = `${LOCALE_COOKIE}=${next}; max-age=31536000; path=/; SameSite=Lax`;
    startTransition(() => {
      window.location.reload();
    });
  };

  return (
    <div
      role="group"
      aria-label={t("label")}
      className={cn(
        "inline-flex items-center h-8 rounded-sm border border-zinc-700/50 overflow-hidden font-mono text-[11px]",
        isPending && "opacity-60"
      )}
    >
      {LOCALES.map((l) => {
        const active = l === locale;
        return (
          <button
            key={l}
            type="button"
            onClick={() => switchTo(l)}
            aria-pressed={active}
            aria-label={t(l)}
            disabled={isPending}
            className={cn(
              "h-full px-2 transition-colors",
              active
                ? "bg-brand-purple text-white"
                : "text-muted-foreground hover:text-foreground hover:bg-neutral-900/40"
            )}
          >
            {l.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}
