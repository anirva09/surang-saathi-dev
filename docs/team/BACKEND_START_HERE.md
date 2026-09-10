# Backend Milestone — START HERE

This pack is for the teammate implementing the **one-day Surang Saathi backend enhancement milestone**.

## Mission

Add four backend capabilities without destabilising the existing Golden Workflow:

1. Photo attendance
2. PPE/safety-gear assessment from the attendance photo
3. AI-assisted hazard-image risk/priority recommendation
4. Legacy paper-record OCR into a human-reviewable digital draft

The existing hazard → evidence → manager action → corrective action → risk → audit workflow must continue working exactly as before.

## Before the teammate starts

The repository owner must:

1. Push the latest `main`.
2. Add the teammate as a collaborator to the private GitHub repository.
3. Tell the teammate the repository is:
   `https://github.com/anirva09/surang-saathi-dev.git`
4. Tell the teammate they own backend work only.
5. Tell the teammate not to push directly to `main`.

## Read these files in this order

After cloning, the backend teammate must read:

1. `README.md`
2. `docs/PRODUCT_REQUIREMENTS.md`
3. `docs/api/openapi.json`
4. `apps/api/pyproject.toml`
5. `apps/api/app/main.py`
6. `apps/api/app/api/v1/router.py`
7. `apps/api/app/api/v1/schemas.py`
8. existing hazard/evidence/audit/risk services and tests
9. `docs/team/BACKEND_API_TARGET.md`
10. `docs/team/BACKEND_ONE_DAY_SPRINT.md`
11. `docs/team/BACKEND_VALIDATION.md`
12. `docs/team/BACKEND_MASTER_PROMPT.md`

## Exact workflow

Do not paste the AI master prompt before the repository is cloned and the baseline is verified.

Order:

```text
collaborator access
→ clone
→ switch to latest main
→ create backend feature branch
→ start existing stack
→ seed demo data
→ run baseline backend tests
→ confirm working tree is clean
→ only then give the AI agent the master prompt
→ implement task-by-task
→ run milestone validation
→ commit
→ push feature branch
→ open Pull Request into main
→ owner reviews and merges
```

## Branch ownership

Backend teammate branch:

```text
feat/ai-assisted-safety
```

The backend teammate primarily owns:

```text
apps/api/
docs/api/openapi.json
backend tests
```

Root `.env.example` may be edited only to add **empty/configuration-only AI variables**. Never commit an API key.

Do not modify:

```text
apps/web/
README.md
docs/PRODUCT_REQUIREMENTS.md
Claude outputs/
```

unless the repository owner explicitly asks.

## Definition of success

The milestone is accepted only when:

- current backend regression suite still passes
- new tests pass
- photo attendance stores verifiable image evidence
- PPE analysis is advisory and reviewable
- hazard AI analysis does not silently mutate authoritative hazard severity/status
- OCR creates a draft that requires human confirmation
- AI/OCR provenance is persisted
- new endpoints use the existing error-envelope convention
- API JSON remains camelCase
- `docs/api/openapi.json` is regenerated/frozen
- no secret is committed
- Docker runtime still starts
- `/health` and `/ready` still pass
- PR contains implementation notes and validation evidence
