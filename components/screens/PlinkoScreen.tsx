"use client";

/**
 * PlinkoScreen — points-based multi-player Plinko, ported from old Plait
 * (`plait-app/src/components/games/PlinkoGame.tsx`).
 *
 * Rules (per Eli):
 *   - Each participant has THEIR OWN "Drop Ball" button. They can tap
 *     at any pace to drop all their balls.
 *   - Scoring is by POINTS. Closer to center = fewer points (better).
 *     Further from center = more points (worse).
 *   - Once every player has dropped all their balls, we rank by TOTAL
 *     points (lowest = 1st place → highest = last place) and hand off
 *     to Gamble Results, which uses the shared `computeRankSplit`
 *     formula to compute payment shares for placement mode.
 *   - Loser-pays-all: player(s) with the highest total pay everything.
 *     (Old Plait used "lowest = pays"; Eli's new spec inverts it:
 *     center = few points = winner. So highest = last place = pays.)
 *
 * User controls: mode + balls-per-person only (from PlinkoSettingsScreen).
 * No placement percent sliders anywhere.
 */

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { ArrowDown, CheckCircle2, Trophy } from "lucide-react";
import { currentUser, friends } from "@/lib/mock-data";
import { readSplit, SplitPerson } from "@/lib/split-state";
import { BackButton } from "../PhoneNav";

// ---- Board layout (5-slot preset) ---------------------------------------
// Same idea as old Plait's `BOARD_PRESETS.small` but flipped for points:
// center bucket = 0 pts (best), ends = 8 pts (worst).
const BOARD_W = 340;
const BOARD_H = 400;
const PEG_ROWS = 8;
const TOP_ROW_PEGS = 3;
const BUCKET_COUNT = 5;
// Points per slot, LOW in the middle (winner), HIGH at the ends (loser).
// Mirror-symmetric so left/right are equally punishing.
const SLOT_POINTS = [10, 5, 2, 5, 10];
const BUCKET_H = 48;
const TOP_PAD = 40;

// ---- Colors (participant palette) — brand-orange-adjacent ---------------
const COLORS = [
  "#EA580C",
  "#F59E0B",
  "#B45309",
  "#7C2D12",
  "#0891b2",
  "#7c3aed",
  "#16a34a",
  "#dc2626",
];

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
function hashSeed(uid: string, dropIndex: number, salt = 0): number {
  let h = 2166136261 ^ salt;
  const str = `${uid}:${dropIndex}:${salt}`;
  for (let j = 0; j < str.length; j++) {
    h ^= str.charCodeAt(j);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

// ---- Peg geometry — derived so balls always fit through peg gaps --------
function deriveLayout() {
  const bottomRowPegs = TOP_ROW_PEGS + PEG_ROWS - 1;
  const slotW = BOARD_W / BUCKET_COUNT;
  const horizSpacing = (BOARD_W - slotW) / (bottomRowPegs - 1);
  const CLEARANCE = 6;
  const maxBallR = (horizSpacing - CLEARANCE) / 2.8;
  const ballRadius = Math.max(6, Math.min(11, Math.floor(maxBallR)));
  const pegRadius = Math.max(3, Math.round(ballRadius * 0.4));
  return { pegRadius, ballRadius, horizSpacing, slotW };
}

function buildPegs(ballRadius: number, horizSpacing: number) {
  const pegs: { x: number; y: number }[] = [];
  const centerX = BOARD_W / 2;
  const usableH = BOARD_H - TOP_PAD - BUCKET_H - 12;
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
const BOARD_BG = "#1e1a15";
const BOARD_STROKE = "#3d3428";
const PEG_COLOR = "#c9b48f";
const BUCKET_STROKE = "#3d3428";
const TEXT_WARM = "#f5efe6";
const TEXT_WARM_SOFT = "#a09080";

// ---- Types --------------------------------------------------------------
type PlinkoBallResult = {
  uid: string;
  slotIndex: number; // final slot (0..BUCKET_COUNT-1) OR -1 if pending
  points: number;
  dropIndex: number;
  seed: number;
  pending?: boolean;
};

type PlinkoMember = SplitPerson & { color: string };

export default function PlinkoScreen() {
  return (
    <Suspense fallback={<div style={{ height: "100%", background: "var(--bg-base)" }} />}>
      <PlinkoInner />
    </Suspense>
  );
}

function PlinkoInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode") === "placement" ? "placement" : "loser";
  const dropsPerPlayer = Math.max(1, Math.min(5, parseInt(searchParams.get("balls") || "1", 10) || 1));

  // Load participants from the persisted split. Fall back to a mock
  // party so hitting the screen directly still renders something useful.
  const members: PlinkoMember[] = useMemo(() => {
    const persisted = readSplit();
    const raw =
      persisted && persisted.people.length > 0
        ? persisted.people
        : [
            { id: currentUser.id, name: "You", avatar: currentUser.avatar },
            ...friends.slice(0, 3).map((f) => ({
              id: f.id,
              name: f.name,
              avatar: f.avatar,
              handle: f.handle,
            })),
          ];
    return raw.map((p, i) => ({ ...p, color: COLORS[i % COLORS.length] }));
  }, []);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const layout = useMemo(() => deriveLayout(), []);
  const pegs = useMemo(() => buildPegs(layout.ballRadius, layout.horizSpacing), [layout]);

  // Active balls in flight — keyed by "uid:dropIndex". Kept in a ref
  // because we only ever mutate it inside physics callbacks / raf, not
  // during render. We manually trigger a redraw via `draw()` when it
  // changes.
  const activeBallsRef = useRef<Record<string, { x: number; y: number; color: string }>>({});
  // Settled ball results + per-user tap counts drive rendered UI (leaderboard
  // + drop-button state), so they live in `useState` — not refs — to keep
  // React re-rendering rules happy and avoid "cannot access ref during
  // render" warnings.
  const [settledResults, setSettledResults] = useState<PlinkoBallResult[]>([]);
  const [localCounts, setLocalCounts] = useState<Record<string, number>>({});

  const forceDraw = () => draw();

  const bucketTop = BOARD_H - BUCKET_H;

  // ---- Draw current frame ----------------------------------------------
  const draw = () => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = BOARD_BG;
    ctx.fillRect(0, 0, BOARD_W, BOARD_H);
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

    // Buckets with point labels
    const slotW = layout.slotW;
    for (let i = 0; i < BUCKET_COUNT; i++) {
      const x = i * slotW;
      const pts = SLOT_POINTS[i];
      const isBest = pts === Math.min(...SLOT_POINTS);
      const isWorst = pts === Math.max(...SLOT_POINTS);
      ctx.fillStyle = isBest
        ? "rgba(22,163,74,0.20)"
        : isWorst
        ? "rgba(220,38,38,0.22)"
        : "rgba(255,255,255,0.05)";
      ctx.fillRect(x + 2, bucketTop, slotW - 4, BUCKET_H);
      if (i > 0) {
        ctx.strokeStyle = BUCKET_STROKE;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x, bucketTop - 10);
        ctx.lineTo(x, BOARD_H);
        ctx.stroke();
      }
      // Point label
      ctx.fillStyle = isBest ? "#4ade80" : isWorst ? "#f87171" : TEXT_WARM_SOFT;
      ctx.font = `800 15px "DM Sans", system-ui, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(`${pts}`, x + slotW / 2, bucketTop + BUCKET_H / 2);
    }

    // Divider above buckets
    ctx.strokeStyle = BUCKET_STROKE;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, bucketTop);
    ctx.lineTo(BOARD_W, bucketTop);
    ctx.stroke();

    // Balls in flight
    const active = activeBallsRef.current;
    for (const [, pos] of Object.entries(active)) {
      // Glow
      const g = ctx.createRadialGradient(
        pos.x, pos.y, 0,
        pos.x, pos.y, layout.ballRadius * 2.2,
      );
      g.addColorStop(0, `${pos.color}55`);
      g.addColorStop(1, `${pos.color}00`);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, layout.ballRadius * 2.2, 0, Math.PI * 2);
      ctx.fill();
      // Ball
      ctx.fillStyle = pos.color;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, layout.ballRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.35)";
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  };

  // Initial paint + repaint on layout changes.
  useEffect(() => {
    draw();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pegs, layout]);

  // ---- Physics runner --------------------------------------------------
  // Pass `salt` in from the caller (which reads Date.now() at tap time)
  // so this function stays pure w.r.t. the render loop.
  const simulateDrop = async (uid: string, color: string, dropIndex: number, salt: number) => {
    const key = `${uid}:${dropIndex}`;

    const Matter = await import("matter-js");
    const seed = hashSeed(uid, dropIndex, salt);
    const rng = makeRng(seed);

    const engine = Matter.Engine.create({ gravity: { x: 0, y: 1, scale: 0.0022 } });
    const world = engine.world;
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
    Matter.World.add(world, [
      Matter.Bodies.rectangle(-10, BOARD_H / 2, 20, BOARD_H, { isStatic: true }),
      Matter.Bodies.rectangle(BOARD_W + 10, BOARD_H / 2, 20, BOARD_H, { isStatic: true }),
      Matter.Bodies.rectangle(BOARD_W / 2, BOARD_H + 20, BOARD_W, 40, { isStatic: true }),
    ]);
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
    // Small jitter on drop position, driven by seeded RNG.
    const startX = BOARD_W / 2 + (rng() - 0.5) * 8;
    const ball = Matter.Bodies.circle(startX, 10, layout.ballRadius, {
      restitution: 0.5,
      friction: 0.03,
      frictionAir: 0.025,
      density: 0.0025,
      label: "ball",
    });
    Matter.World.add(world, ball);

    let frame = 0;
    const timer = window.setInterval(() => {
      Matter.Engine.update(engine, 16.666);
      frame += 1;
      activeBallsRef.current[key] = { x: ball.position.x, y: ball.position.y, color };
      forceDraw();
      const settled = ball.position.y > BOARD_H - BUCKET_H + layout.ballRadius || frame > 480;
      if (settled) {
        window.clearInterval(timer);
        const slotIndex = Math.max(
          0,
          Math.min(BUCKET_COUNT - 1, Math.floor(ball.position.x / layout.slotW)),
        );
        Matter.World.clear(world, false);
        Matter.Engine.clear(engine);
        // Record final result — setState so react re-renders leaderboard.
        setSettledResults((prev) => [
          ...prev,
          {
            uid,
            dropIndex,
            slotIndex,
            points: SLOT_POINTS[slotIndex],
            seed,
            pending: false,
          },
        ]);
        // Fade out ball briefly, then remove.
        window.setTimeout(() => {
          delete activeBallsRef.current[key];
          forceDraw();
        }, 500);
      }
    }, 16);
  };

  // ---- Drop-ball handler per member ------------------------------------
  const handleDrop = (member: PlinkoMember) => {
    const uid = member.id;
    const settledForUid = settledResults.filter((r) => r.uid === uid).length;
    const taken = Math.max(localCounts[uid] ?? 0, settledForUid);
    if (taken >= dropsPerPlayer) return;
    const dropIdx = taken;
    setLocalCounts((prev) => ({ ...prev, [uid]: dropIdx + 1 }));
    // `Date.now()` here is fine — handleDrop only fires from a click,
    // never during render.
    // eslint-disable-next-line react-hooks/purity
    const salt = Date.now() & 0xffff;
    void simulateDrop(uid, member.color, dropIdx, salt);
  };

  // ---- Per-member counts + scores --------------------------------------
  const stats = useMemo(() => {
    const settledByUid: Record<string, PlinkoBallResult[]> = {};
    for (const r of settledResults) {
      (settledByUid[r.uid] ??= []).push(r);
    }
    const rows = members.map((m) => {
      const settled = settledByUid[m.id] ?? [];
      const optimistic = Math.max(settled.length, localCounts[m.id] ?? 0);
      const points = settled.reduce((s, r) => s + r.points, 0);
      const done = settled.length >= dropsPerPlayer && optimistic >= dropsPerPlayer;
      return { member: m, tapped: optimistic, settled: settled.length, points, done };
    });
    const everyoneDone = rows.length > 0 && rows.every((r) => r.done);
    return { rows, everyoneDone };
  }, [members, dropsPerPlayer, settledResults, localCounts]);

  const rankedRows = useMemo(() => {
    if (!stats.everyoneDone) return stats.rows;
    // Lowest total points = best (1st place).
    return [...stats.rows].sort((a, b) => a.points - b.points);
  }, [stats]);

  // ---- Persist results & navigate --------------------------------------
  const goToResults = () => {
    if (!stats.everyoneDone) return;
    // Rank low→high points. Ties keep insertion order.
    const rankedIds = rankedRows.map((r) => r.member.id);
    const payload = {
      mode,
      rankedIds,
      pointsByUid: Object.fromEntries(stats.rows.map((r) => [r.member.id, r.points])),
      dropsPerPlayer,
      totalBallsDropped: settledResults.length,
    };
    try {
      window.sessionStorage.setItem("stp:plinko-result", JSON.stringify(payload));
    } catch {
      /* ignore */
    }
    router.push("/screen/gamble-results");
  };

  return (
    <div style={{ height: "100%", background: "var(--bg-base)", display: "flex", flexDirection: "column" }}>
      <BackButton to="/screen/plinko-settings" />

      {/* Header */}
      <div style={{ padding: "56px 20px 8px", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 600, color: "var(--text)" }}>
            Plinko
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
            {mode === "placement" ? "Placement" : "Loser pays"} · {dropsPerPlayer} ball{dropsPerPlayer === 1 ? "" : "s"} each
          </div>
        </div>
        <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-body)", marginTop: 4 }}>
          Center = low points (good). Ends = high points (bad).
        </div>
      </div>

      {/* Board */}
      <div style={{ display: "flex", justifyContent: "center", padding: "6px 0 10px", flexShrink: 0 }}>
        <div
          style={{
            width: BOARD_W,
            borderRadius: 18,
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

      {/* Per-person rows with THEIR OWN drop button */}
      <div style={{ flex: 1, overflowY: "auto", padding: "6px 20px 12px" }}>
        <div style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "var(--font-body)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
          {stats.everyoneDone ? "Final Leaderboard" : "Players"}
        </div>
        {rankedRows.map((row, i) => {
          const isYou = row.member.id === currentUser.id;
          const rank = i + 1;
          const showRank = stats.everyoneDone;
          return (
            <div
              key={row.member.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 12px",
                borderRadius: 12,
                background: isYou ? "rgba(245,158,11,0.08)" : "var(--bg-card)",
                border: `1px solid ${isYou ? "rgba(245,158,11,0.3)" : "var(--border)"}`,
                borderLeft: `4px solid ${row.member.color}`,
                marginBottom: 6,
              }}
            >
              {showRank && (
                <div style={{
                  width: 24, height: 24, borderRadius: 12,
                  background: rank === 1 ? "var(--amber)" : rank === rankedRows.length ? "rgba(220,38,38,0.25)" : "var(--bg-raised)",
                  color: rank === 1 ? "#000" : "var(--text)",
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  fontSize: 11, fontWeight: 800, flexShrink: 0, fontFamily: "var(--font-body)",
                }}>
                  {rank === 1 ? <Trophy size={12} /> : rank}
                </div>
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", fontFamily: "var(--font-body)" }}>
                  {row.member.name}{isYou ? " (you)" : ""}
                </div>
                <div style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "var(--font-body)", marginTop: 2 }}>
                  {row.settled}/{dropsPerPlayer} balls · {row.points} pts
                </div>
              </div>
              {row.done ? (
                <div style={{
                  padding: "6px 10px",
                  borderRadius: 999,
                  background: "rgba(22,163,74,0.15)",
                  border: "1px solid rgba(22,163,74,0.35)",
                  color: "#4ade80",
                  fontSize: 11,
                  fontWeight: 700,
                  fontFamily: "var(--font-body)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                }}>
                  <CheckCircle2 size={12} /> Done
                </div>
              ) : (
                <button
                  onClick={() => handleDrop(row.member)}
                  style={{
                    padding: "8px 12px",
                    borderRadius: 999,
                    background: row.member.color,
                    color: "#fff",
                    fontSize: 11,
                    fontWeight: 800,
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "var(--font-body)",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 5,
                    boxShadow: "0 4px 10px rgba(0,0,0,0.25)",
                    minWidth: 92,
                    justifyContent: "center",
                  }}
                >
                  <ArrowDown size={12} strokeWidth={3} /> Drop · {row.tapped}/{dropsPerPlayer}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <div
        style={{
          padding: "14px 20px 20px",
          borderTop: "1px solid var(--border)",
          background: "var(--bg-surface)",
          flexShrink: 0,
        }}
      >
        {stats.everyoneDone ? (
          <button
            onClick={goToResults}
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
              boxShadow: "0 10px 24px rgba(234,88,12,0.35)",
            }}
          >
            See Results
          </button>
        ) : (
          <div style={{ textAlign: "center", color: "var(--text-muted)", fontFamily: "var(--font-body)", fontSize: 12 }}>
            Each player taps their own button until everyone is done.
          </div>
        )}
      </div>
    </div>
  );
}
