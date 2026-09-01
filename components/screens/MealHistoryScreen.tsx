"use client";

import { useRouter } from "next/navigation";
import { pastMeals, currentUser } from "@/lib/mock-data";
import { useState } from "react";
import { User, Utensils, Users, Eye, EyeOff } from "lucide-react";
import { BackButton, HomeBottomBar } from "../PhoneNav";

export default function MealHistoryScreen() {
  const router = useRouter();
  const [privacy, setPrivacy] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(pastMeals.map((m) => [m.id, false]))
  );

  const togglePrivacy = (id: string) =>
    setPrivacy((p) => ({ ...p, [id]: !p[id] }));

  return (
    <div style={{ position: "relative", height: "100%", background: "var(--bg-base)", display: "flex", flexDirection: "column" }}>
      <BackButton to="/screen/profile" />

      {/* Profile mini header */}
      <div style={{
        padding: "56px 20px 16px",
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
          border: "3px solid var(--amber)",
        }}>
          <User size={28} color="#000" strokeWidth={1.6} />
        </div>
        <div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 600, color: "var(--text)" }}>{currentUser.name}</div>
          <div style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>{currentUser.stats.meals} meals · ${currentUser.stats.avgSpend} avg spend</div>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: "flex", padding: "14px 20px", gap: 12, borderBottom: "1px solid var(--border)", flexShrink: 0 }}>
        <MiniStat icon={<Utensils size={16} color="var(--amber)" />} value={currentUser.stats.meals} label="Meals" />
        <MiniStat icon={<Users size={16} color="var(--amber)" />} value={currentUser.stats.friends} label="Friends" />
        <MiniStat icon={<span style={{ color: "var(--amber)", fontSize: 14, fontWeight: 700 }}>$</span>} value={currentUser.stats.avgSpend} label="Avg Spend" />
      </div>

      {/* Feed */}
      <div style={{ flex: 1, overflowY: "auto", padding: "12px 20px 92px" }}>
        <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-body)", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.06em" }}>
          Meal History
        </div>
        {pastMeals.map((meal) => {
          const isPublic = privacy[meal.id];
          return (
            <div
              key={meal.id}
              style={{
                padding: "14px",
                borderRadius: 16,
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                marginBottom: 10,
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                <div style={{
                  width: 52,
                  height: 52,
                  borderRadius: 14,
                  background: "var(--bg-raised)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  color: "var(--amber)",
                }}>
                  <Utensils size={22} strokeWidth={1.6} />
                </div>
                <div
                  onClick={() => router.push("/screen/meal-detail")}
                  style={{ flex: 1, cursor: "pointer" }}
                >
                  <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", fontFamily: "var(--font-body)", marginBottom: 3 }}>
                    {meal.restaurant}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-body)", marginBottom: 6 }}>
                    {meal.date} · {meal.party.length} people
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <div style={{ padding: "3px 8px", borderRadius: 6, background: "rgba(22,163,74,0.15)", fontSize: 10, color: "#4ade80", fontFamily: "var(--font-body)" }}>
                      paid
                    </div>
                    <div style={{ padding: "3px 8px", borderRadius: 6, background: "var(--bg-raised)", fontSize: 10, color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
                      {meal.split_method}
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", fontFamily: "var(--font-body)" }}>${meal.total.toFixed(2)}</div>
                    <div style={{ fontSize: 11, color: "var(--amber)", fontFamily: "var(--font-body)" }}>your ${meal.your_share.toFixed(2)}</div>
                  </div>
                  <button
                    onClick={() => togglePrivacy(meal.id)}
                    aria-label={isPublic ? "Make private" : "Make public"}
                    title={isPublic ? "Public — friends can see" : "Private — only you"}
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 8,
                      background: isPublic ? "rgba(245,158,11,0.15)" : "var(--bg-raised)",
                      border: `1px solid ${isPublic ? "rgba(245,158,11,0.35)" : "var(--border)"}`,
                      color: isPublic ? "var(--amber)" : "var(--text-muted)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                    }}
                  >
                    {isPublic ? <Eye size={13} /> : <EyeOff size={13} />}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <HomeBottomBar />
    </div>
  );
}

function MiniStat({ icon, value, label }: { icon: React.ReactNode; value: number | string; label: string }) {
  return (
    <div style={{ flex: 1, textAlign: "center" }}>
      <div style={{ marginBottom: 2, display: "flex", justifyContent: "center", height: 20, alignItems: "center" }}>{icon}</div>
      <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", fontFamily: "var(--font-body)" }}>{value}</div>
      <div style={{ fontSize: 9, color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>{label}</div>
    </div>
  );
}
