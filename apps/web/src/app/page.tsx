import React from "react";
import { PortalMasthead } from "@/components/layout/PortalMasthead";
import { PortalFooter } from "@/components/layout/PortalFooter";
import { Hero } from "@/components/home/Hero";
import { MetricsStrip } from "@/components/home/MetricsStrip";
import { AttentionSection } from "@/components/home/AttentionSection";
import { ServiceGrid } from "@/components/home/ServiceGrid";
import { TrustPanel } from "@/components/home/TrustPanel";
import { WorkflowProof } from "@/components/home/WorkflowProof";

export default function HomePage() {
  return (
    <>
      <PortalMasthead />

      <main id="main-content" tabIndex={-1}>
        <Hero />
        <MetricsStrip />
        <AttentionSection />
        <ServiceGrid />
        <TrustPanel />
        <WorkflowProof />
      </main>

      <PortalFooter />
    </>
  );
}
