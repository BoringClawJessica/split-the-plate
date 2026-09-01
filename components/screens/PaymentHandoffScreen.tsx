"use client";

import { useState } from "react";
import { paymentMethods } from "@/lib/mock-data";
import { CheckCircle2, Banknote, Wallet, Smartphone, DollarSign, HandCoins } from "lucide-react";
import { BackButton, HomeBottomBar } from "../PhoneNav";

// Which methods the leader has enabled (mock — normally read from leader profile)
const LEADER_ENABLED = ["applepay", "cashapp", "venmo", "cash"];

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
    case "cash": return "Pay in person";
    default: return "";
  }
};

export default function PaymentHandoffScreen() {
  const [selected, setSelected] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [cashConfirmed, setCashConfirmed] = useState(false);

  const availableMethods = paymentMethods.filter((pm) => LEADER_ENABLED.includes(pm.id));

  if (sent) {
    const wasCash = selected === "cash";
    return (
      <div style={{ position: "relative", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px 28px", background: "var(--bg-base)" }}>
        <BackButton to="/screen/review-confirm" />
        <CheckCircle2 size={72} color="var(--amber)" strokeWidth={1.6} />
        <div style={{ marginTop: 20, fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 600, color: "var(--text)", marginBottom: 12, textAlign: "center" }}>
          {wasCash ? (cashConfirmed ? "Marked as paid" : "Hand cash to leader") : "Request sent"}
        </div>
        <div style={{ fontSize: 14, color: "var(--text-secondary)", fontFamily: "var(--font-body)", textAlign: "center", lineHeight: 1.6, maxWidth: 280 }}>
          {wasCash
            ? cashConfirmed
              ? "The leader confirmed cash received. You're square."
              : "Give your share to the leader. They'll mark you as paid on their side."
            : "Your leader will get a notification. Payment will confirm automatically."}
        </div>

        {wasCash && !cashConfirmed && (
          <button
            onClick={() => setCashConfirmed(true)}
            style={{
              marginTop: 24,
              padding: "12px 20px",
              borderRadius: 12,
              background: "var(--amber)",
              color: "#000",
              fontWeight: 700,
              fontSize: 14,
              border: "none",
              cursor: "pointer",
              fontFamily: "var(--font-body)",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <HandCoins size={16} /> Leader: mark as paid
          </button>
        )}
        <HomeBottomBar />
      </div>
    );
  }

  return (
    <div style={{ position: "relative", height: "100%", background: "var(--bg-base)", display: "flex", flexDirection: "column", padding: "56px 20px 92px" }}>
      <BackButton to="/screen/review-confirm" />
      <div style={{ marginBottom: 18 }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 600, color: "var(--text)" }}>
          Pay the leader
        </div>
        <div style={{ fontSize: 13, color: "var(--text-secondary)", fontFamily: "var(--font-body)", marginTop: 4 }}>
          Send $48.15 via any method the leader accepts.
        </div>
      </div>

      <div style={{
        padding: "10px 12px",
        borderRadius: 10,
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        fontSize: 11,
        color: "var(--text-muted)",
        fontFamily: "var(--font-body)",
        marginBottom: 14,
      }}>
        Only methods the leader has connected are shown.
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, flex: 1 }}>
        {availableMethods.map((pm) => (
          <button
            key={pm.id}
            onClick={() => setSelected(pm.id)}
            style={{
              padding: "16px 18px",
              borderRadius: 16,
              background: selected === pm.id ? "rgba(245,158,11,0.1)" : "var(--bg-card)",
              border: `1.5px solid ${selected === pm.id ? "var(--amber)" : "var(--border)"}`,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 14,
              transition: "all 0.15s",
              textAlign: "left",
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
              <div style={{ fontFamily: "var(--font-body)", fontSize: 15, fontWeight: 600, color: "var(--text)" }}>{pm.name}</div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--text-muted)" }}>{handleFor(pm.id)}</div>
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
          width: "100%",
          padding: "16px",
          borderRadius: 14,
          marginTop: 20,
          background: selected ? "var(--amber)" : "var(--bg-card)",
          color: selected ? "#000" : "var(--text-muted)",
          fontWeight: 700,
          fontSize: 15,
          border: "none",
          cursor: selected ? "pointer" : "not-allowed",
          fontFamily: "var(--font-body)",
          transition: "all 0.2s",
          boxShadow: selected ? "0 8px 24px rgba(245,158,11,0.3)" : "none",
        }}
      >
        {selected === "cash" ? "Confirm cash handoff" : "Pay $48.15"}
      </button>
      <HomeBottomBar />
    </div>
  );
}
