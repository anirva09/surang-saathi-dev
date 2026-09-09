# Surang Saathi — Government UX Principles

## 1. Design objective

The interface should feel like a trusted operational instrument used by mine workers and officials, not a technology demo.

Inspired by:

- geological survey sheets
- engineering field notebooks
- DGMS-style inspection forms
- government service portals

Avoid:

- glassmorphism
- neon/futuristic AI styling
- decorative gradients
- startup KPI-card overload
- excessive rounded corners
- chatbot-first IA

## 2. Locked colors

| Token | Hex |
|---|---|
| Background | `#F7F3EA` |
| Surface | `#FFFDF8` |
| Primary | `#8C4A2F` |
| Accent | `#D4A72C` |
| Success | `#4F5D4A` |
| Danger | `#C6472D` |
| Text | `#2F3A44` |
| Border | `#D8CCBA` |

Derived colors may be added for accessibility/state nuance, but must not replace these semantic anchors.

## 3. Information hierarchy by role

### Mine worker

Immediate questions:

1. What do I need to record?
2. Can I do it without network?
3. Did my evidence save?
4. What is queued/synced/conflicted?

Keep worker screens simple and touch-first.

### Safety officer / manager

Immediate questions:

1. What is unsafe?
2. What needs my action?
3. Who owns it?
4. What is overdue/escalated?
5. What evidence supports the claim?

### Corporate / auditor

Immediate questions:

1. What changed across mines?
2. Where are recurring risks/compliance gaps?
3. Can I verify the audit trail/dossier?

## 4. Field typography and targets

Worker-facing minimums:

- body/value: 14 px or larger
- labels: 12 px or larger
- help/error: 12 px or larger
- large primary field action: 48 px target
- standard mobile control: 40 px or larger
- radio/checkbox row: 48 px hit area

32 px controls are dense desktop utilities only.

## 5. Status semantics

Critical state is always:

```text
icon + explicit wording + semantic color
```

Color alone is insufficient.

### Sync vocabulary

- `QUEUED`
- `SYNCING`
- `SYNCED`
- `CONFLICT`
- `OFFLINE`

Offline is normal operating context, not generic danger.

### Geofence evidence

Keep separate:

- `LOCAL_VALID`
- `SERVER_PENDING`
- `SERVER_VERIFIED`
- `OUTSIDE_GEOFENCE`
- `CONFLICT`

Never collapse local and server verification into one generic “Verified.”

## 6. AI accountability

- AI suggestion is visually labeled as a suggestion.
- It never silently preselects worker severity.
- OCR confidence is visible; low confidence requires human review.
- Risk scores always show factors.

## 7. Button semantics

- **Primary:** normal progression
- **Secondary:** lower-priority action
- **Ghost:** utility / save draft
- **Commit:** creates permanent or ledger-relevant state
- **Danger:** destructive action

Commit and Danger are distinct. Permanent actions use consequence-aware confirmation copy.

Example:

> **Submit this inspection?** After submission, this becomes part of the permanent compliance record. Corrections will be recorded as new entries.

## 8. Accessibility

Verify:

- WCAG AA contrast
- keyboard/focus on web
- accessible names
- label/error association
- no 360 px horizontal overflow
- touch-target rules
- disabled-state clarity
- Hindi/Devanagari glyph line-height/clipping
- no critical information encoded only by color or icon

Web reference widths: 360, 768, 1440 px.
