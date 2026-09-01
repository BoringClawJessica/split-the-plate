"use client";

import { useState } from "react";
import { BackButton, HomeBottomBar } from "../PhoneNav";

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <div
      onClick={onToggle}
      style={{
        width: 46,
        height: 26,
        borderRadius: 13,
        background: on ? "var(--amber)" : "var(--bg-raised)",
        position: "relative",
        cursor: "pointer",
        transition: "background 0.2s",
        flexShrink: 0,
        border: on ? "none" : "1px solid var(--border-bright)",
      }}
    >
      <div style={{
        position: "absolute",
        top: 3,
        left: on ? 23 : 3,
        width: 20,
        height: 20,
        borderRadius: "50%",
        background: "#fff",
        transition: "left 0.2s",
        boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
      }} />
    </div>
  );
}

export default function PrivacyScreen() {
  const [settings, setSettings] = useState({
    invites: "friends",
    mealVisible: true,
    profileVisible: true,
    locationSharing: false,
  });

  return (
    <div style={{ position: "relative", height: "100%", background: "var(--bg-base)", display: "flex", flexDirection: "column", padding: "56px 20px 92px" }}>
      <BackButton to="/screen/settings" />
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 600, color: "var(--text)" }}>Privacy</div>
        <div style={{ fontSize: 13, color: "var(--text-secondary)", fontFamily: "var(--font-body)", marginTop: 4 }}>Control who sees your activity</div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Invite control */}
        <div style={{ padding: "16px", borderRadius: 14, background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", fontFamily: "var(--font-body)", marginBottom: 4 }}>Allow meal invites from</div>
          <div style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "var(--font-body)", marginBottom: 12 }}>Who can add you to a split</div>
          <div style={{ display: "flex", gap: 8 }}>
            {["Everyone", "Friends only", "Off"].map((opt) => (
              <button
                key={opt}
                onClick={() => setSettings((s) => ({ ...s, invites: opt.toLowerCase() }))}
                style={{
                  flex: 1,
                  padding: "8px 0",
                  borderRadius: 9,
                  fontSize: 11,
                  fontFamily: "var(--font-body)",
                  background: settings.invites === opt.toLowerCase() ? "var(--amber)" : "var(--bg-raised)",
                  color: settings.invites === opt.toLowerCase() ? "#000" : "var(--text-muted)",
                  border: `1px solid ${settings.invites === opt.toLowerCase() ? "var(--amber)" : "var(--border)"}`,
                  cursor: "pointer",
                  fontWeight: settings.invites === opt.toLowerCase() ? 600 : 400,
                }}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Toggles */}
        {[
          { key: "mealVisible", label: "Meal history visible", desc: "Friends can see your past meals" },
          { key: "profileVisible", label: "Profile visible", desc: "Others can find and follow you" },
          { key: "locationSharing", label: "Location sharing", desc: "Auto-detect when you arrive at restaurants" },
        ].map((item) => (
          <div key={item.key} style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "14px 16px",
            borderRadius: 14,
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 500, color: "var(--text)", fontFamily: "var(--font-body)" }}>{item.label}</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "var(--font-body)", marginTop: 2 }}>{item.desc}</div>
            </div>
            <Toggle
              on={(settings as any)[item.key]}
              onToggle={() => setSettings((s) => ({ ...s, [item.key]: !(s as any)[item.key] }))}
            />
          </div>
        ))}
      </div>
      <HomeBottomBar />
    </div>
  );
}
