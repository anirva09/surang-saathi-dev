# सुरंग साथी · Surang Saathi

**Private engineering repository — Smart India Hackathon SIH26024**

Surang Saathi is an offline-first governance and compliance operating platform for coal mines. It turns field evidence into accountable action: durable capture underground, immutable synchronization, manager ownership, corrective-action closure, explainable risk, and tamper-evident audit records.

> This is the private source of truth for active development. The public `surang-saathi` repository receives only explicitly approved, secret-safe, reproducible milestones.

## Product thesis

Surang Saathi is not a generic AI dashboard. The primary value loop is:

```text
offline field evidence
    ↓
durable local queue
    ↓
immutable + idempotent sync
    ↓
server validation
    ↓
manager review
    ↓
corrective action + SLA
    ↓
proof + approval
    ↓
ledgered resolution
    ↓
compliance visibility
```

AI assists specific jobs such as explainable risk scoring, OCR, multilingual voice input, anomaly detection, and phase-gated hazard triage. Accountable officials remain responsible for compliance decisions.

## Authority order

Read these before implementation:

1. [`PROJECT_BRIEF.md`](PROJECT_BRIEF.md) — authoritative functional/technical specification
2. [`docs/DECISIONS.md`](docs/DECISIONS.md) — accepted product and architecture decisions
3. [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — current MVP boundaries and data flow
4. [`docs/UI_PRINCIPLES.md`](docs/UI_PRINCIPLES.md) — locked government/field UX rules
5. current task packet in [`docs/ai-studio/packets/`](docs/ai-studio/packets/)

When convenience conflicts with a higher authority, the higher authority wins.

## Rebuild workflow

We are rebuilding cleanly on `rebuild/v1`.

```text
ChatGPT
product + UX + architecture + task packet + review
        ↓
Google AI Studio
bounded implementation + tests
        ↓
GitHub / surang-saathi-dev
feature branch + canonical history
        ↓
ChatGPT QA gate
        ↓
APPROVED FOR PRIVATE
        ↓
rebuild/v1
        ↓
private milestone QA
        ↓
main
        ↓
APPROVED FOR PUBLIC
        ↓
surang-saathi
```

GitHub is canonical. AI Studio is an implementation workspace, not the source of truth.

## Locked stack

| Layer | Choice |
|---|---|
| Field client | Flutter / Dart, Android priority |
| Offline field storage | SQLite via Drift |
| Manager/corporate web | Next.js / React / TypeScript |
| Backend | FastAPI / Python modular monolith |
| Transactional + spatial data | PostgreSQL + PostGIS |
| Media/document storage | S3-compatible storage; MinIO locally |
| API | REST for MVP |
| Authentication | OAuth2/OIDC-compatible scoped RBAC |
| Maps | Leaflet initially |
| Audit | PostgreSQL SHA-256 hash chain |

## Non-negotiables

- Multi-day offline field use without data loss.
- Submitted compliance evidence is append-only.
- No silent last-write-wins conflict handling.
- Rule-based Mine Risk Index before production ML.
- Every surfaced risk score includes contributing factors.
- Human review for low-confidence OCR extraction.
- No blockchain/Hyperledger dependency for the MVP.
- No full 3D digital twin in the MVP.
- No unsupported claims about AI accuracy or live Coal India data.
- Product name is **सुरंग साथी / Surang Saathi** only.

## Current build state

See [`docs/BUILD_STATE.md`](docs/BUILD_STATE.md). The active coding target is the **Design System Foundation**. No manager dashboard, offline workflow, backend business logic, or AI module is considered implemented until its own packet passes review.

## Google AI Studio

Start with:

- [`AI_STUDIO.md`](AI_STUDIO.md)
- [`docs/ai-studio/MASTER_PROMPT.md`](docs/ai-studio/MASTER_PROMPT.md)
- [`docs/ai-studio/packets/0001-design-system-foundation.md`](docs/ai-studio/packets/0001-design-system-foundation.md)
- [`docs/GITHUB_SETUP.md`](docs/GITHUB_SETUP.md) — remote/rebuild branch setup

Do not ask AI Studio to “build the whole product.” One bounded packet is implemented and reviewed at a time.

## Local infrastructure

The existing local infrastructure is intentionally small:

```bash
cp .env.example .env
docker compose up -d postgres minio
```

This starts PostGIS and local S3-compatible storage. Application services are added only when their implementation packet begins.

## Governance verification

```bash
python scripts/verify-governance.py
git diff --check
```

GitHub Actions runs the same governance gate on pull requests and protected integration branches.
