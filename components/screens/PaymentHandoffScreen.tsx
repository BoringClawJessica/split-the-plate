"use client";

import { useState } from "react";
import { paymentMethods } from "@/lib/mock-data";

export default function PaymentHandoffScreen() {
  const [selected, setSelected] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px 28px", background: "var(--bg-base)" }}>
        <div style={{ fontSize: 72, marginBottom: 24 }}>✅</div>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 600, color: "var(--text)", marginBottom: 12, textAlign: "center" }}>
          Requests sent!
        </div>
        <div style={{ fontSize: 14, color: "var(--text-secondary)", fontFamily: "var(--font-body)", textAlign: "center", lineHeight: 1.6 }}>
          Your friends got a notification. The ball's in their court now 🏐
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: "100%", background: "var(--bg-base)", display: "flex", flexDirection: "column", padding: "28px 20px" }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 600, color: "var(--text)" }}>
          Collect via
        </div>
        <div style={{ fontSize: 13, color: "var(--text-secondary)", fontFamily: "var(--font-body)", marginTop: 4 }}>
          Where should your friends send $48.15 each?
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, flex: 1 }}>
        {paymentMethods.map((pm) => (
          <button
            key={pm.id}
            onClick={() => setSelected(pm.id)}
            style={{
              padding: "18px 20px",
              borderRadius: 16,
              background: selected === pm.id ? "rgba(245,158,11,0.1)" : "var(--bg-card)",
              border: `1.5px solid ${selected === pm.id ? "var(--amber)" : "var(--border)"}`,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 16,
              transition: "all 0.15s",
              textAlign: "left",
            }}
          >
            <div style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              background: pm.color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              flexShrink: 0,
            }}>
              {pm.emoji}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 15, fontWeight: 600, color: "var(--text)" }}>{pm.name}</div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--text-muted)" }}>
                {pm.id === "venmo" ? "@eli-v" : pm.id === "cashapp" ? "$eli" : pm.id === "applepay" ? "Open in Wallet" : "your@email.com"}
              </div>
            </div>
            <div style={{
              width: 22,
              height: 22,
              borderRadius: "50%",
              background: selected === pm.id ? "var(--amber)" : "var(--bg-raised)",
              border: `1.5px solid ${selected === pm.id ? "var(--amber)" : "var(--border-bright)"}`,
            }} />
          </button>
        ))}
      </div>

      <button
        onClick={() => selected && setSent(true)}
        disabled={!selected}
        style={{
          width: "100%", padding: "16px", borderRadius: 14, marginTop: 20,
          background: selected ? "var(--amber)" : "var(--bg-card)",
          color: selected ? "#000" : "var(--text-muted)",
          fontWeight: 700, fontSize: 15, border: "none",
          cursor: selected ? "pointer" : "not-allowed",
          fontFamily: "var(--font-body)",
          transition: "all 0.2s",
          boxShadow: selected ? "0 8px 24px rgba(245,158,11,0.3)" : "none",
        }}
      >
        Send Payment Requests →
      </button>
    </div>
  );
}
