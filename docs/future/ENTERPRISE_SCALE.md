# Enterprise Scale — Non-Binding Evolution Plan

## Stage A — SIH

Goal: prove Golden Slice reliably.

- single FastAPI deployment
- PostgreSQL/PostGIS
- Next.js
- Flutter
- minimal object storage

## Stage B — Single-mine pilot

Measure:

- offline queue failure rate
- sync latency/retry patterns
- media volume
- manager action latency
- database load
- adoption/usability

Add infrastructure only for observed bottlenecks.

## Stage C — Subsidiary rollout

Potential changes:

- HA database
- background workers
- Redis/broker
- object-storage lifecycle
- OIDC provider integration
- stronger observability
- selective service extraction

## Stage D — Multi-subsidiary / national

Evaluate:

- multi-region/DR design
- service isolation
- API gateway
- autoscaling/orchestration
- data warehouse/analytics layer
- time-series platform
- enterprise SIEM
- formal SRE/runbooks
- ERP/HRMS integration contracts

## Key rule

Do not pre-build Stage D into Stage A. Preserve domain/API/data contracts so evolution does not require a product rewrite.
