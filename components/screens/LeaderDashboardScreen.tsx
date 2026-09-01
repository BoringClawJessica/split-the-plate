"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { leaderDashboardParticipants } from "@/lib/mock-data";
import type { LeaderDashboardParticipant } from "@/lib/mock-data";
import { BackButton, HomeBottomBar } from "../PhoneNav";
import { Banknote, DollarSign, Smartphone, Wallet } from "lucide-react";

const methodIcon = (id: string) => {
  switch (id) {
    case "applepay": return <Smartphone size={12} color="#fff" />;
    case "cashapp": return <DollarSign size={12} color="#fff" />;
    case "venmo": return <Wallet size={12} color="#fff" />;
    case "zelle": return <Wallet size={12} color="#fff" />;
    case "paypal": return <Wallet size={12} color="#fff" />;
    case "cash": return <Banknote size={12} color="#fff" />;
    default: return <Wallet size={12} color="#fff" />;
  }
};

const methodColor = (id: string) => {
  switch (id) {
    case "applepay": return "#000000";
    case "cashapp": return "#00C244";
    case "venmo": return "#008CFF";
    case "zelle": return "#6B21A8";
    case "paypal": return "#003087";
    case "cash": return "#4b5563";
    default: return "#4b5563";
  }
};

const statusPill = (status: string) => {
  if (status === "paid") return { text: "Paid", bg: "rgba(22,163,74,0.15)", fg: "#4ade80", border: "rgba(22,163,74,0.4)" };
  if (status === "awaiting_cash") return { text: "Awaiting cash", bg: "rgba(245,158,11,0.15)", fg: "var(--amber)", border: "rgba(245,158,11,0.4)" };
  return { text: "Pending", bg: "rgba(245,158,11,0.10)", fg: "#f59e0b", border: "rgba(245,158,11,0.3)" };
};

export default function LeaderDashboardScreen() {
  const router = useRouter();
  const [participants, setParticipants] = useState<LeaderDashboardParticipant[]>(leaderDashboardParticipants);

  const totals = useMemo(() => {
    const targetBill = participants.reduce((s, p) => s + p.share, 0);
    const paidBill = participants.filter((p) => p.status === "paid").reduce((s, p) => s + p.share, 0);
    const paidTips = participants.filter((p) => p.status === "paid").reduce((s, p) => s + p.tip, 0);
    return { targetBill, paidBill, paidTips };
  }, [participants]);

  const paidCount = participants.filter((p) => p.status === "paid").length;
  const progress = totals.targetBill > 0 ? (totals.paidBill / totals.targetBill) * 100 : 0;

  const confirmCash = (id: string) => {
    setParticipants((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "paid" } : p))
    );
  };

  return (
    <div style={{ position: "relative", height: "100%", background: "var(--bg-base)", display: "flex", flexDirection: "column" }}>
      <BackButton to="/screen/payment-handoff" />
      <div style={{ padding: "56px 20px 12px", flexShrink: 0 }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 600, color: "var(--text)" }}>
          Leader dashboard
        </div>
        <div style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "var(--font-body)", marginTop: 4 }}>
          Fuego &amp; Sol Mexican · Aug 30 · {participants.length} people
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "0 20px 8px" }}>
        {/* Totals */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
          <StatTile
            label="Bill paid so far"
            value={`$${totals.paidBill.toFixed(2)}`}
            sub={`of $${totals.targetBill.toFixed(2)}`}
          />
          <StatTile
            label="Tips collected"
            value={`$${totals.paidTips.toFixed(2)}`}
            sub={`${paidCount}/${participants.length} paid`}
            accent
          />
        </div>

        {/* Progress bar */}
        <div style={{
          marginBottom: 18,
          padding: "12px 14px",
          borderRadius: 12,
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div style={{
            height: 6,
            borderRadius: 999,
            background: "var(--bg-raised)",
            overflow: "hidden",
          }}>
            <div style={{
              height: "100%",
              width: `${progress}%`,
              background: "linear-gradient(90deg, var(--amber), var(--orange))",
              transition: "width 0.3s",
            }} />
          </div>
        </div>

        {/* Participants */}
        <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-body)", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.06em" }}>
          Who owes what
        </div>
        {participants.map((p) => {
          const pill = statusPill(p.status);
          const owed = p.share + p.tip;
          const isCashPending = p.paymentMethodId === "cash" && p.status !== "paid";
          return (
            <div key={p.id} style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "12px 14px",
              borderRadius: 12,
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              marginBottom: 8,
            }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.avatar} alt={p.name} style={{ width: 40, height: 40, borderRadius: "50%", border: "2px solid var(--border)" }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", fontFamily: "var(--font-body)" }}>
                  {p.name}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 3 }}>
                  <span style={{
                    width: 16,
                    height: 16,
                    borderRadius: 999,
                    background: methodColor(p.paymentMethodId),
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    {methodIcon(p.paymentMethodId)}
                  </span>
                  <span style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
                    ${p.share.toFixed(2)} + ${p.tip.toFixed(2)} tip
                  </span>
                </div>
              </div>
              <div style={{ textAlign: "right", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, flexShrink: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: "var(--amber)", fontFamily: "var(--font-body)" }}>
                  ${owed.toFixed(2)}
                </div>
                <div style={{
                  padding: "2px 8px",
                  borderRadius: 999,
                  background: pill.bg,
                  border: `1px solid ${pill.border}`,
                  color: pill.fg,
                  fontSize: 10,
                  fontFamily: "var(--font-body)",
                  fontWeight: 700,
                }}>
                  {pill.text}
                </div>
                {isCashPending && (
                  <button
                    onClick={() => confirmCash(p.id)}
                    style={{
                      marginTop: 4,
                      padding: "5px 10px",
                      borderRadius: 8,
                      background: "var(--amber)",
                      color: "#000",
                      border: "none",
                      cursor: "pointer",
                      fontSize: 10,
                      fontFamily: "var(--font-body)",
                      fontWeight: 700,
                    }}
                  >
                    Confirm received
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ padding: "16px 20px 24px", borderTop: "1px solid var(--border)", background: "var(--bg-surface)", flexShrink: 0 }}>
        <button
          onClick={() => router.push("/screen/meal-history")}
          style={{
            width: "100%",
            padding: "15px",
            borderRadius: 14,
            background: "var(--amber)",
            color: "#000",
            fontWeight: 700,
            fontSize: 15,
            border: "none",
            cursor: "pointer",
            fontFamily: "var(--font-body)",
          }}
        >
          Back to Recent Meals
        </button>
      </div>
      <HomeBottomBar hidden />
    </div>
  );
}

function StatTile({ label, value, sub, accent }: { label: string; value: string; sub: string; accent?: boolean }) {
  return (
    <div style={{
      padding: "14px",
      borderRadius: 14,
      background: accent ? "rgba(245,158,11,0.08)" : "var(--bg-card)",
      border: `1px solid ${accent ? "rgba(245,158,11,0.3)" : "var(--border)"}`,
    }}>
      <div style={{ fontSize: 10, color: accent ? "var(--amber)" : "var(--text-muted)", fontFamily: "var(--font-body)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>
        {label}
      </div>
      <div style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 700, color: accent ? "var(--amber)" : "var(--text)" }}>
        {value}
      </div>
      <div style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "var(--font-body)", marginTop: 4 }}>
        {sub}
      </div>
    </div>
  );
}

