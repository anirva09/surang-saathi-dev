"use client";

import React from "react";
import { ShieldAlert, ShieldCheck, ShieldQuestion } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageProvider";
import type {
  AuditEventListResponse,
  AuditVerificationOut,
} from "@/lib/api/contract";
import type { ApiFailure } from "@/lib/api/failure";
import { WorkspaceHeading } from "@/components/layout/WorkspaceShell";
import { EmptyState } from "@/components/state/EmptyState";
import { InlineApiError } from "@/components/state/ApiErrorState";

export function AuditView({
  events,
  verification,
  verificationFailure,
}: {
  events: AuditEventListResponse;
  verification: AuditVerificationOut | null;
  verificationFailure: ApiFailure | null;
}) {
  const { t, formatNumber, formatDateTime } = useLanguage();

  return (
    <div className="flex flex-col gap-8">
      <WorkspaceHeading
        title={t("audit.title")}
        description={t("audit.subtitle")}
      />

      <VerificationPanel
        verification={verification}
        failure={verificationFailure}
      />

      <section aria-labelledby="audit-events-heading">
        <h2
          id="audit-events-heading"
          className="text-[1.375rem] font-bold tracking-tight text-text"
        >
          {t("audit.events.heading")}
        </h2>

        <p className="mt-1.5 text-[0.875rem] text-textMuted">
          {t("audit.events.showing", {
            shown: formatNumber(events.items.length),
            total: formatNumber(events.total),
          })}
        </p>

        {events.items.length === 0 ? (
          <EmptyState bodyKey="state.empty.audit" className="mt-4" />
        ) : (
          <ul
            aria-label={t("audit.events.caption")}
            className="mt-4 flex flex-col gap-3"
          >
            {events.items.map((event) => (
              <li
                key={event.id}
                className="border border-border bg-surface rounded-sm p-4"
              >
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="inline-flex items-center justify-center min-w-[2.5rem] px-2 py-0.5 rounded-sm bg-stat/10 font-mono text-[0.75rem] font-bold text-stat tabular-nums">
                    {formatNumber(event.sequence)}
                  </span>
                  {/* Event and entity types are backend vocabulary, not UI copy. */}
                  <span className="font-mono text-[0.875rem] font-bold text-text">
                    {event.eventType}
                  </span>
                  <span className="text-[0.8125rem] text-textMuted">
                    {formatDateTime(event.createdAt)}
                  </span>
                </div>

                <dl className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-[0.8125rem]">
                  <div className="min-w-0">
                    <dt className="text-textMuted">
                      {t("audit.events.entity")}
                    </dt>
                    <dd className="font-mono text-text break-all">
                      {event.entityType} · {event.entityId}
                    </dd>
                  </div>
                  <div className="min-w-0">
                    <dt className="text-textMuted">
                      {t("audit.events.actor")}
                    </dt>
                    <dd className="font-mono text-text break-all">
                      {/* A null actor is the system itself, said plainly. */}
                      {event.actorId ?? t("audit.events.noActor")}
                    </dd>
                  </div>
                </dl>

                <div className="mt-3 flex flex-col gap-1.5">
                  <HashLine
                    label={t("audit.events.previousHash")}
                    value={event.previousHash}
                  />
                  <HashLine
                    label={t("audit.events.hash")}
                    value={event.eventHash}
                  />
                </div>

                {Object.keys(event.payload).length > 0 && (
                  <details className="mt-3 group">
                    <summary className="inline-flex items-center min-h-[36px] cursor-pointer text-[0.8125rem] font-medium text-primary hover:underline underline-offset-2 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                      {t("audit.events.payload")}
                    </summary>
                    {/* The recorded values exactly as the ledger holds them —
                        this is the record, so it is not reformatted or filtered. */}
                    <pre className="mt-2 overflow-x-auto bg-utility border border-borderSoft rounded-sm p-3 font-mono text-[0.75rem] leading-relaxed text-text">
                      {JSON.stringify(event.payload, null, 2)}
                    </pre>
                  </details>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function HashLine({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="min-w-0">
      <p className="text-[0.6875rem] uppercase tracking-wider text-textMuted">
        {label}
      </p>
      <p className="font-mono text-[0.6875rem] text-text break-all">
        {/* The genesis entry has no predecessor; an em dash says so. */}
        {value ?? "—"}
      </p>
    </div>
  );
}

function VerificationPanel({
  verification,
  failure,
}: {
  verification: AuditVerificationOut | null;
  failure: ApiFailure | null;
}) {
  const { t, formatNumber } = useLanguage();

  if (failure || verification === null) {
    return (
      <section
        aria-labelledby="verify-heading"
        className="border border-border bg-surface rounded-sm p-4 sm:p-5"
      >
        <h2
          id="verify-heading"
          className="inline-flex items-center gap-2 text-[1rem] font-bold tracking-tight text-text"
        >
          <ShieldQuestion className="w-5 h-5 text-textMuted" aria-hidden="true" />
          {t("audit.verify.heading")}
        </h2>
        <p className="mt-2 text-[0.875rem] text-textMuted">
          {t("audit.verify.unavailable")}
        </p>
        {failure && (
          <div className="mt-3">
            <InlineApiError failure={failure} />
          </div>
        )}
      </section>
    );
  }

  const valid = verification.valid;
  const Icon = valid ? ShieldCheck : ShieldAlert;

  return (
    <section
      aria-labelledby="verify-heading"
      // A broken chain is the most serious thing this screen can report, and it
      // is carried by the heading, the border and the icon rather than by
      // role="alert": the verdict is this section's whole purpose, not an
      // interruption to it.
      className={
        valid
          ? "border border-success/40 bg-success/5 rounded-sm p-4 sm:p-5"
          : "border border-danger/50 bg-danger/5 rounded-sm p-4 sm:p-5"
      }
    >
      <h2
        id="verify-heading"
        className="inline-flex items-center gap-2 text-[1rem] font-bold tracking-tight text-text"
      >
        <Icon
          className={valid ? "w-5 h-5 text-success" : "w-5 h-5 text-dangerInk"}
          aria-hidden="true"
        />
        {valid ? t("audit.verify.valid") : t("audit.verify.invalid")}
      </h2>

      <p className="mt-2 max-w-[72ch] text-[0.875rem] leading-relaxed text-text">
        {valid
          ? t("audit.verify.validBody", {
              checked: formatNumber(verification.checkedEvents),
              total: formatNumber(verification.totalEvents),
            })
          : t("audit.verify.invalidBody", {
              sequence:
                verification.firstInvalidSequence === null
                  ? "—"
                  : formatNumber(verification.firstInvalidSequence),
            })}
      </p>

      <dl className="mt-3 flex flex-col gap-1.5 text-[0.8125rem]">
        {verification.headHash && (
          <div className="min-w-0">
            <dt className="text-[0.6875rem] uppercase tracking-wider text-textMuted">
              {t("audit.verify.head")}
            </dt>
            <dd className="font-mono text-[0.6875rem] text-text break-all">
              {verification.headHash}
            </dd>
          </div>
        )}

        {verification.reason && (
          <div className="min-w-0">
            <dt className="text-textMuted">{t("audit.verify.reason")}</dt>
            {/* The service's own explanation, verbatim. */}
            <dd className="text-text">{verification.reason}</dd>
          </div>
        )}

        {verification.firstInvalidEventId && (
          <div className="min-w-0">
            <dt className="text-textMuted">{t("audit.events.entity")}</dt>
            <dd className="font-mono text-text break-all">
              {verification.firstInvalidEventId}
            </dd>
          </div>
        )}
      </dl>
    </section>
  );
}
