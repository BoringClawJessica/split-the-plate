"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Award, Circle, Minus, Plus } from "lucide-react";
import { BackButton, HomeBottomBar } from "../PhoneNav";

type PayoutMode = "loser" | "placement";

const DEFAULT_PLACEMENTS = [50, 25, 15, 10];

export default function PlinkoSettingsScreen() {
  const router = useRouter();
  const [mode, setMode] = useState<PayoutMode>("loser");
  const [balls, setBalls] = useState(1);
  const [placements, setPlacements] = useState<number[]>(DEFAULT_PLACEMENTS);

  const totalPct = useMemo(() => placements.reduce((s, n) => s + n, 0), [placements]);
  const placementsValid = mode === "loser" || totalPct === 100;

  const canDrop = placementsValid;

  const bump = (i: number, delta: number) => {
    setPlacements((prev) => {
      const next = [...prev];
      next[i] = Math.max(0, Math.min(100, next[i] + delta));
      return next;
    });
  };

  const setPlacement = (i: number, val: number) => {
    setPlacements((prev) => {
      const next = [...prev];
      next[i] = Math.max(0, Math.min(100, val));
      return next;
    });
  };

  const resetPlacements = () => setPlacements(DEFAULT_PLACEMENTS);

  const drop = () => {
    if (!canDrop) return;
    router.push(`/screen/plinko?mode=${mode}&balls=${balls}`);
  };

  return (
    <div style={{ position: "relative", height: "100%", background: "var(--bg-base)", display: "flex", flexDirection: "column" }}>
      <BackButton to="/screen/gamble-picker" />
      <div style={{ padding: "56px 20px 12px", flexShrink: 0 }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 600, color: "var(--text)" }}>
          Plinko settings
        </div>
        <div style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "var(--font-body)", marginTop: 4 }}>
          Set the rules before you drop.
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "0 20px 12px" }}>
        {/* Payout mode */}
        <SectionHeader label="Payout mode" />
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 18 }}>
          <ModeCard
            active={mode === "loser"}
            title="Loser pays all"
            desc="Ball lands in one bucket. That person picks up the whole check."
            icon={<Circle size={18} strokeWidth={1.8} />}
            onClick={() => setMode("loser")}
          />
          <ModeCard
            active={mode === "placement"}
            title="Placement-based"
            desc="Higher placement, higher share. Set percent per position."
            icon={<Award size={18} strokeWidth={1.8} />}
            onClick={() => setMode("placement")}
          />
        </div>

        {mode === "placement" && (
          <div style={{
            padding: "14px 16px",
            borderRadius: 14,
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            marginBottom: 18,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
              <div style={{ fontSize: 12, color: "var(--text)", fontFamily: "var(--font-body)", fontWeight: 600 }}>Placement percents</div>
              <button
                onClick={resetPlacements}
                style={{
                  fontSize: 11,
                  color: "var(--amber)",
                  background: "transparent",
                  border: "1px solid var(--border-bright)",
                  borderRadius: 999,
                  padding: "3px 10px",
                  cursor: "pointer",
                  fontFamily: "var(--font-body)",
                }}
              >
                Reset
              </button>
            </div>

            {placements.map((pct, i) => (
              <div key={i} style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "8px 0",
                borderBottom: i < placements.length - 1 ? "1px solid var(--border)" : "none",
              }}>
                <div style={{
                  width: 22,
                  height: 22,
                  borderRadius: 999,
                  background: i === 0 ? "var(--amber)" : "var(--bg-raised)",
                  color: i === 0 ? "#000" : "var(--text)",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 10,
                  fontWeight: 800,
                  fontFamily: "var(--font-body)",
                  flexShrink: 0,
                }}>
                  {i + 1}
                </div>
                <div style={{ flex: 1, fontSize: 13, color: "var(--text)", fontFamily: "var(--font-body)" }}>
                  {i === 0 ? "1st place" : i === 1 ? "2nd place" : i === 2 ? "3rd place" : `${i + 1}th place`}
                </div>
                <button
                  onClick={() => bump(i, -5)}
                  aria-label="Decrease"
                  style={stepBtnStyle}
                >
                  <Minus size={12} />
                </button>
                <div style={{ position: "relative", width: 64 }}>
                  <input
                    inputMode="numeric"
                    value={pct}
                    onChange={(e) => setPlacement(i, parseInt(e.target.value.replace(/[^0-9]/g, "") || "0", 10))}
                    style={{
                      width: "100%",
                      padding: "6px 22px 6px 8px",
                      borderRadius: 8,
                      background: "var(--bg-raised)",
                      border: "1px solid var(--border-bright)",
                      color: "var(--text)",
                      fontSize: 13,
                      fontFamily: "var(--font-body)",
                      textAlign: "center",
                      outline: "none",
                    }}
                  />
                  <span style={{
                    position: "absolute",
                    right: 6,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--text-muted)",
                    fontSize: 10,
                    fontFamily: "var(--font-body)",
                    pointerEvents: "none",
                  }}>%</span>
                </div>
                <button
                  onClick={() => bump(i, 5)}
                  aria-label="Increase"
                  style={stepBtnStyle}
                >
                  <Plus size={12} />
                </button>
              </div>
            ))}

            <div style={{
              marginTop: 10,
              padding: "8px 10px",
              borderRadius: 8,
              background: placementsValid ? "rgba(22,163,74,0.12)" : "rgba(220,38,38,0.12)",
              border: `1px solid ${placementsValid ? "rgba(22,163,74,0.3)" : "rgba(220,38,38,0.3)"}`,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: 11,
              fontFamily: "var(--font-body)",
              color: placementsValid ? "#4ade80" : "#f87171",
            }}>
              <span>Total</span>
              <span style={{ fontWeight: 700 }}>{totalPct}% {placementsValid ? "" : "(must equal 100%)"}</span>
            </div>
          </div>
        )}

        {/* Balls per person */}
        <SectionHeader label="Balls per person" />
        <div style={{
          padding: "14px 16px",
          borderRadius: 14,
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 12,
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, color: "var(--text)", fontFamily: "var(--font-body)", fontWeight: 600 }}>Balls dropped each</div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-body)", marginTop: 2 }}>
              {balls > 1 ? "Multi-ball: outcome is the average of a player's drops." : "One drop per player."}
            </div>
          </div>
          <button
            onClick={() => setBalls((n) => Math.max(1, n - 1))}
            aria-label="Fewer balls"
            style={stepBtnStyle}
          >
            <Minus size={13} />
          </button>
          <div style={{
            minWidth: 30,
            textAlign: "center",
            fontSize: 18,
            fontWeight: 700,
            color: "var(--amber)",
            fontFamily: "var(--font-body)",
          }}>
            {balls}
          </div>
          <button
            onClick={() => setBalls((n) => Math.min(5, n + 1))}
            aria-label="More balls"
            style={stepBtnStyle}
          >
            <Plus size={13} />
          </button>
        </div>
      </div>

      <div style={{ padding: "16px 20px 24px", borderTop: "1px solid var(--border)", background: "var(--bg-surface)", flexShrink: 0 }}>
        <button
          onClick={drop}
          disabled={!canDrop}
          style={{
            width: "100%",
            padding: "15px",
            borderRadius: 14,
            background: canDrop ? "linear-gradient(135deg, #F59E0B 0%, #EA580C 100%)" : "var(--bg-card)",
            color: canDrop ? "#1a1510" : "var(--text-muted)",
            fontWeight: 800,
            fontSize: 15,
            border: "none",
            cursor: canDrop ? "pointer" : "not-allowed",
            fontFamily: "var(--font-body)",
            boxShadow: canDrop ? "0 8px 22px rgba(234,88,12,0.3)" : "none",
          }}
        >
          Drop the balls
        </button>
      </div>
      <HomeBottomBar hidden />
    </div>
  );
}

function SectionHeader({ label }: { label: string }) {
  return (
    <div style={{
      fontSize: 11,
      color: "var(--text-muted)",
      fontFamily: "var(--font-body)",
      textTransform: "uppercase",
      letterSpacing: "0.06em",
      marginBottom: 10,
    }}>
      {label}
    </div>
  );
}

function ModeCard({
  active,
  title,
  desc,
  icon,
  onClick,
}: {
  active: boolean;
  title: string;
  desc: string;
  icon: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "14px 14px",
        borderRadius: 14,
        background: active ? "rgba(245,158,11,0.10)" : "var(--bg-card)",
        border: `1px solid ${active ? "var(--amber)" : "var(--border)"}`,
        cursor: "pointer",
        textAlign: "left",
        fontFamily: "var(--font-body)",
      }}
    >
      <div style={{
        width: 36,
        height: 36,
        borderRadius: 10,
        background: active ? "var(--amber)" : "var(--bg-raised)",
        color: active ? "#000" : "var(--text)",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}>
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: active ? "var(--amber)" : "var(--text)" }}>{title}</div>
        <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2, lineHeight: 1.4 }}>{desc}</div>
      </div>
      <div style={{
        width: 20,
        height: 20,
        borderRadius: 999,
        background: active ? "var(--amber)" : "transparent",
        border: `1.5px solid ${active ? "var(--amber)" : "var(--border-bright)"}`,
        flexShrink: 0,
      }} />
    </button>
  );
}

const stepBtnStyle: React.CSSProperties = {
  width: 28,
  height: 28,
  borderRadius: 8,
  background: "var(--bg-raised)",
  border: "1px solid var(--border-bright)",
  color: "var(--text)",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  flexShrink: 0,
};
