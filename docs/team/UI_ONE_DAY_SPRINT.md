# Frontend — One Day Golden Frame Sprint

**Branch:** `feat/golden-master-enhanced-ui`

## Goal
Deliver a polished, coherent public homepage + operational shell that unmistakably matches the locked Golden Frame and uses the locked logo.

## Phase 0 — Baseline gate
Before edits:
- confirm correct branch
- `npm ci` or the repo-standard install path
- run existing tests
- run lint
- run typecheck if script exists
- run build
- start app and inspect `/`, `/dashboard`, `/hazards`, `/risk`, `/audit`

Do not start visual changes on a broken baseline without reporting it.

## Phase 1 — Logo + typography lock
- replace current/temporary brand mark with `/branding/surang-saathi-logo-locked.png`
- implement strong HTML brand text beside the logo
- apply Noto typography family/tokens
- normalize heading/body/nav/card/data weights
- remove accidental weak/default typography

## Phase 2 — Golden Frame homepage fidelity
- utility strip
- main header
- nav spacing/active treatment
- hero proportions
- hero image integration
- headline sizing/line breaks
- CTA sizing
- stats strip
- five feature cards
- credibility/panorama band
- footer structure

## Phase 3 — Shared portal polish
Without redesigning backend-driven screens:
- make `/dashboard`, `/hazards`, `/hazards/[id]`, `/risk`, `/audit` use the same typography/color/border system
- preserve existing functionality and API integration
- fix obvious inconsistent spacing and status styling

## Phase 4 — Responsive/accessibility
Check:
- 1440 desktop
- 390 mobile
- 360 mobile
- keyboard focus
- visible skip link behavior
- 200% zoom sanity
- no horizontal overflow

## FEATURE FREEZE
After core visual fidelity is achieved, stop adding UI features.
Use remaining time for regression fixes, screenshots, tests and PR polish.

## Final required evidence
- final homepage desktop screenshot
- final homepage mobile screenshot
- dashboard desktop screenshot
- lint result
- test result
- typecheck result if script exists
- build result
- known limitations
