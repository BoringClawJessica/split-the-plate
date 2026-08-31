"use client";

import { useRouter } from "next/navigation";
import { pastMeals, currentUser } from "@/lib/mock-data";

export default function MealHistoryScreen() {
  const router = useRouter();

  return (
    <div style={{ height: "100%", background: "var(--bg-base)", display: "flex", flexDirection: "column" }}>
      {/* Profile mini header */}
      <div style={{
        padding: "20px 20px 16px",
        display: "flex",
        alignItems: "center",
        gap: 14,
        borderBottom: "1px solid var(--border)",
        flexShrink: 0,
      }}>
        <div style={{
          width: 60,
          height: 60,
          borderRadius: "50%",
          background: "linear-gradient(135deg, var(--amber), var(--orange))",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 24,
          border: "3px solid var(--amber)",
        }}>
          🙂
        </div>
        <div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 600, color: "var(--text)" }}>Eli</div>
          <div style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>{currentUser.stats.meals} meals · ${currentUser.stats.avgSpend} avg spend</div>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: "flex", padding: "14px 20px", gap: 12, borderBottom: "1px solid var(--border)", flexShrink: 0 }}>
        {[
          ["🍽️", currentUser.stats.meals, "Meals"],
          ["👥", currentUser.stats.friends, "Friends"],
          ["💰", `$${currentUser.stats.avgSpend}`, "Avg Spend"],
          ["🎲", "7", "Gambles"],
        ].map(([emoji, val, label]) => (
          <div key={label} style={{ flex: 1, textAlign: "center" }}>
            <div style={{ fontSize: 18, marginBottom: 2 }}>{emoji}</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", fontFamily: "var(--font-body)" }}>{val}</div>
            <div style={{ fontSize: 9, color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Feed */}
      <div style={{ flex: 1, overflowY: "auto", padding: "12px 20px" }}>
        <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-body)", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.06em" }}>
          Meal History
        </div>
        {pastMeals.map((meal) => (
          <div
            key={meal.id}
            onClick={() => router.push("/screen/meal-detail")}
            style={{
              padding: "16px",
              borderRadius: 16,
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              marginBottom: 10,
              cursor: "pointer",
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
              <div style={{
                width: 56,
                height: 56,
                borderRadius: 14,
                background: "var(--bg-raised)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 28,
                flexShrink: 0,
              }}>
                {meal.emoji}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", fontFamily: "var(--font-body)", marginBottom: 3 }}>
                  {meal.restaurant}
                </div>
                <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-body)", marginBottom: 6 }}>
                  {meal.date} · {meal.party.length} people
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <div style={{ padding: "3px 8px", borderRadius: 6, background: "rgba(22,163,74,0.15)", fontSize: 10, color: "#4ade80", fontFamily: "var(--font-body)" }}>
                    ✓ paid
                  </div>
                  <div style={{ padding: "3px 8px", borderRadius: 6, background: "var(--bg-raised)", fontSize: 10, color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
                    {meal.split_method}
                  </div>
                </div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", fontFamily: "var(--font-body)" }}>${meal.total.toFixed(2)}</div>
                <div style={{ fontSize: 11, color: "var(--amber)", fontFamily: "var(--font-body)" }}>your ${meal.your_share.toFixed(2)}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
