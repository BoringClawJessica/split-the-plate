"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Camera } from "lucide-react";

export default function ProfileSetupScreen() {
  const router = useRouter();
  const [name, setName] = useState("Eli");

  return (
    <div style={{ height: "100%", background: "var(--bg-base)", display: "flex", flexDirection: "column", padding: "32px 28px" }}>
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 11, color: "var(--amber)", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "var(--font-body)", marginBottom: 8 }}>Step 1 of 3</div>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 600, color: "var(--text)", lineHeight: 1.2 }}>
          What should we call you?
        </div>
        <div style={{ marginTop: 8, fontSize: 14, color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}>
          Your name shows on splits and receipts
        </div>
      </div>

      {/* Avatar */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 36 }}>
        <div style={{ position: "relative" }}>
          <div style={{
            width: 96,
            height: 96,
            borderRadius: "50%",
            background: "linear-gradient(135deg, var(--amber), var(--orange))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 36,
            boxShadow: "0 0 0 3px var(--bg-base), 0 0 0 5px var(--amber)",
          }}>
            🙂
          </div>
          <button style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            width: 30,
            height: 30,
            borderRadius: "50%",
            background: "var(--bg-card)",
            border: "2px solid var(--border-bright)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <Camera size={14} color="var(--text)" />
          </button>
        </div>
      </div>

      {/* Name input */}
      <div style={{ marginBottom: 24 }}>
        <label style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "var(--font-body)", marginBottom: 8, display: "block" }}>Your name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{
            width: "100%",
            padding: "14px 16px",
            borderRadius: 12,
            background: "var(--bg-card)",
            border: "1px solid var(--border-bright)",
            color: "var(--text)",
            fontSize: 16,
            fontFamily: "var(--font-body)",
            outline: "none",
          }}
          placeholder="Your name"
        />
      </div>

      <div style={{ flex: 1 }} />

      <button
        onClick={() => router.push("/screen/notifications-permission")}
        disabled={!name.trim()}
        style={{
          width: "100%",
          padding: "16px",
          borderRadius: 14,
          background: name.trim() ? "var(--amber)" : "var(--bg-card)",
          color: name.trim() ? "#000" : "var(--text-muted)",
          fontWeight: 600,
          fontSize: 15,
          border: "none",
          cursor: name.trim() ? "pointer" : "not-allowed",
          fontFamily: "var(--font-body)",
          transition: "all 0.2s",
        }}
      >
        Continue →
      </button>
    </div>
  );
}
