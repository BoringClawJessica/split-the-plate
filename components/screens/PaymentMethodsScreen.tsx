"use client";

import { useState } from "react";
import { paymentMethods } from "@/lib/mock-data";
import { Plus, Check, AlertTriangle, Wallet, Smartphone, DollarSign, Banknote } from "lucide-react";
import { BackButton, HomeBottomBar } from "../PhoneNav";

const iconFor = (id: string) => {
  switch (id) {
    case "applepay": return <Smartphone size={22} color="#fff" />;
    case "cashapp": return <DollarSign size={22} color="#fff" />;
    case "venmo": return <Wallet size={22} color="#fff" />;
    case "zelle": return <Wallet size={22} color="#fff" />;
    case "paypal": return <Wallet size={22} color="#fff" />;
    case "cash": return <Banknote size={22} color="#fff" />;
    default: return <Wallet size={22} color="#fff" />;
  }
};

const handleFor = (id: string) => {
  switch (id) {
    case "applepay": return "Open in Wallet";
    case "cashapp": return "$eli";
    case "venmo": return "@eli-v";
    case "zelle": return "eli@mail.com";
    case "paypal": return "@eli";
    case "cash": return "Accept cash in person";
    default: return "Connected";
  }
};

export default function PaymentMethodsScreen() {
  const [connected, setConnected] = useState<string[]>(["applepay", "cashapp"]);

  const hasAny = connected.length > 0;

  return (
    <div style={{ position: "relative", height: "100%", background: "var(--bg-base)", display: "flex", flexDirection: "column", padding: "56px 20px 92px" }}>
      <BackButton to="/screen/settings" />
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 600, color: "var(--text)" }}>Payment Methods</div>
        <div style={{ fontSize: 13, color: "var(--text-secondary)", fontFamily: "var(--font-body)", marginTop: 4 }}>
          Where friends can send you money
        </div>
      </div>

      {/* Requirement banner */}
      <div style={{
        padding: "12px 14px",
        borderRadius: 12,
        background: hasAny ? "rgba(22,163,74,0.08)" : "rgba(220,38,38,0.08)",
        border: `1px solid ${hasAny ? "rgba(22,163,74,0.3)" : "rgba(220,38,38,0.35)"}`,
        marginBottom: 16,
        display: "flex",
        alignItems: "flex-start",
        gap: 10,
      }}>
        {hasAny ? (
          <Check size={16} color="#4ade80" style={{ marginTop: 2, flexShrink: 0 }} />
        ) : (
          <AlertTriangle size={16} color="#f87171" style={{ marginTop: 2, flexShrink: 0 }} />
        )}
        <div style={{ fontSize: 12, color: hasAny ? "#4ade80" : "#f87171", fontFamily: "var(--font-body)", lineHeight: 1.5 }}>
          {hasAny
            ? `You have ${connected.length} method${connected.length === 1 ? "" : "s"} connected.`
            : "You must connect at least one method to receive splits."}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {paymentMethods.map((pm) => {
          const isConnected = connected.includes(pm.id);
          return (
            <div
              key={pm.id}
              style={{
                padding: "14px 16px",
                borderRadius: 14,
                background: isConnected ? "rgba(22,163,74,0.08)" : "var(--bg-card)",
                border: `1px solid ${isConnected ? "rgba(22,163,74,0.3)" : "var(--border)"}`,
                display: "flex",
                alignItems: "center",
                gap: 14,
              }}
            >
              <div style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: pm.color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}>
                {iconFor(pm.id)}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", fontFamily: "var(--font-body)" }}>{pm.name}</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
                  {isConnected ? handleFor(pm.id) : "Not connected"}
                </div>
              </div>
              <button
                onClick={() => setConnected((c) => (c.includes(pm.id) ? c.filter((x) => x !== pm.id) : [...c, pm.id]))}
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
                {isConnected ? (
                  <>
                    <Check size={12} /> Connected
                  </>
                ) : (
                  "Connect"
                )}
              </button>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 16, padding: "14px 16px", borderRadius: 12, background: "var(--bg-card)", border: "1px solid var(--border)", cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
        <Plus size={18} color="var(--text-muted)" />
        <span style={{ fontSize: 14, color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>Add another method</span>
      </div>
      <HomeBottomBar />
    </div>
  );
}
