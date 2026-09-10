import React from "react";
import { ChevronRight } from "lucide-react";
import { GOLDEN_WORKFLOW } from "@/data/demo/home";

/**
 * The Golden Workflow, stated once on the homepage so a judge or an officer
 * can see the accountability loop before opening any screen. Horizontal on
 * desktop, stacked on mobile, deliberately restrained.
 */
export function WorkflowProof() {
  return (
    <section
      aria-labelledby="workflow-heading"
      className="w-full bg-text text-surface"
    >
      <div className="mx-auto max-w-[1440px] px-4 md:px-8 py-10">
        <div className="max-w-[70ch]">
          <h2
            id="workflow-heading"
            className="text-[1.25rem] font-bold tracking-tight"
          >
            One hazard, end to end
          </h2>
          <p className="mt-2 text-[0.875rem] leading-relaxed text-surface/80">
            Every record follows the same path, and each step is written to the
            ledger rather than overwriting the last one. Corrections are new
            entries, so the history stays intact.
          </p>
        </div>

        <ol className="mt-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-x-2 gap-y-4">
          {GOLDEN_WORKFLOW.map((step, index) => (
            <li key={step.id} className="flex xl:flex-col gap-3 min-w-0">
              <div className="flex xl:flex-row items-center gap-3 shrink-0">
                <span className="inline-flex items-center justify-center w-8 h-8 shrink-0 border border-accent text-accent text-[0.8125rem] font-bold rounded-[2px] tabular-nums">
                  {index + 1}
                </span>
                {index < GOLDEN_WORKFLOW.length - 1 && (
                  <ChevronRight
                    className="hidden xl:block w-4 h-4 text-surface/40"
                    aria-hidden="true"
                  />
                )}
              </div>

              <div className="min-w-0">
                <p className="text-[0.9375rem] font-bold leading-tight">
                  {step.label}
                </p>
                <p className="mt-1 text-[0.8125rem] leading-snug text-surface/80">
                  {step.detail}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <p className="mt-8 text-[0.75rem] text-surface/70 border-t border-surface/20 pt-4">
          Ledger integrity uses SHA-256 hash chaining in PostgreSQL. This is not
          a blockchain and does not use Hyperledger.
        </p>
      </div>
    </section>
  );
}
