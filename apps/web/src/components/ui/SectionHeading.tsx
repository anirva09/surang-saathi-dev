"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/utils/cn";

export interface SectionHeadingProps {
  id: string;
  title: string;
  description?: string;
  action?: { label: string; href: string };
  className?: string;
}

/**
 * Section title with an optional trailing link, matching the Golden Master's
 * "Key Features … Explore All Features →" pattern. Strings are passed in
 * already localized by the calling section.
 */
export function SectionHeading({
  id,
  title,
  description,
  action,
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2",
        className
      )}
    >
      <div className="min-w-0">
        <h2 id={id} className="text-[1.375rem] font-bold tracking-tight text-text">
          {title}
        </h2>
        {description && (
          <p className="mt-1.5 max-w-[70ch] text-[0.875rem] leading-snug text-textMuted">
            {description}
          </p>
        )}
      </div>

      {action && (
        <Link
          href={action.href}
          className="inline-flex items-center gap-1.5 shrink-0 min-h-[40px] text-[0.8125rem] font-medium text-primary hover:underline underline-offset-2 rounded-sm"
        >
          {action.label}
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </Link>
      )}
    </div>
  );
}
