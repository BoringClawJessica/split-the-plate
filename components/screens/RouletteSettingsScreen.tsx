"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Minus, Plus, RotateCcw } from "lucide-react";
import { BackButton, HomeBottomBar } from "../PhoneNav";
import { currentUser, friends } from "@/lib/mock-data";

// Mock participants (parallel to Plinko/Roulette game screens)
const PARTICIPANTS = [
  { id: currentUser.id, name: "Eli",    avatar: currentUser.avatar },
  { id: friends[0].id,  name: "Sofia",  avatar: friends[0].avatar },
  { id: friends[1].id,  name: "Marcus", avatar: friends[1].avatar },
  { id: friends[2].id,  name: "Jade",   avatar: friends[2].avatar },
];

export default function RouletteSettingsScreen() {
  const router = useRouter();
  const [counts, setCounts] = useState<Record<string, number>>(
    () => Object.fromEntries(PARTICIPANTS.map((p) => [p.name, 1]))
  );

  const totalSlices = Object.values(counts).reduce((s, n) => s + n, 0);

  const bump = (name: string, delta: number) => {
    setCounts((prev) => ({
      ...prev,
      [name]: Math.max(1, Math.min(5, (prev[name] ?? 1) + delta)),
    }));
  };

  const resetEven = () => {
    setCounts(Object.fromEntries(PARTICIPANTS.map((p) => [p.name, 1])));
  };

  const spin = () => {
    const encoded = PARTICIPANTS
      .map((p) => `${p.name.toLowerCase()}:${counts[p.name] ?? 1}`)
      .join(",");
    router.push(`/screen/roulette?counts=${encoded}`);
  };

  return (
    <div style={{ position: "relative", height: "100%", background: "var(--bg-base)", display: "flex", flexDirection: "column" }}>
      <BackButton to="/screen/gamble-picker" />
      <div style={{ padding: "56px 20px 12px", flexShrink: 0 }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 600, color: "var(--text)" }}>
          Wheel settings
        </div>
        <div style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "var(--font-body)", marginTop: 4 }}>
          Give someone more slices, more chance of getting picked.
        </div>
      </div>

      {/* Total slices banner */}
      <div style={{
        margin: "0 20px 14px",
        padding: "10px 14px",
        borderRadius: 12,
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexShrink: 0,
      }}>
        <span style={{ fontSize: 12, color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}>Total slices on the wheel</span>
        <span style={{ fontSize: 15, fontWeight: 700, color: "var(--amber)", fontFamily: "var(--font-body)" }}>{totalSlices}</span>
      </div>

      {/* People list */}
      <div style={{ flex: 1, overflowY: "auto", padding: "0 20px 8px" }}>
        {PARTICIPANTS.map((p) => {
          const c = counts[p.name] ?? 1;
          const pct = (c / totalSlices) * 100;
          return (
            <div key={p.id} style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "12px 14px",
              borderRadius: 12,
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              marginBottom: 8,
            }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.avatar} alt={p.name} style={{ width: 40, height: 40, borderRadius: "50%", border: "2px solid var(--border)" }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", fontFamily: "var(--font-body)" }}>{p.name}</div>
                <div style={{ fontSize: 11, color: "var(--amber)", fontFamily: "var(--font-body)", marginTop: 2 }}>
                  {pct.toFixed(0)}% chance
                </div>
              </div>
              <button
                onClick={() => bump(p.name, -1)}
                aria-label="Fewer slices"
                disabled={c <= 1}
                style={{ ...stepBtnStyle, opacity: c <= 1 ? 0.4 : 1, cursor: c <= 1 ? "not-allowed" : "pointer" }}
              >
                <Minus size={13} />
              </button>
              <div style={{
                minWidth: 26,
                textAlign: "center",
                fontSize: 15,
                fontWeight: 700,
                color: "var(--text)",
                fontFamily: "var(--font-body)",
              }}>
                {c}
              </div>
              <button
                onClick={() => bump(p.name, 1)}
                aria-label="More slices"
                disabled={c >= 5}
                style={{ ...stepBtnStyle, opacity: c >= 5 ? 0.4 : 1, cursor: c >= 5 ? "not-allowed" : "pointer" }}
              >
                <Plus size={13} />
              </button>
            </div>
          );
        })}

        <button
          onClick={resetEven}
          style={{
            width: "100%",
            padding: "10px",
            marginTop: 6,
            borderRadius: 12,
            background: "transparent",
            border: "1px solid var(--border-bright)",
            color: "var(--text-secondary)",
            fontSize: 12,
            fontFamily: "var(--font-body)",
            fontWeight: 600,
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
          }}
        >
          <RotateCcw size={13} /> Reset to even
        </button>
      </div>

      <div style={{ padding: "16px 20px 24px", borderTop: "1px solid var(--border)", background: "var(--bg-surface)", flexShrink: 0 }}>
        <button
          onClick={spin}
          style={{
            width: "100%",
            padding: "15px",
            borderRadius: 14,
            background: "linear-gradient(135deg, #F59E0B 0%, #EA580C 100%)",
            color: "#1a1510",
            fontWeight: 800,
            fontSize: 15,
            border: "none",
            cursor: "pointer",
            fontFamily: "var(--font-body)",
            boxShadow: "0 8px 22px rgba(234,88,12,0.3)",
          }}
        >
          Spin
        </button>
      </div>
      <HomeBottomBar hidden />
    </div>
  );
}

const stepBtnStyle: React.CSSProperties = {
  width: 28,
  height: 28,
  borderRadius: 8,
  background: "var(--bg-raised)",
  border: "1px solid var(--border-bright)",
  color: "var(--text)",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  flexShrink: 0,
};
