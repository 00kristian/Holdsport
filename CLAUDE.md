# Holdsport — Claude Code Instructions

## Pull Requests
- Always create PRs with a branch name and let GitHub auto-delete the branch after merge.
- The repo has `delete_branch_on_merge = true` enabled — branches are deleted automatically when a PR is merged. No manual cleanup needed.

## Stack
Vue 3 (Composition API) + Pinia + Vue Router + Vite. Deployed to GitHub Pages via GitHub Actions.

## Key files
- `src/views/` — page-level components
- `src/components/` — shared UI components
- `src/stores/` — Pinia stores
- `src/data/` — static data files
- `src/assets/css/main.css` — global CSS / design tokens
- `scripts/` — build-time data fetching from Holdsport API

## Conventions
- Composition API (`<script setup>`) throughout
- Season boundaries: **1 August** starts a new season (e.g. 2025-08-01 = start of 25/26)
- Season label format: `25/26`, `24/25`, etc.
