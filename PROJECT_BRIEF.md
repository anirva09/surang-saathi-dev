# सुरंग साथी / Surang Saathi
## AI-Based Smart Governance & Compliance Monitoring System for Coal Mines — SIH26024

**Status:** Canonical Product & MVP Specification
**Authority:** Highest implementation authority in the repository
**Updated:** September 2026

> Surang Saathi is a government-grade digital operating platform for coal-mine governance, field evidence, corrective action, statutory compliance, and auditability. It is not a generic AI dashboard. When implementation convenience conflicts with field usability, auditability, or this brief, this brief wins.

---

## 1. Problem We Are Solving

Coal-mine governance still depends heavily on paper registers, disconnected spreadsheets, delayed escalation, and manual compliance tracking. In distributed and underground environments, connectivity can be absent for long periods, yet inspections, hazards, corrective actions, and evidence still need to be captured reliably.

Surang Saathi addresses five load-bearing problems:

1. **Field evidence cannot depend on connectivity.**
2. **Submitted compliance records must not be silently edited or overwritten.**
3. **Managers need a clear action loop, not another analytics-only dashboard.**
4. **Risk scores must be explainable before they can influence accountability.**
5. **Government adoption requires calm, practical, multilingual, low-literacy UX.**

---

## 2. Product Promise

A field worker can capture a safety/compliance event offline, preserve its evidence and location context, sync it later without silent data loss, trigger accountable management action, close the action with proof, and verify the resulting audit history.

The core operating loop is:

```text
Offline field capture
    ↓
Durable local queue
    ↓
Immutable sync
    ↓
Server validation
    ↓
Manager review
    ↓
Corrective action
    ↓
Evidence-backed closure
    ↓
Hash-chained audit ledger
    ↓
Compliance / management visibility
```

This loop is the primary integration test for the SIH MVP.

---

## 3. Non-Negotiable Product Principles

### 3.1 Offline-first, not offline-tolerant

Underground and remote mine workflows must remain usable during multi-day zero-connectivity periods. The field client must generate identifiers and timestamps locally, store queued events and media durably, expose sync state, and retry safely when connectivity returns.

### 3.2 Append-only compliance history

Submitted inspection, hazard, corrective-action, approval, escalation, and closure events are never mutated in place. Corrections are new events that reference prior events.

### 3.3 No silent last-write-wins

If two devices or actors produce conflicting claims, preserve both and surface a reconciliation state. Safety/compliance evidence must never disappear because one write arrived later.

### 3.4 Rule-based MVP before ML

The first Mine Risk Index is a deterministic weighted score using available operational inputs. ML is introduced only after enough real data exists to validate it honestly.

### 3.5 Explainability is mandatory

Every compliance-facing risk score must expose contributing factors, their weights, current values, and scoring-rule/model version. A bare score is invalid.

### 3.6 Field usability over visual novelty

The experience must feel trustworthy, calm, practical, human, and field-ready. Voice, bilingual/multilingual support, large touch targets, explicit status wording, and low cognitive load matter more than animation or fashionable UI.

### 3.7 Government authenticity over startup aesthetics

Avoid glassmorphism, neon gradients, futuristic AI styling, excessive rounded corners, chatbot-first layouts, and generic SaaS dashboard patterns.

---

## 4. Users and Surfaces

| Tier | Representative roles | Primary surface | MVP responsibility |
|---|---|---|---|
| Field / Mine | Overman, Mining Sirdar, Safety Officer | Flutter Android app | Capture hazards/inspections, evidence, severity, location; work offline; submit proof |
| Mine / Area Management | Mine Manager, Colliery Manager, Area GM | Next.js web portal | Review evidence, assign corrective action, approve/reject closure, monitor escalations |
| Corporate / Ministry | CIL HQ analyst, ministry official, DGMS auditor | Next.js web portal | Read aggregate trends, verify audit evidence, export dossiers; no raw-record editing |
| Contractor | Contractor admin | Later lightweight portal | Submit documents, view own issues/trust history |
| System | Admin / DevOps | Admin functions | Roles, scopes, rules, system health |

Role access is scoped by mine, subsidiary/area, or national scope. OAuth2/OIDC-compatible RBAC is the target model.

---

## 5. SIH MVP Architecture

The MVP deliberately uses a **modular monolith** for the backend while preserving future service boundaries.

```text
┌──────────────────────────────┐       ┌──────────────────────────────┐
│ Flutter Field App            │       │ Next.js Web Portal           │
│ Android priority             │       │ manager / audit roles        │
│ SQLite / Drift               │       │ role-scoped workflows        │
│ event + media queue          │       │                              │
└──────────────┬───────────────┘       └──────────────┬───────────────┘
               │ REST                                  │ REST
               └──────────────────┬───────────────────┘
                                  ▼
                    ┌──────────────────────────────┐
                    │ FastAPI Modular Monolith     │
                    │ auth                         │
                    │ inspections                  │
                    │ hazards                      │
                    │ sync                         │
                    │ compliance                   │
                    │ corrective_actions           │
                    │ audit                        │
                    │ notifications                │
                    │ risk                         │
                    │ documents                    │
                    └──────────┬───────────┬───────┘
                               │           │
                   ┌───────────▼────┐ ┌────▼─────────────┐
                   │ PostgreSQL +   │ │ S3-compatible    │
                   │ PostGIS        │ │ object storage   │
                   └────────────────┘ └──────────────────┘
```

### MVP stack

- **Mobile:** Flutter, Android priority
- **Web:** Next.js + TypeScript + Tailwind
- **Backend:** FastAPI modular monolith
- **Database:** PostgreSQL + PostGIS
- **Offline store:** SQLite/Drift
- **Object storage:** MinIO/S3-compatible when media persistence is needed
- **API:** REST-first
- **Authentication target:** OAuth2/OIDC + scoped RBAC
- **Audit:** SHA-256 hash-chained PostgreSQL ledger

### Explicitly not required for SIH MVP

- independent deployment of every domain as a microservice
- service discovery
- Kubernetes
- RabbitMQ
- Elasticsearch
- distributed tracing stack
- blockchain / Hyperledger
- full 3D mine digital twin
- production ML accuracy claims

These may be evaluated later only when a real scale, security, ownership, or deployment need justifies them.

---

## 6. Core Domain Modules

### 6.1 Hazard & Inspection Capture

A field event contains at least:

```text
client_event_id
mine_id
section_id
reporter_id
local_timestamp
location
local_geofence_result
severity_selected_by_worker
optional_ai_suggested_severity
text_or_voice_note
media[]
media_hashes[]
sync_state
```

Important rules:

- worker-selected severity and AI-suggested severity remain separate
- local geofence validation is not authoritative server verification
- media evidence is hashed at capture time where practical
- a submitted event becomes append-only

### 6.2 Sync & Conflict Handling

- upload immutable event batches
- idempotency by client event identifier
- preserve duplicate/conflicting claims for review
- server re-validates geofence against PostGIS
- server verifies media hashes when media is available
- expose `QUEUED`, `SYNCING`, `SYNCED`, `CONFLICT`, `OFFLINE`

### 6.3 Corrective Action & Compliance

Violation lifecycle:

```text
OPEN → ACKNOWLEDGED → OVERDUE → ESCALATED → RESOLVED
```

Corrective action must include:

- owner
- deadline
- evidence/proof
- approval or rejection of closure
- complete history of state transitions

### 6.4 Audit Ledger

For ledger-relevant state changes, append a canonical event record with:

```text
entry_id
entity_type
entity_id
action
actor_id
timestamp
canonical_payload
previous_hash
current_hash
```

`current_hash` is computed from canonical content plus `previous_hash` using SHA-256. The ledger is for tamper evidence; it is not marketed as blockchain.

### 6.5 Rule-Based Mine Risk Index

MVP inputs may include:

- inspection frequency versus target
- overdue corrective-action count
- incident/hazard history in a rolling window
- sensor threshold breaches when demo/sensor data exists

Every response includes:

```text
score
contributing_factors[]
computed_at
scoring_version
```

### 6.6 Documents / OCR — post-backbone

OCR is phase-gated. When introduced:

```text
capture → preprocess → OCR/extract → confidence score → human review for low confidence → structured record + original retained
```

No OCR-accuracy claims are made without real representative mine documents.

---

## 7. Golden Vertical Slice — First Working Product

The first end-to-end implementation is intentionally smaller than the full platform.

### Worker

1. Open app with no network.
2. Report a hazard.
3. Add photo and text/voice note.
4. Select severity manually.
5. Capture location and local geofence result.
6. Save/submit into durable local queue.
7. See `QUEUED/OFFLINE` status.

### Sync

8. Network returns.
9. Client uploads immutable event.
10. Server confirms idempotency, re-validates geofence, verifies available hashes.
11. Event becomes visible to manager.

### Manager

12. Review evidence and validation state.
13. Assign corrective action, owner, and deadline.
14. Responsible actor uploads proof.
15. Manager approves or rejects closure.

### Audit

16. Relevant events are appended to the hash chain.
17. Verification endpoint/report proves chain continuity.

**Golden Slice exit criterion:** this loop works reliably from offline field capture through ledger-verifiable closure.

---

## 8. MVP Scope

### Must ship for the SIH core demo

- design system and role-safe status semantics
- Flutter field shell
- offline hazard capture
- durable local event/media queue
- local geofence validation
- immutable sync + idempotency
- server geofence verification
- manager evidence review
- corrective-action assignment and closure
- append-only audit events
- SHA-256 ledger verification
- demo-safe role/scoped access
- seeded realistic demo data clearly labeled as synthetic

### Strong additions after the Golden Slice

- rules-as-data statutory compliance
- SLA timers and auto-escalation
- rule-based explainable MRI
- GIS mine overview
- PDF dossier generation

### Deferred until the backbone is stable

- OCR/document digitization
- multilingual speech-to-text
- on-device triage model
- sensor anomaly detection
- contractor trust score
- WhatsApp fallback
- 2D mine-section overlay
- broad corporate analytics

### Rejected for SIH MVP

- full 3D digital twin
- blockchain/Hyperledger
- nine separately deployed backend microservices
- large chatbot/AI assistant as the primary UI
- unsupported “real-time Coal India feed” claims
- unsupported production ML accuracy claims

---

## 9. Government UX Language

Locked color tokens:

| Token | Hex |
|---|---|
| Background | `#F7F3EA` |
| Surface | `#FFFDF8` |
| Primary | `#8C4A2F` |
| Accent | `#D4A72C` |
| Success | `#4F5D4A` |
| Danger | `#C6472D` |
| Text | `#2F3A44` |
| Border | `#D8CCBA` |

Visual references:

- geological survey sheets
- engineering field notebooks
- DGMS-style inspection forms
- government service portals

Field UX requirements:

- large touch targets suitable for gloved use
- explicit labels; critical meaning never encoded by color alone
- Hindi, Bengali, Odia, English architecture from day one
- voice affordance where text entry is expected
- persistent sync visibility
- calm offline messaging; offline is an operating condition, not an error
- consequence-aware confirmations for permanent compliance actions

---

## 10. Data Model — MVP Core

```text
User(id, name, role, scope_type, scope_id, preferred_language)
Mine(id, name, subsidiary_id, boundary_polygon)
MineSection(id, mine_id, geometry)
FieldEvent(id, client_event_id, type, mine_id, section_id, actor_id, local_timestamp, server_received_at)
HazardReport(event_id, worker_severity, ai_suggested_severity?, description, status)
Media(id, event_id, object_key/local_path, sha256, media_type)
GeofenceEvidence(event_id, local_result, server_result?, checked_at)
Violation(id, mine_id, regulation_ref?, status, sla_deadline, escalation_level)
CorrectiveAction(id, violation_id, assigned_to, deadline, status)
CorrectiveActionProof(id, action_id, submitted_by, media_id?, note, submitted_at)
AuditLedgerEntry(id, ref_type, ref_id, action, actor_id, canonical_payload, previous_hash, current_hash, created_at)
MineRiskScore(id, mine_id, score, contributing_factors, computed_at, scoring_version)
```

This is a planning model, not a final migration file. Implementation subplans define exact schemas and constraints before code is written.

---

## 11. Non-Functional Requirements

- **Offline resilience:** survive multi-day offline periods without data loss.
- **Auditability:** every state-changing action is attributable to an actor and time; ledger-relevant actions include chain evidence.
- **Security:** scoped RBAC, encrypted transport, secure local secret handling, least privilege.
- **Explainability:** no opaque compliance-facing risk output.
- **Localization:** Hindi/Bengali/Odia/English architecture from day one.
- **Reproducibility:** clean-clone build/test must be part of release gates.
- **Scalability:** evolve from single-mine pilot to subsidiary/national use without rewriting domain contracts.
- **Honesty:** synthetic data, unavailable integrations, and phase-gated AI are labeled clearly.

---

## 12. Implementation Roadmap

### R0 — Documentation and repository authority

Canonical docs, decisions, Git strategy, QA gates, branch rules.

### R1 — Design system

Tokens, typography, field-safe controls, semantic status, sync/geofence evidence, consequence-aware confirmations, accessibility tests.

### R2 — Backend foundation

FastAPI shell, config, PostgreSQL/PostGIS boundary, migrations, health/readiness, module boundaries, test harness.

### R3 — Flutter offline foundation

App shell, Drift/SQLite, local event store, media queue, sync-state shell.

### R4 — Golden Slice capture

Offline hazard capture, severity/accountability, geofence evidence, durable submission.

### R5 — Immutable sync

Batch upload, idempotency, server validation, conflict retention.

### R6 — Manager action loop

Review, assign action, deadlines, proof, approve/reject closure.

### R7 — Audit ledger

Canonical serialization, chain writes, verification endpoint/report.

**MVP Core Gate:** R0–R7 complete and demoable end-to-end.

### R8 — Governance automation

Rules-as-data, SLA scheduler, escalation ladder, notifications.

### R9 — Explainable MRI + GIS + dossier

Rule-based MRI, contributing factors, mine map, PDF dossier.

### R10 — AI/document layer

OCR, multilingual voice, on-device triage, sensor anomaly detection only after backbone and data prerequisites are met.

### R11 — Innovation and scale

Contractors, WhatsApp fallback, 2D overlay, expanded corporate analytics, production hardening.

---

## 13. Future Architecture Principle

The MVP is intentionally not a distributed microservice system. Domain boundaries are designed so modules may be extracted later when one of these becomes true:

- independent scaling is needed
- a workload has different failure/security characteristics
- a separate team owns/release-manages it
- a heavy asynchronous workload needs isolation
- regulatory or deployment boundaries require separation

Microservices are an outcome of real operational pressure, not a maturity badge.

---

## 14. Canonical Demo Story

### 2-minute version

1. Worker underground reports hazard offline.
2. App shows queued evidence and local geofence status.
3. Connectivity returns; event syncs immutably.
4. Server validation appears separately from local validation.
5. Manager assigns corrective action.
6. Closure proof is approved.
7. Audit ledger verifies the record chain.

### 5-minute version

Add SLA escalation, explainable MRI, GIS context, and dossier generation when those modules are complete.

---

## 15. Source-of-Truth Order

When documents disagree, use this order:

1. `PROJECT_BRIEF.md`
2. `docs/DECISIONS.md`
3. `docs/ARCHITECTURE.md`
4. `docs/MVP_SCOPE.md`
5. `docs/UI_PRINCIPLES.md`
6. `docs/DATA_AND_SYNC.md`
7. `docs/SECURITY_AND_AUDIT.md`
8. `docs/QA_CHECKLIST.md`
9. implementation packet / issue / PR scope
10. `docs/future/*` as non-binding future reference
11. `docs/archive/*` as historical material only

An implementation agent must never use a future/archive document to override an active MVP decision.
