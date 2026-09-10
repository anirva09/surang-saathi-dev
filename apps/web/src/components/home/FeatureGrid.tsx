"use client";

import React from "react";
import { BarChart3, ClipboardCheck, FileText, MapPin, Users } from "lucide-react";
import { cn } from "@/utils/cn";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FEATURES, type Feature } from "@/data/site/home";
import { useT } from "@/i18n/LanguageProvider";

const ICONS: Record<Feature["icon"], typeof ClipboardCheck> = {
  inspection: ClipboardCheck,
  analytics: BarChart3,
  accountability: Users,
  evidence: MapPin,
  compliance: FileText,
};

const TONE: Record<Feature["tone"], string> = {
  primary: "bg-primary text-surface",
  accent: "bg-accent text-text",
  success: "bg-success text-surface",
  danger: "bg-danger text-surfaceStrong",
  stat: "bg-stat text-surface",
};

export function FeatureGrid() {
  const t = useT();

  return (
    <section
      id="features"
      aria-labelledby="features-heading"
      className="w-full bg-background scroll-mt-24"
    >
      <div className="mx-auto max-w-content px-4 md:px-6 pb-12">
        <SectionHeading
          id="features-heading"
          title={t("features.heading")}
          action={{ label: t("features.exploreAll"), href: "/#features" }}
        />

        <ul className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
          {FEATURES.map((feature) => {
            const Icon = ICONS[feature.icon];
            return (
              <li
                key={feature.id}
                className="flex flex-col h-full min-w-0 border border-border bg-surface rounded-sm p-4 shadow-card"
              >
                <span
                  className={cn(
                    "inline-flex items-center justify-center w-9 h-9 rounded-sm shrink-0",
                    TONE[feature.tone]
                  )}
                  aria-hidden="true"
                >
                  <Icon className="w-[18px] h-[18px]" />
                </span>

                <h3 className="mt-3.5 text-[0.9375rem] font-bold leading-tight text-text">
                  {t(feature.titleKey)}
                </h3>

                <p className="mt-1.5 text-[0.8125rem] leading-snug text-textMuted">
                  {t(feature.bodyKey)}
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
