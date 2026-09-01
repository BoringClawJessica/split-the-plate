"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { BackButton, HomeBottomBar } from "../PhoneNav";
import { currentUserShare } from "@/lib/mock-data";

const TIP_PRESETS = [15, 18, 20, 25] as const;

export default function TipPhaseScreen() {
  const router = useRouter();
  const share = currentUserShare;
  const [tipPct, setTipPct] = useState<number>(20);
  const [customStr, setCustomStr] = useState<string>("");
  const [useCustom, setUseCustom] = useState<boolean>(false);

  const effectivePct = useMemo(() => {
    if (useCustom) {
      const n = parseInt(customStr.replace(/[^0-9]/g, "") || "0", 10);
      return Math.max(0, Math.min(100, n));
    }
    return tipPct;
  }, [useCustom, customStr, tipPct]);

  const tipAmount = share * (effectivePct / 100);
  const total = share + tipAmount;

  return (
    <div style={{ position: "relative", height: "100%", background: "var(--bg-base)", display: "flex", flexDirection: "column" }}>
      <BackButton to="/screen/review-confirm" />
      <div style={{ padding: "56px 20px 12px", flexShrink: 0 }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 600, color: "var(--text)" }}>
          Add your tip
        </div>
        <div style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "var(--font-body)", marginTop: 4 }}>
          Everyone picks their own tip on their share.
        </div>
      </div>

      {/* Share headline */}
      <div style={{
        margin: "0 20px 16px",
        padding: "20px",
        borderRadius: 18,
        background: "linear-gradient(135deg, rgba(245,158,11,0.14), rgba(234,88,12,0.10))",
        border: "1px solid rgba(245,158,11,0.3)",
        textAlign: "center",
        flexShrink: 0,
      }}>
        <div style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "var(--font-body)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>
          Your share
        </div>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 44, fontWeight: 700, color: "var(--amber)", letterSpacing: "-0.02em" }}>
          ${share.toFixed(2)}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "0 20px" }}>
        {/* Presets */}
        <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-body)", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.06em" }}>
          Pick a tip
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
          {TIP_PRESETS.map((t) => {
            const active = !useCustom && tipPct === t;
            return (
              <button
                key={t}
                onClick={() => { setUseCustom(false); setTipPct(t); }}
                style={{
                  padding: "14px 0",
                  borderRadius: 14,
                  background: active ? "rgba(245,158,11,0.12)" : "var(--bg-card)",
                  color: active ? "var(--amber)" : "var(--text)",
                  border: `1px solid ${active ? "var(--amber)" : "var(--border)"}`,
                  cursor: "pointer",
                  fontFamily: "var(--font-body)",
                  fontWeight: 700,
                  fontSize: 16,
                }}
              >
                {t}%
              </button>
            );
          })}
        </div>

        {/* Custom */}
        <div style={{
          padding: "12px 14px",
          borderRadius: 14,
          background: useCustom ? "rgba(245,158,11,0.10)" : "var(--bg-card)",
          border: `1px solid ${useCustom ? "var(--amber)" : "var(--border)"}`,
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 18,
        }}>
          <div style={{ flex: 1, fontSize: 13, color: "var(--text)", fontFamily: "var(--font-body)", fontWeight: 600 }}>
            Custom
          </div>
          <div style={{ position: "relative", width: 92 }}>
            <input
              inputMode="numeric"
              value={customStr}
              onChange={(e) => { setUseCustom(true); setCustomStr(e.target.value.replace(/[^0-9]/g, "")); }}
              onFocus={() => setUseCustom(true)}
              placeholder="0"
              style={{
                width: "100%",
                padding: "10px 22px 10px 10px",
                borderRadius: 10,
                background: "var(--bg-raised)",
                border: "1px solid var(--border-bright)",
                color: "var(--text)",
                fontSize: 15,
                fontFamily: "var(--font-body)",
                textAlign: "center",
                outline: "none",
                fontWeight: 700,
              }}
            />
            <span style={{
              position: "absolute",
              right: 8,
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--text-muted)",
              fontSize: 11,
              fontFamily: "var(--font-body)",
              pointerEvents: "none",
            }}>%</span>
          </div>
        </div>

        {/* Live math */}
        <div style={{
          padding: "14px 16px",
          borderRadius: 14,
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          marginBottom: 12,
        }}>
          <MathRow label="Your share" value={`$${share.toFixed(2)}`} />
          <MathRow label={`Tip (${effectivePct}%)`} value={`$${tipAmount.toFixed(2)}`} accent />
          <div style={{ height: 1, background: "var(--border)", margin: "8px 0" }} />
          <MathRow label="You'll pay" value={`$${total.toFixed(2)}`} big />
        </div>

        <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-body)", textAlign: "center", padding: "4px 0 16px" }}>
          Everyone picks their own tip on their share.
        </div>
      </div>

      <div style={{ padding: "16px 20px 24px", borderTop: "1px solid var(--border)", background: "var(--bg-surface)", flexShrink: 0 }}>
        <button
          onClick={() => router.push(`/screen/payment-handoff?amount=${total.toFixed(2)}&tip=${tipAmount.toFixed(2)}`)}
          style={{
            width: "100%",
            padding: "15px",
            borderRadius: 14,
            background: "var(--amber)",
            color: "#000",
            fontWeight: 700,
            fontSize: 15,
            border: "none",
            cursor: "pointer",
            fontFamily: "var(--font-body)",
            boxShadow: "0 8px 24px rgba(245,158,11,0.3)",
          }}
        >
          Continue to Payment
        </button>
      </div>
      <HomeBottomBar hidden />
    </div>
  );
}

function MathRow({ label, value, accent, big }: { label: string; value: string; accent?: boolean; big?: boolean }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "4px 0" }}>
      <span style={{ fontSize: big ? 14 : 12, color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}>{label}</span>
      <span style={{
        fontSize: big ? 20 : 14,
        color: accent ? "var(--amber)" : "var(--text)",
        fontFamily: "var(--font-body)",
        fontWeight: big ? 800 : 600,
      }}>
        {value}
      </span>
    </div>
  );
}
