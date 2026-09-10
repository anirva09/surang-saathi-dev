"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, ListChecks, ScrollText, Gauge } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageProvider";
import type { MessageKey } from "@/i18n/messages.en";
import type {
  DashboardSummaryOut,
  HazardListItemOut,
} from "@/lib/api/contract";
import type { ApiFailure } from "@/lib/api/failure";
import { WorkspaceHeading } from "@/components/layout/WorkspaceShell";
import { KpiTiles } from "./KpiTiles";
import { RiskSummaryPanel } from "./RiskSummaryPanel";
import { HazardCard } from "@/components/hazards/HazardCard";
import { EmptyState } from "@/components/state/EmptyState";
import { InlineApiError } from "@/components/state/ApiErrorState";
import { SectionHeading } from "@/components/ui/SectionHeading";

interface NextStep {
  href: string;
  label: MessageKey;
  help: MessageKey;
  icon: typeof ListChecks;
}

const NEXT_STEPS: NextStep[] = [
  {
    href: "/hazards",
    label: "dash.next.hazards",
    help: "dash.next.hazards.help",
    icon: ListChecks,
  },
  {
    href: "/risk",
    label: "dash.next.risk",
    help: "dash.next.risk.help",
    icon: Gauge,
  },
  {
    href: "/audit",
    label: "dash.next.audit",
    help: "dash.next.audit.help",
    icon: ScrollText,
  },
];

export interface DashboardViewProps {
  summary: DashboardSummaryOut;
  /**
   * The hazards needing attention first. Fetched separately, so its own failure
   * is shown in place without costing the page its KPIs.
   */
  attention: HazardListItemOut[] | null;
  attentionFailure: ApiFailure | null;
}

export function DashboardView({
  summary,
  attention,
  attentionFailure,
}: DashboardViewProps) {
  const { t, formatDateTime } = useLanguage();
  const { mine } = summary;

  return (
    <div className="flex flex-col gap-10">
      <WorkspaceHeading
        title={t("dash.title")}
        description={t("dash.subtitle", { mine: mine.name })}
        meta={t("dash.asOf", { timestamp: formatDateTime(summary.asOf) })}
      />

      {/* Mine identity comes from the API, so the screen can never be vague
          about which mine the figures below belong to. */}
      <dl className="flex flex-wrap gap-x-8 gap-y-2 border-y border-border py-3 text-[0.875rem]">
        <div className="flex gap-2">
          <dt className="text-textMuted">{t("domain.mine")}</dt>
          <dd className="font-medium text-text">
            {mine.name}{" "}
            <span className="font-mono text-[0.8125rem] text-textMuted">
              ({mine.code})
            </span>
          </dd>
        </div>
        <div className="flex gap-2">
          <dt className="text-textMuted">{t("domain.area")}</dt>
          <dd className="font-medium text-text">{mine.areaName}</dd>
        </div>
      </dl>

      <KpiTiles kpis={summary.kpis} />

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.7fr)_minmax(19rem,1fr)] gap-6 items-start">
        <section aria-labelledby="attention-heading">
          <SectionHeading
            id="attention-heading"
            title={t("dash.next.hazards")}
            description={t("dash.next.hazards.help")}
            action={{ label: t("work.nav.hazards"), href: "/hazards" }}
          />

          <div className="mt-4">
            {attentionFailure ? (
              <InlineApiError failure={attentionFailure} />
            ) : attention && attention.length > 0 ? (
              <ul className="flex flex-col gap-3">
                {attention.map((hazard) => (
                  <HazardCard key={hazard.hazardId} hazard={hazard} />
                ))}
              </ul>
            ) : (
              <EmptyState bodyKey="state.empty.hazards" />
            )}
          </div>
        </section>

        <RiskSummaryPanel risk={summary.risk} />
      </div>

      <section aria-labelledby="next-heading">
        <h2
          id="next-heading"
          className="text-[1.375rem] font-bold tracking-tight text-text"
        >
          {t("dash.next.heading")}
        </h2>

        <ul className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {NEXT_STEPS.map(({ href, label, help, icon: Icon }) => (
            <li key={href} className="min-w-0">
              <Link
                href={href}
                className="group flex flex-col h-full bg-surface border border-border rounded-sm p-4 hover:bg-black/[0.02] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <span
                  className="inline-flex items-center justify-center w-8 h-8 rounded-sm bg-primary/10 text-primary"
                  aria-hidden="true"
                >
                  <Icon className="w-4 h-4" />
                </span>
                <span className="mt-3 text-[0.9375rem] font-bold text-text">
                  {t(label)}
                </span>
                <span className="mt-1.5 text-[0.8125rem] leading-snug text-textMuted">
                  {t(help)}
                </span>
                <span
                  className="mt-auto pt-3 inline-flex items-center text-primary"
                  aria-hidden="true"
                >
                  <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
