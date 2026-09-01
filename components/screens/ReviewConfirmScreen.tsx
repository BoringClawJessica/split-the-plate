"use client";

import { useRouter } from "next/navigation";
import { friends, currentUser, receiptTotal } from "@/lib/mock-data";
import { useMemo, useState } from "react";
import { BackButton, HomeBottomBar } from "../PhoneNav";

const PEOPLE = [
  { id: currentUser.id, name: "You", avatar: currentUser.avatar },
  ...friends.slice(0, 3).map((f) => ({ id: f.id, name: f.name, avatar: f.avatar })),
];

const TAX_RATE = 0.08;

const TIP_PRESETS = [15, 18, 20, 25] as const;

export default function ReviewConfirmScreen() {
  const router = useRouter();

  const subtotal = receiptTotal;
  const tax = subtotal * TAX_RATE;
  const billPaid = subtotal + tax;
  const perPersonBase = billPaid / PEOPLE.length;

  // Per-person tip percent (each person picks their own)
  const [tipPct, setTipPct] = useState<Record<string, number>>(
    () => Object.fromEntries(PEOPLE.map((p) => [p.id, 20]))
  );

  const perPersonTip = useMemo(
    () => Object.fromEntries(PEOPLE.map((p) => [p.id, perPersonBase * (tipPct[p.id] / 100)])),
    [tipPct, perPersonBase]
  );

  const totalTips = useMemo(
    () => Object.values(perPersonTip).reduce((s, v) => s + v, 0),
    [perPersonTip]
  );

  return (
    <div style={{ position: "relative", height: "100%", background: "var(--bg-base)", display: "flex", flexDirection: "column" }}>
      <BackButton to="/screen/split-method" />
      <div style={{ padding: "56px 20px 12px", flexShrink: 0 }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 600, color: "var(--text)" }}>
          Review &amp; Confirm
        </div>
        <div style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "var(--font-body)", marginTop: 4 }}>
          Fuego &amp; Sol Mexican · Aug 30
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "0 20px 8px" }}>
        {/* Per-person tip */}
        <div style={{
          padding: "16px",
          borderRadius: 14,
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          marginBottom: 14,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
            <div style={{ fontSize: 13, color: "var(--text)", fontFamily: "var(--font-body)", fontWeight: 600 }}>Your tip</div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>Each person tips on their own share</div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {TIP_PRESETS.map((t) => {
              const active = tipPct[currentUser.id] === t;
              return (
                <button
                  key={t}
                  onClick={() => setTipPct((prev) => ({ ...prev, [currentUser.id]: t }))}
                  style={{
                    flex: 1,
                    padding: "10px 0",
                    borderRadius: 10,
                    background: active ? "var(--amber)" : "var(--bg-raised)",
                    color: active ? "#000" : "var(--text-secondary)",
                    fontSize: 12,
                    border: `1px solid ${active ? "var(--amber)" : "var(--border)"}`,
                    cursor: "pointer",
                    fontFamily: "var(--font-body)",
                    fontWeight: active ? 700 : 500,
                  }}
                >
                  {t}%
                </button>
              );
            })}
            <div style={{
              position: "relative",
              flex: 1,
            }}>
              <input
                inputMode="numeric"
                value={tipPct[currentUser.id] ?? 0}
                onChange={(e) => {
                  const n = Math.max(0, Math.min(100, parseInt(e.target.value.replace(/[^0-9]/g, "") || "0", 10)));
                  setTipPct((prev) => ({ ...prev, [currentUser.id]: n }));
                }}
                style={{
                  width: "100%",
                  padding: "10px 22px 10px 10px",
                  borderRadius: 10,
                  background: "var(--bg-raised)",
                  border: "1px solid var(--border)",
                  color: "var(--text)",
                  fontSize: 12,
                  fontFamily: "var(--font-body)",
                  textAlign: "center",
                  outline: "none",
                }}
              />
              <span style={{
                position: "absolute",
                right: 8,
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--text-muted)",
                fontSize: 11,
                fontFamily: "var(--font-body)",
                pointerEvents: "none",
              }}>%</span>
            </div>
          </div>
          <div style={{ marginTop: 10, fontSize: 12, color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
            You&apos;ll add <span style={{ color: "var(--amber)", fontWeight: 600 }}>${(perPersonBase * ((tipPct[currentUser.id] ?? 0) / 100)).toFixed(2)}</span> tip on top of your ${perPersonBase.toFixed(2)} share.
          </div>
        </div>

        {/* Totals — separated */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
          <div style={{
            padding: "14px",
            borderRadius: 14,
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
          }}>
            <div style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "var(--font-body)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Bill Paid</div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 700, color: "var(--text)" }}>${billPaid.toFixed(2)}</div>
            <div style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "var(--font-body)", marginTop: 4 }}>Subtotal + tax</div>
          </div>
          <div style={{
            padding: "14px",
            borderRadius: 14,
            background: "rgba(245,158,11,0.08)",
            border: "1px solid rgba(245,158,11,0.3)",
          }}>
            <div style={{ fontSize: 10, color: "var(--amber)", fontFamily: "var(--font-body)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Tips Collected</div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 700, color: "var(--amber)" }}>${totalTips.toFixed(2)}</div>
            <div style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "var(--font-body)", marginTop: 4 }}>Leader adds this to the tab</div>
          </div>
        </div>

        {/* Line items summary */}
        <div style={{
          padding: "14px 16px",
          borderRadius: 14,
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          marginBottom: 16,
        }}>
          {[
            ["Subtotal", `$${subtotal.toFixed(2)}`],
            ["Tax", `$${tax.toFixed(2)}`],
            ["Split method", `Even ÷ ${PEOPLE.length}`],
            ["Per-person bill share", `$${perPersonBase.toFixed(2)}`],
          ].map(([label, val], i, arr) => (
            <div key={label} style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "6px 0",
              borderBottom: i < arr.length - 1 ? "1px solid var(--border)" : "none",
            }}>
              <span style={{ fontSize: 12, color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}>{label}</span>
              <span style={{ fontSize: 13, color: "var(--text)", fontFamily: "var(--font-body)", fontWeight: 500 }}>{val}</span>
            </div>
          ))}
        </div>

        {/* People — each with their tip */}
        <div style={{ marginBottom: 8 }}>
          <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-body)", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.06em" }}>
            In this split
          </div>
          {PEOPLE.map((p) => {
            const tip = perPersonTip[p.id];
            const total = perPersonBase + tip;
            return (
              <div key={p.id} style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 0",
                borderBottom: "1px solid var(--border)",
              }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.avatar} alt={p.name} style={{ width: 36, height: 36, borderRadius: "50%", border: "2px solid var(--border)" }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, color: "var(--text)", fontFamily: "var(--font-body)", fontWeight: 500 }}>{p.name}</div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
                    ${perPersonBase.toFixed(2)} + ${tip.toFixed(2)} tip ({tipPct[p.id]}%)
                  </div>
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "var(--amber)", fontFamily: "var(--font-body)" }}>${total.toFixed(2)}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ padding: "16px 20px 92px", borderTop: "1px solid var(--border)", background: "var(--bg-surface)", flexShrink: 0 }}>
        <button
          onClick={() => router.push("/screen/payment-handoff")}
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
            boxShadow: "0 8px 24px rgba(245,158,11,0.3)",
          }}
        >
          Confirm &amp; Send Requests
        </button>
      </div>
      <HomeBottomBar />
    </div>
  );
}
