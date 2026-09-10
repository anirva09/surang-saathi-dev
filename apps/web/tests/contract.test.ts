import { describe, expect, it } from "vitest";
import snapshot from "@/lib/api/openapi.snapshot.json";
import { API_PATHS } from "@/lib/api/endpoints";
import {
  EVIDENCE_ALLOWED_MIME_TYPES,
  EVIDENCE_MAX_BYTES,
  EVIDENCE_UPLOAD_FIELDS,
  GEOFENCE_STATES,
  HAZARD_REVIEW_STATUSES,
  HAZARD_SEVERITIES,
  CORRECTIVE_ACTION_UPDATE_STATUSES,
} from "@/lib/api/contract";
import { BACKEND_ERROR_CODES } from "@/lib/api/errors";

/**
 * The contract guard.
 *
 * `openapi.snapshot.json` is a frontend-owned copy of the backend's frozen
 * contract. These tests assert that every path the frontend calls and every
 * field it reads is actually declared there, so a backend rename fails the build
 * instead of the demo.
 *
 * To re-sync after an intentional backend change: copy the backend's
 * `docs/api/openapi.json` over `src/lib/api/openapi.snapshot.json` and run the
 * suite. Whatever fails is what the frontend has to adapt to — the backend
 * contract wins.
 */

interface OpenApiDocument {
  openapi: string;
  info: { title: string; version: string };
  paths: Record<string, Record<string, unknown>>;
  components: {
    schemas: Record<
      string,
      {
        type?: string;
        enum?: string[];
        required?: string[];
        properties?: Record<string, unknown>;
      }
    >;
  };
}

const doc = snapshot as unknown as OpenApiDocument;
const schemas = doc.components.schemas;

/** Every property name a schema declares, required or not. */
function propertiesOf(name: string): string[] {
  const schema = schemas[name];
  expect(schema, `schema ${name} is missing from the contract`).toBeDefined();
  return Object.keys(schema.properties ?? {});
}

/** Asserts the frontend reads only fields the schema declares. */
function expectFieldsDeclared(schemaName: string, fields: string[]) {
  const declared = propertiesOf(schemaName);
  for (const field of fields) {
    expect(
      declared,
      `${schemaName} does not declare "${field}" — the frontend reads a field the contract has no record of`
    ).toContain(field);
  }
}

/** Asserts a schema's required fields are all ones the frontend supplies. */
function expectRequiredCovered(schemaName: string, supplied: string[]) {
  const required = schemas[schemaName]?.required ?? [];
  for (const field of required) {
    expect(
      supplied,
      `${schemaName} requires "${field}" but the frontend never sends it`
    ).toContain(field);
  }
}

describe("contract identity", () => {
  it("is the Surang Saathi API contract", () => {
    expect(doc.info.title).toBe("Surang Saathi API");
    expect(doc.openapi.startsWith("3.")).toBe(true);
  });
});

describe("every path the frontend calls exists in the contract", () => {
  const declaredPaths = Object.keys(doc.paths);

  for (const [name, template] of Object.entries(API_PATHS)) {
    it(`${name} → ${template}`, () => {
      expect(declaredPaths).toContain(template);
    });
  }
});

describe("methods the frontend uses are declared on their paths", () => {
  const expected: Array<[string, string]> = [
    [API_PATHS.dashboardSummary, "get"],
    [API_PATHS.hazards, "get"],
    [API_PATHS.hazards, "post"],
    [API_PATHS.hazardDetail, "get"],
    [API_PATHS.hazardAcknowledge, "post"],
    [API_PATHS.hazardReview, "post"],
    [API_PATHS.hazardEvidence, "post"],
    [API_PATHS.correctiveActions, "post"],
    [API_PATHS.correctiveAction, "patch"],
    [API_PATHS.correctiveActionResolve, "post"],
    [API_PATHS.auditEvents, "get"],
    [API_PATHS.auditVerify, "get"],
    [API_PATHS.riskMine, "get"],
    [API_PATHS.riskRecalculate, "post"],
    [API_PATHS.health, "get"],
  ];

  for (const [path, method] of expected) {
    it(`${method.toUpperCase()} ${path}`, () => {
      expect(Object.keys(doc.paths[path] ?? {})).toContain(method);
    });
  }
});

describe("response fields the frontend reads are declared", () => {
  it("DashboardSummaryOut", () => {
    expectFieldsDeclared("DashboardSummaryOut", [
      "mine",
      "risk",
      "kpis",
      "asOf",
    ]);
  });

  it("DashboardKpisOut declares exactly the four KPIs the dashboard shows", () => {
    const declared = propertiesOf("DashboardKpisOut").sort();
    // Exactly four — if the backend adds a fifth counter this fails, which is
    // the prompt for a deliberate design decision rather than a silent tile.
    expect(declared).toEqual([
      "conflictedHazards",
      "highRiskHazards",
      "openHazards",
      "overdueCorrectiveActions",
    ]);
  });

  it("MineSummaryOut", () => {
    expectFieldsDeclared("MineSummaryOut", ["id", "code", "name", "areaName"]);
  });

  it("RiskSummaryOut and RiskFactorOut", () => {
    expectFieldsDeclared("RiskSummaryOut", ["score", "level", "factors"]);
    expectFieldsDeclared("RiskFactorOut", ["name", "weight", "currentValue"]);
  });

  it("HazardListResponse", () => {
    expectFieldsDeclared("HazardListResponse", [
      "items",
      "total",
      "limit",
      "offset",
    ]);
  });

  it("HazardListItemOut", () => {
    expectFieldsDeclared("HazardListItemOut", [
      "hazardId",
      "mineId",
      "title",
      "severity",
      "status",
      "locationName",
      "reportedBy",
      "assignedTo",
      "syncState",
      "geofenceState",
      "capturedAt",
      "syncedAt",
      "evidenceCount",
      "correctiveActionCount",
    ]);
  });

  it("HazardDetailOut adds description, evidence and corrective actions", () => {
    expectFieldsDeclared("HazardDetailOut", [
      "description",
      "evidence",
      "correctiveActions",
    ]);
  });

  it("ActorOut", () => {
    expectFieldsDeclared("ActorOut", ["id", "name", "role"]);
  });

  it("EvidenceOut", () => {
    expectFieldsDeclared("EvidenceOut", [
      "evidenceId",
      "fileName",
      "mimeType",
      "fileSize",
      "sha256",
      "latitude",
      "longitude",
      "accuracyMeters",
      "capturedAt",
      "localGeofenceState",
      "serverGeofenceState",
    ]);
  });

  it("EvidenceUploadOut carries the server's verification verdict", () => {
    expectFieldsDeclared("EvidenceUploadOut", [
      "evidenceId",
      "hashVerified",
      "serverGeofenceState",
      "hazardGeofenceState",
      "hazardSyncState",
    ]);
  });

  it("CorrectiveActionOut", () => {
    expectFieldsDeclared("CorrectiveActionOut", [
      "actionId",
      "description",
      "status",
      "dueAt",
      "assignedTo",
      "acknowledgedAt",
      "resolvedAt",
    ]);
  });

  it("RiskSnapshotOut and RiskFactorDetailOut", () => {
    expectFieldsDeclared("RiskSnapshotOut", [
      "riskSnapshotId",
      "mineId",
      "score",
      "level",
      "factors",
      "calculatedAt",
    ]);
    expectFieldsDeclared("RiskFactorDetailOut", [
      "name",
      "weight",
      "currentValue",
      "score",
      "contribution",
      "source",
    ]);
  });

  it("AuditEventListResponse and AuditEventOut", () => {
    expectFieldsDeclared("AuditEventListResponse", [
      "items",
      "total",
      "limit",
      "offset",
    ]);
    expectFieldsDeclared("AuditEventOut", [
      "sequence",
      "id",
      "entityType",
      "entityId",
      "eventType",
      "actorId",
      "payload",
      "previousHash",
      "eventHash",
      "createdAt",
    ]);
  });

  it("AuditVerificationOut", () => {
    expectFieldsDeclared("AuditVerificationOut", [
      "valid",
      "totalEvents",
      "checkedEvents",
      "headHash",
      "firstInvalidSequence",
      "firstInvalidEventId",
      "reason",
    ]);
  });
});

describe("request bodies the frontend sends satisfy the contract", () => {
  it("HazardAcknowledgeIn", () => {
    expectRequiredCovered("HazardAcknowledgeIn", ["actorId"]);
  });

  it("HazardReviewIn", () => {
    expectRequiredCovered("HazardReviewIn", ["actorId"]);
    expectFieldsDeclared("HazardReviewIn", [
      "actorId",
      "severity",
      "status",
      "assignedToUserId",
    ]);
  });

  it("CorrectiveActionCreateIn — every required field is supplied", () => {
    expectRequiredCovered("CorrectiveActionCreateIn", [
      "actionId",
      "hazardId",
      "description",
      "assignedToUserId",
      "dueAt",
      "actorId",
    ]);
  });

  it("CorrectiveActionUpdateIn", () => {
    expectRequiredCovered("CorrectiveActionUpdateIn", ["actorId"]);
    expectFieldsDeclared("CorrectiveActionUpdateIn", ["actorId", "status"]);
  });

  it("CorrectiveActionResolveIn", () => {
    expectRequiredCovered("CorrectiveActionResolveIn", ["actorId"]);
  });

  it("RiskRecalculateIn", () => {
    expectRequiredCovered("RiskRecalculateIn", ["actorId"]);
    expectFieldsDeclared("RiskRecalculateIn", [
      "actorId",
      "gasBreaches30d",
      "inspectionCoveragePercent",
    ]);
  });

  it("the evidence multipart body uses the contract's own field names", () => {
    const bodySchema = Object.keys(schemas).find((name) =>
      name.startsWith("Body_upload_evidence_endpoint")
    );
    expect(
      bodySchema,
      "the evidence upload body schema is missing from the contract"
    ).toBeDefined();

    const declared = propertiesOf(bodySchema as string);
    for (const field of Object.values(EVIDENCE_UPLOAD_FIELDS)) {
      expect(
        declared,
        `the evidence body does not declare "${field}"`
      ).toContain(field);
    }
    expectRequiredCovered(
      bodySchema as string,
      Object.values(EVIDENCE_UPLOAD_FIELDS)
    );
  });
});

describe("enums match the contract", () => {
  it("HazardSeverity", () => {
    expect([...HAZARD_SEVERITIES]).toEqual(schemas.HazardSeverity?.enum);
  });

  it("GeofenceState", () => {
    expect([...GEOFENCE_STATES]).toEqual(schemas.GeofenceState?.enum);
  });

  it("the review endpoint's status subset", () => {
    // Declared inline on HazardReviewIn rather than as a named schema, so the
    // enum is read out of the property itself.
    const property = schemas.HazardReviewIn?.properties?.status as {
      anyOf?: Array<{ enum?: string[] }>;
    };
    const inlineEnum = property?.anyOf?.find((member) => member.enum)?.enum;
    expect([...HAZARD_REVIEW_STATUSES]).toEqual(inlineEnum);
  });

  it("the corrective-action update status subset", () => {
    const property = schemas.CorrectiveActionUpdateIn?.properties?.status as {
      anyOf?: Array<{ enum?: string[] }>;
    };
    const inlineEnum = property?.anyOf?.find((member) => member.enum)?.enum;
    expect([...CORRECTIVE_ACTION_UPDATE_STATUSES]).toEqual(inlineEnum);
  });
});

describe("query parameters the frontend sends are declared", () => {
  function parameterNames(path: string, method: string): string[] {
    const operation = doc.paths[path]?.[method] as
      | { parameters?: Array<{ name: string }> }
      | undefined;
    return (operation?.parameters ?? []).map((parameter) => parameter.name);
  }

  it("dashboard summary takes mineId", () => {
    expect(parameterNames(API_PATHS.dashboardSummary, "get")).toContain(
      "mineId"
    );
  });

  it("the hazard list takes every filter the register uses", () => {
    const names = parameterNames(API_PATHS.hazards, "get");
    for (const field of ["mineId", "severity", "status", "limit", "offset"]) {
      expect(names).toContain(field);
    }
  });

  it("audit events take the paging parameters the ledger uses", () => {
    const names = parameterNames(API_PATHS.auditEvents, "get");
    for (const field of ["limit", "offset"]) {
      expect(names).toContain(field);
    }
  });

  it("the register's page size is within the contract's limit", () => {
    const operation = doc.paths[API_PATHS.hazards].get as {
      parameters: Array<{ name: string; schema?: { maximum?: number } }>;
    };
    const limit = operation.parameters.find((p) => p.name === "limit");
    expect(limit?.schema?.maximum).toBe(100);
  });

  it("the ledger's page size is within the contract's limit", () => {
    const operation = doc.paths[API_PATHS.auditEvents].get as {
      parameters: Array<{ name: string; schema?: { maximum?: number } }>;
    };
    const limit = operation.parameters.find((p) => p.name === "limit");
    expect(limit?.schema?.maximum).toBe(200);
  });
});

describe("the error envelope the client parses", () => {
  it("covers every code the backend's handler map can emit", () => {
    // These come from the backend's HTTP_ERROR_CODES map and its validation
    // handler. If the backend adds a code, add it here and handle it.
    expect([...BACKEND_ERROR_CODES].sort()).toEqual(
      [
        "BAD_REQUEST",
        "CONFLICT",
        "NOT_FOUND",
        "PAYLOAD_TOO_LARGE",
        "SERVICE_UNAVAILABLE",
        "UNPROCESSABLE_ENTITY",
        "UNSUPPORTED_MEDIA_TYPE",
        "VALIDATION_ERROR",
      ].sort()
    );
  });

  it("every mutation path documents the validation response we parse", () => {
    const mutationPaths: Array<[string, string]> = [
      [API_PATHS.hazards, "post"],
      [API_PATHS.hazardAcknowledge, "post"],
      [API_PATHS.hazardReview, "post"],
      [API_PATHS.hazardEvidence, "post"],
      [API_PATHS.correctiveActions, "post"],
      [API_PATHS.correctiveAction, "patch"],
      [API_PATHS.correctiveActionResolve, "post"],
      [API_PATHS.riskRecalculate, "post"],
    ];

    for (const [path, method] of mutationPaths) {
      const operation = doc.paths[path][method] as {
        responses: Record<string, unknown>;
      };
      expect(
        Object.keys(operation.responses),
        `${method.toUpperCase()} ${path} does not document a 422`
      ).toContain("422");
    }
  });
});

describe("evidence limits mirror the backend's own", () => {
  it("allows exactly the three image types the route accepts", () => {
    expect([...EVIDENCE_ALLOWED_MIME_TYPES]).toEqual([
      "image/jpeg",
      "image/png",
      "image/webp",
    ]);
  });

  it("caps uploads at the route's 10 MiB", () => {
    expect(EVIDENCE_MAX_BYTES).toBe(10 * 1024 * 1024);
  });
});
