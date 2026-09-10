/**
 * Deterministic demo data for `/dashboard`.
 *
 * ADR-018: synthetic demonstration data, not live Coal India, DGMS or sensor
 * data. Shared context (mine, shift, manager, risk index) comes from
 * `./context` so this route agrees with `/` on every shared figure.
 *
 * This module is the view-model boundary for the dashboard. When a REST
 * adapter exists it replaces this file; components must not inline literals.
 */

import type { SemanticStatus } from "@/components/ui/StatusBadge";
import type {
  GeofenceState,
  HazardSeverity,
  LifecycleStatus,
  SyncState,
} from "@/types/domain";

export {
  DEMO_MINE,
  DEMO_MANAGER,
  DEMO_ORG,
  DEMO_DATA_NOTICE,
  MINE_RISK_INDEX,
} from "./context";

/* ────────────────────────────  KPI row  ──────────────────────────── */

export interface DashboardKpi {
  id: string;
  label: string;
  value: number;
  /** Operational context that makes the number actionable. */
  context: string;
  semantic: SemanticStatus;
  ctaLabel: string;
  href: string;
  icon: "hazard" | "overdue" | "review" | "inspection";
}

/** Exactly four primary KPIs. Adding a fifth dilutes the decision surface. */
export const DASHBOARD_KPIS: DashboardKpi[] = [
  {
    id: "high-risk-hazards",
    label: "High-Risk Hazards",
    value: 3,
    context: "2 escalated",
    semantic: "danger",
    ctaLabel: "View hazards",
    href: "/hazards?severity=HIGH",
    icon: "hazard",
  },
  {
    id: "overdue-actions",
    label: "Overdue Corrective Actions",
    value: 5,
    context: "Oldest: 2 days overdue",
    semantic: "warning",
    ctaLabel: "View actions",
    href: "/corrective-actions?status=OVERDUE",
    icon: "overdue",
  },
  {
    id: "pending-reviews",
    label: "Pending Reviews",
    value: 4,
    context: "2 with evidence conflicts",
    semantic: "info",
    ctaLabel: "View reviews",
    href: "/inspections?status=PENDING_REVIEW",
    icon: "review",
  },
  {
    id: "inspections-due",
    label: "Inspections Due Today",
    value: 7,
    context: "3 completed this shift",
    semantic: "neutral",
    ctaLabel: "View inspections",
    href: "/inspections?period=today",
    icon: "inspection",
  },
];

/* ────────────────────────  Priority action queue  ────────────────────── */

export type EntityType = "HAZARD" | "INSPECTION" | "CORRECTIVE_ACTION";

export interface PriorityAction {
  id: string;
  entityType: EntityType;
  title: string;
  location: string;
  severity?: HazardSeverity;
  lifecycleStatus: LifecycleStatus | "PENDING_REVIEW";
  /** A named person or function. Never left implicit. */
  owner: string;
  /** Human-readable urgency; an exact date alone is not enough. */
  dueLabel: string;
  dueDate?: string;
  /** True when the item is past its deadline. */
  overdue: boolean;
  evidenceCount: number;
  syncState: SyncState;
  geofenceState: GeofenceState;
  actionLabel: string;
  href: string;
}

/**
 * Four rows. This is a decision queue, not the hazard register — the full
 * list lives on /hazards.
 */
export const PRIORITY_ACTIONS: PriorityAction[] = [
  {
    id: "HZRD-2026-442",
    entityType: "HAZARD",
    title: "Roof support damage observed",
    location: "Seam 2, Main Gallery",
    severity: "HIGH",
    lifecycleStatus: "ESCALATED",
    owner: "M. Sharma",
    dueLabel: "2 days overdue",
    dueDate: "08 Sep 2026",
    overdue: true,
    evidenceCount: 1,
    syncState: "CONFLICT",
    geofenceState: "CONFLICT",
    actionLabel: "Review hazard",
    href: "/hazards/HZRD-2026-442",
  },
  {
    id: "ACT-2026-118",
    entityType: "CORRECTIVE_ACTION",
    title: "Ventilation reading corrective action",
    location: "Seam 1, Return Airway",
    severity: "HIGH",
    lifecycleStatus: "OVERDUE",
    owner: "R. Singh",
    dueLabel: "Due today",
    dueDate: "10 Sep 2026",
    overdue: true,
    evidenceCount: 2,
    syncState: "SYNCED",
    geofenceState: "SERVER_VERIFIED",
    actionLabel: "Review action",
    href: "/corrective-actions/ACT-2026-118",
  },
  {
    id: "INSP-2026-917",
    entityType: "INSPECTION",
    title: "Pre-shift electrical inspection",
    location: "Workshop Bay 2",
    lifecycleStatus: "PENDING_REVIEW",
    owner: "A. Verma",
    dueLabel: "Awaiting review",
    overdue: false,
    evidenceCount: 5,
    syncState: "SYNCED",
    geofenceState: "SERVER_VERIFIED",
    actionLabel: "Review inspection",
    href: "/inspections/INSP-2026-917",
  },
  {
    id: "HZRD-2026-438",
    entityType: "HAZARD",
    title: "Water accumulation near haul road",
    location: "North Haul Road",
    severity: "MEDIUM",
    lifecycleStatus: "ACKNOWLEDGED",
    owner: "S. Das",
    dueLabel: "Due in 3 days",
    dueDate: "13 Sep 2026",
    overdue: false,
    evidenceCount: 3,
    syncState: "SYNCED",
    geofenceState: "SERVER_PENDING",
    actionLabel: "Review hazard",
    href: "/hazards/HZRD-2026-438",
  },
];

/* ──────────────────────────  Compliance  ─────────────────────────── */

export type ComplianceState = "OVERDUE" | "DUE_TODAY" | "UPCOMING";

export interface ComplianceDeadline {
  id: string;
  title: string;
  state: ComplianceState;
  /** Human-readable urgency shown before the calendar date. */
  urgencyLabel: string;
  dueDate: string;
  owner: string;
}

export const COMPLIANCE_DEADLINES: ComplianceDeadline[] = [
  {
    id: "CMP-ROOF-REG",
    title: "Roof Support Inspection Register",
    state: "OVERDUE",
    urgencyLabel: "2 days overdue",
    dueDate: "08 Sep 2026",
    owner: "Safety Department",
  },
  {
    id: "CMP-VENT-REVIEW",
    title: "Ventilation Monitoring Review",
    state: "DUE_TODAY",
    urgencyLabel: "Due today",
    dueDate: "10 Sep 2026",
    owner: "Ventilation Officer",
  },
  {
    id: "CMP-EMERG-CHECK",
    title: "Monthly Emergency Equipment Check",
    state: "UPCOMING",
    urgencyLabel: "Due in 2 days",
    dueDate: "12 Sep 2026",
    owner: "Shift Safety Officer",
  },
  {
    id: "CMP-CA-DOSSIER",
    title: "Corrective Action Evidence Dossier",
    state: "UPCOMING",
    urgencyLabel: "Due in 4 days",
    dueDate: "14 Sep 2026",
    owner: "M. Sharma",
  },
];

/* ─────────────────────  Sync / evidence exceptions  ──────────────────── */

export interface EvidenceException {
  id: string;
  title: string;
  detail: string;
  syncState: SyncState;
  geofenceState?: GeofenceState;
  /**
   * QUEUED and OFFLINE are normal field conditions, not failures. Only a
   * genuine conflict earns danger treatment.
   */
  severity: "conflict" | "pending" | "normal";
  href: string;
}

export const EVIDENCE_EXCEPTIONS: EvidenceException[] = [
  {
    id: "HZRD-2026-442",
    title: "Geofence conflict",
    detail:
      "Local evidence and server verification disagree. Both versions retained for review.",
    syncState: "CONFLICT",
    geofenceState: "CONFLICT",
    severity: "conflict",
    href: "/hazards/HZRD-2026-442",
  },
  {
    id: "INSP-2026-905",
    title: "Server verification pending",
    detail:
      "Field submission synced. Server-side location verification still in progress.",
    syncState: "SYNCED",
    geofenceState: "SERVER_PENDING",
    severity: "pending",
    href: "/inspections/INSP-2026-905",
  },
  {
    id: "HZRD-2026-431",
    title: "Queued from offline capture",
    detail:
      "Captured underground with no network. Submission is safely queued and will sync.",
    syncState: "QUEUED",
    severity: "normal",
    href: "/hazards/HZRD-2026-431",
  },
];

/* ────────────────────────  Recent activity  ─────────────────────── */

export interface RecentInspection {
  id: string;
  type: string;
  status: LifecycleStatus;
  syncState: SyncState;
  geofenceState: GeofenceState;
  actorName: string;
  timestamp: string;
  evidenceCount: number;
  locationName: string;
}

/** Shaped to InspectionCard's existing props so it can be reused directly. */
export const RECENT_INSPECTION: RecentInspection = {
  id: "INSP-2026-901",
  type: "Daily Safety Walk",
  status: "RESOLVED",
  syncState: "SYNCED",
  geofenceState: "SERVER_VERIFIED",
  actorName: "Rajesh Kumar (Sirdar)",
  timestamp: "10 Sep 2026, 06:15",
  evidenceCount: 4,
  locationName: "Seam 3, Panel B",
};

export interface ActivityEvent {
  id: string;
  label: string;
  time: string;
  kind: "action" | "evidence" | "inspection";
}

export const RECENT_EVENTS: ActivityEvent[] = [
  {
    id: "ACT-2026-113",
    label: "Corrective action ACT-2026-113 acknowledged by R. Singh",
    time: "07:58",
    kind: "action",
  },
  {
    id: "HZRD-2026-437",
    label: "Hazard HZRD-2026-437 evidence verified server-side",
    time: "07:41",
    kind: "evidence",
  },
  {
    id: "INSP-2026-899",
    label: "Inspection INSP-2026-899 resolved and ledgered",
    time: "06:52",
    kind: "inspection",
  },
];
