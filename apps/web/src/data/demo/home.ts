/**
 * Deterministic demo data for the `/` portal homepage.
 *
 * ADR-018: synthetic demo data must be labeled. Nothing here is live Coal
 * India, DGMS or sensor data, and the UI must never present it as such.
 *
 * This module is the single view-model boundary for the homepage. When a real
 * REST adapter exists it replaces this file; UI components must not inline
 * their own mock literals.
 */

import type { SemanticStatus } from "@/components/ui/StatusBadge";

// Mine, shift, reporting date and the risk index live in the shared demo
// context so this route and /dashboard can never disagree about them.
export {
  DEMO_MINE,
  DEMO_DATA_NOTICE,
  MINE_RISK_INDEX,
} from "./context";

export interface HomeMetric {
  id: string;
  label: string;
  value: number;
  /** Microcopy giving the number operational meaning. */
  context: string;
  href: string;
  tone: SemanticStatus;
}

export const HOME_METRICS: HomeMetric[] = [
  {
    id: "open-hazards",
    label: "Open Hazards",
    value: 14,
    context: "Across 4 sections",
    href: "/hazards?status=OPEN",
    tone: "info",
  },
  {
    id: "overdue-actions",
    label: "Overdue Actions",
    value: 5,
    context: "Past statutory due date",
    href: "/corrective-actions?status=OVERDUE",
    tone: "warning",
  },
  {
    id: "inspections-today",
    label: "Inspections Today",
    value: 7,
    context: "3 awaiting review",
    href: "/inspections?period=today",
    tone: "neutral",
  },
  {
    id: "high-risk-areas",
    label: "High-Risk Areas",
    value: 3,
    context: "Seam 2, Seam 5, CHP",
    href: "/hazards?severity=HIGH",
    tone: "danger",
  },
];

export interface AttentionItem {
  id: string;
  title: string;
  count: number;
  countLabel: string;
  /** Who owns it / what scope it covers. */
  scope: string;
  detail: string;
  statusLabel: string;
  statusTone: SemanticStatus;
  ctaLabel: string;
  href: string;
}

export const ATTENTION_ITEMS: AttentionItem[] = [
  {
    id: "critical-hazards",
    title: "Critical / High Severity Hazards",
    count: 3,
    countLabel: "hazards",
    scope: "Seam 2 Main Gallery · Seam 5 Incline · CHP Conveyor",
    detail: "Oldest raised 2 days ago and not yet assigned an owner.",
    statusLabel: "Escalated",
    statusTone: "danger",
    ctaLabel: "Review hazards",
    href: "/hazards?severity=HIGH",
  },
  {
    id: "overdue-actions",
    title: "Overdue Corrective Actions",
    count: 5,
    countLabel: "actions",
    scope: "Owners: M. Sharma, R. Das, P. Mahato",
    detail: "Oldest is 9 days past its due date and has escalated once.",
    statusLabel: "Overdue",
    statusTone: "warning",
    ctaLabel: "Open action register",
    href: "/corrective-actions?status=OVERDUE",
  },
  {
    id: "pending-review",
    title: "Inspections Awaiting Review",
    count: 4,
    countLabel: "inspections",
    scope: "Submitted by 3 sirdars across B and C shifts",
    detail: "Evidence synced and server-verified; manager sign-off pending.",
    statusLabel: "Pending review",
    statusTone: "info",
    ctaLabel: "Review inspections",
    href: "/inspections?status=PENDING_REVIEW",
  },
  {
    id: "sync-conflicts",
    title: "Sync / Evidence Conflicts",
    count: 2,
    countLabel: "records",
    scope: "1 geofence conflict · 1 duplicate submission retained",
    detail: "Both versions kept for reconciliation — nothing was overwritten.",
    statusLabel: "Conflict",
    statusTone: "danger",
    ctaLabel: "Reconcile records",
    href: "/hazards?sync=CONFLICT",
  },
];

export interface ServiceCard {
  id: string;
  title: string;
  description: string;
  href: string;
  /** Icon key resolved by ServiceGrid, keeping this module free of JSX. */
  icon:
    | "dashboard"
    | "hazard"
    | "inspection"
    | "action"
    | "compliance"
    | "audit";
}

export const CORE_SERVICES: ServiceCard[] = [
  {
    id: "safety-dashboard",
    title: "Safety Dashboard",
    description:
      "Unsafe areas, risk trend and the actions waiting on you this shift.",
    href: "/dashboard",
    icon: "dashboard",
  },
  {
    id: "hazard-register",
    title: "Hazard Register",
    description:
      "Review field evidence, confirm severity and assign clear ownership.",
    href: "/hazards",
    icon: "hazard",
  },
  {
    id: "inspection-register",
    title: "Inspection Register",
    description:
      "Inspection history with geofence and evidence proof for every entry.",
    href: "/inspections",
    icon: "inspection",
  },
  {
    id: "corrective-actions",
    title: "Corrective Actions",
    description:
      "Assign owners and deadlines, track escalation and record resolution.",
    href: "/corrective-actions",
    icon: "action",
  },
  {
    id: "compliance",
    title: "Compliance",
    description:
      "Statutory obligations, due dates and the evidence that closes them.",
    href: "/compliance",
    icon: "compliance",
  },
  {
    id: "audit-ledger",
    title: "Audit Ledger",
    description:
      "Append-only event history with SHA-256 hash-chain verification.",
    href: "/audit",
    icon: "audit",
  },
];

export interface WorkflowStep {
  id: string;
  label: string;
  detail: string;
}

/** The Golden Workflow the whole product exists to make auditable. */
export const GOLDEN_WORKFLOW: WorkflowStep[] = [
  {
    id: "captured",
    label: "Captured",
    detail: "Worker records the hazard offline with photo evidence.",
  },
  {
    id: "synced",
    label: "Synced",
    detail: "Durable queue uploads when a network is available.",
  },
  {
    id: "verified",
    label: "Verified",
    detail: "Server checks geofence and evidence hash independently.",
  },
  {
    id: "assigned",
    label: "Assigned",
    detail: "Manager sets a named owner and a statutory deadline.",
  },
  {
    id: "resolved",
    label: "Resolved",
    detail: "Closure evidence is submitted and reviewed, not assumed.",
  },
  {
    id: "ledgered",
    label: "Ledgered",
    detail: "Every step is appended to a SHA-256 hash-chained record.",
  },
];
