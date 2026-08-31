"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { friends, currentUser } from "@/lib/mock-data";

const PEOPLE = [
  { id: currentUser.id, name: "Eli", avatar: currentUser.avatar },
  ...friends.slice(0, 3).map((f) => ({ id: f.id, name: f.name, avatar: f.avatar })),
];

const total = 187 * 1.08;
const evenShare = total / PEOPLE.length;

export default function HalfOffScreen() {
  const router = useRouter();
  const [phase, setPhase] = useState<"ready" | "spinning" | "done">("ready");
  const [winner, setWinner] = useState<number | null>(null);
  const [highlighted, setHighlighted] = useState<number | null>(null);

  const spin = () => {
    if (phase !== "ready") return;
    setPhase("spinning");
    let count = 0;
    const maxCount = 20 + Math.floor(Math.random() * 12);
    const interval = setInterval(() => {
      setHighlighted((h) => (h === null ? 0 : (h + 1) % PEOPLE.length));
      count++;
      if (count >= maxCount) {
        clearInterval(interval);
        const w = Math.floor(Math.random() * PEOPLE.length);
        setWinner(w);
        setHighlighted(w);
        setPhase("done");
      }
    }, 150);
  };

  const getAmount = (idx: number) => {
    if (winner === null) return evenShare;
    if (idx === winner) return evenShare * 0.5;
    const leftover = total - evenShare * 0.5;
    return leftover / (PEOPLE.length - 1);
  };

  return (
    <div style={{ height: "100%", background: "var(--bg-base)", display: "flex", flexDirection: "column", padding: "28px 20px" }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 600, color: "var(--text)" }}>Half-Off Roulette 💸</div>
        <div style={{ fontSize: 13, color: "var(--text-secondary)", fontFamily: "var(--font-body)", marginTop: 4 }}>
          One lucky person pays half. Everyone else splits the difference.
        </div>
      </div>

      {/* Person cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 24 }}>
        {PEOPLE.map((p, idx) => (
          <div
            key={p.id}
            style={{
              padding: "16px",
              borderRadius: 16,
              background: highlighted === idx ? "rgba(245,158,11,0.15)" : "var(--bg-card)",
              border: `1.5px solid ${highlighted === idx ? "var(--amber)" : "var(--border)"}`,
              textAlign: "center",
              transition: "all 0.1s",
              position: "relative",
            }}
          >
            {winner === idx && (
              <div style={{
                position: "absolute",
                top: -8,
                right: -8,
                background: "var(--amber)",
                borderRadius: "50%",
                width: 24,
                height: 24,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
              }}>
                🎉
              </div>
            )}
            <img src={p.avatar} alt={p.name} style={{ width: 44, height: 44, borderRadius: "50%", border: "2px solid var(--border)", marginBottom: 8 }} />
            <div style={{ fontSize: 13, fontWeight: 600, color: highlighted === idx ? "var(--amber)" : "var(--text)", fontFamily: "var(--font-body)" }}>{p.name}</div>
            {phase === "done" && (
              <div style={{
                fontSize: 15,
                fontWeight: 700,
                color: winner === idx ? "var(--green)" : "var(--text-secondary)",
                fontFamily: "var(--font-body)",
                marginTop: 4,
              }}>
                ${getAmount(idx).toFixed(2)}
                {winner === idx && <span style={{ fontSize: 10, color: "var(--green)", marginLeft: 4 }}>50% off!</span>}
              </div>
            )}
          </div>
        ))}
      </div>

      {phase === "done" && winner !== null && (
        <div style={{
          padding: "16px",
          borderRadius: 14,
          background: "rgba(22,163,74,0.1)",
          border: "1px solid rgba(22,163,74,0.3)",
          textAlign: "center",
          marginBottom: 16,
          animation: "bounce-in 0.4s ease",
        }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 600, color: "var(--green)" }}>
            🎉 {PEOPLE[winner].name} gets 50% off!
          </div>
          <div style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "var(--font-body)", marginTop: 4 }}>
            Others each pay ${getAmount(0).toFixed(2)}
          </div>
        </div>
      )}

      <div style={{ flex: 1 }} />

      <button
        onClick={phase === "done" ? () => router.push("/screen/gamble-results") : spin}
        style={{
          width: "100%", padding: "16px", borderRadius: 14,
          background: phase === "done" ? "var(--amber)" : "linear-gradient(135deg, #16a34a, #0891b2)",
          color: phase === "done" ? "#000" : "#fff",
          fontWeight: 700, fontSize: 15, border: "none",
          cursor: phase === "spinning" ? "not-allowed" : "pointer",
          fontFamily: "var(--font-body)",
          opacity: phase === "spinning" ? 0.7 : 1,
        }}
      >
        {phase === "ready" ? "💸 Spin!" : phase === "spinning" ? "Spinning..." : "See Breakdown →"}
      </button>
    </div>
  );
}
