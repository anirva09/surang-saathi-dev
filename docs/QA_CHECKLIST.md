# Surang Saathi — QA and Release Gates

## P0 product invariants

A build fails review if any are violated:

- active product name is Surang Saathi
- offline-first field behavior is preserved
- submitted compliance evidence is append-only
- no silent last-write-wins
- local/server geofence evidence remain distinct
- risk scores are explainable
- worker-selected severity is not silently replaced by AI suggestion
- rule-based MRI precedes unsupported ML claims
- low-confidence OCR requires human review when OCR exists
- hash-chained PostgreSQL remains the MVP tamper-evidence mechanism
- no full 3D twin enters MVP scope
- demo/synthetic data is labeled honestly

## Repository / documentation

- work occurs on the intended private feature branch
- no unreviewed push to public repo
- no secrets staged
- active docs follow authority order
- archive/future docs do not override current implementation
- `git diff --check` passes
- authorship is preserved

## Web

For affected changes:

- install from canonical npm lockfile succeeds
- unit/behavior tests pass
- typecheck passes
- lint passes
- production build exits 0
- accessibility checks execute successfully in at least one authoritative environment
- verify 360/768/1440
- no horizontal overflow at 360
- visible keyboard focus
- labels/errors/descriptions associated
- field touch targets meet defined sizes
- Hindi/Devanagari text not clipped

## Mobile / offline

- event queue survives process restart
- media manifest survives restart
- locally generated IDs/timestamps retained
- cached mine/section data available offline
- local geofence works offline
- queued/syncing/synced/conflict/offline visible
- retry after reconnect is safe

## Sync

- same immutable event retry is idempotent
- duplicate transport does not duplicate logical event
- real conflict preserves both claims
- local vs server geofence evidence distinct
- media hash mismatch visible

## Corrective action / compliance

- unauthorized roles/scopes cannot act
- illegal state transitions rejected
- owner and deadline visible
- overdue/escalated state deterministic when automation exists
- closure requires configured proof/approval
- historical events remain queryable after corrections

## Audit

- canonical serialization deterministic
- chain linkage correct
- tampering fixture causes verification failure
- ledger failure never reports permanent completion as successful
- verifier identifies broken link

## Risk

- score always includes factors
- factor name/weight/value shown
- scoring version recorded
- deterministic fixture reproduces expected score
- UI does not imply confidence beyond the model/rules

## Golden Slice release gate

A candidate is not approved until a demo can run:

```text
offline hazard → queue → sync → server validation → manager action → proof → closure → ledger verification
```

from a clean setup without manual database edits.

## Public release gate

Before **APPROVED FOR PUBLIC**:

- clean clone setup passes
- README/docs match released code
- screenshots current
- no private prompts/internal secrets
- dependency licenses/attribution present
- claims are evidence-backed
- 2-minute and 5-minute demos are rehearsable
