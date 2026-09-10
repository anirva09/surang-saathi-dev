import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/utils/cn";
import { SyncStatus } from "@/components/ui/SyncStatus";
import { GeofenceProof } from "@/components/ui/GeofenceProof";
import { EVIDENCE_EXCEPTIONS } from "@/data/demo/dashboard";

/**
 * Evidence integrity, surfaced rather than buried.
 *
 * Locked semantics: QUEUED and OFFLINE are normal field conditions on a mine
 * with no underground signal — they get calm, neutral treatment. Only a real
 * conflict between local and server verification is an error state.
 */
const SEVERITY_RULE = {
  conflict: "border-l-danger",
  pending: "border-l-accent",
  normal: "border-l-border",
} as const;

export function EvidenceExceptions() {
  const items = EVIDENCE_EXCEPTIONS;

  return (
    <section aria-labelledby="exceptions-heading" className="min-w-0">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 pb-3 border-b border-border">
        <div className="min-w-0">
          <h2
            id="exceptions-heading"
            className="text-[1.125rem] font-bold tracking-tight text-text"
          >
            Sync &amp; Evidence Exceptions
          </h2>
          <p className="mt-0.5 text-[0.8125rem] leading-snug text-text/80">
            Field submissions requiring verification or reconciliation.
          </p>
        </div>

        <Link
          href="/hazards?sync=CONFLICT"
          className="inline-flex items-center gap-1.5 shrink-0 min-h-[40px] text-[0.8125rem] font-medium text-primary underline underline-offset-2 rounded-[2px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          View all
          <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
        </Link>
      </div>

      {items.length === 0 ? (
        <p className="mt-4 border border-border bg-surface rounded-[2px] p-4 text-[0.875rem] text-text/80">
          No sync or evidence exceptions for the selected mine.
        </p>
      ) : (
        <ul className="mt-4 flex flex-col gap-2">
          {items.map((item) => (
            <li
              key={item.id}
              className={cn(
                "flex flex-col gap-2 p-3 bg-surface border border-border border-l-4 rounded-[2px] min-w-0",
                SEVERITY_RULE[item.severity]
              )}
            >
              <div className="min-w-0">
                <p className="text-[0.6875rem] font-bold uppercase tracking-wider text-text/80">
                  {item.id}
                </p>
                <p className="mt-0.5 text-[0.875rem] font-bold leading-snug text-text">
                  {item.title}
                </p>
                <p className="mt-1 text-[0.75rem] leading-snug text-text/80 break-words">
                  {item.detail}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 min-w-0">
                <div className="flex flex-wrap items-center gap-2 min-w-0">
                  {item.geofenceState && (
                    <GeofenceProof state={item.geofenceState} />
                  )}
                  <SyncStatus state={item.syncState} />
                </div>

                <Link
                  href={item.href}
                  className="inline-flex items-center gap-1 shrink-0 min-h-[40px] text-[0.75rem] font-medium text-primary underline underline-offset-2 rounded-[2px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  Reconcile
                  <span className="sr-only"> {item.id}</span>
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
