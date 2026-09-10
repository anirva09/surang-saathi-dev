import React from "react";
import type { Metadata } from "next";
import { WorkspaceShell } from "@/components/layout/WorkspaceShell";
import { RiskView } from "@/components/risk/RiskView";
import { ApiErrorState } from "@/components/state/ApiErrorState";
import { DEMO_MINE_ID } from "@/lib/api/client";
import { getDashboardSummary, getLatestMineRisk } from "@/lib/api/endpoints";
import { toApiFailure } from "@/lib/api/failure";
import type { RiskSnapshotOut } from "@/lib/api/contract";
import { recalculateRiskAction } from "./actions";

export const metadata: Metadata = {
  title: "Mine Risk Index — Surang Saathi",
  description:
    "The explainable, rule-based mine risk index with every factor, weight and contribution, read from the Surang Saathi API. SIH 2026 prototype.",
};

export const dynamic = "force-dynamic";

export default async function RiskPage() {
  let snapshot: RiskSnapshotOut;
  try {
    snapshot = await getLatestMineRisk(DEMO_MINE_ID);
  } catch (error) {
    // The contract returns 404 both for an unknown mine and for a mine with no
    // snapshot yet. Either way the honest answer is that there is nothing to
    // show, with the backend's own message saying which.
    return (
      <WorkspaceShell>
        <ApiErrorState as="h1" failure={toApiFailure(error)} />
      </WorkspaceShell>
    );
  }

  let mineName = DEMO_MINE_ID;
  try {
    mineName = (await getDashboardSummary(DEMO_MINE_ID)).mine.name;
  } catch {
    // Fall back to the identifier rather than inventing a name.
  }

  return (
    <WorkspaceShell>
      <RiskView
        snapshot={snapshot}
        mineName={mineName}
        recalculate={recalculateRiskAction}
      />
    </WorkspaceShell>
  );
}
