import React from "react";
import Link from "next/link";
import { Activity, ArrowRight, FileCheck2, ShieldCheck } from "lucide-react";
import { InspectionCard } from "@/components/domain/InspectionCard";
import {
  RECENT_EVENTS,
  RECENT_INSPECTION,
  type ActivityEvent,
} from "@/data/demo/dashboard";

const EVENT_ICON: Record<ActivityEvent["kind"], typeof Activity> = {
  action: FileCheck2,
  evidence: ShieldCheck,
  inspection: Activity,
};

/**
 * Closes the page on work that completed correctly, not only on failures — a
 * manager needs to see the loop functioning, not just its exceptions.
 */
export function RecentSafetyActivity() {
  return (
    <section aria-labelledby="activity-heading" className="min-w-0">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 pb-3 border-b border-border">
        <div className="min-w-0">
          <h2
            id="activity-heading"
            className="text-[1.125rem] font-bold tracking-tight text-text"
          >
            Recent Safety Activity
          </h2>
          <p className="mt-0.5 text-[0.8125rem] leading-snug text-text/80">
            Latest verified inspections, hazards and corrective-action events.
          </p>
        </div>

        <Link
          href="/audit"
          className="inline-flex items-center gap-1.5 shrink-0 min-h-[40px] text-[0.8125rem] font-medium text-primary underline underline-offset-2 rounded-[2px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          View audit ledger
          <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
        </Link>
      </div>

      <div className="mt-4 grid grid-cols-1 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] gap-4 items-start">
        <div className="min-w-0">
          <h3 className="sr-only">Most recent completed inspection</h3>
          <InspectionCard
            id={RECENT_INSPECTION.id}
            type={RECENT_INSPECTION.type}
            status={RECENT_INSPECTION.status}
            syncState={RECENT_INSPECTION.syncState}
            geofenceState={RECENT_INSPECTION.geofenceState}
            actorName={RECENT_INSPECTION.actorName}
            timestamp={RECENT_INSPECTION.timestamp}
            evidenceCount={RECENT_INSPECTION.evidenceCount}
            locationName={RECENT_INSPECTION.locationName}
            isDesktopDense
          />
        </div>

        <div className="min-w-0 border border-border bg-surface rounded-[2px] p-4">
          <h3 className="text-[0.75rem] font-bold uppercase tracking-wider text-text">
            Earlier this shift
          </h3>
          <ul className="mt-3 flex flex-col gap-3">
            {RECENT_EVENTS.map((event) => {
              const Icon = EVENT_ICON[event.kind];
              return (
                <li key={event.id} className="flex items-start gap-2.5 min-w-0">
                  <Icon
                    className="w-4 h-4 mt-px shrink-0 text-success"
                    aria-hidden="true"
                  />
                  <p className="text-[0.8125rem] leading-snug text-text/80 min-w-0 break-words">
                    {event.label}
                    <span className="block text-[0.75rem] text-text/70 mt-0.5 tabular-nums">
                      {event.time}
                    </span>
                  </p>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
