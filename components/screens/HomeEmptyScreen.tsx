"use client";

import { useRouter } from "next/navigation";

export default function HomeEmptyScreen() {
  const router = useRouter();

  return (
    <div style={{ height: "100%", background: "var(--bg-base)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px 28px" }}>
      <div style={{ fontSize: 72, marginBottom: 24 }}>🍽️</div>
      <div style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 600, color: "var(--text)", textAlign: "center", marginBottom: 12 }}>
        Your first split awaits
      </div>
      <div style={{ fontSize: 14, color: "var(--text-secondary)", textAlign: "center", fontFamily: "var(--font-body)", lineHeight: 1.6, marginBottom: 40 }}>
        Go out with friends, scan the receipt, and Split the Plate handles the rest.
      </div>
      <button
        onClick={() => router.push("/screen/new-split")}
        style={{
          width: "100%",
          padding: "16px",
          borderRadius: 14,
          background: "var(--amber)",
          color: "#000",
          fontWeight: 700,
          fontSize: 16,
          border: "none",
          cursor: "pointer",
          fontFamily: "var(--font-body)",
          boxShadow: "0 8px 24px rgba(245,158,11,0.3)",
          marginBottom: 12,
        }}
      >
        + Start Your First Split
      </button>
      <button
        onClick={() => router.push("/screen/friends")}
        style={{
          width: "100%",
          padding: "14px",
          borderRadius: 14,
          background: "transparent",
          color: "var(--text-muted)",
          fontSize: 14,
          border: "1px solid var(--border)",
          cursor: "pointer",
          fontFamily: "var(--font-body)",
        }}
      >
        Invite friends first
      </button>
    </div>
  );
}
