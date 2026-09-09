# Surang Saathi — QA Checklist

This checklist is a release gate, not a suggestion. A P0 failure blocks the demo/public milestone. P1 failures may be accepted only when documented with an explicit workaround that does not compromise safety, compliance integrity, or the main demo path.

## P0 — Demo and data-integrity blockers

### Offline field capture

- [ ] Hazard/inspection can be created with airplane mode enabled.
- [ ] Client UUID exists before any server request.
- [ ] Local timestamp and actor/mine context persist across app restart.
- [ ] Photo/audio metadata remains associated with the queued event after restart.
- [ ] User sees `Queued`, `Syncing`, `Synced`, or `Conflict` state without opening a debug screen.
- [ ] Multi-item offline queue survives process termination and device restart simulation.

### Sync and conflict safety

- [ ] Retrying the same `client_event_id` does not create a second canonical event.
- [ ] Duplicate delivery returns idempotent success rather than an error that encourages manual resubmission.
- [ ] Conflicting submissions are both retained.
- [ ] Conflict is visible to the correct manager role.
- [ ] No compliance endpoint silently implements last-write-wins.
- [ ] Partial batch failure does not mark unsuccessful events as synced.

### Location and media integrity

- [ ] Client performs local geofence feedback when cached geometry is available.
- [ ] Server re-validates geofence using authoritative geometry after sync.
- [ ] Media hash is generated at capture time.
- [ ] Server can detect a changed media payload when hash verification is executed.
- [ ] UI distinguishes `client check` from `server verified` where relevant.

### Corrective-action lifecycle

- [ ] Manager can review a hazard and create a corrective action.
- [ ] Action has owner and deadline.
- [ ] Resolution proof is stored as a new event/evidence record.
- [ ] Manager approval/rejection is auditable.
- [ ] Submitted historical events cannot be edited in place to erase prior values.
- [ ] Resolved state is reached only through the allowed workflow.

### Audit ledger

- [ ] Ledger entry stores current content hash and previous hash.
- [ ] Recomputing an unchanged chain verifies successfully.
- [ ] Mutating historical canonical test data causes verification failure.
- [ ] UI/documentation calls this a tamper-evident hash chain, not a blockchain.

### Role and scope access

- [ ] Mine-scoped user cannot access another mine's raw records.
- [ ] Area/subsidiary manager sees only records inside authorized scope.
- [ ] Corporate/ministry read scope does not grant raw-record edit permission.
- [ ] Server rejects unauthorized access even if a client manually constructs the request.

### Repository and demo safety

- [ ] No credentials, private keys, access tokens, `.env`, production URLs with embedded credentials, or personal test data are staged.
- [ ] Demo data is synthetic or explicitly labeled as non-production.
- [ ] Demo reset procedure restores a known state.
- [ ] Golden Workflow can be completed without relying on external services that are not guaranteed during judging.
- [ ] Public-repo promotion excludes internal-only notes, temporary dumps, and private debugging artifacts.

## P1 — Product quality

### Field usability

- [ ] Primary field actions meet large-touch-target expectations.
- [ ] Critical tasks do not require precise typing when structured choices or voice input are more appropriate.
- [ ] Destructive/irreversible submission requires explicit confirmation.
- [ ] Sync state remains understandable in poor connectivity.
- [ ] Error copy tells the worker what happened and whether data is safely stored.

### Language and copy

- [ ] Hindi/Bengali/Odia/English architecture does not hard-code English-only domain values into storage contracts.
- [ ] Translated labels do not change statutory identifiers or stored canonical codes.
- [ ] Voice/mic affordance placement is consistent on supported field inputs when that feature is active.

### Manager web quality

- [ ] Dashboard prioritizes: unsafe items, overdue items, ownership, and required action.
- [ ] Empty states explain what the user can do next.
- [ ] Loading, error, stale-data, and permission-denied states are designed.
- [ ] Tables remain usable at common laptop widths.
- [ ] Status color is never the only indicator of severity or state.

### Explainable risk

- [ ] MRI score includes `model_version`.
- [ ] Every score displays contributing factors.
- [ ] UI does not imply predictive certainty that the underlying rule system does not provide.

## Pre-public release gate

- [ ] Product review approved.
- [ ] Architecture review approved.
- [ ] P0 checklist passes.
- [ ] Known P1 exceptions documented.
- [ ] `git diff --check` passes.
- [ ] Automated test suite passes.
- [ ] Secret scan passes.
- [ ] README setup was followed from a clean environment or CI equivalent.
- [ ] Screenshots/demo assets match current UI.
- [ ] Commit authorship is preserved during promotion.
