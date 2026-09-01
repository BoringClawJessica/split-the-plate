"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Camera, PenLine, X } from "lucide-react";
import { BackButton, HomeBottomBar } from "../PhoneNav";

export default function NewSplitScreen() {
  const router = useRouter();
  const [manualOpen, setManualOpen] = useState(false);

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
          desc="Point camera at your bill — we detect items automatically"
          accent="var(--amber)"
          onClick={() => router.push("/screen/camera-scan")}
          primary
        />
        <SplitOption
          icon={<PenLine size={24} strokeWidth={1.8} color="var(--text)" />}
          title="Manual Entry"
          desc="Type in items and prices yourself"
          accent="var(--orange)"
          onClick={() => setManualOpen(true)}
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

      {manualOpen && (
        <ManualRestaurantSheet
          onCancel={() => setManualOpen(false)}
          onContinue={() => {
            setManualOpen(false);
            router.push("/screen/items-detected");
          }}
        />
      )}

      <HomeBottomBar />
    </div>
  );
}

function ManualRestaurantSheet({
  onCancel,
  onContinue,
}: {
  onCancel: () => void;
  onContinue: (name: string) => void;
}) {
  const [name, setName] = useState("");
  const canContinue = name.trim().length > 0;

  return (
    <div
      onClick={onCancel}
      style={{
        position: "absolute",
        inset: 0,
        background: "rgba(0,0,0,0.55)",
        zIndex: 30,
        display: "flex",
        alignItems: "flex-end",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          background: "var(--bg-surface)",
          borderTopLeftRadius: 22,
          borderTopRightRadius: 22,
          borderTop: "1px solid var(--border-bright)",
          padding: "18px 20px 22px",
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 600, color: "var(--text)" }}>
            What restaurant?
          </div>
          <button
            onClick={onCancel}
            aria-label="Close"
            style={{
              width: 30,
              height: 30,
              borderRadius: 999,
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              color: "var(--text)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <X size={14} />
          </button>
        </div>
        <div style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
          We&apos;ll attach this to your split so it shows up in Recent Meals.
        </div>

        <div>
          <label style={{ display: "block", fontSize: 11, color: "var(--text-muted)", marginBottom: 6, fontFamily: "var(--font-body)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Restaurant name
          </label>
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Fuego & Sol Mexican"
            style={{
              width: "100%",
              padding: "12px 14px",
              borderRadius: 10,
              background: "var(--bg-card)",
              border: "1px solid var(--border-bright)",
              color: "var(--text)",
              fontSize: 15,
              fontFamily: "var(--font-body)",
              outline: "none",
            }}
          />
        </div>

        <button
          disabled={!canContinue}
          onClick={() => canContinue && onContinue(name.trim())}
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: 12,
            background: canContinue ? "var(--amber)" : "var(--bg-card)",
            color: canContinue ? "#000" : "var(--text-muted)",
            fontWeight: 700,
            fontSize: 14,
            border: "none",
            cursor: canContinue ? "pointer" : "not-allowed",
            fontFamily: "var(--font-body)",
          }}
        >
          Continue
        </button>
      </div>
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
