# सुरंग साथी · Surang Saathi

**Private development repository — Smart India Hackathon SIH26024**

Surang Saathi is an offline-first governance and compliance platform for coal mines. It connects field evidence, management accountability, statutory workflows, explainable risk scoring, and tamper-evident audit records without assuming continuous mine connectivity.

> This repository is the private engineering source. The public `surang-saathi` repository receives only reviewed, secret-safe, reproducible milestones.

## Product thesis

The product is not an “AI dashboard.” The primary operating loop is:

```text
field evidence
    ↓
offline-safe capture
    ↓
immutable sync
    ↓
manager review
    ↓
corrective action + SLA
    ↓
resolution proof
    ↓
audit verification
    ↓
compliance visibility
```

AI supports this workflow through explainable risk scoring, OCR, multilingual voice input, anomaly detection, and phase-gated hazard triage.

## Source of truth

- [`PROJECT_BRIEF.md`](PROJECT_BRIEF.md) — authoritative functional and technical specification
- [`docs/DECISIONS.md`](docs/DECISIONS.md) — accepted ADRs
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — MVP architecture and module boundaries
- [`docs/QA_CHECKLIST.md`](docs/QA_CHECKLIST.md) — release gates
- [`docs/DEMO.md`](docs/DEMO.md) — 2-minute/5-minute demo and judge Q&A
- [`CLAUDE.md`](CLAUDE.md) — implementation protocol for Claude

When implementation convenience conflicts with the project brief or an accepted ADR, the brief/ADR wins.

## Locked MVP architecture

| Layer | Technology |
|---|---|
| Field app | Flutter / Dart, Android priority |
| Offline field storage | SQLite via Drift |
| Manager portal | Next.js / React / TypeScript |
| Backend | FastAPI / Python modular monolith |
| Transactional + spatial data | PostgreSQL + PostGIS |
| Media/document storage | S3-compatible storage; MinIO locally |
| API | REST for MVP |
| Authentication | OAuth2/OIDC-compatible + scoped RBAC |
| Maps | Leaflet initially |
| Audit | PostgreSQL SHA-256 hash chain |

## Hard constraints

- Offline-first field workflows, including multi-day zero-connectivity operation.
- Append-only submitted compliance events.
- No silent last-write-wins conflict handling.
- Explainable Mine Risk Index; rule-based before production ML.
- Human review for low-confidence OCR extraction.
- No blockchain/Hyperledger dependency for the MVP.
- No full 3D digital twin in the MVP.
- No unsupported claims about AI accuracy or access to live Coal India data.

## Current milestone

**Milestone 0 — Foundation**

The repository is establishing the authoritative brief, ADRs, architecture, QA/demo gates, Claude implementation rules, and minimal local infrastructure. Application modules are intentionally not being faked into existence before their implementation tickets are approved.

The first executable product milestone will prove:

> offline field report → immutable sync → manager action → corrective-action closure → ledger verification

## Local infrastructure

Milestone 0 includes only the infrastructure that is already justified:

```bash
cp .env.example .env
docker compose up -d postgres minio
```

This starts PostGIS and local S3-compatible object storage. Application services will be added when their implementation milestones begin.

## Development workflow

```text
approved product/architecture decision
        ↓
implementation packet
        ↓
feature branch in surang-saathi-dev
        ↓
Claude implementation + tests
        ↓
product / architecture / QA review
        ↓
private main milestone
        ↓
public-release gate
        ↓
curated promotion to surang-saathi
```

See [`CONTRIBUTING.md`](CONTRIBUTING.md) for branch, commit, and release rules.
