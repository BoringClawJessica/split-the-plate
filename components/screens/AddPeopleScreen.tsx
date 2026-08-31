"use client";

import { useRouter } from "next/navigation";
import { friends, currentUser } from "@/lib/mock-data";
import { useState } from "react";
import { Search, UserPlus, Check } from "lucide-react";

export default function AddPeopleScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([currentUser.id]);

  const toggle = (id: string) => {
    if (id === currentUser.id) return;
    setSelected((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id]);
  };

  return (
    <div style={{ height: "100%", background: "var(--bg-base)", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "20px 20px 12px", flexShrink: 0 }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 600, color: "var(--text)" }}>
          Who's splitting?
        </div>
        <div style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "var(--font-body)", marginTop: 4 }}>
          {selected.length} {selected.length === 1 ? "person" : "people"} added
        </div>
      </div>

      {/* Search */}
      <div style={{ padding: "0 20px 14px", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, background: "var(--bg-card)", borderRadius: 12, padding: "10px 14px", border: "1px solid var(--border)" }}>
          <Search size={16} color="var(--text-muted)" />
          <input placeholder="Search contacts..." style={{ flex: 1, background: "none", border: "none", outline: "none", fontSize: 14, color: "var(--text)", fontFamily: "var(--font-body)" }} />
        </div>
      </div>

      {/* People */}
      <div style={{ flex: 1, overflowY: "auto", padding: "0 20px" }}>
        {/* Current user (always in) */}
        <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 8, fontFamily: "var(--font-body)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
          In this split
        </div>
        <PersonRow
          name={currentUser.name + " (you)"}
          avatar={currentUser.avatar}
          selected
          locked
          onToggle={() => {}}
        />

        <div style={{ height: 16 }} />
        <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 8, fontFamily: "var(--font-body)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
          Friends
        </div>

        {friends.map((f) => (
          <PersonRow
            key={f.id}
            name={f.name}
            avatar={f.avatar}
            selected={selected.includes(f.id)}
            onToggle={() => toggle(f.id)}
          />
        ))}

        {/* Add guest */}
        <button style={{
          width: "100%",
          padding: "14px",
          marginTop: 12,
          borderRadius: 12,
          background: "transparent",
          border: "1px dashed var(--border-bright)",
          color: "var(--text-muted)",
          fontSize: 13,
          cursor: "pointer",
          fontFamily: "var(--font-body)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
        }}>
          <UserPlus size={16} /> Add guest (no account needed)
        </button>
      </div>

      <div style={{ padding: "16px 20px", borderTop: "1px solid var(--border)", background: "var(--bg-surface)", flexShrink: 0 }}>
        <button
          onClick={() => router.push("/screen/split-method")}
          disabled={selected.length < 1}
          style={{
            width: "100%", padding: "15px", borderRadius: 14,
            background: "var(--amber)", color: "#000",
            fontWeight: 700, fontSize: 15, border: "none", cursor: "pointer",
            fontFamily: "var(--font-body)",
          }}
        >
          Next → Choose Split Method
        </button>
      </div>
    </div>
  );
}

function PersonRow({ name, avatar, selected, locked, onToggle }: {
  name: string;
  avatar: string;
  selected: boolean;
  locked?: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      onClick={onToggle}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "10px 12px",
        borderRadius: 12,
        background: selected ? "rgba(245,158,11,0.08)" : "transparent",
        border: `1px solid ${selected ? "rgba(245,158,11,0.3)" : "transparent"}`,
        cursor: locked ? "default" : "pointer",
        marginBottom: 6,
      }}
    >
      <img src={avatar} alt={name} style={{ width: 40, height: 40, borderRadius: "50%", border: "2px solid var(--border)" }} />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: "var(--text)", fontFamily: "var(--font-body)" }}>{name}</div>
      </div>
      <div style={{
        width: 24,
        height: 24,
        borderRadius: "50%",
        background: selected ? "var(--amber)" : "var(--bg-card)",
        border: `1px solid ${selected ? "var(--amber)" : "var(--border-bright)"}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        {selected && <Check size={14} color="#000" strokeWidth={3} />}
      </div>
    </div>
  );
}
