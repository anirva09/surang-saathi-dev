import React from "react";
import type { Metadata } from "next";
import { WorkspaceShell } from "@/components/layout/WorkspaceShell";
import { HazardDetailView } from "@/components/hazards/HazardDetailView";
import { ApiErrorState } from "@/components/state/ApiErrorState";
import { PROTOTYPE_ACTOR_ID } from "@/lib/api/client";
import { getHazard } from "@/lib/api/endpoints";
import { toApiFailure } from "@/lib/api/failure";
import type { HazardDetailOut } from "@/lib/api/contract";
import {
  acknowledgeCorrectiveActionAction,
  acknowledgeHazardAction,
  createCorrectiveActionAction,
  resolveCorrectiveActionAction,
  reviewHazardAction,
  uploadEvidenceAction,
} from "./actions";

export const metadata: Metadata = {
  title: "Hazard — Surang Saathi",
  description:
    "A single reported hazard with its evidence, corrective actions and manager decisions, read from the Surang Saathi API. SIH 2026 prototype.",
};

export const dynamic = "force-dynamic";

export default async function HazardDetailPage({
  params,
}: {
  params: { hazardId: string };
}) {
  const hazardId = decodeURIComponent(params.hazardId);

  let hazard: HazardDetailOut;
  try {
    hazard = await getHazard(hazardId);
  } catch (error) {
    // A 404 from the API renders the not-found state with the backend's own
    // message, rather than Next's generic 404 — the distinction between "no such
    // hazard" and "the API is down" matters to the person looking at it.
    return (
      <WorkspaceShell>
        <ApiErrorState as="h1" failure={toApiFailure(error)} />
      </WorkspaceShell>
    );
  }

  return (
    <WorkspaceShell>
      <HazardDetailView
        hazard={hazard}
        actorId={PROTOTYPE_ACTOR_ID}
        actions={{
          acknowledge: acknowledgeHazardAction,
          review: reviewHazardAction,
          createAction: createCorrectiveActionAction,
          resolveAction: resolveCorrectiveActionAction,
          acknowledgeAction: acknowledgeCorrectiveActionAction,
          uploadEvidence: uploadEvidenceAction,
        }}
      />
    </WorkspaceShell>
  );
}
