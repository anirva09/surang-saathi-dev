import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/utils/cn";

export interface SectionHeaderProps {
  id?: string;
  title: string;
  description?: string;
  action?: { label: string; href: string };
  className?: string;
}

export function SectionHeader({
  id,
  title,
  description,
  action,
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 pb-4 border-b border-border",
        className
      )}
    >
      <div className="min-w-0">
        <h2 id={id} className="text-[1.25rem] font-bold tracking-tight text-text">
          {title}
        </h2>
        {description && (
          <p className="mt-1 text-[0.875rem] leading-snug text-text/80 max-w-[70ch]">
            {description}
          </p>
        )}
      </div>

      {action && (
        <Link
          href={action.href}
          className="inline-flex items-center gap-1.5 shrink-0 min-h-[40px] text-[0.875rem] font-medium text-primary underline underline-offset-2 rounded-[2px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          {action.label}
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </Link>
      )}
    </div>
  );
}
