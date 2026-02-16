# Phase 01 — AppShell + Navbar (Baseline)

## Goal
Fix the global frame so all next phases inherit the same visual language:
- cosmic dark background with depth
- sticky glass navbar
- neon mint divider line
- consistent width rhythm (`1320px`)
- mobile navbar behavior (`< 940px` hides links)

## Scope
This phase only covers:
- `Layout.tsx` + `Layout.css`
- `Navbar.tsx` + `Navbar.css`

Do not implement search/cards/pagination visuals here.

## Reference intent
The top area should read as:
- dark sci-fi canvas (not flat black)
- soft cyan/teal light blooms
- subtle star/grid texture
- glass strip navbar floating over the background
- clean mint neon line below navbar

## AppShell spec
### Structure
- `layout` wraps the full app and provides background layers
- `layout__content` stays above pseudo-element layers
- `layout__main` centers content and keeps max width

### Background layers (required)
1) Base:
- very dark blue gradient (`#020617` family)

2) Atmosphere:
- at least 2-3 radial blooms in cyan/teal/blue with low alpha

3) Texture:
- faint grid/noise style pattern (very low contrast)

4) Vignette:
- soft dark overlay to reduce visual noise behind content

### Rhythm and spacing
- Main content max width: `1320px`
- Horizontal padding on main and navbar inner: `1.5rem`
- Main top spacing should leave breathing room under navbar (`~2rem`)

## Navbar spec
### Layout
- sticky top (`top: 0`)
- full-width bar with centered inner container (`max-width: 1320px`)
- three zones:
  - left: brand
  - center: nav links
  - right: primary CTA

### Visual language
- translucent dark glass background
- blur in subtle range (`~8px` to `12px`)
- bottom border in mint/teal neon with medium-low alpha
- no heavy shadows; glow should stay restrained

### Brand
- icon + `Snippet Vault` wordmark
- icon can be lime/mint accent; text mint
- strong weight, no oversized glow

### Nav links
- muted neutral text by default
- hover/focus: brighter text only (avoid aggressive effects)
- keep spacing airy and readable

### CTA button
- outline neon border
- very soft glass tint fill
- hover/focus: slightly brighter border/fill, subtle glow
- keep radius and stroke consistent with other phases

## Responsive behavior
- Breakpoint: `940px`
- Under `940px`:
  - hide center nav links
  - keep brand + CTA visible
  - reduce inner gap if needed, but preserve alignment

## Accessibility baseline
- keyboard-visible focus for links and CTA (`:focus-visible`)
- preserve contrast for nav text over glass background
- button remains clearly discoverable in all states

## Allowed adjustments
- divider alpha/thickness
- blur intensity
- brand/link/CTA color tuning
- hover/focus polish

## Do not change
- `Layout` children rendering flow
- `Navbar` markup hierarchy
- global width rhythm (`1320px`)
