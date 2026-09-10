"use client";

import React from "react";
import { Info } from "lucide-react";
import { cn } from "@/utils/cn";
import { useT } from "@/i18n/LanguageProvider";

/**
 * Government context appears on this page, so the project's status must be
 * unmissable. Calm and factual, not a warning.
 */
export function PrototypeNotice({ className }: { className?: string }) {
  const t = useT();

  return (
    <div className={cn("w-full bg-accent/15 border-b border-accent/40", className)}>
      <div className="mx-auto max-w-content px-4 md:px-6 py-1.5">
        <p className="flex items-start gap-2 text-[0.75rem] leading-snug text-warningInk">
          <Info className="w-3.5 h-3.5 mt-px shrink-0" aria-hidden="true" />
          <span>
            <span className="font-bold">{t("proto.title")}</span>{" "}
            {t("proto.body")}
          </span>
        </p>
      </div>
    </div>
  );
}
