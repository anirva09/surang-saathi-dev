"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Camera, FileCheck2, MapPin, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageProvider";
import type { MessageKey } from "@/i18n/messages.en";
import type {
  CorrectiveActionOut,
  EvidenceOut,
  HazardDetailOut,
  HazardSeverity,
} from "@/lib/api/contract";
import {
  HAZARD_REVIEW_STATUSES,
  HAZARD_SEVERITIES,
  isGeofenceState,
} from "@/lib/api/contract";
import {
  GeofenceBadge,
  LifecycleBadge,
  SeverityBadge,
  SyncBadge,
} from "@/components/domain/DomainBadges";
import { WorkspaceHeading } from "@/components/layout/WorkspaceShell";
import { EmptyState } from "@/components/state/EmptyState";
import {
  CONTROL_CLASS,
  FormField,
  MutationPanel,
  useMutation,
} from "@/components/forms/MutationForm";
import { Button } from "@/components/ui/Button";
import { InlineApiError } from "@/components/state/ApiErrorState";
import type { ActionResult } from "@/lib/api/failure";
import type { EvidenceUploadSummary } from "@/app/hazards/[hazardId]/actions";

/**
 * The server actions, passed in rather than imported, so this view stays a pure
 * client component and the page owns which mutations exist.
 */
export interface HazardDetailActions {
  acknowledge: (hazardId: string) => Promise<ActionResult>;
  review: (hazardId: string, form: FormData) => Promise<ActionResult>;
  createAction: (hazardId: string, form: FormData) => Promise<ActionResult>;
  resolveAction: (
    hazardId: string,
    actionId: string
  ) => Promise<ActionResult>;
  acknowledgeAction: (
    hazardId: string,
    actionId: string
  ) => Promise<ActionResult>;
  uploadEvidence: (
    hazardId: string,
    form: FormData
  ) => Promise<ActionResult<EvidenceUploadSummary>>;
}

export function HazardDetailView({
  hazard,
  actions,
  actorId,
}: {
  hazard: HazardDetailOut;
  actions: HazardDetailActions;
  actorId: string;
}) {
  const { t, formatDateTime } = useLanguage();
  const resolved = hazard.status === "RESOLVED";

  return (
    <div className="flex flex-col gap-8">
      <div>
        <Link
          href="/hazards"
          className="inline-flex items-center gap-1.5 min-h-[44px] text-[0.8125rem] font-medium text-primary hover:underline underline-offset-2 rounded-sm"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          {t("hazard.back")}
        </Link>

        <p className="mt-1 font-mono text-[0.8125rem] text-textMuted">
          {hazard.hazardId}
        </p>

        <WorkspaceHeading title={hazard.title} />

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <SeverityBadge severity={hazard.severity} />
          <LifecycleBadge status={hazard.status} />
          <SyncBadge state={hazard.syncState} />
          <GeofenceBadge state={hazard.geofenceState} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.6fr)_minmax(20rem,1fr)] gap-6 items-start">
        <div className="flex flex-col gap-6 min-w-0">
          <section
            aria-labelledby="hazard-description"
            className="border border-border bg-surface rounded-sm p-4 sm:p-5"
          >
            <h2
              id="hazard-description"
              className="text-[0.9375rem] font-bold tracking-tight text-text"
            >
              {t("hazard.description")}
            </h2>
            <p className="mt-2 text-[0.9375rem] leading-relaxed text-text">
              {hazard.description}
            </p>
          </section>

          <EvidencePanel evidence={hazard.evidence} />

          <CorrectiveActionsPanel
            hazardId={hazard.hazardId}
            items={hazard.correctiveActions}
            actions={actions}
            hazardResolved={resolved}
          />
        </div>

        <div className="flex flex-col gap-6 min-w-0">
          <section
            aria-labelledby="hazard-record"
            className="border border-border bg-surface rounded-sm p-4 sm:p-5"
          >
            <h2
              id="hazard-record"
              className="text-[0.9375rem] font-bold tracking-tight text-text"
            >
              {t("hazard.facts")}
            </h2>

            <dl className="mt-3 flex flex-col gap-2.5 text-[0.875rem]">
              <Fact label="domain.mine">
                <span className="font-mono">{hazard.mineId}</span>
              </Fact>
              <Fact label="domain.location">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  {hazard.locationName}
                </span>
              </Fact>
              <Fact label="domain.reportedBy">
                {hazard.reportedBy.name}
                <span className="block text-[0.75rem] text-textMuted">
                  {hazard.reportedBy.role}
                </span>
              </Fact>
              <Fact label="domain.assignedTo">
                {hazard.assignedTo ? (
                  <>
                    {hazard.assignedTo.name}
                    <span className="block text-[0.75rem] text-textMuted">
                      {hazard.assignedTo.role}
                    </span>
                  </>
                ) : (
                  t("domain.unassigned")
                )}
              </Fact>
              <Fact label="domain.capturedAt">
                {formatDateTime(hazard.capturedAt)}
              </Fact>
              <Fact label="domain.syncedAt">
                {hazard.syncedAt ? formatDateTime(hazard.syncedAt) : "—"}
              </Fact>
            </dl>
          </section>

          <ManagerDecisionPanel
            hazardId={hazard.hazardId}
            severity={hazard.severity}
            actions={actions}
            actorId={actorId}
            hazardResolved={resolved}
          />

          <EvidenceUploadPanel
            hazardId={hazard.hazardId}
            actions={actions}
          />
        </div>
      </div>
    </div>
  );
}

function Fact({
  label,
  children,
}: {
  label: MessageKey;
  children: React.ReactNode;
}) {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-[0.75rem] uppercase tracking-wider text-textMuted">
        {t(label)}
      </dt>
      <dd className="font-medium text-text">{children}</dd>
    </div>
  );
}

/* ---------------------------------------------------------------- evidence */

function EvidencePanel({ evidence }: { evidence: EvidenceOut[] }) {
  const { t, formatNumber, formatDateTime } = useLanguage();

  return (
    <section
      aria-labelledby="hazard-evidence"
      className="border border-border bg-surface rounded-sm p-4 sm:p-5"
    >
      <h2
        id="hazard-evidence"
        className="inline-flex items-center gap-2 text-[0.9375rem] font-bold tracking-tight text-text"
      >
        <Camera className="w-4 h-4 text-primary" aria-hidden="true" />
        {t("hazard.evidence.heading")}
      </h2>

      {evidence.length === 0 ? (
        <EmptyState bodyKey="state.empty.evidence" className="mt-3" />
      ) : (
        <ul className="mt-3 flex flex-col gap-4">
          {evidence.map((item) => (
            <li
              key={item.evidenceId}
              className="border border-borderSoft rounded-sm p-3"
            >
              <p className="font-mono text-[0.75rem] text-textMuted">
                {item.evidenceId}
              </p>
              <p className="mt-0.5 font-medium text-[0.875rem] text-text break-all">
                {item.fileName}
              </p>

              <div className="mt-2.5 flex flex-wrap gap-2">
                <GeofenceBadge state={item.serverGeofenceState} />
              </div>

              <dl className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-1.5 text-[0.75rem]">
                <Pair label="hazard.evidence.size">
                  {formatNumber(Math.round(item.fileSize / 1024))} KB
                </Pair>
                <Pair label="hazard.evidence.captured">
                  {formatDateTime(item.capturedAt)}
                </Pair>
                <Pair label="hazard.evidence.coords">
                  {item.latitude !== null && item.longitude !== null ? (
                    // Coordinates are data, not copy: never localized.
                    <span className="font-mono">
                      {item.latitude.toFixed(5)}, {item.longitude.toFixed(5)}
                    </span>
                  ) : (
                    t("hazard.evidence.noCoords")
                  )}
                </Pair>
                <Pair label="hazard.evidence.accuracy">
                  {item.accuracyMeters !== null
                    ? `${formatNumber(item.accuracyMeters)} m`
                    : t("hazard.evidence.noCoords")}
                </Pair>
                {/* The same vocabulary as the badge above, so the panel does
                    not show a translated label and a raw code side by side. */}
                <Pair label="hazard.evidence.localState">
                  <GeofenceLabel state={item.localGeofenceState} />
                </Pair>
                <Pair label="hazard.evidence.serverState">
                  <GeofenceLabel state={item.serverGeofenceState} />
                </Pair>
              </dl>

              <div className="mt-2.5">
                <p className="text-[0.6875rem] uppercase tracking-wider text-textMuted">
                  {t("hazard.evidence.hash")}
                </p>
                {/* The digest is the evidence chain's anchor; it is shown whole
                    and never abbreviated. */}
                <p className="font-mono text-[0.6875rem] text-text break-all">
                  {item.sha256}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

/**
 * A geofence verdict as words. An unrecognised code is shown as-is rather than
 * mislabelled — the backend's vocabulary can outgrow ours.
 */
function GeofenceLabel({ state }: { state: string }) {
  const { t } = useLanguage();
  return (
    <>
      {isGeofenceState(state)
        ? t(`domain.geofence.${state}` as MessageKey)
        : state}
    </>
  );
}

function Pair({
  label,
  children,
}: {
  label: MessageKey;
  children: React.ReactNode;
}) {
  const { t } = useLanguage();
  return (
    <div className="min-w-0">
      <dt className="text-textMuted">{t(label)}</dt>
      <dd className="text-text">{children}</dd>
    </div>
  );
}

/* ------------------------------------------------------ corrective actions */

function CorrectiveActionsPanel({
  hazardId,
  items,
  actions,
  hazardResolved,
}: {
  hazardId: string;
  items: CorrectiveActionOut[];
  actions: HazardDetailActions;
  hazardResolved: boolean;
}) {
  const { t, formatDate } = useLanguage();
  const create = useMutation();

  return (
    <section
      aria-labelledby="hazard-actions"
      className="flex flex-col gap-4"
    >
      <div className="border border-border bg-surface rounded-sm p-4 sm:p-5">
        <h2
          id="hazard-actions"
          className="inline-flex items-center gap-2 text-[0.9375rem] font-bold tracking-tight text-text"
        >
          <FileCheck2 className="w-4 h-4 text-primary" aria-hidden="true" />
          {t("hazard.actions.heading")}
        </h2>

        {items.length === 0 ? (
          <EmptyState bodyKey="state.empty.actions" className="mt-3" />
        ) : (
          <ul className="mt-3 flex flex-col gap-3">
            {items.map((action) => (
              <ActionRow
                key={action.actionId}
                hazardId={hazardId}
                action={action}
                actions={actions}
                formatDate={formatDate}
              />
            ))}
          </ul>
        )}
      </div>

      {!hazardResolved && (
        <MutationPanel
          titleKey="mutate.action.heading"
          pending={create.pending}
          failure={create.failure}
          succeeded={create.succeeded}
          submitKey="mutate.action.submit"
          onSubmit={(form) =>
            void create.run(() => actions.createAction(hazardId, form))
          }
        >
          <FormField
            name="description"
            labelKey="mutate.action.description"
            failure={create.failure}
          >
            {(props) => (
              <textarea
                {...props}
                rows={3}
                required
                className={`${CONTROL_CLASS} py-2 leading-relaxed`}
              />
            )}
          </FormField>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              name="assignedToUserId"
              labelKey="mutate.action.assignee"
              failure={create.failure}
            >
              {(props) => (
                <input
                  {...props}
                  type="text"
                  required
                  // User IDs are backend identifiers, so the field is monospaced
                  // and never translated or auto-corrected.
                  autoComplete="off"
                  spellCheck={false}
                  className={`${CONTROL_CLASS} font-mono`}
                />
              )}
            </FormField>

            <FormField
              name="dueAt"
              labelKey="mutate.action.due"
              failure={create.failure}
            >
              {(props) => (
                <input
                  {...props}
                  type="datetime-local"
                  required
                  className={CONTROL_CLASS}
                />
              )}
            </FormField>
          </div>
        </MutationPanel>
      )}
    </section>
  );
}

function ActionRow({
  hazardId,
  action,
  actions,
  formatDate,
}: {
  hazardId: string;
  action: CorrectiveActionOut;
  actions: HazardDetailActions;
  formatDate: (iso: string) => string;
}) {
  const { t } = useLanguage();
  const resolve = useMutation();
  const acknowledge = useMutation();
  const isResolved = action.status === "RESOLVED";

  return (
    <li className="border border-borderSoft rounded-sm p-3">
      <p className="font-mono text-[0.75rem] text-textMuted">
        {action.actionId}
      </p>
      <p className="mt-0.5 text-[0.875rem] text-text">{action.description}</p>

      <div className="mt-2.5 flex flex-wrap items-center gap-2">
        <LifecycleBadge status={action.status} />
      </div>

      <dl className="mt-2.5 grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-1.5 text-[0.75rem]">
        <Pair label="hazard.actions.owner">
          {action.assignedTo?.name ?? t("domain.unassigned")}
        </Pair>
        <Pair label="hazard.actions.due">{formatDate(action.dueAt)}</Pair>
        {action.acknowledgedAt && (
          <Pair label="hazard.actions.acknowledged">
            {formatDate(action.acknowledgedAt)}
          </Pair>
        )}
        {action.resolvedAt && (
          <Pair label="hazard.actions.resolved">
            {formatDate(action.resolvedAt)}
          </Pair>
        )}
      </dl>

      {!isResolved && (
        <>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {action.status !== "ACKNOWLEDGED" && (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                disabled={acknowledge.pending}
                aria-busy={acknowledge.pending}
                onClick={() =>
                  void acknowledge.run(() =>
                    actions.acknowledgeAction(hazardId, action.actionId)
                  )
                }
              >
                {acknowledge.pending
                  ? t("mutate.pending")
                  : t("domain.status.ACKNOWLEDGED")}
              </Button>
            )}

            <Button
              type="button"
              variant="commit"
              size="sm"
              disabled={resolve.pending}
              aria-busy={resolve.pending}
              onClick={() =>
                void resolve.run(() =>
                  actions.resolveAction(hazardId, action.actionId)
                )
              }
            >
              {resolve.pending
                ? t("mutate.pending")
                : t("mutate.action.resolve")}
            </Button>
          </div>

          <p className="mt-2 text-[0.6875rem] text-textMuted">
            {t("mutate.action.resolve.help")}
          </p>

          <div aria-live="polite" className="mt-2 empty:mt-0">
            {resolve.failure && <InlineApiError failure={resolve.failure} />}
            {acknowledge.failure && (
              <InlineApiError failure={acknowledge.failure} />
            )}
          </div>
        </>
      )}
    </li>
  );
}

/* -------------------------------------------------------- manager decision */

function ManagerDecisionPanel({
  hazardId,
  severity,
  actions,
  actorId,
  hazardResolved,
}: {
  hazardId: string;
  severity: string;
  actions: HazardDetailActions;
  actorId: string;
  hazardResolved: boolean;
}) {
  const { t } = useLanguage();
  const acknowledge = useMutation();
  const review = useMutation();

  return (
    <section
      aria-labelledby="manager-decision"
      className="flex flex-col gap-4"
    >
      <div className="border border-border bg-surface rounded-sm p-4 sm:p-5">
        <h2
          id="manager-decision"
          className="inline-flex items-center gap-2 text-[0.9375rem] font-bold tracking-tight text-text"
        >
          <ShieldCheck className="w-4 h-4 text-primary" aria-hidden="true" />
          {t("mutate.heading")}
        </h2>

        <p className="mt-1.5 text-[0.8125rem] text-textMuted">
          {/* The acting user is named plainly — the ledger will record it. */}
          {t("mutate.actingAs", { actor: actorId })}
        </p>

        <p className="mt-2.5 max-w-[60ch] text-[0.75rem] leading-relaxed text-textMuted">
          {t("mutate.noAuthNotice")}
        </p>

        {!hazardResolved && (
          <>
            <div className="mt-4">
              <Button
                type="button"
                variant="primary"
                size="lg"
                disabled={acknowledge.pending}
                aria-busy={acknowledge.pending}
                onClick={() =>
                  void acknowledge.run(() => actions.acknowledge(hazardId))
                }
              >
                {acknowledge.pending
                  ? t("mutate.pending")
                  : t("mutate.acknowledge")}
              </Button>
              <p className="mt-2 text-[0.75rem] text-textMuted">
                {t("mutate.acknowledge.help")}
              </p>
            </div>

            <div aria-live="polite" className="mt-3 empty:mt-0">
              {acknowledge.succeeded && !acknowledge.failure && (
                <p className="text-[0.875rem] font-medium text-success">
                  {t("mutate.success")}
                </p>
              )}
              {acknowledge.failure && (
                <InlineApiError failure={acknowledge.failure} />
              )}
            </div>
          </>
        )}
      </div>

      {!hazardResolved && (
        <MutationPanel
          titleKey="mutate.review.heading"
          pending={review.pending}
          failure={review.failure}
          succeeded={review.succeeded}
          submitKey="mutate.review.submit"
          onSubmit={(form) =>
            void review.run(() => actions.review(hazardId, form))
          }
        >
          <FormField
            name="severity"
            labelKey="mutate.review.severity"
            failure={review.failure}
          >
            {(props) => (
              <select
                {...props}
                defaultValue={
                  HAZARD_SEVERITIES.includes(severity as HazardSeverity)
                    ? severity
                    : ""
                }
                className={CONTROL_CLASS}
              >
                <option value="">{t("mutate.review.unchanged")}</option>
                {HAZARD_SEVERITIES.map((value) => (
                  <option key={value} value={value}>
                    {t(`domain.severity.${value}` as MessageKey)}
                  </option>
                ))}
              </select>
            )}
          </FormField>

          <FormField
            name="status"
            labelKey="mutate.review.status"
            failure={review.failure}
          >
            {(props) => (
              <select {...props} defaultValue="" className={CONTROL_CLASS}>
                <option value="">{t("mutate.review.unchanged")}</option>
                {/* Only the two statuses the review endpoint accepts. */}
                {HAZARD_REVIEW_STATUSES.map((value) => (
                  <option key={value} value={value}>
                    {t(`domain.status.${value}` as MessageKey)}
                  </option>
                ))}
              </select>
            )}
          </FormField>
        </MutationPanel>
      )}
    </section>
  );
}

/* --------------------------------------------------------- evidence upload */

function EvidenceUploadPanel({
  hazardId,
  actions,
}: {
  hazardId: string;
  actions: HazardDetailActions;
}) {
  const { t } = useLanguage();
  const upload = useMutation();
  const [result, setResult] = React.useState<EvidenceUploadSummary | null>(
    null
  );

  return (
    <>
      <MutationPanel
        titleKey="mutate.evidence.heading"
        pending={upload.pending}
        failure={upload.failure}
        succeeded={upload.succeeded}
        submitKey="mutate.evidence.submit"
        onSubmit={(form) => {
          setResult(null);
          void upload
            .run(() => actions.uploadEvidence(hazardId, form))
            .then((outcome) => {
              if (outcome.ok) setResult(outcome.data);
            });
        }}
      >
        <FormField
          name="file"
          labelKey="mutate.evidence.file"
          helpKey="mutate.evidence.fileHelp"
          failure={upload.failure}
        >
          {(props) => (
            <input
              {...props}
              type="file"
              required
              // Mirrors the backend's allow-list exactly.
              accept="image/jpeg,image/png,image/webp"
              className="min-h-[44px] py-2 text-[0.875rem] text-text file:mr-3 file:min-h-[36px] file:px-3 file:rounded-sm file:border file:border-border file:bg-surfaceStrong file:text-[0.8125rem] file:text-text"
            />
          )}
        </FormField>

        <FormField
          name="capturedAt"
          labelKey="mutate.evidence.capturedAt"
          failure={upload.failure}
        >
          {(props) => (
            <input
              {...props}
              type="datetime-local"
              required
              className={CONTROL_CLASS}
            />
          )}
        </FormField>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <FormField
            name="latitude"
            labelKey="mutate.evidence.latitude"
            failure={upload.failure}
          >
            {(props) => (
              <input
                {...props}
                type="number"
                step="0.00001"
                min={-90}
                max={90}
                required
                className={`${CONTROL_CLASS} font-mono`}
              />
            )}
          </FormField>

          <FormField
            name="longitude"
            labelKey="mutate.evidence.longitude"
            failure={upload.failure}
          >
            {(props) => (
              <input
                {...props}
                type="number"
                step="0.00001"
                min={-180}
                max={180}
                required
                className={`${CONTROL_CLASS} font-mono`}
              />
            )}
          </FormField>

          <FormField
            name="accuracyMeters"
            labelKey="mutate.evidence.accuracy"
            failure={upload.failure}
          >
            {(props) => (
              <input
                {...props}
                type="number"
                step="0.1"
                min={0}
                max={10000}
                required
                className={`${CONTROL_CLASS} font-mono`}
              />
            )}
          </FormField>
        </div>
      </MutationPanel>

      {/* The server's verdict on the upload — the point of the evidence chain,
          so it is reported rather than assumed to have passed. */}
      {result && (
        <div
          aria-live="polite"
          className="border border-border bg-utility rounded-sm p-4 text-[0.8125rem]"
        >
          <p className="font-mono text-[0.75rem] text-textMuted">
            {result.evidenceId}
          </p>
          <p
            className={
              result.hashVerified
                ? "mt-1 font-medium text-success"
                : "mt-1 font-medium text-dangerInk"
            }
          >
            {result.hashVerified
              ? t("mutate.evidence.hashVerified")
              : t("mutate.evidence.hashMismatch")}
          </p>
          <div className="mt-2.5 flex flex-wrap gap-2">
            <GeofenceBadge state={result.serverGeofenceState} />
          </div>
        </div>
      )}
    </>
  );
}
