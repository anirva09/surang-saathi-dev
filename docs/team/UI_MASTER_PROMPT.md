# MASTER PROMPT — Surang Saathi Golden Frame Frontend Milestone

You are the **Lead Government UX Engineer, Design-System Owner, Accessibility Reviewer and Senior Next.js Frontend Engineer** for **Surang Saathi**.

This is an existing working SIH 2026 project. You are not creating a new website and you are not free to redesign the visual direction.

Your assignment is to make the frontend **match the locked Golden Frame much more closely**, replace the temporary brand mark with the supplied locked logo, correct typography throughout the UI, preserve backend integration, and return a polished PR-ready branch.

---

## 0. Branch and repository discipline

Required branch:

`feat/golden-master-enhanced-ui`

Before touching files:
1. confirm `git branch --show-current`
2. inspect `git status --short`
3. inspect relevant existing components/styles/tests
4. run the baseline frontend tests/lint/typecheck/build using scripts that actually exist
5. start the app and inspect current `/`, `/dashboard`, `/hazards`, `/hazards/[id]`, `/risk`, `/audit`

Do not push to `main`.
Do not merge.
Do not modify `apps/api/`.
Do not change API/OpenAPI contracts.
Do not delete tests merely to make the milestone pass.

---

## 1. Read these files completely

- `docs/team/UI_GOLDEN_FRAME_SPEC.md`
- `docs/team/UI_LOGO_LOCK.md`
- `docs/team/UI_TYPOGRAPHY_LOCK.md`
- `docs/team/UI_ASSET_MANIFEST.md`
- `docs/team/UI_ONE_DAY_SPRINT.md`
- `docs/team/UI_VALIDATION.md`
- `docs/team/references/approved-golden-frame-homepage.png`
- `docs/team/references/current-implementation-homepage.png`

Then inspect the actual frontend structure under `apps/web/` before proposing changes.

The approved Golden Frame is the visual source of truth.

---

## 2. THIS IS NOT A REDESIGN

Do not invent a new layout.
Do not modernize it into a generic SaaS page.
Do not replace the palette.
Do not add glassmorphism, vivid gradients, oversized rounded cards, neon AI visual effects or startup illustration language.

The desired character is:

**Government/PSU mine-safety portal — restrained, institutional, practical, warm, serious, human and field-grounded.**

---

## 3. LOCKED LOGO — mandatory replacement

Use the exact provided asset:

`apps/web/public/branding/surang-saathi-logo-locked.png`

Public URL:

`/branding/surang-saathi-logo-locked.png`

Replace the existing temporary/legacy Surang Saathi primary logo with this supplied asset in the public header and any shared primary brand location where the current Surang Saathi logo appears.

Never:
- redraw it
- recolor it
- regenerate it
- replace it with a Lucide/icon-library mark
- continue using the old brown mountain placeholder as the main brand

### Header lockup
The main header must contain:
1. the locked logo
2. a separate real HTML brand text block beside it

Brand text:

`Surang Saathi`

It must be **bold** and visually confident, approximately 18–22px desktop, 700–800 weight.

Supporting tagline when space permits:

`Safer Mines. Stronger Tomorrow.`

Approximately 11–13px, 400–500 weight.

The brand text must remain HTML, not only text baked into an image.

Use meaningful image alt text.

---

## 4. TYPOGRAPHY FIX — mandatory across public site and portal

Typography is currently part of the polish gap. Normalize it deliberately.

Preferred families:
- English/UI: `Noto Sans`
- Hindi/Devanagari: `Noto Sans Devanagari`

Use existing font-loading infrastructure if available. Do not introduce brittle font hacks.

### Weight hierarchy
- body: 400
- supporting UI: 500
- nav/controls: 500–600
- section/card headings: 700
- hero/brand emphasis: 700–800

Do not use thin typography.

### Golden Frame type scale target
Eyebrow:
- 11–12px
- 600–700
- uppercase
- spaced lettering

Hero H1 desktop:
- about 48–58px
- 700–800
- line-height about 1.04–1.10

Hero H1 mobile:
- about 34–40px

Hero body:
- 16–18px desktop
- 15–16px mobile
- generous readable line height

Section headings:
- 22–28px / 700

Nav:
- 14–15px / 500–600

Stat values:
- 20–24px / 700

Feature titles:
- 14–16px / 700

Feature descriptions:
- 13–14px / 400

Operational portal:
- page title 28–32px / 700
- section title 18–22px / 700
- table/metadata 12–14px / 500–600
- primary values 14–16px / 500–700

Correct accidental browser-default fonts, inconsistent weights and visually weak labels wherever found.

Do not place meaningful text below 12px.

---

## 5. LOCKED PALETTE

Use the subdued Golden Frame palette, not bright tricolor UI chrome:

- `#F7F3EA` background
- `#F5EFE3` utility background
- `#FAF6EF` surface
- `#FEFCF8` strong surface
- `#8F3E21` primary rust
- `#7A3419` primary hover
- `#C58729` ochre
- `#1C2530` main text
- `#5B6570` muted text
- `#1C2F49` navy/stat text
- `#515C40` muted institutional green
- `#C6472D` danger/risk rust
- `#D8CCBA` border
- `#E7DECF` soft border

The logo may carry stronger tricolor cues. The surrounding application must stay dull, warm and institutional.

---

## 6. Homepage fidelity tasks

Match the reference composition closely.

### Government utility strip
Replicate the approved proportions and alignment:
- institutional identity block left
- accessibility/language utilities right

Do not increase its height unnecessarily.

### Main header
Fix:
- locked logo integration
- bold Surang Saathi brand text
- tagline
- nav spacing
- active underline/state
- Login to Portal CTA
- vertical alignment

### Hero
Fix:
- text width
- headline line breaks
- headline emphasis
- paragraph width
- CTA dimensions/gaps
- hero media positioning
- right-side context treatment
- overall height and split ratio

Remove placeholder-looking hero presentation.

### Stats strip
Match:
- five-cell desktop composition
- icon sizes
- number typography
- separators
- border/radius treatment
- supporting note cell

Any prototype metrics must remain clearly truthful/illustrative unless backed by live data.

### Feature cards
Match:
- five-card desktop grid
- compact height
- icon boxes
- bold titles
- description density
- warm borders/surfaces

### Credibility band
Match:
- panoramic mine image
- quote area
- CTA
- spacing and proportions

### Footer
Match the Golden Frame balance closely:
- institutional identity left
- navigation center
- supporting mark/social area right

Use existing approved project assets for government/Digital India marks where available. Do not fabricate new endorsement claims.

---

## 7. Operational portal consistency

After homepage fidelity is solid, apply the same locked visual system to:

- `/dashboard`
- `/hazards`
- `/hazards/[id]`
- `/risk`
- `/audit`

Do not redesign workflows or fake missing backend data.

Improve only presentation consistency:
- typography
- header/shell
- page spacing
- cards
- tables
- status hierarchy
- borders
- button styling
- loading/error/empty states

The public site and portal must feel like one product.

---

## 8. Language behavior

English remains default.

Hindi appears only after explicit language selection.

Do not create mixed Hindi/English UI by default.

Ensure Devanagari uses compatible typography when selected.

---

## 9. Responsive and accessibility targets

Manually verify:
- 1440px desktop
- 390px mobile
- 360px mobile

Requirements:
- no horizontal overflow
- deliberate mobile header/nav behavior
- visible focus states
- usable keyboard navigation
- useful alt text
- skip-link functionality
- adequate contrast
- layout remains usable at 200% browser zoom

---

## 10. Implementation discipline

Prefer targeted reuse/refactoring of existing components.

Do not rewrite the entire frontend merely for cleanliness.

If changing design-system tokens, ensure every impacted operational page still works.

Do not add dependencies unless clearly necessary.

Do not use fake placeholder images in final visual paths.

Do not modify the backend.

---

## 11. Validation before completion

Use `docs/team/UI_VALIDATION.md` as a hard gate.

Run fresh validation after final changes:
- tests
- lint
- typecheck if available
- production build

Then manually check the required routes and viewport sizes.

Capture final screenshots.

Do not claim completion based only on code generation or a dev-server render.

---

## 12. Git / PR discipline

Work only on:

`feat/golden-master-enhanced-ui`

Commit coherent milestones.

Suggested commit progression:

- `feat(web): lock Surang Saathi brand and typography`
- `feat(web): match homepage Golden Frame`
- `feat(web): unify portal visual system`
- `test(web): validate Golden Frame frontend milestone`

Before push inspect:
- `git status --short`
- `git diff --check`
- `git diff --stat origin/main...HEAD`

Push only your feature branch.

Open PR into `main`.

Use `docs/team/UI_PR_HANDOFF.md` for the PR report.

---

## 13. Definition of done

The owner should be able to place the final 1440px homepage beside:

`docs/team/references/approved-golden-frame-homepage.png`

and immediately recognize the same locked design system, composition, typography, colors, imagery treatment and institutional character.

The new locked logo must be present.
The bold `Surang Saathi` brand text must be present beside/with it.
The public website and portal must feel visually unified.
All existing frontend behavior must remain intact.

Stop once the locked fidelity milestone is implemented, verified and PR-ready.
