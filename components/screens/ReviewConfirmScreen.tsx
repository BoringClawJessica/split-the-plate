"use client";

import { useRouter } from "next/navigation";
import { friends, currentUser, receiptTotal } from "@/lib/mock-data";

const PEOPLE = [
  { id: currentUser.id, name: "You", avatar: currentUser.avatar },
  ...friends.slice(0, 3).map((f) => ({ id: f.id, name: f.name, avatar: f.avatar })),
];
const perPerson = ((receiptTotal * 1.08) / PEOPLE.length);

export default function ReviewConfirmScreen() {
  const router = useRouter();

  return (
    <div style={{ height: "100%", background: "var(--bg-base)", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "20px 20px 12px", flexShrink: 0 }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 600, color: "var(--text)" }}>
          Review & Confirm
        </div>
        <div style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "var(--font-body)", marginTop: 4 }}>
          Fuego & Sol Mexican · Aug 30
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "0 20px" }}>
        {/* Summary card */}
        <div style={{
          padding: "18px",
          borderRadius: 18,
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          marginBottom: 16,
        }}>
          {[
            ["Subtotal", `$${receiptTotal.toFixed(2)}`],
            ["Tax", `$${(receiptTotal * 0.08).toFixed(2)}`],
            ["Total", `$${(receiptTotal * 1.08).toFixed(2)}`],
            ["Split method", "Even ÷ 4"],
            ["Per person", `$${perPerson.toFixed(2)}`],
          ].map(([label, val], i) => (
            <div key={label} style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "8px 0",
              borderBottom: i < 4 ? "1px solid var(--border)" : "none",
            }}>
              <span style={{ fontSize: 13, color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}>{label}</span>
              <span style={{ fontSize: 14, color: i === 4 ? "var(--amber)" : "var(--text)", fontFamily: "var(--font-body)", fontWeight: i >= 2 ? 600 : 400 }}>{val}</span>
            </div>
          ))}
        </div>

        {/* People */}
        <div style={{ marginBottom: 16 }}>
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
              <img src={p.avatar} alt={p.name} style={{ width: 36, height: 36, borderRadius: "50%", border: "2px solid var(--border)" }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, color: "var(--text)", fontFamily: "var(--font-body)", fontWeight: 500 }}>{p.name}</div>
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "var(--amber)", fontFamily: "var(--font-body)" }}>${perPerson.toFixed(2)}</div>
            </div>
          ))}
        </div>

        {/* Tip */}
        <div style={{
          padding: "16px",
          borderRadius: 14,
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          marginBottom: 16,
        }}>
          <div style={{ fontSize: 13, color: "var(--text-secondary)", fontFamily: "var(--font-body)", marginBottom: 10, fontWeight: 600 }}>Add Tip?</div>
          <div style={{ display: "flex", gap: 8 }}>
            {["15%", "18%", "20%", "25%", "Custom"].map((t) => (
              <button
                key={t}
                style={{
                  flex: 1,
                  padding: "8px 0",
                  borderRadius: 8,
                  background: t === "20%" ? "var(--amber)" : "var(--bg-raised)",
                  color: t === "20%" ? "#000" : "var(--text-muted)",
                  fontSize: 11,
                  border: `1px solid ${t === "20%" ? "var(--amber)" : "var(--border)"}`,
                  cursor: "pointer",
                  fontFamily: "var(--font-body)",
                  fontWeight: t === "20%" ? 600 : 400,
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ padding: "16px 20px", borderTop: "1px solid var(--border)", background: "var(--bg-surface)", flexShrink: 0 }}>
        <button
          onClick={() => router.push("/screen/payment-handoff")}
          style={{
            width: "100%", padding: "15px", borderRadius: 14,
            background: "var(--amber)", color: "#000",
            fontWeight: 700, fontSize: 15, border: "none", cursor: "pointer",
            fontFamily: "var(--font-body)",
            boxShadow: "0 8px 24px rgba(245,158,11,0.3)",
          }}
        >
          Confirm & Send Requests 🎉
        </button>
      </div>
    </div>
  );
}
