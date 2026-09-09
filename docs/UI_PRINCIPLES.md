# Surang Saathi — UI Principles

## 1. Product character

The interface should feel like a credible government engineering system used in and around coal mines: calm, practical, accountable, and field-ready.

Visual references:

- geological survey sheets
- engineering field notebooks
- DGMS inspection forms
- government service portals

Avoid:

- glassmorphism
- neon or decorative gradients
- futuristic AI styling
- generic startup dashboards
- decorative 3D
- excessive rounded cards
- soft shadow stacks used as primary structure
- animation that competes with operational status

## 2. Locked core palette

These eight tokens never drift between screens:

| Token | Hex | Role |
|---|---|---|
| Background | `#F7F3EA` | application canvas; warm paper |
| Surface | `#FFFDF8` | forms, cards, tables, panels |
| Primary | `#8C4A2F` | primary actions, active navigation |
| Accent | `#D4A72C` | attention, pending, warnings |
| Success | `#4F5D4A` | resolved, synced, verified |
| Danger | `#C6472D` | destructive actions, conflict, critical failure |
| Text | `#2F3A44` | primary ink |
| Border | `#D8CCBA` | form/table boundaries and hairlines |

Derived tones are allowed only when they preserve contrast and clearly map back to a locked semantic color.

## 3. Surface language

- Default surfaces are flat.
- Structure comes from 1 px borders, section rules, alignment, and spacing.
- Corners remain near-square; avoid rounded startup-card aesthetics.
- Shadows are reserved for overlays such as dialogs, dropdowns, or popovers, not normal cards.
- Spacing uses a 4 px base grid.

## 4. Field typography

Worker/field surfaces:

- body and field values: **14 px minimum**
- field labels: **12 px minimum**
- help/error text: **12 px minimum**
- critical state/decision copy must not be relegated to tiny metadata

Typography below 12 px is for dense desktop metadata only, never for information a mine worker needs to act on.

Hindi/Devanagari line height must be visually checked for clipping. Bengali and Odia localization architecture must not be blocked by hard-coded Latin assumptions.

## 5. Touch targets

Field/mobile:

- primary large action: **48 px minimum height**
- normal mobile control: **40 px minimum height**
- radio/checkbox/choice row hit area: **48 px minimum**
- 32 px controls: desktop dense-table actions only

Controls are designed for gloved or one-handed use and poor underground lighting.

## 6. Bilingual and low-literacy behavior

- Field controls own both the primary label and translated/co-label contract.
- Translation is not an afterthought added independently screen by screen.
- Voice affordances appear where text entry is expected on field surfaces.
- Icons never replace critical wording by themselves.
- Language architecture supports Hindi, Bengali, Odia, and English from day one.

## 7. Button semantics

### Primary

Normal progression, e.g. `New inspection`, `Assign action`.

### Secondary

Lower-emphasis action, e.g. `Export register`.

### Ghost

Low-emphasis utility, e.g. `Save draft`.

### Commit

Creates permanent/ledger-relevant state, e.g. `Submit inspection`, `Approve sign-off`, `Close corrective action`.

### Danger

Destructive action, e.g. `Discard draft`.

**Commit and Danger are never interchangeable.** Permanent actions use consequence-aware confirmation copy, not merely “Are you sure?”.

## 8. Status semantics

Operational state never depends on color alone. Use:

```text
icon + explicit wording + semantic color
```

Central vocabularies must cover at least:

### Sync

`QUEUED`, `SYNCING`, `SYNCED`, `CONFLICT`, `OFFLINE`

Offline is expected operating context, not a generic error.

### Geofence evidence

Keep distinct:

- local/device validation
- authoritative server verification
- server verification pending
- outside geofence
- conflict/reconciliation state where needed

Never collapse local validation and server verification into one generic “Verified” badge.

### Violation lifecycle

`OPEN → ACKNOWLEDGED → OVERDUE → ESCALATED → RESOLVED`

## 9. AI accountability

- AI severity suggestion is marked as a suggestion and never preselects the worker answer.
- `workerSelectedSeverity` and `aiSuggestedSeverity` remain distinct values.
- A Mine Risk Index component/API response requires contributing factors.
- AI/OCR uncertainty is visible rather than hidden behind a confident visual treatment.
- No opaque model output appears on compliance-facing screens.

## 10. Evidence components

Inspection/hazard records should make accountability evidence easy to defend:

- lifecycle state
- sync state
- geofence evidence/source
- inspector/reporter identity
- timestamp
- media/evidence count
- ledger reference when applicable

Worker cards may be simpler than manager cards. Do not import desktop density into underground workflows.

## 11. Accessibility

For UI work, verify at minimum:

- WCAG AA text/control contrast
- visible keyboard focus on web
- accessible names for icon-only controls
- labels associated with inputs
- error/help text wired with `aria-describedby` where applicable
- no horizontal overflow at 360 px
- worker touch targets meet the size rules above
- disabled states are distinguishable without relying only on opacity
- Hindi/Devanagari glyphs are not clipped

Target viewports for web checks: **360 px, 768 px, 1440 px**.
