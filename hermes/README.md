# Plait — Hermes Handoff Bundle

Everything Plait-related for the other machine. Cloned from Eli's Mac mini.

## What's here

- **HERMES-HANDOFF.md** — the master doc (vision, release phases 0→4, all 48 screens, design system, tech stack, product decisions, business model)
- **logos/** — all 28 Plait logo variants (v1 → v33) + SVG source

## Live prototype

https://boringclawjessica.github.io/split-the-plate/

48 clickable screens. Sidebar navigation + arrow keys.

## Repo

You're already in it. This whole repo IS the Phase 0 prototype.

Root has the Next.js app:
- `app/` — pages
- `components/` — UI
- `lib/mock-data.ts` — all fake data
- `APP_WALKTHROUGH_NOTES.md` — canonical spec from Eli's voice notes
- `RESEARCH_AUTH_AND_PLAIT.md` — auth stack recommendation + old-Plait asset locator

## Run locally

```bash
npm install
npm run dev
# http://localhost:3000
```
