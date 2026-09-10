import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  ClipboardList,
  FileSearch,
  GaugeCircle,
  ScrollText,
  ShieldAlert,
  Wrench,
} from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { CORE_SERVICES, type ServiceCard } from "@/data/demo/home";

const ICONS: Record<ServiceCard["icon"], typeof GaugeCircle> = {
  dashboard: GaugeCircle,
  hazard: ShieldAlert,
  inspection: ClipboardList,
  action: Wrench,
  compliance: FileSearch,
  audit: ScrollText,
};

export function ServiceGrid() {
  return (
    <section aria-labelledby="services-heading" className="w-full bg-background">
      <div className="mx-auto max-w-[1440px] px-4 md:px-8 py-10">
        <SectionHeader
          id="services-heading"
          title="Core services"
          description="Each service is a working area of the platform, not a brochure page."
          action={{ label: "Help & resources", href: "/help" }}
        />

        <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {CORE_SERVICES.map((service) => {
            const Icon = ICONS[service.icon];
            return (
              <li key={service.id} className="min-w-0">
                <Link
                  href={service.href}
                  className="group flex flex-col h-full border border-border bg-surface rounded-[2px] p-5 hover:border-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <span
                    className="inline-flex items-center justify-center w-10 h-10 rounded-[2px] bg-primary/10 text-primary"
                    aria-hidden="true"
                  >
                    <Icon className="w-5 h-5" />
                  </span>

                  <span className="mt-4 text-[1rem] font-bold leading-tight text-text">
                    {service.title}
                  </span>

                  <span className="mt-2 text-[0.8125rem] leading-snug text-text/80">
                    {service.description}
                  </span>

                  <span className="mt-4 inline-flex items-center gap-1.5 text-[0.8125rem] font-medium text-primary group-hover:underline underline-offset-2">
                    Open
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
