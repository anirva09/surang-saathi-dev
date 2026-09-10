# Surang Saathi — LOCKED LOGO SPEC

## Status
**LOCKED AND APPROVED.**

Use exactly:

`apps/web/public/branding/surang-saathi-logo-locked.png`

## Replacement rule
Replace the existing temporary/legacy Surang Saathi logo wherever the primary product brand mark is shown in the web application.

Do not:
- redraw it
- regenerate it with AI
- change colors
- crop away meaningful parts
- replace it with an icon library symbol
- swap it for the earlier brown mountain placeholder
- add another competing Surang Saathi logo

## Header usage
The Golden Frame header should use the locked logo on the left.

Beside the logo, retain a **real HTML text brand block** for clarity/accessibility:

- `Surang Saathi` — bold, strong and clearly readable
- `Safer Mines. Stronger Tomorrow.` — smaller supporting line when space permits

Do not rely only on text baked into the image for interface typography.

### Suggested desktop header sizing
- logo visual height: approximately 48–58px, tuned to match Golden Frame proportions
- gap between logo and HTML brand text: approximately 10–14px
- `Surang Saathi`: 18–22px, weight 700–800
- tagline: 11–13px, weight 400–500, muted rust/slate

### Mobile
- logo visual height: approximately 36–44px
- brand name can reduce to 16–18px
- tagline may be hidden only if space genuinely requires it

## Image quality
Use the supplied file as source-of-truth. Do not stretch disproportionately.
Use CSS `object-fit: contain` where appropriate.

## Accessibility
Use meaningful `alt` text such as:

`Surang Saathi mine safety logo`

The adjacent HTML brand name must remain selectable text.
