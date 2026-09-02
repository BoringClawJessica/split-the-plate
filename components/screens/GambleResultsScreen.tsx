"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { currentUser, friends, receiptTotal } from "@/lib/mock-data";
import { Trophy, Frown } from "lucide-react";
import { BackButton, HomeBottomBar } from "../PhoneNav";
import { readSplit, SplitPerson } from "@/lib/split-state";
import { computeRankSplit } from "@/lib/rank-split";

type PlinkoResult = {
  mode: "loser" | "placement";
  rankedIds: string[]; // best (index 0) → worst
  pointsByUid: Record<string, number>;
  dropsPerPlayer: number;
  totalBallsDropped: number;
};

function readPlinkoResult(): PlinkoResult | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem("stp:plinko-result");
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PlinkoResult;
    if (!parsed || !Array.isArray(parsed.rankedIds)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export default function GambleResultsScreen() {
  const router = useRouter();

  const [plinko] = useState<PlinkoResult | null>(() =>
    typeof window === "undefined" ? null : readPlinkoResult(),
  );
  const [people] = useState<SplitPerson[]>(() => {
    if (typeof window === "undefined") return [];
    const split = readSplit();
    if (split && split.people.length > 0) return split.people;
    return [
      { id: currentUser.id, name: "You", avatar: currentUser.avatar },
      ...friends.slice(0, 3).map((f) => ({ id: f.id, name: f.name, avatar: f.avatar, handle: f.handle })),
    ];
  });

  const total = receiptTotal * 1.08;
  const personById = useMemo(() => Object.fromEntries(people.map((p) => [p.id, p])), [people]);

  // If we have a plinko result, use it. Otherwise fall back to a mocked
  // "you got lucky" placement result so the prototype still shows something.
  const shares = useMemo<Record<string, number>>(() => {
    if (!plinko) return {};
    if (plinko.mode === "placement") {
      return computeRankSplit(plinko.rankedIds);
    }
    // Loser pays all — everyone at the LAST rank splits the full bill.
    // Ties at the top of "worst points" all share equally.
    const points = plinko.pointsByUid;
    const maxPts = Math.max(...Object.values(points));
    const losers = Object.entries(points)
      .filter(([, v]) => v === maxPts)
      .map(([id]) => id);
    const out: Record<string, number> = {};
    for (const id of plinko.rankedIds) out[id] = 0;
    const each = 1 / losers.length;
    for (const id of losers) out[id] = each;
    return out;
  }, [plinko]);

  // Rows sorted best → worst (rankedIds order); if no plinko, sort people
  // in default order.
  const rows = useMemo(() => {
    const order = plinko?.rankedIds ?? people.map((p) => p.id);
    return order
      .map((id, i) => {
        const p = personById[id];
        if (!p) return null;
        const pct = shares[id] ?? 0;
        return {
          id,
          name: p.name,
          avatar: p.avatar,
          you: id === currentUser.id,
          points: plinko?.pointsByUid[id],
          rank: i + 1,
          pct,
          amount: total * pct,
        };
      })
      .filter((r): r is NonNullable<typeof r> => !!r);
  }, [plinko, people, personById, shares, total]);

  const you = rows.find((r) => r.you);
  const modeLabel = plinko?.mode === "placement" ? "Placement" : "Loser pays all";

  return (
    <div style={{ position: "relative", height: "100%", background: "var(--bg-base)", display: "flex", flexDirection: "column" }}>
      <BackButton to="/screen/gamble-picker" />
      <div style={{ padding: "56px 20px 12px", flexShrink: 0 }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 600, color: "var(--text)" }}>
          Results
        </div>
        <div style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "var(--font-body)", marginTop: 4 }}>
          Plinko · {modeLabel} · total ${total.toFixed(2)}
        </div>
      </div>

      {/* Your outcome banner */}
      {you && (
        <div style={{
          margin: "0 20px 16px",
          padding: "16px",
          borderRadius: 16,
          background: you.rank === 1
            ? "linear-gradient(135deg, rgba(245,158,11,0.15), rgba(22,163,74,0.10))"
            : you.rank === rows.length
            ? "linear-gradient(135deg, rgba(220,38,38,0.15), rgba(234,88,12,0.10))"
            : "linear-gradient(135deg, rgba(245,158,11,0.10), rgba(234,88,12,0.08))",
          border: `1px solid ${you.rank === 1 ? "rgba(245,158,11,0.35)" : you.rank === rows.length ? "rgba(220,38,38,0.35)" : "rgba(245,158,11,0.25)"}`,
          display: "flex",
          alignItems: "center",
          gap: 12,
          flexShrink: 0,
        }}>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: 14,
            background: you.rank === 1 ? "rgba(245,158,11,0.25)" : you.rank === rows.length ? "rgba(220,38,38,0.25)" : "rgba(245,158,11,0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: you.rank === 1 ? "var(--amber)" : you.rank === rows.length ? "#f87171" : "var(--amber)",
          }}>
            {you.rank === 1 ? <Trophy size={22} strokeWidth={1.8} /> : you.rank === rows.length ? <Frown size={22} strokeWidth={1.8} /> : <Trophy size={22} strokeWidth={1.8} />}
          </div>
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 600, color: you.rank === 1 ? "var(--amber)" : you.rank === rows.length ? "#f87171" : "var(--text)" }}>
              {you.rank === 1
                ? "You got lucky, Eli."
                : you.rank === rows.length
                ? "You pay this round."
                : `${ordinal(you.rank)} of ${rows.length}`}
            </div>
            <div style={{ fontSize: 13, color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}>
              {you.pct === 0
                ? "You're off the hook."
                : `Your share: ${(you.pct * 100).toFixed(you.pct * 100 % 1 === 0 ? 0 : 2)}% · $${you.amount.toFixed(2)}`}
            </div>
          </div>
        </div>
      )}

      {/* Breakdown */}
      <div style={{ flex: 1, overflowY: "auto", padding: "0 20px" }}>
        {rows.map((p) => (
          <div key={p.id} style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "12px 14px",
            borderRadius: 12,
            background: p.you ? "rgba(245,158,11,0.08)" : "var(--bg-card)",
            border: `1px solid ${p.you ? "rgba(245,158,11,0.3)" : "var(--border)"}`,
            marginBottom: 8,
          }}>
            <div style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: p.rank === 1 ? "var(--amber)" : p.rank === rows.length ? "rgba(220,38,38,0.3)" : "var(--bg-raised)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
              color: p.rank === 1 ? "#000" : "var(--text)",
              flexShrink: 0,
              fontFamily: "var(--font-body)",
              fontWeight: 800,
            }}>
              {p.rank === 1 ? <Trophy size={13} /> : p.rank === rows.length ? <Frown size={13} color="#f87171" /> : p.rank}
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.avatar} alt={p.name} style={{ width: 36, height: 36, borderRadius: "50%", border: "2px solid var(--border)" }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: p.you ? "var(--amber)" : "var(--text)", fontFamily: "var(--font-body)" }}>
                {p.name} {p.you ? "(you)" : ""}
              </div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
                {(p.pct * 100).toFixed(p.pct * 100 % 1 === 0 ? 0 : 2)}% of the bill{p.points != null ? ` · ${p.points} pts` : ""}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: p.pct === 0 ? "#4ade80" : "var(--text)", fontFamily: "var(--font-body)" }}>
                ${p.amount.toFixed(2)}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ padding: "16px 20px 24px", borderTop: "1px solid var(--border)", background: "var(--bg-surface)", flexShrink: 0 }}>
        <button
          onClick={() => router.push("/screen/review-confirm")}
          style={{
            width: "100%", padding: "15px", borderRadius: 14,
            background: "var(--amber)", color: "#000",
            fontWeight: 700, fontSize: 15, border: "none", cursor: "pointer",
            fontFamily: "var(--font-body)",
          }}
        >
          Pay my bill
        </button>
      </div>
      <HomeBottomBar hidden />
    </div>
  );
}

function ordinal(n: number): string {
  if (n === 1) return "1st";
  if (n === 2) return "2nd";
  if (n === 3) return "3rd";
  return `${n}th`;
}
