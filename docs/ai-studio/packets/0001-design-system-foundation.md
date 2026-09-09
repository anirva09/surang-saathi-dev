# Packet 0001 — Design System Foundation

**Status:** READY
**Base branch:** `rebuild/v1`
**Work branch:** `feat/design-system-foundation`

## Objective

Create the minimal real Next.js design-system foundation that encodes Surang Saathi's locked government/field visual and semantic rules without building product screens.

## Read first

- `PROJECT_BRIEF.md` §6.2 and relevant screen structures
- `docs/DECISIONS.md`
- `docs/UI_PRINCIPLES.md`
- `docs/ARCHITECTURE.md`
- `docs/reference/ui/README.md`

The screenshots under `docs/reference/ui/` are visual-direction references only. Do not recover or imitate prior source-code structure from them.

## Allowed scope

Create a Next.js/React/TypeScript web application under:

```text
apps/web/
```

Use the current stable Next.js scaffold with App Router and an exact lockfile. Tailwind CSS is acceptable for the token/utilities layer. Keep dependencies minimal.

Allowed implementation areas:

```text
apps/web/app/
apps/web/components/ui/
apps/web/components/domain/
apps/web/lib/
apps/web/tests/ or colocated test files
apps/web/package.json
apps/web lock/config files
```

Root files may be changed only when necessary for workspace scripts or ignore rules.

## Do not touch

- Flutter/mobile implementation
- FastAPI/backend implementation
- Docker infrastructure unless a web-only need is proven first
- production auth
- API business logic
- manager dashboard pages
- GIS
- OCR/STT/ML
- public repository

## Required design tokens

The following values are exact and locked:

```text
background #F7F3EA
surface    #FFFDF8
primary    #8C4A2F
accent     #D4A72C
success    #4F5D4A
danger     #C6472D
text       #2F3A44
border     #D8CCBA
```

Derived tones may be added only with clear semantic names and WCAG-aware contrast.

Use a 4 px spacing base. Default surfaces are flat with hairline structure and near-square corners.

## Required component contracts

Create a small, coherent set rather than dozens of speculative components.

### `Button`

Variants:

```text
primary
secondary
ghost
commit
danger
link
```

Sizes:

```text
lg = 48px field primary
md = 40px default
sm = 32px desktop-dense only
```

`commit` and `danger` must remain visually/semantically distinct.

### `Field`

Owns:

- label
- optional translated/co-label
- required marker
- hint
- error
- control IDs / `aria-describedby`

No unlabeled/bare field usage in product forms.

### `ChoiceRow`

Large click/touch row for radio/checkbox choices. Mobile hit target >= 48 px.

### `StatusBadge`

Central semantic status renderer. Operational status uses icon/wording/color, never color alone.

### `SyncStatus`

Support exactly these worker-visible concepts:

```text
QUEUED
SYNCING
SYNCED
CONFLICT
OFFLINE
```

Offline is calm expected context, not generic danger.

### `GeofenceProof`

Must distinguish local/device validation from authoritative server validation. Support at least:

```text
LOCAL_VALID
SERVER_PENDING
SERVER_VERIFIED
OUTSIDE_GEOFENCE
CONFLICT
```

### `SeveritySelector`

Represent worker selection and optional AI suggestion separately. An AI suggestion must never preselect the worker value.

### `RiskIndexMeter`

A bare risk score is invalid. The public TypeScript API must require `contributingFactors` with factor name, weight, and current value.

### `InspectionCard`

One domain reference card demonstrating lifecycle state, sync state, geofence verdict/evidence source, actor/time, and evidence count. Keep worker and desktop density concerns explicit; do not make it a dashboard.

## Reference route

Create:

```text
/design-system
```

The route renders the real components from the real token layer. It should document:

- foundations/tokens
- typography/spacing/surface rules
- buttons
- fields
- selection controls
- statuses/sync
- geofence proof
- severity selection
- explainable MRI
- inspection card

This route is a development reference, not a manager portal.

## UX requirements

- No glassmorphism, gradients, neon, futuristic AI visual treatment, or startup-dashboard styling.
- Field body/value text >= 14 px.
- Field labels/help/errors >= 12 px.
- Mobile control sizes follow `docs/UI_PRINCIPLES.md`.
- Ensure Hindi/Devanagari examples have safe line-height.
- Important statuses include explicit wording/icons in addition to color.
- Permanent actions use a reusable consequence-aware confirmation pattern or a clearly defined component contract for it.

## Required tests

Protect behavior, not screenshots:

1. `StatusBadge` resolves every declared state and fails explicitly on unsupported state.
2. `RiskIndexMeter` requires contributing factors at TypeScript compile time; runtime render shows them.
3. `SeveritySelector` renders AI suggestion without changing worker-selected value.
4. `GeofenceProof` renders local validity separately from server verification.
5. `SyncStatus` presents all five states distinctly and does not mark OFFLINE as danger by default.
6. `Button` keeps commit and danger variants semantically distinct.
7. `Field` correctly associates label, hint, and error semantics.

## Accessibility verification

Use an automated accessibility tool appropriate to the chosen test/e2e stack and verify the reference page at:

```text
360px
768px
1440px
```

Required checks:

- WCAG AA contrast for normal text/controls
- accessible names
- visible focus
- keyboard access
- no horizontal overflow at 360 px
- worker touch-target rules
- field label/error associations
- Hindi glyph clipping/line-height by visual check

The automated accessibility command must exit non-zero on detected violations.

## Verification

Use exact scripts defined in `apps/web/package.json`; at minimum the task must provide and run equivalents of:

```text
test
typecheck
lint
build
a11y
```

Also run from repository root:

```bash
python scripts/verify-governance.py
git diff --check
git status --short
```

Report exact command outputs/pass counts.

## Commit guidance

Prefer reviewable commits such as:

```text
chore(web): scaffold design-system workspace
feat(web): add Surang Saathi tokens and control primitives
feat(web): add evidence and status components
test(web): add semantic and accessibility regressions
docs(web): add live design-system reference
```

Do not create fake extra commits if the implementation naturally fits fewer coherent changes.

## Stop condition

STOP when the design-system reference route and required tests/checks pass.

Do not begin:

- manager dashboard
- data/mock repository layer for product screens
- backend foundation
- Flutter app
- Golden Workflow screens

Return the structured implementation report for review.
