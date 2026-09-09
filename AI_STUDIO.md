# Google AI Studio Engineering Protocol — Surang Saathi

Google AI Studio is the primary implementation workspace for bounded Surang Saathi tasks. It is not the product owner and it is not the canonical repository.

## Canonical source

GitHub repository: `surang-saathi-dev`
Integration branch during rebuild: `rebuild/v1`

Before implementation, read in this order:

1. `PROJECT_BRIEF.md`
2. `docs/DECISIONS.md`
3. `docs/ARCHITECTURE.md`
4. `docs/UI_PRINCIPLES.md`
5. `docs/GITHUB_STRATEGY.md`
6. the exact current packet in `docs/ai-studio/packets/`

If a lower-priority instruction conflicts with a higher one, stop and report the conflict.

## Role

Implement the requested packet cleanly and incrementally.

Do not independently:

- add features or screens outside the packet
- redesign approved workflows
- replace the architecture or stack
- create separate microservices for logical modules during the MVP
- introduce blockchain or a full 3D digital twin
- make production ML accuracy claims
- imply access to live Coal India systems/data
- silently change locked colors, status semantics, or offline behavior
- merge directly to `rebuild/v1` or `main`
- modify the public `surang-saathi` repository

## Product principles

1. Mine worker usability.
2. Government authenticity.
3. SIH technical feasibility.
4. Consistency.
5. Visual polish.

The first three outrank aesthetics.

## Engineering principles

- Offline-first means the worker flow must function with zero connectivity.
- Submitted compliance evidence is append-only.
- No silent last-write-wins for compliance data.
- Sync is idempotent and conflict-aware.
- Risk scoring is rule-based before production ML.
- Every compliance-facing score exposes contributing factors.
- Low-confidence OCR requires human review.
- Auditability uses a PostgreSQL SHA-256 hash chain for the MVP.
- Backend starts as a FastAPI modular monolith with explicit domain boundaries.
- AI suggestions assist accountable people; they do not silently decide for them.

## Git behavior

For a task packet, use the branch named in the packet. Commit only task-related work there.

Do not:

- push to or modify the public repository
- rewrite existing commits
- change authorship
- force-push without explicit human approval
- combine unrelated refactors with the task

## Required completion report

When the packet is complete, STOP and return:

1. branch name
2. commits created
3. files created
4. files modified
5. architecture/contracts changed
6. tests run with exact pass/fail result
7. typecheck result
8. lint result
9. production build result
10. accessibility result when UI is affected
11. `git diff --check` result
12. `git status --short` result
13. known limitations
14. cross-module impacts
15. any requirement conflict or decision requiring review

Do not continue into the next packet until the current change is reviewed.
