# Product-to-Code Workflow

## Roles

### ChatGPT

Owns:

- product scope and prioritization
- government UX decisions
- architecture and data contracts
- implementation packet creation
- UI/code/diff review
- QA gates
- demo story and judge Q&A
- public-release approval

### Google AI Studio

Owns:

- bounded implementation from the current packet
- focused tests and verification
- reporting exact files/commands/results
- corrections requested after review

It does not independently change product scope or architecture.

### GitHub

Owns:

- canonical repository state
- branches and commit history
- diff/review surface
- automated checks
- releases

## Per-feature loop

1. Select the next backlog item from `docs/BUILD_STATE.md`.
2. ChatGPT validates it against the innovation filter and project brief.
3. ChatGPT creates/updates one implementation packet.
4. Create the feature branch named in the packet from `rebuild/v1`.
5. Google AI Studio implements only the packet.
6. Run packet verification commands.
7. Inspect GitHub/local diff; capture relevant screenshots for UI work.
8. ChatGPT reviews product, government UX, architecture, and QA.
9. Return required corrections to the same branch.
10. When accepted, mark **APPROVED FOR PRIVATE** and merge to `rebuild/v1`.
11. Update `docs/BUILD_STATE.md`.

## Innovation filter

A proposed feature is admitted only when the answer is yes to the important questions:

| Question | Required |
|---|---|
| Solves a real mining/governance problem? | Yes |
| Strengthens the demo or real operating loop? | Yes |
| Buildable within SIH constraints? | Yes |
| Credible in a government/Coal India environment? | Yes |
| Worth its complexity now? | Yes for current phase |

Features that fail are deferred or rejected rather than hidden in the backlog.

## Review format

Every meaningful UI/feature review uses:

- Score /10
- What works
- What feels unrealistic
- What a Government designer would change
- What judges will notice
- Exact improvements

UI review additionally considers the Mine Worker, Safety Officer, Coal India Manager, and SIH Judge separately.
