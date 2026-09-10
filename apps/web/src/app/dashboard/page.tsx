import React from "react";
import type { Metadata } from "next";
import { WorkspaceShell } from "@/components/layout/WorkspaceShell";
import { DashboardView } from "@/components/dashboard/DashboardView";
import { ApiErrorState } from "@/components/state/ApiErrorState";
import { DEMO_MINE_ID } from "@/lib/api/client";
import { getDashboardSummary, listHazards } from "@/lib/api/endpoints";
import { toApiFailure, type ApiFailure } from "@/lib/api/failure";
import type {
  DashboardSummaryOut,
  HazardListItemOut,
} from "@/lib/api/contract";

export const metadata: Metadata = {
  title: "Safety Dashboard — Surang Saathi",
  description:
    "Live safety, compliance and corrective-action position for the selected mine, read from the Surang Saathi API. SIH 2026 prototype.",
};

/**
 * Rendered per request: safety figures are never served from a cache.
 */
export const dynamic = "force-dynamic";

/**
 * The dashboard reads the API on the server. If the API is down the page shows
 * an error state that names the failure — it does not fall back to demonstration
 * data, because a dashboard that invents its numbers is worse than one that
 * admits it has none.
 *
 * The summary is required; the attention list is supporting detail, so its own
 * failure is reported in place rather than replacing the whole screen.
 */
export default async function DashboardPage() {
  const [summaryResult, hazardsResult] = await Promise.allSettled([
    getDashboardSummary(DEMO_MINE_ID),
    listHazards({ mineId: DEMO_MINE_ID, limit: 5 }),
  ]);

  if (summaryResult.status === "rejected") {
    return (
      <WorkspaceShell>
        <ApiErrorState as="h1" failure={toApiFailure(summaryResult.reason)} />
      </WorkspaceShell>
    );
  }

  const summary: DashboardSummaryOut = summaryResult.value;

  let attention: HazardListItemOut[] | null = null;
  let attentionFailure: ApiFailure | null = null;
  if (hazardsResult.status === "fulfilled") {
    attention = hazardsResult.value.items;
  } else {
    attentionFailure = toApiFailure(hazardsResult.reason);
  }

  return (
    <WorkspaceShell>
      <DashboardView
        summary={summary}
        attention={attention}
        attentionFailure={attentionFailure}
      />
    </WorkspaceShell>
  );
}
