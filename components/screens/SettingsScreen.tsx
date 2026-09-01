"use client";

import { useRouter } from "next/navigation";
import { ChevronRight, CreditCard, Bell, Lock, LogOut, User, Star, MessageSquare, FileText } from "lucide-react";
import { BackButton, HomeBottomBar } from "../PhoneNav";

export default function SettingsScreen() {
  const router = useRouter();

  const sections = [
    {
      title: "Account",
      items: [
        { icon: <CreditCard size={16} />, label: "Payment Methods", route: "/screen/payment-methods" },
      ],
    },
    {
      title: "Preferences",
      items: [
        { icon: <Bell size={16} />, label: "Notifications", route: "/screen/notification-settings" },
        { icon: <Lock size={16} />, label: "Privacy", route: "/screen/privacy" },
      ],
    },
    {
      title: "More",
      items: [
        { icon: <Star size={16} />, label: "Rate Split the Plate" },
        { icon: <MessageSquare size={16} />, label: "Send Feedback" },
        { icon: <FileText size={16} />, label: "Terms" },
      ],
    },
  ];

  return (
    <div style={{ position: "relative", height: "100%", background: "var(--bg-base)", display: "flex", flexDirection: "column" }}>
      <BackButton to="/screen/profile" />
      <div style={{ padding: "56px 20px 12px", flexShrink: 0 }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 600, color: "var(--text)" }}>Settings</div>
      </div>

      {/* Profile mini card */}
      <div style={{
        margin: "0 20px 20px",
        padding: "16px",
        borderRadius: 16,
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        display: "flex",
        alignItems: "center",
        gap: 12,
        cursor: "pointer",
        flexShrink: 0,
      }}
        onClick={() => router.push("/screen/profile")}
      >
        <div style={{
          width: 52,
          height: 52,
          borderRadius: "50%",
          background: "linear-gradient(135deg, var(--amber), var(--orange))",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#000",
        }}>
          <User size={22} strokeWidth={1.6} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: "var(--text)", fontFamily: "var(--font-body)" }}>Eli</div>
          <div style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>@eli · Tap avatar there to edit</div>
        </div>
        <ChevronRight size={16} color="var(--text-muted)" />
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "0 20px" }}>
        {sections.map((section) => (
          <div key={section.title} style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "var(--font-body)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.1em" }}>
              {section.title}
            </div>
            <div style={{ borderRadius: 14, overflow: "hidden", border: "1px solid var(--border)" }}>
              {section.items.map((item, idx) => (
                <div
                  key={item.label}
                  onClick={() => (item as any).route && router.push((item as any).route)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "14px 16px",
                    background: "var(--bg-card)",
                    borderBottom: idx < section.items.length - 1 ? "1px solid var(--border)" : "none",
                    cursor: "pointer",
                  }}
                >
                  <div style={{ color: "var(--amber)", display: "flex", fontSize: 18 }}>{item.icon}</div>
                  <div style={{ flex: 1, fontSize: 14, color: "var(--text)", fontFamily: "var(--font-body)" }}>{item.label}</div>
                  <ChevronRight size={14} color="var(--text-muted)" />
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Sign out */}
        <button style={{
          width: "100%",
          padding: "14px",
          borderRadius: 14,
          background: "transparent",
          border: "1px solid rgba(220,38,38,0.3)",
          color: "#f87171",
          fontSize: 14,
          cursor: "pointer",
          fontFamily: "var(--font-body)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          marginBottom: 20,
        }}>
          <LogOut size={16} />
          Sign Out
        </button>
        <div style={{ height: 80 }} />
      </div>
      <HomeBottomBar />
    </div>
  );
}
