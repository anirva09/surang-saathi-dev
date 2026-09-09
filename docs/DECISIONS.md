# Surang Saathi — Architecture Decision Record

**Status:** Active
**Authority:** `PROJECT_BRIEF.md` + accepted product leadership decisions
**Change control:** A decision is superseded only through an explicit new ADR. Implementation convenience never silently edits an accepted decision.

## ADR-001 — Product name is Surang Saathi

**Status:** Accepted

All active product, repository, UI, documentation, demo, and public-facing references use **सुरंग साथी / Surang Saathi**. Dual branding is not allowed.

## ADR-002 — Offline-first is mandatory

**Status:** Accepted

Field workflows must operate with zero network for multi-day periods. Client-generated IDs, local timestamps, cached reference data, durable queues, and explicit sync state are architecture requirements.

## ADR-003 — Compliance records use immutable events

**Status:** Accepted

Submitted inspections, hazards, corrective actions, approvals, escalations, closures, and corrections are append-only. Corrections are new events referencing earlier records.

## ADR-004 — No last-write-wins for compliance data

**Status:** Accepted

Conflicting submissions are retained and surfaced for authorized reconciliation. Safety/compliance evidence is never silently overwritten or dropped.

## ADR-005 — Mine Risk Index is rule-based before ML

**Status:** Accepted

The MVP uses transparent weighted rules over measurable operational inputs. Production ML scoring is gated on representative real data and evaluation.

## ADR-006 — Risk explainability is mandatory

**Status:** Accepted

Every compliance-facing risk score includes contributing factors with factor name, weight, and current value. A bare score fails acceptance.

## ADR-007 — MVP tamper evidence uses PostgreSQL SHA-256 hash chaining

**Status:** Accepted

Ledger-relevant records use `SHA256(canonical_content + previous_hash)` in append-only PostgreSQL tables. Blockchain/Hyperledger is not an MVP dependency.

## ADR-008 — Full 3D digital twin is out of scope

**Status:** Accepted

A full 3D mine twin is rejected for the SIH MVP. A simplified 2D mine-section overlay is a later, phase-gated feature.

## ADR-009 — SIH backend begins as a modular monolith

**Status:** Accepted

Logical backend domains live in one FastAPI deployment for MVP speed and reliability:

`auth`, `inspections`, `hazards`, `sync`, `compliance`, `corrective_actions`, `audit`, `notifications`, `risk`, `documents`.

Boundaries remain explicit so real-scale extraction is possible later.

## ADR-010 — AI supports governance workflows; AI is not the primary UI

**Status:** Accepted

The product leads with inspection, accountability, corrective action, escalation, compliance evidence, and auditability. AI assists specific workflow steps.

## ADR-011 — Private engineering source, curated public promotion

**Status:** Accepted

`surang-saathi-dev` is the private engineering source. `surang-saathi` is a curated public showcase. Public promotion requires an explicit public-release gate and preserves real authorship.

## ADR-012 — GitHub is the canonical source of truth

**Status:** Accepted

Google AI Studio is an implementation workspace. GitHub branches, commits, pull requests, and CI are canonical. Workspace sync state never outranks Git history.

## ADR-013 — Rebuild integrates through `rebuild/v1`

**Status:** Accepted

Existing private history is preserved. Clean rebuilt features branch from and integrate into `rebuild/v1`. After end-to-end rebuild verification, `rebuild/v1` can be merged into private `main` through a separate milestone review.

## ADR-014 — Implementation is packet-bounded

**Status:** Accepted

Every substantial implementation task has a versioned packet under `docs/ai-studio/packets/` defining objective, allowed scope, contracts, acceptance criteria, verification, and stop condition.

## ADR-015 — Approved prior visuals are reference material, not inherited code

**Status:** Accepted

The prior design-system screenshots may inform density, form language, evidence presentation, and government visual tone. Their implementation code is not imported. Current tokens and `docs/UI_PRINCIPLES.md` are authoritative.
