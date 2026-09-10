# Surang Saathi — TYPOGRAPHY LOCK

Typography is part of the Golden Frame fidelity milestone. The current UI should be corrected anywhere weights, sizes, line-height, or density feel generic or weak.

## Font families
Preferred:

- English/UI: `Noto Sans`
- Hindi/Devanagari: `Noto Sans Devanagari`

Use robust system sans fallbacks if local font loading is unavailable.

Do not use Inter/Roboto as the visual default if the current build allows the Noto family cleanly.

## Weight system
Use deliberately:
- 400 body
- 500 supporting UI
- 600 controls/subheads
- 700 headings/card titles/brand
- 800 only for hero emphasis when needed

Avoid thin/light typography.

## Brand text beside logo
`Surang Saathi`
- desktop: 18–22px
- weight: 700–800
- compact line-height
- visually strong enough to anchor the header

Supporting line:
`Safer Mines. Stronger Tomorrow.`
- 11–13px
- weight 400–500
- muted color

## Hero
Eyebrow:
- 11–12px
- 600–700
- uppercase
- letter spacing around 0.16–0.22em

Hero H1 desktop:
- approximately 48–58px depending on viewport
- weight 700–800
- line-height about 1.04–1.10
- avoid excessive letter spacing

Hero H1 mobile:
- approximately 34–40px
- maintain strong two-level emphasis

Hero body:
- 16–18px desktop
- 15–16px mobile
- line-height 1.55–1.7
- keep paragraph width similar to Golden Frame

## Section headings
- 22–28px
- weight 700
- compact line-height

## Navigation
- 14–15px
- weight 500–600
- active state should use rust emphasis and/or restrained underline exactly in the Golden Frame spirit

## Stats
Primary number:
- 20–24px
- weight 700
- dark/navy text

Stat label:
- 13–14px
- weight 400–500
- muted slate

## Feature cards
Title:
- 14–16px
- weight 700

Description:
- 13–14px
- weight 400
- line-height 1.45–1.55

## Portal typography
The operational portal must use the same typography family/tokens rather than feeling like another product.
Prioritize data clarity:
- page title 28–32px / 700
- section title 18–22px / 700
- table labels 12–14px / 500–600
- data values 14–16px / 500–700 depending on importance
- status text compact, readable, never tiny

## Rules
- fix inconsistent font weights across buttons/nav/cards
- remove accidental browser-default fonts
- avoid text smaller than 12px for meaningful content
- ensure Devanagari does not fall back to a visually mismatched font
- maintain sufficient contrast against ivory/warm surfaces
- typography must remain responsive and should not clip at 200% zoom
