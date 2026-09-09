# Surang Saathi — SIH MVP Scope

## North-star outcome

A judge should be able to watch one field event travel from **offline capture → sync → manager action → evidence-backed closure → ledger verification** without hand-waving.

## P0 — Golden Slice (must work)

### Field app

- login/session stub or real role-safe auth sufficient for demo
- worker home with persistent offline/sync state
- new hazard report
- photo evidence
- text/voice-note field (real STT may be deferred; audio capture or placeholder contract is acceptable until AI phase)
- worker-selected severity
- local GPS + local geofence result
- durable SQLite/Drift queue
- queue survives process restart

### Backend

- FastAPI application
- PostgreSQL/PostGIS
- immutable event ingestion
- idempotency
- server geofence verification
- explicit local-vs-server geofence evidence
- conflict retention
- hazard/current-state projection

### Manager web

- actionable queue/list
- hazard detail with evidence
- assign corrective action
- owner + deadline
- review proof
- approve/reject closure

### Audit

- canonical event serialization
- SHA-256 previous/current hash chain
- verification endpoint or report

## P1 — Strong SIH differentiators (after P0)

- rules-as-data statutory deadlines
- SLA overdue detection
- automatic escalation ladder
- explainable rule-based MRI
- GIS overview
- PDF dossier

## P2 — AI/document enhancements

- OCR + confidence + human review
- Hindi/Bengali/Odia/English speech-to-text
- on-device hazard triage suggestion
- sensor ingestion/anomaly flags

## P3 — Post-core innovation

- contractor trust score / cross-mine flagging
- WhatsApp fallback
- 2D mine-section overlay
- predictive maintenance/safety correlation
- richer corporate analytics

## Explicitly out of SIH MVP

- full 3D digital twin
- Hyperledger/blockchain infrastructure
- nine separately deployed Spring services
- Kubernetes/Harbor/Vault/ELK stack solely for presentation
- full ERP/HRMS production integration
- public national live dashboard using invented live data
- production accuracy claims for ML/OCR without real validation data

## Feature acceptance filter

Before adding a feature, answer yes to all five:

| Question | Required |
|---|---|
| Solves a real mining/governance problem? | Yes |
| Strengthens the demo story? | Yes |
| Buildable and testable in SIH time? | Yes |
| Government-realistic? | Yes |
| Worth the complexity relative to Golden Slice? | Yes |

If not, defer it.
