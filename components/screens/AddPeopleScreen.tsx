"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { friends as friendsSeed, currentUser } from "@/lib/mock-data";
import { Suspense, useMemo, useState } from "react";
import { Search, UserPlus, Check } from "lucide-react";
import { BackButton, HomeBottomBar } from "../PhoneNav";

type Friend = { id: string; name: string; handle?: string; avatar: string };

export default function AddPeopleScreen() {
  return (
    <Suspense fallback={<div style={{ height: "100%", background: "var(--bg-base)" }} />}>
      <AddPeopleInner />
    </Suspense>
  );
}

function AddPeopleInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") === "manual" ? "manual" : "scan";
  const nextRoute = next === "manual" ? "/screen/items-detected" : "/screen/camera-scan";
  const [friends, setFriends] = useState<Friend[]>(
    friendsSeed.map((f) => ({ id: f.id, name: f.name, handle: f.handle, avatar: f.avatar }))
  );
  const [selected, setSelected] = useState<string[]>([currentUser.id]);
  const [query, setQuery] = useState("");

  const toggle = (id: string) => {
    if (id === currentUser.id) return;
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  };

  const q = query.trim().toLowerCase();
  const filteredFriends = useMemo(
    () =>
      q
        ? friends.filter(
            (f) =>
              f.name.toLowerCase().includes(q) ||
              (f.handle ?? "").toLowerCase().includes(q)
          )
        : friends,
    [friends, q]
  );

  const showAddAsFriend =
    q.length >= 2 &&
    !friends.some(
      (f) =>
        f.name.toLowerCase() === q ||
        (f.handle ?? "").toLowerCase().replace("@", "") === q.replace("@", "")
    );

  const addAsFriendAndSelect = () => {
    const cleaned = q.replace(/^@/, "").replace(/[^a-z0-9_]/g, "");
    if (!cleaned) return;
    const id = `new-${cleaned}-${Date.now()}`;
    const newFriend: Friend = {
      id,
      name: cleaned.charAt(0).toUpperCase() + cleaned.slice(1),
      handle: `@${cleaned}`,
      avatar: `https://api.dicebear.com/7.x/notionists/svg?seed=${cleaned}&backgroundColor=f59e0b`,
    };
    setFriends((prev) => [newFriend, ...prev]);
    setSelected((prev) => [...prev, id]);
    setQuery("");
  };

  return (
    <div style={{ position: "relative", height: "100%", background: "var(--bg-base)", display: "flex", flexDirection: "column" }}>
      <BackButton to="/screen/new-split" />
      <div style={{ padding: "56px 20px 12px", flexShrink: 0 }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 600, color: "var(--text)" }}>
          Who&apos;s splitting?
        </div>
        <div style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "var(--font-body)", marginTop: 4 }}>
          {selected.length} {selected.length === 1 ? "person" : "people"} added
        </div>
      </div>

      {/* Search */}
      <div style={{ padding: "0 20px 14px", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, background: "var(--bg-card)", borderRadius: 12, padding: "10px 14px", border: "1px solid var(--border)" }}>
          <Search size={16} color="var(--text-muted)" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or @handle"
            style={{ flex: 1, background: "none", border: "none", outline: "none", fontSize: 14, color: "var(--text)", fontFamily: "var(--font-body)" }}
          />
        </div>
      </div>

      {/* People */}
      <div style={{ flex: 1, overflowY: "auto", padding: "0 20px" }}>
        {!q && (
          <>
            <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 8, fontFamily: "var(--font-body)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              In this split
            </div>
            <PersonRow
              name={currentUser.name + " (you)"}
              handle={currentUser.handle}
              avatar={currentUser.avatar}
              selected
              locked
              onToggle={() => {}}
            />

            <div style={{ height: 16 }} />
          </>
        )}

        <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 8, fontFamily: "var(--font-body)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
          {q ? "Results" : "Friends"}
        </div>

        {filteredFriends.map((f) => (
          <PersonRow
            key={f.id}
            name={f.name}
            handle={f.handle}
            avatar={f.avatar}
            selected={selected.includes(f.id)}
            onToggle={() => toggle(f.id)}
          />
        ))}

        {filteredFriends.length === 0 && q && (
          <div style={{ padding: "16px 0", fontSize: 13, color: "var(--text-muted)", fontFamily: "var(--font-body)", textAlign: "center" }}>
            No matches in your friends.
          </div>
        )}

        {showAddAsFriend && (
          <button
            onClick={addAsFriendAndSelect}
            style={{
              width: "100%",
              padding: "12px 14px",
              marginTop: 8,
              borderRadius: 12,
              background: "rgba(245,158,11,0.08)",
              border: "1px solid rgba(245,158,11,0.3)",
              color: "var(--amber)",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "var(--font-body)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <UserPlus size={16} /> Add &ldquo;{query}&rdquo; as friend
          </button>
        )}
      </div>

      <div style={{ padding: "16px 20px 24px", borderTop: "1px solid var(--border)", background: "var(--bg-surface)", flexShrink: 0 }}>
        <button
          onClick={() => router.push(nextRoute)}
          disabled={selected.length < 1}
          style={{
            width: "100%",
            padding: "15px",
            borderRadius: 14,
            background: "var(--amber)",
            color: "#000",
            fontWeight: 700,
            fontSize: 15,
            border: "none",
            cursor: "pointer",
            fontFamily: "var(--font-body)",
          }}
        >
          {next === "manual" ? "Next \u2014 Enter Items" : "Next \u2014 Scan Receipt"}
        </button>
      </div>
      <HomeBottomBar hidden />
    </div>
  );
}

function PersonRow({
  name,
  handle,
  avatar,
  selected,
  locked,
  onToggle,
}: {
  name: string;
  handle?: string;
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
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={avatar} alt={name} style={{ width: 40, height: 40, borderRadius: "50%", border: "2px solid var(--border)" }} />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: "var(--text)", fontFamily: "var(--font-body)" }}>{name}</div>
        {handle && (
          <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>{handle}</div>
        )}
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
