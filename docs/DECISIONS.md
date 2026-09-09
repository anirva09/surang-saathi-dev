# Surang Saathi — Architecture Decision Record

**Status:** Active
**Authority:** `PROJECT_BRIEF.md` + approved product leadership decisions
**Change control:** Any change to an accepted ADR must be proposed explicitly, reviewed for mine-worker usability, government authenticity, SIH feasibility, consistency, and demo impact, then recorded as a superseding ADR. Do not silently edit an accepted decision because an implementation shortcut is convenient.

## ADR-001 — Product name is Surang Saathi

**Status:** Accepted

**Context:** The original planning brief used a legacy codename, while the approved product identity is **सुरंग साथी / Surang Saathi**.

**Decision:** All active product, repository, UI, documentation, demo, and public-facing references use **Surang Saathi**. Dual branding is not allowed.

**Rationale:** One name avoids judge confusion and makes the product feel intentional and production-ready.

**Consequence:** Legacy naming is normalized when source material enters the repository; functional requirements are not altered during that normalization.

## ADR-002 — Offline-first is mandatory

**Status:** Accepted

**Context:** Underground mine connectivity can be absent for long periods.

**Decision:** Field workflows must function with zero network. Client-generated IDs, local timestamps, cached reference data, queued immutable events, and explicit sync status are architectural requirements rather than optional resilience features.

**Rationale:** A field workflow that depends on live connectivity is not credible for the target environment.

**Consequence:** Features that cannot define their offline behavior are not considered complete for the field app.

## ADR-003 — Compliance records use immutable events

**Status:** Accepted

**Decision:** Submitted inspection, hazard, corrective-action, approval, escalation, and closure events are append-only. Corrections create new events referencing prior records.

**Rationale:** Accountability requires a traceable history of what was recorded, by whom, and when.

**Consequence:** Current state is derived from event history; APIs must not expose destructive update semantics for ledger-relevant submitted records.

## ADR-004 — No last-write-wins for compliance data

**Status:** Accepted

**Decision:** Conflicting or duplicate offline submissions are retained and surfaced for reconciliation. They are never silently overwritten or discarded.

**Rationale:** Silent conflict resolution can erase safety or compliance evidence.

**Consequence:** Sync responses and manager UX must represent conflict/reconciliation status explicitly.

## ADR-005 — Mine Risk Index is rule-based before ML

**Status:** Accepted

**Decision:** The MVP Mine Risk Index uses transparent weighted rules built from measurable inputs such as inspection frequency, overdue corrective actions, incident history, and threshold breaches.

**Rationale:** The project begins without sufficient verified historical data for defensible production ML claims.

**Consequence:** ML-based scoring is phase-gated until real data exists and can be evaluated honestly.

## ADR-006 — All surfaced risk scores require explainability

**Status:** Accepted

**Decision:** Every compliance-facing risk score includes contributing factors with factor name, weight, and current value.

**Rationale:** Officials must be able to justify decisions that may affect accountability, escalation, or penalties.

**Consequence:** A score without factor breakdown fails acceptance regardless of model sophistication.

## ADR-007 — MVP tamper evidence uses a PostgreSQL SHA-256 hash chain

**Status:** Accepted

**Decision:** Ledger-relevant events are chained using `SHA256(content + previous_hash)` in append-only PostgreSQL tables.

**Rationale:** This provides practical tamper evidence without introducing unnecessary distributed-ledger infrastructure.

**Consequence:** Blockchain and Hyperledger are not MVP dependencies. A production-scale alternative may be evaluated later if a real governance requirement justifies it.

## ADR-008 — Full 3D digital twin is out of scope

**Status:** Accepted

**Decision:** Do not build a full 3D mine digital twin for the SIH MVP. A simplified 2D section overlay may be added only after the core workflow is stable.

**Rationale:** 3D adds large implementation and demo risk without improving the primary compliance loop enough to justify the cost.

**Consequence:** Any proposed 3D work is rejected unless this ADR is explicitly superseded.

## ADR-009 — SIH backend begins as a modular monolith

**Status:** Accepted

**Decision:** Preserve logical domains from the brief inside one FastAPI deployment for the MVP: `auth`, `inspections`, `hazards`, `sync`, `compliance`, `corrective_actions`, `audit`, `notifications`, `risk`, and `documents`.

**Rationale:** Clear boundaries are valuable; independently deploying every service during a hackathon is not.

**Consequence:** Modules expose explicit contracts so production extraction into services remains possible without forcing distributed-system overhead into the MVP.

## ADR-010 — AI supports governance workflows; AI is not the primary UI

**Status:** Accepted

**Decision:** The product experience leads with inspection, accountability, corrective action, escalation, compliance evidence, and auditability. AI assists through triage, OCR, anomaly detection, risk scoring, and voice input.

**Rationale:** Coal India users need operational confidence, not a generic AI dashboard.

**Consequence:** Large chatbot-first or futuristic AI surfaces are rejected unless they directly improve a specified workflow.

## ADR-011 — Private development source, curated public promotion

**Status:** Accepted

**Decision:** `surang-saathi-dev` is the private engineering source. `surang-saathi` is the curated public showcase and receives only reviewed, secret-safe, reproducible milestones.

**Rationale:** Real development history can remain honest and iterative while the public repository stays understandable to judges, officials, and recruiters.

**Consequence:** Public promotion requires product, architecture, QA, documentation, and secret-scan approval. Git authorship must never be fabricated or rewritten.
