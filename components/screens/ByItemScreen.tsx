"use client";

import { useRouter } from "next/navigation";
import { receiptItems, friends, currentUser } from "@/lib/mock-data";
import { useState } from "react";

const PEOPLE = [
  { id: currentUser.id, name: "You", avatar: currentUser.avatar },
  ...friends.slice(0, 3).map((f) => ({ id: f.id, name: f.name, avatar: f.avatar })),
];

export default function ByItemScreen() {
  const router = useRouter();
  const [assignments, setAssignments] = useState<Record<string, string>>({});

  const assign = (itemId: string, personId: string) => {
    setAssignments((a) => ({ ...a, [itemId]: personId }));
  };

  const assigned = Object.keys(assignments).length;

  return (
    <div style={{ height: "100%", background: "var(--bg-base)", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "20px 20px 12px", flexShrink: 0 }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 600, color: "var(--text)" }}>
          By Item
        </div>
        <div style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "var(--font-body)", marginTop: 4 }}>
          {assigned}/{receiptItems.length} items assigned
        </div>
      </div>

      {/* Person chips */}
      <div style={{ padding: "0 20px 12px", flexShrink: 0, display: "flex", gap: 8, overflowX: "auto" }}>
        {PEOPLE.map((p) => {
          const count = Object.values(assignments).filter((v) => v === p.id).length;
          const total = receiptItems.filter((i) => assignments[i.id] === p.id).reduce((s, i) => s + i.price, 0);
          return (
            <div key={p.id} style={{
              flexShrink: 0,
              padding: "8px 12px",
              borderRadius: 12,
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}>
              <img src={p.avatar} alt={p.name} style={{ width: 24, height: 24, borderRadius: "50%" }} />
              <div>
                <div style={{ fontSize: 11, color: "var(--text)", fontFamily: "var(--font-body)", fontWeight: 600 }}>{p.name}</div>
                <div style={{ fontSize: 10, color: "var(--amber)", fontFamily: "var(--font-body)" }}>${total.toFixed(2)}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Items */}
      <div style={{ flex: 1, overflowY: "auto", padding: "0 20px" }}>
        {receiptItems.map((item) => (
          <div key={item.id} style={{
            padding: "12px 0",
            borderBottom: "1px solid var(--border)",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 14, color: "var(--text)", fontFamily: "var(--font-body)", fontWeight: 500 }}>{item.name}</span>
              <span style={{ fontSize: 14, color: "var(--amber)", fontFamily: "var(--font-body)", fontWeight: 600 }}>${item.price.toFixed(2)}</span>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              {PEOPLE.map((p) => (
                <button
                  key={p.id}
                  onClick={() => assign(item.id, p.id)}
                  style={{
                    padding: "4px 10px",
                    borderRadius: 8,
                    background: assignments[item.id] === p.id ? "var(--amber)" : "var(--bg-card)",
                    color: assignments[item.id] === p.id ? "#000" : "var(--text-muted)",
                    fontSize: 11,
                    border: `1px solid ${assignments[item.id] === p.id ? "var(--amber)" : "var(--border)"}`,
                    cursor: "pointer",
                    fontFamily: "var(--font-body)",
                    fontWeight: assignments[item.id] === p.id ? 600 : 400,
                  }}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={{ padding: "16px 20px", borderTop: "1px solid var(--border)", background: "var(--bg-surface)", flexShrink: 0 }}>
        <button
          onClick={() => router.push("/screen/review-confirm")}
          style={{
            width: "100%", padding: "15px", borderRadius: 14,
            background: "var(--amber)", color: "#000",
            fontWeight: 700, fontSize: 15, border: "none", cursor: "pointer",
            fontFamily: "var(--font-body)",
          }}
        >
          Review Split →
        </button>
      </div>
    </div>
  );
}
