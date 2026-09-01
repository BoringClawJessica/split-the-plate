"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, Home } from "lucide-react";

export function BackButton({ to }: { to?: string }) {
  const router = useRouter();
  const onClick = () => {
    if (to) router.push(to);
    else router.back();
  };
  return (
    <button
      onClick={onClick}
      aria-label="Back"
      style={{
        position: "absolute",
        top: 14,
        left: 14,
        zIndex: 20,
        width: 36,
        height: 36,
        borderRadius: 999,
        background: "var(--bg-card)",
        border: "1px solid var(--border-bright)",
        color: "var(--text)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
      }}
    >
      <ChevronLeft size={18} />
    </button>
  );
}

export function HomeBottomBar({ hidden = false }: { hidden?: boolean } = {}) {
  const router = useRouter();
  if (hidden) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 15,
        display: "flex",
        justifyContent: "center",
        padding: "10px 0 14px",
        background:
          "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.35) 60%, rgba(0,0,0,0.55) 100%)",
        pointerEvents: "none",
      }}
    >
      <button
        onClick={() => router.push("/screen/home")}
        aria-label="Home"
        style={{
          pointerEvents: "auto",
          width: 52,
          height: 52,
          borderRadius: 999,
          background: "linear-gradient(135deg, var(--amber), var(--orange))",
          border: "none",
          color: "#000",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          boxShadow: "0 8px 20px rgba(245,158,11,0.35)",
        }}
      >
        <Home size={22} strokeWidth={2.4} />
      </button>
    </div>
  );
}

/** Convenience wrapper for screens: adds bottom padding so content isn't hidden behind HomeBottomBar. */
export function PhoneNavSpacer() {
  return <div style={{ height: 72, flexShrink: 0 }} />;
}
