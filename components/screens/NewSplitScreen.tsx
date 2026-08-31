"use client";

import { useRouter } from "next/navigation";
import { Camera, PenLine, Plus } from "lucide-react";

export default function NewSplitScreen() {
  const router = useRouter();

  return (
    <div style={{ height: "100%", background: "var(--bg-base)", display: "flex", flexDirection: "column", padding: "28px 20px" }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 600, color: "var(--text)" }}>
          New Split
        </div>
        <div style={{ fontSize: 13, color: "var(--text-secondary)", fontFamily: "var(--font-body)", marginTop: 4 }}>
          How do you want to add the bill?
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14, flex: 1 }}>
        <SplitOption
          emoji="📷"
          title="Scan Receipt"
          desc="Point camera at your bill — we detect items automatically"
          accent="var(--amber)"
          onClick={() => router.push("/screen/camera-scan")}
          primary
        />
        <SplitOption
          emoji="✏️"
          title="Manual Entry"
          desc="Type in items and prices yourself"
          accent="var(--orange)"
          onClick={() => router.push("/screen/items-detected")}
        />
        <SplitOption
          emoji="➕"
          title="Add to Existing Split"
          desc="Attach more items to a split already in progress"
          accent="#0891b2"
          onClick={() => router.push("/screen/review-confirm")}
        />
      </div>

      {/* Recent restaurants */}
      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 10, fontFamily: "var(--font-body)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
          Recent restaurants
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {["Fuego & Sol 🌮", "Sushi Roku 🍣", "Brunch Bar 🥞"].map((r) => (
            <button
              key={r}
              onClick={() => router.push("/screen/camera-scan")}
              style={{
                padding: "8px 12px",
                borderRadius: 10,
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                color: "var(--text-secondary)",
                fontSize: 12,
                cursor: "pointer",
                fontFamily: "var(--font-body)",
              }}
            >
              {r}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function SplitOption({ emoji, title, desc, accent, onClick, primary }: {
  emoji: string;
  title: string;
  desc: string;
  accent: string;
  onClick: () => void;
  primary?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "20px",
        borderRadius: 18,
        background: primary ? `linear-gradient(135deg, ${accent}22, ${accent}11)` : "var(--bg-card)",
        border: `1px solid ${primary ? accent + "44" : "var(--border)"}`,
        cursor: "pointer",
        textAlign: "left",
        display: "flex",
        alignItems: "center",
        gap: 16,
        transition: "transform 0.15s",
      }}
    >
      <div style={{
        width: 52,
        height: 52,
        borderRadius: 14,
        background: primary ? accent : "var(--bg-raised)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 24,
        flexShrink: 0,
      }}>
        {emoji}
      </div>
      <div>
        <div style={{ fontFamily: "var(--font-body)", fontSize: 15, fontWeight: 600, color: primary ? accent : "var(--text)", marginBottom: 3 }}>
          {title}
        </div>
        <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--text-muted)", lineHeight: 1.4 }}>
          {desc}
        </div>
      </div>
    </button>
  );
}
