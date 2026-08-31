"use client";

import { useRouter } from "next/navigation";
import { friends, currentUser, paymentMethods } from "@/lib/mock-data";

const PEOPLE = [
  { id: currentUser.id, name: "Eli", avatar: currentUser.avatar, pct: 15, you: true },
  { id: friends[0].id, name: "Sofia", avatar: friends[0].avatar, pct: 40 },
  { id: friends[1].id, name: "Marcus", avatar: friends[1].avatar, pct: 25 },
  { id: friends[2].id, name: "Jade", avatar: friends[2].avatar, pct: 20 },
];

const total = 187 * 1.08;

export default function GambleResultsScreen() {
  const router = useRouter();
  const sorted = [...PEOPLE].sort((a, b) => a.pct - b.pct);

  return (
    <div style={{ height: "100%", background: "var(--bg-base)", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "20px 20px 12px", flexShrink: 0 }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 600, color: "var(--text)" }}>
          Results 🎲
        </div>
        <div style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "var(--font-body)", marginTop: 4 }}>
          Plinko final — total ${total.toFixed(2)}
        </div>
      </div>

      {/* Winner banner */}
      <div style={{
        margin: "0 20px 16px",
        padding: "16px",
        borderRadius: 16,
        background: "linear-gradient(135deg, rgba(245,158,11,0.15), rgba(22,163,74,0.1))",
        border: "1px solid rgba(245,158,11,0.3)",
        display: "flex",
        alignItems: "center",
        gap: 12,
        flexShrink: 0,
      }}>
        <div style={{ fontSize: 40 }}>🏆</div>
        <div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 600, color: "var(--amber)" }}>
            You got lucky, Eli!
          </div>
          <div style={{ fontSize: 13, color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}>
            Lowest share at 15% · ${(total * 0.15).toFixed(2)}
          </div>
        </div>
      </div>

      {/* Breakdown */}
      <div style={{ flex: 1, overflowY: "auto", padding: "0 20px" }}>
        {sorted.map((p, idx) => (
          <div key={p.id} style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "12px 14px",
            borderRadius: 12,
            background: p.you ? "rgba(245,158,11,0.08)" : "var(--bg-card)",
            border: `1px solid ${p.you ? "rgba(245,158,11,0.3)" : "var(--border)"}`,
            marginBottom: 8,
          }}>
            <div style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: idx === 0 ? "var(--amber)" : idx === sorted.length - 1 ? "rgba(220,38,38,0.3)" : "var(--bg-raised)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
              flexShrink: 0,
            }}>
              {idx === 0 ? "🏆" : idx === sorted.length - 1 ? "😬" : `${idx + 1}`}
            </div>
            <img src={p.avatar} alt={p.name} style={{ width: 36, height: 36, borderRadius: "50%", border: "2px solid var(--border)" }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: p.you ? "var(--amber)" : "var(--text)", fontFamily: "var(--font-body)" }}>
                {p.name} {p.you ? "(you)" : ""}
              </div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>{p.pct}% of the bill</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: p.you ? "var(--green)" : "var(--text)", fontFamily: "var(--font-body)" }}>
                ${(total * p.pct / 100).toFixed(2)}
              </div>
            </div>
          </div>
        ))}

        {/* Payment apps */}
        <div style={{ marginTop: 8 }}>
          <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-body)", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Collect via
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {paymentMethods.map((pm) => (
              <button
                key={pm.id}
                style={{
                  flex: 1,
                  padding: "10px 0",
                  borderRadius: 10,
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <span style={{ fontSize: 18 }}>{pm.emoji}</span>
                <span style={{ fontSize: 9, color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>{pm.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ padding: "16px 20px", borderTop: "1px solid var(--border)", background: "var(--bg-surface)", flexShrink: 0 }}>
        <button
          onClick={() => router.push("/screen/save-meal")}
          style={{
            width: "100%", padding: "15px", borderRadius: 14,
            background: "var(--amber)", color: "#000",
            fontWeight: 700, fontSize: 15, border: "none", cursor: "pointer",
            fontFamily: "var(--font-body)",
          }}
        >
          Send Requests & Save Meal →
        </button>
      </div>
    </div>
  );
}
