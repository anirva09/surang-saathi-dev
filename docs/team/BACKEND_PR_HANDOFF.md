# Backend Pull Request Handoff Template

Use this text in the Pull Request description.

# Surang Saathi — AI-Assisted Safety Backend Milestone

## Scope

Implemented on:

```text
feat/ai-assisted-safety
```

This PR adds:

- [ ] photo attendance
- [ ] PPE assessment
- [ ] hazard-image AI recommendation
- [ ] paper-record OCR draft/review
- [ ] AI/OCR provenance
- [ ] OpenAPI update
- [ ] tests

## Existing Golden Workflow

I verified the existing:

```text
hazard
→ evidence
→ manager workflow
→ corrective action
→ risk
→ audit
```

remains operational.

Evidence:

```text
PASTE FRESH TEST RESULT HERE
```

## New endpoints

List the exact implemented paths and methods:

```text
PASTE EXACT FINAL ENDPOINTS HERE
```

## Database

Migration added:

```text
PASTE MIGRATION FILE NAME HERE
```

New models/tables:

```text
PASTE FINAL MODEL/TABLE NAMES HERE
```

## AI provider

Configured provider:

```text
PASTE PROVIDER NAME HERE
```

Automated tests use:

```text
deterministic provider / fake provider
```

Live demo test result:

```text
PASTE REAL VALIDATION RESULT HERE
```

No API key is committed.

## Human-in-the-loop guarantees

Confirm:

- [ ] PPE result is advisory
- [ ] hazard AI does not silently change hazard severity
- [ ] hazard AI does not silently change lifecycle
- [ ] hazard AI does not directly alter MRI
- [ ] OCR stays draft until confirmation
- [ ] original AI/OCR output is preserved after human review

## Test evidence

Backend:

```text
PASTE `python -m pytest -q` RESULT HERE
```

Docker API build:

```text
PASTE RESULT HERE
```

Health:

```text
PASTE `/health` RESULT HERE
```

Readiness:

```text
PASTE `/ready` RESULT HERE
```

## OpenAPI

`docs/api/openapi.json` regenerated from the final application:

- [ ] yes

Old critical routes retained:

- [ ] yes

## Known limitations

Be explicit:

```text
LIST REAL LIMITATIONS HERE
```

## Security

- [ ] no `.env` committed
- [ ] no API keys committed
- [ ] no provider tokens in logs/tests
- [ ] no MinIO credentials returned by APIs

## Files changed

```text
PASTE `git diff --stat origin/main...HEAD` HERE
```

## Commits

```text
PASTE `git log --oneline origin/main..HEAD` HERE
```

## Reviewer notes

Anything the repository owner must know before merge:

```text
WRITE NOTES HERE
```
