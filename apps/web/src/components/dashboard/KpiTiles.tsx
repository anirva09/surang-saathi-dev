"use client";

import React from "react";
import Link from "next/link";
import {
  ChevronRight,
  Clock3,
  ShieldAlert,
  SplitSquareHorizontal,
  TriangleAlert,
} from "lucide-react";
import { useLanguage } from "@/i18n/LanguageProvider";
import type { MessageKey } from "@/i18n/messages.en";
import type { DashboardKpisOut } from "@/lib/api/contract";
import { cn } from "@/utils/cn";

/**
 * Exactly four KPIs, and exactly the four the contract's `DashboardKpisOut`
 * declares — one per question the dashboard has to answer: what is unsafe, how
 * badly, what is overdue, and what evidence is disputed. Adding a fifth tile
 * would mean inventing a number the backend does not compute.
 */
interface KpiDefinition {
  field: keyof DashboardKpisOut;
  label: MessageKey;
  help: MessageKey;
  icon: typeof TriangleAlert;
  /** Urgency tone, carried by a left rule and the icon — never by colour alone. */
  tone: "danger" | "warning" | "info";
  href: string;
}

const KPIS: KpiDefinition[] = [
  {
    field: "openHazards",
    label: "dash.kpi.openHazards",
    help: "dash.kpi.openHazards.help",
    icon: TriangleAlert,
    tone: "info",
    href: "/hazards",
  },
  {
    field: "highRiskHazards",
    label: "dash.kpi.highRiskHazards",
    help: "dash.kpi.highRiskHazards.help",
    icon: ShieldAlert,
    tone: "danger",
    href: "/hazards?severity=HIGH",
  },
  {
    field: "overdueCorrectiveActions",
    label: "dash.kpi.overdueCorrectiveActions",
    help: "dash.kpi.overdueCorrectiveActions.help",
    icon: Clock3,
    tone: "danger",
    href: "/hazards?status=OVERDUE",
  },
  {
    field: "conflictedHazards",
    label: "dash.kpi.conflictedHazards",
    help: "dash.kpi.conflictedHazards.help",
    icon: SplitSquareHorizontal,
    tone: "warning",
    href: "/hazards",
  },
];

const TONES: Record<
  KpiDefinition["tone"],
  { rule: string; icon: string; srLabel: MessageKey }
> = {
  danger: {
    rule: "border-l-danger",
    icon: "bg-danger/10 text-dangerInk",
    srLabel: "domain.severity.HIGH",
  },
  warning: {
    rule: "border-l-accent",
    icon: "bg-accent/20 text-warningInk",
    srLabel: "domain.severity.MEDIUM",
  },
  info: {
    rule: "border-l-primary",
    icon: "bg-primary/10 text-primary",
    srLabel: "domain.severity.LOW",
  },
};

export function KpiTiles({ kpis }: { kpis: DashboardKpisOut }) {
  const { t, formatNumber } = useLanguage();

  return (
    <section aria-labelledby="kpi-heading">
      <h2
        id="kpi-heading"
        className="text-[1.375rem] font-bold tracking-tight text-text"
      >
        {t("dash.kpi.heading")}
      </h2>

      <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {KPIS.map((kpi) => {
          const tone = TONES[kpi.tone];
          const Icon = kpi.icon;
          const value = kpis[kpi.field];

          return (
            <li key={kpi.field} className="min-w-0">
              <Link
                href={kpi.href}
                className={cn(
                  "group flex flex-col h-full min-w-0 bg-surface border border-border border-l-4 rounded-sm p-4",
                  "hover:bg-black/[0.02] transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                  tone.rule
                )}
              >
                <span className="flex items-start gap-2.5 min-w-0">
                  <span
                    className={cn(
                      "shrink-0 inline-flex items-center justify-center w-7 h-7 rounded-sm",
                      tone.icon
                    )}
                    aria-hidden="true"
                  >
                    <Icon className="w-4 h-4" />
                  </span>
                  <span className="text-[0.8125rem] font-bold leading-snug text-text min-w-0">
                    {t(kpi.label)}
                    {/* Urgency must never be conveyed by colour alone. */}
                    <span className="sr-only"> — {t(tone.srLabel)}</span>
                  </span>
                </span>

                <span className="mt-3 text-[2rem] font-bold leading-none tracking-tight text-stat tabular-nums">
                  {formatNumber(value)}
                </span>

                <span className="mt-1.5 text-[0.75rem] leading-snug text-textMuted">
                  {t(kpi.help)}
                </span>

                <span className="mt-auto pt-3 inline-flex items-center gap-1 text-[0.75rem] font-medium text-primary group-hover:underline underline-offset-2">
                  {t("work.nav.hazards")}
                  <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
