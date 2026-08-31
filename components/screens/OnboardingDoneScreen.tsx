"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function OnboardingDoneScreen() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{
      height: "100%",
      background: "linear-gradient(160deg, #0d0900 0%, var(--bg-base) 100%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "32px 28px",
    }}>
      <div style={{
        textAlign: "center",
        opacity: ready ? 1 : 0,
        transform: ready ? "scale(1)" : "scale(0.8)",
        transition: "all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
      }}>
        <div style={{ fontSize: 80, marginBottom: 24 }}>🎉</div>
        <div style={{
          fontFamily: "var(--font-display)",
          fontSize: 32,
          fontWeight: 600,
          color: "var(--text)",
          marginBottom: 12,
        }}>
          You&apos;re in.
        </div>
        <div style={{ fontSize: 14, color: "var(--text-secondary)", fontFamily: "var(--font-body)", lineHeight: 1.6 }}>
          Time to eat, split, and never argue about who had the steak again.
        </div>
      </div>

      <button
        onClick={() => router.push("/screen/home")}
        style={{
          position: "absolute",
          bottom: 48,
          width: "calc(100% - 56px)",
          padding: "16px",
          borderRadius: 14,
          background: "var(--amber)",
          color: "#000",
          fontWeight: 700,
          fontSize: 16,
          border: "none",
          cursor: "pointer",
          fontFamily: "var(--font-body)",
          opacity: ready ? 1 : 0,
          transform: ready ? "translateY(0)" : "translateY(20px)",
          transition: "all 0.5s ease 0.3s",
          boxShadow: "0 8px 24px rgba(245,158,11,0.4)",
        }}
      >
        Let&apos;s eat →
      </button>
    </div>
  );
}
