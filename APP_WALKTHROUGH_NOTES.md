# Split the Plate — Eli's Walkthrough Notes (2026-08-31)

Full audio walkthrough of the prototype. Locking in every change so nothing gets lost.

## Onboarding / Auth
- **Skip the intro page.** Boot straight into sign-in. Splash-loading is fine as the transition.
- Sign-in options: **Continue with Apple**, **Continue with Google**, **Continue with Phone** (SMS code).
- After auth: **Name + Profile Picture** setup.
  - The "Name" field = the **username** (the app handle).
- Then **Notifications on/off** prompt. Keep.

## Global Navigation
- **Persistent Home button at the bottom** on every screen so you can always get back.
- Every non-home screen also needs a **back button at the top** (friends screen does this — copy that pattern everywhere).

## Home Page
- Keep friends count, splits count, and "role of the day" tile.
- Recent splits list stays.
- ⚠️ For now, **no in-meal / dining timeline**. Splits only track post-payment state. Anything pre-payment is out of scope for v1.

## Friends
- Search by `@handle` — keep.
- Back button already there — keep.

## New Split
- **Remove "Add to existing split"** — makes no sense. Items are added when you scan/enter, not appended later.
- Options are: **Scan Receipt** OR **Manual Entry**.

### Scanned Receipt Screen (View Items)
- Each item row needs **BOTH** buttons:
  - ✏️ **Edit** (pencil) — edit item name + price → opens edit screen/modal
  - 🗑 **Delete** — works already
- **"Add missing item"** button must open a real add-item screen (currently does nothing).

### Add People
- Search field must actually work.
- From the search results, you should be able to **add someone as a friend inline** (no need to backtrack to Home → Friends).
- Once added as friend → they become selectable for this split.

### How to Split
- **Split evenly** — keep, works.
- **Split by item:**
  - Bill **leader** can assign any item to any person (override anyone).
  - **Non-leaders** get a "Claim" button per item to claim their own.
  - Leader can also just claim items for themselves.
- **Custom** — keep, works (e.g. type $50, remainder auto-calcs).

### Gamble Pay — TRIM THE LIST
Only keep two games:
1. **Plinko** — copy the Plinko implementation from the **old Plait system** exactly. Same feel, same behavior.
2. **Spin the Wheel** (renamed from Roulette) — names on the wheel, even odds for now.
   - Future idea (not now): weight the wheel by each person's item total.
- ❌ Remove: Coin Flip, "Half off the roulette", "One lucky person pays half", "Everyone splits different". No one-off games.

## Review Split
- Shows subtotal, tax, total — keep.
- **Tip** = per-person (each person adds their own tip on their portion). We'll revisit if leader-tip makes more sense.

## Payment Methods
- Supported: **Apple Pay, Cash App, Venmo, Zelle, PayPal, Cash**.
- **Leader-driven flow:** payers can only choose payment methods the **leader has connected** to receive.
  - If leader only has Zelle + Cash App → payers only see Zelle + Cash App.
- **Onboarding requirement:** every user must connect **at least one** payment method in settings before they can create/receive splits. Nag screen if none set.
- **Cash option:** leader can accept cash → payer hands cash IRL → leader marks that person as paid manually on their side.

## Profile
- Show: **Meals count, Friends count, Payment methods accepted**.
- **Toggleable public/private** stats: average meal spend, total spend.
- Public defaults: meals, friends, accepted payment methods.
- **Meal history** — keep as a page with per-entry privacy toggle.
- Skip "recent meals" widget on the profile itself.

## Visual / UI Direction — LOCK THIS IN
- **Use the OLD Plait UI style and color palette** exactly. Copy it over to Split the Plate.
- **No emojis** in the UI.
- All the same UI rules as old Plait — different app, same visual DNA.

---

## Answered by Eli (2026-08-31, voice reply)

### 1. Tip = per-person ✅
- Each person calculates their own tip based on their own split.
- The tip is **added to their payment to the leader** (bundled in the one transfer).
- Final review screen shows:
  - Bill total paid off (subtotal + tax)
  - **Total tips collected separately** so the leader knows how much extra to hand the restaurant on top of the bill.

### 2. Auth — RESEARCH FIRST, then pick
- Old Plait used **Firebase**.
- Eli previously floated **Supabase**.
- Decision: **do a deep dive**. Look at what big apps use — Instagram, and especially **OpenTable** (Eli wants us to "more so copy what OpenTable is using" as a general pattern for a bunch of things going forward).
- Pick the best-in-class option based on what the big companies use, then go with that.
- **TODO:** research subagent → recommendation.

### 3. Plinko + Wheel
- **Plinko:** pull from old Plait, reuse as-is.
- **Wheel Spin:** Eli doesn't remember Plait having one → **likely custom build**. Must match the same visual design language as Plinko and the rest of the app.

---

## Follow-up TODOs
- [ ] Research subagent: OpenTable + Instagram-scale auth stack → Firebase vs Supabase vs alternatives. Deliverable: 1-page recommendation.
- [ ] Locate old Plait repo → identify Plinko component + old UI theme files → port.
- [ ] Design Wheel Spin component in the shared visual language.
- [ ] Rewrite review-split screen to show `Bill Paid` and `Tips Collected` as two separate totals.
- [ ] Note for later: Eli wants us to "copy OpenTable" as a general reference for other patterns too, not just auth. Keep this in mind for reservation-like flows if we ever add them.
