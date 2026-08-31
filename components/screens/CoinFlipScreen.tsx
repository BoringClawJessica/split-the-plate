"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CoinFlipScreen() {
  const router = useRouter();
  const [phase, setPhase] = useState<"ready" | "flipping" | "done">("ready");
  const [result, setResult] = useState<"heads" | "tails" | null>(null);

  const flip = () => {
    if (phase !== "ready") return;
    setPhase("flipping");
    setTimeout(() => {
      const r = Math.random() > 0.5 ? "heads" : "tails";
      setResult(r);
      setPhase("done");
    }, 1500);
  };

  return (
    <div style={{ height: "100%", background: "var(--bg-base)", display: "flex", flexDirection: "column", padding: "28px 20px" }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 600, color: "var(--text)" }}>Coin Flip 🪙</div>
        <div style={{ fontSize: 13, color: "var(--text-secondary)", fontFamily: "var(--font-body)", marginTop: 4 }}>
          Heads wins — loser pays double. High risk, high drama.
        </div>
      </div>

      {/* Coin */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 32, flex: 1, alignItems: "center" }}>
        <div style={{
          width: 160,
          height: 160,
          borderRadius: "50%",
          background: phase === "done"
            ? result === "heads"
              ? "linear-gradient(135deg, #F59E0B, #d97706)"
              : "linear-gradient(135deg, #6b7280, #4b5563)"
            : "linear-gradient(135deg, #F59E0B, #ea580c)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 72,
          boxShadow: phase === "done"
            ? `0 0 40px ${result === "heads" ? "rgba(245,158,11,0.5)" : "rgba(107,114,128,0.3)"}`
            : "0 20px 60px rgba(245,158,11,0.3)",
          animation: phase === "flipping" ? "spin 0.3s linear infinite" : phase === "done" ? "bounce-in 0.4s ease" : "float 3s ease-in-out infinite",
          border: "4px solid rgba(255,255,255,0.1)",
        }}>
          {phase === "done" ? (result === "heads" ? "👑" : "🪙") : "🪙"}
        </div>
      </div>

      {phase === "done" && (
        <div style={{
          padding: "20px",
          borderRadius: 18,
          background: result === "heads" ? "rgba(245,158,11,0.1)" : "rgba(107,114,128,0.1)",
          border: `1px solid ${result === "heads" ? "rgba(245,158,11,0.3)" : "rgba(107,114,128,0.3)"}`,
          textAlign: "center",
          marginBottom: 20,
          animation: "bounce-in 0.4s ease",
        }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 700, color: result === "heads" ? "var(--amber)" : "var(--text)" }}>
            {result === "heads" ? "HEADS! 👑" : "TAILS! 🪙"}
          </div>
          <div style={{ fontSize: 14, color: "var(--text-secondary)", fontFamily: "var(--font-body)", marginTop: 8 }}>
            {result === "heads" ? "🎉 Eli wins — pays the lowest share" : "😅 Eli pays double — Sofia's covered"}
          </div>
        </div>
      )}

      <button
        onClick={phase === "done" ? () => router.push("/screen/gamble-results") : flip}
        style={{
          width: "100%", padding: "16px", borderRadius: 14,
          background: phase === "done" ? "var(--amber)" : "linear-gradient(135deg, #F59E0B, #ea580c)",
          color: "#000",
          fontWeight: 700, fontSize: 16, border: "none",
          cursor: phase === "flipping" ? "not-allowed" : "pointer",
          fontFamily: "var(--font-body)",
          boxShadow: "0 8px 24px rgba(245,158,11,0.3)",
          opacity: phase === "flipping" ? 0.7 : 1,
        }}
      >
        {phase === "ready" ? "🪙 Flip the Coin!" : phase === "flipping" ? "Flipping..." : "See Results →"}
      </button>
    </div>
  );
}
