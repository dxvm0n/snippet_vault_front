# Phase 10 — Visual Parity & Polish (UI A vs UI B)

## Objective
Bring the current implementation (UI B) to match the original reference (UI A) by applying visual parity fixes:
- Full-width feel + correct scaling
- Starfield/constellation background with subtle motion
- Stronger neon + glass treatment
- Language-based accents on cards and tags
- Pagination styling parity

---

## 10.1 Layout / Global composition fixes
### Target components
- Layout.tsx / Layout.css
- (optional) introduce a MainContainer wrapper component

### Required changes
1) Increase perceived width of content:
- Current: `layout__main` max-width 1320px is OK, but spacing/padding makes the UI feel smaller.
- Change: reduce vertical padding and allow hero/search to use full container width.
- Ensure grid spans the container and cards are larger.

2) Adjust vertical rhythm:
- Reduce empty vertical space between:
  - Navbar → Hero
  - Hero → Search
  - Search → Results meta
  - Results meta → Grid

3) “Full-width” feel:
- Keep content centered, but increase max-width (e.g. 1320 → 1440 or 1560) OR keep 1320 and increase grid/card scale.
- Ensure background is full-bleed and visually prominent.

Acceptance:
- UI feels wide and immersive like UI A (not “small centered island”).

---

## 10.2 Background parity (starfield + constellation + motion)
### Target components
- Layout.css (preferred)
- Optional: BackgroundLayer component (Canvas or CSS-only)

### Required changes
1) Add star particles layer:
- Add a pseudo-element (e.g. `.layout::before`) with:
  - multiple radial gradients representing stars
  - very low opacity, high density
- Add a second layer with sparse larger stars (bigger dots, lower count).

2) Add constellation/network lines:
- Use a subtle repeating-linear-gradient or an SVG background overlay with thin lines.
- Keep opacity extremely low (5–12%).

3) Add subtle motion:
- Animate background-position (slow drift) using keyframes.
- Parallax effect: different layers drift at different speeds.
- No distracting motion; extremely slow.

Acceptance:
- Background reads as starfield + faint network lines, with subtle movement.

---

## 10.3 Hero + Search scaling parity
### Target components
- HeroTitle component (Phase 02)
- SearchBar component (Phase 02)

### Required changes
1) SearchBar width:
- Input must dominate the row (~75–85% of container width).
- Button height matches input height exactly.
- Increase overall height slightly to match UI A.

2) Neon treatment:
- Border is brighter and more “laser”.
- Add soft outer glow and a clearer focus state.

Acceptance:
- Search area looks like UI A: wide, dominant, neon-clean.

---

## 10.4 SnippetCard parity (most important)
### Target components
- SnippetCard
- LanguageBadge
- TagPill
- IconButton (favorite, delete)

### Required changes
1) Language accent border:
- Each card border/glow must map to language:
  - JavaScript: mint/green
  - Python: cyan/blue
  - Docker: purple/violet
  - Bash: teal
  - SQL: blue
- Border should have:
  - 1px stroke + subtle glow
  - hover intensifies glow and elevates card slightly

2) True glass effect:
- Add:
  - translucent bg + backdrop blur
  - subtle inner highlight (inset shadow)
  - soft shadow for depth

3) Typography hierarchy:
- Title bigger and clearer (semi-bold).
- Code preview uses monospace with slightly tinted syntax-like color (subtle).
- Footer metadata smaller and more muted.

4) Tags color diversity:
- Tags should not be all the same tone.
- Use category-like colors per tag or per language palette:
  - default muted chips with colored border
  - or colored background at low alpha
- Keep readability and contrast.

5) Icons:
- Favorite star:
  - more visible state color (gold/yellow)
  - hover: brighter
- Delete:
  - red icon with hover intensification + subtle glow

Acceptance:
- Cards look “neon glass” and language-specific like UI A.

---

## 10.5 Pagination parity
### Target components
- Pagination

### Required changes
1) Active page styling:
- neon mint text + underline glow bar
2) Spacing:
- match UI A: balanced, centered, minimal
3) Optional control:
- small square button with "x" at right

Acceptance:
- Pagination reads like UI A terminal-neon style.

---

## Deliverables
- Update CSS + components only (no API changes)
- Visual parity pass: hero/search/cards/pagination/background
- Ensure responsive behavior remains correct

## Non-negotiable constraint
- Do NOT change endpoints, data fetching, or business logic.
