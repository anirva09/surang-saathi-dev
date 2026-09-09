# Contributing to Surang Saathi

Surang Saathi is being built as a government-grade SIH MVP. Changes must be small enough to review, explicit enough to audit, and realistic enough to defend in front of Coal India officials and SIH judges.

## Read before changing code

1. `PROJECT_BRIEF.md`
2. `docs/DECISIONS.md`
3. `docs/ARCHITECTURE.md`
4. `docs/UI_PRINCIPLES.md`
5. `docs/GITHUB_STRATEGY.md`
6. the current task packet under `docs/ai-studio/packets/`

Do not invent scope outside the brief or approved packet.

## Branch model

Permanent private branches:

```text
main
└── rebuild/v1
```

All implementation work branches from `rebuild/v1` during the rebuild:

```text
feat/<scope>
fix/<scope>
chore/<scope>
docs/<scope>
test/<scope>
```

Examples:

```text
feat/design-system-foundation
feat/backend-foundation
feat/offline-hazard-capture
feat/immutable-sync
fix/sync-idempotency
```

Do not implement directly on `main` or `rebuild/v1` except explicit repository-governance maintenance approved for that branch.

## Implementation cycle

```text
approved packet
→ feature branch
→ implementation
→ focused tests
→ full affected verification
→ structured implementation report
→ ChatGPT product/architecture/QA review
→ corrections if required
→ APPROVED FOR PRIVATE
→ merge to rebuild/v1
```

A passing build is not approval by itself.

## Commits

Use meaningful Conventional Commit-style messages:

```text
feat(web): add government field control primitives
feat(sync): add idempotent immutable event intake
fix(mobile): retain queued media across restart
feat(audit): add hash-chain verification
```

Avoid `update`, `fix2`, `final`, `final-final`, or history rewritten only for appearance.

Never fabricate, replace, or rewrite another contributor's authorship.

## Dependency policy

Before adding a dependency, state:

- what concrete problem it solves
- why existing platform/library capabilities are insufficient
- maintenance/security cost
- whether it affects offline behavior or bundle size

Avoid adding infrastructure to look sophisticated.

## Test expectations

Behavioral changes require focused tests. High-value tests include:

- offline durability and retry behavior
- idempotency and conflict retention
- state-machine transitions
- authorization scope boundaries
- risk explainability contracts
- hash-chain verification
- accessibility and field control semantics

Avoid snapshot-test spam that does not protect behavior.

## Private review gate

A branch can merge into `rebuild/v1` only when:

- packet scope is complete and no unrelated scope was added
- affected tests pass
- type/lint/build checks pass where applicable
- architecture and ADRs remain consistent
- accessibility checks pass for UI work
- no secrets or production personal data are staged
- no unsupported product/AI claims appear
- demo-critical paths are not degraded
- ChatGPT review says **APPROVED FOR PRIVATE**

## Public promotion gate

`surang-saathi-dev` is the engineering source. `surang-saathi` is curated.

Nothing is promoted until an explicit **APPROVED FOR PUBLIC** review confirms:

- product coherence
- architecture coherence
- P0 QA
- reproducible setup
- current documentation
- secret scan
- license/attribution checks
- public-safe screenshots/demo assets
- exclusion of internal prompts, QA working notes, and private data

See `docs/GITHUB_STRATEGY.md`.
