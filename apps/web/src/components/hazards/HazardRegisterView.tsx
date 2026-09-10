"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageProvider";
import type { HazardListResponse } from "@/lib/api/contract";
import { WorkspaceHeading } from "@/components/layout/WorkspaceShell";
import { HazardFilters } from "./HazardFilters";
import { HazardCard } from "./HazardCard";
import { EmptyState } from "@/components/state/EmptyState";
import { cn } from "@/utils/cn";

export interface HazardRegisterViewProps {
  page: HazardListResponse;
  mineName: string;
  severity: string;
  status: string;
}

/** Builds a register URL that keeps the active filters while moving pages. */
function pageHref(offset: number, severity: string, status: string): string {
  const params = new URLSearchParams();
  if (severity) params.set("severity", severity);
  if (status) params.set("status", status);
  if (offset > 0) params.set("offset", String(offset));
  const query = params.toString();
  return query ? `/hazards?${query}` : "/hazards";
}

export function HazardRegisterView({
  page,
  mineName,
  severity,
  status,
}: HazardRegisterViewProps) {
  const { t, formatNumber } = useLanguage();
  const { items, total, limit, offset } = page;

  const pageCount = Math.max(1, Math.ceil(total / limit));
  const currentPage = Math.floor(offset / limit) + 1;
  const hasPrev = offset > 0;
  const hasNext = offset + items.length < total;

  return (
    <div className="flex flex-col gap-6">
      <WorkspaceHeading
        title={t("hazards.title")}
        description={t("hazards.subtitle", { mine: mineName })}
      />

      <HazardFilters severity={severity} status={status} />

      {/* The count is announced politely, so filtering tells a screen-reader
          user how many records survived without stealing focus. */}
      <p aria-live="polite" className="text-[0.875rem] text-textMuted">
        {t("hazards.showing", {
          shown: formatNumber(items.length),
          total: formatNumber(total),
        })}
      </p>

      {items.length === 0 ? (
        <EmptyState bodyKey="state.empty.hazards" />
      ) : (
        <ul className="flex flex-col gap-3">
          {items.map((hazard) => (
            <HazardCard key={hazard.hazardId} hazard={hazard} />
          ))}
        </ul>
      )}

      {pageCount > 1 && (
        <nav
          aria-label={t("hazards.page", {
            page: formatNumber(currentPage),
            pages: formatNumber(pageCount),
          })}
          className="flex items-center justify-between gap-3 border-t border-border pt-4"
        >
          <PageLink
            href={pageHref(Math.max(0, offset - limit), severity, status)}
            enabled={hasPrev}
            label={t("hazards.prev")}
            direction="prev"
          />

          <p className="text-[0.8125rem] text-textMuted tabular-nums">
            {t("hazards.page", {
              page: formatNumber(currentPage),
              pages: formatNumber(pageCount),
            })}
          </p>

          <PageLink
            href={pageHref(offset + limit, severity, status)}
            enabled={hasNext}
            label={t("hazards.next")}
            direction="next"
          />
        </nav>
      )}
    </div>
  );
}

/**
 * A disabled pager reads as text rather than a dead link — a link that goes
 * nowhere is worse for keyboard users than no link at all.
 */
function PageLink({
  href,
  enabled,
  label,
  direction,
}: {
  href: string;
  enabled: boolean;
  label: string;
  direction: "prev" | "next";
}) {
  const Icon = direction === "prev" ? ChevronLeft : ChevronRight;
  const content = (
    <>
      {direction === "prev" && <Icon className="w-4 h-4" aria-hidden="true" />}
      {label}
      {direction === "next" && <Icon className="w-4 h-4" aria-hidden="true" />}
    </>
  );

  const classes = cn(
    "inline-flex items-center gap-1.5 min-h-[44px] px-3 rounded-sm text-[0.875rem] font-medium",
    enabled
      ? "text-primary hover:bg-black/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      : "text-textMuted/60"
  );

  if (!enabled) {
    return (
      <span className={classes} aria-hidden="true">
        {content}
      </span>
    );
  }

  return (
    <Link href={href} className={classes}>
      {content}
    </Link>
  );
}
