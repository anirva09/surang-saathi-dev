# Backend Milestone Validation Checklist

No "done" claim is accepted without fresh evidence from these gates.

---

# A. Repository / Git gate

Run from repo root:

```cmd
git branch --show-current
```

Expected:

```text
feat/ai-assisted-safety
```

Then:

```cmd
git status --short
```

Only intended changes should appear.

Check accidental secret files are not staged:

```cmd
git diff --cached --name-only
```

Never stage:

```text
.env
*.key
*.pem
local secret files
provider credentials
```

---

# B. Existing runtime gate

Run:

```cmd
docker compose up -d --build
```

Then:

```cmd
docker compose start api
```

Then:

```cmd
docker compose ps
```

Required services:

```text
api
postgres
minio
```

Then:

```cmd
curl http://localhost:8000/health
```

Required semantic result:

```text
status = ok
service = surang-saathi-api
```

Then:

```cmd
curl http://localhost:8000/ready
```

Required semantic result:

```text
status = ready
database = ok
objectStorage = ok
```

---

# C. Clean migration gate

The new migration must work against a new database.

Use a disposable local validation environment/volume. Do not erase a teammate's useful data without explicit intent.

At minimum verify:

```text
alembic upgrade head
```

completes from a fresh schema.

Also verify upgrading an existing current-MVP database to the new migration succeeds.

---

# D. Seed regression gate

Run:

```cmd
docker compose exec -T api python -m app.seed.run
```

Run it a second time.

The deterministic seed must remain idempotent.

Verify:

```cmd
curl "http://localhost:8000/api/v1/dashboard/summary?mineId=MINE-03"
```

The current Golden Workflow demo data must still exist.

---

# E. Backend tests

From `apps\api` with its venv:

```cmd
.venv\Scripts\python -m pytest -q
```

Acceptance:

```text
0 failed
```

Do not report a historical pass. Run this after the final code changes.

Required new test groups:

- attendance creation/list
- attendance SHA/object storage
- file validation
- PPE deterministic provider
- PPE review
- hazard AI analysis
- hazard AI review
- invariant: AI does not mutate authoritative hazard severity
- invariant: AI does not mutate lifecycle
- invariant: AI does not directly alter MRI
- OCR extraction
- OCR confidence/reviewRequired
- OCR correction
- OCR confirmation
- provenance/audit
- AI provider unavailable/timeout
- OpenAPI routes/schemas
- existing Golden Workflow regression

---

# F. Live AI boundary gate

Automated tests use deterministic AI.

For live demo validation, configure a real local provider in `.env` without committing credentials.

Example conceptual local variables:

```text
AI_PROVIDER=gemini
GEMINI_API_KEY=<local secret>
GEMINI_MODEL=<model available in the team's AI Studio project>
```

Restart/recreate the API after environment changes.

Acceptance:

- one real attendance photo returns structured PPE result
- one real hazard evidence image returns risk cues + recommendation
- one English or Hindi paper image returns OCR draft

If the live provider is unavailable, the backend must fail explicitly using the stable API error envelope. It must not silently return deterministic/mock output while claiming it is live AI.

---

# G. Photo attendance checks

Validate:

- valid JPEG/PNG accepted
- invalid type rejected
- oversized input rejected
- SHA-256 generated server-side
- attendance record points to stored object
- no MinIO credential returned
- mine context is correct
- actor/provenance captured
- list endpoint returns created record

---

# H. PPE checks

Validate:

- source is the stored attendance image
- result contains person/helmet/vest checks as configured
- each item has result and confidence
- low confidence results become uncertain/review-required
- AI result is persisted
- human review is a separate write
- original AI result is still visible after override
- no automatic disciplinary/compliance state is created

---

# I. Hazard AI checks

Validate:

- analysis references an existing evidence object
- risk cues are structured
- suggested severity uses existing severity vocabulary
- priority is structured
- confidence is bounded 0..1
- explanation is non-empty
- model/provider metadata retained
- hazard severity is unchanged before manager action
- lifecycle unchanged
- MRI unchanged
- manager review stores accept/override/reject separately

---

# J. OCR checks

Validate:

- JPEG/PNG supported
- PDF path works if declared in final OpenAPI
- source SHA stored
- source object retained
- detected language returned
- raw text retained
- fields have confidence
- low-confidence fields mark `reviewRequired`
- user corrections do not erase original extraction
- confirmation stores reviewer/timestamp
- confirmed record remains traceable to source

Do not claim PDF support if it was not actually implemented/tested.

---

# K. Audit / provenance checks

For every enhanced workflow, verify traceability:

```text
input/source
→ AI/extraction output
→ human review/correction
→ final accepted state
```

Do not replace the model's original output with the reviewer result.

Verify the existing audit-ledger integrity endpoint still reports valid after enhanced workflow events, if enhanced events are integrated into the canonical ledger.

---

# L. OpenAPI gate

Regenerate/freeze from the actual application.

Then verify `docs/api/openapi.json` includes:

```text
POST /api/v1/attendance
GET /api/v1/attendance
POST /api/v1/attendance/{attendanceId}/ppe-analysis
POST /api/v1/attendance/{attendanceId}/ppe-analysis/{analysisId}/review
POST /api/v1/hazards/{hazardId}/ai-analysis
POST /api/v1/hazards/{hazardId}/ai-analysis/{analysisId}/review
POST /api/v1/records/extract
PATCH /api/v1/records/{recordId}
POST /api/v1/records/{recordId}/confirm
```

If final implementation intentionally changes a route, update `BACKEND_API_TARGET.md` and state the deviation in the PR. Do not allow frontend developers to guess.

Also verify old Golden Workflow routes remain in the contract.

---

# M. Error-envelope gate

New endpoints must use the existing stable error shape.

Validate at least:

- 404 missing mine/attendance/hazard/evidence/record
- 409 state conflict where applicable
- 413/422 invalid upload/validation according to existing conventions
- 503 AI provider unavailable
- timeout/provider error is sanitised
- no provider stack trace/secret returned

---

# N. Security / secret gate

Search staged changes for obvious key material before commit.

Review:

```cmd
git diff --cached
```

Required:

- no `GEMINI_API_KEY` value
- no tokens
- no MinIO secret changes to real secrets
- no `.env`
- no credentials in tests
- no provider response containing sensitive headers

`.env.example` may contain an empty `GEMINI_API_KEY=` entry only.

---

# O. Final Docker build gate

Run fresh after final changes:

```cmd
docker compose build api
```

Acceptance:

```text
build succeeds
```

Then restart:

```cmd
docker compose up -d
```

Then verify `/health` and `/ready` again.

---

# P. PR acceptance gate

The PR is ready for owner review only if the author supplies:

- branch name
- commit hashes
- migration filename
- files changed
- exact new endpoints
- final OpenAPI diff
- full backend test result
- Docker build result
- health/ready result
- live AI validation result
- any mocked/deterministic-only path
- known limitations
- statement that existing Golden Workflow still passes
- statement that no secrets are included
