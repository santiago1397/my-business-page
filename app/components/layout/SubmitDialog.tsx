"use client";

import { Rocket, MessageCircleQuestion, ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";

export function SubmitDialog() {
  const t = useTranslations("SubmitDialog");

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 rounded-sm font-mono text-xs border-zinc-700/50">
          {t("contact")}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {t("title")}
          </DialogTitle>
          <DialogDescription>
            {t("subtitle")}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-2 pt-2">
          <a
            href="mailto:info@santiagoproperties.uk?subject=New%20project"
            className="group flex items-center gap-3 rounded-lg border border-neutral-200 dark:border-neutral-800 p-4 hover:border-brand-purple hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-all"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-brand-purple/10 text-brand-purple">
              <Rocket className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <div className="font-medium text-sm">{t("startProject")}</div>
              <div className="text-xs text-neutral-500">
                {t("startProjectDesc")}
              </div>
            </div>
            <ArrowUpRight className="h-4 w-4 text-neutral-400 group-hover:text-brand-purple group-hover:rotate-45 transition-all" />
          </a>
          <a
            href="mailto:info@santiagoproperties.uk?subject=Question"
            className="group flex items-center gap-3 rounded-lg border border-neutral-200 dark:border-neutral-800 p-4 hover:border-brand-mint hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-all"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-brand-mint/10 text-brand-mint">
              <MessageCircleQuestion className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <div className="font-medium text-sm">{t("askQuestion")}</div>
              <div className="text-xs text-neutral-500">
                {t("askQuestionDesc")}
              </div>
            </div>
            <ArrowUpRight className="h-4 w-4 text-neutral-400 group-hover:text-brand-mint group-hover:rotate-45 transition-all" />
          </a>
        </div>
      </DialogContent>
    </Dialog>
  );
}
