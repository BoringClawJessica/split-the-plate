"use client";

import { useRouter } from "next/navigation";
import { gambleModes } from "@/lib/mock-data";
import { Circle, Target, AlertTriangle } from "lucide-react";
import { BackButton, HomeBottomBar } from "../PhoneNav";

const routeMap: Record<string, string> = {
  plinko: "/screen/plinko-settings",
  roulette: "/screen/roulette-settings",
};

const riskColors: Record<string, string> = {
  Low: "#16a34a",
  Medium: "#F59E0B",
  High: "#dc2626",
};

const iconFor = (id: string) => {
  if (id === "plinko") return <Target size={26} strokeWidth={1.6} color="#f87171" />;
  return <Circle size={26} strokeWidth={1.6} color="#f87171" />;
};

export default function GamblePickerScreen() {
  const router = useRouter();

  return (
    <div style={{ position: "relative", height: "100%", background: "var(--bg-base)", display: "flex", flexDirection: "column", padding: "56px 20px 24px" }}>
      <BackButton to="/screen/split-method" />
      <div style={{ marginBottom: 8 }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 600, color: "var(--text)" }}>
          Gamble Pay
        </div>
        <div style={{ fontSize: 13, color: "var(--text-secondary)", fontFamily: "var(--font-body)", marginTop: 4 }}>
          Pick a game. Your fate is in the numbers.
        </div>
      </div>

      {/* Warning */}
      <div style={{
        padding: "10px 14px",
        borderRadius: 10,
        background: "rgba(220,38,38,0.1)",
        border: "1px solid rgba(220,38,38,0.2)",
        marginBottom: 20,
        fontSize: 12,
        color: "#f87171",
        fontFamily: "var(--font-body)",
        lineHeight: 1.5,
        display: "flex",
        alignItems: "flex-start",
        gap: 8,
      }}>
        <AlertTriangle size={14} style={{ marginTop: 2, flexShrink: 0 }} />
        <span>Once a game starts, the result is final. Everyone must agree before playing.</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, flex: 1 }}>
        {gambleModes.map((mode) => (
          <button
            key={mode.id}
            onClick={() => router.push(routeMap[mode.id])}
            style={{
              padding: "20px",
              borderRadius: 18,
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              cursor: "pointer",
              textAlign: "left",
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
          >
            <div style={{
              width: 60,
              height: 60,
              borderRadius: 18,
              background: "linear-gradient(135deg, rgba(220,38,38,0.3), rgba(234,88,12,0.2))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              border: "1px solid rgba(220,38,38,0.2)",
            }}>
              {iconFor(mode.id)}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 16, fontWeight: 600, color: "var(--text)", marginBottom: 4 }}>
                {mode.name}
              </div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--text-muted)", lineHeight: 1.4, marginBottom: 6 }}>
                {mode.description}
              </div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 8px", borderRadius: 6, background: `${riskColors[mode.risk]}20`, border: `1px solid ${riskColors[mode.risk]}40` }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: riskColors[mode.risk] }} />
                <span style={{ fontSize: 10, color: riskColors[mode.risk], fontFamily: "var(--font-body)", fontWeight: 600 }}>{mode.risk} Risk</span>
              </div>
            </div>
            <div style={{ color: "var(--text-muted)", fontSize: 20 }}>›</div>
          </button>
        ))}
      </div>
      <HomeBottomBar hidden />
    </div>
  );
}
