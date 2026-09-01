"use client";

import { useState } from "react";
import { BackButton, HomeBottomBar } from "../PhoneNav";

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <div onClick={onToggle} style={{
      width: 46, height: 26, borderRadius: 13,
      background: on ? "var(--amber)" : "var(--bg-raised)",
      position: "relative", cursor: "pointer", transition: "background 0.2s",
      flexShrink: 0, border: on ? "none" : "1px solid var(--border-bright)",
    }}>
      <div style={{
        position: "absolute", top: 3, left: on ? 23 : 3,
        width: 20, height: 20, borderRadius: "50%", background: "#fff",
        transition: "left 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
      }} />
    </div>
  );
}

export default function NotificationSettingsScreen() {
  const categories = [
    { key: "newSplit", label: "Added to a split", desc: "When a friend adds you to a new bill", on: true },
    { key: "payTime", label: "Time to pay", desc: "Your turn in the payment queue", on: true },
    { key: "paid", label: "Marked as paid", desc: "When someone confirms your payment", on: true },
    { key: "gamble", label: "Gamble results", desc: "When Plinko / Roulette finishes", on: true },
    { key: "rollOfDay", label: "Roll of the Day", desc: "Daily gambling challenge reminder", on: false },
    { key: "friends", label: "Friend activity", desc: "When friends save meals or split", on: false },
    { key: "promos", label: "Deals & promotions", desc: "Restaurant deals near you", on: false },
  ];

  const [state, setState] = useState(
    Object.fromEntries(categories.map((c) => [c.key, c.on]))
  );

  return (
    <div style={{ position: "relative", height: "100%", background: "var(--bg-base)", display: "flex", flexDirection: "column", padding: "56px 20px 92px" }}>
      <BackButton to="/screen/settings" />
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 600, color: "var(--text)" }}>Notifications</div>
        <div style={{ fontSize: 13, color: "var(--text-secondary)", fontFamily: "var(--font-body)", marginTop: 4 }}>
          One toggle per category — delivered through the app only
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {categories.map((cat) => (
            <div key={cat.key} style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "14px 16px",
              borderRadius: 14,
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 500, color: state[cat.key] ? "var(--text)" : "var(--text-muted)", fontFamily: "var(--font-body)" }}>{cat.label}</div>
                <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-body)", marginTop: 2 }}>{cat.desc}</div>
              </div>
              <Toggle on={state[cat.key]} onToggle={() => setState((s) => ({ ...s, [cat.key]: !s[cat.key] }))} />
            </div>
          ))}
        </div>
      </div>
      <HomeBottomBar />
    </div>
  );
}
