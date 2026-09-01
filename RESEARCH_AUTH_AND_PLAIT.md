# Split the Plate — Auth Stack + Old Plait Asset Locator

_Research report. No code changed. Written 2026-08-31._

---

## Auth Recommendation

> **RECOMMENDATION: Firebase Auth (via Firebase JS SDK v9+ modular) — phone/SMS as primary, Sign in with Apple + Sign in with Google as social options.**

### 2–3 sentence reasoning
OpenTable's diner app is passwordless-first (email/phone OTP + Apple + Google) — Firebase Auth ships exactly that pattern out of the box with the cheapest per-SMS price on the market (~$0.01 US) and zero platform fee. You already have working Firebase Auth code, a `plait-app-fa700` project, service account, and Apple Sign-In provisioning solved from old Plait — swapping to Supabase means re-solving all of that for near-identical UX. Migration later (if you outgrow it) is bounded because we'll only lean on Auth + a thin Firestore/CF footprint, not the whole Firebase kitchen sink.

### What OpenTable actually uses (diner iOS app)
- **Passwordless-first.** Email or phone number → 6-digit OTP via SMS (voice fallback). No password on the primary flow.
- **Sign in with Apple** as native social (Apple's `AuthenticationServices` framework, `ASAuthorizationAppleIDProvider`).
- **Sign in with Google** as secondary social.
- SMS provider undisclosed publicly (likely Twilio or in-house aggregator). No public engineering blog confirms Firebase/Auth0/Cognito on the diner side.
- Restaurant-side (different app) uses **Okta** + SMS 2FA — not relevant to Split the Plate's diner flow.
- Bottom line: OpenTable's diner pattern is **phone OTP + Apple + Google, passwordless**. Firebase Auth mirrors this 1:1.

### What Instagram uses
- Internal Meta stack — **Meta's own OAuth 2.0 identity service** (not buyable). Django monolith split into microservices; passkeys on iOS; SMS 2FA (being deprecated in favor of TOTP apps).
- **External equivalent:** for a startup, the closest off-the-shelf stack to Meta's is either Firebase Auth or Auth0 with phone OTP + social. Meta's setup isn't reproducible without an identity team.

### Comparison table

| | Firebase Auth | Supabase Auth | Auth0 | Clerk | AWS Cognito |
|---|---|---|---|---|---|
| Phone/SMS OTP | ✅ native, ~$0.01/SMS US | ✅ but you bring Twilio/MessageBird; $75/mo phone MFA add-on | ✅ but SMS via Twilio ($0.05/verify + $0.008/SMS) | ✅ built-in, incl. in plan | ✅ but SMS via SNS/Pinpoint, complex pricing |
| Apple Sign-In | ✅ first-class | ✅ | ✅ | ✅ | ✅ |
| Google Sign-In | ✅ first-class | ✅ | ✅ | ✅ | ✅ |
| Price @ 10k MAU | Free MAU tier; ~$100/mo if all 10k do 1 SMS/mo | $25/mo Pro + Twilio pass-through (~$80–130 all-in) | ~$240/mo (B2C Essentials 10k MAU) | ~$250/mo (Pro tier + MAU overage) | ~$50/mo (0.0055/MAU) + SMS |
| Next.js integration | ✅ great (`firebase/auth`, admin SDK on server) | ✅✅ best-in-class (SSR helpers, cookies) | ⚠️ okay (Auth0 Next SDK, some quirks) | ✅✅ best-in-class (drop-in `<SignIn/>`) | ⚠️ painful (Amplify or manual) |
| RN/Expo integration | ✅ works with Expo Dev Client (react-native-firebase or JS SDK); Apple Sign-In needs `expo-apple-authentication` | ✅ works with `@supabase/supabase-js` | ⚠️ works but heavy | ✅ RN SDK exists but newer | ⚠️ Amplify RN or manual |
| Vendor lock-in | Medium (Google account tied) | **Low** (Postgres, open source, can self-host) | High | High | High (AWS) |
| DB flexibility | You choose (Firestore, external Postgres, whatever) | Tied to Supabase Postgres (which is fine) | You choose | You choose | You choose |

### Migration cost if we ever swap
- **Firebase Auth → anything:** MEDIUM. You export user records (phone/email/Apple sub/Google sub), rehash session logic. Users need to re-verify SMS once. Est: 1–2 dev days + a "confirm your number" prompt on next open.
- **Supabase Auth → anything:** MEDIUM. Similar effort. Supabase's user table is normal Postgres so easier to export.
- **Auth0/Clerk → anything:** HIGH. They own more of your session/OTP/rate-limit logic; you'll rebuild all of it.
- **Cognito → anything:** VERY HIGH. Cognito user pools are notoriously sticky.

### Why NOT Supabase for this one
- Split the Plate is Next.js today, but the customer app will be React Native/Expo (like old Plait). Firebase's RN story is more mature and matches your existing muscle memory.
- Supabase's phone-auth requires you to buy Twilio Verify or wire raw Twilio yourself — more moving pieces vs. Firebase's one-line `signInWithPhoneNumber()`.
- The one real Supabase advantage (Postgres + RLS) is a payoff you don't collect on day 1; you can migrate to it later if you need relational data or open-source escape hatch.

### Why NOT Clerk/Auth0
- ~2.5x the cost of Firebase at 10k MAU.
- Clerk's `<SignIn/>` is beautiful for web but forces their UI on you — Eli's app has a strong custom design system.

---

## Old Plait Assets

### 1. Old Plait repo — absolute path
```
/Users/clawalpha/.openclaw/workspace/plait-app
```
- React Native / Expo SDK 55.
- Firebase Auth (`firebase ^12.11.0`) + `expo-auth-session ~55.0.10` already wired.
- iOS bundle built, has both `ios/` and `ios_backup/`.

### 2. Plinko component
```
/Users/clawalpha/.openclaw/workspace/plait-app/src/components/games/PlinkoGame.tsx  (1093 lines)
```
- Deterministic physics (Matter.js) with seeded drops so every party member sees identical trajectory.
- Renders with `@shopify/react-native-skia` (Canvas, Circle, Group, Rect).
- State synced via `gambleGameState.plinko` on the meal doc in Firestore.
- Uses `computeRankSplit` from `../../services/meals` to tally winners/losers.

### 3. Wheel-spin / roulette — **YES, exists**
```
/Users/clawalpha/.openclaw/workspace/plait-app/src/components/RouletteWheel.tsx  (360 lines)  ← the pure UI wheel
/Users/clawalpha/.openclaw/workspace/plait-app/src/components/games/RouletteGame.tsx  (961 lines)  ← the game wrapper (state, sync, results)
```
- 3.2s spin animation, lands on predetermined winner (sync-friendly).
- Supports even slices AND weighted slices (bigger orderer = bigger slice = more likely to lose the roll).
- Approximates SVG arcs with 180 thin colored stripes (2° each) — pure JS, no `react-native-svg` needed. Perfect for Split the Plate too.

### 4. Theme / color palette
```
/Users/clawalpha/.openclaw/workspace/plait-app/src/theme/index.ts
```
Single file, exports `colors`, `gradients`, `spacing`, `borderRadius`, `shadows`, `typography`. **"The Culinary Editorial"** design system.

### 5. Exact color palette (hex)

**Brand**
- `primary` **#ab3500** — deep brand orange (CTA gradient start, text accents)
- `primaryContainer` **#ff6b35** — bright orange (CTA gradient end, active indicators)
- `primaryGlow` `rgba(255,107,53,0.3)` — orange glow shadow

**Surfaces (layered paper effect)**
- `background` / `surface` **#fff8f1** — canvas cream
- `surfaceContainerLow` **#f9f3eb** — secondary groupings
- `surfaceContainerHigh` **#eee7df** — inputs, muted areas
- `surfaceContainerHighest` **#e8e1da** — borders, separators
- `surfaceContainerLowest` **#ffffff** — lifted cards

**Text**
- `onBackground` / `onSurface` **#1e1b17** — warm black
- `onSurfaceVariant` **#594139** — warm brown (secondary text)
- `outline` **#8c7b72** — muted icons/borders
- `outlineVariant` **#e1bfb5** — ghost borders

**Status**
- `success` **#22c55e** · `successBg` **#dcfce7** · `successText` **#15803d**
- `error` **#ef4444** · `errorBg` **#fee2e2** · `errorText` **#dc2626**
- `warning` **#f59e0b**

**Utility**
- `white` **#ffffff**
- `overlay` `rgba(30,27,23,0.6)`
- `cardShadow` `rgba(30,27,23,0.06)`
- `navShadow` `rgba(30,27,23,0.04)`

**Gradients**
- `primary`: `#ab3500 → #ff6b35` (the signature Plait CTA gradient)
- `heroFade`: `transparent → rgba(30,27,23,0.85)` (hero image bottom fade)
- `mapFade`: `transparent → #fff8f1` (map fade to cream)

**Vibe:** warm cream canvas + deep-to-bright orange CTAs + warm brown text + orange glow shadow on hero buttons. Very "editorial / analog / restaurant-menu" feeling, not tech-blue. Port this exactly to Split the Plate for brand continuity.

---

## TL;DR for Eli
- **Use Firebase Auth again.** Same as old Plait, cheapest SMS, matches OpenTable's diner pattern, works great with both Next.js and Expo.
- **Old Plait repo:** `~/.openclaw/workspace/plait-app`
- **Plinko:** `src/components/games/PlinkoGame.tsx`
- **Roulette wheel:** exists — `src/components/RouletteWheel.tsx` + `src/components/games/RouletteGame.tsx`
- **Theme to port:** `src/theme/index.ts` — cream canvas `#fff8f1` + orange gradient `#ab3500 → #ff6b35` + warm brown text `#1e1b17`.
