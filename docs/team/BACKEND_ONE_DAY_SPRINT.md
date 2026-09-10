# One-Day Backend Enhancement Sprint

**Branch:** `feat/ai-assisted-safety`
**Time budget:** one working day
**Feature freeze:** after approximately 6 hours; remaining time is tests, integration, OpenAPI and PR polish.

The goal is a stable enhanced demo, not production-scale AI infrastructure.

---

# Phase 0 — Baseline gate (30–45 min)

Before changing code:

- [ ] latest `main` pulled
- [ ] branch `feat/ai-assisted-safety` created
- [ ] Docker stack starts
- [ ] `/health` returns OK
- [ ] `/ready` returns database/objectStorage OK
- [ ] deterministic seed loads
- [ ] `MINE-03` dashboard returns data
- [ ] current backend tests pass
- [ ] `git status --short` has no unexpected tracked changes

If this phase fails, fix/report baseline first.

---

# Phase 1 — Contract + migration first (60 min)

Read existing backend patterns completely.

Implement with TDD:

- [ ] define new enums/schemas
- [ ] write failing model/schema tests
- [ ] add one Alembic migration for:
  - Attendance
  - AiAssessment
  - DigitizedRecord
- [ ] add SQLAlchemy models
- [ ] prove migration upgrades cleanly
- [ ] do not alter existing tables unless strictly required

Commit checkpoint:

```text
feat(api): add enhanced safety domain foundation
```

---

# Phase 2 — Photo attendance + MinIO (75 min)

Reuse existing evidence storage and hashing patterns.

TDD flow:

- [ ] failing test: valid attendance photo persists
- [ ] failing test: server SHA-256 returned
- [ ] failing test: missing mine rejected
- [ ] failing test: invalid file type rejected
- [ ] failing test: oversized photo rejected
- [ ] implement `POST /api/v1/attendance`
- [ ] implement `GET /api/v1/attendance`
- [ ] store object under attendance namespace
- [ ] append audit/provenance event

Commit checkpoint:

```text
feat(api): add photo attendance workflow
```

---

# Phase 3 — AI provider boundary + PPE analysis (75 min)

No live-provider calls in tests.

- [ ] failing provider-contract tests
- [ ] deterministic test provider
- [ ] disabled-provider behavior
- [ ] configured live-provider adapter
- [ ] PPE structured result schema
- [ ] `POST /attendance/{id}/ppe-analysis`
- [ ] review endpoint
- [ ] AI result stored before human review
- [ ] low confidence maps to `UNCERTAIN` / `NEEDS_REVIEW`
- [ ] confirm AI never directly creates compliance punishment

Commit checkpoint:

```text
feat(api): add reviewable PPE analysis
```

---

# Phase 4 — Hazard image AI triage (60 min)

Use an existing stored hazard evidence object.

- [ ] failing test: evidence is loaded from storage
- [ ] failing test: risk cues + suggested severity/priority returned
- [ ] failing test: analysis persists provenance
- [ ] failing test: hazard severity unchanged
- [ ] failing test: lifecycle unchanged
- [ ] failing test: MRI unchanged
- [ ] add review endpoint
- [ ] review records manager decision separately

Commit checkpoint:

```text
feat(api): add advisory hazard image analysis
```

---

# Phase 5 — OCR legacy record draft (75 min)

Initial scope: English + Hindi.

- [ ] failing test: document accepted
- [ ] failing test: source SHA persisted
- [ ] failing test: original source retained
- [ ] failing test: extracted fields include confidence
- [ ] failing test: low-confidence field sets `reviewRequired`
- [ ] `POST /api/v1/records/extract`
- [ ] `PATCH /api/v1/records/{id}`
- [ ] `POST /api/v1/records/{id}/confirm`
- [ ] confirm records reviewer/timestamp
- [ ] preserve raw OCR + corrected fields

Commit checkpoint:

```text
feat(api): add reviewable legacy record digitisation
```

---

# FEATURE FREEZE

At this point stop adding capabilities.

Do not add:

- face recognition
- worker biometric matching
- custom model training
- queues/Kafka
- new sensor services
- report generation
- auth
- broad admin
- decorative AI metadata
- frontend code

---

# Phase 6 — Governance + regression hardening (75 min)

- [ ] AI provider timeout handled
- [ ] AI unconfigured path returns stable error envelope
- [ ] malformed provider output rejected safely
- [ ] original AI result remains immutable after review
- [ ] reviewer decision appended instead of replacing provenance
- [ ] OCR source never deleted on confirmation
- [ ] attendance photo hash stays immutable
- [ ] existing Golden Workflow tests still pass
- [ ] new routes use camelCase
- [ ] no SQLAlchemy objects leak into API responses

---

# Phase 7 — OpenAPI freeze + handoff (45 min)

- [ ] regenerate OpenAPI from actual app
- [ ] replace `docs/api/openapi.json`
- [ ] verify expected new routes exist
- [ ] verify old critical routes still exist
- [ ] run full backend suite
- [ ] run Docker build
- [ ] run migrations on clean database
- [ ] seed
- [ ] health/ready
- [ ] manually call one endpoint from each new capability
- [ ] inspect Git diff
- [ ] scan for secrets
- [ ] commit final test/contract changes

Suggested final commit:

```text
test(api): freeze enhanced safety contract
```

---

# Phase 8 — PR (30 min)

- [ ] merge latest `origin/main` into feature branch if main moved
- [ ] rerun targeted tests after merge
- [ ] push `feat/ai-assisted-safety`
- [ ] open PR into `main`
- [ ] include exact endpoint list
- [ ] include migration name
- [ ] include test counts
- [ ] include live AI configuration instructions
- [ ] disclose anything using deterministic/mock AI
- [ ] disclose any incomplete path

Do not merge your own PR unless the repository owner asks.
