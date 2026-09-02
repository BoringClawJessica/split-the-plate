"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Award, Circle, Minus, Plus } from "lucide-react";
import { BackButton, HomeBottomBar } from "../PhoneNav";

type PayoutMode = "loser" | "placement";

/**
 * Plinko settings — ported from old Plait: user only controls
 * (1) payout mode and (2) balls per person. Placement percents are
 * NOT user-editable; they're auto-calculated at result time using the
 * shared `computeRankSplit` formula (see `lib/rank-split.ts`).
 */
export default function PlinkoSettingsScreen() {
  const router = useRouter();
  const [mode, setMode] = useState<PayoutMode>("loser");
  const [balls, setBalls] = useState(1);

  const drop = () => {
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
          Pick the rules. Placement percents are auto-calculated.
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "0 20px 12px" }}>
        {/* Payout mode */}
        <SectionHeader label="Payout mode" />
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 22 }}>
          <ModeCard
            active={mode === "loser"}
            title="Loser pays all"
            desc="Lowest total score pays the whole check. Ties split evenly."
            icon={<Circle size={18} strokeWidth={1.8} />}
            onClick={() => setMode("loser")}
          />
          <ModeCard
            active={mode === "placement"}
            title="Placement-based"
            desc="Everyone pays based on rank. 1st pays least, last pays most. Percents auto-calculated."
            icon={<Award size={18} strokeWidth={1.8} />}
            onClick={() => setMode("placement")}
          />
        </div>

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
              {balls > 1 ? "More balls = more skill, less luck. Scores are summed." : "One drop per person."}
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

        <div style={{
          padding: "10px 12px",
          borderRadius: 10,
          background: "rgba(245,158,11,0.06)",
          border: "1px solid rgba(245,158,11,0.2)",
          fontSize: 11,
          color: "var(--text-muted)",
          fontFamily: "var(--font-body)",
          lineHeight: 1.5,
        }}>
          Closer to center = fewer points (better). Further from center = more points (worse).
          After everyone finishes, we rank lowest-to-highest by total points.
        </div>
      </div>

      <div style={{ padding: "16px 20px 24px", borderTop: "1px solid var(--border)", background: "var(--bg-surface)", flexShrink: 0 }}>
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
            boxShadow: "0 8px 22px rgba(234,88,12,0.3)",
          }}
        >
          Start Plinko
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
