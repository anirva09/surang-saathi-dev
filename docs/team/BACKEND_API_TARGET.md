# Backend Enhancement — Target API Contract

This is the target contract for the one-day enhanced backend milestone.

The implementer must still inspect existing routing/schema conventions first. New public JSON must remain camelCase. Python internals remain snake_case.

All routes remain under:

```text
/api/v1
```

Existing Golden Workflow endpoints are frozen and must not regress.

---

# 1. Photo Attendance

## POST `/api/v1/attendance`

Create an attendance record with photo evidence.

Recommended request:

`multipart/form-data`

Fields:

```text
mineId              string, required
workerId            string, required
workerName          string, required for one-day prototype
shift               string, required
capturedAt          ISO-8601 datetime, required
actorId             string, required
latitude             number, optional
longitude            number, optional
gpsAccuracyMeters    number, optional
photo                file, required
```

Required server behavior:

1. validate mine exists
2. validate actor exists according to current prototype conventions
3. validate image MIME/type/size using the existing evidence-validation pattern
4. calculate server SHA-256
5. store photo in MinIO using a namespace separate from hazard evidence
6. create attendance row
7. append an audit/provenance event
8. return the created record

Suggested response shape:

```json
{
  "attendanceId": "opaque-server-id",
  "mineId": "MINE-03",
  "workerId": "WRK-001",
  "workerName": "Example Worker",
  "shift": "A",
  "capturedAt": "2026-09-10T08:30:00Z",
  "recordedBy": "USR-MSHARMA",
  "photo": {
    "sha256": "hex-digest",
    "contentType": "image/jpeg",
    "sizeBytes": 123456
  },
  "ppeStatus": "NOT_ANALYSED",
  "reviewStatus": "PENDING",
  "createdAt": "2026-09-10T08:30:03Z"
}
```

Do not expose MinIO credentials.

## GET `/api/v1/attendance`

Query parameters:

```text
mineId   required
date     optional YYYY-MM-DD
shift    optional
```

Return a stable list response with attendance records.

---

# 2. PPE Analysis

## POST `/api/v1/attendance/{attendanceId}/ppe-analysis`

Analyze the stored attendance photograph.

Recommended JSON request:

```json
{
  "actorId": "USR-MSHARMA"
}
```

Required output:

```json
{
  "analysisId": "opaque-server-id",
  "attendanceId": "opaque-server-id",
  "status": "COMPLETE",
  "checks": [
    {
      "item": "PERSON",
      "result": "DETECTED",
      "confidence": 0.98
    },
    {
      "item": "HELMET",
      "result": "DETECTED",
      "confidence": 0.91
    },
    {
      "item": "HIGH_VISIBILITY_VEST",
      "result": "UNCERTAIN",
      "confidence": 0.61
    }
  ],
  "overallReviewStatus": "NEEDS_REVIEW",
  "model": {
    "provider": "configured-provider",
    "name": "configured-model"
  },
  "createdAt": "..."
}
```

Allowed PPE result values:

```text
DETECTED
NOT_DETECTED
UNCERTAIN
```

Critical policy:

- PPE AI is advisory.
- It must never automatically create a disciplinary/compliance outcome.
- Low confidence must produce `UNCERTAIN`/`NEEDS_REVIEW`.

## POST `/api/v1/attendance/{attendanceId}/ppe-analysis/{analysisId}/review`

Suggested request:

```json
{
  "actorId": "USR-MSHARMA",
  "decision": "CONFIRMED",
  "notes": "Helmet confirmed by supervisor."
}
```

Suggested decision values:

```text
CONFIRMED
OVERRIDDEN
REJECTED
```

Store reviewer, timestamp, notes, original AI result and final review decision.

---

# 3. AI-Assisted Hazard Image Analysis

## POST `/api/v1/hazards/{hazardId}/ai-analysis`

Analyze existing hazard evidence instead of uploading the same photo twice.

Suggested JSON request:

```json
{
  "evidenceId": "existing-evidence-id",
  "actorId": "USR-MSHARMA"
}
```

Required response:

```json
{
  "analysisId": "opaque-server-id",
  "hazardId": "HZRD-2026-442",
  "evidenceId": "existing-evidence-id",
  "riskCues": [
    {
      "label": "DAMAGED_ROOF_SUPPORT",
      "confidence": 0.87,
      "explanation": "Visible deformation appears on the support structure."
    }
  ],
  "suggestedSeverity": "HIGH",
  "suggestedPriority": "IMMEDIATE_REVIEW",
  "confidence": 0.87,
  "explanation": "Visible structural damage warrants prompt manager review.",
  "model": {
    "provider": "configured-provider",
    "name": "configured-model"
  },
  "reviewStatus": "PENDING",
  "createdAt": "..."
}
```

Priority values:

```text
IMMEDIATE_REVIEW
HIGH
NORMAL
LOW
```

Critical invariants:

- analysis does not mutate authoritative hazard `severity`
- analysis does not mutate hazard lifecycle
- analysis does not directly alter the Mine Risk Index
- manager remains final authority

## POST `/api/v1/hazards/{hazardId}/ai-analysis/{analysisId}/review`

Suggested request:

```json
{
  "actorId": "USR-MSHARMA",
  "decision": "ACCEPTED",
  "managerSeverity": "HIGH",
  "notes": "Recommendation accepted after visual review."
}
```

Suggested decision values:

```text
ACCEPTED
OVERRIDDEN
REJECTED
```

The audit trail must preserve AI suggestion and manager decision separately.

---

# 4. Legacy Paper Record OCR

## POST `/api/v1/records/extract`

Input:

`multipart/form-data`

Fields:

```text
mineId     string, required
actorId    string, required
document   file, required
```

Initial supported content:

```text
image/jpeg
image/png
application/pdf
```

Initial target languages:

```text
English
Hindi
```

Required response:

```json
{
  "recordId": "opaque-server-id",
  "mineId": "MINE-03",
  "status": "DRAFT",
  "detectedLanguage": "hi",
  "rawText": "extracted text...",
  "fields": [
    {
      "name": "date",
      "value": "2026-09-08",
      "confidence": 0.93,
      "reviewRequired": false
    },
    {
      "name": "observation",
      "value": "Roof support ...",
      "confidence": 0.72,
      "reviewRequired": true
    }
  ],
  "source": {
    "sha256": "hex-digest",
    "contentType": "image/jpeg"
  },
  "model": {
    "provider": "configured-provider",
    "name": "configured-model"
  },
  "createdAt": "..."
}
```

OCR output is a draft only.

## PATCH `/api/v1/records/{recordId}`

Allow a reviewer to correct extracted structured fields while the record remains `DRAFT`.

Every correction must retain provenance.

## POST `/api/v1/records/{recordId}/confirm`

Suggested request:

```json
{
  "actorId": "USR-MSHARMA"
}
```

Required behavior:

- record becomes `CONFIRMED`
- reviewer and timestamp stored
- original document remains preserved
- raw OCR remains preserved
- corrected fields remain preserved
- audit event appended

Do not delete or overwrite the original source record.

---

# 5. AI Provider Boundary

Do not scatter provider SDK calls through routers/services.

Create one explicit provider boundary.

Conceptual interface:

```python
class SafetyAiProvider(Protocol):
    async def analyse_ppe(self, image: bytes, content_type: str) -> PpeAiResult: ...
    async def analyse_hazard(self, image: bytes, content_type: str) -> HazardAiResult: ...
    async def extract_legacy_record(self, document: bytes, content_type: str) -> OcrAiResult: ...
```

Implementation targets:

```text
Deterministic test provider
Configured live provider (for example Gemini)
Disabled/unconfigured provider
```

Automated tests must never depend on a live external AI service.

---

# 6. Configuration

Add empty/non-secret configuration only to `.env.example`.

Suggested variables:

```text
AI_PROVIDER=disabled
GEMINI_API_KEY=
GEMINI_MODEL=
AI_REQUEST_TIMEOUT_SECONDS=30
AI_MIN_REVIEW_CONFIDENCE=0.80
ATTENDANCE_MAX_IMAGE_BYTES=10485760
OCR_MAX_DOCUMENT_BYTES=15728640
```

Real `GEMINI_API_KEY` belongs only in local `.env`/secret management and must never be committed.

If AI is not configured, AI endpoints should return the project's stable error envelope with an appropriate service-unavailable code/status.

---

# 7. Persistence

Prefer one migration containing the minimum new persistent structures.

Recommended logical records:

```text
Attendance
AiAssessment
DigitizedRecord
```

`AiAssessment` may represent both PPE and hazard-image analysis to avoid duplicating provenance machinery.

Persist:

- source entity
- model/provider
- raw structured model result
- confidence
- status
- reviewer
- reviewer decision
- review notes
- timestamps

Use JSONB where the model output is naturally structured and not part of critical relational querying.

Do not store secrets or provider credentials.

---

# 8. Existing Backend Conventions

New implementation must match the current backend:

```text
router
→ Pydantic API schema
→ service
→ SQLAlchemy model
→ PostgreSQL/PostGIS / MinIO
```

Keep:

- Python internals snake_case
- public JSON camelCase
- stable error envelope
- `/api/v1`
- Pydantic schemas
- audit-event conventions
- MinIO storage helper conventions
- deterministic tests
- frozen OpenAPI contract

Do not leak SQLAlchemy models directly into HTTP responses.
