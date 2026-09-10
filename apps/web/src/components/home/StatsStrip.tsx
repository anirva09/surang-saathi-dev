"use client";

import React from "react";
import Link from "next/link";
import {
  ChevronRight,
  ClipboardList,
  Info,
  ShieldCheck,
  TriangleAlert,
  Users,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { SITE_STATS, type SiteStat } from "@/data/site/home";
import { useT } from "@/i18n/LanguageProvider";

const ICONS: Record<SiteStat["icon"], typeof ClipboardList> = {
  inspections: ClipboardList,
  hazards: TriangleAlert,
  users: Users,
  resolved: ShieldCheck,
};

const ICON_TONE: Record<SiteStat["icon"], string> = {
  inspections: "bg-success/10 text-success",
  hazards: "bg-accent/20 text-warningInk",
  users: "bg-stat/10 text-stat",
  resolved: "bg-primary/10 text-primary",
};

/**
 * Credibility strip.
 *
 * The Golden Master's fifth cell reads "Live data across mines in India".
 * These are illustrative prototype figures, so that cell states exactly that
 * instead — same slot, same weight, honest label, in both languages.
 */
export function StatsStrip() {
  const t = useT();

  return (
    <section
      aria-labelledby="stats-heading"
      className="relative z-10 w-full bg-background"
    >
      <div className="mx-auto max-w-content px-4 md:px-6 pb-10 lg:pb-12 lg:-mt-14">
        <h2 id="stats-heading" className="sr-only">
          {t("stats.heading")}
        </h2>

        <div className="border border-border bg-surfaceStrong rounded-sm shadow-card">
          <ul className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-[repeat(4,minmax(0,1fr))_auto]">
            {SITE_STATS.map((stat, i) => {
              const Icon = ICONS[stat.icon];
              return (
                <li
                  key={stat.id}
                  className={cn(
                    "min-w-0",
                    i !== SITE_STATS.length - 1 && "sm:border-r border-borderSoft"
                  )}
                >
                  <Link
                    href={stat.href}
                    className="group flex items-center gap-3 px-4 py-4 min-h-[76px] rounded-sm hover:bg-text/[0.02] transition-colors"
                  >
                    <span
                      className={cn(
                        "shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-sm",
                        ICON_TONE[stat.icon]
                      )}
                      aria-hidden="true"
                    >
                      <Icon className="w-[18px] h-[18px]" />
                    </span>

                    <span className="flex flex-col min-w-0 flex-1">
                      <span className="text-[1.25rem] font-bold leading-none tracking-tight text-stat tabular-nums">
                        {stat.value}
                      </span>
                      <span className="mt-1 text-[0.8125rem] text-textMuted truncate">
                        {t(stat.labelKey)}
                      </span>
                    </span>

                    <ChevronRight
                      className="w-4 h-4 shrink-0 text-textMuted group-hover:text-primary transition-colors"
                      aria-hidden="true"
                    />
                  </Link>
                </li>
              );
            })}

            <li className="flex items-center gap-2 px-4 py-3 border-t sm:border-t-0 xl:border-l border-borderSoft">
              <Info className="w-4 h-4 shrink-0 text-warningInk" aria-hidden="true" />
              <p className="text-[0.75rem] leading-snug text-textMuted xl:max-w-[9rem]">
                {t("stats.disclaimer")}
              </p>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
