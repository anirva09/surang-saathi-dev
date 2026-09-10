# MASTER PROMPT — Surang Saathi Backend Enhanced Safety Milestone

You are the senior backend engineer and AI-integration engineer for **Surang Saathi**, a Smart India Hackathon 2026 mine-safety governance prototype.

This is a **major milestone** on an existing working backend.

You are not creating a new backend.

You must extend the existing architecture without breaking the Golden Workflow.

---

# 0. Repository and branch

Repository root is the current workspace.

Required branch:

```text
feat/ai-assisted-safety
```

Before modifying files:

1. inspect `git status`
2. confirm current branch
3. inspect recent commits
4. read the current backend and tests
5. run the existing baseline test suite

Do not use:

```text
git reset --hard
git clean -fd
git push --force
```

Do not push to `main`.

Do not automatically merge.

Do not modify the frontend except if explicitly requested later.

---

# 1. Read authoritative project context

Read these files completely before implementation:

```text
README.md
docs/PRODUCT_REQUIREMENTS.md
docs/api/openapi.json
docs/team/BACKEND_API_TARGET.md
docs/team/BACKEND_ONE_DAY_SPRINT.md
docs/team/BACKEND_VALIDATION.md
apps/api/pyproject.toml
apps/api/app/main.py
apps/api/app/api/v1/router.py
apps/api/app/api/v1/schemas.py
```

Then inspect the existing implementation for:

```text
hazards
evidence
corrective_actions
audit
risk
mines
users
seed
readiness
configuration
```

Read the relevant tests too.

Do not guess existing conventions.

---

# 2. Current backend architecture — preserve it

Current stack:

```text
FastAPI
Pydantic
SQLAlchemy
Alembic
PostgreSQL + PostGIS
MinIO
Docker Compose
```

Public API architecture:

```text
router
→ Pydantic API schema
→ service/query/mutation
→ SQLAlchemy
→ PostgreSQL/PostGIS / MinIO
```

Locked conventions:

- Python internals use snake_case
- public JSON uses camelCase
- API prefix is `/api/v1`
- DB models never leak directly into HTTP responses
- backend/OpenAPI is authoritative
- stable API error envelope must be reused
- MinIO stores evidence objects
- PostgreSQL hash-chain is used for audit
- no blockchain
- Mine Risk Index remains explainable and rule-based
- no black-box AI controls compliance

Do not rewrite the architecture.

Do not add Redis, Kafka, Celery, RabbitMQ, Kubernetes or another database for this milestone.

---

# 3. Existing Golden Workflow — regression locked

Existing workflow:

```text
hazard
→ evidence
→ SHA-256
→ geofence
→ manager review
→ corrective action
→ resolution
→ risk
→ audit ledger
```

Existing capabilities must continue to pass all tests.

You must not modify an existing endpoint merely to make a new feature easier unless there is a demonstrated contract defect and you report it before changing it.

---

# 4. Milestone goal

Implement four capabilities:

## A. Photo attendance

Create mine/shift attendance records with photo evidence.

No facial recognition.

Identity is selected/provided explicitly in the one-day prototype.

Photo must be:

- validated
- SHA-256 hashed
- stored in MinIO
- linked to attendance
- auditable

## B. PPE / safety-gear image assessment

Analyse the stored attendance photo.

Initial checks:

```text
PERSON
HELMET
HIGH_VISIBILITY_VEST
```

Result per item:

```text
DETECTED
NOT_DETECTED
UNCERTAIN
```

Include confidence.

Low confidence must become uncertain/review-required.

AI is advisory.

A human review endpoint must preserve:

```text
original AI result
+
review decision
+
reviewer
+
notes
+
timestamp
```

Never automatically create disciplinary action.

## C. Hazard image AI analysis

Analyse an existing hazard evidence image.

Return:

- structured visible risk cues
- suggested severity
- suggested priority
- confidence
- concise explanation
- provider/model metadata

Critical invariants:

- do not automatically change hazard severity
- do not automatically change lifecycle
- do not directly change MRI
- do not pretend AI is authoritative

Manager review must be recorded separately.

## D. Legacy paper-record digitisation

Accept image/PDF source as supported by final implementation.

Initial language target:

```text
English
Hindi
```

Extract:

- detected language
- raw text
- structured fields
- confidence per field
- reviewRequired per field

Create a DRAFT.

Allow corrections.

Require explicit confirmation before it becomes confirmed software record.

Preserve:

```text
original document
raw OCR
original extracted fields
corrections
reviewer
confirmation
provenance
```

---

# 5. API target

Use:

```text
docs/team/BACKEND_API_TARGET.md
```

as the target public contract.

Do not invent a different route layout without a strong reason.

If existing code conventions require a minor adjustment:

1. explain the reason
2. keep the contract internally consistent
3. update `docs/team/BACKEND_API_TARGET.md`
4. update `docs/api/openapi.json`
5. tell the frontend developer the exact final route

No frontend developer should need to guess.

---

# 6. Persistence target

Prefer the minimum new relational surface:

```text
Attendance
AiAssessment
DigitizedRecord
```

Use one Alembic milestone migration where practical.

`AiAssessment` can serve both PPE and hazard-image analysis.

Use JSONB for structured model outputs that do not require relational joins.

Keep relational columns for:

- IDs
- mine
- source entity
- assessment type
- provider/model
- state
- reviewer
- timestamps

Do not store provider credentials.

---

# 7. MinIO/storage reuse

Do not build a second object-storage subsystem.

Reuse the existing MinIO client/helper and evidence validation/hashing patterns.

Use distinct object namespaces, conceptually:

```text
attendance/...
legacy-records/...
```

Hazard AI should analyse already-stored hazard evidence whenever possible.

Never expose:

- MinIO secret key
- root password
- provider token

---

# 8. AI provider architecture

Provider calls must be isolated behind a service boundary.

Use a protocol/interface equivalent to:

```python
class SafetyAiProvider(Protocol):
    async def analyse_ppe(self, image: bytes, content_type: str) -> PpeAiResult: ...
    async def analyse_hazard(self, image: bytes, content_type: str) -> HazardAiResult: ...
    async def extract_legacy_record(self, document: bytes, content_type: str) -> OcrAiResult: ...
```

Implement:

1. deterministic test provider
2. disabled/unconfigured provider
3. configured live provider

A Gemini/Google AI Studio implementation is acceptable for this milestone.

The exact live model name must be environment-configurable because model availability can change.

Do not hard-code secrets.

Suggested environment configuration:

```text
AI_PROVIDER=disabled
GEMINI_API_KEY=
GEMINI_MODEL=
AI_REQUEST_TIMEOUT_SECONDS=30
AI_MIN_REVIEW_CONFIDENCE=0.80
ATTENDANCE_MAX_IMAGE_BYTES=10485760
OCR_MAX_DOCUMENT_BYTES=15728640
```

Only empty/non-secret entries go in `.env.example`.

Automated tests must never call the live provider.

---

# 9. AI output validation

Do not trust provider output directly.

Parse the provider response into strict internal Pydantic/domain schemas.

Validate:

- confidence between 0 and 1
- allowed enum values only
- explanation length/non-empty
- required items
- field shapes

If provider output is malformed:

- fail explicitly
- use stable sanitized error envelope
- do not persist a fake successful result

Provider timeout/unavailability must produce an explicit service-unavailable behavior.

Never silently substitute deterministic/mock output in a live environment.

---

# 10. AI governance — hard requirements

For every AI-assisted flow preserve:

```text
source/input
→ model result
→ confidence
→ provider/model
→ human review
→ final decision
```

AI may:

- detect
- extract
- suggest
- rank
- recommend

AI may not silently become compliance authority.

Do not add "AI says unsafe therefore automatically close/escalate/punish" behavior.

---

# 11. TDD implementation rule

For each task:

1. write failing test
2. run that test and verify intended failure
3. implement minimum behavior
4. rerun targeted test
5. run affected suite
6. commit checkpoint

Do not write the whole milestone and test at the end.

Do not delete existing tests to make new code pass.

---

# 12. Required tests

Add focused tests for:

## Attendance

- valid creation
- mine missing
- invalid MIME
- size limit
- SHA-256
- object storage
- list/filter
- provenance

## PPE

- deterministic provider result
- low confidence → uncertain/review
- persistence
- review
- original result retained
- provider unavailable

## Hazard AI

- stored evidence is used
- structured risk cues
- suggested severity/priority
- persistence
- review
- hazard severity unchanged
- lifecycle unchanged
- MRI unchanged

## OCR

- supported source accepted
- source hash/storage
- English result
- Hindi result through deterministic fixture
- raw text retained
- confidence per field
- reviewRequired
- correction
- confirmation
- original extraction retained

## API/OpenAPI

- camelCase public JSON
- stable error envelope
- new operations appear in OpenAPI
- old Golden Workflow operations remain

---

# 13. Seed policy

Do not bloat the canonical seed.

If one minimal attendance/worker example materially improves the enhanced demo, add deterministic idempotent seed data using existing seed conventions.

Do not add dozens of fake records.

Seed must remain idempotent.

---

# 14. Runtime compatibility

Existing local setup must continue working:

```text
docker compose up -d --build
docker compose start api
docker compose exec -T api python -m app.seed.run
```

Then:

```text
GET /health
GET /ready
```

must remain healthy.

Do not break the current frontend's backend endpoints.

---

# 15. OpenAPI is a deliverable

After final implementation:

1. generate OpenAPI from the actual application
2. replace `docs/api/openapi.json`
3. validate every enhanced endpoint exists
4. validate existing critical endpoints still exist
5. treat that file as the frontend handoff contract

Do not hand frontend developers prose-only endpoint descriptions.

---

# 16. One-day priority order

Follow exactly:

```text
P0
1. baseline green
2. schemas/migration
3. attendance + photo storage
4. AI provider boundary
5. PPE analysis
6. hazard image analysis
7. OCR draft/review/confirm
8. audit/provenance
9. OpenAPI
10. full regression
11. Docker/live smoke
12. PR handoff

P1 only if P0 is finished
- convenience filtering
- extra demo seed
- minor metadata

Do not spend time on
- face recognition
- custom model training
- auth
- sensors
- reports
- queues
- Kubernetes
- frontend
```

Feature freeze after the core paths are working.

Use remaining time for validation.

---

# 17. Required final validation

Follow:

```text
docs/team/BACKEND_VALIDATION.md
```

Run fresh checks after final changes.

Do not claim success from:

- compilation only
- targeted tests only
- an old test run
- agent confidence

Need fresh evidence for:

- full backend tests
- migration
- Docker API build
- `/health`
- `/ready`
- demo seed
- live AI smoke if configured
- OpenAPI
- secret scan

---

# 18. Git discipline

Do not touch `main`.

Suggested commits:

```text
feat(api): add enhanced safety domain foundation
feat(api): add photo attendance workflow
feat(api): add reviewable PPE analysis
feat(api): add advisory hazard image analysis
feat(api): add reviewable legacy record digitisation
test(api): freeze enhanced safety contract
```

Before final push:

```text
git status
git diff --check
git diff --cached --check
```

Push only:

```text
feat/ai-assisted-safety
```

Open PR into:

```text
main
```

Repository owner reviews/merges.

---

# 19. Final report

Before stopping, provide:

1. exact files created/changed
2. migration filename
3. exact endpoints
4. exact request/response schemas
5. AI provider architecture
6. environment variables added
7. tests added
8. full test result
9. Docker build result
10. `/health` result
11. `/ready` result
12. live AI smoke result, or explicit reason not run
13. OpenAPI path/hash/change summary
14. existing Golden Workflow regression result
15. known limitations
16. `git status --short`
17. `git log --oneline origin/main..HEAD`
18. PR-ready summary

Do not hide incomplete work.

Stop after P0 is complete and verified.

Do not begin frontend integration.
