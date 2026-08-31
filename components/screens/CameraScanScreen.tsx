"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CameraScanScreen() {
  const router = useRouter();
  const [phase, setPhase] = useState<"scanning" | "detected">("scanning");

  useEffect(() => {
    const t = setTimeout(() => setPhase("detected"), 2000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{ height: "100%", position: "relative", background: "#000", overflow: "hidden" }}>
      {/* Mock camera view */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: "linear-gradient(180deg, #0a0a0a 0%, #1a1510 50%, #0a0a0a 100%)",
      }}>
        {/* Fake receipt image */}
        <div style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "65%",
          background: "#fff",
          borderRadius: 4,
          padding: "16px 12px",
          boxShadow: "0 10px 40px rgba(0,0,0,0.6)",
          opacity: 0.9,
        }}>
          <div style={{ fontFamily: "monospace", fontSize: 7, color: "#000", lineHeight: 1.6 }}>
            <div style={{ textAlign: "center", fontWeight: 700, marginBottom: 4 }}>FUEGO & SOL MEXICAN</div>
            <div style={{ textAlign: "center", fontSize: 6, marginBottom: 8, color: "#555" }}>Table 12 · Server: Jamie</div>
            <div style={{ borderTop: "1px dashed #999", marginBottom: 6 }} />
            {[
              ["Spicy Tuna Roll", "18.00"],
              ["Wagyu Sliders x2", "32.00"],
              ["Truffle Fries", "14.00"],
              ["Calamari", "16.00"],
              ["Craft Cocktail x2", "28.00"],
              ["Caesar Salad", "13.00"],
              ["Ribeye Steak", "54.00"],
              ["Crème Brûlée", "12.00"],
            ].map(([name, price]) => (
              <div key={name} style={{ display: "flex", justifyContent: "space-between" }}>
                <span>{name}</span>
                <span>${price}</span>
              </div>
            ))}
            <div style={{ borderTop: "1px dashed #999", margin: "6px 0" }} />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Subtotal</span><span>$187.00</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Tax (8%)</span><span>$14.96</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700 }}>
              <span>Total</span><span>$201.96</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scan line */}
      {phase === "scanning" && (
        <div style={{
          position: "absolute",
          left: "10%",
          right: "10%",
          height: 2,
          background: "linear-gradient(90deg, transparent, var(--amber), transparent)",
          boxShadow: "0 0 8px var(--amber)",
          animation: "scanline 1.5s linear infinite",
          top: "20%",
        }} />
      )}

      {/* Scan corners */}
      <div style={{ position: "absolute", top: "15%", left: "17.5%", width: 24, height: 24, borderTop: "2px solid var(--amber)", borderLeft: "2px solid var(--amber)" }} />
      <div style={{ position: "absolute", top: "15%", right: "17.5%", width: 24, height: 24, borderTop: "2px solid var(--amber)", borderRight: "2px solid var(--amber)" }} />
      <div style={{ position: "absolute", bottom: "35%", left: "17.5%", width: 24, height: 24, borderBottom: "2px solid var(--amber)", borderLeft: "2px solid var(--amber)" }} />
      <div style={{ position: "absolute", bottom: "35%", right: "17.5%", width: 24, height: 24, borderBottom: "2px solid var(--amber)", borderRight: "2px solid var(--amber)" }} />

      {/* Top UI */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        padding: "16px 20px",
        background: "linear-gradient(180deg, rgba(0,0,0,0.8), transparent)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <button
          onClick={() => router.push("/screen/new-split")}
          style={{ color: "var(--text)", background: "none", border: "none", cursor: "pointer", fontSize: 14, fontFamily: "var(--font-body)" }}
        >
          Cancel
        </button>
        <div style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "var(--text)", fontWeight: 600 }}>Scan Receipt</div>
        <div style={{ width: 50 }} />
      </div>

      {/* Bottom */}
      <div style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        padding: "20px",
        background: "linear-gradient(0deg, rgba(0,0,0,0.9), transparent)",
      }}>
        {phase === "scanning" ? (
          <div style={{ textAlign: "center" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 20px", borderRadius: 20, background: "rgba(0,0,0,0.6)", border: "1px solid var(--border-bright)" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--amber)", animation: "pulse-ring 1s ease infinite" }} />
              <span style={{ fontSize: 13, color: "var(--text)", fontFamily: "var(--font-body)" }}>Scanning...</span>
            </div>
          </div>
        ) : (
          <div style={{
            background: "var(--bg-surface)",
            borderRadius: 20,
            padding: "20px",
            border: "1px solid var(--amber)",
            animation: "bounce-in 0.4s ease",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <div style={{ fontSize: 24 }}>✅</div>
              <div>
                <div style={{ fontFamily: "var(--font-body)", fontSize: 15, fontWeight: 600, color: "var(--amber)" }}>Detected 8 items</div>
                <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--text-muted)" }}>$187.00 subtotal · tap to review</div>
              </div>
            </div>
            <button
              onClick={() => router.push("/screen/items-detected")}
              style={{
                width: "100%", padding: "14px", borderRadius: 12,
                background: "var(--amber)", color: "#000",
                fontWeight: 700, fontSize: 15, border: "none", cursor: "pointer",
                fontFamily: "var(--font-body)",
              }}
            >
              Review Items →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
