"use client";

import React from "react";
import Link from "next/link";
import { SurangMark } from "./SurangMark";
import { useT } from "@/i18n/LanguageProvider";

/**
 * Brand lockup: mark + name + tagline, in the active language only.
 *
 * The mark is temporary. Its box is fixed at 40×40 (44×44 from md up) and the
 * text column sits beside it, so replacing the asset later is a one-file change
 * that cannot reflow the header.
 */
export function BrandLockup({ className }: { className?: string }) {
  const t = useT();

  return (
    <Link href="/" className={className} aria-label={t("brand.home")}>
      <span className="flex items-center gap-3 min-w-0">
        <span className="shrink-0 w-10 h-10 md:w-11 md:h-11" aria-hidden="true">
          <SurangMark className="w-full h-full" />
        </span>

        <span className="flex flex-col min-w-0 leading-none">
          <span className="text-[1.0625rem] md:text-[1.1875rem] font-bold tracking-tight text-primary leading-tight">
            {t("brand.name")}
          </span>
          <span className="hidden sm:block text-[0.6875rem] text-textMuted leading-tight mt-1">
            {t("brand.tagline")}
          </span>
        </span>
      </span>
    </Link>
  );
}
