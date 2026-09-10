import React from "react";
import Link from "next/link";
import { SurangMark } from "./SurangMark";

const COLUMNS: { heading: string; links: { label: string; href: string }[] }[] =
  [
    {
      heading: "About Surang Saathi",
      links: [
        { label: "What the platform does", href: "/about" },
        { label: "Why it exists", href: "/about#problem" },
        { label: "Build state & roadmap", href: "/about#roadmap" },
        { label: "Contact the team", href: "/contact" },
      ],
    },
    {
      heading: "Safety & Compliance",
      links: [
        { label: "Safety Dashboard", href: "/dashboard" },
        { label: "Hazard Register", href: "/hazards" },
        { label: "Corrective Actions", href: "/corrective-actions" },
        { label: "Compliance Obligations", href: "/compliance" },
        { label: "Audit Ledger", href: "/audit" },
      ],
    },
    {
      heading: "Help & Resources",
      links: [
        { label: "Guide for field teams", href: "/help/field-teams" },
        { label: "Guide for managers", href: "/help/managers" },
        { label: "Offline & sync behaviour", href: "/help/offline-sync" },
        { label: "Report a problem", href: "/help/report-a-problem" },
      ],
    },
    {
      heading: "Policies",
      links: [
        { label: "Accessibility Statement", href: "/accessibility" },
        { label: "Privacy", href: "/privacy" },
        { label: "Terms of Use", href: "/terms" },
        { label: "Demo data disclaimer", href: "/about#demo-data" },
      ],
    },
  ];

export function PortalFooter() {
  return (
    <footer className="w-full bg-text text-surface border-t border-surface/20">
      <div className="mx-auto max-w-[1440px] px-4 md:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {COLUMNS.map((column) => (
            <div key={column.heading} className="flex flex-col gap-3 min-w-0">
              <h2 className="text-[0.8125rem] font-bold uppercase tracking-wider text-accent">
                {column.heading}
              </h2>
              <ul className="flex flex-col gap-2">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="inline-flex text-[0.875rem] leading-snug text-surface/90 hover:text-surface hover:underline underline-offset-2 rounded-[2px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-surface/20">
        <div className="mx-auto max-w-[1440px] px-4 md:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex items-start gap-3 min-w-0">
              <SurangMark className="w-9 h-9 shrink-0" />
              <div className="min-w-0">
                <p className="text-[0.875rem] font-bold leading-tight">
                  सुरंग साथी · Surang Saathi
                </p>
                <p className="text-[0.75rem] text-surface/80 leading-snug mt-0.5">
                  Smart Mine Safety &amp; Compliance Platform
                </p>
              </div>
            </div>

            <div className="max-w-2xl">
              <p className="text-[0.75rem] leading-relaxed text-surface/80">
                <span className="font-bold text-surface">
                  Prototype disclaimer.
                </span>{" "}
                Surang Saathi is a Smart India Hackathon 2026 student prototype.
                It is not an official Government of India, Ministry of Coal,
                Coal India or DGMS service, and it carries no government
                endorsement. Every hazard, inspection, deadline and risk figure
                on this site is synthetic demonstration data. No live sensor,
                regulatory or production system is connected.
              </p>
              <p className="text-[0.75rem] text-surface/70 mt-3">
                Current milestone: Web MVP — portal homepage and manager safety
                dashboard. The hazard register, inspection register, corrective
                actions, compliance and audit ledger screens are not yet
                implemented.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
