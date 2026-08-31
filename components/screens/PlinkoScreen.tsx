"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { friends, currentUser } from "@/lib/mock-data";

const PEOPLE = [
  { id: currentUser.id, name: "Eli", color: "#F59E0B" },
  { id: friends[0].id, name: "Sofia", color: "#ea580c" },
  { id: friends[1].id, name: "Marcus", color: "#16a34a" },
  { id: friends[2].id, name: "Jade", color: "#7c3aed" },
];

const PEGS_ROWS = 6;
const BOARD_W = 280;
const BOARD_H = 200;

export default function PlinkoScreen() {
  const router = useRouter();
  const [phase, setPhase] = useState<"ready" | "dropping" | "settled">("ready");
  const [ballPositions, setBallPositions] = useState<{ x: number; y: number; person: number }[]>([]);
  const [results, setResults] = useState<{ name: string; pct: number; color: string }[]>([]);
  const [allDropped, setAllDropped] = useState(false);

  const drop = () => {
    if (phase !== "ready") return;
    setPhase("dropping");

    // Pre-compute all ball final positions
    const finals = PEOPLE.map((_, i) => ({
      x: Math.random() * (BOARD_W - 40) + 20,
      y: BOARD_H - 20,
      person: i,
    }));

    // Animate balls dropping one by one
    PEOPLE.forEach((_, i) => {
      setTimeout(() => {
        setBallPositions((prev) => [...prev, finals[i]]);
        if (i === PEOPLE.length - 1) {
          // ALL balls dropped — NOW compute results
          setTimeout(() => {
            setAllDropped(true);
            setPhase("settled");
            // Assign percentages based on x position (left = less, right = more)
            const sorted = finals.sort((a, b) => a.x - b.x);
            const pcts = [15, 20, 25, 40];
            const res = PEOPLE.map((p, idx) => {
              const sortedIdx = sorted.findIndex((f) => f.person === idx);
              return { name: p.name, pct: pcts[sortedIdx], color: p.color };
            });
            setResults(res);
          }, 800);
        }
      }, i * 600);
    });
  };

  return (
    <div style={{ height: "100%", background: "var(--bg-base)", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "20px 20px 8px", flexShrink: 0 }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 600, color: "var(--text)" }}>Plinko 🎯</div>
        <div style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "var(--font-body)", marginTop: 3 }}>
          {phase === "ready" ? "Drop all balls — results reveal after everyone lands" : phase === "dropping" ? "Dropping balls..." : "Results are in!"}
        </div>
      </div>

      {/* Board */}
      <div style={{ display: "flex", justifyContent: "center", padding: "12px 0", flexShrink: 0 }}>
        <div style={{
          width: BOARD_W,
          height: BOARD_H + 40,
          background: "var(--bg-card)",
          border: "1px solid var(--border-bright)",
          borderRadius: 16,
          position: "relative",
          overflow: "hidden",
        }}>
          {/* Pegs */}
          {Array.from({ length: PEGS_ROWS }).map((_, row) =>
            Array.from({ length: row % 2 === 0 ? 5 : 4 }).map((_, col) => {
              const cols = row % 2 === 0 ? 5 : 4;
              const x = (col + (row % 2 === 0 ? 0 : 0.5)) * (BOARD_W / (cols - 0.5)) + 10;
              const y = (row + 1) * (BOARD_H / (PEGS_ROWS + 1));
              return (
                <div
                  key={`${row}-${col}`}
                  style={{
                    position: "absolute",
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "var(--border-bright)",
                    left: x - 4,
                    top: y - 4,
                  }}
                />
              );
            })
          )}

          {/* Balls */}
          {ballPositions.map((ball, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                width: 18,
                height: 18,
                borderRadius: "50%",
                background: PEOPLE[ball.person].color,
                left: ball.x - 9,
                top: ball.y - 9,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 9,
                fontWeight: 700,
                color: "#000",
                boxShadow: `0 0 8px ${PEOPLE[ball.person].color}80`,
                animation: "plinko-drop 0.8s ease-out",
                zIndex: 2,
              }}
            >
              {PEOPLE[ball.person].name[0]}
            </div>
          ))}

          {/* Columns label */}
          <div style={{
            position: "absolute",
            bottom: 4,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "space-around",
            padding: "0 8px",
          }}>
            {["15%", "20%", "25%", "30%", "40%"].map((pct) => (
              <div key={pct} style={{ fontSize: 8, color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>{pct}</div>
            ))}
          </div>
        </div>
      </div>

      {/* People chips */}
      <div style={{ padding: "0 20px 12px", display: "flex", gap: 8, justifyContent: "center", flexShrink: 0 }}>
        {PEOPLE.map((p) => (
          <div key={p.id} style={{
            padding: "6px 12px",
            borderRadius: 10,
            background: `${p.color}20`,
            border: `1px solid ${p.color}40`,
            fontSize: 11,
            color: p.color,
            fontFamily: "var(--font-body)",
            fontWeight: 600,
          }}>
            {p.name[0]} {p.name}
          </div>
        ))}
      </div>

      {/* Results (only after all drop) */}
      {allDropped && results.length > 0 && (
        <div style={{ flex: 1, overflowY: "auto", padding: "0 20px" }}>
          <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-body)", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.06em" }}>Results</div>
          {results.map((r) => (
            <div key={r.name} style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 0",
              borderBottom: "1px solid var(--border)",
            }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: r.color, flexShrink: 0 }} />
              <div style={{ flex: 1, fontSize: 14, color: "var(--text)", fontFamily: "var(--font-body)", fontWeight: 500 }}>{r.name}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: r.color, fontFamily: "var(--font-body)" }}>{r.pct}%</div>
              <div style={{ fontSize: 13, color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}>
                ${((187 * 1.08 * r.pct) / 100).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ padding: "16px 20px", borderTop: "1px solid var(--border)", background: "var(--bg-surface)", flexShrink: 0 }}>
        {phase === "ready" ? (
          <button
            onClick={drop}
            style={{
              width: "100%", padding: "16px", borderRadius: 14,
              background: "linear-gradient(135deg, #dc2626, var(--orange))",
              color: "#fff",
              fontWeight: 700, fontSize: 16, border: "none", cursor: "pointer",
              fontFamily: "var(--font-body)",
              boxShadow: "0 8px 24px rgba(220,38,38,0.4)",
            }}
          >
            🎯 Drop All Balls!
          </button>
        ) : phase === "settled" ? (
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
        ) : (
          <div style={{ textAlign: "center", color: "var(--text-muted)", fontFamily: "var(--font-body)", fontSize: 14 }}>
            Dropping... 🎲
          </div>
        )}
      </div>
    </div>
  );
}
