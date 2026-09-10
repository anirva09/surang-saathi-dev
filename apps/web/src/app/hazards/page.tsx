import React from "react";
import type { Metadata } from "next";
import { WorkspaceShell } from "@/components/layout/WorkspaceShell";
import { HazardRegisterView } from "@/components/hazards/HazardRegisterView";
import { ApiErrorState } from "@/components/state/ApiErrorState";
import { DEMO_MINE_ID } from "@/lib/api/client";
import { getDashboardSummary, listHazards } from "@/lib/api/endpoints";
import { toApiFailure } from "@/lib/api/failure";
import {
  isHazardSeverity,
  isLifecycleStatus,
  type HazardListResponse,
} from "@/lib/api/contract";

export const metadata: Metadata = {
  title: "Hazard Register — Surang Saathi",
  description:
    "Every hazard reported at the selected mine with its owner, evidence and sync state, read from the Surang Saathi API. SIH 2026 prototype.",
};

export const dynamic = "force-dynamic";

/** The contract caps `limit` at 100; the register pages at 20. */
const PAGE_SIZE = 20;

/**
 * Only values the contract's enums declare are forwarded. A hand-edited query
 * string cannot make the frontend send the API something it never documented —
 * an unrecognised filter is dropped rather than passed through.
 */
function readFilter(
  value: string | string[] | undefined,
  accepts: (candidate: string) => boolean
): string {
  const first = Array.isArray(value) ? value[0] : value;
  return first && accepts(first) ? first : "";
}

function readOffset(value: string | string[] | undefined): number {
  const first = Array.isArray(value) ? value[0] : value;
  const parsed = Number(first);
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : 0;
}

export default async function HazardsPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const severity = readFilter(searchParams.severity, isHazardSeverity);
  const status = readFilter(searchParams.status, isLifecycleStatus);
  const offset = readOffset(searchParams.offset);

  let page: HazardListResponse;
  try {
    page = await listHazards({
      mineId: DEMO_MINE_ID,
      severity: severity || null,
      status: status || null,
      limit: PAGE_SIZE,
      offset,
    });
  } catch (error) {
    return (
      <WorkspaceShell>
        <ApiErrorState as="h1" failure={toApiFailure(error)} />
      </WorkspaceShell>
    );
  }

  // The mine's display name is the dashboard summary's to give. If that call
  // fails the register still renders — it falls back to the mine's identifier,
  // which is a fact, not a substitute figure.
  let mineName = DEMO_MINE_ID;
  try {
    mineName = (await getDashboardSummary(DEMO_MINE_ID)).mine.name;
  } catch {
    // Keep the identifier.
  }

  return (
    <WorkspaceShell>
      <HazardRegisterView
        page={page}
        mineName={mineName}
        severity={severity}
        status={status}
      />
    </WorkspaceShell>
  );
}
