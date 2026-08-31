"use client";

import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { friends, currentUser } from "@/lib/mock-data";

const PEOPLE = [
  { id: currentUser.id, name: "Eli", color: "#F59E0B", pct: 25 },
  { id: friends[0].id, name: "Sofia", color: "#ea580c", pct: 25 },
  { id: friends[1].id, name: "Marcus", color: "#16a34a", pct: 25 },
  { id: friends[2].id, name: "Jade", color: "#7c3aed", pct: 25 },
];

function polarToCartesian(cx: number, cy: number, r: number, angle: number) {
  const rad = ((angle - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function describeArc(cx: number, cy: number, r: number, start: number, end: number) {
  const s = polarToCartesian(cx, cy, r, start);
  const e = polarToCartesian(cx, cy, r, end);
  const large = end - start > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y} Z`;
}

export default function RouletteScreen() {
  const router = useRouter();
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [winner, setWinner] = useState<string | null>(null);
  const wheelRef = useRef<SVGGElement>(null);

  const spin = () => {
    if (spinning || winner) return;
    setSpinning(true);
    const extraSpins = 5 + Math.random() * 5;
    const finalAngle = extraSpins * 360 + Math.random() * 360;
    const newRot = rotation + finalAngle;
    setRotation(newRot);

    setTimeout(() => {
      setSpinning(false);
      // Determine winner based on final angle
      const norm = ((newRot % 360) + 360) % 360;
      let cumulative = 0;
      for (const p of PEOPLE) {
        cumulative += p.pct;
        if (norm < cumulative) {
          setWinner(p.name);
          break;
        }
      }
      if (!winner) setWinner(PEOPLE[0].name);
    }, 3500);
  };

  const cx = 130, cy = 130, r = 110;
  let startAngle = 0;

  return (
    <div style={{ height: "100%", background: "var(--bg-base)", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "20px 20px 8px", flexShrink: 0 }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 600, color: "var(--text)" }}>Roulette 🎡</div>
        <div style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "var(--font-body)", marginTop: 3 }}>
          Your share = your slice. Spin to find your fate.
        </div>
      </div>

      {/* Wheel */}
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "8px 0", flexShrink: 0, position: "relative" }}>
        {/* Pointer */}
        <div style={{
          position: "absolute",
          top: 16,
          left: "50%",
          transform: "translateX(-50%)",
          width: 0,
          height: 0,
          borderLeft: "10px solid transparent",
          borderRight: "10px solid transparent",
          borderTop: "24px solid var(--amber)",
          zIndex: 10,
          filter: "drop-shadow(0 2px 4px rgba(245,158,11,0.6))",
        }} />

        <svg width={260} height={260} viewBox="0 0 260 260">
          <g
            style={{
              transformOrigin: "130px 130px",
              transform: `rotate(${rotation}deg)`,
              transition: spinning ? "transform 3.5s cubic-bezier(0.17, 0.67, 0.12, 1.0)" : "none",
            }}
          >
            {PEOPLE.map((p) => {
              const end = startAngle + p.pct * 3.6;
              const path = describeArc(cx, cy, r, startAngle, end);
              const mid = startAngle + (p.pct * 3.6) / 2;
              const tp = polarToCartesian(cx, cy, r * 0.65, mid);
              const result = (
                <g key={p.id}>
                  <path d={path} fill={p.color} stroke="#000" strokeWidth={1} />
                  <text x={tp.x} y={tp.y} textAnchor="middle" dominantBaseline="middle" fill="#fff" fontSize={11} fontWeight={700} fontFamily="DM Sans">
                    {p.name[0]}
                  </text>
                </g>
              );
              startAngle = end;
              return result;
            })}
            <circle cx={cx} cy={cy} r={18} fill="#0f0c08" stroke="var(--border-bright)" strokeWidth={2} />
          </g>
        </svg>
      </div>

      {/* Legend */}
      <div style={{ padding: "0 20px", display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", flexShrink: 0 }}>
        {PEOPLE.map((p) => (
          <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px 10px", borderRadius: 8, background: `${p.color}20`, border: `1px solid ${p.color}40` }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: p.color }} />
            <span style={{ fontSize: 11, color: p.color, fontFamily: "var(--font-body)", fontWeight: 600 }}>{p.name} 25%</span>
          </div>
        ))}
      </div>

      {/* Winner */}
      {winner && (
        <div style={{
          margin: "12px 20px 0",
          padding: "16px",
          borderRadius: 14,
          background: "rgba(245,158,11,0.1)",
          border: "1px solid rgba(245,158,11,0.3)",
          textAlign: "center",
          animation: "bounce-in 0.4s ease",
        }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 600, color: "var(--amber)" }}>
            🎉 {winner} wins!
          </div>
          <div style={{ fontSize: 13, color: "var(--text-secondary)", fontFamily: "var(--font-body)", marginTop: 4 }}>
            They get the lowest share this time
          </div>
        </div>
      )}

      <div style={{ flex: 1 }} />

      <div style={{ padding: "16px 20px", borderTop: "1px solid var(--border)", background: "var(--bg-surface)", flexShrink: 0 }}>
        {!winner ? (
          <button
            onClick={spin}
            disabled={spinning}
            style={{
              width: "100%", padding: "16px", borderRadius: 14,
              background: "linear-gradient(135deg, #7c3aed, #dc2626)",
              color: "#fff",
              fontWeight: 700, fontSize: 16, border: "none",
              cursor: spinning ? "not-allowed" : "pointer",
              fontFamily: "var(--font-body)",
              opacity: spinning ? 0.7 : 1,
            }}
          >
            {spinning ? "Spinning... 🌀" : "🎡 Spin the Wheel!"}
          </button>
        ) : (
          <button
            onClick={() => router.push("/screen/gamble-results")}
            style={{
              width: "100%", padding: "16px", borderRadius: 14,
              background: "var(--amber)", color: "#000",
              fontWeight: 700, fontSize: 15, border: "none", cursor: "pointer",
              fontFamily: "var(--font-body)",
            }}
          >
            See Payment Breakdown →
          </button>
        )}
      </div>
    </div>
  );
}
