import React from "react";
import type { Metadata } from "next";
import { WorkspaceShell } from "@/components/layout/WorkspaceShell";
import { AuditView } from "@/components/audit/AuditView";
import { ApiErrorState } from "@/components/state/ApiErrorState";
import { listAuditEvents, verifyAuditChain } from "@/lib/api/endpoints";
import { toApiFailure, type ApiFailure } from "@/lib/api/failure";
import type {
  AuditEventListResponse,
  AuditVerificationOut,
} from "@/lib/api/contract";

export const metadata: Metadata = {
  title: "Audit Ledger — Surang Saathi",
  description:
    "The append-only, hash-chained record of every change, with its verification verdict, read from the Surang Saathi API. SIH 2026 prototype.",
};

export const dynamic = "force-dynamic";

/** The contract caps `limit` at 200; the ledger shows the newest 50. */
const PAGE_SIZE = 50;

export default async function AuditPage() {
  const [eventsResult, verifyResult] = await Promise.allSettled([
    listAuditEvents({ limit: PAGE_SIZE }),
    verifyAuditChain(),
  ]);

  if (eventsResult.status === "rejected") {
    return (
      <WorkspaceShell>
        <ApiErrorState as="h1" failure={toApiFailure(eventsResult.reason)} />
      </WorkspaceShell>
    );
  }

  const events: AuditEventListResponse = eventsResult.value;

  // Verification is a separate endpoint and a separate claim. If it fails we say
  // the chain is unverified — never that it is intact.
  let verification: AuditVerificationOut | null = null;
  let verificationFailure: ApiFailure | null = null;
  if (verifyResult.status === "fulfilled") {
    verification = verifyResult.value;
  } else {
    verificationFailure = toApiFailure(verifyResult.reason);
  }

  return (
    <WorkspaceShell>
      <AuditView
        events={events}
        verification={verification}
        verificationFailure={verificationFailure}
      />
    </WorkspaceShell>
  );
}
