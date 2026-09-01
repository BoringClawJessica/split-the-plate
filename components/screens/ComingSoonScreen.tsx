"use client";

import { useRouter } from "next/navigation";
import {
  Calendar,
  GlassWater,
  Smartphone,
  ShoppingCart,
  ChefHat,
  BarChart3,
  Star,
  Gift,
  Trophy,
  Bot,
  Rocket,
  Lock,
} from "lucide-react";
import { BackButton, HomeBottomBar } from "../PhoneNav";

type Detail = { icon: React.ReactNode; title: string; desc: string; phase: string; bullets: string[] };

const screenDetails: Record<string, Detail> = {
  "reservations-preview": {
    icon: <Calendar size={48} strokeWidth={1.5} />,
    title: "Reservations",
    desc: "Book the perfect table — with 3D floor plans, real-time availability, and 5-minute holds.",
    phase: "Phase 1",
    bullets: ["3D restaurant walkthrough", "5-min table hold", "Party size & notes", "Waitlist join"],
  },
  "preorder-preview": {
    icon: <GlassWater size={48} strokeWidth={1.5} />,
    title: "Pre-Order Menu",
    desc: "Your first course and drinks are on the table when you sit down. No waiting, no awkward flag-waving.",
    phase: "Phase 1",
    bullets: ["Pre-pay for first course", "Drinks waiting on arrival", "Advanced kitchen prep", "$5-10 convenience fee"],
  },
  "active-meal-preview": {
    icon: <Smartphone size={48} strokeWidth={1.5} />,
    title: "Active Meal / QR",
    desc: "Scan the QR at your table to join the meal, see the running order, and split in real-time.",
    phase: "Phase 1",
    bullets: ["TOTP-rotating QR", "Auto-join via location", "Running check live", "Call waiter silently"],
  },
  "order-cart-preview": {
    icon: <ShoppingCart size={48} strokeWidth={1.5} />,
    title: "Order & Cart",
    desc: "Browse the full menu, add items to your cart, and the kitchen gets the ticket instantly.",
    phase: "Phase 2",
    bullets: ["Full menu with photos", "Dietary conflict warnings", "Add to running tab", "Shared table cart"],
  },
  "staff-mode-preview": {
    icon: <ChefHat size={48} strokeWidth={1.5} />,
    title: "Staff Mode",
    desc: "One app, one screen per role — host, waiter, bartender, kitchen. Real-time, no radio.",
    phase: "Phase 2",
    bullets: ["Host: floor plan + queue", "Waiter: table orders", "Kitchen: live ticket display", "Force check, comps, voids"],
  },
  "owner-dashboard-preview": {
    icon: <BarChart3 size={48} strokeWidth={1.5} />,
    title: "Owner Dashboard",
    desc: "Live tonight's covers, weekly revenue, menu performance, and staff scheduling — all in one place.",
    phase: "Phase 3",
    bullets: ["Live table revenue", "Menu performance", "Staff scheduling", "Chain-level analytics"],
  },
  "loyalty-preview": {
    icon: <Star size={48} strokeWidth={1.5} />,
    title: "Loyalty",
    desc: "Earn points on every meal, unlock rewards, and climb the restaurant leaderboard.",
    phase: "Phase 3",
    bullets: ["Points on every meal", "Restaurant-specific rewards", "Premium benefits", "VIP priority reservations"],
  },
  "gift-cards-preview": {
    icon: <Gift size={48} strokeWidth={1.5} />,
    title: "Gift Cards",
    desc: "Send digital gift cards for any restaurant on Split the Plate. Perfect for birthdays, celebrations, thank-yous.",
    phase: "Phase 3",
    bullets: ["Send to any user", "Any amount", "Restaurant-specific", "Shareable link"],
  },
  "leaderboards-preview": {
    icon: <Trophy size={48} strokeWidth={1.5} />,
    title: "Leaderboards",
    desc: "Who's the top diner in your city? Compete on meals, spend, and gamble wins.",
    phase: "Phase 4",
    bullets: ["City-wide rankings", "Friend leaderboards", "Most adventurous eater", "Gamble champion"],
  },
  "ai-eats-preview": {
    icon: <Bot size={48} strokeWidth={1.5} />,
    title: "AI 'What Should I Eat?'",
    desc: "Tell the AI what you're feeling — it asks a few questions and recommends restaurants + dishes.",
    phase: "Phase 4",
    bullets: ["Voice input", "Mood + craving filters", "Personalized picks", "Group consensus mode"],
  },
};

export default function ComingSoonScreen({ slug }: { slug: string }) {
  const router = useRouter();
  const details: Detail = screenDetails[slug] || {
    icon: <Rocket size={48} strokeWidth={1.5} />,
    title: "Coming Soon",
    desc: "This feature is part of a future phase of Split the Plate.",
    phase: "Future",
    bullets: [],
  };

  return (
    <div style={{ position: "relative", height: "100%", background: "var(--bg-base)", display: "flex", flexDirection: "column", padding: "56px 24px 92px" }}>
      <BackButton to="/screen/home" />
      {/* Phase badge */}
      <div style={{ marginBottom: 20 }}>
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          padding: "6px 12px",
          borderRadius: 8,
          background: "rgba(245,158,11,0.1)",
          border: "1px solid rgba(245,158,11,0.3)",
        }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--amber)" }} />
          <span style={{ fontSize: 11, color: "var(--amber)", fontFamily: "var(--font-body)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>
            {details.phase} · Coming Soon
          </span>
        </div>
      </div>

      <div style={{
        width: 76,
        height: 76,
        borderRadius: 20,
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--amber)",
        marginBottom: 16,
      }}>
        {details.icon}
      </div>
      <div style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 600, color: "var(--text)", marginBottom: 12, lineHeight: 1.2 }}>
        {details.title}
      </div>
      <div style={{ fontSize: 14, color: "var(--text-secondary)", fontFamily: "var(--font-body)", lineHeight: 1.7, marginBottom: 24 }}>
        {details.desc}
      </div>

      {details.bullets.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          {details.bullets.map((b) => (
            <div key={b} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--amber)", flexShrink: 0 }} />
              <span style={{ fontSize: 14, color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}>{b}</span>
            </div>
          ))}
        </div>
      )}

      {/* Blurred preview mockup */}
      <div style={{
        flex: 1,
        borderRadius: 16,
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        marginBottom: 20,
        minHeight: 80,
      }}>
        <div style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          gap: 8,
          padding: 16,
          filter: "blur(4px)",
          opacity: 0.3,
        }}>
          {[80, 100, 60, 90, 70].map((w, i) => (
            <div key={i} style={{ height: 12, width: `${w}%`, borderRadius: 6, background: "var(--border-bright)" }} />
          ))}
        </div>
        <div style={{
          position: "relative",
          textAlign: "center",
          padding: "16px 24px",
          borderRadius: 12,
          background: "rgba(8,6,3,0.85)",
          border: "1px solid rgba(245,158,11,0.3)",
        }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 6, color: "var(--amber)" }}>
            <Lock size={20} strokeWidth={1.8} />
          </div>
          <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--amber)", fontWeight: 600 }}>Preview locked</div>
          <div style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--text-muted)", marginTop: 3 }}>Coming in {details.phase}</div>
        </div>
      </div>

      <button
        onClick={() => router.push("/screen/home")}
        style={{
          width: "100%", padding: "14px", borderRadius: 14,
          background: "var(--bg-card)",
          color: "var(--text-secondary)",
          fontSize: 14, border: "1px solid var(--border)", cursor: "pointer",
          fontFamily: "var(--font-body)",
        }}
      >
        Back to Home
      </button>
      <HomeBottomBar />
    </div>
  );
}
