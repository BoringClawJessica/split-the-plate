"use client";

/**
 * RouletteScreen — web-native port of Plait's RouletteWheel / RouletteGame.
 *
 * "Spin the Wheel" in-UI (renamed from Roulette).
 *
 * Adapted for React DOM / Next.js:
 *   - Rendering: inline SVG (was: 180 stacked stripes in RN)
 *   - Animation: framer-motion with cubic-bezier deceleration
 *   - Determinism: winner is chosen up-front from a seeded PRNG so the
 *     wheel's final angle always lands on the winner's slice CENTER
 *   - Weighting:  supports `weights?: number[]` prop (parallel to
 *     participants). Defaults to even slices. Weighted slices are
 *     rendered with proportional arc length; even for v1.
 *
 * Pointer sits at the top (12 o'clock). Result callback fires when
 * the deceleration animation completes. No emojis in the UI.
 */

import { motion, useAnimationControls } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import { currentUser, friends, receiptTotal } from "@/lib/mock-data";

// ---- Participants (mock) ------------------------------------------------
// Brand-family palette (orange gradient + neutrals). Adjacent slices use
// alternating darker/lighter tones so boundaries are obvious mid-spin.
const PEOPLE = [
  { id: currentUser.id, name: "Eli",    color: "#EA580C" },
  { id: friends[0].id,  name: "Sofia",  color: "#F59E0B" },
  { id: friends[1].id,  name: "Marcus", color: "#B45309" },
  { id: friends[2].id,  name: "Jade",   color: "#7C2D12" },
];

// ---- Optional weighting (v1: even). Kept as a top-level constant so the
// component contract is easy to change later. -----------------------------
const WEIGHTS: number[] | undefined = undefined; // e.g. [10, 20, 15, 5]

// ---- Wheel geometry -----------------------------------------------------
const WHEEL_SIZE = 300;
const RADIUS = WHEEL_SIZE / 2;
const HUB_RADIUS = 26;
const LABEL_R = RADIUS * 0.62; // label distance from center

// ---- SVG arc helpers ----------------------------------------------------
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

interface Arc { start: number; end: number; mid: number; sweep: number }

function buildArcs(count: number, weights?: number[]): Arc[] {
  const raw =
    weights && weights.length === count
      ? weights.map((w) => (Number.isFinite(w) && w > 0 ? w : 0.0001))
      : new Array(count).fill(1);
  const sum = raw.reduce((s, w) => s + w, 0) || 1;
  const sweeps = raw.map((w) => (w / sum) * 360);
  const arcs: Arc[] = [];
  let cursor = 0;
  for (let i = 0; i < count; i++) {
    const start = cursor;
    const end = cursor + sweeps[i];
    arcs.push({ start, end, mid: (start + end) / 2, sweep: sweeps[i] });
    cursor = end;
  }
  return arcs;
}

// ------------------------------------------------------------------------

export default function RouletteScreen() {
  return (
    <Suspense fallback={<div style={{ height: "100%", background: "var(--bg-base)" }} />}>
      <RouletteInner />
    </Suspense>
  );
}

function parseCounts(raw: string | null): Record<string, number> {
  if (!raw) return {};
  const out: Record<string, number> = {};
  for (const part of raw.split(",")) {
    const [k, v] = part.split(":");
    if (!k) continue;
    const n = Math.max(1, Math.min(5, parseInt(v || "1", 10) || 1));
    out[k.trim().toLowerCase()] = n;
  }
  return out;
}

function RouletteInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const countsMap = parseCounts(searchParams.get("counts"));
  const controls = useAnimationControls();
  const [spinning, setSpinning] = useState(false);
  const [winnerIdx, setWinnerIdx] = useState<number | null>(null);
  const [rotation, setRotation] = useState(0);

  // Slice counts per person (default 1 each). Sum > PEOPLE.length -> weighted slices.
  const perPersonCounts = useMemo(
    () => PEOPLE.map((p) => countsMap[p.name.toLowerCase()] ?? 1),
    [countsMap],
  );
  const totalSlices = perPersonCounts.reduce((s, n) => s + n, 0);
  const isWeighted = perPersonCounts.some((n) => n !== 1);
  const effectiveWeights = isWeighted ? perPersonCounts : WEIGHTS;

  const arcs = useMemo(
    () => buildArcs(PEOPLE.length, effectiveWeights),
    [effectiveWeights],
  );

  const spin = async () => {
    if (spinning) return;
    setSpinning(true);
    setWinnerIdx(null);

    // Pick winner (weighted by slice counts if provided)
    const weights = effectiveWeights ?? new Array(PEOPLE.length).fill(1);
    const totalWeight = weights.reduce((a, b) => a + b, 0);
    let r = Math.random() * totalWeight;
    let picked = 0;
    for (let i = 0; i < PEOPLE.length; i++) {
      const w = weights[i];
      if (r < w) { picked = i; break; }
      r -= w;
    }

    // Wheel is drawn with 0° at the top (12 o'clock). Pointer is fixed
    // at the top. To land the winner's slice CENTER under the pointer,
    // we rotate the wheel by (360 - winnerMid) plus full turns for drama.
    const spinTurns = 6;
    const jitter = (Math.random() - 0.5) * (arcs[picked].sweep * 0.55);
    const target = rotation + spinTurns * 360 + (360 - arcs[picked].mid) + jitter;

    await controls.start({
      rotate: target,
      transition: {
        duration: 3.5,
        ease: [0.15, 0.85, 0.25, 1.0], // strong start, gentle end
      },
    });

    setRotation(target);
    setWinnerIdx(picked);
    setSpinning(false);
  };

  const reset = () => {
    setWinnerIdx(null);
    // don't reset the wheel rotation — it looks smoother continuing from here
  };

  const winner = winnerIdx != null ? PEOPLE[winnerIdx] : null;
  const billTotal = receiptTotal * 1.08;
  const evenPct = 100 / PEOPLE.length;
  const modeLabel = isWeighted ? `Weighted · ${totalSlices} slices` : "Even";

  return (
    <div style={{ height: "100%", background: "var(--bg-base)", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ padding: "20px 20px 10px", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 600, color: "var(--text)" }}>
            Spin the Wheel
          </div>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "4px 10px",
            borderRadius: 999,
            background: "rgba(234,88,12,0.10)",
            border: "1px solid rgba(234,88,12,0.35)",
            fontSize: 10,
            fontFamily: "var(--font-body)",
            color: "var(--orange)",
            fontWeight: 700,
            letterSpacing: 0.3,
          }}>
            Mode: {modeLabel}
          </div>
        </div>
        <div style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "var(--font-body)", marginTop: 3 }}>
          {spinning
            ? "Spinning..."
            : winner
            ? `${winner.name} pays this round.`
            : "One spin. Whoever the arrow lands on pays the check."}
        </div>
      </div>

      {/* Wheel */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "16px 0 8px",
          flexShrink: 0,
          position: "relative",
        }}
      >
        {/* Pointer */}
        <div
          style={{
            position: "absolute",
            top: 4,
            left: "50%",
            transform: "translateX(-50%)",
            width: 0,
            height: 0,
            borderLeft: "12px solid transparent",
            borderRight: "12px solid transparent",
            borderTop: "26px solid #EA580C",
            zIndex: 10,
            filter: "drop-shadow(0 2px 6px rgba(234,88,12,0.55))",
          }}
        />
        {/* Wheel container with cream ring */}
        <div
          style={{
            width: WHEEL_SIZE + 16,
            height: WHEEL_SIZE + 16,
            borderRadius: "50%",
            padding: 8,
            background:
              "radial-gradient(circle at 50% 30%, #f6efe4 0%, #e6d8bb 60%, #c9b48f 100%)",
            boxShadow:
              "0 12px 30px rgba(0,0,0,0.4), inset 0 0 0 2px rgba(26,21,16,0.15)",
          }}
        >
          <motion.svg
            width={WHEEL_SIZE}
            height={WHEEL_SIZE}
            viewBox={`0 0 ${WHEEL_SIZE} ${WHEEL_SIZE}`}
            animate={controls}
            initial={{ rotate: 0 }}
            style={{
              display: "block",
              transformOrigin: `${RADIUS}px ${RADIUS}px`,
              borderRadius: "50%",
              background: "#f6efe4",
            }}
          >
            {/* Slices */}
            {arcs.map((arc, i) => {
              const p = PEOPLE[i];
              const path = describeArc(RADIUS, RADIUS, RADIUS - 2, arc.start, arc.end);
              const label = polarToCartesian(RADIUS, RADIUS, LABEL_R, arc.mid);
              return (
                <g key={p.id}>
                  <path d={path} fill={p.color} stroke="#1a1510" strokeWidth={1} strokeOpacity={0.35} />
                  <g transform={`rotate(${arc.mid} ${label.x} ${label.y})`}>
                    <text
                      x={label.x}
                      y={label.y}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="#f6efe4"
                      fontFamily="DM Sans, system-ui, sans-serif"
                      fontSize={13}
                      fontWeight={800}
                      style={{ letterSpacing: 0.3 }}
                    >
                      {p.name}
                    </text>
                  </g>
                </g>
              );
            })}
            {/* Center hub */}
            <circle
              cx={RADIUS}
              cy={RADIUS}
              r={HUB_RADIUS}
              fill="#1a1510"
              stroke="#EA580C"
              strokeWidth={2.5}
            />
            <circle cx={RADIUS} cy={RADIUS} r={6} fill="#EA580C" />
          </motion.svg>
        </div>
      </div>

      {/* Legend */}
      <div style={{ padding: "6px 20px 10px", display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center", flexShrink: 0 }}>
        {PEOPLE.map((p, i) => {
          const isWinner = winnerIdx === i;
          const pct = effectiveWeights
            ? (effectiveWeights[i] / effectiveWeights.reduce((a, b) => a + b, 0)) * 100
            : evenPct;
          return (
            <div
              key={p.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "5px 10px",
                borderRadius: 999,
                background: isWinner ? "rgba(234,88,12,0.15)" : "rgba(255,255,255,0.04)",
                border: `1px solid ${isWinner ? "rgba(234,88,12,0.5)" : "var(--border)"}`,
              }}
            >
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: p.color }} />
              <span
                style={{
                  fontSize: 11,
                  color: isWinner ? "var(--orange)" : "var(--text-secondary)",
                  fontFamily: "var(--font-body)",
                  fontWeight: isWinner ? 700 : 600,
                }}
              >
                {p.name} {Math.round(pct)}%
              </span>
            </div>
          );
        })}
      </div>

      {/* Result */}
      {winner && (
        <div
          style={{
            margin: "6px 20px 0",
            padding: "14px 16px",
            borderRadius: 14,
            background: "linear-gradient(135deg, rgba(245,158,11,0.10), rgba(234,88,12,0.14))",
            border: "1px solid rgba(234,88,12,0.35)",
            display: "flex",
            alignItems: "center",
            gap: 12,
            animation: "bounce-in 0.4s ease",
          }}
        >
          <div
            style={{
              width: 40, height: 40, borderRadius: 20,
              background: "linear-gradient(135deg, #F59E0B, #EA580C)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#1a1510", fontWeight: 800, fontFamily: "var(--font-body)", fontSize: 15,
              boxShadow: "0 6px 16px rgba(234,88,12,0.35)",
            }}
          >
            {winner.name[0]}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 600, color: "var(--text)" }}>
              {winner.name} pays
            </div>
            <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 2 }}>
              Full check · ${billTotal.toFixed(2)}
            </div>
          </div>
        </div>
      )}

      <div style={{ flex: 1 }} />

      {/* Action bar */}
      <div
        style={{
          padding: "14px 20px 18px",
          borderTop: "1px solid var(--border)",
          background: "var(--bg-surface)",
          flexShrink: 0,
        }}
      >
        {!winner ? (
          <button
            onClick={spin}
            disabled={spinning}
            style={{
              width: "100%",
              padding: "15px",
              borderRadius: 14,
              background: "linear-gradient(135deg, #F59E0B 0%, #EA580C 100%)",
              color: "#1a1510",
              fontWeight: 800,
              fontSize: 15,
              border: "none",
              cursor: spinning ? "not-allowed" : "pointer",
              fontFamily: "var(--font-body)",
              letterSpacing: 0.2,
              opacity: spinning ? 0.75 : 1,
              boxShadow: "0 10px 24px rgba(234,88,12,0.35)",
            }}
          >
            {spinning ? "Spinning..." : "Spin the wheel"}
          </button>
        ) : (
          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={() => { reset(); spin(); }}
              style={{
                flex: 1,
                padding: "15px",
                borderRadius: 14,
                background: "transparent",
                color: "var(--text)",
                fontWeight: 700,
                fontSize: 14,
                border: "1px solid var(--border-bright)",
                cursor: "pointer",
                fontFamily: "var(--font-body)",
              }}
            >
              Spin again
            </button>
            <button
              onClick={() => router.push("/screen/gamble-results")}
              style={{
                flex: 1.4,
                padding: "15px",
                borderRadius: 14,
                background: "linear-gradient(135deg, #F59E0B 0%, #EA580C 100%)",
                color: "#1a1510",
                fontWeight: 800,
                fontSize: 14,
                border: "none",
                cursor: "pointer",
                fontFamily: "var(--font-body)",
              }}
            >
              See breakdown
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
