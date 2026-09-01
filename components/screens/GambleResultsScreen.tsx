"use client";

import { useRouter } from "next/navigation";
import { friends, currentUser, paymentMethods } from "@/lib/mock-data";
import { Trophy, Frown, Wallet, Smartphone, DollarSign, Banknote } from "lucide-react";
import { BackButton, HomeBottomBar } from "../PhoneNav";

const PEOPLE = [
  { id: currentUser.id, name: "Eli", avatar: currentUser.avatar, pct: 15, you: true },
  { id: friends[0].id, name: "Sofia", avatar: friends[0].avatar, pct: 40 },
  { id: friends[1].id, name: "Marcus", avatar: friends[1].avatar, pct: 25 },
  { id: friends[2].id, name: "Jade", avatar: friends[2].avatar, pct: 20 },
];

const total = 187 * 1.08;

const iconFor = (id: string) => {
  switch (id) {
    case "applepay": return <Smartphone size={16} color="#fff" />;
    case "cashapp": return <DollarSign size={16} color="#fff" />;
    case "venmo": return <Wallet size={16} color="#fff" />;
    case "zelle": return <Wallet size={16} color="#fff" />;
    case "paypal": return <Wallet size={16} color="#fff" />;
    case "cash": return <Banknote size={16} color="#fff" />;
    default: return <Wallet size={16} color="#fff" />;
  }
};

export default function GambleResultsScreen() {
  const router = useRouter();
  const sorted = [...PEOPLE].sort((a, b) => a.pct - b.pct);

  return (
    <div style={{ position: "relative", height: "100%", background: "var(--bg-base)", display: "flex", flexDirection: "column" }}>
      <BackButton to="/screen/gamble-picker" />
      <div style={{ padding: "56px 20px 12px", flexShrink: 0 }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 600, color: "var(--text)" }}>
          Results
        </div>
        <div style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "var(--font-body)", marginTop: 4 }}>
          Plinko final &mdash; total ${total.toFixed(2)}
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
        <div style={{
          width: 44,
          height: 44,
          borderRadius: 14,
          background: "rgba(245,158,11,0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--amber)",
        }}>
          <Trophy size={22} strokeWidth={1.8} />
        </div>
        <div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 600, color: "var(--amber)" }}>
            You got lucky, Eli.
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
              fontSize: 12,
              color: idx === 0 ? "#000" : "var(--text)",
              flexShrink: 0,
            }}>
              {idx === 0 ? <Trophy size={13} /> : idx === sorted.length - 1 ? <Frown size={13} color="#f87171" /> : `${idx + 1}`}
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
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
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {paymentMethods.map((pm) => (
              <button
                key={pm.id}
                style={{
                  flex: "1 1 30%",
                  padding: "10px 6px",
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
                <span style={{
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  background: pm.color,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>{iconFor(pm.id)}</span>
                <span style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>{pm.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ padding: "16px 20px 92px", borderTop: "1px solid var(--border)", background: "var(--bg-surface)", flexShrink: 0 }}>
        <button
          onClick={() => router.push("/screen/save-meal")}
          style={{
            width: "100%", padding: "15px", borderRadius: 14,
            background: "var(--amber)", color: "#000",
            fontWeight: 700, fontSize: 15, border: "none", cursor: "pointer",
            fontFamily: "var(--font-body)",
          }}
        >
          Send Requests &amp; Save Meal
        </button>
      </div>
      <HomeBottomBar />
    </div>
  );
}
