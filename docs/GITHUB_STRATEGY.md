# Surang Saathi — GitHub Strategy

## Repositories

### `surang-saathi-dev` — private

Source of truth for active development, internal docs, fixtures, feature branches, QA, and experiments.

### `surang-saathi` — public

Curated showcase only. Receives reviewed, reproducible, secret-safe milestones after explicit **APPROVED FOR PUBLIC**.

## Branch model

```text
main                         # stable private milestones
└── rebuild/v1               # active rebuild integration line
    ├── feat/design-system
    ├── feat/backend-foundation
    ├── feat/offline-hazard
    ├── feat/sync
    ├── feat/manager-action
    └── ...
```

Feature work is reviewed before integration. Do not use `main` as an AI scratchpad.

## Commit principles

Use meaningful commits:

```text
feat(mobile): add durable offline hazard queue
feat(sync): add idempotent event ingestion
feat(web): add manager corrective-action review
feat(audit): add SHA-256 chain verification
fix(sync): preserve conflicting geofence claims
```

Avoid `update`, `fix2`, `final-final`.

## History and authorship

- do not fabricate authorship
- do not rewrite other contributors' authors
- do not force-push just to make history look cleaner
- preserve honest development history

## Public promotion

Before promoting to public:

1. QA passes
2. secrets/internal-only material removed
3. README/docs match code
4. setup works from clean clone
5. screenshots/demo current
6. licenses/attributions included
7. claims are evidence-backed

Public promotion may use cherry-pick or another traceable release method, preserving original author metadata.
