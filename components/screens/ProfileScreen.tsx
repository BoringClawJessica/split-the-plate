"use client";

import { useRouter } from "next/navigation";
import { currentUser, pastMeals } from "@/lib/mock-data";
import { Settings, Edit } from "lucide-react";

export default function ProfileScreen() {
  const router = useRouter();

  return (
    <div style={{ height: "100%", background: "var(--bg-base)", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ padding: "16px 20px", display: "flex", justifyContent: "flex-end", flexShrink: 0 }}>
        <button
          onClick={() => router.push("/screen/settings")}
          style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-secondary)", display: "flex", gap: 8, alignItems: "center", fontSize: 13, fontFamily: "var(--font-body)" }}
        >
          <Settings size={18} /> Settings
        </button>
      </div>

      {/* Profile header */}
      <div style={{ padding: "0 20px 20px", flexShrink: 0, textAlign: "center" }}>
        <div style={{ position: "relative", display: "inline-block", marginBottom: 12 }}>
          <div style={{
            width: 88,
            height: 88,
            borderRadius: "50%",
            background: "linear-gradient(135deg, var(--amber), var(--orange))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 36,
            border: "4px solid var(--amber)",
            boxShadow: "0 0 24px rgba(245,158,11,0.3)",
          }}>
            🙂
          </div>
          <button
            onClick={() => router.push("/screen/settings")}
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: "var(--bg-card)",
              border: "2px solid var(--border-bright)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Edit size={12} color="var(--text)" />
          </button>
        </div>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 600, color: "var(--text)" }}>{currentUser.name}</div>
        <div style={{ fontSize: 13, color: "var(--text-muted)", fontFamily: "var(--font-body)", marginTop: 4 }}>{currentUser.handle}</div>
      </div>

      {/* Stats */}
      <div style={{ display: "flex", padding: "0 20px 20px", gap: 12, flexShrink: 0 }}>
        {[
          ["🍽️", currentUser.stats.meals, "Meals"],
          ["👥", currentUser.stats.friends, "Friends"],
          ["💰", `$${currentUser.stats.avgSpend}`, "Avg/Meal"],
        ].map(([emoji, val, label]) => (
          <div key={label} style={{
            flex: 1,
            textAlign: "center",
            padding: "14px 8px",
            borderRadius: 14,
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            cursor: "pointer",
          }}>
            <div style={{ fontSize: 20, marginBottom: 4 }}>{emoji}</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "var(--text)", fontFamily: "var(--font-body)" }}>{val}</div>
            <div style={{ fontSize: 9, color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Payment handles */}
      <div style={{ padding: "0 20px 16px", flexShrink: 0 }}>
        <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-body)", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.06em" }}>Payment Handles</div>
        <div style={{ display: "flex", gap: 8 }}>
          {[["Venmo", currentUser.venmo, "#008CFF"], ["Cash App", currentUser.cashapp, "#00C244"]].map(([name, handle, color]) => (
            <div key={name} style={{
              flex: 1,
              padding: "10px 12px",
              borderRadius: 12,
              background: "var(--bg-card)",
              border: `1px solid ${color}40`,
              cursor: "pointer",
            }}>
              <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>{name}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: color as string, fontFamily: "var(--font-body)" }}>{handle}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent meals */}
      <div style={{ flex: 1, overflowY: "auto", padding: "0 20px" }}>
        <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-body)", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.06em" }}>Recent Meals</div>
        {pastMeals.map((meal) => (
          <div
            key={meal.id}
            onClick={() => router.push("/screen/meal-detail")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "12px 0",
              borderBottom: "1px solid var(--border)",
              cursor: "pointer",
            }}
          >
            <div style={{ fontSize: 24, flexShrink: 0 }}>{meal.emoji}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text)", fontFamily: "var(--font-body)" }}>{meal.restaurant}</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>{meal.date}</div>
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--amber)", fontFamily: "var(--font-body)" }}>${meal.your_share.toFixed(2)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
