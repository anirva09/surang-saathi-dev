"use client";

import React from "react";
import { useT } from "@/i18n/LanguageProvider";
import { Button } from "@/components/ui/Button";
import { ButtonLink } from "@/components/ui/ButtonLink";
import {
  HAZARD_SEVERITIES,
  LIFECYCLE_STATUSES,
} from "@/lib/api/contract";
import type { MessageKey } from "@/i18n/messages.en";

export interface HazardFiltersProps {
  severity: string;
  status: string;
}

/**
 * Filters submit as a plain GET form, so the register's state lives in the URL:
 * a filtered view can be linked, bookmarked and reloaded, and the server
 * re-queries the API with the contract's own `severity` and `status` parameters.
 *
 * The option values are the backend's enum members verbatim — the label is
 * translated, the value never is.
 */
export function HazardFilters({ severity, status }: HazardFiltersProps) {
  const t = useT();

  return (
    <form
      method="get"
      action="/hazards"
      aria-labelledby="filters-heading"
      className="border border-border bg-surface rounded-sm p-4"
    >
      <h2
        id="filters-heading"
        className="text-[0.8125rem] font-bold uppercase tracking-wider text-text"
      >
        {t("hazards.filter.heading")}
      </h2>

      <div className="mt-3 flex flex-col sm:flex-row sm:items-end gap-3">
        <div className="flex flex-col gap-1.5 min-w-0 sm:w-[13rem]">
          <label
            htmlFor="filter-severity"
            className="text-[0.8125rem] font-medium text-text"
          >
            {t("hazards.filter.severity")}
          </label>
          <select
            id="filter-severity"
            name="severity"
            defaultValue={severity}
            className="min-h-[44px] px-3 bg-surfaceStrong border border-border rounded-sm text-[0.875rem] text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <option value="">{t("hazards.filter.any")}</option>
            {HAZARD_SEVERITIES.map((value) => (
              <option key={value} value={value}>
                {t(`domain.severity.${value}` as MessageKey)}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5 min-w-0 sm:w-[13rem]">
          <label
            htmlFor="filter-status"
            className="text-[0.8125rem] font-medium text-text"
          >
            {t("hazards.filter.status")}
          </label>
          <select
            id="filter-status"
            name="status"
            defaultValue={status}
            className="min-h-[44px] px-3 bg-surfaceStrong border border-border rounded-sm text-[0.875rem] text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <option value="">{t("hazards.filter.any")}</option>
            {LIFECYCLE_STATUSES.map((value) => (
              <option key={value} value={value}>
                {t(`domain.status.${value}` as MessageKey)}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 sm:ml-auto">
          <Button type="submit" variant="primary" size="lg">
            {t("hazards.filter.apply")}
          </Button>
          {(severity || status) && (
            <ButtonLink href="/hazards" variant="secondary" size="lg">
              {t("hazards.filter.clear")}
            </ButtonLink>
          )}
        </div>
      </div>
    </form>
  );
}
