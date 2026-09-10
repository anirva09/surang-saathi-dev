# Frontend Pull Request Handoff Template

PR target: `main`

Branch: `feat/golden-master-enhanced-ui`

## Scope completed
- [ ] locked logo replacement
- [ ] bold header brand lockup
- [ ] typography normalization
- [ ] Golden Frame homepage fidelity pass
- [ ] shared portal visual consistency
- [ ] responsive pass
- [ ] accessibility checks

## Locked logo
Confirm production asset used:

`apps/web/public/branding/surang-saathi-logo-locked.png`

List previous brand asset/components replaced:

```text
PASTE HERE
```

## Golden Frame comparison
Reference:

`docs/team/references/approved-golden-frame-homepage.png`

Attach final 1440px screenshot and explain remaining differences.

## Typography changes
List:
- font families
- weights
- hero scale
- nav scale
- brand lockup scale
- portal typography adjustments

## Validation
Paste fresh results for:

```text
npm test / repo test command
npm run lint
npm run typecheck (if defined)
npm run build
```

## Manual QA
- [ ] `/`
- [ ] `/dashboard`
- [ ] `/hazards`
- [ ] `/hazards/[id]`
- [ ] `/risk`
- [ ] `/audit`
- [ ] 1440px
- [ ] 390px
- [ ] 360px

## Backend safety
- [ ] no API contract changed
- [ ] no backend behavior modified

## Known limitations
```text
PASTE REAL LIMITATIONS HERE
```

## Files changed
```text
PASTE `git diff --stat origin/main...HEAD` HERE
```

## Commits
```text
PASTE `git log --oneline origin/main..HEAD` HERE
```
