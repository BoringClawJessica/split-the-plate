"use client";

import { useRouter } from "next/navigation";
import { friends, currentUser, receiptTotal } from "@/lib/mock-data";

const PEOPLE = [
  { id: currentUser.id, name: "You", avatar: currentUser.avatar },
  ...friends.slice(0, 3).map((f) => ({ id: f.id, name: f.name, avatar: f.avatar })),
];

const perPerson = receiptTotal / PEOPLE.length;
const tax = receiptTotal * 0.08;
const perPersonWithTax = (receiptTotal + tax) / PEOPLE.length;

export default function EvenSplitScreen() {
  const router = useRouter();

  return (
    <div style={{ height: "100%", background: "var(--bg-base)", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "20px 20px 12px", flexShrink: 0 }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 600, color: "var(--text)" }}>
          Even Split
        </div>
        <div style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "var(--font-body)", marginTop: 4 }}>
          Divided equally among {PEOPLE.length} people
        </div>
      </div>

      {/* Big per-person amount */}
      <div style={{
        margin: "0 20px 20px",
        padding: "24px",
        borderRadius: 20,
        background: "linear-gradient(135deg, rgba(245,158,11,0.15), rgba(234,88,12,0.1))",
        border: "1px solid rgba(245,158,11,0.3)",
        textAlign: "center",
      }}>
        <div style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "var(--font-body)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.08em" }}>Each person owes</div>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 52, fontWeight: 700, color: "var(--amber)", letterSpacing: "-0.02em" }}>
          ${perPersonWithTax.toFixed(2)}
        </div>
        <div style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "var(--font-body)", marginTop: 4 }}>
          includes tax · tip calculated separately
        </div>
      </div>

      {/* People list */}
      <div style={{ flex: 1, overflowY: "auto", padding: "0 20px" }}>
        {PEOPLE.map((p) => (
          <div key={p.id} style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "12px 0",
            borderBottom: "1px solid var(--border)",
          }}>
            <img src={p.avatar} alt={p.name} style={{ width: 40, height: 40, borderRadius: "50%", border: "2px solid var(--border)" }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 500, color: "var(--text)", fontFamily: "var(--font-body)" }}>{p.name}</div>
            </div>
            <div style={{ fontSize: 15, fontWeight: 600, color: "var(--amber)", fontFamily: "var(--font-body)" }}>
              ${perPersonWithTax.toFixed(2)}
            </div>
          </div>
        ))}
      </div>

      {/* Math breakdown */}
      <div style={{ padding: "14px 20px", borderTop: "1px solid var(--border)", background: "var(--bg-surface)", flexShrink: 0 }}>
        {[
          ["Subtotal", `$${receiptTotal.toFixed(2)}`],
          ["Tax (8%)", `$${tax.toFixed(2)}`],
          ["Total", `$${(receiptTotal + tax).toFixed(2)}`],
        ].map(([label, val]) => (
          <div key={label} style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 13, color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>{label}</span>
            <span style={{ fontSize: 13, color: "var(--text)", fontFamily: "var(--font-body)", fontWeight: label === "Total" ? 700 : 400 }}>{val}</span>
          </div>
        ))}
        <button
          onClick={() => router.push("/screen/review-confirm")}
          style={{
            width: "100%", padding: "15px", borderRadius: 14, marginTop: 10,
            background: "var(--amber)", color: "#000",
            fontWeight: 700, fontSize: 15, border: "none", cursor: "pointer",
            fontFamily: "var(--font-body)",
          }}
        >
          Confirm Split →
        </button>
      </div>
    </div>
  );
}
