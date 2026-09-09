# Surang Saathi Documentation Authority

This directory intentionally separates **current implementation authority**, **future planning**, and **historical material**.

## Authority order

1. `../PROJECT_BRIEF.md`
2. `DECISIONS.md`
3. `ARCHITECTURE.md`
4. `MVP_SCOPE.md`
5. `UI_PRINCIPLES.md`
6. `DATA_AND_SYNC.md`
7. `SECURITY_AND_AUDIT.md`
8. `QA_CHECKLIST.md`
9. task packet / GitHub issue / PR description

## Non-authoritative directories

### `future/`

Long-term architecture and capability planning. These files describe how Surang Saathi **may evolve** after the SIH core and pilot evidence exist. They never force complexity into the MVP.

### `archive/`

Original research/specification documents retained for provenance. They may contain legacy naming, estimates, old stack choices, broad feature catalogues, or superseded architectural assumptions. They are not implementation instructions.

## Decision rule

When a future/archive document conflicts with an active document, the active document wins. If two active documents conflict, stop implementation and resolve the conflict explicitly in `DECISIONS.md` before continuing.
