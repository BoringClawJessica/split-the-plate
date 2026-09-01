"use client";

import { useRouter } from "next/navigation";
import { currentUser, paymentMethods } from "@/lib/mock-data";
import { Settings, Edit, Users, Utensils, User, Eye, EyeOff, Wallet, Smartphone, DollarSign, Banknote } from "lucide-react";
import { useState } from "react";
import { BackButton, HomeBottomBar } from "../PhoneNav";

// Which methods this user has accepted (mock)
const ACCEPTED_METHODS = ["applepay", "cashapp", "venmo"];

const iconFor = (id: string) => {
  switch (id) {
    case "applepay": return <Smartphone size={13} />;
    case "cashapp": return <DollarSign size={13} />;
    case "venmo": return <Wallet size={13} />;
    case "zelle": return <Wallet size={13} />;
    case "paypal": return <Wallet size={13} />;
    case "cash": return <Banknote size={13} />;
    default: return <Wallet size={13} />;
  }
};

// Mock totals
const TOTAL_SPEND = 1786;

export default function ProfileScreen() {
  const router = useRouter();

  const [avgPublic, setAvgPublic] = useState(false);
  const [totalPublic, setTotalPublic] = useState(false);

  return (
    <div style={{ position: "relative", height: "100%", background: "var(--bg-base)", display: "flex", flexDirection: "column" }}>
      <BackButton to="/screen/home" />

      {/* Header */}
      <div style={{ padding: "14px 20px 4px", display: "flex", justifyContent: "flex-end", flexShrink: 0 }}>
        <button
          onClick={() => router.push("/screen/settings")}
          style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-secondary)", display: "flex", gap: 8, alignItems: "center", fontSize: 13, fontFamily: "var(--font-body)" }}
        >
          <Settings size={18} /> Settings
        </button>
      </div>

      {/* Profile header */}
      <div style={{ padding: "0 20px 16px", flexShrink: 0, textAlign: "center" }}>
        <div style={{ position: "relative", display: "inline-block", marginBottom: 12 }}>
          <div style={{
            width: 88,
            height: 88,
            borderRadius: "50%",
            background: "linear-gradient(135deg, var(--amber), var(--orange))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "4px solid var(--amber)",
            boxShadow: "0 0 24px rgba(245,158,11,0.3)",
          }}>
            <User size={40} color="#000" strokeWidth={1.6} />
          </div>
          <button
            onClick={() => router.push("/screen/settings")}
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: "var(--bg-card)",
              border: "2px solid var(--border-bright)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Edit size={12} color="var(--text)" />
          </button>
        </div>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 600, color: "var(--text)" }}>{currentUser.name}</div>
        <div style={{ fontSize: 13, color: "var(--text-muted)", fontFamily: "var(--font-body)", marginTop: 4 }}>{currentUser.handle}</div>
      </div>

      {/* Stats — Meals + Friends */}
      <div style={{ display: "flex", padding: "0 20px 16px", gap: 12, flexShrink: 0 }}>
        <StatTile icon={<Utensils size={18} color="var(--amber)" />} value={currentUser.stats.meals} label="Meals" />
        <StatTile icon={<Users size={18} color="var(--amber)" />} value={currentUser.stats.friends} label="Friends" />
      </div>

      {/* Payment methods accepted */}
      <div style={{ padding: "0 20px 16px", flexShrink: 0 }}>
        <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-body)", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.06em" }}>Payment Methods Accepted</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {paymentMethods
            .filter((pm) => ACCEPTED_METHODS.includes(pm.id))
            .map((pm) => (
              <div key={pm.id} style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 10px",
                borderRadius: 999,
                background: "var(--bg-card)",
                border: `1px solid ${pm.color}55`,
                color: "var(--text)",
                fontSize: 12,
                fontFamily: "var(--font-body)",
                fontWeight: 500,
              }}>
                <span style={{
                  width: 18,
                  height: 18,
                  borderRadius: 999,
                  background: pm.color,
                  color: "#fff",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                  {iconFor(pm.id)}
                </span>
                {pm.name}
              </div>
            ))}
        </div>
      </div>

      {/* Privacy-toggle spend stats */}
      <div style={{ padding: "0 20px 16px", flexShrink: 0 }}>
        <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-body)", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.06em" }}>Spend</div>
        <PrivacyStatRow
          label="Average meal spend"
          value={`$${currentUser.stats.avgSpend}`}
          isPublic={avgPublic}
          onToggle={() => setAvgPublic((v) => !v)}
        />
        <PrivacyStatRow
          label="Total spend (all-time)"
          value={`$${TOTAL_SPEND}`}
          isPublic={totalPublic}
          onToggle={() => setTotalPublic((v) => !v)}
        />
      </div>

      {/* Link to meal history */}
      <div style={{ flex: 1, overflowY: "auto", padding: "0 20px 92px" }}>
        <button
          onClick={() => router.push("/screen/meal-history")}
          style={{
            width: "100%",
            padding: "14px 16px",
            borderRadius: 14,
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            color: "var(--text)",
            fontSize: 14,
            fontFamily: "var(--font-body)",
            fontWeight: 500,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span>View meal history</span>
          <span style={{ color: "var(--text-muted)", fontSize: 18 }}>›</span>
        </button>
      </div>
      <HomeBottomBar />
    </div>
  );
}

function StatTile({ icon, value, label }: { icon: React.ReactNode; value: number | string; label: string }) {
  return (
    <div style={{
      flex: 1,
      textAlign: "center",
      padding: "14px 8px",
      borderRadius: 14,
      background: "var(--bg-card)",
      border: "1px solid var(--border)",
    }}>
      <div style={{ marginBottom: 6, display: "flex", justifyContent: "center" }}>{icon}</div>
      <div style={{ fontSize: 20, fontWeight: 700, color: "var(--text)", fontFamily: "var(--font-body)" }}>{value}</div>
      <div style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>{label}</div>
    </div>
  );
}

function PrivacyStatRow({ label, value, isPublic, onToggle }: {
  label: string;
  value: string;
  isPublic: boolean;
  onToggle: () => void;
}) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "12px 14px",
      borderRadius: 12,
      background: "var(--bg-card)",
      border: "1px solid var(--border)",
      marginBottom: 8,
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, color: "var(--text)", fontFamily: "var(--font-body)", fontWeight: 500 }}>{label}</div>
        <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-body)", marginTop: 2 }}>
          {isPublic ? "Public — friends can see" : "Private — only you"}
        </div>
      </div>
      <div style={{ fontSize: 15, fontWeight: 700, color: "var(--amber)", fontFamily: "var(--font-body)" }}>{value}</div>
      <button
        onClick={onToggle}
        aria-label={isPublic ? "Make private" : "Make public"}
        style={{
          width: 34,
          height: 34,
          borderRadius: 10,
          background: isPublic ? "rgba(245,158,11,0.15)" : "var(--bg-raised)",
          border: `1px solid ${isPublic ? "rgba(245,158,11,0.35)" : "var(--border)"}`,
          color: isPublic ? "var(--amber)" : "var(--text-muted)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
        }}
      >
        {isPublic ? <Eye size={15} /> : <EyeOff size={15} />}
      </button>
    </div>
  );
}
