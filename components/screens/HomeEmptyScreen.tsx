"use client";

import { useRouter } from "next/navigation";
import { Utensils } from "lucide-react";
import { HomeBottomBar } from "../PhoneNav";

export default function HomeEmptyScreen() {
  const router = useRouter();

  return (
    <div style={{ position: "relative", height: "100%", background: "var(--bg-base)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px 28px 92px" }}>
      <div style={{
        width: 96,
        height: 96,
        borderRadius: 28,
        background: "linear-gradient(135deg, var(--amber), var(--orange))",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 20,
        boxShadow: "0 12px 32px rgba(245,158,11,0.25)",
      }}>
        <Utensils size={44} color="#000" strokeWidth={1.5} />
      </div>
      <div style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 600, color: "var(--text)", textAlign: "center", marginBottom: 12 }}>
        No recent meals yet
      </div>
      <div style={{ fontSize: 14, color: "var(--text-secondary)", textAlign: "center", fontFamily: "var(--font-body)", lineHeight: 1.6, marginBottom: 32, maxWidth: 280 }}>
        Scan a receipt with friends and your first split will show up in Recent Meals.
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
        Start your first split
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
      <HomeBottomBar />
    </div>
  );
}
