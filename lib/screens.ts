export interface Screen {
  slug: string;
  title: string;
  group: string;
  phase?: string;
}

export const screens: Screen[] = [
  // ONBOARDING
  { slug: "splash", title: "Splash", group: "Onboarding" },
  { slug: "signin", title: "Sign In", group: "Onboarding" },
  { slug: "profile-setup", title: "Username & Photo", group: "Onboarding" },
  { slug: "notifications-permission", title: "Notifications", group: "Onboarding" },

  // HOME
  { slug: "home", title: "Home", group: "Home" },
  { slug: "friends", title: "Friends", group: "Home" },
  { slug: "home-empty", title: "Empty State", group: "Home" },

  // NEW SPLIT
  { slug: "new-split", title: "New Split", group: "New Split" },
  { slug: "add-people", title: "Add People", group: "New Split" },
  { slug: "camera-scan", title: "Scan Receipt", group: "New Split" },
  { slug: "items-detected", title: "Items Detected", group: "New Split" },
  { slug: "split-method", title: "Split Method", group: "New Split" },
  { slug: "by-item", title: "By Item", group: "New Split" },
  { slug: "custom-split", title: "Custom Split", group: "New Split" },
  { slug: "even-split", title: "Even Split", group: "New Split" },
  { slug: "review-confirm", title: "Review & Confirm", group: "New Split" },
  { slug: "tip-phase", title: "Add Your Tip", group: "New Split" },
  { slug: "payment-handoff", title: "Payment Handoff", group: "New Split" },
  { slug: "leader-dashboard", title: "Leader Dashboard", group: "New Split" },

  // GAMBLE PAY
  { slug: "gamble-picker", title: "Gamble Mode", group: "Gamble Pay" },
  { slug: "plinko-settings", title: "Plinko Settings", group: "Gamble Pay" },
  { slug: "plinko", title: "Plinko", group: "Gamble Pay" },
  { slug: "roulette-settings", title: "Wheel Settings", group: "Gamble Pay" },
  { slug: "roulette", title: "Spin the Wheel", group: "Gamble Pay" },
  { slug: "gamble-results", title: "Results", group: "Gamble Pay" },

  // MEAL MEMORY
  { slug: "meal-detail", title: "Meal Detail", group: "Meal Memory" },
  { slug: "meal-history", title: "Recent Meals", group: "Meal Memory" },

  // PROFILE & SETTINGS
  { slug: "profile", title: "Profile", group: "Profile & Settings" },
  { slug: "settings", title: "Settings", group: "Profile & Settings" },
  { slug: "payment-methods", title: "Payment Methods", group: "Profile & Settings" },
  { slug: "privacy", title: "Privacy", group: "Profile & Settings" },
  { slug: "notifications", title: "Notifications Inbox", group: "Profile & Settings" },
  { slug: "notification-settings", title: "Notification Settings", group: "Profile & Settings" },

  // EDGE STATES
  { slug: "receipt-not-found", title: "Receipt Not Found", group: "Edge States" },
  { slug: "no-friends", title: "No Friends Yet", group: "Edge States" },
  { slug: "no-splits", title: "No Splits Yet", group: "Edge States" },
  { slug: "payment-failed", title: "Payment Failed", group: "Edge States" },
  { slug: "offline", title: "Offline Banner", group: "Edge States" },

  // PHASE 1-4 PREVIEW
  { slug: "reservations-preview", title: "Reservations", group: "Coming Soon", phase: "Phase 1" },
  { slug: "preorder-preview", title: "Pre-Order Menu", group: "Coming Soon", phase: "Phase 1" },
  { slug: "active-meal-preview", title: "Active Meal / QR", group: "Coming Soon", phase: "Phase 1" },
  { slug: "order-cart-preview", title: "Order & Cart", group: "Coming Soon", phase: "Phase 2" },
  { slug: "staff-mode-preview", title: "Staff Mode", group: "Coming Soon", phase: "Phase 2" },
  { slug: "owner-dashboard-preview", title: "Owner Dashboard", group: "Coming Soon", phase: "Phase 3" },
  { slug: "loyalty-preview", title: "Loyalty", group: "Coming Soon", phase: "Phase 3" },
  { slug: "gift-cards-preview", title: "Gift Cards", group: "Coming Soon", phase: "Phase 3" },
  { slug: "leaderboards-preview", title: "Leaderboards", group: "Coming Soon", phase: "Phase 4" },
  { slug: "ai-eats-preview", title: "AI 'What to Eat?'", group: "Coming Soon", phase: "Phase 4" },
];

export const screenGroups = screens.reduce((acc, screen) => {
  if (!acc[screen.group]) acc[screen.group] = [];
  acc[screen.group].push(screen);
  return acc;
}, {} as Record<string, Screen[]>);

export function getScreenIndex(slug: string) {
  return screens.findIndex((s) => s.slug === slug);
}

export function getPrevScreen(slug: string) {
  const idx = getScreenIndex(slug);
  return idx > 0 ? screens[idx - 1] : null;
}

export function getNextScreen(slug: string) {
  const idx = getScreenIndex(slug);
  return idx < screens.length - 1 ? screens[idx + 1] : null;
}
