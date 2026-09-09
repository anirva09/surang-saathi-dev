# Surang Saathi — Foundation Design

**Date:** 2026-09-09
**Status:** Approved
**Project:** सुरंग साथी (Surang Saathi)
**SIH Problem Statement:** SIH26024 — AI-Based Smart Governance & Compliance Monitoring System for Coal Mines

## 1. Purpose

This document locks the foundation for the Surang Saathi SIH MVP before implementation begins. It translates the authoritative `PROJECT_BRIEF.md` into an execution-safe repository, architecture, delivery, review, and release model.

The product is a government-grade digital operating platform for Coal India. AI supports governance workflows; it is not the primary product surface.

## 2. Decision Hierarchy

When decisions conflict, use this order:

1. Mine worker usability
2. Government authenticity
3. Technical feasibility within SIH timeline
4. Consistency
5. Visual polish

## 3. Locked Product Identity

The product name is:

- Hindi: **सुरंग साथी**
- English: **Surang Saathi**

`Khanij Rakshak` is legacy naming in the supplied brief and must be normalized when project documentation is migrated into the repository. Dual branding is not allowed in public product surfaces.

## 4. Source of Truth

`PROJECT_BRIEF.md` is the authoritative functional and technical specification.

Implementation must preserve these hard constraints:

- offline-first field workflows, including multi-day zero-connectivity operation
- append-only compliance events
- no silent last-write-wins conflict resolution for compliance data
- explainable risk scoring
- rule-based Mine Risk Index before production ML
- hash-chained PostgreSQL audit ledger for MVP
- multilingual, low-literacy field UX
- Flutter mobile application, Android priority
- React/Next.js manager web portal
- PostgreSQL + PostGIS as primary transactional/spatial store
- OAuth2/OIDC-compatible authentication with scoped RBAC
- OCR with confidence-based human review
- no full 3D digital twin in MVP
- no unsupported claims about AI accuracy or live Coal India production data

## 5. MVP Architecture

### 5.1 Architecture shape

Use a **modular monolith for the SIH MVP** while preserving logical service boundaries from the brief.

Initial backend modules:

- auth
- inspections
- hazards
- sync
- compliance
- corrective-actions
- audit
- notifications
- risk
- documents

Modules expose explicit interfaces and may later be extracted into independent services without changing domain contracts.

### 5.2 Technology stack

| Layer | Choice |
|---|---|
| Field mobile | Flutter / Dart |
| Manager portal | Next.js / React / TypeScript |
| Backend | FastAPI / Python |
| AI/OCR | Python services/modules |
| Primary database | PostgreSQL + PostGIS |
| Mobile offline store | SQLite via Drift |
| Object storage | S3-compatible storage; MinIO locally |
| API style | REST for MVP |
| Maps | Leaflet initially |
| Authentication | OAuth2/OIDC compatible |
| Audit ledger | SHA-256 hash chain in PostgreSQL |
| Local orchestration | Docker Compose |

FastAPI is selected over Spring Boot for the SIH implementation to reduce language and integration overhead between backend and AI/OCR components. This does not alter the logical architecture described in the brief.

## 6. Golden Workflow

The first end-to-end product slice is:

1. Safety Officer creates a hazard report underground.
2. Photo, voice/text, GPS, timestamp, and client UUID are captured.
3. Event is stored locally with zero network dependency.
4. Sync uploads the immutable event when connectivity returns.
5. Server validates geofence and media integrity.
6. Manager receives and reviews the hazard.
7. Manager creates a corrective action with owner and deadline.
8. Responsible user submits resolution proof.
9. Manager verifies closure.
10. Closure is written to the tamper-evident audit ledger.
11. Compliance state updates.

This workflow is the first integration test and demo backbone.

## 7. First-Slice Screens

### Mobile

- Login
- Field Home
- Quick Hazard Report
- Report Confirmation
- My Reports
- Hazard Detail
- Sync Center

### Manager web

- Login
- Manager Dashboard
- Hazards / Inspections
- Hazard Detail
- Corrective Action
- Audit Record

No national analytics, contractor portal, WhatsApp bot, predictive maintenance, full OCR workflow, or digital twin should block this slice.

## 8. Repository Model

### 8.1 Private development repository

**Repository:** `surang-saathi-dev`

Purpose:

- real development history
- work-in-progress branches
- architecture experiments
- test fixtures
- demo seed data
- internal QA findings
- ADRs and engineering notes

`main` must remain a usable internal milestone.

Branch naming:

- `feat/<scope>`
- `fix/<scope>`
- `docs/<scope>`
- `chore/<scope>`

### 8.2 Public showcase repository

**Repository:** `surang-saathi`

Purpose:

- refined, reviewed milestones only
- polished documentation
- reproducible setup
- screenshots/demo assets
- no secrets or internal-only artifacts

The public repository is not a raw mirror of the private repository.

Approved private commits are promoted to the public repository after product, architecture, QA, documentation, and secret-scan gates.

When promotion uses cherry-pick, original Git author metadata must be preserved. Git authorship must never be rewritten or fabricated.

## 9. Target Repository Layout

```text
surang-saathi-dev/
├── apps/
│   ├── mobile/
│   └── web/
├── backend/
│   ├── app/
│   │   ├── modules/
│   │   └── shared/
│   └── tests/
├── packages/
│   └── contracts/
├── docs/
│   ├── superpowers/specs/
│   ├── DECISIONS.md
│   ├── ARCHITECTURE.md
│   ├── QA_CHECKLIST.md
│   └── DEMO.md
├── demo/
│   └── seed/
├── PROJECT_BRIEF.md
├── README.md
├── CONTRIBUTING.md
├── .env.example
├── .gitignore
└── docker-compose.yml
```

Folders may remain empty until their phase begins. Do not create fake implementation merely to populate the tree.

## 10. Initial ADR Set

`docs/DECISIONS.md` will begin with:

- ADR-001 — Product name is Surang Saathi.
- ADR-002 — Offline-first is mandatory.
- ADR-003 — Compliance records use immutable events.
- ADR-004 — No last-write-wins for compliance data.
- ADR-005 — MRI is rule-based before ML.
- ADR-006 — All risk scores require explainability.
- ADR-007 — Hash-chained PostgreSQL replaces blockchain for MVP.
- ADR-008 — Full 3D digital twin is out of scope.
- ADR-009 — SIH backend begins as a modular monolith.
- ADR-010 — AI supports governance workflows; AI is not the primary UI.
- ADR-011 — Private repo is the development source; public repo receives reviewed milestones.

## 11. Development Responsibility Split

### ChatGPT / Product-Architecture-QA Lead

Owns:

- product scope and feature priority
- UX flows and government authenticity
- architecture decisions and contract review
- design system consistency
- acceptance criteria
- Claude implementation prompts
- architecture/code/design review
- QA and public-release approval
- demo narrative and judge readiness

### Claude / Primary Implementation Engineer

Owns:

- implementation inside approved scope
- migrations/models/endpoints
- Flutter implementation
- Next.js implementation
- backend implementation
- automated tests
- local verification
- bounded fixes from review findings

Claude must not independently expand scope or redesign approved product flows.

## 12. Implementation Packet Contract

Every significant Claude task must include:

1. Objective
2. Context
3. Files involved
4. Architecture constraints
5. UX requirements
6. Data/API contract
7. Acceptance criteria
8. Explicit out-of-scope list
9. Expected return format

Claude should return:

- files created
- files modified
- architecture decisions made
- tests added
- verification commands
- known limitations
- cross-module effects

## 13. Git Commit Standard

Use conventional, descriptive commits such as:

- `chore: initialize Surang Saathi foundation`
- `feat(mobile): add offline hazard capture flow`
- `feat(sync): implement immutable event synchronization`
- `feat(web): add manager hazard review workflow`
- `feat(compliance): add corrective action state machine`
- `feat(audit): add hash-chained audit ledger`
- `feat(risk): add explainable rule-based mine risk index`
- `docs: add system architecture and demo workflow`

Avoid meaningless commit messages such as `update`, `fix2`, `final`, or `changes`.

## 14. Public Release Gates

A private milestone may be promoted to `surang-saathi` only when all gates pass:

1. Product scope review
2. Architecture review
3. UI/UX review where applicable
4. Automated tests pass
5. Manual golden-workflow QA passes
6. No secrets or private credentials
7. Public documentation is accurate
8. Demo data is explicitly synthetic where applicable
9. No unsupported AI or Coal India production-data claims
10. Product naming is consistent

Release approval phrase: **APPROVED FOR PUBLIC**.

## 15. Milestone Plan

- `v0.1.0` — Foundations
- `v0.2.0` — Offline Field Reporting
- `v0.3.0` — Manager Corrective Action Loop
- `v0.4.0` — Compliance + Audit Ledger
- `v0.5.0` — Explainable Mine Risk Index
- `v0.6.0` — GIS + Statutory Automation
- `v0.7.0` — OCR + Multilingual Layer
- `v1.0.0-sih` — SIH submission/demo build

## 16. Explicitly Deferred Scope

Do not block the golden workflow on:

- ML-based MRI
- Hyperledger/blockchain
- full 3D mine digital twin
- contractor trust network
- WhatsApp integration
- predictive maintenance analytics
- elaborate corporate/national analytics
- chatbot-first interaction
- decorative animations

## 17. Foundation Acceptance Criteria

The foundation is ready for implementation planning when:

- this design spec is approved
- private/public repository roles are agreed
- product naming is normalized
- `PROJECT_BRIEF.md` is copied into the development repository as source of truth
- initial ADRs exist
- target repo layout is accepted
- stack is locked
- first implementation plan focuses on the Golden Workflow rather than Phase 4 innovation features
