"use client";

import React from "react";
import { AccessibilityControls } from "./AccessibilityControls";
import { LanguageToggle } from "./LanguageToggle";
import { useT } from "@/i18n/LanguageProvider";

/**
 * Government utility strip.
 *
 * States the domain context this platform is built for. No official emblem is
 * reproduced — the square at the left is a neutral reserved identity slot, and
 * the prototype notice immediately below makes the project's status explicit.
 */
export function GovUtilityBar() {
  const t = useT();

  return (
    <div className="w-full bg-utility border-b border-borderSoft">
      <div className="mx-auto max-w-content px-4 md:px-6">
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-1.5">
          <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.75rem] leading-tight text-textMuted min-w-0">
            <span
              aria-hidden="true"
              className="shrink-0 w-[18px] h-[18px] border border-border bg-background rounded-sm"
            />
            <span className="font-medium text-text">{t("gov.country")}</span>
            <span className="hidden sm:inline text-border px-1" aria-hidden="true">
              |
            </span>
            <span className="hidden sm:inline">{t("gov.ministry")}</span>
          </p>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <a
              href="#main-content"
              className="text-[0.75rem] font-medium text-textMuted hover:text-primary hover:underline underline-offset-2 rounded-sm"
            >
              {t("gov.skip")}
            </a>
            <AccessibilityControls />
            <LanguageToggle />
          </div>
        </div>
      </div>
    </div>
  );
}
