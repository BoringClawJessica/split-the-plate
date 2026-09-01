"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Camera, User } from "lucide-react";
import { BackButton } from "../PhoneNav";

export default function ProfileSetupScreen() {
  const router = useRouter();
  const [name, setName] = useState("eli");

  const handle = name.trim() ? `@${name.trim().toLowerCase().replace(/[^a-z0-9_]/g, "")}` : "";

  return (
    <div style={{ position: "relative", height: "100%", background: "var(--bg-base)", display: "flex", flexDirection: "column", padding: "56px 28px 32px" }}>
      <BackButton to="/screen/signin" />
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: "var(--amber)", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "var(--font-body)", marginBottom: 8 }}>Step 1 of 2</div>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 600, color: "var(--text)", lineHeight: 1.2 }}>
          Pick your username
        </div>
        <div style={{ marginTop: 8, fontSize: 14, color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}>
          This is your @handle. It shows up on splits and receipts.
        </div>
      </div>

      {/* Avatar */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 32 }}>
        <div style={{ position: "relative" }}>
          <div style={{
            width: 96,
            height: 96,
            borderRadius: "50%",
            background: "linear-gradient(135deg, var(--amber), var(--orange))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 0 3px var(--bg-base), 0 0 0 5px var(--amber)",
          }}>
            <User size={44} color="#000" strokeWidth={1.6} />
          </div>
          <button
            aria-label="Upload profile photo"
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "var(--bg-card)",
              border: "2px solid var(--border-bright)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
          }}>
            <Camera size={15} color="var(--text)" />
          </button>
        </div>
      </div>

      {/* Username input */}
      <div style={{ marginBottom: 12 }}>
        <label style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "var(--font-body)", marginBottom: 8, display: "block" }}>
          Username &mdash; this is your @handle
        </label>
        <div style={{ position: "relative" }}>
          <span style={{
            position: "absolute",
            left: 16,
            top: "50%",
            transform: "translateY(-50%)",
            color: "var(--text-muted)",
            fontSize: 16,
            fontFamily: "var(--font-body)",
            pointerEvents: "none",
          }}>@</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              width: "100%",
              padding: "14px 16px 14px 32px",
              borderRadius: 12,
              background: "var(--bg-card)",
              border: "1px solid var(--border-bright)",
              color: "var(--text)",
              fontSize: 16,
              fontFamily: "var(--font-body)",
              outline: "none",
            }}
            placeholder="yourhandle"
          />
        </div>
        {handle && (
          <div style={{ marginTop: 8, fontSize: 12, color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
            Others will see you as <span style={{ color: "var(--amber)", fontWeight: 600 }}>{handle}</span>
          </div>
        )}
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
        Continue
      </button>
    </div>
  );
}
