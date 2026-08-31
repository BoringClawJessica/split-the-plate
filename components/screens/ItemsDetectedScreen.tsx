"use client";

import { useRouter } from "next/navigation";
import { receiptItems } from "@/lib/mock-data";
import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";

export default function ItemsDetectedScreen() {
  const router = useRouter();
  const [items, setItems] = useState(receiptItems);

  const total = items.reduce((s, i) => s + i.price, 0);

  return (
    <div style={{ height: "100%", background: "var(--bg-base)", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "20px 20px 12px", flexShrink: 0 }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 600, color: "var(--text)" }}>
          Items Detected
        </div>
        <div style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "var(--font-body)", marginTop: 4 }}>
          {items.length} items · ${total.toFixed(2)} subtotal
        </div>
      </div>

      {/* Items list */}
      <div style={{ flex: 1, overflowY: "auto", padding: "0 20px" }}>
        {items.map((item, idx) => (
          <div key={item.id} style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "12px 0",
            borderBottom: "1px solid var(--border)",
          }}>
            <div style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "var(--amber)",
              flexShrink: 0,
            }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, color: "var(--text)", fontFamily: "var(--font-body)", fontWeight: 500 }}>
                {item.name}
              </div>
            </div>
            <div style={{ fontSize: 15, fontWeight: 600, color: "var(--text)", fontFamily: "var(--font-body)" }}>
              ${item.price.toFixed(2)}
            </div>
            <button
              onClick={() => setItems(items.filter((_, i) => i !== idx))}
              style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: 4 }}
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}

        {/* Add item */}
        <button style={{
          width: "100%",
          padding: "12px",
          marginTop: 8,
          borderRadius: 10,
          background: "transparent",
          border: "1px dashed var(--border-bright)",
          color: "var(--text-muted)",
          fontSize: 13,
          cursor: "pointer",
          fontFamily: "var(--font-body)",
        }}>
          + Add missing item
        </button>
      </div>

      {/* Total + CTA */}
      <div style={{ padding: "16px 20px", borderTop: "1px solid var(--border)", background: "var(--bg-surface)", flexShrink: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
          <span style={{ fontSize: 14, color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}>Subtotal</span>
          <span style={{ fontSize: 16, fontWeight: 700, color: "var(--amber)", fontFamily: "var(--font-body)" }}>${total.toFixed(2)}</span>
        </div>
        <button
          onClick={() => router.push("/screen/add-people")}
          style={{
            width: "100%", padding: "15px", borderRadius: 14,
            background: "var(--amber)", color: "#000",
            fontWeight: 700, fontSize: 15, border: "none", cursor: "pointer",
            fontFamily: "var(--font-body)",
          }}
        >
          Looks good → Add people
        </button>
      </div>
    </div>
  );
}
