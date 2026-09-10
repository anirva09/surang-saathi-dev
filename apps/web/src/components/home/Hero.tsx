import React from "react";
import { ArrowRight, ShieldCheck, WifiOff, FileCheck2 } from "lucide-react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { MineSectionPanel } from "./MineSectionPanel";

const PILLARS = ["People", "Safety", "Accountability", "Sustainability"];

const PROOF_POINTS = [
  { icon: WifiOff, label: "Works with no network underground" },
  { icon: ShieldCheck, label: "Evidence verified server-side" },
  { icon: FileCheck2, label: "Append-only audit record" },
];

export function Hero() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="w-full border-b border-border bg-background"
    >
      <div className="mx-auto max-w-[1440px] px-4 md:px-8 py-10 lg:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">
          {/* Left — copy */}
          <div className="flex flex-col min-w-0">
            <p className="text-[0.75rem] font-bold uppercase tracking-[0.18em] text-primary">
              Coal Mine Safety &amp; Governance
            </p>

            <h1
              id="hero-heading"
              className="mt-4 text-[2rem] sm:text-[2.5rem] lg:text-[3rem] font-bold tracking-tight leading-[1.12] text-text"
            >
              Digital Safety
              <span className="block text-primary">
                for India&apos;s Mines
              </span>
            </h1>

            <p className="mt-5 text-[0.9375rem] sm:text-[1rem] leading-relaxed text-text/80 max-w-[58ch]">
              Surang Saathi records hazards and inspections in the field even
              with no network, then verifies the evidence, assigns a named owner
              against a statutory deadline, and writes every step to an
              append-only audit record — so a manager can see what is unsafe,
              what is overdue and who owns it.
            </p>

            <div className="mt-7 flex flex-col sm:flex-row gap-3">
              <ButtonLink href="/dashboard" variant="primary" size="lg">
                Open Safety Dashboard
                <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" />
              </ButtonLink>
              <ButtonLink href="/compliance" variant="secondary" size="lg">
                View Compliance Status
              </ButtonLink>
            </div>

            <ul className="mt-8 flex flex-col sm:flex-row sm:flex-wrap gap-x-6 gap-y-2">
              {PROOF_POINTS.map((point) => {
                const Icon = point.icon;
                return (
                  <li
                    key={point.label}
                    className="flex items-center gap-2 text-[0.8125rem] text-text/80"
                  >
                    <Icon
                      className="w-4 h-4 shrink-0 text-success"
                      aria-hidden="true"
                    />
                    {point.label}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Right — mine-section visual with bilingual identity panel */}
          <div className="relative min-w-0 border border-border rounded-[2px] overflow-hidden bg-surface">
            <MineSectionPanel className="block w-full aspect-[760/452] bg-[#EFE6D2]" />

            <div className="lg:absolute lg:top-6 lg:right-6 lg:w-[268px] border-t lg:border border-border bg-surface p-5">
              <p className="text-[1.1875rem] leading-[1.6] font-bold text-text">
                सुरक्षित खदान,
                <br />
                समृद्ध भारत
              </p>

              <div
                className="mt-3 flex h-[3px] w-24 overflow-hidden"
                aria-hidden="true"
              >
                <span className="flex-1 bg-[#FF9933]" />
                <span className="flex-1 bg-[#F2F2F2]" />
                <span className="flex-1 bg-[#138808]" />
              </div>

              <p className="mt-3 text-[0.875rem] font-medium text-primary">
                Safer Mines · Stronger India
              </p>

              <ul className="mt-4 flex flex-col gap-1.5 border-l-2 border-accent pl-3">
                {PILLARS.map((pillar) => (
                  <li
                    key={pillar}
                    className="text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-text/80"
                  >
                    {pillar}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
