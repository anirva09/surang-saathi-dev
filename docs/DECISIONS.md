# Surang Saathi — Architecture Decision Record

**Status:** Active
**Authority:** `PROJECT_BRIEF.md` + accepted ADRs

Accepted decisions are not silently edited for implementation convenience. A changed decision is recorded as a superseding ADR.

## ADR-001 — One product identity

**Decision:** All active product, repository, UI, demo, and documentation references use **सुरंग साथी / Surang Saathi**. Legacy project names may appear only in `docs/archive/` or explicit migration/history notes.

## ADR-002 — Offline-first is mandatory

Field workflows must function through multi-day zero-connectivity periods using locally generated IDs/timestamps, durable queues, cached reference data, and explicit sync state.

## ADR-003 — Compliance history is append-only

Submitted hazard, inspection, corrective-action, approval, escalation, and closure evidence is never mutated in place. Corrections create new events that reference prior events.

## ADR-004 — No last-write-wins for compliance data

Conflicting or duplicate submissions are retained and surfaced for reconciliation. Safety evidence is never silently overwritten.

## ADR-005 — FastAPI modular monolith for SIH MVP

The MVP backend is one FastAPI deployment with explicit domain modules: `auth`, `inspections`, `hazards`, `sync`, `compliance`, `corrective_actions`, `audit`, `notifications`, `risk`, `documents`.

**Why:** SIH needs clear domain design without distributed-system overhead.

## ADR-006 — Microservices are evolutionary, not initial

A module may become an independently deployed service only when justified by independent scaling, failure/security isolation, ownership, release cadence, or workload characteristics.

## ADR-007 — PostgreSQL + PostGIS is the primary data platform

Transactional and spatial data live in PostgreSQL/PostGIS for the MVP. Add other stores only when an actual workload requires them.

## ADR-008 — Flutter Android-priority mobile app

The field client is Flutter with durable offline persistence (SQLite/Drift) and Android as the priority deployment target.

## ADR-009 — Next.js manager portal

The management/corporate web experience is built in Next.js + TypeScript. It consumes backend contracts rather than duplicating domain logic in the web tier.

## ADR-010 — Rule-based MRI before ML

The first Mine Risk Index is deterministic and transparent. Production ML is gated on sufficient representative historical data and validation.

## ADR-011 — Explainability contract

Every compliance-facing risk result includes contributing factors, weights/current values, and scoring/model version. Bare scores fail acceptance.

## ADR-012 — AI assists; humans remain accountable

AI may suggest severity, extract OCR fields, or flag anomalies. It may not silently select a worker's severity, approve closure, or hide uncertainty.

## ADR-013 — Hash-chained PostgreSQL ledger for MVP

Tamper evidence uses deterministic canonical payloads and SHA-256 chaining in PostgreSQL. Blockchain/Hyperledger is not an MVP requirement.

## ADR-014 — No full 3D digital twin in MVP

A 2D operational mine-section overlay may be considered later. Full 3D is explicitly out of scope.

## ADR-015 — Government UX language is locked

The product follows geological survey sheets, engineering field notebooks, DGMS-style inspection forms, and government service portals. Glassmorphism, neon/futuristic AI styling, excessive rounded corners, and startup-dashboard aesthetics are rejected.

## ADR-016 — Private development / curated public release

`surang-saathi-dev` is the source repository for active development. `surang-saathi` receives only reviewed, reproducible, secret-safe milestones after **APPROVED FOR PUBLIC**.

## ADR-017 — One canonical web package manager

Use `npm` for the Next.js workspace unless a future accepted ADR changes this. Avoid mixed npm/Bun/pnpm lockfiles and environment-specific hoisting workarounds.

## ADR-018 — Synthetic/demo data must be labeled

Demo data may be realistic, but must not be represented as live Coal India, DGMS, CPCB, or production sensor data unless an actual integration exists.
