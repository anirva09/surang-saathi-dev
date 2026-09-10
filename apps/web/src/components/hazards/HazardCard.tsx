"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, Camera, ListChecks, MapPin } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageProvider";
import type { HazardListItemOut } from "@/lib/api/contract";
import {
  GeofenceBadge,
  LifecycleBadge,
  SeverityBadge,
  SyncBadge,
} from "@/components/domain/DomainBadges";

/**
 * One hazard as a card that lays out as a row on wide screens.
 *
 * A card list rather than a data table: it carries the same fields without a
 * horizontal scrollbar at 360px, and it keeps one DOM node per hazard, so
 * assistive technology never hears the register twice.
 *
 * Identifiers, coordinates and timestamps are never translated — only the
 * enum labels and the field captions are.
 */
export function HazardCard({ hazard }: { hazard: HazardListItemOut }) {
  const { t, formatNumber, formatDateTime } = useLanguage();

  return (
    <li className="min-w-0">
      <article className="bg-surface border border-border rounded-sm">
        <div className="p-4 flex flex-col gap-3 lg:flex-row lg:items-start lg:gap-5">
          <div className="min-w-0 lg:flex-1">
            <p className="font-mono text-[0.75rem] text-textMuted">
              {hazard.hazardId}
            </p>

            <h3 className="mt-1 text-[1rem] font-bold leading-snug text-text">
              <Link
                href={`/hazards/${encodeURIComponent(hazard.hazardId)}`}
                aria-label={t("hazards.open", { id: hazard.hazardId })}
                className="hover:underline underline-offset-2 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                {hazard.title}
              </Link>
            </h3>

            <p className="mt-1.5 inline-flex items-center gap-1.5 text-[0.8125rem] text-textMuted">
              <MapPin className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              {hazard.locationName}
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <SeverityBadge severity={hazard.severity} />
              <LifecycleBadge status={hazard.status} />
            </div>
          </div>

          <dl className="min-w-0 lg:w-[15rem] grid grid-cols-2 lg:grid-cols-1 gap-x-4 gap-y-1.5 text-[0.8125rem]">
            <div className="min-w-0">
              <dt className="text-textMuted">{t("domain.assignedTo")}</dt>
              <dd className="font-medium text-text truncate">
                {hazard.assignedTo?.name ?? t("domain.unassigned")}
              </dd>
            </div>
            <div className="min-w-0">
              <dt className="text-textMuted">{t("domain.reportedBy")}</dt>
              <dd className="text-text truncate">{hazard.reportedBy.name}</dd>
            </div>
            <div className="min-w-0 col-span-2 lg:col-span-1">
              <dt className="text-textMuted">{t("domain.capturedAt")}</dt>
              <dd className="text-text">{formatDateTime(hazard.capturedAt)}</dd>
            </div>
          </dl>

          <div className="min-w-0 lg:w-[13rem] flex flex-col gap-2">
            <SyncBadge state={hazard.syncState} />
            <GeofenceBadge state={hazard.geofenceState} />

            <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[0.75rem] text-textMuted">
              <span className="inline-flex items-center gap-1">
                <Camera className="w-3.5 h-3.5" aria-hidden="true" />
                {t("domain.evidenceCount")}:{" "}
                <span className="tabular-nums">
                  {formatNumber(hazard.evidenceCount)}
                </span>
              </span>
              <span className="inline-flex items-center gap-1">
                <ListChecks className="w-3.5 h-3.5" aria-hidden="true" />
                {t("domain.actionCount")}:{" "}
                <span className="tabular-nums">
                  {formatNumber(hazard.correctiveActionCount)}
                </span>
              </span>
            </p>
          </div>

          <Link
            href={`/hazards/${encodeURIComponent(hazard.hazardId)}`}
            aria-label={t("hazards.open", { id: hazard.hazardId })}
            className="shrink-0 inline-flex items-center justify-center min-h-[44px] min-w-[44px] self-start rounded-sm text-primary hover:bg-black/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <ChevronRight className="w-5 h-5" aria-hidden="true" />
          </Link>
        </div>
      </article>
    </li>
  );
}
