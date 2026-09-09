# Surang Saathi — Offline Data and Sync Contract

## 1. Purpose

Offline behavior is part of correctness. The system must preserve safety/compliance evidence during long zero-connectivity periods and synchronize without silent overwrite.

## 2. Local event model

Every field event is created before server contact with:

```text
client_event_id: UUID
actor_id
mine_id
section_id
local_timestamp
payload
local_geofence_result
media_manifest[]
status
```

A submitted local event is immutable. A correction produces a new event referencing the earlier one.

## 3. Local persistence

Use SQLite/Drift for:

- immutable queued events
- reference data required offline
- mine/section geometry cache
- media manifest/path/hash
- sync attempts/state

Do not rely on in-memory queues.

## 4. Media

For each captured file, retain:

```text
media_id
local_path
media_type
sha256
captured_at
upload_state
```

If upload is interrupted, structured event sync and media upload state remain independently recoverable.

## 5. Sync state machine

```text
LOCAL_DRAFT
   ↓ submit
QUEUED
   ↓ connectivity / manual sync
SYNCING
   ├─ success → SYNCED
   ├─ authoritative conflict → CONFLICT
   └─ transport failure → QUEUED

OFFLINE is an environmental state that can coexist with QUEUED.
```

UI vocabulary may simplify this, but persisted state must remain unambiguous.

## 6. Server ingestion

A sync request contains immutable events plus idempotency identifiers.

Server behavior:

1. authenticate actor/device/session context
2. reject malformed payloads without discarding other valid events unless batch atomicity is explicitly chosen
3. detect previously accepted event IDs
4. append unseen events
5. re-validate geofence using authoritative PostGIS geometry
6. verify media hash when media is present
7. derive current state/projection
8. return per-event result

## 7. Idempotency

Retrying the same event must not produce duplicate logical events.

Recommended key:

```text
(client_event_id, actor/device scope)
```

Server returns prior acceptance/result when the same immutable event is retried.

## 8. Conflict rules

Never resolve by last-write-wins.

Examples:

- two devices submit overlapping/duplicate inspections
- local geofence says inside but authoritative server geometry says outside
- actor submits correction while manager is reviewing an earlier claim

Store the claims, mark conflict/reconciliation state, and let an authorized manager resolve meaning while preserving history.

## 9. Geofence evidence model

Persist both:

```text
local_result
local_checked_at
server_result
server_checked_at
geometry_version / boundary reference where available
```

The worker UI may say “Locally checked — server verification pending.” It must not say “Verified” until authoritative validation exists.

## 10. Sync acceptance tests

- queue survives app restart
- multi-day offline state does not lose events/media manifest
- event retry is idempotent
- network interruption mid-sync returns safely to queued state
- duplicate delivery does not duplicate current state
- conflict preserves both claims
- local and server geofence evidence remain distinguishable
- media hash mismatch is surfaced
- sync status is visible to the worker
