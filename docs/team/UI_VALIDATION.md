# Frontend Golden Frame — Validation Checklist

No completion claim without fresh evidence.

## Git
- [ ] branch is `feat/golden-master-enhanced-ui`
- [ ] no direct `main` changes
- [ ] no unrelated backend modifications
- [ ] `git diff --check` clean

## Logo
- [ ] exact asset `/branding/surang-saathi-logo-locked.png` is used
- [ ] legacy/temporary main logo no longer appears in primary brand locations
- [ ] logo is not distorted
- [ ] bold HTML `Surang Saathi` brand text sits beside/with the logo where the header layout calls for it
- [ ] logo has meaningful alt text

## Typography
- [ ] Noto Sans / Noto Sans Devanagari or approved equivalent is consistently applied
- [ ] hero has strong 700–800 weight hierarchy
- [ ] header brand name is bold
- [ ] nav is compact 500–600 weight
- [ ] card titles use consistent bold hierarchy
- [ ] meaningful text is not microscopically small
- [ ] Hindi rendering does not use mismatched fallback when language is switched

## Golden Frame fidelity
- [ ] utility strip composition matches target
- [ ] main header proportions match target
- [ ] hero split/composition matches target
- [ ] no placeholder hero box remains
- [ ] stats strip resembles approved target
- [ ] feature-card density/icon treatment matches target
- [ ] mining credibility band is present and balanced
- [ ] footer matches the approved composition closely
- [ ] page reads as government/PSU product, not generic SaaS

## Palette/geometry
- [ ] warm ivory base retained
- [ ] rust/ochre/slate/olive tokens match lock
- [ ] excessive bright tricolor usage is avoided outside the logo/approved marks
- [ ] corners remain restrained
- [ ] shadows remain subtle
- [ ] no glassmorphism/neon/modern floating cards

## Product behavior
- [ ] English remains default
- [ ] Hindi appears only after explicit language selection
- [ ] `Login to Portal` reaches the working portal path
- [ ] backend-driven screens still load through existing integration
- [ ] prototype/live-data wording remains truthful

## Responsive
- [ ] 1440px checked
- [ ] 390px checked
- [ ] 360px checked
- [ ] no horizontal overflow
- [ ] header/nav behaves deliberately on mobile

## Commands
Use the scripts defined by the repo/package files. At minimum:
- [ ] tests pass
- [ ] lint passes
- [ ] typecheck passes if available
- [ ] production build passes

## PR evidence
- [ ] before/current screenshot referenced
- [ ] after desktop screenshot attached
- [ ] after mobile screenshot attached
- [ ] exact files changed listed
- [ ] remaining deviations from Golden Frame disclosed
