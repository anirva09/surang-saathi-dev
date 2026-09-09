# Surang Saathi — Rebuild v1 Design

**Date:** 2026-09-09
**Status:** Approved
**Branch:** `rebuild/v1`
**Repository:** `surang-saathi-dev` (private)
**Public repository:** `surang-saathi` (curated releases only)

## 1. Purpose

Rebuild Surang Saathi cleanly from the authoritative project brief using a three-part workflow:

- **ChatGPT** owns product direction, government UX, architecture, implementation packets, review, QA, and release approval.
- **Google AI Studio** is the primary implementation workspace for bounded coding tasks.
- **GitHub** is the canonical source of truth for code, history, branches, reviews, and releases.

The rebuild does not copy prior implementation code. Approved product ideas and visual principles may be retained, but implementation is recreated under the current architecture and QA rules.

## 2. Authority order

When instructions conflict, use this order:

1. `PROJECT_BRIEF.md`
2. `docs/DECISIONS.md`
3. `docs/ARCHITECTURE.md`
4. `docs/UI_PRINCIPLES.md`
5. the current implementation packet under `docs/ai-studio/packets/`
6. existing implementation details

Convenience never silently overrides a higher authority. Conflicts are reported for review.

## 3. Product constraints

The rebuild preserves these non-negotiable requirements:

- field workflows are offline-first and support multi-day zero-connectivity operation
- submitted compliance evidence is append-only
- no silent last-write-wins conflict handling
- rule-based Mine Risk Index precedes production ML
- every compliance-facing risk score exposes contributing factors
- auditability uses a SHA-256 hash-chained PostgreSQL ledger for the MVP
- low-confidence OCR requires human review
- field UX supports Hindi, Bengali, Odia, and English architecture from day one
- Flutter remains the Android-priority field client
- Next.js/React remains the manager/corporate web surface
- PostgreSQL/PostGIS is the transactional/spatial source of truth
- full 3D digital twin remains out of MVP scope
- AI supports accountable workflows rather than becoming the primary UI

## 4. Rebuild strategy

The existing private `main` history is preserved. Rebuild work integrates through `rebuild/v1`.

```text
main
└── rebuild/v1
    ├── feat/design-system-foundation
    ├── feat/backend-foundation
    ├── feat/field-offline-shell
    ├── feat/offline-hazard-capture
    ├── feat/immutable-sync
    ├── feat/manager-hazard-review
    ├── feat/corrective-actions
    ├── feat/audit-ledger
    ├── feat/compliance-automation
    └── feat/risk-index
```

Each feature branch has one implementation packet, one verification report, and one review gate. No feature task is allowed to expand into unrelated modules.

## 5. Canonical product slice

The load-bearing integration path is:

```text
offline hazard capture
→ durable local queue
→ immutable/idempotent sync
→ server geofence + media-hash validation
→ manager review
→ corrective action + SLA ownership
→ proof submission + approval
→ ledgered resolution
→ explainable MRI recompute
→ dossier/corporate roll-up
```

A screen or subsystem that does not strengthen this path is secondary until the path works end-to-end.

## 6. Architecture

### Field client

Flutter/Dart, Android priority. Local persistence uses SQLite via Drift. Cached mine/section reference data and geofence polygons must support offline capture. Sync state is persistent application chrome, not a hidden settings feature.

### Web client

Next.js/React/TypeScript. The design system is shared across manager and corporate surfaces. The web app is role-aware, action-oriented, and does not mimic the field app's interaction density.

### Backend

FastAPI modular monolith for the SIH MVP with explicit domain modules:

`auth`, `inspections`, `hazards`, `sync`, `compliance`, `corrective_actions`, `audit`, `notifications`, `risk`, `documents`.

The modules are logical boundaries, not separately deployed services during the rebuild MVP.

### Data

PostgreSQL/PostGIS owns transactional and spatial state. S3-compatible object storage owns media and document binaries. Ledger-relevant events are hash chained. Local development uses PostGIS and MinIO through Docker Compose.

## 7. UI system

The visual language is grounded in geological survey sheets, engineering field notebooks, DGMS inspection forms, and government service portals.

Locked core palette:

| Token | Value |
|---|---|
| Background | `#F7F3EA` |
| Surface | `#FFFDF8` |
| Primary | `#8C4A2F` |
| Accent | `#D4A72C` |
| Success | `#4F5D4A` |
| Danger | `#C6472D` |
| Text | `#2F3A44` |
| Border | `#D8CCBA` |

No glassmorphism, neon gradients, futuristic AI styling, soft startup-dashboard aesthetics, or decorative 3D.

Field surfaces prioritize 40–48 px controls, large row hit targets, explicit sync state, bilingual labeling, voice affordances, and consequence-aware confirmation for permanent actions.

## 8. AI accountability rules

- AI suggestions never silently become worker declarations.
- `workerSelectedSeverity` and `aiSuggestedSeverity` remain conceptually distinct.
- Local geofence validation and authoritative server validation remain distinct.
- A Mine Risk Index without contributing factors is invalid UI/API behavior.
- OCR uncertainty is visible and reviewable.
- No production accuracy claims are made without representative evaluated data.

## 9. GitHub model

`surang-saathi-dev` is private and contains all active engineering work, implementation packets, QA notes, and rebuild history.

`surang-saathi` is public and receives only explicitly approved milestones. Public promotion does not mirror private WIP. Authorship is preserved. Secrets, internal prompts, debug artifacts, and unapproved data never cross the release gate.

## 10. Review gates

Every branch must pass four reviews before integration:

1. **Product:** solves the intended mine/compliance problem without scope drift.
2. **Government UX:** credible for field staff and officials; no startup/AI gimmicks.
3. **Architecture:** contracts, offline behavior, data ownership, and auditability remain coherent.
4. **QA:** automated checks, accessibility where applicable, failure states, and demo path pass.

`APPROVED FOR PRIVATE` permits merge to `rebuild/v1`. `APPROVED FOR PUBLIC` is a separate later gate.

## 11. First implementation target

The first coding task is **Design System Foundation** only. It establishes the real tokens, typography, controls, status vocabulary, offline/geofence evidence components, explainability component contract, and a `/design-system` reference route. It does not implement the manager dashboard or the Golden Workflow.

The second target, after review, is **Backend Foundation**. It establishes FastAPI, configuration, PostgreSQL connection boundaries, health checks, tests, and modular package boundaries without domain business logic.

## 12. Definition of a successful rebuild foundation

The foundation is ready when:

- the active repository contains no obsolete implementation-agent protocol
- GitHub/private-public strategy is written and mechanically checked
- UI principles and architecture agree with `PROJECT_BRIEF.md`
- Google AI Studio has a master implementation protocol and packet template
- the first bounded implementation packet is ready
- CI can fail on governance regressions such as legacy naming, secret-like tokens, or missing locked documents
- `rebuild/v1` remains clean and reviewable
