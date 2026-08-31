"use client";

import { useRouter } from "next/navigation";

function EdgeLayout({ emoji, title, desc, primary, secondary, offline }: {
  emoji: string;
  title: string;
  desc: string;
  primary?: { label: string; route: string };
  secondary?: { label: string; route: string };
  offline?: boolean;
}) {
  const router = useRouter();

  return (
    <div style={{ height: "100%", background: "var(--bg-base)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px 28px", position: "relative" }}>
      {offline && (
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          padding: "12px 20px",
          background: "rgba(220,38,38,0.9)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
        }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#fff", animation: "pulse-ring 1.5s ease infinite" }} />
          <span style={{ fontSize: 13, color: "#fff", fontFamily: "var(--font-body)", fontWeight: 600 }}>No internet connection</span>
        </div>
      )}

      <div style={{ fontSize: 72, marginBottom: 24 }}>{emoji}</div>
      <div style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 600, color: "var(--text)", textAlign: "center", marginBottom: 12 }}>
        {title}
      </div>
      <div style={{ fontSize: 14, color: "var(--text-secondary)", textAlign: "center", fontFamily: "var(--font-body)", lineHeight: 1.6, marginBottom: 40, maxWidth: 280 }}>
        {desc}
      </div>
      {primary && (
        <button
          onClick={() => router.push(primary.route)}
          style={{
            width: "100%", padding: "15px", borderRadius: 14, marginBottom: 10,
            background: "var(--amber)", color: "#000",
            fontWeight: 700, fontSize: 15, border: "none", cursor: "pointer",
            fontFamily: "var(--font-body)",
          }}
        >
          {primary.label}
        </button>
      )}
      {secondary && (
        <button
          onClick={() => router.push(secondary.route)}
          style={{
            width: "100%", padding: "13px", borderRadius: 14,
            background: "transparent", color: "var(--text-muted)",
            fontSize: 14, border: "1px solid var(--border)", cursor: "pointer",
            fontFamily: "var(--font-body)",
          }}
        >
          {secondary.label}
        </button>
      )}
    </div>
  );
}

export function ReceiptNotFoundScreen() {
  return (
    <EdgeLayout
      emoji="📷"
      title="Receipt not detected"
      desc="We couldn't read that one. Try moving closer, better lighting, or just type it in."
      primary={{ label: "Try Again", route: "/screen/camera-scan" }}
      secondary={{ label: "Enter Manually Instead", route: "/screen/items-detected" }}
    />
  );
}

export function NoFriendsScreen() {
  return (
    <EdgeLayout
      emoji="👥"
      title="No friends yet"
      desc="Invite friends to start splitting bills together. They'll get $5 off their first split."
      primary={{ label: "Invite Friends →", route: "/screen/friends" }}
      secondary={{ label: "Continue Anyway", route: "/screen/new-split" }}
    />
  );
}

export function NoSplitsScreen() {
  return (
    <EdgeLayout
      emoji="🍽️"
      title="No splits yet"
      desc="Go out, scan your receipt, and Split the Plate handles the rest. First one's on us (well, on everyone equally)."
      primary={{ label: "Start Your First Split →", route: "/screen/new-split" }}
    />
  );
}

export function PaymentFailedScreen() {
  return (
    <EdgeLayout
      emoji="❌"
      title="Payment failed"
      desc="Something went wrong sending that request. Check your payment handle or try a different app."
      primary={{ label: "Try Again", route: "/screen/payment-handoff" }}
      secondary={{ label: "Send Cash Instead", route: "/screen/home" }}
    />
  );
}

export function OfflineBannerScreen() {
  return (
    <EdgeLayout
      emoji="📶"
      title="You're offline"
      desc="Split the Plate needs internet to sync payments and splits. Your last session is still visible below."
      primary={{ label: "Retry Connection", route: "/screen/home" }}
      offline
    />
  );
}
