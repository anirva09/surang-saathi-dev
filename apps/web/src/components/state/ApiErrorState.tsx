"use client";

import React from "react";
import { AlertTriangle, CloudOff, FileQuestion, Lock } from "lucide-react";
import { useT } from "@/i18n/LanguageProvider";
import type { MessageKey } from "@/i18n/messages.en";
import type { ApiFailure, ApiFailureKind } from "@/lib/api/failure";
import { Button } from "@/components/ui/Button";
import { cn } from "@/utils/cn";

const COPY: Record<
  ApiFailureKind,
  { title: MessageKey; body: MessageKey; icon: typeof AlertTriangle }
> = {
  unreachable: {
    title: "state.error.unreachable.title",
    body: "state.error.unreachable.body",
    icon: CloudOff,
  },
  notFound: {
    title: "state.error.notFound.title",
    body: "state.error.notFound.body",
    icon: FileQuestion,
  },
  conflict: {
    title: "state.error.conflict.title",
    body: "state.error.conflict.body",
    icon: Lock,
  },
  validation: {
    title: "state.error.validation.title",
    body: "state.error.validation.body",
    icon: AlertTriangle,
  },
  unknown: {
    title: "state.error.generic.title",
    body: "state.error.generic.body",
    icon: AlertTriangle,
  },
};

export interface ApiErrorStateProps {
  failure: ApiFailure;
  /** Heading level, so the state slots into the page outline correctly. */
  as?: "h1" | "h2" | "h3";
  className?: string;
}

/**
 * The single honest failure surface. It names what went wrong, shows the code
 * the backend returned so the failure can be traced, and offers a reload — and
 * it never stands in for data by showing demonstration figures instead.
 *
 * Deliberately NOT `role="alert"`: this is server-rendered page content, not a
 * message that interrupts. Its heading is how assistive technology reaches it,
 * which is the correct affordance for "this page has nothing to show". The
 * interruptive role belongs to `InlineApiError`, which appears in response to
 * something the user just did.
 */
export function ApiErrorState({
  failure,
  as: Heading = "h2",
  className,
}: ApiErrorStateProps) {
  const t = useT();
  const { title, body, icon: Icon } = COPY[failure.kind];

  return (
    <section
      aria-labelledby="api-error-title"
      className={cn(
        "border border-border bg-surface rounded-sm p-6 sm:p-8 shadow-card",
        className
      )}
    >
      <span
        className="inline-flex items-center justify-center w-11 h-11 rounded-sm bg-danger/10 text-dangerInk"
        aria-hidden="true"
      >
        <Icon className="w-5 h-5" />
      </span>

      <Heading
        id="api-error-title"
        className="mt-5 text-[1.375rem] font-bold tracking-tight text-text"
      >
        {t(title)}
      </Heading>

      <p className="mt-3 max-w-[68ch] text-[0.9375rem] leading-relaxed text-textMuted">
        {t(body)}
      </p>

      {failure.kind === "unreachable" && (
        <p className="mt-3 max-w-[68ch] text-[0.875rem] leading-relaxed text-textMuted">
          {t("state.error.unreachable.hint")}
        </p>
      )}

      <dl className="mt-6 grid gap-x-8 gap-y-2 sm:grid-cols-[auto,1fr] text-[0.8125rem]">
        <dt className="font-medium text-text">{t("state.error.codeLabel")}</dt>
        <dd className="font-mono text-textMuted">{failure.code}</dd>

        {failure.status > 0 && (
          <>
            <dt className="font-medium text-text">
              {t("state.error.statusLabel")}
            </dt>
            <dd className="font-mono text-textMuted">{failure.status}</dd>
          </>
        )}

        <dt className="font-medium text-text">
          {t("state.error.messageLabel")}
        </dt>
        {/* The backend's own words, not a rewrite of them. */}
        <dd className="text-textMuted">{failure.message}</dd>
      </dl>

      <div className="mt-7">
        <Button
          type="button"
          variant="secondary"
          size="lg"
          onClick={() => window.location.reload()}
        >
          {t("state.error.retry")}
        </Button>
      </div>
    </section>
  );
}

/** The compact form, for a failure inside a panel that still has a heading. */
export function InlineApiError({ failure }: { failure: ApiFailure }) {
  const t = useT();
  const { title } = COPY[failure.kind];

  return (
    <div
      role="alert"
      className="border border-danger/40 bg-danger/5 rounded-sm p-4 text-[0.875rem]"
    >
      <p className="font-medium text-dangerInk">{t(title)}</p>
      <p className="mt-1 text-textMuted">{failure.message}</p>
      <p className="mt-1 font-mono text-[0.75rem] text-textMuted">
        {t("state.error.codeLabel")}: {failure.code}
      </p>
    </div>
  );
}
