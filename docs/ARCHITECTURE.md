# Surang Saathi — Rebuild MVP Architecture

## 1. Intent

Surang Saathi is a government-grade operating platform for coal-mine governance and compliance. The rebuild optimizes for one load-bearing property: **field evidence captured without connectivity can become accountable, validated, auditable management action without being silently overwritten.**

The MVP uses a modular monolith for backend delivery speed while preserving the domain boundaries in the project brief.

## 2. Locked architectural invariants

- **Offline-first:** field workflows must remain usable through multi-day zero-connectivity periods.
- **Append-only:** submitted compliance evidence is never mutated in place.
- **No silent last-write-wins:** conflicts are retained and surfaced for reconciliation.
- **Rule-based first:** the Mine Risk Index ships with transparent weighted rules before production ML.
- **Explainable:** every compliance-facing risk score includes contributing factors.
- **SHA-256 audit chain:** MVP tamper evidence uses canonical content plus the previous hash in PostgreSQL.
- **Modular monolith:** logical backend domains remain explicit inside one FastAPI deployment for the SIH MVP.

## 3. System view

```text
┌──────────────────────────────┐       ┌──────────────────────────────┐
│ Flutter Field App            │       │ Next.js Web Portal           │
│ Android priority             │       │ Manager / Corporate roles    │
│ SQLite / Drift               │       │ Role-scoped UX               │
│ offline queue + cache        │       │                              │
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
                   │ state/spatial  │ │ MinIO locally    │
                   └────────────────┘ └──────────────────┘
```

This is an intended boundary map, not a claim that every module is already implemented.

## 4. Domain ownership

| Module | Owns | Must not own |
|---|---|---|
| `auth` | identity claims, role/scope authorization | domain-specific safety/compliance rules |
| `inspections` | inspection record contracts and evidence references | sync transport, escalation scheduler |
| `hazards` | hazard report contracts, reported severity, evidence references | corrective-action approval |
| `sync` | immutable batch intake, idempotency, conflict surfacing | silent conflict resolution |
| `compliance` | violation lifecycle, SLA, statutory linkage, escalation | raw authentication/media bytes |
| `corrective_actions` | assignment, deadline, proof, approval/rejection events | destructive rewriting of submitted history |
| `audit` | canonical serialization, content hash, previous hash, verification | business-state ownership |
| `notifications` | delivery requests/channel routing | source-of-truth compliance status |
| `risk` | rule-based MRI and contributing-factor breakdown | opaque scores |
| `documents` | scans, OCR extraction, confidence, review state | irreversible acceptance of uncertain fields |

## 5. Golden Workflow

### 4.1 Offline capture

The field client creates a client UUID before server contact, records a local timestamp, stores structured form data in SQLite/Drift, hashes captured media, and records local geofence evaluation against cached geometry.

A queued event is durable across app restart and prolonged offline periods.

### 4.2 Sync

When connectivity returns, the client uploads immutable events using idempotency keys/client event IDs.

Expected outcomes:

- new event → appended
- same event retried → idempotent success
- duplicate/conflicting evidence → retained and flagged
- never silent last-write-wins

### 4.3 Server validation

The authoritative backend re-validates geofence position against PostGIS and confirms uploaded media hashes. Device-local validation and server validation remain separately represented.

### 4.4 Manager ownership

The manager reviews evidence and assigns a corrective action with responsible person and deadline. The compliance lifecycle follows:

`OPEN → ACKNOWLEDGED → OVERDUE → ESCALATED → RESOLVED`.

### 4.5 Resolution and audit

Proof submission and manager approval create new events. Ledger-relevant events are written using canonical content plus the previous ledger hash. Historical submitted events are not mutated in place.

### 4.6 Risk and roll-up

Once the Phase-1 loop is stable, the rule-based MRI recomputes from operational inputs and returns score plus contributing factors. Higher-level views aggregate without giving corporate users destructive raw-record edit rights.

## 6. Core data contracts

Stable identifiers should be UUIDs for offline-created entities/events. Exact schemas are introduced by their implementation packets; do not create speculative database models during foundation work.

The project brief's core entities remain authoritative: User, Mine, MineSection, Inspection, HazardReport, CorrectiveAction, Violation, Contractor, MineRiskScore, AuditLedgerEntry, Document, SensorReading.

## 7. Auth model

OAuth2/OIDC-compatible authentication with JWT claims carrying role and scope. Authorization decisions use role plus `scope_type` / `scope_id`; a broad corporate scope does not imply permission to mutate raw mine records.

## 8. AI boundaries

- Rule-based MRI first.
- No compliance-facing score without contributing factors.
- AI severity is a suggestion distinct from worker-selected severity.
- OCR confidence drives review, not silent acceptance.
- ML-based MRI remains gated on adequate real data.

## 9. Infrastructure policy

Local MVP infrastructure starts with PostGIS and MinIO. Add Redis/time-series infrastructure only when an approved module has a concrete need. Do not create production-like distributed complexity for presentation value.
