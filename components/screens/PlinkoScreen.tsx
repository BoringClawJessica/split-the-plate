"use client";

/**
 * PlinkoScreen — web-native port of Plait's PlinkoGame.
 *
 * Adapted for React DOM / Next.js:
 *   - Rendering: HTML5 Canvas 2D (was: Skia)
 *   - Physics:   matter-js (same as Plait)
 *   - Layout:    fits the 393px phone frame; pegs derived from board size
 *   - Determinism: mulberry32 seeded PRNG (ported verbatim from Plait)
 *
 * Rules:
 *   - Every participant drops one ball. Ball lands in a bucket labelled
 *     with a participant's name. The bucket the ball lands in = who pays.
 *   - Simplified v1 (single "who pays" outcome), not the multi-drop scoring
 *     variant. Same physics feel and deterministic replay.
 *
 * No emojis in the UI. Cream board canvas, warm-black text, brand-orange
 * gradient primary button.
 */

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { currentUser, friends, receiptTotal } from "@/lib/mock-data";

// ---- Participants (mock) ------------------------------------------------
// Brand-family palette: orange gradient neighbours + calm neutrals.
const PEOPLE = [
  { id: currentUser.id, name: "Eli",    color: "#EA580C" }, // brand orange
  { id: friends[0].id,  name: "Sofia",  color: "#F59E0B" }, // amber
  { id: friends[1].id,  name: "Marcus", color: "#B45309" }, // deep amber
  { id: friends[2].id,  name: "Jade",   color: "#7C2D12" }, // burnt sienna
];

// ---- Board layout -------------------------------------------------------
const BOARD_W = 340;         // fits inside 393px phone with side padding
const BOARD_H = 380;
const PEG_ROWS = 8;           // pyramid rows (top row has TOP_ROW_PEGS)
const TOP_ROW_PEGS = 3;
const BUCKET_COUNT = PEOPLE.length;
const BUCKET_H = 56;
const TOP_PAD = 40;

// ---- Deterministic PRNG (mulberry32) — verbatim from Plait --------------
function makeRng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function hashSeed(salt: string, i = 0): number {
  let h = 2166136261 ^ i;
  const str = `${salt}:${i}`;
  for (let j = 0; j < str.length; j++) {
    h ^= str.charCodeAt(j);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

// ---- Peg geometry -------------------------------------------------------
// Ball/peg sizes are derived from horizontal spacing so the ball ALWAYS
// fits through any peg gap with clearance to spare. Same idea as Plait.
function deriveLayout() {
  const bottomRowPegs = TOP_ROW_PEGS + PEG_ROWS - 1;
  const slotW = BOARD_W / BUCKET_COUNT;
  const horizSpacing = (BOARD_W - slotW) / (bottomRowPegs - 1);
  const CLEARANCE = 6;
  const maxBallR = (horizSpacing - CLEARANCE) / 2.8;
  const ballRadius = Math.max(6, Math.min(11, Math.floor(maxBallR)));
  const pegRadius = Math.max(3, Math.round(ballRadius * 0.4));
  return { pegRadius, ballRadius, horizSpacing, slotW, bottomRowPegs };
}

function buildPegs(pegRadius: number, ballRadius: number, horizSpacing: number) {
  const pegs: { x: number; y: number }[] = [];
  const centerX = BOARD_W / 2;
  const usableH = BOARD_H - TOP_PAD - BUCKET_H - 10;
  const rowHeight = Math.max(ballRadius * 2 + 10, usableH / (PEG_ROWS - 1));
  for (let row = 0; row < PEG_ROWS; row++) {
    const cols = TOP_ROW_PEGS + row;
    const startX = centerX - ((cols - 1) / 2) * horizSpacing;
    for (let col = 0; col < cols; col++) {
      pegs.push({
        x: startX + col * horizSpacing,
        y: TOP_PAD + row * rowHeight,
      });
    }
  }
  return pegs;
}

// ---- Theme --------------------------------------------------------------
// Cream board canvas, warm-black text, brand-orange accents.
const BOARD_BG = "#f6efe4";       // cream
const BOARD_STROKE = "#e6dcc7";
const PEG_COLOR = "#c9b48f";
const BUCKET_STROKE = "#d9c9a8";
const TEXT_WARM = "#1a1510";
const TEXT_WARM_SOFT = "#5c4a2f";

// ------------------------------------------------------------------------

type Phase = "ready" | "dropping" | "settled";

export default function PlinkoScreen() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<import("matter-js").Engine | null>(null);
  const ballBodyRef = useRef<import("matter-js").Body | null>(null);
  const rafRef = useRef<number | null>(null);
  const seedRef = useRef<number>(0);

  const [phase, setPhase] = useState<Phase>("ready");
  const [loserIdx, setLoserIdx] = useState<number | null>(null);

  const layout = useMemo(() => deriveLayout(), []);
  const pegs = useMemo(
    () => buildPegs(layout.pegRadius, layout.ballRadius, layout.horizSpacing),
    [layout],
  );

  // ---- Draw current frame ----------------------------------------------
  const draw = (ballPos?: { x: number; y: number; color: string } | null) => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;

    // Board background
    ctx.fillStyle = BOARD_BG;
    ctx.fillRect(0, 0, BOARD_W, BOARD_H);

    // Board border
    ctx.strokeStyle = BOARD_STROKE;
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, BOARD_W - 2, BOARD_H - 2);

    // Pegs
    ctx.fillStyle = PEG_COLOR;
    for (const p of pegs) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, layout.pegRadius, 0, Math.PI * 2);
      ctx.fill();
    }

    // Buckets (bottom row) with participant names.
    const slotW = layout.slotW;
    const bucketTop = BOARD_H - BUCKET_H;
    for (let i = 0; i < BUCKET_COUNT; i++) {
      const x = i * slotW;
      const isLoser = loserIdx === i;
      // Bucket fill
      ctx.fillStyle = isLoser
        ? "rgba(234, 88, 12, 0.18)" // brand orange tint
        : "rgba(255, 255, 255, 0.35)";
      ctx.fillRect(x + 2, bucketTop, slotW - 4, BUCKET_H);
      // Bucket divider
      if (i > 0) {
        ctx.strokeStyle = BUCKET_STROKE;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x, bucketTop - 10);
        ctx.lineTo(x, BOARD_H);
        ctx.stroke();
      }
      // Colored ribbon under the name (participant's color)
      ctx.fillStyle = PEOPLE[i].color;
      ctx.fillRect(x + 6, bucketTop + BUCKET_H - 4, slotW - 12, 3);
      // Name
      ctx.fillStyle = isLoser ? "#EA580C" : TEXT_WARM;
      ctx.font = `${isLoser ? 700 : 600} 12px "DM Sans", system-ui, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(
        PEOPLE[i].name,
        x + slotW / 2,
        bucketTop + BUCKET_H / 2 - 2,
      );
    }

    // Top divider above buckets
    ctx.strokeStyle = BUCKET_STROKE;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, bucketTop);
    ctx.lineTo(BOARD_W, bucketTop);
    ctx.stroke();

    // Ball
    if (ballPos) {
      // Soft glow
      const g = ctx.createRadialGradient(
        ballPos.x, ballPos.y, 0,
        ballPos.x, ballPos.y, layout.ballRadius * 2.2,
      );
      g.addColorStop(0, "rgba(234,88,12,0.35)");
      g.addColorStop(1, "rgba(234,88,12,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(ballPos.x, ballPos.y, layout.ballRadius * 2.2, 0, Math.PI * 2);
      ctx.fill();

      // Ball body with brand-orange gradient
      const bg = ctx.createLinearGradient(
        ballPos.x - layout.ballRadius, ballPos.y - layout.ballRadius,
        ballPos.x + layout.ballRadius, ballPos.y + layout.ballRadius,
      );
      bg.addColorStop(0, "#F59E0B");
      bg.addColorStop(1, "#EA580C");
      ctx.fillStyle = bg;
      ctx.beginPath();
      ctx.arc(ballPos.x, ballPos.y, layout.ballRadius, 0, Math.PI * 2);
      ctx.fill();
      // Ring
      ctx.strokeStyle = "rgba(26,21,16,0.35)";
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  };

  // Initial paint
  useEffect(() => {
    draw(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loserIdx, pegs, layout]);

  // ---- Drop the ball ----------------------------------------------------
  const drop = async () => {
    if (phase !== "ready") return;
    setPhase("dropping");
    setLoserIdx(null);

    const Matter = await import("matter-js");

    // Seed: derived from a stable label (so replays produce the same run)
    // + current time so consecutive drops in the same session vary.
    seedRef.current = hashSeed("stp-plinko", Date.now() & 0xffff);
    const rng = makeRng(seedRef.current);

    const engine = Matter.Engine.create({
      gravity: { x: 0, y: 1, scale: 0.0022 },
    });
    engineRef.current = engine;
    const world = engine.world;

    // Pegs (static)
    for (const p of pegs) {
      Matter.World.add(
        world,
        Matter.Bodies.circle(p.x, p.y, layout.pegRadius, {
          isStatic: true,
          restitution: 0.55,
          friction: 0.04,
        }),
      );
    }
    // Walls + floor (static)
    Matter.World.add(world, [
      Matter.Bodies.rectangle(-10, BOARD_H / 2, 20, BOARD_H, { isStatic: true }),
      Matter.Bodies.rectangle(BOARD_W + 10, BOARD_H / 2, 20, BOARD_H, { isStatic: true }),
      Matter.Bodies.rectangle(BOARD_W / 2, BOARD_H + 20, BOARD_W, 40, { isStatic: true }),
    ]);
    // Bucket dividers (thin walls sticking up)
    for (let i = 0; i <= BUCKET_COUNT; i++) {
      Matter.World.add(
        world,
        Matter.Bodies.rectangle(
          i * layout.slotW,
          BOARD_H - BUCKET_H / 2,
          3,
          BUCKET_H,
          { isStatic: true },
        ),
      );
    }

    // Ball — small horizontal jitter driven by seeded RNG
    const startX = BOARD_W / 2 + (rng() - 0.5) * 8;
    const ball = Matter.Bodies.circle(startX, 10, layout.ballRadius, {
      restitution: 0.5,
      friction: 0.03,
      frictionAir: 0.025,
      density: 0.0025,
      label: "ball",
    });
    ballBodyRef.current = ball;
    Matter.World.add(world, ball);

    // Physics loop via rAF
    let frame = 0;
    const step = () => {
      if (!engineRef.current || !ballBodyRef.current) return;
      Matter.Engine.update(engineRef.current, 16.666);
      frame += 1;
      const pos = { x: ball.position.x, y: ball.position.y, color: "#EA580C" };
      draw(pos);
      const settled = ball.position.y > BOARD_H - BUCKET_H + layout.ballRadius || frame > 480;
      if (settled) {
        const slotIndex = Math.max(
          0,
          Math.min(BUCKET_COUNT - 1, Math.floor(ball.position.x / layout.slotW)),
        );
        // Cleanup
        Matter.World.clear(world, false);
        Matter.Engine.clear(engine);
        engineRef.current = null;
        ballBodyRef.current = null;

        setLoserIdx(slotIndex);
        setPhase("settled");
        // final paint without ball
        setTimeout(() => draw(null), 300);
        return;
      }
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
  };

  useEffect(() => {
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      if (engineRef.current) {
        // best-effort teardown
        try {
          const M = require("matter-js");
          M.World.clear(engineRef.current.world, false);
          M.Engine.clear(engineRef.current);
        } catch {
          /* ignore */
        }
      }
    };
  }, []);

  const loser = loserIdx != null ? PEOPLE[loserIdx] : null;
  const billTotal = receiptTotal * 1.08;

  return (
    <div style={{ height: "100%", background: "var(--bg-base)", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ padding: "20px 20px 10px", flexShrink: 0 }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 600, color: "var(--text)" }}>
          Plinko
        </div>
        <div style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "var(--font-body)", marginTop: 3 }}>
          {phase === "ready"
            ? "Drop the ball — whoever's bucket it lands in pays the check."
            : phase === "dropping"
            ? "Falling..."
            : `${loser?.name ?? ""} pays this round.`}
        </div>
      </div>

      {/* Board */}
      <div style={{ display: "flex", justifyContent: "center", padding: "8px 0 12px", flexShrink: 0 }}>
        <div
          style={{
            width: BOARD_W,
            borderRadius: 20,
            overflow: "hidden",
            boxShadow: "0 10px 30px rgba(0,0,0,0.35), inset 0 0 0 1px rgba(255,255,255,0.04)",
            background: BOARD_BG,
          }}
        >
          <canvas
            ref={canvasRef}
            width={BOARD_W}
            height={BOARD_H}
            style={{ display: "block", width: BOARD_W, height: BOARD_H }}
          />
        </div>
      </div>

      {/* Legend */}
      <div style={{ padding: "0 20px 10px", display: "flex", gap: 6, justifyContent: "center", flexWrap: "wrap", flexShrink: 0 }}>
        {PEOPLE.map((p, i) => {
          const isLoser = loserIdx === i;
          return (
            <div
              key={p.id}
              style={{
                padding: "5px 10px",
                borderRadius: 999,
                background: isLoser ? "rgba(234,88,12,0.15)" : "rgba(255,255,255,0.04)",
                border: `1px solid ${isLoser ? "rgba(234,88,12,0.5)" : "var(--border)"}`,
                fontSize: 11,
                color: isLoser ? "var(--orange)" : "var(--text-secondary)",
                fontFamily: "var(--font-body)",
                fontWeight: isLoser ? 700 : 600,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: p.color, display: "inline-block" }} />
              {p.name}
            </div>
          );
        })}
      </div>

      {/* Result */}
      {loser && (
        <div
          style={{
            margin: "8px 20px 0",
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
              color: "#fff", fontWeight: 800, fontFamily: "var(--font-body)", fontSize: 15,
              boxShadow: "0 6px 16px rgba(234,88,12,0.35)",
            }}
          >
            {loser.name[0]}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 600, color: "var(--text)" }}>
              {loser.name} pays
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
        {phase === "ready" ? (
          <button
            onClick={drop}
            style={{
              width: "100%",
              padding: "15px",
              borderRadius: 14,
              background: "linear-gradient(135deg, #F59E0B 0%, #EA580C 100%)",
              color: "#1a1510",
              fontWeight: 800,
              fontSize: 15,
              border: "none",
              cursor: "pointer",
              fontFamily: "var(--font-body)",
              letterSpacing: 0.2,
              boxShadow: "0 10px 24px rgba(234,88,12,0.35)",
            }}
          >
            Drop the ball
          </button>
        ) : phase === "settled" ? (
          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={() => { setPhase("ready"); setLoserIdx(null); draw(null); }}
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
              Drop again
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
        ) : (
          <div style={{ textAlign: "center", color: "var(--text-muted)", fontFamily: "var(--font-body)", fontSize: 14 }}>
            Falling...
          </div>
        )}
      </div>
    </div>
  );
}
