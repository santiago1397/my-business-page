"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { SubmitDialog } from "./SubmitDialog";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { Button } from "@/app/components/ui/button";
import { cn } from "@/app/lib/utils";

export function Header() {
  const t = useTranslations("Header");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { href: "#features", label: t("navServices"), className: "" },
    { href: "#manifesto", label: t("navManifesto"), className: "hidden md:inline" },
    { href: "#faq", label: t("navFaq"), className: "hidden md:inline" },
  ];

  return (
    <nav
      className={cn(
        "fixed z-50 inset-x-0 mx-auto transition-all duration-300 ease-out",
        scrolled
          ? "scale-[0.98] bg-zinc-950/60 backdrop-blur-md border border-zinc-700/50 rounded-sm"
          : "scale-100 bg-transparent border border-transparent"
      )}
      style={{
        top: `calc(var(--promo-banner-h, 0px) + ${scrolled ? 12 : 0}px)`,
        maxWidth: scrolled ? "min(680px, 100% - 2rem)" : "100%",
        width: "100%",
      }}
    >
      <div className="flex h-16 items-center justify-between px-4 md:px-6 gap-2">
        <div className="flex items-center gap-6 flex-shrink-0">
          <Link
            href="/"
            aria-label={t("home")}
            className="relative flex items-center gap-2 flex-shrink-0"
          >
            <svg
              viewBox="0 0 32 32"
              className="h-8 w-8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <rect width="32" height="32" rx="7" fill="#0a0a0a" />
              <path
                d="M8 9 L8 23 L12 23 L12 14 L20 23 L24 23 L24 9 L20 9 L20 18 L12 9 Z"
                fill="#AD46FB"
              />
            </svg>
            <span className="absolute -bottom-1 -right-3 bg-background/55 backdrop-blur-sm text-brand-purple text-[10px] font-mono px-1 py-0.5 border border-zinc-700/50 rounded-sm">
              {t("yearBadge")}
            </span>
          </Link>
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "font-mono text-xs text-muted-foreground hover:text-foreground transition-colors",
                l.className
              )}
            >
              {l.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
          <LocaleSwitcher />
          <SubmitDialog />
          <Button asChild variant="default" size="sm" className="h-8 rounded-sm font-mono text-xs">
            <a href="mailto:info@santiagoproperties.uk?subject=New%20project">{t("startProject")}</a>
          </Button>
        </div>
      </div>
    </nav>
  );
}
