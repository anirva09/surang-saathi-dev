"use client";

import React from "react";
import { cn } from "@/utils/cn";
import { useLanguage, type Locale } from "@/i18n/LanguageProvider";

const OPTIONS: { locale: Locale; labelKey: "lang.english" | "lang.hindi"; switchKey: "lang.switchToEnglish" | "lang.switchToHindi" }[] = [
  { locale: "en", labelKey: "lang.english", switchKey: "lang.switchToEnglish" },
  { locale: "hi", labelKey: "lang.hindi", switchKey: "lang.switchToHindi" },
];

/**
 * Real language selection.
 *
 * English is the default and the only language rendered until the user picks
 * Hindi. The two option labels are the sole place a Hindi word appears while
 * English is active — that is the control itself, not interface copy.
 */
export function LanguageToggle({ className }: { className?: string }) {
  const { locale, setLocale, t } = useLanguage();

  return (
    <div
      className={cn("flex items-center gap-1", className)}
      role="group"
      aria-label={t("lang.group")}
    >
      {OPTIONS.map((option) => {
        const active = locale === option.locale;
        return (
          <button
            key={option.locale}
            type="button"
            onClick={() => setLocale(option.locale)}
            aria-pressed={active}
            lang={option.locale}
            className={cn(
              "min-h-[26px] px-2 text-[0.75rem] font-medium rounded-sm border transition-colors",
              option.locale === "hi" && "font-devanagari",
              active
                ? "border-primary bg-primary text-surface"
                : "border-border bg-surface text-textMuted hover:bg-text/5 hover:text-text"
            )}
          >
            {t(option.labelKey)}
            <span className="sr-only"> — {t(option.switchKey)}</span>
          </button>
        );
      })}
    </div>
  );
}
