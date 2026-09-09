# Future Architecture — Non-Binding Reference

**Status:** Future planning only. This document does not override the MVP architecture.

## Why this exists

Older planning work contained useful enterprise-scale ideas—independent services, Kubernetes, enterprise IAM, observability, queues, time-series stores—but implementing all of them for SIH would create more failure modes than value.

This document preserves the evolution path without forcing premature complexity.

## Service extraction candidates

Potential future services:

- Sync/Conflict
- Document/OCR
- Notifications
- Compliance scheduler
- Risk/ML
- Inspection domain
- Audit verification

Extract only when one or more are true:

- independent scaling
- workload isolation
- separate security boundary
- separate ownership/release cadence
- long-running/asynchronous processing
- regulatory/deployment separation

## Possible pilot architecture

```text
Next.js + Flutter
      ↓
API / modular backend
      ↓
PostgreSQL/PostGIS
Redis (if queues/cache justified)
Object storage
OIDC provider
background worker
```

## Possible enterprise architecture

At large scale, evaluate:

- API gateway
- selected independently deployed services
- Kubernetes or government-approved orchestrator
- HA PostgreSQL / read replicas
- Redis/event broker
- time-series database for high-frequency sensors
- search platform if document/log search needs justify it
- central observability
- SIEM
- disaster recovery
- infrastructure-as-code

None are automatic requirements.
