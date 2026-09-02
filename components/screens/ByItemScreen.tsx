"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { BackButton, HomeBottomBar } from "../PhoneNav";
import {
  readSplit,
  computePerPersonFromAssignments,
  SplitItem,
  SplitPerson,
} from "@/lib/split-state";
import {
  receiptItems as receiptItemsSeed,
  currentUser,
  friends as friendsSeed,
} from "@/lib/mock-data";

/**
 * ByItemScreen — READ-ONLY view of already-assigned items.
 *
 * Assignment happens up front on the Items Detected step. This screen
 * just READS the assignments (from sessionStorage) and shows each
 * person their portion. No re-assignment UI.
 *
 * Unassigned items are split evenly across everyone in the party, so
 * the totals still add up to the subtotal.
 */
export default function ByItemScreen() {
  const router = useRouter();
  // Read once on mount — sessionStorage is not reactive.
  const [state] = useState<{ people: SplitPerson[]; items: SplitItem[] } | null>(() => {
    if (typeof window === "undefined") return null;
    const persisted = readSplit();
    if (persisted && persisted.people.length > 0 && persisted.items.length > 0) {
      return { people: persisted.people, items: persisted.items };
    }
    // Fallback so the screen still renders when accessed directly.
    return {
      people: [
        { id: currentUser.id, name: "You", avatar: currentUser.avatar },
        ...friendsSeed.slice(0, 3).map((f) => ({
          id: f.id,
          name: f.name,
          avatar: f.avatar,
          handle: f.handle,
        })),
      ],
      items: receiptItemsSeed.map((i) => ({ ...i, assignedTo: [] })),
    };
  });

  const totals = useMemo(() => {
    if (!state) return { perPerson: {} as Record<string, number>, subtotal: 0, unassignedShare: 0, unassignedCount: 0 };
    const { people, items } = state;
    const assignedTotals = computePerPersonFromAssignments(people, items);
    // Distribute unassigned items evenly across the whole party.
    const unassigned = items.filter((i) => i.assignedTo.length === 0);
    const unassignedSum = unassigned.reduce((s, i) => s + i.price, 0);
    const evenShare = people.length > 0 ? unassignedSum / people.length : 0;
    const perPerson: Record<string, number> = {};
    for (const p of people) perPerson[p.id] = (assignedTotals[p.id] ?? 0) + evenShare;
    const subtotal = items.reduce((s, i) => s + i.price, 0);
    return { perPerson, subtotal, unassignedShare: evenShare, unassignedCount: unassigned.length };
  }, [state]);

  if (!state) {
    return <div style={{ height: "100%", background: "var(--bg-base)" }} />;
  }

  const { people, items } = state;
  const { perPerson, subtotal, unassignedCount, unassignedShare } = totals;

  return (
    <div style={{ position: "relative", height: "100%", background: "var(--bg-base)", display: "flex", flexDirection: "column" }}>
      <BackButton to="/screen/split-method" />
      <div style={{ padding: "56px 20px 12px", flexShrink: 0 }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 600, color: "var(--text)" }}>
          By Item
        </div>
        <div style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "var(--font-body)", marginTop: 4 }}>
          Everyone pays for what they ordered.
        </div>
      </div>

      {/* Per-person totals */}
      <div style={{ flex: 1, overflowY: "auto", padding: "0 20px" }}>
        <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-body)", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.06em" }}>
          Per person
        </div>

        {people.map((p) => {
          const myItems = items.filter((i) => i.assignedTo.includes(p.id));
          const owe = perPerson[p.id] ?? 0;
          return (
            <div
              key={p.id}
              style={{
                padding: "14px",
                borderRadius: 14,
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                marginBottom: 10,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.avatar} alt={p.name} style={{ width: 40, height: 40, borderRadius: "50%", border: "2px solid var(--border)" }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", fontFamily: "var(--font-body)" }}>
                    {p.name}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
                    {myItems.length} {myItems.length === 1 ? "item" : "items"}{unassignedCount > 0 ? ` + shared` : ""}
                  </div>
                </div>
                <div style={{ fontSize: 18, fontWeight: 800, color: "var(--amber)", fontFamily: "var(--font-body)" }}>
                  ${owe.toFixed(2)}
                </div>
              </div>

              {(myItems.length > 0 || unassignedCount > 0) && (
                <div style={{ marginTop: 10, paddingLeft: 52, display: "flex", flexDirection: "column", gap: 4 }}>
                  {myItems.map((it) => {
                    const perHead = it.price / it.assignedTo.length;
                    const shared = it.assignedTo.length > 1;
                    return (
                      <div key={it.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", fontSize: 11, fontFamily: "var(--font-body)", color: "var(--text-muted)" }}>
                        <span>{it.name}{shared ? ` (÷${it.assignedTo.length})` : ""}</span>
                        <span style={{ color: "var(--text-secondary)" }}>${perHead.toFixed(2)}</span>
                      </div>
                    );
                  })}
                  {unassignedCount > 0 && (
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", fontSize: 11, fontFamily: "var(--font-body)", color: "var(--text-muted)" }}>
                      <span>Shared items ({unassignedCount})</span>
                      <span style={{ color: "var(--text-secondary)" }}>${unassignedShare.toFixed(2)}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {unassignedCount > 0 && (
          <div style={{ padding: "10px 12px", borderRadius: 10, background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.25)", fontSize: 11, color: "var(--amber)", fontFamily: "var(--font-body)", marginTop: 4 }}>
            {unassignedCount} unassigned {unassignedCount === 1 ? "item is" : "items are"} split evenly across everyone.
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      <div style={{ padding: "16px 20px", borderTop: "1px solid var(--border)", background: "var(--bg-surface)", flexShrink: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
          <span style={{ fontSize: 13, color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>Subtotal</span>
          <span style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", fontFamily: "var(--font-body)" }}>${subtotal.toFixed(2)}</span>
        </div>
        <button
          onClick={() => router.push("/screen/review-confirm")}
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
          }}
        >
          Review Split
        </button>
      </div>
      <HomeBottomBar hidden />
    </div>
  );
}
