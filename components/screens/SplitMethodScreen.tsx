"use client";

import { useRouter } from "next/navigation";
import { splitMethods } from "@/lib/mock-data";

const routeMap: Record<string, string> = {
  even: "/screen/even-split",
  by_item: "/screen/by-item",
  custom: "/screen/custom-split",
  gamble: "/screen/gamble-picker",
};

export default function SplitMethodScreen() {
  const router = useRouter();

  return (
    <div style={{ height: "100%", background: "var(--bg-base)", display: "flex", flexDirection: "column", padding: "28px 20px" }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 600, color: "var(--text)" }}>
          How to split?
        </div>
        <div style={{ fontSize: 13, color: "var(--text-secondary)", fontFamily: "var(--font-body)", marginTop: 4 }}>
          5 people · $187.00 subtotal
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, flex: 1 }}>
        {splitMethods.map((method) => (
          <button
            key={method.id}
            onClick={() => router.push(routeMap[method.id] || "/screen/review-confirm")}
            style={{
              padding: "18px",
              borderRadius: 18,
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              cursor: "pointer",
              textAlign: "left",
              display: "flex",
              alignItems: "center",
              gap: 16,
              transition: "all 0.15s",
            }}
            onMouseOver={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "var(--amber-dim)";
              (e.currentTarget as HTMLElement).style.background = "var(--bg-raised)";
            }}
            onMouseOut={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
              (e.currentTarget as HTMLElement).style.background = "var(--bg-card)";
            }}
          >
            <div style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              background: method.id === "gamble" ? "linear-gradient(135deg, rgba(220,38,38,0.3), rgba(234,88,12,0.3))" : "var(--bg-raised)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 24,
              flexShrink: 0,
              border: method.id === "gamble" ? "1px solid rgba(220,38,38,0.3)" : "1px solid var(--border)",
            }}>
              {method.emoji}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{
                fontFamily: "var(--font-body)",
                fontSize: 15,
                fontWeight: 600,
                color: method.id === "gamble" ? "#ea580c" : "var(--text)",
                marginBottom: 4,
              }}>
                {method.name}
                {method.id === "gamble" && (
                  <span style={{
                    marginLeft: 8,
                    fontSize: 10,
                    padding: "2px 6px",
                    borderRadius: 4,
                    background: "rgba(220,38,38,0.2)",
                    color: "#f87171",
                    fontWeight: 400,
                    verticalAlign: "middle",
                  }}>
                    WILD
                  </span>
                )}
              </div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--text-muted)", lineHeight: 1.4 }}>
                {method.description}
              </div>
            </div>
            <div style={{ color: "var(--text-muted)", fontSize: 18 }}>›</div>
          </button>
        ))}
      </div>
    </div>
  );
}
