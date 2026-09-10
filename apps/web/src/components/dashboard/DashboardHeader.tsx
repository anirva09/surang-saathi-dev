import React from "react";
import { ChevronDown, RefreshCcw, UserRound } from "lucide-react";
import {
  DEMO_DATA_NOTICE,
  DEMO_MANAGER,
  DEMO_MINE,
} from "@/data/demo/dashboard";

/**
 * Operational page header.
 *
 * Deliberately compact — this is a working surface, not a hero. The mine
 * selector is presented as context rather than a live control: Session 2 has
 * one dataset, so a functioning dropdown would be theatre.
 */
export function DashboardHeader() {
  return (
    <div className="border-b border-border bg-surface">
      <div className="mx-auto max-w-[1440px] px-4 md:px-8 py-5">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
          <div className="min-w-0">
            <p className="text-[0.6875rem] font-bold uppercase tracking-[0.16em] text-primary">
              Mine Operations
            </p>
            <h1 className="mt-1.5 text-[1.75rem] font-bold tracking-tight text-text">
              Safety Dashboard
            </h1>
            <p className="mt-1 text-[0.875rem] leading-snug text-text/80 max-w-[64ch]">
              Priority safety, compliance and action status for the selected
              mine.
            </p>
          </div>

          <dl className="flex flex-wrap items-stretch gap-x-3 gap-y-3 lg:justify-end">
            <div className="min-w-0 border border-border bg-background rounded-[2px] px-3 py-2">
              <dt className="text-[0.6875rem] font-medium uppercase tracking-wider text-text/80">
                Selected Mine
              </dt>
              <dd className="mt-0.5 flex items-center gap-1.5 text-[0.875rem] font-bold text-text">
                <span className="break-words">{DEMO_MINE.name}</span>
                <ChevronDown
                  className="w-3.5 h-3.5 shrink-0 text-text/50"
                  aria-hidden="true"
                />
              </dd>
            </div>

            <div className="min-w-0 border border-border bg-background rounded-[2px] px-3 py-2">
              <dt className="text-[0.6875rem] font-medium uppercase tracking-wider text-text/80">
                Reporting Period
              </dt>
              <dd className="mt-0.5 text-[0.875rem] font-bold text-text">
                {DEMO_MINE.shift}
                <span className="mx-1.5 font-normal text-text/50" aria-hidden="true">
                  ·
                </span>
                {DEMO_MINE.date}
              </dd>
            </div>

            <div className="min-w-0 border border-border bg-background rounded-[2px] px-3 py-2">
              <dt className="text-[0.6875rem] font-medium uppercase tracking-wider text-text/80">
                System
              </dt>
              <dd className="mt-0.5 flex items-center gap-1.5 text-[0.875rem] font-bold text-text">
                <RefreshCcw
                  className="w-3.5 h-3.5 shrink-0 text-success"
                  aria-hidden="true"
                />
                Last sync {DEMO_MINE.lastSync}
              </dd>
            </div>

            <div className="min-w-0 border border-border bg-background rounded-[2px] px-3 py-2">
              <dt className="text-[0.6875rem] font-medium uppercase tracking-wider text-text/80">
                {DEMO_MANAGER.role}
              </dt>
              <dd className="mt-0.5 flex items-center gap-1.5 text-[0.875rem] font-bold text-text">
                <UserRound
                  className="w-3.5 h-3.5 shrink-0 text-text/60"
                  aria-hidden="true"
                />
                {DEMO_MANAGER.name}
              </dd>
            </div>
          </dl>
        </div>

        <p className="mt-4 text-[0.75rem] text-text/80">{DEMO_DATA_NOTICE}</p>
      </div>
    </div>
  );
}
