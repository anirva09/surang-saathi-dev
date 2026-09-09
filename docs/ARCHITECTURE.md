# Surang Saathi — MVP Architecture

## 1. Architectural goal

Make offline field evidence become validated, accountable, auditable management action with the fewest moving parts necessary for SIH.

## 2. System view

```text
Flutter Field App                    Next.js Web Portal
Android priority                     manager / corporate / audit
SQLite/Drift                         role-scoped views
      │                                      │
      └──────────────── REST ────────────────┘
                         │
                         ▼
                FastAPI Modular Monolith
         ┌─────────────────────────────────────┐
         │ auth                                │
         │ inspections                         │
         │ hazards                             │
         │ sync                                │
         │ compliance                          │
         │ corrective_actions                  │
         │ audit                               │
         │ notifications                       │
         │ risk                                │
         │ documents                           │
         └──────────────┬───────────────┬──────┘
                        │               │
                  PostgreSQL         MinIO/S3
                  + PostGIS          when media needed
```

## 3. Monorepo target

```text
surang-saathi-dev/
├── apps/
│   ├── web/                 # Next.js
│   └── mobile/              # Flutter
├── backend/
│   ├── app/
│   │   ├── core/
│   │   ├── auth/
│   │   ├── inspections/
│   │   ├── hazards/
│   │   ├── sync/
│   │   ├── compliance/
│   │   ├── corrective_actions/
│   │   ├── audit/
│   │   ├── notifications/
│   │   ├── risk/
│   │   └── documents/
│   ├── migrations/
│   └── tests/
├── packages/
│   └── contracts/           # OpenAPI/generated/shared contract artifacts where useful
├── infra/
│   └── docker-compose.yml
└── docs/
```

This is a target boundary map; do not create empty folders merely for appearance.

## 4. Request/data flow

### Field capture

1. Client generates event UUID and local timestamp.
2. Client stores structured payload and media metadata locally.
3. Local geofence check uses cached geometry.
4. Submitted event is immutable in the local event history.
5. UI shows explicit queue/offline state.

### Sync

1. Client uploads an immutable batch.
2. Server de-duplicates by event identifier/idempotency key.
3. Server stores event before deriving current domain state.
4. Server re-validates geofence using PostGIS.
5. Hash/media-integrity result is stored separately from the client claim.
6. Conflicts are retained and surfaced.

### Manager action

1. Web portal loads evidence and validation state.
2. Manager creates corrective action.
3. Responsible actor submits proof.
4. Manager approves/rejects closure.
5. Ledger-relevant events are appended to audit chain.

## 5. Data ownership

Each domain module owns its business rules and service/repository layer. Cross-module writes happen through explicit application interfaces/events, not arbitrary table mutation from unrelated modules.

Examples:

- `sync` owns ingestion/idempotency/conflict intake, not corrective-action decisions.
- `compliance` owns violation state machine and SLA rules.
- `audit` owns canonicalization/hash-chain append/verification.
- `risk` reads approved inputs and produces explainable results; it does not mutate compliance decisions.

## 6. API strategy

- REST-first for MVP.
- OpenAPI generated from FastAPI is the contract source.
- Version public API paths when real compatibility pressure appears; avoid premature internal gRPC.
- Idempotency is explicit on offline sync endpoints.
- Permanent actions use consequence-aware endpoints/commands, not generic destructive CRUD.

## 7. Authentication / authorization

Target model: OAuth2/OIDC identity, JWT claims, role + scope authorization.

For SIH, implement enough identity/RBAC to demonstrate correct role boundaries without building a full IAM platform if it blocks the Golden Slice.

## 8. Why not microservices now

Separate deployment adds service discovery, distributed failures, cross-service auth, network observability, multiple pipelines, versioning, and deployment coordination. None of those prove the mine-worker value loop.

We retain logical boundaries so extraction later is possible.

## 9. Evolution path

### SIH

FastAPI modular monolith + PostgreSQL/PostGIS + Next.js + Flutter.

### Pilot

Potentially add Redis, object storage, real OIDC provider, background worker if measured needs appear.

### Subsidiary scale

Extract heavy/independently scaling domains first, likely sync, documents/OCR, notifications.

### National scale

Evaluate API gateway, independent services, Kubernetes, HA/DR, observability, SIEM, time-series platform, search, and enterprise IAM based on measured traffic and government hosting requirements.

See `future/FUTURE_ARCHITECTURE.md`.
