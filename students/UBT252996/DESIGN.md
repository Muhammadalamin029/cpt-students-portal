---
name: Prestige Profile
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#393939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#d0c5af'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#99907c'
  outline-variant: '#4d4635'
  surface-tint: '#e9c349'
  primary: '#f2ca50'
  on-primary: '#3c2f00'
  primary-container: '#d4af37'
  on-primary-container: '#554300'
  inverse-primary: '#735c00'
  secondary: '#c6c6c7'
  on-secondary: '#2f3131'
  secondary-container: '#454747'
  on-secondary-container: '#b4b5b5'
  tertiary: '#d0cdcd'
  on-tertiary: '#303030'
  tertiary-container: '#b4b2b2'
  on-tertiary-container: '#454544'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffe088'
  primary-fixed-dim: '#e9c349'
  on-primary-fixed: '#241a00'
  on-primary-fixed-variant: '#574500'
  secondary-fixed: '#e2e2e2'
  secondary-fixed-dim: '#c6c6c7'
  on-secondary-fixed: '#1a1c1c'
  on-secondary-fixed-variant: '#454747'
  tertiary-fixed: '#e5e2e1'
  tertiary-fixed-dim: '#c8c6c5'
  on-tertiary-fixed: '#1b1b1c'
  on-tertiary-fixed-variant: '#474746'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
typography:
  h1:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  h2:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  h3:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.0'
    letterSpacing: 0.1em
spacing:
  base-unit: 8px
  container-max-width: 1100px
  gutter: 24px
  section-padding: 80px
  card-padding: 32px
---

## Brand & Style

The design system is engineered to project authority, academic excellence, and professional maturity. It utilizes a **High-Contrast Minimalist** aesthetic that draws inspiration from luxury editorial design and premium fintech interfaces. 

The personality is uncompromising and elite, focusing on clear information hierarchy and "power" layouts that emphasize achievements. By stripping away decorative fluff and relying on precise alignment and a restricted color palette, the system ensures the student's profile feels established and significant rather than merely "academic."

## Colors

The palette is strictly limited to maintain a high-end, authoritative feel.
- **Base Surface:** The background uses a deep charcoal (#121212) to reduce eye strain while maintaining a void-like depth.
- **Primary Accent:** Gold (#D4AF37) is used sparingly for highlights, status indicators, and primary call-to-actions to signify "premium" value.
- **Content:** Pure white (#FFFFFF) is reserved for primary typography to ensure maximum legibility and a striking "ink on black" effect.
- **Secondary Surface:** A slightly lighter charcoal (#1E1E1E) is used for card containers to provide depth without breaking the high-contrast aesthetic.

## Typography

The design system utilizes **Inter** exclusively to leverage its systematic, utilitarian, and modern architectural qualities. 

Headings are set with heavy weights (Bold/ExtraBold) and tighter letter-spacing to create a "locked-in" editorial look. Body text remains spacious with a generous line height for readability. Small labels and metadata are set in all-caps with increased letter-spacing to serve as structural anchors for sections, mimicking the style of high-end certificates or architectural plans.

## Layout & Spacing

The layout follows a **Fixed Grid** model centered on the screen, creating a focused "dossier" feel. 
- **The Core:** Content is organized into a 12-column system within a maximum width of 1100px.
- **Rhythm:** An 8px base unit governs all dimensions. High-level sections are separated by significant vertical whitespace (80px+) to allow the profile to "breathe" and feel prestigious.
- **The Card Grid:** Biodata tiles should be arranged in a modular grid, typically spanning 4 or 6 columns depending on content density.

## Elevation & Depth

To maintain a "flat-premium" aesthetic, the design system avoids heavy shadows. Depth is instead communicated through:
- **Tonal Stepping:** The background is #121212; cards and interactive tiles are #1E1E1E.
- **Ghost Borders:** Elements are defined by 1px solid borders in a low-opacity white (rgba(255, 255, 255, 0.1)) or a thin Gold (#D4AF37) stroke for highlighted items.
- **Active States:** Subtle 2px solid gold borders are used to indicate focus or selection, providing a sharp, "machined" look rather than a fuzzy shadow effect.

## Shapes

The design system adopts a **Sharp (0px)** roundedness strategy. Every corner is a crisp 90-degree angle. This evokes the feeling of a professional portfolio, architectural blueprints, and high-end certificates. The absence of curves reinforces the authoritative, serious, and precise nature of the student profile.

## Components

### Buttons
- **Primary:** Solid Gold (#D4AF37) background with black (#121212) Bold Inter text. No rounded corners.
- **Secondary:** Transparent background with a 1px white border and white text.

### Cards & Tiles
- **Standard Tile:** Background of #1E1E1E with a subtle 1px border (#2A2A2A). Use for education details and experience.
- **Featured Tile:** Same as standard, but with a top-border accent of 4px Gold. Use for key achievements or "Dean's List" status.

### Icons
- Use **Line Icons** (2px stroke) in pure white. Icons must be geometric and minimal. Avoid filled or "playful" icon styles.

### Input Fields
- Underlined style only. 1px white bottom border that turns 2px Gold on focus. Label is always "Label-Caps" style positioned above the input.

### Progress Bars (Skills)
- A thin 2px grey track with a solid Gold fill. No rounded ends. The percentage label should be positioned at the top right in "Label-Caps."