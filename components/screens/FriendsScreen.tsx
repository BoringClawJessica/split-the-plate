"use client";

import { useRouter } from "next/navigation";
import { friends } from "@/lib/mock-data";
import { Search, UserPlus } from "lucide-react";
import { useState } from "react";
import { BackButton, HomeBottomBar } from "../PhoneNav";

export default function FriendsScreen() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const filtered = friends.filter((f) =>
    f.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div style={{ position: "relative", height: "100%", background: "var(--bg-base)", display: "flex", flexDirection: "column" }}>
      <BackButton to="/screen/home" />
      {/* Header */}
      <div style={{ padding: "56px 20px 12px", display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 600, color: "var(--text)" }}>Friends</div>
      </div>

      {/* Search */}
      <div style={{ padding: "0 20px 16px", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, background: "var(--bg-card)", borderRadius: 12, padding: "10px 14px", border: "1px solid var(--border)" }}>
          <Search size={16} color="var(--text-muted)" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search friends..."
            style={{ flex: 1, background: "none", border: "none", outline: "none", fontSize: 14, color: "var(--text)", fontFamily: "var(--font-body)" }}
          />
        </div>
      </div>

      {/* Invite banner */}
      <div style={{ padding: "0 20px 16px", flexShrink: 0 }}>
        <div style={{
          padding: "14px 16px",
          borderRadius: 14,
          background: "rgba(245,158,11,0.1)",
          border: "1px solid rgba(245,158,11,0.3)",
          display: "flex",
          alignItems: "center",
          gap: 12,
          cursor: "pointer",
        }}>
          <UserPlus size={20} color="var(--amber)" />
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--amber)", fontFamily: "var(--font-body)" }}>Invite friends</div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>Share your link — they get $5 on first split</div>
          </div>
        </div>
      </div>

      {/* Friends list */}
      <div style={{ flex: 1, overflowY: "auto", padding: "0 20px" }}>
        <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 10, fontFamily: "var(--font-body)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
          Your friends ({filtered.length})
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {filtered.map((f) => (
            <div key={f.id} style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "12px 14px",
              borderRadius: 14,
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              cursor: "pointer",
            }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={f.avatar} alt={f.name} style={{ width: 44, height: 44, borderRadius: "50%", border: "2px solid var(--border)" }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", fontFamily: "var(--font-body)" }}>{f.name}</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>{f.handle}</div>
              </div>
              <button style={{
                padding: "6px 14px",
                borderRadius: 8,
                background: "var(--bg-raised)",
                border: "1px solid var(--border-bright)",
                color: "var(--text-secondary)",
                fontSize: 12,
                cursor: "pointer",
                fontFamily: "var(--font-body)",
              }}>
                Invite to split
              </button>
            </div>
          ))}
        </div>
        <div style={{ height: 80 }} />
      </div>
      <HomeBottomBar />
    </div>
  );
}
