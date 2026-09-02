"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { currentUser, friends, receiptTotal } from "@/lib/mock-data";
import { BackButton, HomeBottomBar } from "../PhoneNav";
import { readSplit, SplitPerson } from "@/lib/split-state";
import { Crown } from "lucide-react";

const FALLBACK_PEOPLE: SplitPerson[] = [
  { id: currentUser.id, name: "You", avatar: currentUser.avatar },
  ...friends.slice(0, 3).map((f) => ({ id: f.id, name: f.name, avatar: f.avatar, handle: f.handle })),
];

const TAX_RATE = 0.08;

/**
 * ReviewConfirmScreen — pre-tip review.
 *
 * Shows subtotal, tax, total, and each person's share. The LEADER
 * (currentUser in the prototype) is called out — they don't send
 * money outbound; they're collecting. Their share is what they'll pay
 * on the check directly. Everyone else pays the leader via their
 * chosen payment method in the next step.
 */
export default function ReviewConfirmScreen() {
  const router = useRouter();
  // Read once on mount; sessionStorage isn't reactive so no re-run needed.
  const [people] = useState<SplitPerson[]>(() => {
    if (typeof window === "undefined") return FALLBACK_PEOPLE;
    const split = readSplit();
    if (split && split.people.length > 0) return split.people;
    return FALLBACK_PEOPLE;
  });

  const subtotal = receiptTotal;
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  // Prototype: even split (per-person = total / N). By-item / plinko
  // shares would be computed from persisted state, but the prototype
  // header math is fine either way.
  const perPersonBase = useMemo(
    () => (people.length > 0 ? total / people.length : 0),
    [people.length, total],
  );

  const leaderId = currentUser.id;

  return (
    <div style={{ position: "relative", height: "100%", background: "var(--bg-base)", display: "flex", flexDirection: "column" }}>
      <BackButton to="/screen/split-method" />
      <div style={{ padding: "56px 20px 12px", flexShrink: 0 }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 600, color: "var(--text)" }}>
          Review &amp; Confirm
        </div>
        <div style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "var(--font-body)", marginTop: 4 }}>
          You&apos;re the leader. Everyone else will pay you back.
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "0 20px 8px" }}>
        {/* Total headline */}
        <div style={{
          padding: "20px",
          borderRadius: 18,
          background: "linear-gradient(135deg, rgba(245,158,11,0.14), rgba(234,88,12,0.10))",
          border: "1px solid rgba(245,158,11,0.3)",
          textAlign: "center",
          marginBottom: 14,
        }}>
          <div style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "var(--font-body)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>
            Total bill
          </div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 40, fontWeight: 700, color: "var(--amber)", letterSpacing: "-0.02em" }}>
            ${total.toFixed(2)}
          </div>
          <div style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "var(--font-body)", marginTop: 4 }}>
            Tip is added by each person on their own share.
          </div>
        </div>

        {/* Line items summary */}
        <div style={{
          padding: "14px 16px",
          borderRadius: 14,
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          marginBottom: 16,
        }}>
          {[
            ["Subtotal", `$${subtotal.toFixed(2)}`],
            ["Tax", `$${tax.toFixed(2)}`],
            ["Split method", `Even ÷ ${people.length || 1}`],
            ["Per-person share", `$${perPersonBase.toFixed(2)}`],
          ].map(([label, val], i, arr) => (
            <div key={label} style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "6px 0",
              borderBottom: i < arr.length - 1 ? "1px solid var(--border)" : "none",
            }}>
              <span style={{ fontSize: 12, color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}>{label}</span>
              <span style={{ fontSize: 13, color: "var(--text)", fontFamily: "var(--font-body)", fontWeight: 500 }}>{val}</span>
            </div>
          ))}
        </div>

        {/* People shares */}
        <div style={{ marginBottom: 8 }}>
          <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-body)", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.06em" }}>
            In this split
          </div>
          {people.map((p) => {
            const isLeader = p.id === leaderId;
            return (
              <div key={p.id} style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 0",
                borderBottom: "1px solid var(--border)",
              }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.avatar} alt={p.name} style={{ width: 36, height: 36, borderRadius: "50%", border: "2px solid var(--border)" }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, color: "var(--text)", fontFamily: "var(--font-body)", fontWeight: 500, display: "flex", alignItems: "center", gap: 6 }}>
                    {p.name}
                    {isLeader && (
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 10, padding: "1px 6px", borderRadius: 999, background: "rgba(245,158,11,0.15)", color: "var(--amber)", border: "1px solid rgba(245,158,11,0.35)", fontWeight: 700 }}>
                        <Crown size={9} /> LEADER
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
                    {isLeader ? "Pays check directly — no send-back needed" : "Sends you their share"}
                  </div>
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "var(--amber)", fontFamily: "var(--font-body)" }}>
                  ${perPersonBase.toFixed(2)}
                </div>
              </div>
            );
          })}
        </div>

        {/* Leader note */}
        <div style={{
          padding: "10px 12px",
          borderRadius: 10,
          background: "rgba(245,158,11,0.06)",
          border: "1px solid rgba(245,158,11,0.2)",
          fontSize: 11,
          color: "var(--text-muted)",
          fontFamily: "var(--font-body)",
          lineHeight: 1.5,
          marginTop: 4,
        }}>
          Your share is already covered by the bill you&apos;re paying. Everyone else pays you via Venmo, Cash App, or cash.
        </div>
      </div>

      <div style={{ padding: "16px 20px 24px", borderTop: "1px solid var(--border)", background: "var(--bg-surface)", flexShrink: 0 }}>
        <button
          onClick={() => router.push("/screen/tip-phase")}
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
          Continue to Tip
        </button>
      </div>
      <HomeBottomBar hidden />
    </div>
  );
}
