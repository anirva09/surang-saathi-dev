import React from "react";
import type { Metadata } from "next";
import { PortalMasthead } from "@/components/layout/PortalMasthead";
import { PortalFooter } from "@/components/layout/PortalFooter";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { KpiGrid } from "@/components/dashboard/KpiGrid";
import { PriorityActionQueue } from "@/components/dashboard/PriorityActionQueue";
import { MineRiskPanel } from "@/components/dashboard/MineRiskPanel";
import { ComplianceDeadlines } from "@/components/dashboard/ComplianceDeadlines";
import { EvidenceExceptions } from "@/components/dashboard/EvidenceExceptions";
import { RecentSafetyActivity } from "@/components/dashboard/RecentSafetyActivity";

export const metadata: Metadata = {
  title: "Safety Dashboard — Surang Saathi",
  description:
    "Priority safety, compliance and corrective-action status for the selected mine. SIH 2026 prototype with synthetic demonstration data.",
};

export default function DashboardPage() {
  return (
    <>
      <PortalMasthead />

      <main id="main-content" tabIndex={-1} className="bg-background">
        <DashboardHeader />

        <div className="mx-auto max-w-[1440px] px-4 md:px-8 py-6 flex flex-col gap-8">
          <KpiGrid />

          {/* Decision area: the queue leads, risk supports it. */}
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.8fr)_minmax(300px,1fr)] gap-6 items-start">
            <PriorityActionQueue />
            <MineRiskPanel />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            <ComplianceDeadlines />
            <EvidenceExceptions />
          </div>

          <RecentSafetyActivity />
        </div>
      </main>

      <PortalFooter />
    </>
  );
}
