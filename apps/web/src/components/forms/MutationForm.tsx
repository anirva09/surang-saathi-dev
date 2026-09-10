"use client";

import React from "react";
import { CheckCircle2 } from "lucide-react";
import { useT } from "@/i18n/LanguageProvider";
import type { MessageKey } from "@/i18n/messages.en";
import type { ActionResult, ApiFailure } from "@/lib/api/failure";
import { Button, type ButtonVariant } from "@/components/ui/Button";
import { InlineApiError } from "@/components/state/ApiErrorState";
import { cn } from "@/utils/cn";

/**
 * The shared shell for every mutation in the workspace.
 *
 * It owns the three things each mutation has to get right and that are easy to
 * get wrong one form at a time: the control is disabled while the request is in
 * flight so a double click cannot raise two records; the outcome is announced in
 * a live region so a screen-reader user hears it without moving focus; and a
 * failure renders the backend's own message rather than a generic apology.
 */
export function useMutation() {
  const [pending, setPending] = React.useState(false);
  const [failure, setFailure] = React.useState<ApiFailure | null>(null);
  const [succeeded, setSucceeded] = React.useState(false);

  const run = React.useCallback(
    async <T,>(operation: () => Promise<ActionResult<T>>) => {
      setPending(true);
      setFailure(null);
      setSucceeded(false);
      try {
        const result = await operation();
        if (result.ok) {
          setSucceeded(true);
        } else {
          setFailure(result.failure);
        }
        return result;
      } finally {
        setPending(false);
      }
    },
    []
  );

  return { pending, failure, succeeded, run };
}

export interface MutationPanelProps {
  titleKey: MessageKey;
  descriptionKey?: MessageKey;
  pending: boolean;
  failure: ApiFailure | null;
  succeeded: boolean;
  onSubmit: (form: FormData) => void;
  submitKey: MessageKey;
  submitVariant?: ButtonVariant;
  children?: React.ReactNode;
  className?: string;
}

export function MutationPanel({
  titleKey,
  descriptionKey,
  pending,
  failure,
  succeeded,
  onSubmit,
  submitKey,
  submitVariant = "primary",
  children,
  className,
}: MutationPanelProps) {
  const t = useT();
  const headingId = React.useId();

  return (
    <section
      aria-labelledby={headingId}
      className={cn(
        "border border-border bg-surface rounded-sm p-4 sm:p-5",
        className
      )}
    >
      <h3
        id={headingId}
        className="text-[0.9375rem] font-bold tracking-tight text-text"
      >
        {t(titleKey)}
      </h3>

      {descriptionKey && (
        <p className="mt-1.5 max-w-[68ch] text-[0.8125rem] leading-relaxed text-textMuted">
          {t(descriptionKey)}
        </p>
      )}

      <form
        // Progressive submission: the action is called with the FormData, and
        // the form never navigates, so the page keeps its scroll position.
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit(new FormData(event.currentTarget));
        }}
        className="mt-4 flex flex-col gap-4"
      >
        {children}

        <div className="flex flex-wrap items-center gap-3">
          <Button
            type="submit"
            variant={submitVariant}
            size="lg"
            disabled={pending}
            aria-busy={pending}
          >
            {pending ? t("mutate.pending") : t(submitKey)}
          </Button>
        </div>
      </form>

      {/* One live region per panel, so each outcome is announced once. */}
      <div aria-live="polite" className="mt-3 empty:mt-0">
        {succeeded && !failure && (
          <p className="inline-flex items-center gap-2 text-[0.875rem] font-medium text-success">
            <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
            {t("mutate.success")}
          </p>
        )}
        {failure && <InlineApiError failure={failure} />}
      </div>
    </section>
  );
}

/** A labelled control with its own error message, wired for assistive tech. */
export function FormField({
  name,
  labelKey,
  helpKey,
  failure,
  children,
}: {
  name: string;
  labelKey: MessageKey;
  helpKey?: MessageKey;
  failure: ApiFailure | null;
  children: (props: {
    id: string;
    name: string;
    "aria-describedby"?: string;
    "aria-invalid"?: true;
  }) => React.ReactNode;
}) {
  const t = useT();
  const id = React.useId();
  const helpId = `${id}-help`;
  const errorId = `${id}-error`;

  // A message the frontend raised is translated; one the backend raised is
  // shown in the API's own words.
  const localKey = failure?.fieldMessageKeys?.[name];
  const remote = failure?.fieldMessages?.[name];
  const message = localKey ? t(localKey as MessageKey) : remote;

  const describedBy =
    [helpKey ? helpId : null, message ? errorId : null]
      .filter(Boolean)
      .join(" ") || undefined;

  return (
    <div className="flex flex-col gap-1.5 min-w-0">
      <label htmlFor={id} className="text-[0.8125rem] font-medium text-text">
        {t(labelKey)}
      </label>

      {children({
        id,
        name,
        "aria-describedby": describedBy,
        ...(message ? { "aria-invalid": true as const } : {}),
      })}

      {helpKey && (
        <p id={helpId} className="text-[0.75rem] text-textMuted">
          {t(helpKey)}
        </p>
      )}

      {message && (
        <p id={errorId} className="text-[0.75rem] font-medium text-dangerInk">
          {message}
        </p>
      )}
    </div>
  );
}

/** Shared input styling, so every control meets the 44px touch target. */
export const CONTROL_CLASS =
  "min-h-[44px] px-3 bg-surfaceStrong border border-border rounded-sm text-[0.875rem] text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary aria-[invalid]:border-danger";
