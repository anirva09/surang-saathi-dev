# Surang Saathi — Development Workflow

## Roles

### ChatGPT / product-engineering lead

Owns product scope, UX consistency, architecture, acceptance criteria, code/design review, QA gate, demo story, and documentation authority.

### Implementation tools

Local coding tools, Google AI Studio, Codex/other agents may be used as accelerators. They are implementation workers, not independent product authorities.

### GitHub

Canonical source of truth. A tool saying “synced” is not proof; the Git commit/diff is reality.

## Feature loop

```text
Define scope + acceptance criteria
        ↓
Create private feature branch
        ↓
Implement bounded task
        ↓
Run tests / typecheck / build / a11y as applicable
        ↓
Review diff + UI + architecture
        ↓
Fix findings
        ↓
APPROVED FOR PRIVATE
        ↓
Merge into rebuild/v1
```

Stable milestones later merge to private `main`. Public promotion is separate.

## Rule for AI tools

Before coding, an implementation agent reads:

1. `PROJECT_BRIEF.md`
2. `docs/DECISIONS.md`
3. `docs/ARCHITECTURE.md`
4. relevant domain doc
5. task-specific acceptance criteria

If a conflict is found, stop rather than inventing a resolution.
