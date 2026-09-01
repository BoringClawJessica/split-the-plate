"use client";

import { pastMeals } from "@/lib/mock-data";
import { MapPin, GlassWater, Utensils, CreditCard, Target, CheckCircle2, Save, Check, Dice5 } from "lucide-react";
import { BackButton, HomeBottomBar } from "../PhoneNav";

const meal = pastMeals[0];

const timeline = [
  { time: "7:30 PM", event: "Arrived at Fuego & Sol", icon: <MapPin size={14} /> },
  { time: "7:45 PM", event: "First round ordered", icon: <GlassWater size={14} /> },
  { time: "8:10 PM", event: "Mains placed", icon: <Utensils size={14} /> },
  { time: "9:05 PM", event: "Check requested by Eli", icon: <CreditCard size={14} /> },
  { time: "9:12 PM", event: "Split method: Plinko", icon: <Target size={14} /> },
  { time: "9:28 PM", event: "All payments received", icon: <CheckCircle2 size={14} /> },
  { time: "9:29 PM", event: "Meal saved to history", icon: <Save size={14} /> },
];

export default function MealDetailScreen() {
  return (
    <div style={{ position: "relative", height: "100%", background: "var(--bg-base)", display: "flex", flexDirection: "column" }}>
      <BackButton to="/screen/meal-history" />
      {/* Hero */}
      <div style={{
        padding: "56px 20px 20px",
        background: "linear-gradient(160deg, rgba(245,158,11,0.1), transparent)",
        borderBottom: "1px solid var(--border)",
        flexShrink: 0,
      }}>
        <div style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--amber)",
          marginBottom: 12,
        }}>
          <Utensils size={22} strokeWidth={1.6} />
        </div>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 600, color: "var(--text)", marginBottom: 4 }}>
          {meal.restaurant}
        </div>
        <div style={{ fontSize: 13, color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}>
          {meal.date} · {meal.party.length} people · ${meal.total.toFixed(2)} total
        </div>
        <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
          <div style={{ padding: "6px 12px", borderRadius: 8, background: "rgba(22,163,74,0.15)", border: "1px solid rgba(22,163,74,0.3)", fontSize: 12, color: "#4ade80", fontFamily: "var(--font-body)", display: "inline-flex", alignItems: "center", gap: 4 }}>
            <Check size={12} /> Fully paid
          </div>
          <div style={{ padding: "6px 12px", borderRadius: 8, background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)", fontSize: 12, color: "var(--amber)", fontFamily: "var(--font-body)", display: "inline-flex", alignItems: "center", gap: 4 }}>
            <Dice5 size={12} /> Plinko split
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px 92px" }}>
        <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-body)", marginBottom: 14, textTransform: "uppercase", letterSpacing: "0.06em" }}>
          Meal Timeline
        </div>
        {timeline.map((item, idx) => (
          <div key={idx} style={{ display: "flex", gap: 12, marginBottom: 16 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
              <div style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: idx === timeline.length - 1 ? "var(--amber)" : "var(--bg-card)",
                border: `1px solid ${idx === timeline.length - 1 ? "var(--amber)" : "var(--border)"}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: idx === timeline.length - 1 ? "#000" : "var(--text-secondary)",
              }}>
                {item.icon}
              </div>
              {idx < timeline.length - 1 && (
                <div style={{ width: 1, flex: 1, background: "var(--border)", marginTop: 4 }} />
              )}
            </div>
            <div style={{ flex: 1, paddingTop: 4 }}>
              <div style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "var(--font-body)", marginBottom: 2 }}>{item.time}</div>
              <div style={{ fontSize: 13, color: "var(--text)", fontFamily: "var(--font-body)" }}>{item.event}</div>
            </div>
          </div>
        ))}

        {/* Items */}
        <div style={{ marginTop: 8 }}>
          <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-body)", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Items ordered
          </div>
          {meal.items.map((item) => (
            <div key={item} style={{ fontSize: 13, color: "var(--text-secondary)", fontFamily: "var(--font-body)", padding: "6px 0", borderBottom: "1px solid var(--border)" }}>
              · {item}
            </div>
          ))}
        </div>
      </div>
      <HomeBottomBar />
    </div>
  );
}
