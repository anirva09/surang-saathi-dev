# Surang Saathi UI — LOCKED GOLDEN FRAME SPEC

## Status
**LOCKED.** The approved government-portal homepage screenshot is the visual source of truth.

The current implementation is structurally close but still visually weaker. The task is to close that fidelity gap without changing the product direction.

## Design character
The product must feel:
- official and institutional
- Government/PSU-style rather than SaaS/startup-style
- warm, restrained and field-grounded
- information-dense but readable
- serious, practical and trustworthy
- slightly raw rather than glossy

Avoid:
- glassmorphism
- neon or vivid app gradients
- fintech blue/purple styling
- pill-heavy layouts
- giant rounded cards
- excessive whitespace
- soft startup illustrations
- floating AI visual effects

## Locked homepage composition
### 1. Government utility strip
Left:
- Government of India / Ministry of Coal identity area matching the Golden Frame composition

Right:
- Skip to main content
- A-
- A
- A+
- English selector
- हिन्दी

Keep it thin, restrained and aligned.

### 2. Main navigation header
Left:
- locked Surang Saathi logo
- adjacent bold brand text block

Center:
- Home
- About
- Features
- For Field Teams
- For Managers
- Resources
- Contact

Right:
- `Login to Portal`

The header must not look like a generic SaaS navbar.

### 3. Hero
Left:
- eyebrow: `A DIGITAL PLATFORM FOR SAFER MINES`
- large headline
- supporting paragraph
- `Get Started`
- `Know More`

Right:
- mine worker / mine setting hero image composition matching the Golden Frame
- right-side contextual safety messaging and India-map treatment when the approved visual contains it

### 4. Stats strip
Desktop structure: five aligned cells.
- four KPI cells
- one supporting information cell

Do not over-round the container.

### 5. Key Features
- title left
- `Explore All Features` right
- five feature cards
- icon containers should use the restrained ochre/rust/olive/dark-blue family from the approved frame

### 6. Mining credibility band
- panoramic mine photo
- quote / statement area
- right-side CTA

### 7. Footer
Match the Golden Frame balance:
- institutional identity left
- text navigation center
- supporting mark/social area right

## Locked palette
Use these as the primary tokens unless an existing token is already visually equivalent:

- page background: `#F7F3EA`
- utility background: `#F5EFE3`
- surface: `#FAF6EF`
- strong surface: `#FEFCF8`
- primary rust: `#8F3E21`
- primary rust hover: `#7A3419`
- ochre accent: `#C58729`
- main text: `#1C2530`
- muted text: `#5B6570`
- stat/navy: `#1C2F49`
- muted institutional green: `#515C40`
- danger/risk rust: `#C6472D`
- border: `#D8CCBA`
- soft border: `#E7DECF`

Do not replace this with brighter tricolor colors across the interface. The locked logo can contain stronger tricolor cues; the UI shell remains subdued.

## Geometry
- content max-width target: roughly 1280–1360px depending on current implementation
- border radius: primarily 2–4px
- buttons: compact rectangular government-portal style
- borders: 1px restrained warm neutral
- shadows: minimal; do not use modern floating-card shadows
- vertical rhythm: tighter than a SaaS marketing page

## Image treatment
- no fake placeholder panel in final homepage
- hero image should feel integrated into the page rather than dropped into a generic card
- preserve realistic mining context
- bottom panoramic mine image should remain wide and editorial

## Responsive targets
Required manual checks:
- 1440px desktop
- 390px mobile
- 360px mobile

On mobile, preserve hierarchy and legibility rather than trying to preserve every desktop arrangement literally.
