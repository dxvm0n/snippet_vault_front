# Phase 05 — SnippetCard (Critical)

## Goal
Match the reference card visual structure and states.

## Props contract (example)
- id: number|string
- title: string
- content: string (snippet preview)
- language: string
- tags: string[]
- createdAt: string
- isFavorite: boolean
- onToggleFavorite(): void
- onDelete(): void

## Card structure
Top row:
- LanguageBadge (left)
- Meta (right): "#123" + optional icons
- Favorite star icon (if isFavorite)

Title:
- high contrast, semibold

Code preview:
- monospace
- muted, with slight color accents

Footer:
- TagPills left
- Date right
- Trash icon (red) at far right

## Visual spec
- glass background with blur
- neon border with language-specific accent
- hover: card lifts slightly + glow intensifies
- border colors:
  - JavaScript: mint/green
  - Python: cyan/blue
  - Docker: purple/violet
  - Bash: teal
  - SQL: blue

## Interaction spec
- Entire card hover effect
- Favorite icon hover: increases brightness
- Delete icon hover: increases red saturation + subtle glow
