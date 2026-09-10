import React from "react";
import Link from "next/link";
import { ArrowRight, Info } from "lucide-react";
import { RiskIndexMeter } from "@/components/ui/RiskIndexMeter";
import { MINE_RISK_INDEX } from "@/data/demo/dashboard";

/**
 * ADR-011: a compliance-facing score is invalid UI without its contributing
 * factors, their weights and the method behind them. The meter carries the
 * factors; this panel carries the "why" and the "what do I do about it".
 *
 * Deliberately not a giant gauge — it supports prioritisation, it does not
 * outrank the action queue.
 */
export function MineRiskPanel() {
  const { score, band, method, primaryDriver, actionHint, factors } =
    MINE_RISK_INDEX;

  return (
    <section aria-labelledby="mri-heading" className="min-w-0" id="risk">
      <div className="pb-3 border-b border-border">
        <h2
          id="mri-heading"
          className="text-[1.125rem] font-bold tracking-tight text-text"
        >
          Mine Risk Index
        </h2>
        <p className="mt-0.5 text-[0.8125rem] leading-snug text-text/80">
          Explainable weighted risk for the selected mine.
        </p>
      </div>

      {/* A single spoken summary, so the score is never just a floating number. */}
      <p className="sr-only">
        Mine Risk Index: {score} out of 100, {band}. Rule-based weighted index,
        MVP version 1.
      </p>

      <div className="mt-4 flex flex-col gap-3">
        <RiskIndexMeter score={score} contributingFactors={[...factors]} />

        <div className="border border-border bg-surface rounded-[2px] p-4">
          <h3 className="text-[0.875rem] font-bold text-text">
            Why this mine is {band.toLowerCase()}
          </h3>

          <p className="mt-2 text-[0.8125rem] leading-snug text-text/80">
            <span className="font-medium text-text">Primary driver.</span>{" "}
            {primaryDriver}
          </p>

          <p className="mt-4 border-l-2 border-accent pl-3 text-[0.8125rem] leading-snug text-text">
            {actionHint}
          </p>

          <div className="mt-4 flex items-start gap-2 border border-border bg-background p-2.5 rounded-[2px]">
            <Info
              className="w-3.5 h-3.5 mt-px shrink-0 text-text/70"
              aria-hidden="true"
            />
            <p className="text-[0.75rem] leading-snug text-text/80">
              {method}. Weights are fixed and published, so the same inputs
              always produce the same score.
            </p>
          </div>

          <Link
            href="/corrective-actions?status=OVERDUE"
            className="mt-4 inline-flex items-center gap-1.5 min-h-[40px] text-[0.8125rem] font-medium text-primary underline underline-offset-2 rounded-[2px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Open the overdue actions driving this score
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
