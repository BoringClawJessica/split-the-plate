# Split the Plate — Full Walkthrough Spec (2026-08-31)

Canonical spec pulled from Eli's original voice note (file_856) + follow-up. This is the source of truth. If it's here, it must ship.

---

## ✅ Already done (locked in first pass)
- Skip intro → Splash → Sign In direct
- Sign In: Apple / Google / Phone
- Profile setup: Username (= @handle) + profile pic
- Notifications on/off prompt
- Top-left back button on every non-home screen
- New Split: removed "Add to existing split"
- Item rows: Edit ✏️ + Delete 🗑, add-missing-item modal
- Add People: working search + inline "add as friend"
- By Item: leader assigns / others Claim
- Gamble Pay: trimmed to Plinko + Spin the Wheel; Coin Flip + Half-Off deleted
- Plinko ported from old Plait
- Spin the Wheel: even for v1, weight support baked in for future item-based
- Review: two totals (Bill Paid, Tips Collected), per-person tip
- Payment: leader-driven method visibility, Cash added, connect-a-method banner
- Old Plait "Culinary Editorial" theme ported (cream + warm text + brand orange)
- No emojis in UI

---

## ❌ MISSED — must fix in the next pass

### Home screen — REMOVE "Role of the Day"
- Eli explicitly said: "Role of the day, I don't like it, I don't understand what that is. Remove that. Keep it even simpler."
- Delete the Role of the Day tile from `HomeScreen.tsx` completely. Don't hide it — delete it.

### Home bottom bar — simplified nav
- Bottom bar has ONLY two icons:
  - 🏠 Home button (always visible everywhere)
  - ➕ Plus button = New Split / New Meal shortcut
- Profile lives in the **top right corner** of home (not the bottom bar).
- Notifications icon on home should open **actual notifications**, not notification settings.

### Meal Memory / Meal History — MAJOR REWRITE
This whole section was wrong. Eli's exact spec:

- **DELETE** the "Save Meal" screen — meals auto-save at the end of a split. There is no manual save step.
- **DELETE** the Table Chat screen entirely. There's no chat in v1. The app is scan-check → split → pay. No pre-meal or during-meal features.
- **DELETE** the meal timeline UI in Meal History. That's what was wrong.
- **Rename** "Meal History" → **"Recent Meals"** on the home screen tile.

### Meal Detail — new structure (this is the important part)
When you open a meal from Recent Meals, you see (top → bottom):

1. **Restaurant name** (auto-scanned from receipt; if scan fails, prompt user to type it during the split)
2. **Date**
3. **Number of people**
4. **Photo of the receipt** (if the split was created by scanning; skip if manual entry)
5. **Digital receipt** — list of every item and its price, subtotal, tax, total (a text version of what's in the photo, OR the only version if it was manual)
6. **People section** — for each person on the split:
   - Name
   - Items assigned to them (their portion)
   - How much they paid
   - Which payment method they used
   - Whether it's marked as paid or not
     - If Cash: leader must mark received. Show "Not received yet" until leader marks it.
7. **How it was split** — "Split Evenly" OR "Plinko results" (who lost/won) OR "Spin the Wheel results" OR "By Item" OR "Custom"

### Recent Meals list (home + meal history page)
Each row shows:
- Restaurant name + date
- Who was in it
- Payment status for each person (paid / not paid)
- The split method used

That's it. No timeline. No emojis.

---

### Restaurant name capture during New Split
- After scan: try to auto-detect restaurant name from the receipt.
- If not detected: ask the user to enter it ("What restaurant is this?").
- If manual entry (no scan): required field at the start of manual entry.

---

### Profile page
- Show: Meals count, Friends count, accepted Payment Methods (chips).
- Recent meals list on profile → **remove** (it belongs on home).
- Meal history is a separate page (accessible from home), with per-entry public/private toggle.
- Stats block (average meal spend, total spend, total meals) — hidden by default on profile; only visible to others if the user enables it. This is a "stats/leaderboard" section on your own profile that's togglable public.
- **Edit profile** — accessible by tapping the profile picture, NOT from settings. Remove any "edit profile" entry from settings.

### Settings
- Payment Methods → keep here (add / remove / enable Cash toggle — cash doesn't need connecting, it's just a toggle).
- Notifications → keep. Options:
  - When a friend adds you to a new bill/plate
  - Time to pay (leader can bump you if you haven't paid)
  - Marked as paid (when leader confirms)
  - ❌ Remove: "Camera's also in Plinko when finishes" — no notification for that (user's already in app)
  - ❌ Remove: "Deals and promotions" — no deals in v1
- Privacy → **all** the public/private toggles live here:
  - Allow meal invites → Everyone / Friends only / Off
  - Meal history visible (yes/no)
  - Profile visible (yes/no)
  - Location sharing (yes/no)
  - Show average meal spend (yes/no)
  - Show total spend (yes/no)
  - Show total meals (yes/no)
- Rate Split the Plate, Send Feedback, Terms → keep.
- **DELETE** "Edit Profile" from settings — it lives on the profile page (tap avatar).

### Notifications icon (from home)
- Opens the actual notifications INBOX, not notification settings.

---

## 🎨 Design rules (locked)
- Old Plait "Culinary Editorial" theme: cream `#fff8f1`, brand orange `#ab3500 → #ff6b35`, warm black text `#1e1b17`
- Fraunces (display) + DM Sans (body)
- **No emojis anywhere in the UI. Ever.**
- Same UI rules as old Plait

---

## 🔐 Auth stack — decided
- Firebase (matches OpenTable pattern, cheapest SMS, we have infra from old Plait)

## 🎰 Games — decided
- Plinko: ported from old Plait
- Spin the Wheel: ported from old Plait `RouletteWheel.tsx`, even weighting v1, weight support ready

---

# 🔁 Second-pass walkthrough feedback (2026-08-31, voice note file_860)

## Verdict
- Meal detail, Recent Meals, Profile, Payment Methods, Privacy all approved.
- "Feels like a good start." Move forward with the rest.

## Flow reorder — New Split
- **New order:** Add People FIRST, then Scan Receipt / Manual Entry, then Review Items, then assign / split method.
- Rationale: once people are set up, they can self-claim items during review.
- Eli half-flip-flopped mid-note ("actually never mind, keep the same flow") — but the intent stands: assigning items after people already exist is what he wants. Ship the new order.

## Home button behavior during a split
- **Hide the bottom Home button** while user is inside an in-progress split flow (scan → items → add people → split method → gamble → review → payment).
- Home button reappears once the split is completed (post-payment) or if user backs out via the top-left Back button.
- Rationale: prevents accidentally abandoning a scan mid-flow.

## Plinko — MORE settings (before drop)
Port all the old Plait Plinko settings, not just single-ball loser-pays:
- Number of balls to drop (each person drops their own ball, or multi-ball)
- Pay-by-placement mode: 1st place pays X%, 2nd Y%, 3rd Z%, etc.
- Loser-pays-all (current default)
- Any other modes old Plait supported
Pre-drop settings screen before the ball animation.

## Spin the Wheel — MORE settings (before spin)
- Per-person slice count: user can set how many times each person appears on the wheel.
  - Example: Eli x2, Tyler x1, Sofia x1 → 4 slices total, Eli has 50% chance.
- Live percent chance shown next to each name as they adjust counts.
- Even mode stays the default.

## Review & Confirm → Payment split into phases
Right now Review & Confirm goes straight to payment handoff. Break it up:

1. **Review & Confirm** — shows subtotal, tax, total, everyone's share (no tip yet).
2. **Add Your Tip** phase — each person individually:
   - Sees their share of the bill (e.g. "You owe $10")
   - Picks tip % (15 / 18 / 20 / 25 / custom) on THEIR share only
   - Example: $10 share + 20% tip = they pay $12 total
   - Different people can pick different tip %s
3. **Payment** — each person sends their (share + their tip) via their chosen method to the leader.
4. **Leader dashboard** — running total of:
   - Bill paid so far
   - Tips collected so far (updates live as people submit)
   - Who's paid, who hasn't
   - For cash payments: leader hits a **Confirm** button when they receive cash IRL.
   - For Venmo/CashApp/Zelle/PayPal/Apple Pay: shows "Paid" / "Pending" status.

## Future note (not v1, but Eli called it out)
- Eventually: assigning items to specific people should be its own step where what-you-ate ≠ what-you-paid. For now the current 3 split modes (evenly / by item / custom) are fine.

## Nitpick / defer
- Profile page has "too much empty space for meals/friends" — Eli wants an Instagram-style tighter feel. Not blocking. Tighten if easy.

