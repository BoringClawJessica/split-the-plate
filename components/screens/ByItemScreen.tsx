"use client";

import { useRouter } from "next/navigation";
import { receiptItems, friends, currentUser } from "@/lib/mock-data";
import { useState } from "react";
import { Crown, Hand, Check } from "lucide-react";
import { BackButton, HomeBottomBar } from "../PhoneNav";

const PEOPLE = [
  { id: currentUser.id, name: "You", avatar: currentUser.avatar },
  ...friends.slice(0, 3).map((f) => ({ id: f.id, name: f.name, avatar: f.avatar })),
];

export default function ByItemScreen({ isLeader: isLeaderProp }: { isLeader?: boolean } = {}) {
  const router = useRouter();
  // Mock leader toggle — default: viewer IS the leader
  const [isLeader, setIsLeader] = useState<boolean>(isLeaderProp ?? true);
  const [assignments, setAssignments] = useState<Record<string, string>>({});

  const assign = (itemId: string, personId: string) => {
    setAssignments((a) => ({ ...a, [itemId]: personId }));
  };

  const claim = (itemId: string) => {
    setAssignments((a) => ({ ...a, [itemId]: currentUser.id }));
  };

  const assigned = Object.keys(assignments).length;

  return (
    <div style={{ position: "relative", height: "100%", background: "var(--bg-base)", display: "flex", flexDirection: "column" }}>
      <BackButton to="/screen/split-method" />
      <div style={{ padding: "56px 20px 12px", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 600, color: "var(--text)" }}>
              By Item
            </div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "var(--font-body)", marginTop: 4 }}>
              {assigned}/{receiptItems.length} items assigned
            </div>
          </div>

          {/* Prototype leader toggle */}
          <button
            onClick={() => setIsLeader((v) => !v)}
            title="Toggle leader view (prototype)"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 10px",
              borderRadius: 999,
              background: isLeader ? "rgba(245,158,11,0.12)" : "var(--bg-card)",
              border: `1px solid ${isLeader ? "rgba(245,158,11,0.35)" : "var(--border)"}`,
              color: isLeader ? "var(--amber)" : "var(--text-muted)",
              fontSize: 11,
              fontFamily: "var(--font-body)",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            <Crown size={12} /> {isLeader ? "Leader view" : "Payer view"}
          </button>
        </div>
      </div>

      {/* Person chips (leader only) */}
      {isLeader && (
        <div style={{ padding: "0 20px 12px", flexShrink: 0, display: "flex", gap: 8, overflowX: "auto" }}>
          {PEOPLE.map((p) => {
            const total = receiptItems
              .filter((i) => assignments[i.id] === p.id)
              .reduce((s, i) => s + i.price, 0);
            return (
              <div
                key={p.id}
                style={{
                  flexShrink: 0,
                  padding: "8px 12px",
                  borderRadius: 12,
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.avatar} alt={p.name} style={{ width: 24, height: 24, borderRadius: "50%" }} />
                <div>
                  <div style={{ fontSize: 11, color: "var(--text)", fontFamily: "var(--font-body)", fontWeight: 600 }}>{p.name}</div>
                  <div style={{ fontSize: 10, color: "var(--amber)", fontFamily: "var(--font-body)" }}>${total.toFixed(2)}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Items */}
      <div style={{ flex: 1, overflowY: "auto", padding: "0 20px" }}>
        {receiptItems.map((item) => {
          const assignedPersonId = assignments[item.id];
          const claimedByMe = assignedPersonId === currentUser.id;
          const takenBySomeoneElse = assignedPersonId && assignedPersonId !== currentUser.id;
          const takenName = takenBySomeoneElse
            ? PEOPLE.find((p) => p.id === assignedPersonId)?.name ?? ""
            : "";

          return (
            <div
              key={item.id}
              style={{
                padding: "12px 0",
                borderBottom: "1px solid var(--border)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 14, color: "var(--text)", fontFamily: "var(--font-body)", fontWeight: 500 }}>{item.name}</span>
                <span style={{ fontSize: 14, color: "var(--amber)", fontFamily: "var(--font-body)", fontWeight: 600 }}>${item.price.toFixed(2)}</span>
              </div>

              {isLeader ? (
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {PEOPLE.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => assign(item.id, p.id)}
                      style={{
                        padding: "4px 10px",
                        borderRadius: 8,
                        background: assignments[item.id] === p.id ? "var(--amber)" : "var(--bg-card)",
                        color: assignments[item.id] === p.id ? "#000" : "var(--text-muted)",
                        fontSize: 11,
                        border: `1px solid ${assignments[item.id] === p.id ? "var(--amber)" : "var(--border)"}`,
                        cursor: "pointer",
                        fontFamily: "var(--font-body)",
                        fontWeight: assignments[item.id] === p.id ? 600 : 400,
                      }}
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
              ) : (
                <div>
                  {claimedByMe ? (
                    <div style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "5px 10px",
                      borderRadius: 8,
                      background: "rgba(22,163,74,0.15)",
                      color: "#4ade80",
                      fontSize: 11,
                      fontFamily: "var(--font-body)",
                      fontWeight: 600,
                    }}>
                      <Check size={12} /> Claimed
                    </div>
                  ) : takenBySomeoneElse ? (
                    <div style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "5px 10px",
                      borderRadius: 8,
                      background: "var(--bg-card)",
                      color: "var(--text-muted)",
                      fontSize: 11,
                      fontFamily: "var(--font-body)",
                    }}>
                      Taken by {takenName}
                    </div>
                  ) : (
                    <button
                      onClick={() => claim(item.id)}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "5px 12px",
                        borderRadius: 8,
                        background: "var(--amber)",
                        color: "#000",
                        fontSize: 11,
                        border: "none",
                        cursor: "pointer",
                        fontFamily: "var(--font-body)",
                        fontWeight: 700,
                      }}
                    >
                      <Hand size={12} /> Claim
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ padding: "16px 20px 92px", borderTop: "1px solid var(--border)", background: "var(--bg-surface)", flexShrink: 0 }}>
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
      <HomeBottomBar />
    </div>
  );
}
