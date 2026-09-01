"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { pastMeals, splitMethodLabels } from "@/lib/mock-data";
import { Utensils, Eye, EyeOff } from "lucide-react";
import { BackButton, HomeBottomBar } from "../PhoneNav";

export default function MealHistoryScreen() {
  const router = useRouter();
  const [privacy, setPrivacy] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(pastMeals.map((m) => [m.id, false]))
  );

  const togglePrivacy = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPrivacy((p) => ({ ...p, [id]: !p[id] }));
  };

  return (
    <div style={{ position: "relative", height: "100%", background: "var(--bg-base)", display: "flex", flexDirection: "column" }}>
      <BackButton to="/screen/home" />

      <div style={{ padding: "56px 20px 12px", flexShrink: 0 }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 600, color: "var(--text)" }}>
          Recent Meals
        </div>
        <div style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "var(--font-body)", marginTop: 4 }}>
          {pastMeals.length} meals · tap any to open
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "8px 20px 96px" }}>
        {pastMeals.map((meal) => {
          const isPublic = privacy[meal.id];
          const paidCount = meal.people.filter((p) => p.status === "paid").length;
          const total = meal.people.length;
          const allPaid = paidCount === total;

          return (
            <div
              key={meal.id}
              onClick={() => router.push("/screen/meal-detail")}
              style={{
                padding: "14px",
                borderRadius: 16,
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                marginBottom: 12,
                cursor: "pointer",
              }}
            >
              {/* Top row: restaurant + date + privacy */}
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 10 }}>
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: "var(--bg-raised)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--amber)",
                  flexShrink: 0,
                }}>
                  <Utensils size={20} strokeWidth={1.6} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 600, color: "var(--text)", fontFamily: "var(--font-body)" }}>
                    {meal.restaurant}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-body)", marginTop: 2 }}>
                    {meal.date}
                  </div>
                </div>
                <button
                  onClick={(e) => togglePrivacy(meal.id, e)}
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
                    flexShrink: 0,
                  }}
                >
                  {isPublic ? <Eye size={13} /> : <EyeOff size={13} />}
                </button>
              </div>

              {/* Middle row: avatar stack + names */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <div style={{ display: "flex" }}>
                  {meal.people.slice(0, 4).map((p, idx) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={p.id}
                      src={p.avatar}
                      alt={p.name}
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: "50%",
                        border: "2px solid var(--bg-card)",
                        marginLeft: idx === 0 ? 0 : -8,
                        background: "var(--bg-raised)",
                      }}
                    />
                  ))}
                </div>
                <div style={{
                  fontSize: 12,
                  color: "var(--text-secondary)",
                  fontFamily: "var(--font-body)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}>
                  {meal.people.map((p) => p.name).join(", ")}
                </div>
              </div>

              {/* Bottom row: split method tag + payment status pill */}
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <span style={{
                  padding: "4px 10px",
                  borderRadius: 8,
                  background: "var(--bg-raised)",
                  fontSize: 11,
                  color: "var(--text-muted)",
                  fontFamily: "var(--font-body)",
                }}>
                  {splitMethodLabels[meal.splitMethod]}
                </span>
                <span style={{
                  padding: "4px 10px",
                  borderRadius: 8,
                  background: allPaid ? "rgba(22,163,74,0.15)" : "rgba(245,158,11,0.15)",
                  fontSize: 11,
                  color: allPaid ? "#4ade80" : "var(--amber)",
                  fontFamily: "var(--font-body)",
                  fontWeight: 500,
                }}>
                  {allPaid ? "All paid" : `Waiting on ${total - paidCount}`}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      <HomeBottomBar />
    </div>
  );
}
