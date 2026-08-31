"use client";

import { useRouter } from "next/navigation";
import { friends, currentUser, receiptTotal } from "@/lib/mock-data";
import { useState } from "react";

const PEOPLE = [
  { id: currentUser.id, name: "You" },
  ...friends.slice(0, 3).map((f) => ({ id: f.id, name: f.name })),
];

export default function CustomSplitScreen() {
  const router = useRouter();
  const [amounts, setAmounts] = useState<Record<string, string>>({});

  const total = PEOPLE.reduce((s, p) => s + (parseFloat(amounts[p.id] || "0")), 0);
  const remaining = receiptTotal - total;
  const balanced = Math.abs(remaining) < 0.01;

  return (
    <div style={{ height: "100%", background: "var(--bg-base)", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "20px 20px 12px", flexShrink: 0 }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 600, color: "var(--text)" }}>
          Custom Split
        </div>
        <div style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "var(--font-body)", marginTop: 4 }}>
          Total: ${receiptTotal.toFixed(2)}
        </div>
      </div>

      {/* Remaining indicator */}
      <div style={{
        margin: "0 20px 16px",
        padding: "12px 16px",
        borderRadius: 12,
        background: balanced ? "rgba(22,163,74,0.15)" : remaining < 0 ? "rgba(220,38,38,0.15)" : "rgba(245,158,11,0.1)",
        border: `1px solid ${balanced ? "rgba(22,163,74,0.3)" : remaining < 0 ? "rgba(220,38,38,0.3)" : "rgba(245,158,11,0.2)"}`,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexShrink: 0,
      }}>
        <span style={{ fontSize: 13, color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}>Remaining to assign</span>
        <span style={{ fontSize: 16, fontWeight: 700, color: balanced ? "var(--green)" : remaining < 0 ? "var(--red)" : "var(--amber)", fontFamily: "var(--font-body)" }}>
          {remaining < 0 ? "-" : ""}${Math.abs(remaining).toFixed(2)}
        </span>
      </div>

      {/* Inputs */}
      <div style={{ flex: 1, overflowY: "auto", padding: "0 20px" }}>
        {PEOPLE.map((p) => (
          <div key={p.id} style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "var(--font-body)", marginBottom: 6 }}>{p.name}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                padding: "12px 14px",
                borderRadius: 12,
                background: "var(--bg-card)",
                border: "1px solid var(--border-bright)",
                display: "flex",
                alignItems: "center",
                flex: 1,
                gap: 6,
              }}>
                <span style={{ fontSize: 15, color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>$</span>
                <input
                  type="number"
                  placeholder="0.00"
                  value={amounts[p.id] || ""}
                  onChange={(e) => setAmounts((a) => ({ ...a, [p.id]: e.target.value }))}
                  style={{
                    flex: 1, background: "none", border: "none", outline: "none",
                    fontSize: 16, color: "var(--text)", fontFamily: "var(--font-body)", fontWeight: 600,
                  }}
                />
              </div>
              <button
                onClick={() => {
                  const even = (receiptTotal / PEOPLE.length).toFixed(2);
                  setAmounts((a) => ({ ...a, [p.id]: even }));
                }}
                style={{
                  padding: "10px 12px",
                  borderRadius: 10,
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  color: "var(--text-muted)",
                  fontSize: 11,
                  cursor: "pointer",
                  fontFamily: "var(--font-body)",
                  flexShrink: 0,
                }}
              >
                Even
              </button>
            </div>
          </div>
        ))}
      </div>

      <div style={{ padding: "16px 20px", borderTop: "1px solid var(--border)", background: "var(--bg-surface)", flexShrink: 0 }}>
        <button
          onClick={() => balanced && router.push("/screen/review-confirm")}
          style={{
            width: "100%", padding: "15px", borderRadius: 14,
            background: balanced ? "var(--amber)" : "var(--bg-card)",
            color: balanced ? "#000" : "var(--text-muted)",
            fontWeight: 700, fontSize: 15, border: "none", cursor: balanced ? "pointer" : "not-allowed",
            fontFamily: "var(--font-body)",
          }}
        >
          {balanced ? "Review Split →" : `Balance amounts first ($${Math.abs(remaining).toFixed(2)} left)`}
        </button>
      </div>
    </div>
  );
}
