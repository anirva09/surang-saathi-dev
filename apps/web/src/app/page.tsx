import React from "react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { GovernmentFooter } from "@/components/layout/GovernmentFooter";
import { HeroSection } from "@/components/home/HeroSection";
import { StatsStrip } from "@/components/home/StatsStrip";
import { FeatureGrid } from "@/components/home/FeatureGrid";
import { CredibilityBand } from "@/components/home/CredibilityBand";

export default function HomePage() {
  return (
    <>
      <SiteHeader />

      <main id="main-content" tabIndex={-1}>
        <HeroSection />
        <StatsStrip />
        <FeatureGrid />
        <CredibilityBand />
      </main>

      <GovernmentFooter />
    </>
  );
}
