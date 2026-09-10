/**
 * Every backend path the frontend calls, in one place.
 *
 * The path strings below are copied from the frozen contract and nowhere else.
 * `API_PATHS` exists so the contract guard test can assert each template
 * against `openapi.snapshot.json` — if the backend renames a route, the test
 * fails rather than the demo.
 */

import { api } from "./client";
import type {
  AuditEventListResponse,
  AuditEventQuery,
  AuditVerificationOut,
  CorrectiveActionCreateIn,
  CorrectiveActionOut,
  CorrectiveActionResolveIn,
  CorrectiveActionUpdateIn,
  DashboardSummaryOut,
  EvidenceUploadInput,
  EvidenceUploadOut,
  HazardAcknowledgeIn,
  HazardCreateIn,
  HazardDetailOut,
  HazardListQuery,
  HazardListResponse,
  HazardReviewIn,
  RiskRecalculateIn,
  RiskSnapshotOut,
} from "./contract";
import { EVIDENCE_UPLOAD_FIELDS } from "./contract";

/**
 * OpenAPI path templates, exactly as the contract spells them — including the
 * snake_case path parameter names, which are the backend's, not ours.
 */
export const API_PATHS = {
  dashboardSummary: "/api/v1/dashboard/summary",
  hazards: "/api/v1/hazards",
  hazardDetail: "/api/v1/hazards/{hazard_id}",
  hazardAcknowledge: "/api/v1/hazards/{hazard_id}/acknowledge",
  hazardReview: "/api/v1/hazards/{hazard_id}/review",
  hazardEvidence: "/api/v1/hazards/{hazard_id}/evidence",
  correctiveActions: "/api/v1/corrective-actions",
  correctiveAction: "/api/v1/corrective-actions/{action_id}",
  correctiveActionResolve: "/api/v1/corrective-actions/{action_id}/resolve",
  auditEvents: "/api/v1/audit/events",
  auditVerify: "/api/v1/audit/verify",
  riskMine: "/api/v1/risk/mines/{mine_id}",
  riskRecalculate: "/api/v1/risk/mines/{mine_id}/recalculate",
  health: "/health",
  ready: "/ready",
} as const;

/** Fills a path template, encoding each value so an id can never break out. */
function fill(template: string, params: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_match, key: string) => {
    const value = params[key];
    if (value === undefined) {
      throw new Error(`Missing path parameter "${key}" for ${template}`);
    }
    return encodeURIComponent(value);
  });
}

/* ---------------------------------------------------------------- dashboard */

export function getDashboardSummary(mineId: string) {
  return api.get<DashboardSummaryOut>(API_PATHS.dashboardSummary, {
    query: { mineId },
  });
}

/* ------------------------------------------------------------------ hazards */

export function listHazards(query: HazardListQuery = {}) {
  return api.get<HazardListResponse>(API_PATHS.hazards, {
    query: {
      mineId: query.mineId,
      severity: query.severity,
      status: query.status,
      limit: query.limit,
      offset: query.offset,
    },
  });
}

export function getHazard(hazardId: string) {
  return api.get<HazardDetailOut>(
    fill(API_PATHS.hazardDetail, { hazard_id: hazardId })
  );
}

export function createHazard(body: HazardCreateIn) {
  return api.post<HazardDetailOut>(API_PATHS.hazards, body);
}

export function acknowledgeHazard(hazardId: string, body: HazardAcknowledgeIn) {
  return api.post<HazardDetailOut>(
    fill(API_PATHS.hazardAcknowledge, { hazard_id: hazardId }),
    body
  );
}

export function reviewHazard(hazardId: string, body: HazardReviewIn) {
  return api.post<HazardDetailOut>(
    fill(API_PATHS.hazardReview, { hazard_id: hazardId }),
    body
  );
}

/* -------------------------------------------------------- corrective actions */

export function createCorrectiveAction(body: CorrectiveActionCreateIn) {
  return api.post<CorrectiveActionOut>(API_PATHS.correctiveActions, body);
}

export function updateCorrectiveAction(
  actionId: string,
  body: CorrectiveActionUpdateIn
) {
  return api.patch<CorrectiveActionOut>(
    fill(API_PATHS.correctiveAction, { action_id: actionId }),
    body
  );
}

export function resolveCorrectiveAction(
  actionId: string,
  body: CorrectiveActionResolveIn
) {
  return api.post<CorrectiveActionOut>(
    fill(API_PATHS.correctiveActionResolve, { action_id: actionId }),
    body
  );
}

/* ----------------------------------------------------------------- evidence */

/**
 * Builds the multipart body from the contract's field names. Numbers are
 * stringified because that is what multipart carries; the backend coerces them
 * back. `localGeofenceState` and `clientSha256` are omitted when absent so the
 * backend applies its own documented default rather than receiving "undefined".
 */
export function buildEvidenceFormData(input: EvidenceUploadInput): FormData {
  const form = new FormData();
  const f = EVIDENCE_UPLOAD_FIELDS;

  form.set(f.evidenceId, input.evidenceId);
  form.set(f.actorId, input.actorId);
  form.set(f.capturedAt, input.capturedAt);
  form.set(f.latitude, String(input.latitude));
  form.set(f.longitude, String(input.longitude));
  form.set(f.accuracyMeters, String(input.accuracyMeters));

  if (input.localGeofenceState) {
    form.set(f.localGeofenceState, input.localGeofenceState);
  }
  if (input.clientSha256) {
    form.set(f.clientSha256, input.clientSha256);
  }

  form.set(f.file, input.file, input.fileName);
  return form;
}

export function uploadHazardEvidence(input: EvidenceUploadInput) {
  return api.postForm<EvidenceUploadOut>(
    fill(API_PATHS.hazardEvidence, { hazard_id: input.hazardId }),
    buildEvidenceFormData(input)
  );
}

/* --------------------------------------------------------------------- risk */

export function getLatestMineRisk(mineId: string) {
  return api.get<RiskSnapshotOut>(
    fill(API_PATHS.riskMine, { mine_id: mineId })
  );
}

export function recalculateMineRisk(mineId: string, body: RiskRecalculateIn) {
  return api.post<RiskSnapshotOut>(
    fill(API_PATHS.riskRecalculate, { mine_id: mineId }),
    body
  );
}

/* -------------------------------------------------------------------- audit */

export function listAuditEvents(query: AuditEventQuery = {}) {
  return api.get<AuditEventListResponse>(API_PATHS.auditEvents, {
    query: {
      entityType: query.entityType,
      entityId: query.entityId,
      limit: query.limit,
      offset: query.offset,
    },
  });
}

export function verifyAuditChain() {
  return api.get<AuditVerificationOut>(API_PATHS.auditVerify);
}

/* ------------------------------------------------------------------- health */

export function getHealth() {
  return api.get<Record<string, string>>(API_PATHS.health);
}
