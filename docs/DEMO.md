# Surang Saathi — Demo Playbook

> **Rebuild note:** This document defines the target demonstration. A step is shown live only after its implementation is marked complete in `docs/BUILD_STATE.md`; otherwise use an explicitly labeled prepared mock/fixture or omit it.


## Demonstration principle

Do not demo Surang Saathi as a collection of AI features. Demonstrate one governance loop that begins underground and ends with verified management accountability.

**Story:** A safety officer discovers a hazard with no data connection. Surang Saathi preserves the evidence offline, synchronizes it later, creates management accountability, tracks corrective action, and produces a tamper-evident resolution trail.

## 2-minute demo

### 0:00–0:15 — Problem

“Coal-mine safety and compliance still depend heavily on paper logs, disconnected spreadsheets, delayed reporting, and manual deadline tracking. Underground connectivity makes ordinary cloud-first apps unreliable.”

### 0:15–0:45 — Field evidence without connectivity

1. Put the field app in the prepared offline state.
2. Open **Quick Hazard Report**.
3. Show mine/section context, photo/voice/text capture, GPS status, and severity.
4. Submit while offline.
5. Show that the report is safely **Queued**, with an explicit sync indicator.

Say: “Submission succeeds locally. Network availability does not decide whether the worker can record evidence.”

### 0:45–1:10 — Sync and validation

1. Restore connectivity / trigger demo sync.
2. Show the event moving `Queued → Syncing → Synced`.
3. Open the manager portal.
4. Open the newly received hazard and show field evidence plus geofence/media verification status.

Say: “The server re-validates what the device captured. Duplicate or conflicting evidence is never silently overwritten.”

### 1:10–1:40 — Accountability

1. Manager assigns a corrective action with owner and deadline.
2. Show the status/SLA ownership clearly.
3. Use the prepared resolution proof to close the action through the approved path.

Say: “Surang Saathi connects reporting to ownership and closure instead of ending at a dashboard notification.”

### 1:40–2:00 — Auditability and AI position

1. Show the audit verification record for the resolved workflow.
2. If MRI is available in the current milestone, show its contributing factors rather than only the number.

Say: “Every important state change is traceable and tamper-evident. Our AI is explainable and assists the workflow; it does not replace accountable officials.”

## 5-minute demo

### 0:00–0:40 — Context and user tiers

Explain the three operational tiers: field/mine, area/subsidiary management, corporate/ministry oversight. Emphasize that each surface is role-specific rather than one generic admin dashboard.

### 0:40–1:40 — Offline field capture

Walk through the hazard report deliberately. Show large field controls, explicit offline status, locally durable submission, and media/location evidence. Mention that the same offline event model underpins inspections and corrective-action proof.

### 1:40–2:20 — Immutable synchronization

Show synchronization and explain idempotency:

- same client event retried → accepted once
- duplicate delivery → safe idempotent result
- actual conflict → both retained + manager reconciliation

Do not spend time on transport internals unless asked.

### 2:20–3:15 — Compliance workflow

Show manager review, owner, deadline, status progression, and prepared escalation example. Explain that statutory rules are intended as data so regulation/deadline changes do not require rewriting application code.

### 3:15–3:50 — Audit evidence

Show the ledger verification view or verification output. Explain SHA-256 hash chaining in plain language: changing an earlier recorded event breaks the chain. Explicitly state that the MVP does not need blockchain to provide useful tamper evidence.

### 3:50–4:25 — Explainable intelligence

Show MRI only if implemented. Open its factor breakdown and explain that the MVP deliberately starts with transparent weighted rules because no verified production training dataset exists at project start.

If OCR/voice is implemented, show one short example without allowing it to displace the governance story.

### 4:25–5:00 — Scale and close

Show the architecture/roadmap slide or manager summary. Explain the progression from single-mine pilot → subsidiary → all-CIL and close with:

“Surang Saathi turns field evidence into accountable, auditable action even when the mine is offline.”

## Demo preparation checklist

- Use one named synthetic mine and consistent fictional users across all screens.
- Keep one high-severity hazard pre-seeded as the fallback path.
- Keep one overdue corrective action pre-seeded for escalation demonstration.
- Keep one verified ledger chain and one intentionally modified test chain available for Q&A.
- Prepare an offline queue before judging so the demo does not depend on external connectivity.
- Never claim synthetic/demo data is live Coal India data.

## Judge Q&A

### “How does this work underground without internet?”

The field app is offline-first. It creates immutable events locally with client IDs/timestamps and stores them in SQLite/Drift. Mine/section reference data and required geofence geometry are cached. When connectivity returns, the sync service uploads events idempotently and the server performs authoritative validation.

### “What happens if two devices submit conflicting information?”

We do not use last-write-wins for compliance evidence. Both submissions are retained and a reconciliation flag is surfaced to the authorized manager. That protects safety evidence from being silently erased.

### “Where is the AI?”

AI supports specific jobs: explainable risk scoring, OCR/document extraction, voice transcription, anomaly detection, and on-device hazard triage. The core compliance loop works without assuming a trained production ML model.

### “What accuracy does your AI achieve?”

We do not claim production accuracy without a representative Coal India dataset. The MVP risk score is transparent and rule-based. OCR confidence is surfaced and low-confidence fields require human review. ML upgrades are explicitly gated on real data and evaluation.

### “Why not blockchain?”

The MVP requirement is tamper evidence, not a distributed cryptocurrency-style network. A SHA-256 hash-chained append-only ledger in PostgreSQL is simpler, auditable, and sufficient for the pilot. A distributed ledger would add operational complexity without improving the first deployment enough to justify it.

### “Why not a 3D digital twin?”

A full 3D twin is expensive and not necessary for the primary compliance problem. The roadmap allows a simpler 2D mine-section overlay after the reporting/compliance backbone is stable.

### “How does this scale from one mine to Coal India?”

Role/scope claims, mine/subsidiary identifiers, PostGIS boundaries, and domain contracts are designed for hierarchical rollout. We start operationally as a modular monolith to ship reliably, while retaining boundaries that can be extracted into services when real scale justifies it.

### “Can an administrator edit a bad inspection after submission?”

Not in place. Submitted compliance events are append-only. A correction is a new traceable event referencing the original. This prevents administrative cleanup from destroying the historical record.

### “How is this different from an incident-reporting app?”

The report is only the first event. Surang Saathi links field evidence to validation, responsibility, SLA tracking, escalation, corrective-action proof, manager approval, audit verification, statutory dossiers, and higher-level visibility.
