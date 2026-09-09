# Contributing to Surang Saathi

This repository is optimized for disciplined SIH execution: small reviewable changes, explicit product decisions, and a stable demo path.

## Before starting work

Read:

1. `PROJECT_BRIEF.md`
2. `docs/DECISIONS.md`
3. `docs/ARCHITECTURE.md`
4. the implementation packet for the current task

Do not invent scope that is not in the brief or approved task.

## Branches

Use a short branch with one purpose:

```text
feat/<scope>
fix/<scope>
docs/<scope>
chore/<scope>
```

Examples:

```text
feat/offline-hazard-report
feat/sync-engine
feat/manager-hazard-review
fix/sync-idempotency
docs/demo-flow
```

Private `main` should remain a usable internal milestone.

## Commits

Use Conventional Commit-style messages that explain the engineering story:

```text
chore: initialize Surang Saathi foundation
feat(auth): add scoped role authorization
feat(mobile): add offline hazard capture
feat(sync): add immutable event synchronization
feat(compliance): add corrective action state machine
feat(audit): add hash-chain verification
fix(sync): retain conflicting field submissions
```

Avoid ambiguous history such as `update`, `fix2`, or `final-final`.

Never rewrite or fabricate another contributor's Git authorship. Promotion to the public repository must preserve original author metadata.

## Implementation expectations

- Prefer focused files and explicit module boundaries.
- Reuse existing components/contracts before creating duplicates.
- Do not rewrite unrelated code as part of a feature.
- Add focused automated tests for behavioral changes.
- Run affected tests before requesting review.
- Surface limitations and cross-module impact explicitly.
- Do not add dependencies without explaining the reason and maintenance cost.

## Product review gates

A change is not complete merely because it builds.

### Private milestone gate

Required:

- implementation matches the approved scope
- architecture remains consistent with ADRs
- affected automated tests pass
- relevant P0 QA checks pass
- no secrets or production personal data are staged
- demo path is not degraded

### Public promotion gate

Required:

- product review approved
- architecture review approved
- P0 QA passes
- documentation reflects current behavior
- public setup is reproducible
- secret scan passes
- screenshots/demo assets are current when applicable
- internal-only notes/debug artifacts are excluded

## Private → public promotion

`surang-saathi-dev` is the engineering source. `surang-saathi` is curated.

Promote only approved commits/milestones. Cherry-pick is acceptable because it preserves original author metadata; the person performing the promotion becoming the committer is normal Git behavior.

Do not mirror every private WIP commit into the public repository.

## Security

Never commit:

- `.env`
- OAuth client secrets
- database passwords
- API tokens
- private keys
- production credentials
- personal data used only for testing
- unapproved Coal India internal material

Use `.env.example` for variable names and local-only placeholder values.
