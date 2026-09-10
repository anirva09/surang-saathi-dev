import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/utils/cn";
import { StatusBadge, type SemanticStatus } from "@/components/ui/StatusBadge";
import {
  COMPLIANCE_DEADLINES,
  type ComplianceState,
} from "@/data/demo/dashboard";

const STATE: Record<
  ComplianceState,
  { label: string; semantic: SemanticStatus; rule: string }
> = {
  OVERDUE: { label: "Overdue", semantic: "danger", rule: "border-l-danger" },
  DUE_TODAY: { label: "Due today", semantic: "warning", rule: "border-l-accent" },
  UPCOMING: { label: "Upcoming", semantic: "neutral", rule: "border-l-border" },
};

export function ComplianceDeadlines() {
  const items = COMPLIANCE_DEADLINES;

  return (
    <section aria-labelledby="compliance-heading" className="min-w-0">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 pb-3 border-b border-border">
        <div className="min-w-0">
          <h2
            id="compliance-heading"
            className="text-[1.125rem] font-bold tracking-tight text-text"
          >
            Compliance Deadlines
          </h2>
          <p className="mt-0.5 text-[0.8125rem] leading-snug text-text/80">
            Upcoming and overdue checkpoints requiring evidence or sign-off.
          </p>
        </div>

        <Link
          href="/compliance"
          className="inline-flex items-center gap-1.5 shrink-0 min-h-[40px] text-[0.8125rem] font-medium text-primary underline underline-offset-2 rounded-[2px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          View all
          <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
        </Link>
      </div>

      {items.length === 0 ? (
        <p className="mt-4 border border-border bg-surface rounded-[2px] p-4 text-[0.875rem] text-text/80">
          No compliance checkpoints due for the selected mine.
        </p>
      ) : (
        <ul className="mt-4 flex flex-col gap-2">
          {items.map((item) => {
            const state = STATE[item.state];
            return (
              <li
                key={item.id}
                className={cn(
                  "flex flex-wrap items-start justify-between gap-x-3 gap-y-2 p-3 bg-surface border border-border border-l-4 rounded-[2px] min-w-0",
                  state.rule
                )}
              >
                <div className="min-w-0">
                  <p className="text-[0.875rem] font-bold leading-snug text-text break-words">
                    {item.title}
                  </p>
                  <p className="mt-1 text-[0.75rem] text-text/80 break-words">
                    Owner: <span className="text-text">{item.owner}</span>
                    <span className="mx-1.5" aria-hidden="true">
                      ·
                    </span>
                    Due {item.dueDate}
                  </p>
                </div>

                <div className="flex flex-col items-start sm:items-end gap-1 shrink-0">
                  <StatusBadge status={state.semantic} label={state.label} />
                  <span
                    className={cn(
                      "text-[0.75rem] font-medium",
                      item.state === "OVERDUE"
                        ? "text-dangerInk"
                        : item.state === "DUE_TODAY"
                          ? "text-warningInk"
                          : "text-text/80"
                    )}
                  >
                    {item.urgencyLabel}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
