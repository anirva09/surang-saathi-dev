"use client";

import React from "react";
import { useLanguage } from "@/i18n/LanguageProvider";
import type { RiskSnapshotOut } from "@/lib/api/contract";
import type { ActionResult } from "@/lib/api/failure";
import { WorkspaceHeading } from "@/components/layout/WorkspaceShell";
import {
  CONTROL_CLASS,
  FormField,
  MutationPanel,
  useMutation,
} from "@/components/forms/MutationForm";
import { cn } from "@/utils/cn";

/**
 * Band styling follows the level the BACKEND assigned. The threshold logic lives
 * in the risk service, and re-deriving it from the score here would let the
 * badge and the number disagree.
 */
const LEVEL_TONE: Record<string, string> = {
  LOW: "bg-success/10 text-success border-success/30",
  MEDIUM: "bg-accent/15 text-warningInk border-accent/40",
  HIGH: "bg-danger/10 text-dangerInk border-danger/30",
};

export function RiskView({
  snapshot,
  mineName,
  recalculate,
}: {
  snapshot: RiskSnapshotOut;
  mineName: string;
  recalculate: (form: FormData) => Promise<ActionResult>;
}) {
  const { t, formatNumber, formatDateTime } = useLanguage();
  const recalc = useMutation();

  const oneDecimal = {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  } as const;

  return (
    <div className="flex flex-col gap-8">
      <WorkspaceHeading
        title={t("risk.title")}
        description={t("risk.subtitle", { mine: mineName })}
        meta={t("risk.calculatedAt", {
          timestamp: formatDateTime(snapshot.calculatedAt),
        })}
      />

      <section
        aria-labelledby="risk-score-heading"
        className="border border-border bg-surface rounded-sm overflow-hidden"
      >
        <h2 id="risk-score-heading" className="sr-only">
          {t("risk.score")}
        </h2>

        <div
          className={cn(
            "px-5 py-5 border-b flex flex-wrap items-end justify-between gap-6",
            LEVEL_TONE[snapshot.level] ?? "bg-border/30 text-text border-border"
          )}
        >
          <div>
            <p className="text-[0.75rem] font-medium uppercase tracking-wider">
              {t("risk.score")}
            </p>
            <p className="mt-1 text-[3rem] font-bold leading-none tabular-nums">
              {formatNumber(snapshot.score, oneDecimal)}
            </p>
          </div>

          <div className="text-right">
            <p className="text-[0.75rem] font-medium uppercase tracking-wider">
              {t("risk.level")}
            </p>
            {/* The level code is the backend's value, shown as it is. */}
            <p className="mt-1 text-[1.25rem] font-bold">{snapshot.level}</p>
          </div>
        </div>

        <dl className="px-5 py-3 flex flex-wrap gap-x-8 gap-y-1.5 text-[0.8125rem] bg-utility">
          <div className="flex gap-2">
            <dt className="text-textMuted">{t("risk.snapshotId")}</dt>
            <dd className="font-mono text-text">{snapshot.riskSnapshotId}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="text-textMuted">{t("domain.mine")}</dt>
            <dd className="font-mono text-text">{snapshot.mineId}</dd>
          </div>
        </dl>
      </section>

      <section aria-labelledby="risk-factors-heading">
        <h2
          id="risk-factors-heading"
          className="text-[1.375rem] font-bold tracking-tight text-text"
        >
          {t("dash.risk.factors")}
        </h2>

        {/* A genuine data table: six numeric columns that need row and column
            headers to be readable. It scrolls horizontally inside its own box so
            the page itself never does. */}
        <div className="mt-4 overflow-x-auto border border-border rounded-sm">
          <table className="w-full min-w-[40rem] border-collapse bg-surface text-[0.875rem]">
            <caption className="sr-only">{t("risk.factors.caption")}</caption>
            <thead>
              <tr className="bg-utility">
                <th scope="col" className="px-4 py-2.5 text-left font-bold text-text border-b border-border">
                  {t("risk.factors.name")}
                </th>
                <th scope="col" className="px-4 py-2.5 text-right font-bold text-text border-b border-border">
                  {t("risk.factors.weight")}
                </th>
                <th scope="col" className="px-4 py-2.5 text-right font-bold text-text border-b border-border">
                  {t("risk.factors.value")}
                </th>
                <th scope="col" className="px-4 py-2.5 text-right font-bold text-text border-b border-border">
                  {t("risk.factors.score")}
                </th>
                <th scope="col" className="px-4 py-2.5 text-right font-bold text-text border-b border-border">
                  {t("risk.factors.contribution")}
                </th>
                <th scope="col" className="px-4 py-2.5 text-left font-bold text-text border-b border-border">
                  {t("risk.factors.source")}
                </th>
              </tr>
            </thead>
            <tbody>
              {snapshot.factors.map((factor) => (
                <tr key={factor.name} className="border-b border-borderSoft last:border-b-0">
                  <th scope="row" className="px-4 py-2.5 text-left font-medium text-text">
                    {factor.name}
                  </th>
                  <td className="px-4 py-2.5 text-right tabular-nums text-text">
                    {formatNumber(factor.weight * 100, {
                      maximumFractionDigits: 0,
                    })}
                    %
                  </td>
                  <td className="px-4 py-2.5 text-right tabular-nums text-text">
                    {factor.currentValue}
                  </td>
                  <td className="px-4 py-2.5 text-right tabular-nums text-text">
                    {/* The contract allows null; that is "not calculated", not zero. */}
                    {factor.score === null
                      ? t("risk.notCalculated")
                      : formatNumber(factor.score, oneDecimal)}
                  </td>
                  <td className="px-4 py-2.5 text-right tabular-nums text-text">
                    {factor.contribution === null
                      ? t("risk.notCalculated")
                      : formatNumber(factor.contribution, oneDecimal)}
                  </td>
                  <td className="px-4 py-2.5 text-left text-textMuted">
                    {factor.source}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <MutationPanel
        titleKey="risk.recalc.heading"
        descriptionKey="risk.recalc.body"
        pending={recalc.pending}
        failure={recalc.failure}
        succeeded={recalc.succeeded}
        submitKey="risk.recalc.submit"
        onSubmit={(form) => void recalc.run(() => recalculate(form))}
        className="max-w-[44rem]"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            name="gasBreaches30d"
            labelKey="risk.recalc.gasBreaches"
            helpKey="risk.recalc.optional"
            failure={recalc.failure}
          >
            {(props) => (
              <input
                {...props}
                type="number"
                min={0}
                step={1}
                inputMode="numeric"
                className={`${CONTROL_CLASS} tabular-nums`}
              />
            )}
          </FormField>

          <FormField
            name="inspectionCoveragePercent"
            labelKey="risk.recalc.coverage"
            helpKey="risk.recalc.optional"
            failure={recalc.failure}
          >
            {(props) => (
              <input
                {...props}
                type="number"
                min={0}
                max={100}
                step="0.1"
                inputMode="decimal"
                className={`${CONTROL_CLASS} tabular-nums`}
              />
            )}
          </FormField>
        </div>
      </MutationPanel>
    </div>
  );
}
