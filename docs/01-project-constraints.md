# Project Constraints

## Tech
- Vite + React + TypeScript
- CSS files per component (current approach)
- Existing Layout.tsx and Navbar.tsx already implemented and must remain compatible.

## Behavioral constraints
- All existing actions must keep working (search, favorites, delete, pagination).
- UI must remain fast and stable.
- No new external UI libraries unless explicitly requested.

## File structure
Recommended:
src/
  components/
    layout/
    navigation/
    snippets/
    search/
    pagination/
  pages/
  services/ (existing)
