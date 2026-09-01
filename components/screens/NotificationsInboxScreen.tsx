"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { inboxNotifications, InboxNotification } from "@/lib/mock-data";
import { Bell, UserPlus, Clock, Check, Settings as SettingsIcon } from "lucide-react";
import { BackButton, HomeBottomBar } from "../PhoneNav";

const iconFor = (type: InboxNotification["type"]) => {
  switch (type) {
    case "added_to_split": return <Bell size={16} />;
    case "time_to_pay": return <Clock size={16} />;
    case "marked_as_paid": return <Check size={16} />;
    case "friend_request": return <UserPlus size={16} />;
    default: return <Bell size={16} />;
  }
};

const colorFor = (type: InboxNotification["type"]) => {
  switch (type) {
    case "added_to_split": return "var(--amber)";
    case "time_to_pay": return "#f87171";
    case "marked_as_paid": return "#4ade80";
    case "friend_request": return "#60a5fa";
    default: return "var(--text-muted)";
  }
};

export default function NotificationsInboxScreen() {
  const router = useRouter();
  const [items, setItems] = useState(inboxNotifications);

  const unreadCount = items.filter((i) => i.unread).length;

  const markAllRead = () => setItems((s) => s.map((i) => ({ ...i, unread: false })));

  return (
    <div style={{ position: "relative", height: "100%", background: "var(--bg-base)", display: "flex", flexDirection: "column" }}>
      <BackButton to="/screen/home" />

      <div style={{ padding: "56px 20px 12px", flexShrink: 0, display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
        <div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 600, color: "var(--text)" }}>
            Notifications
          </div>
          <div style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "var(--font-body)", marginTop: 4 }}>
            {unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
          </div>
        </div>
        <button
          onClick={() => router.push("/screen/notification-settings")}
          aria-label="Notification settings"
          style={{
            width: 36,
            height: 36,
            borderRadius: 999,
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            color: "var(--text-secondary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <SettingsIcon size={16} />
        </button>
      </div>

      {unreadCount > 0 && (
        <div style={{ padding: "0 20px 8px" }}>
          <button
            onClick={markAllRead}
            style={{
              padding: "8px 12px",
              borderRadius: 9,
              background: "transparent",
              border: "1px solid var(--border-bright)",
              color: "var(--text-secondary)",
              fontSize: 12,
              cursor: "pointer",
              fontFamily: "var(--font-body)",
            }}
          >
            Mark all read
          </button>
        </div>
      )}

      <div style={{ flex: 1, overflowY: "auto", padding: "6px 20px 96px" }}>
        {items.length === 0 ? (
          <div style={{
            padding: "60px 20px",
            textAlign: "center",
            color: "var(--text-muted)",
            fontFamily: "var(--font-body)",
            fontSize: 13,
          }}>
            No notifications yet.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {items.map((n) => (
              <div
                key={n.id}
                style={{
                  padding: "12px 14px",
                  borderRadius: 14,
                  background: n.unread ? "rgba(245,158,11,0.06)" : "var(--bg-card)",
                  border: `1px solid ${n.unread ? "rgba(245,158,11,0.25)" : "var(--border)"}`,
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 12,
                }}
              >
                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: "var(--bg-raised)",
                  color: colorFor(n.type),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}>
                  {iconFor(n.type)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", fontFamily: "var(--font-body)", marginBottom: 2 }}>
                    {n.title}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text-secondary)", fontFamily: "var(--font-body)", lineHeight: 1.4 }}>
                    {n.body}
                  </div>
                  <div style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "var(--font-body)", marginTop: 4 }}>
                    {n.time}
                  </div>
                </div>
                {n.unread && (
                  <div style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "var(--amber)",
                    flexShrink: 0,
                    marginTop: 6,
                  }} />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <HomeBottomBar />
    </div>
  );
}
