"use server";

import { revalidatePath } from "next/cache";
import { PROTOTYPE_ACTOR_ID } from "@/lib/api/client";
import {
  acknowledgeHazard,
  createCorrectiveAction,
  resolveCorrectiveAction,
  reviewHazard,
  uploadHazardEvidence,
  updateCorrectiveAction,
} from "@/lib/api/endpoints";
import {
  EVIDENCE_ALLOWED_MIME_TYPES,
  EVIDENCE_MAX_BYTES,
  isHazardSeverity,
  type HazardReviewStatus,
  type HazardSeverity,
} from "@/lib/api/contract";
import {
  actionFailed,
  actionOk,
  localValidationFailure,
  type ActionResult,
} from "@/lib/api/failure";

/**
 * Server Actions for every hazard mutation the contract exposes.
 *
 * All of them run on the server, so the API base URL and the acting user stay
 * server-side and the browser never needs CORS access to the backend. Each one
 * returns an `ActionResult` rather than throwing, so a 409 from the API renders
 * as a conflict message beside the control instead of a framework error page.
 *
 * `actorId` is the configured prototype actor. There is no authentication
 * service yet, and nothing here pretends otherwise: no token is minted, no
 * session is implied, and the audit ledger records the real configured user.
 */

/** Re-reads the screens whose contents the mutation just changed. */
function revalidateHazard(hazardId: string) {
  revalidatePath(`/hazards/${hazardId}`);
  revalidatePath("/hazards");
  revalidatePath("/dashboard");
  // Every mutation appends to the ledger, and several move the risk inputs.
  revalidatePath("/audit");
  revalidatePath("/risk");
}

function readString(form: FormData, field: string): string {
  const value = form.get(field);
  return typeof value === "string" ? value.trim() : "";
}

/* ------------------------------------------------------------- acknowledge */

export async function acknowledgeHazardAction(
  hazardId: string
): Promise<ActionResult> {
  try {
    await acknowledgeHazard(hazardId, { actorId: PROTOTYPE_ACTOR_ID });
    revalidateHazard(hazardId);
    return actionOk(undefined);
  } catch (error) {
    return actionFailed(error);
  }
}

/* ------------------------------------------------------------------ review */

export async function reviewHazardAction(
  hazardId: string,
  form: FormData
): Promise<ActionResult> {
  const severityRaw = readString(form, "severity");
  const statusRaw = readString(form, "status");

  // An empty select means "leave unchanged", which the contract expresses as an
  // omitted field — not as a null that would overwrite the stored value.
  const severity: HazardSeverity | undefined =
    severityRaw && isHazardSeverity(severityRaw) ? severityRaw : undefined;
  const status: HazardReviewStatus | undefined =
    statusRaw === "ACKNOWLEDGED" || statusRaw === "ESCALATED"
      ? statusRaw
      : undefined;

  try {
    await reviewHazard(hazardId, {
      actorId: PROTOTYPE_ACTOR_ID,
      ...(severity ? { severity } : {}),
      ...(status ? { status } : {}),
    });
    revalidateHazard(hazardId);
    return actionOk(undefined);
  } catch (error) {
    return actionFailed(error);
  }
}

/* ------------------------------------------------------- corrective actions */

/**
 * The contract requires the client to supply the action's id. It is derived
 * from the hazard plus a timestamp so a retry after a network failure does not
 * silently create a second action, and a genuine duplicate comes back as the
 * backend's own 409 rather than being hidden.
 */
function newActionId(hazardId: string): string {
  const suffix = hazardId.replace(/[^A-Za-z0-9]/g, "").slice(-8) || "HAZARD";
  const stamp = new Date()
    .toISOString()
    .replace(/[-:T.]/g, "")
    .slice(0, 14);
  return `ACT-${suffix}-${stamp}`;
}

export async function createCorrectiveActionAction(
  hazardId: string,
  form: FormData
): Promise<ActionResult> {
  const description = readString(form, "description");
  const assignedToUserId = readString(form, "assignedToUserId");
  const dueAtLocal = readString(form, "dueAt");

  // `datetime-local` has no timezone; the contract wants an instant, so the
  // browser's own offset is applied here rather than guessing UTC.
  const dueAt = dueAtLocal ? new Date(dueAtLocal).toISOString() : "";

  if (!description || !assignedToUserId || !dueAt) {
    return {
      ok: false,
      failure: localValidationFailure(
        {
          ...(description ? {} : { description: "mutate.required" }),
          ...(assignedToUserId ? {} : { assignedToUserId: "mutate.required" }),
          ...(dueAt ? {} : { dueAt: "mutate.required" }),
        },
        "Description, assignee and deadline are all required."
      ),
    };
  }

  try {
    await createCorrectiveAction({
      actionId: newActionId(hazardId),
      hazardId,
      description,
      assignedToUserId,
      dueAt,
      actorId: PROTOTYPE_ACTOR_ID,
    });
    revalidateHazard(hazardId);
    return actionOk(undefined);
  } catch (error) {
    return actionFailed(error);
  }
}

export async function resolveCorrectiveActionAction(
  hazardId: string,
  actionId: string
): Promise<ActionResult> {
  try {
    await resolveCorrectiveAction(actionId, { actorId: PROTOTYPE_ACTOR_ID });
    revalidateHazard(hazardId);
    return actionOk(undefined);
  } catch (error) {
    return actionFailed(error);
  }
}

export async function acknowledgeCorrectiveActionAction(
  hazardId: string,
  actionId: string
): Promise<ActionResult> {
  try {
    await updateCorrectiveAction(actionId, {
      actorId: PROTOTYPE_ACTOR_ID,
      status: "ACKNOWLEDGED",
    });
    revalidateHazard(hazardId);
    return actionOk(undefined);
  } catch (error) {
    return actionFailed(error);
  }
}

/* ---------------------------------------------------------------- evidence */

export interface EvidenceUploadSummary {
  evidenceId: string;
  hashVerified: boolean;
  serverGeofenceState: string;
  hazardGeofenceState: string;
}

export async function uploadEvidenceAction(
  hazardId: string,
  form: FormData
): Promise<ActionResult<EvidenceUploadSummary>> {
  const file = form.get("file");
  const latitude = Number(readString(form, "latitude"));
  const longitude = Number(readString(form, "longitude"));
  const accuracyMeters = Number(readString(form, "accuracyMeters"));
  const capturedAtLocal = readString(form, "capturedAt");

  const keys: Record<string, string> = {};
  if (!(file instanceof File) || file.size === 0) {
    keys.file = "mutate.required";
  } else if (!EVIDENCE_ALLOWED_MIME_TYPES.includes(file.type as never)) {
    // Mirrors the route's own 415, so the user learns before the upload.
    keys.file = "mutate.evidence.wrongType";
  } else if (file.size > EVIDENCE_MAX_BYTES) {
    // Mirrors the route's own 413 for the same reason.
    keys.file = "mutate.evidence.tooLarge";
  }
  if (!Number.isFinite(latitude)) keys.latitude = "mutate.required";
  if (!Number.isFinite(longitude)) keys.longitude = "mutate.required";
  if (!Number.isFinite(accuracyMeters)) keys.accuracyMeters = "mutate.required";
  if (!capturedAtLocal) keys.capturedAt = "mutate.required";

  if (Object.keys(keys).length > 0) {
    return {
      ok: false,
      failure: localValidationFailure(
        keys,
        "The evidence details are incomplete."
      ),
    };
  }

  const upload = file as File;
  const suffix = hazardId.replace(/[^A-Za-z0-9]/g, "").slice(-8) || "HAZARD";
  const stamp = new Date()
    .toISOString()
    .replace(/[-:T.]/g, "")
    .slice(0, 14);

  try {
    // The server recomputes the hash and compares it with what we send, which
    // is the whole point of the evidence chain — so the digest is computed here
    // from the bytes actually uploaded.
    const bytes = await upload.arrayBuffer();
    const digest = await crypto.subtle.digest("SHA-256", bytes);
    const clientSha256 = Array.from(new Uint8Array(digest))
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");

    const result = await uploadHazardEvidence({
      hazardId,
      evidenceId: `EVD-${suffix}-${stamp}`,
      actorId: PROTOTYPE_ACTOR_ID,
      capturedAt: new Date(capturedAtLocal).toISOString(),
      latitude,
      longitude,
      accuracyMeters,
      clientSha256,
      file: new Blob([bytes], { type: upload.type }),
      fileName: upload.name,
    });

    revalidateHazard(hazardId);
    return actionOk({
      evidenceId: result.evidenceId,
      hashVerified: result.hashVerified,
      serverGeofenceState: result.serverGeofenceState,
      hazardGeofenceState: result.hazardGeofenceState,
    });
  } catch (error) {
    return actionFailed(error);
  }
}
