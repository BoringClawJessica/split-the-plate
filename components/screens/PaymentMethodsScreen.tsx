"use client";

import { useState } from "react";
import { paymentMethods } from "@/lib/mock-data";
import { Plus, Check } from "lucide-react";

export default function PaymentMethodsScreen() {
  const [connected, setConnected] = useState(["venmo", "cashapp"]);

  return (
    <div style={{ height: "100%", background: "var(--bg-base)", display: "flex", flexDirection: "column", padding: "20px 20px" }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 600, color: "var(--text)" }}>Payment Methods</div>
        <div style={{ fontSize: 13, color: "var(--text-secondary)", fontFamily: "var(--font-body)", marginTop: 4 }}>
          Where friends can send you money
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {paymentMethods.map((pm) => {
          const isConnected = connected.includes(pm.id);
          return (
            <div
              key={pm.id}
              style={{
                padding: "16px",
                borderRadius: 14,
                background: isConnected ? "rgba(22,163,74,0.08)" : "var(--bg-card)",
                border: `1px solid ${isConnected ? "rgba(22,163,74,0.3)" : "var(--border)"}`,
                display: "flex",
                alignItems: "center",
                gap: 14,
              }}
            >
              <div style={{
                width: 46,
                height: 46,
                borderRadius: 13,
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
                <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", fontFamily: "var(--font-body)" }}>{pm.name}</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
                  {isConnected
                    ? pm.id === "venmo" ? "@eli-v" : pm.id === "cashapp" ? "$eli" : "Connected"
                    : "Not connected"
                  }
                </div>
              </div>
              <button
                onClick={() => setConnected((c) => c.includes(pm.id) ? c.filter((x) => x !== pm.id) : [...c, pm.id])}
                style={{
                  padding: "8px 14px",
                  borderRadius: 9,
                  background: isConnected ? "transparent" : "var(--amber)",
                  border: isConnected ? "1px solid rgba(22,163,74,0.4)" : "none",
                  color: isConnected ? "#4ade80" : "#000",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "var(--font-body)",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                {isConnected ? <><Check size={12} /> Connected</> : "Connect"}
              </button>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 20, padding: "14px 16px", borderRadius: 12, background: "var(--bg-card)", border: "1px solid var(--border)", cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
        <Plus size={18} color="var(--text-muted)" />
        <span style={{ fontSize: 14, color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>Add another method</span>
      </div>
    </div>
  );
}
