"use client";

import React, { useCallback, useEffect, useState } from "react";
import { cn } from "@/utils/cn";
import { useT } from "@/i18n/LanguageProvider";
import type { MessageKey } from "@/i18n/messages.en";

type TextScale = "sm" | "base" | "lg";

// "A" is the unmodified page. A- steps down, A+ steps up — the convention on
// Indian government service portals.
const SCALES: Record<TextScale, string> = {
  sm: "87.5%",
  base: "100%",
  lg: "118.75%",
};

const OPTIONS: { scale: TextScale; symbol: string; key: MessageKey }[] = [
  { scale: "sm", symbol: "A-", key: "a11y.textSmaller" },
  { scale: "base", symbol: "A", key: "a11y.textDefault" },
  { scale: "lg", symbol: "A+", key: "a11y.textLarger" },
];

/**
 * Real text-resize controls — they scale the document root, so every rem-based
 * size on the page responds. Rendered exactly once per page.
 */
export function AccessibilityControls({ className }: { className?: string }) {
  const t = useT();
  const [scale, setScale] = useState<TextScale>("base");

  useEffect(() => {
    document.documentElement.style.fontSize = SCALES[scale];
  }, [scale]);

  const apply = useCallback((next: TextScale) => setScale(next), []);

  return (
    <div
      className={cn("flex items-center gap-1", className)}
      role="group"
      aria-label={t("a11y.textSize")}
    >
      {OPTIONS.map((option) => (
        <button
          key={option.scale}
          type="button"
          onClick={() => apply(option.scale)}
          aria-pressed={scale === option.scale}
          className={cn(
            "min-w-[26px] min-h-[26px] px-1.5 text-[0.75rem] font-medium rounded-sm border transition-colors",
            scale === option.scale
              ? "border-primary bg-primary text-surface"
              : "border-transparent text-textMuted hover:bg-text/5 hover:text-text"
          )}
        >
          <span aria-hidden="true">{option.symbol}</span>
          <span className="sr-only">{t(option.key)}</span>
        </button>
      ))}
    </div>
  );
}
