"use client";

import { useRouter } from "next/navigation";
import { Bell } from "lucide-react";
import { BackButton } from "../PhoneNav";

export default function NotificationsScreen() {
  const router = useRouter();

  return (
    <div style={{ position: "relative", height: "100%", background: "var(--bg-base)", display: "flex", flexDirection: "column", padding: "56px 28px 32px" }}>
      <BackButton to="/screen/profile-setup" />
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 11, color: "var(--amber)", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "var(--font-body)", marginBottom: 8 }}>Step 2 of 2</div>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 600, color: "var(--text)", lineHeight: 1.2 }}>
          Stay in the loop
        </div>
        <div style={{ marginTop: 8, fontSize: 14, color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}>
          Get notified when friends add you to a split or it's time to pay
        </div>
      </div>

      {/* Icon */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 40 }}>
        <div style={{
          width: 100,
          height: 100,
          borderRadius: 28,
          background: "linear-gradient(135deg, var(--amber), var(--orange))",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 20px 40px rgba(245,158,11,0.3)",
          animation: "float 3s ease-in-out infinite",
        }}>
          <Bell size={48} color="#000" strokeWidth={1.5} />
        </div>
      </div>

      <div style={{ flex: 1 }}>
        {[
          "When friends add you to a split",
          "When it's your turn to pay",
          "When someone marks you as paid",
          "Roll of the Day reminders",
        ].map((item) => (
          <div key={item} style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "12px 0",
            borderBottom: "1px solid var(--border)",
          }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--amber)", flexShrink: 0 }} />
            <span style={{ fontSize: 14, color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}>{item}</span>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 24 }}>
        <button
          onClick={() => router.push("/screen/home")}
          style={{
            width: "100%", padding: "16px", borderRadius: 14,
            background: "var(--amber)", color: "#000",
            fontWeight: 600, fontSize: 15, border: "none", cursor: "pointer",
            fontFamily: "var(--font-body)",
          }}
        >
          Allow Notifications
        </button>
        <button
          onClick={() => router.push("/screen/home")}
          style={{
            width: "100%", padding: "14px", borderRadius: 14,
            background: "transparent", color: "var(--text-muted)",
            fontWeight: 400, fontSize: 14, border: "none", cursor: "pointer",
            fontFamily: "var(--font-body)",
          }}
        >
          Not now
        </button>
      </div>
    </div>
  );
}
