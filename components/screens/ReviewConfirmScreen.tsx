"use client";

import { useRouter } from "next/navigation";
import { friends, currentUser, receiptTotal } from "@/lib/mock-data";
import { BackButton, HomeBottomBar } from "../PhoneNav";

const PEOPLE = [
  { id: currentUser.id, name: "You", avatar: currentUser.avatar },
  ...friends.slice(0, 3).map((f) => ({ id: f.id, name: f.name, avatar: f.avatar })),
];

const TAX_RATE = 0.08;

export default function ReviewConfirmScreen() {
  const router = useRouter();

  const subtotal = receiptTotal;
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;
  const perPersonBase = total / PEOPLE.length;

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
        {/* Total headline */}
        <div style={{
          padding: "20px",
          borderRadius: 18,
          background: "linear-gradient(135deg, rgba(245,158,11,0.14), rgba(234,88,12,0.10))",
          border: "1px solid rgba(245,158,11,0.3)",
          textAlign: "center",
          marginBottom: 14,
        }}>
          <div style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "var(--font-body)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>
            Total bill
          </div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 40, fontWeight: 700, color: "var(--amber)", letterSpacing: "-0.02em" }}>
            ${total.toFixed(2)}
          </div>
          <div style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "var(--font-body)", marginTop: 4 }}>
            Tip added by each person on their own share.
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
            ["Per-person share", `$${perPersonBase.toFixed(2)}`],
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

        {/* People shares */}
        <div style={{ marginBottom: 8 }}>
          <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-body)", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.06em" }}>
            In this split
          </div>
          {PEOPLE.map((p) => (
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
                  Share of the bill
                </div>
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "var(--amber)", fontFamily: "var(--font-body)" }}>
                ${perPersonBase.toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: "16px 20px 24px", borderTop: "1px solid var(--border)", background: "var(--bg-surface)", flexShrink: 0 }}>
        <button
          onClick={() => router.push("/screen/tip-phase")}
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
          Continue to Tip
        </button>
      </div>
      <HomeBottomBar hidden />
    </div>
  );
}
