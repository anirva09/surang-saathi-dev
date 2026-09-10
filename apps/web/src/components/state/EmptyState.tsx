"use client";

import React from "react";
import { Inbox } from "lucide-react";
import { useT } from "@/i18n/LanguageProvider";
import type { MessageKey } from "@/i18n/messages.en";
import { cn } from "@/utils/cn";

export interface EmptyStateProps {
  /** Which "nothing here" sentence to show — always a real explanation. */
  bodyKey: MessageKey;
  className?: string;
}

/**
 * An empty register is a fact, not a failure: this says so plainly and is
 * visually distinct from the error state so the two are never confused.
 */
export function EmptyState({ bodyKey, className }: EmptyStateProps) {
  const t = useT();

  return (
    <div
      className={cn(
        "border border-dashed border-border bg-utility rounded-sm p-6 text-center",
        className
      )}
    >
      <span
        className="inline-flex items-center justify-center w-10 h-10 rounded-sm bg-border/40 text-textMuted"
        aria-hidden="true"
      >
        <Inbox className="w-5 h-5" />
      </span>
      <p className="mt-3 text-[0.9375rem] font-medium text-text">
        {t("state.empty.title")}
      </p>
      <p className="mt-1 text-[0.875rem] text-textMuted">{t(bodyKey)}</p>
    </div>
  );
}
