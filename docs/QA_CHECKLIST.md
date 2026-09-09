# Surang Saathi — QA and Review Gates

## P0 product invariants

A release fails if any are violated:

- product name is Surang Saathi only
- offline-first field behavior is preserved
- submitted compliance evidence is append-only
- no silent last-write-wins
- risk scores remain explainable
- rule-based MRI precedes unsupported production ML claims
- low-confidence OCR requires human review
- hash-chained PostgreSQL remains the MVP audit mechanism
- no full 3D digital twin enters MVP scope
- synthetic/demo data is not presented as live Coal India data

## Repository / governance

- current work is on the branch required by the packet
- public `surang-saathi` repo is untouched unless public approval exists
- no secrets or credentials are staged
- no obsolete product naming or retired implementation protocol appears in active tracked files
- `python scripts/verify-governance.py` passes
- `git diff --check` passes
- commit authorship is real and preserved

## Web UI

For affected work:

- typecheck passes
- lint passes
- production build passes
- focused component/behavior tests pass
- accessibility audit passes
- no horizontal overflow at 360 px
- verify 360 px / 768 px / 1440 px
- worker-facing touch targets meet 40–48 px rules
- operational state uses wording/icon plus color, not color alone
- keyboard focus is visible
- labels/errors/descriptions are programmatically associated
- Hindi/Devanagari text is not clipped

## Mobile / offline

- queue survives process restart
- queued events retain client UUID and timestamps
- media is not lost during prolonged offline state
- cached reference data and geofence geometry work offline
- user can see queued/syncing/synced/conflict/offline state
- network recovery triggers safe retry
- retry does not create duplicate logical events
- destructive/ledger-relevant submission requires consequence-aware confirmation

## Sync

- same event retry is idempotent
- duplicate event delivery is not duplicated in state
- real conflict preserves both claims
- manager reconciliation state is explicit
- server geofence result is distinct from client/local result
- media hash mismatch is surfaced and never normalized away

## Compliance / corrective actions

- only authorized role/scope can assign/approve/escalate
- state transitions reject illegal jumps
- SLA deadline and owner are visible
- overdue/escalated state is deterministic
- closure requires evidence/approval path defined by the workflow
- historical events remain queryable after correction

## Audit ledger

- canonical serialization is deterministic
- previous hash linkage is correct
- changing an earlier test record fails verification
- ledger write failures do not falsely report successful permanent completion
- verification report identifies the failed link/record

## Risk

- score always includes contributing factors
- factor names, weights, current values are visible
- scoring rule/model version is recorded
- deterministic test fixtures reproduce expected score
- UI does not imply statistical certainty beyond the rule system

## Public-release gate

Before **APPROVED FOR PUBLIC**:

- setup works from a clean clone
- README and architecture match the released build
- screenshots/demo assets are current
- no internal prompts, hidden QA notes, private fixture data, or secrets
- dependency licenses/attributions are present
- production claims are evidence-backed
- 2-minute and 5-minute demos are rehearsable offline
