"use client";

import { useRouter } from "next/navigation";
import { currentUser, friends, pastMeals } from "@/lib/mock-data";
import { Plus, Bell, Dice5, User, Check } from "lucide-react";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <div style={{ height: "100%", background: "var(--bg-base)", display: "flex", flexDirection: "column" }}>
      {/* Top bar */}
      <div style={{
        padding: "16px 20px 12px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexShrink: 0,
      }}>
        <div>
          <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>Good evening,</div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 600, color: "var(--text)" }}>
            {currentUser.name}
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <IconBtn onClick={() => router.push("/screen/notification-settings")}>
            <Bell size={18} />
          </IconBtn>
          <div
            onClick={() => router.push("/screen/profile")}
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "linear-gradient(135deg, var(--amber), var(--orange))",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <User size={18} color="#000" strokeWidth={1.8} />
          </div>
        </div>
      </div>

      {/* Big CTA */}
      <div style={{ padding: "0 20px 16px" }}>
        <button
          onClick={() => router.push("/screen/new-split")}
          style={{
            width: "100%",
            padding: "18px 20px",
            borderRadius: 20,
            background: "linear-gradient(135deg, var(--amber), var(--orange))",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "0 8px 24px rgba(245,158,11,0.3)",
          }}
        >
          <div style={{ textAlign: "left" }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 700, color: "#000" }}>
              + New Split
            </div>
            <div style={{ fontSize: 12, color: "rgba(0,0,0,0.6)", fontFamily: "var(--font-body)", marginTop: 2 }}>
              Scan receipt or enter manually
            </div>
          </div>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            background: "rgba(0,0,0,0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <Plus size={24} color="#000" strokeWidth={3} />
          </div>
        </button>
      </div>

      {/* Friends row */}
      <div style={{ padding: "0 20px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}>Friends</div>
          <div onClick={() => router.push("/screen/friends")} style={{ fontSize: 12, color: "var(--amber)", cursor: "pointer", fontFamily: "var(--font-body)" }}>See all</div>
        </div>
        <div style={{ display: "flex", gap: 16, overflowX: "auto", paddingBottom: 4 }}>
          {/* Add friend */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, cursor: "pointer", flexShrink: 0 }}
            onClick={() => router.push("/screen/friends")}>
            <div style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              border: "2px dashed var(--border-bright)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <Plus size={18} color="var(--text-muted)" />
            </div>
            <div style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>Add</div>
          </div>
          {friends.map((f) => (
            <div key={f.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, cursor: "pointer", flexShrink: 0 }}>
              <div style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: "var(--bg-card)",
                overflow: "hidden",
                border: "2px solid var(--border)",
              }}>
                <img src={f.avatar} alt={f.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div style={{ fontSize: 10, color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}>{f.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Roll of the Day */}
      <div style={{ padding: "0 20px 16px" }}>
        <div
          onClick={() => router.push("/screen/gamble-picker")}
          style={{
            padding: "14px 16px",
            borderRadius: 16,
            background: "linear-gradient(135deg, rgba(220,38,38,0.2), rgba(234,88,12,0.2))",
            border: "1px solid rgba(220,38,38,0.3)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(220,38,38,0.25)", display: "flex", alignItems: "center", justifyContent: "center", color: "#f87171" }}>
            <Dice5 size={22} strokeWidth={1.8} />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", fontFamily: "var(--font-body)" }}>
              Roll of the Day
            </div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
              Win dinner for your table tonight · Tap to gamble
            </div>
          </div>
        </div>
      </div>

      {/* Recent splits */}
      <div style={{ flex: 1, overflow: "hidden", padding: "0 20px" }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 12, fontFamily: "var(--font-body)" }}>Recent Splits</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, overflowY: "auto", height: "calc(100% - 30px)" }}>
          {pastMeals.map((meal) => (
            <div
              key={meal.id}
              onClick={() => router.push("/screen/meal-detail")}
              style={{
                padding: "14px 16px",
                borderRadius: 16,
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <div style={{ width: 40, height: 40, borderRadius: 12, background: "var(--bg-raised)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--amber)", flexShrink: 0 }}>
                <User size={20} strokeWidth={1.6} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", fontFamily: "var(--font-body)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {meal.restaurant}
                </div>
                <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-body)", marginTop: 2 }}>
                  {meal.date} · {meal.party.length} people · {meal.split_method}
                </div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: "var(--amber)", fontFamily: "var(--font-body)" }}>
                  ${meal.your_share.toFixed(2)}
                </div>
                <div style={{ fontSize: 10, color: "var(--green)", fontFamily: "var(--font-body)", display: "inline-flex", alignItems: "center", gap: 3 }}><Check size={10} /> paid</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function IconBtn({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: 36,
        height: 36,
        borderRadius: "50%",
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--text-secondary)",
      }}
    >
      {children}
    </button>
  );
}
