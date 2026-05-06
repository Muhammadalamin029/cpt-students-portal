---
name: Midnight Elite
colors:
  surface: '#16130b'
  surface-dim: '#16130b'
  surface-bright: '#3d392f'
  surface-container-lowest: '#110e07'
  surface-container-low: '#1f1b13'
  surface-container: '#231f17'
  surface-container-high: '#2d2a21'
  surface-container-highest: '#38342b'
  on-surface: '#eae1d4'
  on-surface-variant: '#d0c5af'
  inverse-surface: '#eae1d4'
  inverse-on-surface: '#343027'
  outline: '#99907c'
  outline-variant: '#4d4635'
  surface-tint: '#e9c349'
  primary: '#f2ca50'
  on-primary: '#3c2f00'
  primary-container: '#d4af37'
  on-primary-container: '#554300'
  inverse-primary: '#735c00'
  secondary: '#c8c6c5'
  on-secondary: '#313030'
  secondary-container: '#4a4949'
  on-secondary-container: '#bab8b7'
  tertiary: '#bfcdff'
  on-tertiary: '#082b72'
  tertiary-container: '#97b0ff'
  on-tertiary-container: '#254188'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffe088'
  primary-fixed-dim: '#e9c349'
  on-primary-fixed: '#241a00'
  on-primary-fixed-variant: '#574500'
  secondary-fixed: '#e5e2e1'
  secondary-fixed-dim: '#c8c6c5'
  on-secondary-fixed: '#1c1b1b'
  on-secondary-fixed-variant: '#474646'
  tertiary-fixed: '#dbe1ff'
  tertiary-fixed-dim: '#b4c5ff'
  on-tertiary-fixed: '#00174b'
  on-tertiary-fixed-variant: '#27438a'
  background: '#16130b'
  on-background: '#eae1d4'
  surface-variant: '#38342b'
typography:
  h1:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
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
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: '0'
  body-lg:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: 0.01em
  body-md:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: '0'
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1'
    letterSpacing: 0.1em
spacing:
  unit: 8px
  container-max: 1200px
  gutter: 24px
  margin-page: 64px
  section-gap: 80px
  card-padding: 32px
---

## Brand & Style

The design system is engineered to evoke a sense of exclusive prestige and academic authority. It targets the high-achieving student—the "elite"—positioning their data and accomplishments within a digital environment that feels like a private members' club or a high-end luxury portfolio.

The visual style is **Minimalism** with a focus on **High-Contrast**. By stripping away modern trends like neon glows and complex gradients, the system relies on the purity of its palette and the precision of its typography to communicate power. It is a "Quiet Luxury" aesthetic: disciplined, structured, and unapologetically premium.

## Colors

The palette is rooted in absolute blacks and deep charcoals to create an infinite canvas where information feels grounded and permanent. 

- **Primary Background:** Absolute black (#000000) provides a void-like depth, ensuring no light pollution interferes with the content.
- **Surface/Cards:** Dark charcoal (#121212) is used to define containment zones, providing a subtle lift from the background without breaking the dark immersion.
- **Primary Accent:** Warm Gold (#D4AF37) is the "Elite" signature. It must be used with extreme restraint—reserved for borders, iconography, and high-level status indicators to maintain its perceived value.
- **Typography:** Pure white (#FFFFFF) ensures maximum legibility and a crisp, sharp interface.

## Typography

This design system utilizes a dual-sans-serif approach to balance functionality with elegance. 

**Inter** is selected for headings and navigational labels. Its systematic, geometric nature conveys the "Elite" aspect of the system—organized, clear, and powerful. Large headings should use tight letter spacing to appear more "editorial."

**Manrope** is used for body text. Its refined and slightly more open character ensures that long-form student bios or achievement descriptions remain highly readable and sophisticated. Use the `label-caps` style for section headers to evoke a traditional, prestigious feel.

## Layout & Spacing

The layout follows a **Fixed Grid** model centered on the screen to create a focused, portfolio-like experience. A 12-column grid is used for internal card structures, allowing for diverse content types to coexist while maintaining a rigid vertical rhythm.

Generous white space (or "black space") is a core requirement. Elements are never crowded; instead, they are given room to breathe, suggesting that each piece of information is of high importance. Section gaps are intentionally large to facilitate a slow, deliberate scrolling pace that matches the premium brand feel.

## Elevation & Depth

This design system avoids traditional drop shadows and blurs. Depth is achieved through **Tonal Layering** and **Low-Contrast Outlines**.

1.  **Level 0 (Background):** Pure #000000.
2.  **Level 1 (Surface):** Cards and containers use #121212.
3.  **The Gold Stroke:** To separate elite content from the surface, a 1px solid border of #D4AF37 is applied. This creates a "frame" effect, emphasizing that the content within is a prized achievement.

The lack of shadows creates a flat, architectural feel that reinforces the "Elite" student's discipline and clarity of mind.

## Shapes

The design system utilizes **Sharp** edges (0px radius). In the context of an "Elite" profile, sharp corners communicate precision, mathematical accuracy, and a non-compromising attitude. 

Roundness is only permitted for profile avatars—which should be contained within a gold-bordered ring—to provide a single point of organic focus amidst the rigid, powerful geometry of the rest of the interface.

## Components

### Buttons
Primary buttons are styled with a solid #D4AF37 background and #000000 text for maximum visibility. Secondary buttons use a 1px #D4AF37 border with #FFFFFF text. All buttons are rectangular with 0px border radius.

### Cards
Cards use the #121212 surface color. They feature a 1px border. For standard sections, the border should be a subtle dark grey (#2A2A2A); for "Featured" or "Elite" achievements, the border must be #D4AF37.

### Icons
Icons must be flat, minimal line drawings. They are always rendered in #D4AF37. Do not use filled versions unless indicating an active toggle state.

### Input Fields
Fields are transparent with a 1px bottom-border only (white or gold). This "underlined" style mimics high-end stationery and keeps the interface looking clean and uncluttered.

### Profile Ring
The central student avatar must be a circle, encased in a 2px gold ring with a 4px gap (using the background color) between the ring and the image.