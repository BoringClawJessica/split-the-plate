# Plait — Full Hermes Handoff

_Packaged 2026-09-15 for Eli to send to Hermes. Everything Plait-related in one place: vision, release phases, prototype site, code repos, design system, and open decisions._

---

## 1. What Plait Is

**Plait** = a customer-owned dining app. Scan the check, split it, gamble on who pays, remember every meal. Long-term it grows into a full restaurant OS (reservations → preorder → active meal → staff mode → owner dashboard → loyalty).

- **Domain:** plait.com (owned)
- **Sister brand / Phase 0 launch product:** **Split the Plate** — the standalone bill-splitting + gamble-pay app that ships FIRST as its own product, then folds into Plait
- **Split the Plate domain:** splittheplate.com (owned)

---

## 2. Release Phases (locked)

Plait ships in 5 phases. Split the Plate = Phase 0 (already prototyped).

| Phase | Product | Screens | Status |
|-------|---------|---------|--------|
| **Phase 0** | **Split the Plate** — bill split + gamble pay + meal memory | 48 (built) | ✅ Prototype live |
| **Phase 1** | Reservations + Preorder + Active Meal | Reservations, Preorder, Active Meal | 🔒 Coming soon (locked previews built) |
| **Phase 2** | Order & Cart + Staff Mode (waiter/host/kitchen) | Order Cart, Staff Mode | 🔒 Coming soon (locked previews built) |
| **Phase 3** | Owner Dashboard + Loyalty + Gift Cards | Owner Dashboard, Loyalty, Gift Cards | 🔒 Coming soon (locked previews built) |
| **Phase 4** | Leaderboards + AI Eats (AI recommendations, AI order-taker) | Leaderboards, AI Eats | 🔒 Coming soon (locked previews built) |

Each future phase already has a locked "Coming Soon" preview screen in the Phase 0 prototype so users see the roadmap.

---

## 3. Mock Website / Clickable Prototype

**Live URL:** https://boringclawjessica.github.io/split-the-plate/
**Repo:** https://github.com/BoringClawJessica/split-the-plate
**Local:** `/Users/clawalpha/.openclaw/workspace/splittheplate/`
**Vercel project:** `splittheplate` (prj_8eWl7gd9qOfFlE9QkyYtSN0nLwVk) — token expired, currently deployed to GitHub Pages instead

### Prototype UX shell
- iPhone 15 Pro frame centered on desktop
- Sidebar lists all 48 screens
- ← → arrow keys navigate
- Grain texture overlay for depth
- Direct-link any screen: `/screen/<slug>` (e.g. `/screen/plinko`)

### All 48 screens by group

**Onboarding (5)**
`splash` (animated logo with jagged SPLIT cut effect) · `signin` (Apple / Google / Phone) · `profile-setup` (name + avatar) · `notifications-permission` · `onboarding-done`

**Home (3)**
`home` (New Split CTA, friends row, Roll-of-the-Day teaser, recent splits) · `friends` (searchable + invite banner) · `home-empty`

**New Split (10)**
`new-split` (Scan / Manual / Add-to-existing entry) · `camera-scan` (mock camera + scanline animation, "8 items detected" popup) · `items-detected` (editable list) · `add-people` (checkbox friends + guests) · `split-method` (Even / By Item / Custom / Gamble) · `by-item` · `custom-split` · `even-split` · `review-confirm` · `payment-handoff` (Venmo / Cash App / Apple Pay / Zelle)

**Gamble Pay (6)**
`gamble-picker` (Plinko / Roulette / Coin Flip / Half-Off with risk badges) · `plinko` (all balls drop first, then reveal) · `roulette` (spinning SVG wheel) · `coin-flip` · `half-off` (roulette-style loser pick) · `gamble-results`

**Meal Memory (4)**
`save-meal` · `meal-detail` (timeline) · `meal-history` · `table-chat`

**Profile & Settings (5)**
`profile` (avatar, 47 meals / 23 friends / $38 avg stats, payment handles) · `settings` · `payment-methods` (Venmo / Cash App / Apple Pay / Zelle) · `privacy` · `notification-settings`

**Edge States (5)**
`receipt-not-found` · `no-friends` · `no-splits` · `payment-failed` · `offline` (red banner + retry)

**Phase 1–4 Preview (10)** — locked "Coming Soon" placeholders
- Phase 1: `reservations-preview`, `preorder-preview`, `active-meal-preview`
- Phase 2: `order-cart-preview`, `staff-mode-preview`
- Phase 3: `owner-dashboard-preview`, `loyalty-preview`, `gift-cards-preview`
- Phase 4: `leaderboards-preview`, `ai-eats-preview`

---

## 4. Design System (locked)

**Theme name:** "The Culinary Editorial"

**Palette**
- `primary` — `#ab3500` (deep brand orange, CTA gradient start)
- `primaryContainer` — `#ff6b35` (bright orange, CTA gradient end)
- `primaryGlow` — `rgba(255,107,53,0.3)`
- `background` / `surface` — `#fff8f1` (canvas cream)
- `surfaceContainerLow` — `#f9f3eb`
- `surfaceContainerHigh` — `#eee7df`
- Text warm black `#1e1b17`

**Prototype (dark demo) variant**
- Dark base `#0f0c08` (candlelit restaurant)
- Amber `#F59E0B`, orange `#EA580C`

**Typography**
- Fraunces (display)
- DM Sans (body)

**Rules**
- No emojis in UI. Anywhere. Ever.
- iPhone 15 Pro frame in the web prototype
- Grain overlay for depth

---

## 5. Tech Stack

**Prototype (Split the Plate web)**
- Next.js 15 App Router + TypeScript
- Tailwind CSS v4 + shadcn/ui
- All fake data in `/lib/mock-data.ts`
- Static export → GitHub Pages
- No backend

**Production app (React Native)**
- Repo: `/Users/clawalpha/.openclaw/workspace/plait-app/` (React Native / Expo SDK 55)
- **Auth:** Firebase Auth (phone OTP + Apple + Google, passwordless) — matches OpenTable pattern, cheapest SMS (~$0.01), existing infra already wired
- **DB:** Firestore (existing rules, migrations built)
- **Payments:** Apple Pay + manual card for launch. Stripe Terminal deferred. POS provider abstraction spec exists.
- Games ported from old Plait:
  - `PlinkoGame.tsx` — 1093 lines, Matter.js deterministic physics, Skia rendering, Firestore-synced
  - `RouletteWheel.tsx` + `RouletteGame.tsx` — 360 + 961 lines, 3.2s spin, even + weighted slice support

---

## 6. Key Product Decisions (from Eli's voice notes, 2026-08-30 → 2026-08-31)

**Home**
- ❌ Removed "Role of the Day" (Eli didn't like it, didn't understand it)
- Bottom bar = 🏠 Home + ➕ Plus only. Profile top-right of home. Notifications icon opens inbox (not settings).
- Home button hides during in-progress split; reappears after payment or back-out.

**New Split flow order**
1. Add People
2. Scan Receipt / Manual Entry (auto-detect restaurant name; prompt if fails)
3. Review Items
4. Assign / split method (Even / By Item / Custom / Gamble)

**Meal Memory rewrite**
- ❌ Deleted "Save Meal" screen — meals auto-save at end of split
- ❌ Deleted Table Chat entirely (no chat in v1)
- ❌ Deleted timeline UI
- ✏️ "Meal History" → **"Recent Meals"** on home
- Meal detail structure (top → bottom): Restaurant name · Date · # of people · Receipt photo · Digital receipt · Per-person section (name, items, paid amount, method, paid/not-paid status) · How it was split

**Recent Meals row:** Restaurant + date · Who was in it · Payment status per person · Split method used. No timeline. No emojis.

**Gamble games — expanded settings before play**
- **Plinko:** number of balls per person, pay-by-placement (1st X%, 2nd Y%…), loser-pays-all, port all old Plait modes
- **Spin the Wheel:** per-person slice count (Eli×2, Tyler×1, Sofia×1 → Eli 50%), live % chance shown, even = default

**Review & Payment → split into 4 phases**
1. **Review & Confirm** — subtotal / tax / total / everyone's share (no tip)
2. **Add Your Tip** — each person picks tip % on THEIR share (15/18/20/25/custom); different people can pick different tips
3. **Payment** — each person sends (share + their tip) via their chosen method to the leader
4. **Leader dashboard** — running totals of Bill Paid, Tips Collected, who's paid / who hasn't. Cash = leader hits Confirm when received IRL. Digital = auto Paid/Pending.

**Profile**
- Stats (avg spend / total spend / total meals) hidden by default, togglable public
- Edit profile = tap avatar (NOT from settings)
- No recent-meals list on profile (it lives on home)

**Settings**
- Payment Methods (add/remove, Cash toggle)
- Notifications: friend adds you · time to pay · marked as paid. Removed: Plinko cam alert, deals/promos
- Privacy toggles: allow meal invites (Everyone / Friends only / Off), meal history visible, profile visible, location sharing, show avg/total spend, show total meals

**Games — locked**
- Gamble modes: Plinko + Spin the Wheel only. Coin Flip + Half-Off deleted.

---

## 7. Locked-In Decisions

- **Auth:** Firebase (phone OTP + Apple + Google)
- **Payments (launch):** Apple Pay + manual card. Stripe Terminal post-launch.
- **Games:** Plinko + Spin the Wheel (ported from old Plait)
- **Designs:** all designs made in Google Stitch (never Jessica-made) — hard rule
- **Split the Plate ships as its own app first, then absorbs into Plait as Phase 0**

---

## 8. Repos & Local Paths

| Component | Local | Remote |
|-----------|-------|--------|
| Split the Plate prototype (web) | `/Users/clawalpha/.openclaw/workspace/splittheplate/` | https://github.com/BoringClawJessica/split-the-plate |
| Plait customer app (RN) | `/Users/clawalpha/.openclaw/workspace/plait-app/` | private |
| Plait admin | `/Users/clawalpha/.openclaw/workspace/plait-admin/` | private |
| Plait backend | `/Users/clawalpha/.openclaw/workspace/plait-backend/` | private |
| Plait dashboard | `/Users/clawalpha/.openclaw/workspace/plait-dashboard/` | private |
| Plait landing (marketing) | `/Users/clawalpha/.openclaw/workspace/plait-landing/` | Vercel |
| Stitch design reference | `/Users/clawalpha/.openclaw/workspace/plait-stitch-reference/` | — |
| Logos v1–v33 | `/Users/clawalpha/.openclaw/workspace/plait_logo_v*.png` | — |

---

## 9. Docs & Specs (in `vault/Plait/`)

Backend + product docs (~250KB total, from 2026-03-29 planning day):
- `ARCHITECTURE.md` — 86KB, ~2000 lines, full system architecture
- `API-ENDPOINTS.md` — ~50 endpoints across 10 domains
- `DATA-FLOWS.md` — 6 critical flows diagrammed
- `SECURITY-RULES.md` — Firestore rules + 12 helper functions
- `TESTING-STRATEGY.md` — meal simulation, Stripe test mode, k6 load, CI/CD
- `ERROR-HANDLING.md` — 16 failure modes with recovery paths
- `INTEGRATIONS.md` — Stripe, Firebase, Google Maps, Gemini, Twilio pinned configs
- `SHIP-PLAN.md` — day-by-day ship plan
- `APP-STORE-METADATA.md`, `PRIVACY-POLICY-DRAFT.md`, `TERMS-OF-SERVICE-DRAFT.md`
- `split-the-plate-prototype.md` — full Phase 0 spec

Prototype spec:
- `/Users/clawalpha/.openclaw/workspace/splittheplate/APP_WALKTHROUGH_NOTES.md` — canonical source-of-truth from Eli's voice notes
- `/Users/clawalpha/.openclaw/workspace/splittheplate/RESEARCH_AUTH_AND_PLAIT.md` — auth recommendation + old-Plait asset locator

---

## 10. Business Model (from 2026-03-28 pricing lock)

- **Tier 1:** Free
- **Tier 2:** paid per-location
- **Tier 3:** $2,500/mo (AI features)
- **Tier 4:** $10,000/mo base (enterprise / chains, unlimited locations, $500/location)
- **Customer side:** $10/mo Plait Premium (priority service / reservations)
- 20% of premium revenue pooled → paid back to restaurants based on stats

---

## 11. What's Stubbed in the Prototype

- No webcam — camera scan uses static receipt image + CSS scanline
- Plinko is visual-only (no physics engine, random positions)
- Roulette slices equal 25% (not weighted)
- Payment buttons are deep-link mocks, no real payments
- Phase 1–4 screens are locked previews
- No backend — all data in `/lib/mock-data.ts`

---

## 12. Next Actions for Hermes

1. Pull the live prototype and click through the 48 screens
2. Read `APP_WALKTHROUGH_NOTES.md` for the canonical spec + Eli's voice-note decisions
3. Check the Phase 0 → Phase 4 roadmap and lock any priority reshuffles
4. If deploying: `vercel login` locally, then `vercel --prod` from `/splittheplate/` (or connect the GitHub repo to Vercel for auto-deploy)
5. When Phase 0 launches as its own app, feature/screen flags decide when Phase 1 previews unlock

---

_End of handoff._
