import React from "react";
import Link from "next/link";
import { ArrowRight, Info } from "lucide-react";
import { RiskIndexMeter } from "@/components/ui/RiskIndexMeter";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { DEMO_MINE, MINE_RISK_INDEX } from "@/data/demo/home";

/**
 * ADR-011: a compliance-facing score is invalid UI without its contributing
 * factors, their weights and the method behind them. The meter carries the
 * factors; this panel carries the "why" and the "what do I do about it".
 */
export function TrustPanel() {
  return (
    <section aria-labelledby="mri-heading" className="w-full bg-background">
      <div className="mx-auto max-w-[1440px] px-4 md:px-8 py-10">
        <SectionHeader
          id="mri-heading"
          title="Explainable Mine Risk Index"
          description={`${DEMO_MINE.name} · ${DEMO_MINE.reportingPeriod}`}
        />

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-[minmax(0,7fr)_minmax(0,8fr)] gap-6 items-start">
          <RiskIndexMeter
            score={MINE_RISK_INDEX.score}
            contributingFactors={[...MINE_RISK_INDEX.factors]}
          />

          <div className="flex flex-col border border-border bg-surface rounded-[2px] p-5 min-w-0">
            <h3 className="text-[0.9375rem] font-bold text-text">
              Why this mine scores {MINE_RISK_INDEX.score.toFixed(1)}
            </h3>

            <ul className="mt-3 flex flex-col gap-2.5">
              {MINE_RISK_INDEX.drivers.map((driver) => (
                <li
                  key={driver}
                  className="flex items-start gap-2.5 text-[0.875rem] leading-snug text-text/80"
                >
                  <span
                    className="mt-[7px] shrink-0 w-1.5 h-1.5 bg-primary"
                    aria-hidden="true"
                  />
                  {driver}
                </li>
              ))}
            </ul>

            <div className="mt-5 flex items-start gap-2.5 border border-border bg-background p-3 rounded-[2px]">
              <Info
                className="w-4 h-4 mt-px shrink-0 text-text/80"
                aria-hidden="true"
              />
              <p className="text-[0.75rem] leading-snug text-text/80">
                <span className="font-medium text-text">How it is scored.</span>{" "}
                {MINE_RISK_INDEX.method}. Weights are fixed and published, so
                the same inputs always produce the same score and a manager can
                argue with it.
              </p>
            </div>

            <Link
              href="/dashboard#risk"
              className="mt-5 inline-flex items-center gap-1.5 self-start min-h-[40px] text-[0.875rem] font-medium text-primary underline underline-offset-2 rounded-[2px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              See the actions behind this score
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
