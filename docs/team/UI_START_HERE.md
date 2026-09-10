# Surang Saathi Frontend Milestone — START HERE

**Assigned branch:** `feat/golden-master-enhanced-ui`

This branch is for the UI/frontend teammate only.

## Mission
Bring the current Surang Saathi web experience into high-fidelity alignment with the approved Golden Frame and replace the existing temporary brand mark with the **locked Surang Saathi logo included in this branch**.

This is a **fidelity + polish milestone**, not a redesign.

## Read in this exact order
1. `docs/team/UI_GOLDEN_FRAME_SPEC.md`
2. `docs/team/UI_LOGO_LOCK.md`
3. `docs/team/UI_TYPOGRAPHY_LOCK.md`
4. `docs/team/UI_ASSET_MANIFEST.md`
5. `docs/team/UI_ONE_DAY_SPRINT.md`
6. `docs/team/UI_VALIDATION.md`
7. `docs/team/UI_MASTER_PROMPT.md`
8. `docs/team/UI_PR_HANDOFF.md`

## Visual source of truth
Compare implementation against:

`docs/team/references/approved-golden-frame-homepage.png`

The current implementation reference is:

`docs/team/references/current-implementation-homepage.png`

## Locked logo
The exact approved logo asset is already placed at:

`apps/web/public/branding/surang-saathi-logo-locked.png`

Do not redraw, recolor, replace, regenerate, simplify, or reinterpret it.

## Hard scope boundary
Primary ownership:

`apps/web/`

Do not modify backend implementation under `apps/api/`.
Do not change API contracts to make the frontend easier.
Do not push directly to `main`.
Do not merge your own PR.

## When to give the coding AI the master prompt
Do **not** give the coding AI `UI_MASTER_PROMPT.md` immediately.

First:
1. clone the repository
2. switch to `feat/golden-master-enhanced-ui`
3. install dependencies
4. start the existing web app
5. verify the current homepage and portal render
6. run the baseline frontend tests/lint/build
7. inspect the Golden Frame, logo lock, typography lock, and existing components
8. only then paste `UI_MASTER_PROMPT.md` into the coding agent

This prevents the agent from redesigning before understanding the working baseline.
