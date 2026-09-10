"use server";

import { revalidatePath } from "next/cache";
import { DEMO_MINE_ID, PROTOTYPE_ACTOR_ID } from "@/lib/api/client";
import { recalculateMineRisk } from "@/lib/api/endpoints";
import {
  actionFailed,
  actionOk,
  localValidationFailure,
  type ActionResult,
} from "@/lib/api/failure";

function readString(form: FormData, field: string): string {
  const value = form.get(field);
  return typeof value === "string" ? value.trim() : "";
}

/**
 * Recalculates the mine risk index.
 *
 * Both inputs are optional in the contract. A blank field is omitted from the
 * request rather than sent as null, so the risk service keeps whatever value it
 * already holds instead of having it cleared by an empty form.
 */
export async function recalculateRiskAction(
  form: FormData
): Promise<ActionResult> {
  const gasRaw = readString(form, "gasBreaches30d");
  const coverageRaw = readString(form, "inspectionCoveragePercent");

  const gasBreaches30d = gasRaw === "" ? undefined : Number(gasRaw);
  const inspectionCoveragePercent =
    coverageRaw === "" ? undefined : Number(coverageRaw);

  const keys: Record<string, string> = {};
  if (gasBreaches30d !== undefined && !Number.isFinite(gasBreaches30d)) {
    keys.gasBreaches30d = "mutate.required";
  }
  if (
    inspectionCoveragePercent !== undefined &&
    !Number.isFinite(inspectionCoveragePercent)
  ) {
    keys.inspectionCoveragePercent = "mutate.required";
  }
  if (Object.keys(keys).length > 0) {
    return {
      ok: false,
      failure: localValidationFailure(
        keys,
        "The recalculation inputs must be numbers."
      ),
    };
  }

  try {
    await recalculateMineRisk(DEMO_MINE_ID, {
      actorId: PROTOTYPE_ACTOR_ID,
      ...(gasBreaches30d === undefined ? {} : { gasBreaches30d }),
      ...(inspectionCoveragePercent === undefined
        ? {}
        : { inspectionCoveragePercent }),
    });

    // A new snapshot changes the risk screen, the dashboard's risk panel, and
    // appends to the ledger.
    revalidatePath("/risk");
    revalidatePath("/dashboard");
    revalidatePath("/audit");
    return actionOk(undefined);
  } catch (error) {
    return actionFailed(error);
  }
}
