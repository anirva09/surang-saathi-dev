import React from "react";
import { Info } from "lucide-react";
import { cn } from "@/utils/cn";

/**
 * Government context appears on this page, so the prototype status must be
 * unmissable. Calm, not alarming — this is a statement of fact, not a warning.
 */
export function PrototypeNotice({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "w-full bg-accent/15 border-b border-accent/40",
        className
      )}
    >
      <div className="mx-auto max-w-[1440px] px-4 md:px-8 py-1.5">
        <p className="flex items-start gap-2 text-[0.75rem] leading-snug text-warningInk">
          <Info className="w-3.5 h-3.5 mt-px shrink-0" aria-hidden="true" />
          <span>
            <span className="font-bold">SIH 2026 prototype.</span> Surang Saathi
            is a student project and is not an official Government of India
            service. All figures shown are synthetic demonstration data.
          </span>
        </p>
      </div>
    </div>
  );
}
