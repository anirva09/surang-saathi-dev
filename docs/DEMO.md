# Surang Saathi — Demo Story and Judge Q&A

## Demo principle

Do not demo a menu of features. Demo one accountable governance story.

## 2-minute demo

### 0:00–0:20 — Problem

“Underground connectivity can disappear, but safety evidence and compliance accountability cannot.”

### 0:20–0:50 — Offline field capture

- device is offline
- worker reports hazard
- adds evidence
- selects severity
- local geofence check shown
- event becomes `QUEUED`

### 0:50–1:10 — Sync and validation

- reconnect
- immutable event syncs
- server geofence validation appears separately from local result
- manager sees the event

### 1:10–1:35 — Corrective action

- manager assigns owner/deadline
- proof submitted
- manager approves closure

### 1:35–2:00 — Accountability

- audit chain verifies event/action/closure
- close with: “AI assists later, but the governance backbone already works without black-box assumptions.”

## 5-minute demo

Use the same story, then add only completed features:

- SLA overdue/escalation
- explainable MRI factors
- GIS context
- dossier generation
- OCR/voice only if real implementation is working

## Judge psychology

Judges are likely to test whether this is:

- realistic underground
- more than a dashboard
- actually AI or fake AI
- tamper resistant
- feasible to deploy
- scalable beyond the hackathon

Our answers should lead with workflow and evidence, then architecture.

## Q&A anchors

### “Why not blockchain?”

The MVP needs tamper evidence, not distributed consensus. A deterministic SHA-256 hash chain in PostgreSQL is simpler to operate and directly verifiable. Blockchain can be evaluated only if a real multi-party governance requirement appears.

### “Where is the AI?”

The MVP does not make safety depend on unvalidated ML. We first ship rule-based explainable risk. AI layers include severity suggestion, OCR, voice, and anomaly detection once data/prerequisites exist.

### “What happens underground with no internet?”

The field app persists events/media locally, checks cached geofence data, exposes queue state, and syncs immutably later with idempotency/conflict handling.

### “Can records be edited?”

Submitted compliance history is append-only. Corrections create new events. Ledger-relevant events are hash-chained for tamper detection.

### “Why FastAPI instead of many Spring microservices?”

For SIH, FastAPI modular monolith maximizes delivery while preserving domain boundaries. At scale, modules can be extracted when actual independent scaling/security/ownership needs exist.

### “Is this production-ready for all Coal India mines?”

No hackathon MVP should claim that. The architecture supports a pilot path, and future production hardening includes IAM, HA/DR, observability, security review, and selective service extraction.
