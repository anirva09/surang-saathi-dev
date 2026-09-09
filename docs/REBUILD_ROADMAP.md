# Rebuild v1 Roadmap

This document is an execution sequence inside the authoritative Phase 0–5 roadmap in `PROJECT_BRIEF.md`. It does not replace those phases.

## Workstream R0 — Governance foundation

**Maps to:** Project Brief Phase 0

Deliverables:

- authority order
- rebuild architecture
- GitHub strategy
- UI principles
- AI Studio protocol
- CI governance checks
- build-state tracker

**Exit:** repository has one active workflow and packet 0001 is ready.

## Workstream R1 — Design system foundation

**Maps to:** Project Brief Phase 0

Deliverables:

- Next.js web shell for design-system development
- locked tokens and typography
- field-safe controls
- semantic status vocabulary
- sync/geofence evidence primitives
- severity suggestion contract
- explainable MRI presentation contract
- accessibility verification

**Not included:** manager dashboard, production APIs, offline mobile workflow.

## Workstream R2 — Backend foundation

**Maps to:** Project Brief Phase 0

Deliverables:

- FastAPI shell
- typed configuration
- PostgreSQL/PostGIS connection boundary
- health/readiness endpoint
- modular-monolith package boundaries
- test harness

**Not included:** domain business logic or production integrations.

## Workstream R3 — Field offline foundation

**Maps to:** Project Brief Phase 1

Deliverables:

- Flutter Android-priority shell
- local SQLite/Drift event store
- persistent sync-state shell
- cached mine/section reference contract
- durable media queue boundary

## Workstream R4 — Offline hazard capture

**Maps to:** Project Brief Phase 1

Deliverables:

- voice/text/photo hazard capture
- client UUID + local timestamp
- local geofence check
- media hash capture
- self-reported severity with optional AI suggestion slot
- queue survives restart/multi-day offline use

## Workstream R5 — Immutable sync

**Maps to:** Project Brief Phase 1

Deliverables:

- immutable batch upload
- idempotency
- duplicate-safe response
- server geofence/hash validation
- conflict retention and manager reconciliation flag

## Workstream R6 — Manager action loop

**Maps to:** Project Brief Phase 1

Deliverables:

- manager evidence review
- corrective-action assignment
- owner + deadline
- proof submission
- approve/reject closure path

## Workstream R7 — Audit ledger

**Maps to:** Project Brief Phase 1

Deliverables:

- canonical content serialization
- previous-hash chain
- ledger writes for specified events
- verification endpoint/report

**Phase-1 rebuild exit:** offline field event can sync, be acted on, close with evidence, and verify through the ledger.

## Workstream R8 — Statutory automation + rule-based MRI

**Maps to:** Project Brief Phase 2

Deliverables:

- rules-as-data table
- SLA scheduler
- escalation ladder
- explainable rule-based MRI
- GIS mine risk view
- dossier generation

## Workstream R9 — AI/document layer

**Maps to:** Project Brief Phase 3

Deliverables are phase-gated:

- OCR capture/extraction/review queue
- multilingual voice input
- on-device hazard triage + SMS fallback
- sensor ingestion/anomaly detection
- ML MRI only after adequate real data exists

## Workstream R10 — Innovation additions

**Maps to:** Project Brief Phase 4

Only after the core is stable:

- contractor trust score + cross-mine flagging
- WhatsApp fallback
- 2D mine-section overlay
- predictive downtime/safety correlation
- corporate/ministry analytics expansion

## Workstream R11 — Hardening and public release

**Maps to:** Project Brief Phase 5

- security/RBAC edge review
- load and sync resilience tests
- training/demo content
- deployment/runbook
- public-repository curation
- SIH demo freeze
