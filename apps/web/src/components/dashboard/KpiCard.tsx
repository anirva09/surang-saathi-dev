import React from "react";
import Link from "next/link";
import {
  ChevronRight,
  ClipboardCheck,
  Clock3,
  FileCheck2,
  TriangleAlert,
} from "lucide-react";
import { cn } from "@/utils/cn";
import type { DashboardKpi } from "@/data/demo/dashboard";

const ICONS: Record<DashboardKpi["icon"], typeof TriangleAlert> = {
  hazard: TriangleAlert,
  overdue: Clock3,
  review: FileCheck2,
  inspection: ClipboardCheck,
};

/**
 * Urgency is carried by a left rule plus the icon tint — never by painting the
 * whole card red, which would make four cards shout at once and rank nothing.
 */
const SEMANTICS: Record<
  DashboardKpi["semantic"],
  { rule: string; icon: string; srLabel: string }
> = {
  danger: {
    rule: "border-l-danger",
    icon: "bg-danger/10 text-dangerInk",
    srLabel: "Critical",
  },
  warning: {
    rule: "border-l-accent",
    icon: "bg-accent/20 text-warningInk",
    srLabel: "Needs attention",
  },
  info: {
    rule: "border-l-primary",
    icon: "bg-primary/10 text-primary",
    srLabel: "For review",
  },
  neutral: {
    rule: "border-l-border",
    icon: "bg-border/40 text-text",
    srLabel: "Informational",
  },
  success: {
    rule: "border-l-success",
    icon: "bg-success/10 text-success",
    srLabel: "On track",
  },
};

export function KpiCard({ kpi }: { kpi: DashboardKpi }) {
  const Icon = ICONS[kpi.icon];
  const semantic = SEMANTICS[kpi.semantic];

  return (
    <Link
      href={kpi.href}
      className={cn(
        "group flex flex-col h-full min-w-0 bg-surface border border-border border-l-4 rounded-[2px] p-4",
        "hover:bg-black/[0.02] transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        semantic.rule
      )}
    >
      <span className="flex items-start gap-2.5 min-w-0">
        <span
          className={cn(
            "shrink-0 inline-flex items-center justify-center w-7 h-7 rounded-[2px]",
            semantic.icon
          )}
          aria-hidden="true"
        >
          <Icon className="w-4 h-4" />
        </span>
        <span className="text-[0.8125rem] font-bold leading-snug text-text min-w-0">
          {kpi.label}
          {/* Urgency must not be conveyed by colour alone. */}
          <span className="sr-only"> — {semantic.srLabel}</span>
        </span>
      </span>

      <span className="mt-3 text-[2rem] font-bold leading-none tracking-tight text-text tabular-nums">
        {kpi.value}
      </span>

      <span className="mt-1.5 text-[0.75rem] leading-snug text-text/80">
        {kpi.context}
      </span>

      <span className="mt-auto pt-3 inline-flex items-center gap-1 text-[0.75rem] font-medium text-primary group-hover:underline underline-offset-2">
        {kpi.ctaLabel}
        <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
      </span>
    </Link>
  );
}
