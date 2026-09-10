/**
 * Canonical demo context shared by every route.
 *
 * ADR-018: synthetic demo data must be labeled. Nothing here is live Coal
 * India, DGMS or sensor data, and no surface may present it as such.
 *
 * One mine, one shift, one reporting date, one risk index. Routes import from
 * here rather than restating figures, so `/` and `/dashboard` can never
 * disagree about the same metric.
 */

import type { ContributingFactor } from "@/components/ui/RiskIndexMeter";

export const DEMO_ORG = "Coal India Limited — SIH Prototype" as const;

export const DEMO_MINE = {
  area: "Jharia Area",
  mine: "Demo Mine 03",
  /** Full display name used in headings and selectors. */
  name: "Jharia Area — Demo Mine 03",
  shift: "Shift A",
  date: "10 Sep 2026",
  reportingPeriod: "Shift A · 10 Sep 2026",
  /** Deterministic, not a live heartbeat. */
  lastSync: "08:42",
} as const;

export const DEMO_MANAGER = {
  name: "M. Sharma",
  role: "Safety Officer",
} as const;

/** Shown wherever demo figures appear, so they are never read as live data. */
export const DEMO_DATA_NOTICE =
  "Synthetic demo data · SIH prototype · not a live feed";

/**
 * ADR-010 / ADR-011: the MVP index is rule-based and always ships its factors,
 * their weights and the method behind them. A bare score fails acceptance.
 */
export const MINE_RISK_INDEX = {
  score: 74.2,
  band: "High Risk",
  method: "Rule-based weighted index (MVP v1) — no machine learning involved",
  factors: [
    {
      name: "Overdue Corrective Actions",
      weight: 0.4,
      currentValue: 12,
    },
    {
      name: "Gas Threshold Breaches (30d)",
      weight: 0.35,
      currentValue: 4,
    },
    {
      name: "Inspection Coverage vs Target",
      weight: 0.25,
      currentValue: "82%",
    },
  ] satisfies ContributingFactor[],
  /** Plain-language reasons a manager can act on. */
  drivers: [
    "12 corrective actions are past their due date — the heaviest weighted factor.",
    "4 gas threshold breaches recorded in Seam 2 over the last 30 days.",
    "Inspection coverage is 82% against a 95% target for this reporting period.",
  ],
  primaryDriver:
    "Overdue corrective actions contribute the largest share of current risk.",
  actionHint:
    "Clearing the 5 overdue corrective actions is the fastest way to bring this score down.",
} as const;
