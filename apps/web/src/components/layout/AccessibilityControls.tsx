"use client";

import React, { useCallback, useEffect, useState } from "react";
import { cn } from "@/utils/cn";

type TextScale = "sm" | "base" | "lg";

// "A" is the unmodified page. A- steps down, A+ steps up — the convention on
// Indian government service portals.
const SCALES: Record<TextScale, string> = {
  sm: "87.5%",
  base: "100%",
  lg: "118.75%",
};

const OPTIONS: { scale: TextScale; symbol: string; name: string }[] = [
  { scale: "sm", symbol: "A-", name: "Smaller text size" },
  { scale: "base", symbol: "A", name: "Default text size" },
  { scale: "lg", symbol: "A+", name: "Larger text size" },
];

/**
 * Real text-resize controls — they scale the document root, so every rem-based
 * size on the page responds. Not decorative.
 */
export function AccessibilityControls({ className }: { className?: string }) {
  const [scale, setScale] = useState<TextScale>("base");

  useEffect(() => {
    document.documentElement.style.fontSize = SCALES[scale];
  }, [scale]);

  const apply = useCallback((next: TextScale) => setScale(next), []);

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div
        className="flex items-center gap-1"
        role="group"
        aria-label="Text size"
      >
        {OPTIONS.map((option) => (
          <button
            key={option.scale}
            type="button"
            onClick={() => apply(option.scale)}
            aria-pressed={scale === option.scale}
            className={cn(
              "min-w-[28px] min-h-[28px] px-1.5 text-[0.75rem] font-medium rounded-[2px] border transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
              scale === option.scale
                ? "border-primary bg-primary text-surface"
                : "border-border bg-surface text-text hover:bg-black/5"
            )}
          >
            <span aria-hidden="true">{option.symbol}</span>
            <span className="sr-only">{option.name}</span>
          </button>
        ))}
      </div>

      <div
        className="flex items-center gap-1"
        role="group"
        aria-label="Interface language"
      >
        <button
          type="button"
          aria-pressed={true}
          className="min-h-[28px] px-2 text-[0.75rem] font-medium rounded-[2px] border border-primary bg-primary text-surface"
        >
          English
        </button>
        <button
          type="button"
          disabled
          aria-disabled={true}
          title="A full Hindi interface is planned. This prototype ships bilingual labels on field-facing content."
          className="min-h-[28px] px-2 text-[0.75rem] font-medium rounded-[2px] border border-border bg-surface text-text/80 opacity-60 cursor-not-allowed"
        >
          हिन्दी
          <span className="sr-only"> — not available in this prototype</span>
        </button>
      </div>
    </div>
  );
}
