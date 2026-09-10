"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageProvider";
import type { RiskSummaryOut } from "@/lib/api/contract";
import { cn } from "@/utils/cn";

/**
 * Risk band styling is derived from the level the BACKEND assigned, not from the
 * score — the threshold logic belongs to the risk service, and duplicating it
 * here would let the two disagree. An unrecognised level renders neutrally with
 * its own code shown.
 */
const LEVEL_TONE: Record<string, { band: string; bar: string }> = {
  LOW: { band: "bg-success/10 text-success border-success/30", bar: "bg-success" },
  MEDIUM: {
    band: "bg-accent/15 text-warningInk border-accent/40",
    bar: "bg-accent",
  },
  HIGH: { band: "bg-danger/10 text-dangerInk border-danger/30", bar: "bg-danger" },
};

const NEUTRAL = {
  band: "bg-border/30 text-text border-border",
  bar: "bg-textMuted",
};

export function RiskSummaryPanel({ risk }: { risk: RiskSummaryOut | null }) {
  const { t, formatNumber } = useLanguage();

  return (
    <section
      aria-labelledby="risk-heading"
      className="border border-border bg-surface rounded-sm overflow-hidden"
    >
      <div className="px-4 py-3 border-b border-border bg-utility flex items-center justify-between gap-3">
        <h2
          id="risk-heading"
          className="text-[0.9375rem] font-bold tracking-tight text-text"
        >
          {t("dash.risk.heading")}
        </h2>
        <Link
          href="/risk"
          className="inline-flex items-center gap-1 shrink-0 text-[0.75rem] font-medium text-primary hover:underline underline-offset-2 rounded-sm"
        >
          {t("dash.risk.open")}
          <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
        </Link>
      </div>

      {risk === null ? (
        // A mine with no snapshot yet is a real state the contract models as
        // `risk: null`. It gets an explanation, not a zero.
        <p className="p-4 text-[0.875rem] leading-relaxed text-textMuted">
          {t("dash.risk.none")}
        </p>
      ) : (
        <>
          {(() => {
            const tone = LEVEL_TONE[risk.level] ?? NEUTRAL;
            return (
              <div
                className={cn(
                  "px-4 py-3.5 border-b flex items-center justify-between gap-4",
                  tone.band
                )}
              >
                <div className="min-w-0">
                  <p className="text-[0.75rem] font-medium uppercase tracking-wider">
                    {t("risk.level")}
                  </p>
                  <p className="text-[1rem] font-bold">{risk.level}</p>
                </div>
                <p className="text-[2rem] font-bold leading-none tabular-nums">
                  {formatNumber(risk.score, {
                    minimumFractionDigits: 1,
                    maximumFractionDigits: 1,
                  })}
                </p>
              </div>
            );
          })()}

          <div className="p-4">
            <h3 className="text-[0.75rem] font-bold uppercase tracking-wider text-text">
              {t("dash.risk.factors")}
            </h3>

            <ul className="mt-3 flex flex-col gap-3">
              {risk.factors.map((factor) => {
                const tone = LEVEL_TONE[risk.level] ?? NEUTRAL;
                const weightPercent = Math.round(factor.weight * 100);
                return (
                  <li key={factor.name} className="flex flex-col gap-1">
                    <div className="flex justify-between items-baseline gap-3 text-[0.8125rem]">
                      <span className="font-medium text-text min-w-0">
                        {factor.name}
                      </span>
                      <span className="shrink-0 text-textMuted tabular-nums">
                        {factor.currentValue}
                      </span>
                    </div>
                    <div
                      className="h-1.5 w-full bg-border/50 rounded-full overflow-hidden"
                      role="img"
                      aria-label={`${t("dash.risk.weight")}: ${weightPercent}%`}
                    >
                      <div
                        className={cn("h-full", tone.bar)}
                        style={{
                          width: `${Math.min(100, Math.max(0, weightPercent))}%`,
                        }}
                      />
                    </div>
                    <p className="text-[0.6875rem] text-textMuted">
                      {t("dash.risk.weight")}: {weightPercent}%
                    </p>
                  </li>
                );
              })}
            </ul>
          </div>
        </>
      )}
    </section>
  );
}
