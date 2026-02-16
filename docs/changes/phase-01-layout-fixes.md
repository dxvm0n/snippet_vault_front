# Phase 01 - Layout visual fixes

Date: 2026-02-16

## Problem addressed
The navbar and spacing were visibly different from the reference image because:
- Utility classes were not producing the expected final structure in this project setup.
- Global selectors in `App.css` (`button`, `form`, `ul`, `li`, etc.) leaked styles into navbar elements.

## Fixes applied
1. Rebuilt navbar styling using dedicated CSS:
   - `src/components/navigation/Navbar.css`
   - Pixel-focused spacing, typography scale, neon border, transparent blur background.

2. Rebuilt layout shell styling using dedicated CSS:
   - `src/components/layout/Layout.css`
   - Full-screen dark base + starry overlays + centered content container.

3. Scoped CRUD form/list/button styles under `.app` in `src/App.css`:
   - Prevented visual contamination of layout/navigation components.

4. Kept API logic untouched:
   - No endpoint, fetch, or data-flow changes.
