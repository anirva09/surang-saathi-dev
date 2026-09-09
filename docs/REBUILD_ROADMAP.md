# Surang Saathi — Rebuild Roadmap

Each stage has an explicit exit gate. Do not start a later stage because earlier screens “look done.”

## R0 — Canonical documentation and repo governance

**Output:** current docs, ADRs, Git strategy, QA gates, archive/future separation.
**Exit:** no active ambiguity about product name, stack, MVP scope, or authority order.

## R1 — Design system

**Build:** locked tokens, typography, field-safe button/field/choice primitives, StatusBadge, SyncStatus, GeofenceProof, SeveritySelector, RiskIndexMeter, consequence-aware confirmation, design-system route.
**Verify:** tests, typecheck, lint, production build, accessibility.
**Exit:** primitives pass at 360/768/1440 and encode domain semantics correctly.

## R2 — Backend foundation

**Build:** FastAPI shell, config, PostgreSQL/PostGIS connection, Alembic migrations, module boundaries, health/readiness, test harness.
**Exit:** clean-clone backend starts and tests against a disposable database.

## R3 — Flutter offline foundation

**Build:** Android-priority app shell, Drift/SQLite schema, event queue, media queue, persistent sync indicator, cached mine/section geometry contract.
**Exit:** queued event survives restart with network disabled.

## R4 — Offline hazard capture

**Build:** structured hazard form, media capture, worker severity, local geofence, client UUID/timestamp, durable submit.
**Exit:** a complete hazard can be submitted offline and remains queued after restart.

## R5 — Immutable sync

**Build:** batch upload, idempotency, server geofence check, hash validation, conflict retention.
**Exit:** repeated sync does not duplicate logical events; conflicting evidence is preserved.

## R6 — Manager action loop

**Build:** actionable list, evidence detail, corrective-action assignment, proof, approve/reject closure.
**Exit:** manager can complete the action loop against synced field evidence.

## R7 — Audit ledger

**Build:** canonical payload serializer, previous-hash chaining, ledger append, chain verifier.
**Exit:** changing an earlier fixture makes verification fail at the affected link.

### SIH Core Milestone

R0–R7 together are the first release candidate. Freeze and rehearse the 2-minute demo before adding intelligence features.

## R8 — Governance automation

Rules-as-data, SLA timers, overdue transition, escalation ladder, notifications.

## R9 — Explainable MRI + GIS + dossier

Rule-based MRI, contributing factors, mine map, PDF dossier.

## R10 — OCR / voice / sensor intelligence

Only after data prerequisites and Golden Slice stability.

## R11 — Innovation / production evolution

Contractors, WhatsApp, 2D overlay, broader corporate analytics, production infrastructure.
