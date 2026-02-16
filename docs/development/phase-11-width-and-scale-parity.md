# Phase 11 — Width & Scale Parity (Fix #1: Use full width correctly)

## Objective
The current UI feels like a small centered “island”. The goal is to match the reference (UI A) where:
- Background is full-bleed (edge-to-edge).
- Content FEELS wide and immersive.
- Hero/Search remain centered but not tiny.
- Grid spans a wider container and cards are scaled appropriately.

This phase MUST NOT change:
- API calls
- data fetching logic
- state logic
Only layout/CSS and component structure (wrappers) may be changed.

---

## Problem Statement (what is wrong today)
- The background is full-screen, but the content area (hero/search/grid) is visually constrained, leaving excessive empty space.
- The grid and cards render too small relative to the viewport.
- The search bar does not dominate the layout like in the reference.

---

## Implementation Strategy
Use a two-container system:
1) **Container Narrow**: for hero/title/search/meta (centered, controlled width)
2) **Container Wide**: for grid + pagination (wide, immersive)

This approach is aligned with standard “full-bleed” layout patterns: keep background full width while allowing specific blocks to “break out” or use wider max-widths. :contentReference[oaicite:1]{index=1}

---

## Required Changes (do these in order)

### Change 11.1 — Add Wide/Narrow containers (Layout.css)
Target file:
- `src/components/layout/Layout.css`

Add two utility wrappers (class-based) WITHOUT changing the existing Layout component contract.

**Required CSS classes**
- `.container--wide`: wider max-width than current (aim for 1560–1680px)
- `.container--narrow`: controlled max-width (aim for 900–1050px)

Rules:
- Both must be `width: 100%` and centered with `margin: 0 auto`.
- Must preserve existing horizontal padding rhythm (1.5rem is fine).
- Keep background full-bleed.

Acceptance:
- Containers exist and can be used in pages/components.

---

### Change 11.2 — Restructure the Home page layout with the new containers
Target:
- `src/pages/Home.tsx` (or equivalent entry page)

Wrap sections explicitly:
- HeroTitle + SearchBar + MetaLine in `.container--narrow`
- Grid + Pagination in `.container--wide`

Important:
- Do NOT move Navbar; Layout still owns Navbar.
- Only wrap the page content (children) inside Layout.

Acceptance:
- Hero/Search are centered and readable.
- Grid spans wider and no longer looks “tiny”.

---

### Change 11.3 — Make SnippetGrid truly expand (SnippetGrid.css)
Target:
- `src/components/snippets/SnippetGrid.css` (or equivalent)

Enforce a responsive grid that expands to container width:
- Desktop: 3 columns using `repeat(3, minmax(0, 1fr))`
- Tablet: 2 columns
- Mobile: 1 column

Note:
Using `minmax(0, 1fr)` prevents overflow and is a known good practice for fluid grid tracks. :contentReference[oaicite:2]{index=2}

Acceptance:
- Grid fills `.container--wide`.
- Cards align and stretch consistently.

---

### Change 11.4 — Scale up the SearchBar to match reference dominance (SearchBar.css)
Target:
- `src/components/search/SearchBar.css` (or equivalent)

Rules:
- SearchBar must span the full width of `.container--narrow`.
- Input should take ~75–85% of row width.
- Button should have the same height as input.
- Increase height slightly (e.g., 48–56px) to feel substantial.

Acceptance:
- SearchBar looks visually “primary” and not small.

---

## Visual Acceptance Checklist (what “correct” looks like)
- Background remains full-bleed.
- Content feels wide:
  - Grid uses a wider max-width than hero/search.
- Hero/Search are centered but not tiny.
- Cards are no longer visually compressed into the center.
- No logic changes and no regression in existing features.

---

## Non-negotiable Constraints
- Do NOT change endpoints or API service functions.
- Do NOT change state shape.
- Do NOT introduce a UI library.
- Keep diffs minimal and scoped to layout/CSS/wrappers only.

---

## Deliverables
- Updated CSS for wide/narrow containers (Layout.css)
- Updated Home layout wrappers (Home.tsx)
- Updated grid CSS for expansion/responsiveness (SnippetGrid.css)
- Updated SearchBar CSS scaling (SearchBar.css)
