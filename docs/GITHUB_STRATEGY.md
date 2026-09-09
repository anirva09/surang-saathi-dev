# GitHub Strategy

## 1. Repositories

### `surang-saathi-dev` — private

Canonical engineering repository. Contains active code, feature branches, implementation packets, internal QA, architecture decisions, demo fixtures, and honest development history.

### `surang-saathi` — public

Curated showcase repository. Contains only milestones explicitly approved for public release.

The public repository is not a mirror and must never be used as the primary development workspace.

## 2. Branch hierarchy during rebuild

```text
main
└── rebuild/v1
    ├── feat/design-system-foundation
    ├── feat/backend-foundation
    ├── feat/field-offline-shell
    ├── feat/offline-hazard-capture
    ├── feat/immutable-sync
    ├── feat/manager-hazard-review
    ├── feat/corrective-actions
    ├── feat/audit-ledger
    ├── feat/compliance-automation
    └── feat/risk-index
```

`main` remains the stable private milestone branch. `rebuild/v1` is the rebuild integration branch. Feature branches are bounded implementation units.

## 3. Feature branch lifecycle

```text
packet approved
→ branch from rebuild/v1
→ implement
→ test/build/audit
→ push feature branch
→ review diff + screenshots + report
→ corrections
→ APPROVED FOR PRIVATE
→ merge to rebuild/v1
```

Do not merge because a coding workspace reports “done.” Review uses GitHub diff plus fresh verification evidence.

## 4. Commit policy

Use meaningful Conventional Commit-style messages. Preserve real authorship.

Never:

- fabricate contributors
- rewrite other contributors' author metadata
- squash only to make AI-assisted development look cleaner
- force-push protected history without explicit human approval
- use `final`, `final2`, `working`, or similarly opaque messages

## 5. Google AI Studio policy

AI Studio may create/edit code for the current feature branch only.

GitHub remains authoritative even if AI Studio reports a different sync state. Before review, verify the branch and diff in GitHub/local Git.

If AI Studio synchronization fails, export/apply the change to the same feature branch. Do not create a parallel undocumented source of truth.

## 6. Suggested branch protection

Where the GitHub account/plan permits:

### `main`

- require pull request before merge
- require governance/CI checks
- block force pushes
- block deletion

### `rebuild/v1`

- require pull request before merge for feature work
- require governance/CI checks
- block force pushes
- block deletion

If single-owner repository settings make formal approvals impractical, still follow the same review discipline manually.

## 7. Private → public promotion

Promotion occurs only after **APPROVED FOR PUBLIC**.

Public-release checks include:

- current feature set is coherent and demo-ready
- setup is reproducible from public files
- documentation matches behavior
- no secrets, private prompts, internal QA notes, or sensitive data
- licenses and third-party attributions are present
- screenshots/videos match the released build
- synthetic/demo data is clearly identified

Promote reviewed commits or a reviewed milestone snapshot without fabricating history. Cherry-picking is acceptable when preserving original author metadata.

## 8. Release naming

Suggested public tags:

```text
v0.1.0-foundation
v0.2.0-field-loop
v0.3.0-compliance
v0.4.0-risk-gis
v0.5.0-intelligence
v1.0.0-sih
```

Tags describe working milestones, not calendar promises.
