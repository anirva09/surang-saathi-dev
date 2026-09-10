import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PriorityActionRow } from "./PriorityActionRow";
import { PRIORITY_ACTIONS } from "@/data/demo/dashboard";

/**
 * The most important component on the dashboard: what needs a decision now,
 * ordered by urgency, with owner, deadline and evidence integrity on the row.
 */
export function PriorityActionQueue() {
  const items = PRIORITY_ACTIONS;

  return (
    <section aria-labelledby="priority-heading" className="min-w-0">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 pb-3 border-b border-border">
        <div className="min-w-0">
          <h2
            id="priority-heading"
            className="text-[1.125rem] font-bold tracking-tight text-text"
          >
            Priority Actions
          </h2>
          <p className="mt-0.5 text-[0.8125rem] leading-snug text-text/80">
            Items requiring manager review, assignment or escalation.
          </p>
        </div>

        <Link
          href="/hazards"
          className="inline-flex items-center gap-1.5 shrink-0 min-h-[40px] text-[0.8125rem] font-medium text-primary underline underline-offset-2 rounded-[2px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          View all
          <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
        </Link>
      </div>

      {items.length === 0 ? (
        <p className="mt-4 border border-border bg-surface rounded-[2px] p-4 text-[0.875rem] text-text/80">
          No priority actions for the selected mine.
        </p>
      ) : (
        <ul className="mt-4 flex flex-col gap-3">
          {items.map((item) => (
            <PriorityActionRow key={item.id} item={item} />
          ))}
        </ul>
      )}
    </section>
  );
}
