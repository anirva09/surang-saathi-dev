import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ATTENTION_ITEMS } from "@/data/demo/home";

export function AttentionSection() {
  return (
    <section
      aria-labelledby="attention-heading"
      className="w-full bg-background"
    >
      <div className="mx-auto max-w-[1440px] px-4 md:px-8 py-10">
        <SectionHeader
          id="attention-heading"
          title="What needs attention"
          description="The four queues a safety officer should clear before the end of this shift."
          action={{ label: "Open safety dashboard", href: "/dashboard" }}
        />

        <ul className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
          {ATTENTION_ITEMS.map((item) => (
            <li
              key={item.id}
              className="flex flex-col border border-border bg-surface rounded-[2px] p-5 min-w-0"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-[1rem] font-bold leading-tight text-text min-w-0">
                  {item.title}
                </h3>
                <StatusBadge
                  status={item.statusTone}
                  label={item.statusLabel}
                  className="shrink-0"
                />
              </div>

              <p className="mt-3 flex items-baseline gap-2">
                <span className="text-[1.875rem] font-bold leading-none tracking-tight text-text tabular-nums">
                  {item.count}
                </span>
                <span className="text-[0.8125rem] text-text/80">
                  {item.countLabel}
                </span>
              </p>

              <p className="mt-3 text-[0.8125rem] leading-snug text-text/80 break-words">
                {item.scope}
              </p>
              <p className="mt-1.5 text-[0.8125rem] leading-snug text-text/80">
                {item.detail}
              </p>

              <Link
                href={item.href}
                className="mt-4 inline-flex items-center gap-1.5 self-start min-h-[40px] text-[0.875rem] font-medium text-primary underline underline-offset-2 rounded-[2px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                {item.ctaLabel}
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
