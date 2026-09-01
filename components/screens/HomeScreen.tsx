"use client";

import { useRouter } from "next/navigation";
import { currentUser, friends, pastMeals, splitMethodLabels } from "@/lib/mock-data";
import { Plus, Bell, User, Home as HomeIcon, Utensils } from "lucide-react";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <div style={{ position: "relative", height: "100%", background: "var(--bg-base)", display: "flex", flexDirection: "column" }}>
      {/* Top bar — greeting on left, bell + avatar on right */}
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
          <IconBtn onClick={() => router.push("/screen/notifications")} aria-label="Notifications inbox">
            <Bell size={18} />
          </IconBtn>
          <button
            onClick={() => router.push("/screen/profile")}
            aria-label="Profile"
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "linear-gradient(135deg, var(--amber), var(--orange))",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "none",
              padding: 0,
            }}
          >
            <User size={18} color="#000" strokeWidth={1.8} />
          </button>
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
              New Split
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
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={f.avatar} alt={f.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div style={{ fontSize: 10, color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}>{f.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Meals */}
      <div style={{ flex: 1, overflow: "hidden", padding: "0 20px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}>Recent Meals</div>
          <div onClick={() => router.push("/screen/meal-history")} style={{ fontSize: 12, color: "var(--amber)", cursor: "pointer", fontFamily: "var(--font-body)" }}>See all</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, overflowY: "auto", height: "calc(100% - 30px)", paddingBottom: 84 }}>
          {pastMeals.map((meal) => {
            const paidCount = meal.people.filter((p) => p.status === "paid").length;
            const total = meal.people.length;
            const allPaid = paidCount === total;
            return (
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
                  <Utensils size={20} strokeWidth={1.6} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", fontFamily: "var(--font-body)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {meal.restaurant}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-body)", marginTop: 2 }}>
                    {meal.date} · {meal.people.length} people
                  </div>
                  <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
                    <div style={{ padding: "2px 7px", borderRadius: 6, background: "var(--bg-raised)", fontSize: 10, color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
                      {splitMethodLabels[meal.splitMethod]}
                    </div>
                    <div style={{
                      padding: "2px 7px",
                      borderRadius: 6,
                      background: allPaid ? "rgba(22,163,74,0.15)" : "rgba(245,158,11,0.15)",
                      fontSize: 10,
                      color: allPaid ? "#4ade80" : "var(--amber)",
                      fontFamily: "var(--font-body)",
                    }}>
                      {allPaid ? "All paid" : `Waiting on ${total - paidCount}`}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Home bottom bar — Home + Plus */}
      <HomeTwoButtonBar />
    </div>
  );
}

function HomeTwoButtonBar() {
  const router = useRouter();
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 15,
        display: "flex",
        justifyContent: "center",
        gap: 22,
        padding: "10px 0 14px",
        background:
          "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.35) 60%, rgba(0,0,0,0.55) 100%)",
        pointerEvents: "none",
      }}
    >
      <button
        onClick={() => router.push("/screen/home")}
        aria-label="Home"
        style={{
          pointerEvents: "auto",
          width: 52,
          height: 52,
          borderRadius: 999,
          background: "linear-gradient(135deg, var(--amber), var(--orange))",
          border: "none",
          color: "#000",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          boxShadow: "0 8px 20px rgba(245,158,11,0.35)",
        }}
      >
        <HomeIcon size={22} strokeWidth={2.4} />
      </button>
      <button
        onClick={() => router.push("/screen/new-split")}
        aria-label="New Split"
        style={{
          pointerEvents: "auto",
          width: 52,
          height: 52,
          borderRadius: 999,
          background: "var(--bg-card)",
          border: "1px solid var(--border-bright)",
          color: "var(--text)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          boxShadow: "0 6px 16px rgba(0,0,0,0.25)",
        }}
      >
        <Plus size={22} strokeWidth={2.4} />
      </button>
    </div>
  );
}

function IconBtn({ children, onClick, ...rest }: { children: React.ReactNode; onClick?: () => void; [k: string]: unknown }) {
  return (
    <button
      onClick={onClick}
      {...rest}
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
