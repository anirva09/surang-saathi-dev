# Surang Saathi — MVP Architecture

## 1. Architectural intent

Surang Saathi is designed as a government-grade operational platform for coal-mine governance and compliance. The SIH build uses a **modular monolith** for speed and reliability while preserving the logical boundaries defined in `PROJECT_BRIEF.md`.

The architecture is intentionally optimized around one load-bearing workflow: a field event can be captured offline, synchronized without silent overwrite, acted on by management, resolved with evidence, and verified through a tamper-evident history.

## 2. System view

```text
┌──────────────────────────────┐      ┌──────────────────────────────┐
│ Flutter Field App            │      │ Next.js Manager Portal       │
│ Android priority             │      │ Mine / Area / Subsidiary     │
│ SQLite / Drift offline store │      │ role-scoped web UX           │
└──────────────┬───────────────┘      └──────────────┬───────────────┘
               │ REST                                   │ REST
               └──────────────────┬────────────────────┘
                                  v
                    ┌──────────────────────────────┐
                    │ FastAPI Modular Monolith     │
                    │                              │
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
                    └───────────┬──────────┬───────┘
                                │          │
                   ┌────────────v───┐  ┌───v────────────────┐
                   │ PostgreSQL +   │  │ S3-compatible       │
                   │ PostGIS        │  │ object storage      │
                   │ events/spatial │  │ MinIO locally       │
                   └────────────────┘  └────────────────────┘
```

This diagram describes the intended MVP boundaries; it does not claim that every module has already been implemented.

## 3. Domain modules

| Module | Owns | Must not own |
|---|---|---|
| `auth` | identity claims, role/scope authorization boundaries | domain-specific business rules |
| `inspections` | inspection records, types, field evidence references | sync transport or statutory escalation |
| `hazards` | hazard reports, severity, field description/media references | corrective-action approval logic |
| `sync` | immutable batch intake, idempotency, conflict surfacing | silent conflict resolution |
| `compliance` | violations, SLA state machine, statutory linkage, escalation state | raw authentication or media storage |
| `corrective_actions` | assignment, deadline, proof submission, approval/rejection events | destructive mutation of submitted history |
| `audit` | canonical content hashing, previous-hash chain, verification reports | business-state ownership |
| `notifications` | delivery requests and channel routing | source-of-truth compliance state |
| `risk` | rule-based MRI calculation and factor breakdown | opaque unexplainable scores |
| `documents` | source scans, OCR extraction results, confidence/review state | irreversible auto-accept of low-confidence fields |

## 4. Golden Workflow data flow

### 4.1 Field capture

The mobile client creates a UUID before server contact and records the event locally with device timestamp, mine/section context, GPS, structured fields, and media metadata. Photo/audio content is hashed at capture time before sync.

A field submission is successful locally when it is durably queued, not when the network responds.

### 4.2 Sync contract

The client uploads immutable event batches. Each event must carry enough identity to support idempotency and reconciliation:

```text
client_event_id
client_device_id
actor_id
mine_id
section_id (when applicable)
event_type
client_timestamp
payload
media_hashes[]
```

The server may return one of these synchronization outcomes:

```text
accepted
already_accepted
conflict_flagged
rejected_invalid
```

`already_accepted` is an idempotent success. `conflict_flagged` retains the incoming evidence and creates manager-visible reconciliation work. The server never resolves compliance evidence by last-write-wins.

### 4.3 Server validation

After intake, authoritative validation can re-check mine/section geofence membership using PostGIS and verify media hashes against uploaded objects. Client-side checks improve field feedback; server validation remains authoritative after sync.

### 4.4 Governance workflow

A qualifying hazard can open a violation/corrective-action workflow. The state progression follows the brief:

```text
Open → Acknowledged → Overdue → Escalated → Resolved
```

Transitions are recorded as events. Closure requires evidence and manager approval; a submitted historic event is never rewritten to make the timeline appear cleaner.

### 4.5 Audit chain

Ledger-relevant canonical events are serialized deterministically and chained:

```text
entry_hash = SHA256(canonical_content + previous_hash)
```

Verification recomputes the chain and reports any break. The ledger proves tamper evidence for recorded events; it must not be presented as a blockchain.

## 5. Risk engine contract

The MVP risk engine is rule-based. A response must expose both score and reasons:

```json
{
  "mine_id": "...",
  "score": 72,
  "band": "high",
  "model_version": "rules-v1",
  "computed_at": "...",
  "contributing_factors": [
    {
      "name": "overdue_corrective_actions",
      "weight": 0.30,
      "current_value": 4,
      "contribution": 18
    }
  ]
}
```

A compliance-facing screen must not display a risk number without the contributing-factor explanation.

## 6. Offline mobile architecture

The mobile app uses SQLite via Drift for:

- queued immutable events
- locally cached mine/section reference data
- cached geofence polygons required by active assignments
- sync status and retry metadata
- local views of submitted reports

Multi-day offline operation is an acceptance requirement. Connectivity detection starts synchronization; it does not gate capture.

## 7. Security and authorization boundary

OAuth2/OIDC-compatible authentication issues claims carrying role and scope. Authorization is enforced server-side using at least:

```text
role
scope_type
scope_id
```

The web client may hide inaccessible controls for usability, but client-side visibility is never the security boundary.

Corporate/ministry users are read-heavy and may not edit raw field records simply because they have broad geographic scope.

## 8. Storage boundaries

**PostgreSQL + PostGIS** stores transactional records, event history, spatial polygons, reconciliation state, and the audit chain.

**MinIO/S3** stores photos, audio, scanned source documents, and generated dossier artifacts. Database records store object references plus integrity metadata rather than binary blobs.

Time-series storage is intentionally not introduced in Milestone 0. Add TimescaleDB/InfluxDB only when sensor ingestion becomes a real implementation task.

## 9. Production extraction path

The modular monolith is not a denial of the brief's production service model. Extraction should occur only when operational evidence justifies it. Candidate extraction boundaries are `sync`, `documents/OCR`, `notifications`, and `risk` because they have distinct scaling or runtime characteristics.

A module is ready for extraction only when its API, data ownership, error contract, and observability requirements are stable enough that separation improves operations rather than architecture diagrams.

## 10. Milestone sequence

1. Foundation and contracts.
2. Offline hazard/inspection capture.
3. Immutable synchronization and manager review.
4. Corrective-action lifecycle and audit verification.
5. Statutory automation and explainable MRI.
6. GIS/dossier generation.
7. OCR, multilingual voice, sensors, and phase-gated AI additions.
8. Contractor/WhatsApp/2D section-overlay differentiation after the core is stable.

The canonical Section 10 action cycle in `PROJECT_BRIEF.md` remains the integration-test backbone across milestones.
