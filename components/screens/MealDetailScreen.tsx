"use client";

import { useState } from "react";
import { pastMeals, paymentMethods, splitMethodLabels, PaymentStatus } from "@/lib/mock-data";
import {
  Users,
  Check,
  Clock,
  Wallet,
  Smartphone,
  DollarSign,
  Banknote,
  Image as ImageIcon,
} from "lucide-react";
import { BackButton, HomeBottomBar } from "../PhoneNav";

const meal = pastMeals[0];

const isLeader = true; // in v1 the current viewer is treated as the leader

const paymentIconFor = (id: string) => {
  switch (id) {
    case "applepay": return <Smartphone size={13} />;
    case "cashapp": return <DollarSign size={13} />;
    case "venmo": return <Wallet size={13} />;
    case "zelle": return <Wallet size={13} />;
    case "paypal": return <Wallet size={13} />;
    case "cash": return <Banknote size={13} />;
    default: return <Wallet size={13} />;
  }
};

const paymentName = (id: string) =>
  paymentMethods.find((p) => p.id === id)?.name ?? "Unknown";

const paymentColor = (id: string) =>
  paymentMethods.find((p) => p.id === id)?.color ?? "#4b5563";

function StatusPill({ status }: { status: PaymentStatus }) {
  if (status === "paid") {
    return (
      <span style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: "3px 8px",
        borderRadius: 999,
        background: "rgba(22,163,74,0.15)",
        color: "#4ade80",
        fontSize: 11,
        fontFamily: "var(--font-body)",
        fontWeight: 500,
      }}>
        <Check size={11} /> Paid
      </span>
    );
  }
  if (status === "awaiting_cash") {
    return (
      <span style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: "3px 8px",
        borderRadius: 999,
        background: "rgba(245,158,11,0.15)",
        color: "var(--amber)",
        fontSize: 11,
        fontFamily: "var(--font-body)",
        fontWeight: 500,
      }}>
        <Clock size={11} /> Awaiting cash
      </span>
    );
  }
  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 4,
      padding: "3px 8px",
      borderRadius: 999,
      background: "rgba(220,38,38,0.12)",
      color: "#f87171",
      fontSize: 11,
      fontFamily: "var(--font-body)",
      fontWeight: 500,
    }}>
      <Clock size={11} /> Not paid
    </span>
  );
}

export default function MealDetailScreen() {
  // Local state so leader can mark cash as received
  const [statuses, setStatuses] = useState<Record<string, PaymentStatus>>(
    Object.fromEntries(meal.people.map((p) => [p.id, p.status]))
  );

  const markCashReceived = (personId: string) =>
    setStatuses((s) => ({ ...s, [personId]: "paid" }));

  const splitFooter = (() => {
    const label = splitMethodLabels[meal.splitMethod];
    if (meal.splitMethod === "plinko" && meal.loser) return `${label} — ${meal.loser} paid`;
    if (meal.splitMethod === "roulette" && meal.loser) return `${label} — ${meal.loser} paid`;
    return label;
  })();

  return (
    <div style={{ position: "relative", height: "100%", background: "var(--bg-base)", display: "flex", flexDirection: "column" }}>
      <BackButton to="/screen/meal-history" />

      {/* Header */}
      <div style={{
        padding: "56px 20px 18px",
        background: "linear-gradient(160deg, rgba(245,158,11,0.08), transparent)",
        borderBottom: "1px solid var(--border)",
        flexShrink: 0,
      }}>
        <div style={{
          fontFamily: "var(--font-display)",
          fontSize: 26,
          fontWeight: 700,
          color: "var(--text)",
          marginBottom: 4,
          lineHeight: 1.15,
        }}>
          {meal.restaurant}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <div style={{ fontSize: 13, color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}>
            {meal.date}
          </div>
          <span style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            padding: "3px 9px",
            borderRadius: 999,
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            color: "var(--text-secondary)",
            fontSize: 12,
            fontFamily: "var(--font-body)",
          }}>
            <Users size={12} /> {meal.people.length} people
          </span>
        </div>
      </div>

      {/* Scrollable body */}
      <div style={{ flex: 1, overflowY: "auto", padding: "18px 20px 96px" }}>
        {/* Receipt photo — only if scanned */}
        {meal.scanned && (
          <div style={{ marginBottom: 20 }}>
            <div style={{
              fontSize: 11,
              color: "var(--text-muted)",
              fontFamily: "var(--font-body)",
              marginBottom: 8,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}>
              Receipt photo
            </div>
            <div style={{
              width: "100%",
              aspectRatio: "3 / 4",
              maxHeight: 260,
              borderRadius: 14,
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              color: "var(--text-muted)",
              fontFamily: "var(--font-body)",
              fontSize: 12,
              gap: 8,
              overflow: "hidden",
            }}>
              {meal.receiptPhoto ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={meal.receiptPhoto}
                  alt="Receipt"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <>
                  <ImageIcon size={26} />
                  <div>Receipt photo</div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Digital receipt */}
        <div style={{ marginBottom: 22 }}>
          <div style={{
            fontSize: 11,
            color: "var(--text-muted)",
            fontFamily: "var(--font-body)",
            marginBottom: 10,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}>
            Digital receipt
          </div>
          <div style={{
            padding: "14px 16px",
            borderRadius: 14,
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
          }}>
            {meal.receipt.items.map((it, idx) => (
              <div key={idx} style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "6px 0",
                borderBottom: idx < meal.receipt.items.length - 1 ? "1px dashed var(--border)" : "none",
                fontSize: 13,
                color: "var(--text)",
                fontFamily: "var(--font-body)",
              }}>
                <span>{it.name}</span>
                <span style={{ color: "var(--text-secondary)" }}>${it.price.toFixed(2)}</span>
              </div>
            ))}
            <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: 4 }}>
              <ReceiptRow label="Subtotal" value={meal.receipt.subtotal} />
              <ReceiptRow label="Tax" value={meal.receipt.tax} />
              <ReceiptRow label="Total" value={meal.receipt.total} bold />
            </div>
          </div>
        </div>

        {/* People section */}
        <div style={{ marginBottom: 22 }}>
          <div style={{
            fontSize: 11,
            color: "var(--text-muted)",
            fontFamily: "var(--font-body)",
            marginBottom: 10,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}>
            People
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {meal.people.map((p) => {
              const status = statuses[p.id];
              return (
                <div key={p.id} style={{
                  padding: "12px 14px",
                  borderRadius: 14,
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.avatar}
                      alt={p.name}
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        border: "2px solid var(--border)",
                        flexShrink: 0,
                      }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", fontFamily: "var(--font-body)" }}>
                        {p.name}
                      </div>
                      <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-body)", marginTop: 2 }}>
                        ${p.amountPaid.toFixed(2)}
                      </div>
                    </div>
                    <StatusPill status={status} />
                  </div>

                  {/* Items assigned */}
                  {p.items.length > 0 && (
                    <div style={{
                      fontSize: 12,
                      color: "var(--text-secondary)",
                      fontFamily: "var(--font-body)",
                      marginBottom: 8,
                      lineHeight: 1.5,
                    }}>
                      {p.items.join(" · ")}
                    </div>
                  )}

                  {/* Payment method */}
                  <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "space-between" }}>
                    <span style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      fontSize: 11,
                      color: "var(--text-muted)",
                      fontFamily: "var(--font-body)",
                    }}>
                      <span style={{
                        width: 18,
                        height: 18,
                        borderRadius: 999,
                        background: paymentColor(p.paymentMethodId),
                        color: "#fff",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}>
                        {paymentIconFor(p.paymentMethodId)}
                      </span>
                      {paymentName(p.paymentMethodId)}
                    </span>

                    {status === "awaiting_cash" && isLeader && (
                      <button
                        onClick={() => markCashReceived(p.id)}
                        style={{
                          padding: "6px 12px",
                          borderRadius: 9,
                          background: "var(--amber)",
                          color: "#000",
                          fontSize: 11,
                          fontWeight: 600,
                          border: "none",
                          cursor: "pointer",
                          fontFamily: "var(--font-body)",
                        }}
                      >
                        Mark received
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Split method footer */}
        <div style={{
          padding: "12px 14px",
          borderRadius: 12,
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          fontSize: 12,
          color: "var(--text-secondary)",
          fontFamily: "var(--font-body)",
          textAlign: "center",
        }}>
          {splitFooter}
        </div>
      </div>

      <HomeBottomBar />
    </div>
  );
}

function ReceiptRow({ label, value, bold }: { label: string; value: number; bold?: boolean }) {
  return (
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      fontSize: bold ? 14 : 12,
      fontWeight: bold ? 700 : 400,
      color: bold ? "var(--text)" : "var(--text-secondary)",
      fontFamily: "var(--font-body)",
    }}>
      <span>{label}</span>
      <span style={{ color: bold ? "var(--amber)" : "var(--text)" }}>${value.toFixed(2)}</span>
    </div>
  );
}
