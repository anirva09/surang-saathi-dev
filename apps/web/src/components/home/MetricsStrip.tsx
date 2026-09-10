import React from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ChevronRight,
  ClipboardCheck,
  Clock,
  MapPin,
} from "lucide-react";
import { cn } from "@/utils/cn";
import {
  DEMO_DATA_NOTICE,
  DEMO_MINE,
  HOME_METRICS,
  type HomeMetric,
} from "@/data/demo/home";

const ICONS: Record<string, typeof AlertTriangle> = {
  "open-hazards": AlertTriangle,
  "overdue-actions": Clock,
  "inspections-today": ClipboardCheck,
  "high-risk-areas": MapPin,
};

const TONE_STYLES: Record<HomeMetric["tone"], string> = {
  danger: "bg-danger/10 text-dangerInk",
  warning: "bg-accent/20 text-warningInk",
  success: "bg-success/10 text-success",
  info: "bg-primary/10 text-primary",
  neutral: "bg-border/40 text-text",
};

export function MetricsStrip() {
  return (
    <section
      aria-labelledby="metrics-heading"
      className="w-full bg-background border-b border-border"
    >
      <div className="mx-auto max-w-[1440px] px-4 md:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 mb-3">
          <h2
            id="metrics-heading"
            className="text-[0.8125rem] font-bold uppercase tracking-wider text-text"
          >
            Operational status — {DEMO_MINE.name}
          </h2>
          <p className="text-[0.75rem] text-text/80">
            {DEMO_MINE.reportingPeriod} · {DEMO_DATA_NOTICE}
          </p>
        </div>

        <ul className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 border border-border bg-surface rounded-[2px]">
          {HOME_METRICS.map((metric, index) => {
            const Icon = ICONS[metric.id] ?? AlertTriangle;
            return (
              <li
                key={metric.id}
                className={cn(
                  "min-w-0",
                  index > 0 && "border-t sm:border-t-0 border-border",
                  index % 2 === 1 && "sm:border-l",
                  index >= 2 && "sm:border-t xl:border-t-0",
                  "xl:border-l xl:first:border-l-0",
                  "border-border"
                )}
              >
                <Link
                  href={metric.href}
                  className="flex items-center gap-4 p-4 min-h-[88px] hover:bg-black/[0.03] transition-colors rounded-[2px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset"
                >
                  <span
                    className={cn(
                      "shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-[2px]",
                      TONE_STYLES[metric.tone]
                    )}
                    aria-hidden="true"
                  >
                    <Icon className="w-5 h-5" />
                  </span>

                  <span className="flex flex-col min-w-0 flex-1">
                    <span className="text-[1.625rem] font-bold leading-none tracking-tight text-text tabular-nums">
                      {metric.value}
                    </span>
                    <span className="mt-1 text-[0.875rem] font-medium text-text truncate">
                      {metric.label}
                    </span>
                    <span className="text-[0.75rem] text-text/80 truncate">
                      {metric.context}
                    </span>
                  </span>

                  <ChevronRight
                    className="w-4 h-4 shrink-0 text-primary"
                    aria-hidden="true"
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
