"use client";

import { useRouter } from "next/navigation";
import { Camera, PenLine } from "lucide-react";
import { BackButton, HomeBottomBar } from "../PhoneNav";

export default function NewSplitScreen() {
  const router = useRouter();

  return (
    <div style={{ position: "relative", height: "100%", background: "var(--bg-base)", display: "flex", flexDirection: "column", padding: "56px 20px 96px" }}>
      <BackButton to="/screen/home" />
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
          icon={<Camera size={26} strokeWidth={1.8} color="#000" />}
          title="Scan Receipt"
          desc="Add people first, then scan the bill to detect items"
          accent="var(--amber)"
          onClick={() => router.push("/screen/add-people?next=scan")}
          primary
        />
        <SplitOption
          icon={<PenLine size={24} strokeWidth={1.8} color="var(--text)" />}
          title="Manual Entry"
          desc="Add people first, then type in items yourself"
          accent="var(--orange)"
          onClick={() => router.push("/screen/add-people?next=manual")}
        />
      </div>

      {/* Recent restaurants */}
      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 10, fontFamily: "var(--font-body)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
          Recent restaurants
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {["Fuego & Sol", "Sushi Roku", "Brunch Bar"].map((r) => (
            <button
              key={r}
              onClick={() => router.push("/screen/add-people?next=scan")}
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

      <HomeBottomBar />
    </div>
  );
}

function SplitOption({ icon, title, desc, accent, onClick, primary }: {
  icon: React.ReactNode;
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
        flexShrink: 0,
      }}>
        {icon}
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
