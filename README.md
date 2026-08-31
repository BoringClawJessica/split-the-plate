# Split the Plate — Clickable Prototype

**Live:** https://boringclawjessica.github.io/split-the-plate/

Phase 0 UX prototype for Split the Plate — the bill-split + gamble-pay social utility app.

## What's Built

48 clickable screens covering every Phase 0 flow:

| Group | Screens |
|-------|---------|
| Onboarding | Splash (animated logo), Sign In, Name + Photo, Notifications, Done |
| Home | Home feed, Friends list, Empty state |
| New Split | Entry, Camera scan (with scanline animation), Items detected, Add people, Split method picker |
| Split Methods | By Item (click to assign), Custom (live balance), Even (auto-calculated) |
| Review + Pay | Review & Confirm, Payment handoff (Venmo/Cash App/Apple Pay/Zelle) |
| Gamble Pay | Mode picker, Plinko (animated balls — results after ALL drop), Roulette (spinning SVG wheel), Coin Flip, Half-Off Roulette |
| Gamble Results | Final breakdown with payment links |
| Meal Memory | Save Meal, Meal Detail (timeline), Meal History feed, Table Chat |
| Profile & Settings | Profile, Settings, Payment Methods, Privacy, Notification Settings |
| Edge States | Receipt not found, No friends, No splits, Payment failed, Offline banner |
| Phase 1-4 Preview | 10 coming-soon screens with feature descriptions |

## Screen URLs

All screens: `/screen/<slug>`

Quick links:
- `/screen/splash` — start here
- `/screen/home` — main home
- `/screen/camera-scan` — fake receipt scan
- `/screen/plinko` — Plinko game
- `/screen/roulette` — Roulette wheel
- `/screen/gamble-results` — results page

## Run Locally

```bash
cd splittheplate
npm install
npm run dev
# Open http://localhost:3000
```

## Design

- **Dark base** — candlelit restaurant (#0f0c08)
- **Amber/orange accent** — #F59E0B / #EA580C
- **Fraunces** (display) + **DM Sans** (body)
- iPhone 15 Pro frame, sidebar navigation, arrow key support
- Grain texture overlay for depth

## Tech Stack

- Next.js 15 App Router + TypeScript
- Tailwind CSS v4 + shadcn/ui
- No real backend — all fake data in `/lib/mock-data.ts`
- Static export → GitHub Pages

## What's Stubbed / Cut

- No actual payment processing (deep-link mocks only)
- Plinko is visual-only (no real physics engine)
- Camera scan uses a static receipt image (not real webcam)
- Roulette slices are equal (25% each) — not weighted by bill share
- Phase 1-4 screens are "Coming Soon" placeholders
