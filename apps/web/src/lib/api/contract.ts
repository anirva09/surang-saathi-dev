/**
 * The frozen backend contract, transcribed from the backend worktree's
 * `docs/api/openapi.json` (Surang Saathi API 0.1.0, OpenAPI 3.1.0).
 *
 * THE BACKEND CONTRACT WINS. Every name here is the wire name the API actually
 * emits or accepts — the FastAPI routers serialise with
 * `response_model_by_alias=True`, so responses are camelCase and request
 * bodies are camelCase too. Nothing in this file is inferred from the old
 * frontend mocks.
 *
 * A snapshot of the contract lives beside this file as `openapi.snapshot.json`
 * and `tests/contract.test.ts` asserts these declarations against it, so
 * contract drift fails the build instead of the demo.
 */

/* ------------------------------------------------------------------ enums */

/** `HazardSeverity` in the contract. */
export const HAZARD_SEVERITIES = ["LOW", "MEDIUM", "HIGH"] as const;
export type HazardSeverity = (typeof HAZARD_SEVERITIES)[number];

/**
 * `LifecycleStatus` in the backend's domain enums. The contract types hazard
 * and corrective-action `status` as a bare string on the way out, so the union
 * is the documented domain vocabulary and every reader must tolerate a value
 * outside it rather than crashing.
 */
export const LIFECYCLE_STATUSES = [
  "OPEN",
  "ACKNOWLEDGED",
  "OVERDUE",
  "ESCALATED",
  "RESOLVED",
] as const;
export type LifecycleStatus = (typeof LIFECYCLE_STATUSES)[number];

/** The subset `HazardReviewIn.status` accepts. */
export const HAZARD_REVIEW_STATUSES = ["ACKNOWLEDGED", "ESCALATED"] as const;
export type HazardReviewStatus = (typeof HAZARD_REVIEW_STATUSES)[number];

/** The subset `CorrectiveActionUpdateIn.status` accepts. */
export const CORRECTIVE_ACTION_UPDATE_STATUSES = [
  "OPEN",
  "ACKNOWLEDGED",
  "OVERDUE",
  "ESCALATED",
] as const;
export type CorrectiveActionUpdateStatus =
  (typeof CORRECTIVE_ACTION_UPDATE_STATUSES)[number];

/** `SyncState` in the backend's domain enums. */
export const SYNC_STATES = [
  "QUEUED",
  "SYNCING",
  "SYNCED",
  "CONFLICT",
  "OFFLINE",
] as const;
export type SyncState = (typeof SYNC_STATES)[number];

/** `GeofenceState` — the only output enum the contract declares explicitly. */
export const GEOFENCE_STATES = [
  "LOCAL_VALID",
  "SERVER_PENDING",
  "SERVER_VERIFIED",
  "OUTSIDE_GEOFENCE",
  "CONFLICT",
] as const;
export type GeofenceState = (typeof GEOFENCE_STATES)[number];

/**
 * An ISO-8601 date-time string exactly as the API emits it. Kept as a string
 * rather than a Date so server-rendered payloads cross the serialisation
 * boundary unchanged and formatting stays an explicit, locale-aware step.
 */
export type IsoDateTime = string;

/* ------------------------------------------------------------- shared DTOs */

/** `ActorOut` */
export interface ActorOut {
  id: string;
  name: string;
  role: string;
}

/* ---------------------------------------------------------------- dashboard */

/** `MineSummaryOut` */
export interface MineSummaryOut {
  id: string;
  code: string;
  name: string;
  areaName: string;
}

/** `RiskFactorOut` — the compact factor shape on the dashboard summary. */
export interface RiskFactorOut {
  name: string;
  weight: number;
  /** The contract allows an integer or a pre-formatted string such as "82%". */
  currentValue: number | string;
}

/** `RiskSummaryOut` */
export interface RiskSummaryOut {
  score: number;
  level: string;
  factors: RiskFactorOut[];
}

/**
 * `DashboardKpisOut` — exactly four counters, and the only four the dashboard
 * is allowed to show.
 */
export interface DashboardKpisOut {
  openHazards: number;
  highRiskHazards: number;
  overdueCorrectiveActions: number;
  conflictedHazards: number;
}

/** `DashboardSummaryOut` */
export interface DashboardSummaryOut {
  mine: MineSummaryOut;
  /** Null until a risk snapshot exists for the mine. */
  risk: RiskSummaryOut | null;
  kpis: DashboardKpisOut;
  asOf: IsoDateTime;
}

/* ------------------------------------------------------------------ hazards */

/** `EvidenceOut` */
export interface EvidenceOut {
  evidenceId: string;
  fileName: string;
  mimeType: string;
  fileSize: number;
  sha256: string;
  latitude: number | null;
  longitude: number | null;
  accuracyMeters: number | null;
  capturedAt: IsoDateTime;
  localGeofenceState: string;
  serverGeofenceState: string;
}

/** `CorrectiveActionOut` */
export interface CorrectiveActionOut {
  actionId: string;
  description: string;
  status: string;
  dueAt: IsoDateTime;
  assignedTo: ActorOut | null;
  acknowledgedAt?: IsoDateTime | null;
  resolvedAt?: IsoDateTime | null;
}

/** `HazardListItemOut` */
export interface HazardListItemOut {
  hazardId: string;
  mineId: string;
  title: string;
  severity: string;
  status: string;
  locationName: string;
  reportedBy: ActorOut;
  assignedTo: ActorOut | null;
  syncState: string;
  geofenceState: string;
  capturedAt: IsoDateTime;
  syncedAt: IsoDateTime | null;
  evidenceCount: number;
  correctiveActionCount: number;
}

/** `HazardDetailOut` — the list item plus the description and both children. */
export interface HazardDetailOut extends HazardListItemOut {
  description: string;
  evidence: EvidenceOut[];
  correctiveActions: CorrectiveActionOut[];
}

/** `HazardListResponse` */
export interface HazardListResponse {
  items: HazardListItemOut[];
  total: number;
  limit: number;
  offset: number;
}

/* ------------------------------------------------------- hazard mutations */

/** `HazardCreateIn` */
export interface HazardCreateIn {
  hazardId: string;
  mineId: string;
  title: string;
  description: string;
  severity: HazardSeverity;
  locationName: string;
  reportedByUserId: string;
  assignedToUserId?: string | null;
  capturedAt: IsoDateTime;
  actorId: string;
}

/** `HazardAcknowledgeIn` */
export interface HazardAcknowledgeIn {
  actorId: string;
}

/** `HazardReviewIn` */
export interface HazardReviewIn {
  actorId: string;
  severity?: HazardSeverity | null;
  status?: HazardReviewStatus | null;
  assignedToUserId?: string | null;
}

/* -------------------------------------------- corrective action mutations */

/** `CorrectiveActionCreateIn` */
export interface CorrectiveActionCreateIn {
  actionId: string;
  hazardId: string;
  description: string;
  assignedToUserId: string;
  dueAt: IsoDateTime;
  actorId: string;
}

/** `CorrectiveActionUpdateIn` */
export interface CorrectiveActionUpdateIn {
  actorId: string;
  description?: string | null;
  assignedToUserId?: string | null;
  dueAt?: IsoDateTime | null;
  status?: CorrectiveActionUpdateStatus | null;
}

/** `CorrectiveActionResolveIn` */
export interface CorrectiveActionResolveIn {
  actorId: string;
}

/* ----------------------------------------------------------------- evidence */

/** `EvidenceUploadOut` — `EvidenceOut` plus the server's verification verdict. */
export interface EvidenceUploadOut extends EvidenceOut {
  hazardId: string;
  hashVerified: boolean;
  hazardSyncState: string;
  hazardGeofenceState: string;
}

/**
 * The multipart field names of
 * `Body_upload_evidence_endpoint_api_v1_hazards__hazard_id__evidence_post`.
 * Declared as a const so the upload builder cannot drift from the contract and
 * the guard test can check every name against the snapshot.
 */
export const EVIDENCE_UPLOAD_FIELDS = {
  evidenceId: "evidenceId",
  actorId: "actorId",
  capturedAt: "capturedAt",
  latitude: "latitude",
  longitude: "longitude",
  accuracyMeters: "accuracyMeters",
  localGeofenceState: "localGeofenceState",
  clientSha256: "clientSha256",
  file: "file",
} as const;

/** The route's own limits, enforced before upload so the user learns sooner. */
export const EVIDENCE_ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;
export const EVIDENCE_MAX_BYTES = 10 * 1024 * 1024;

export interface EvidenceUploadInput {
  hazardId: string;
  evidenceId: string;
  actorId: string;
  capturedAt: IsoDateTime;
  latitude: number;
  longitude: number;
  accuracyMeters: number;
  /** Defaults to LOCAL_VALID in the contract. */
  localGeofenceState?: GeofenceState;
  /** 64 hex characters, or omitted. */
  clientSha256?: string | null;
  file: Blob;
  fileName: string;
}

/* --------------------------------------------------------------------- risk */

/** `RiskFactorDetailOut` — the scored factor shape on a full snapshot. */
export interface RiskFactorDetailOut {
  name: string;
  weight: number;
  currentValue: number | string;
  score: number | null;
  contribution: number | null;
  source: string;
}

/** `RiskSnapshotOut` */
export interface RiskSnapshotOut {
  riskSnapshotId: string;
  mineId: string;
  score: number;
  level: string;
  factors: RiskFactorDetailOut[];
  calculatedAt: IsoDateTime;
}

/** `RiskRecalculateIn` */
export interface RiskRecalculateIn {
  actorId: string;
  gasBreaches30d?: number | null;
  inspectionCoveragePercent?: number | null;
}

/* -------------------------------------------------------------------- audit */

/** `AuditEventOut` */
export interface AuditEventOut {
  sequence: number;
  id: string;
  entityType: string;
  entityId: string;
  eventType: string;
  actorId: string | null;
  payload: Record<string, unknown>;
  previousHash: string | null;
  eventHash: string;
  createdAt: IsoDateTime;
}

/** `AuditEventListResponse` */
export interface AuditEventListResponse {
  items: AuditEventOut[];
  total: number;
  limit: number;
  offset: number;
}

/** `AuditVerificationOut` */
export interface AuditVerificationOut {
  valid: boolean;
  totalEvents: number;
  checkedEvents: number;
  headHash: string | null;
  firstInvalidSequence: number | null;
  firstInvalidEventId: string | null;
  reason: string | null;
}

/* ----------------------------------------------------------- query objects */

export interface HazardListQuery {
  mineId?: string | null;
  severity?: string | null;
  status?: string | null;
  /** 1–100, default 50. */
  limit?: number;
  /** ≥ 0, default 0. */
  offset?: number;
}

export interface AuditEventQuery {
  entityType?: string | null;
  entityId?: string | null;
  /** 1–200, default 100. */
  limit?: number;
  /** ≥ 0, default 0. */
  offset?: number;
}

/* --------------------------------------------------------- narrowing helpers */

export function isHazardSeverity(value: string): value is HazardSeverity {
  return (HAZARD_SEVERITIES as readonly string[]).includes(value);
}

export function isLifecycleStatus(value: string): value is LifecycleStatus {
  return (LIFECYCLE_STATUSES as readonly string[]).includes(value);
}

export function isSyncState(value: string): value is SyncState {
  return (SYNC_STATES as readonly string[]).includes(value);
}

export function isGeofenceState(value: string): value is GeofenceState {
  return (GEOFENCE_STATES as readonly string[]).includes(value);
}
