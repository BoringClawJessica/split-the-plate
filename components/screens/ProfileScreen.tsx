"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { currentUser, paymentMethods } from "@/lib/mock-data";
import {
  Settings,
  User,
  Wallet,
  Smartphone,
  DollarSign,
  Banknote,
  X,
  Camera,
} from "lucide-react";
import { BackButton, HomeBottomBar } from "../PhoneNav";

// Which methods this user has accepted (mock)
const ACCEPTED_METHODS = ["applepay", "cashapp", "venmo"];

const iconFor = (id: string) => {
  switch (id) {
    case "applepay": return <Smartphone size={13} />;
    case "cashapp": return <DollarSign size={13} />;
    case "venmo": return <Wallet size={13} />;
    case "zelle": return <Wallet size={13} />;
    case "paypal": return <Wallet size={13} />;
    case "cash": return <Banknote size={13} />;
    default: return <Wallet size={13} />;
  }
};

// Mock totals
const TOTAL_SPEND = 1786;
const TOTAL_MEALS = currentUser.stats.meals;
const AVG_SPEND = currentUser.stats.avgSpend;

export default function ProfileScreen() {
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [name, setName] = useState(currentUser.name);
  const [handle, setHandle] = useState(currentUser.handle);

  return (
    <div style={{ position: "relative", height: "100%", background: "var(--bg-base)", display: "flex", flexDirection: "column" }}>
      <BackButton to="/screen/home" />

      {/* Settings shortcut */}
      <div style={{ padding: "14px 20px 0", display: "flex", justifyContent: "flex-end", flexShrink: 0 }}>
        <button
          onClick={() => router.push("/screen/settings")}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--text-secondary)",
            display: "flex",
            gap: 8,
            alignItems: "center",
            fontSize: 13,
            fontFamily: "var(--font-body)",
          }}
        >
          <Settings size={18} /> Settings
        </button>
      </div>

      {/* Profile header — tap avatar to edit */}
      <div style={{ padding: "0 20px 10px", flexShrink: 0, textAlign: "center" }}>
        <button
          onClick={() => setEditOpen(true)}
          aria-label="Edit profile"
          style={{
            position: "relative",
            display: "inline-block",
            marginBottom: 8,
            background: "none",
            border: "none",
            padding: 0,
            cursor: "pointer",
          }}
        >
          <div style={{
            width: 84,
            height: 84,
            borderRadius: "50%",
            background: "linear-gradient(135deg, var(--amber), var(--orange))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "4px solid var(--amber)",
            boxShadow: "0 0 24px rgba(245,158,11,0.3)",
          }}>
            <User size={38} color="#000" strokeWidth={1.6} />
          </div>
          <div style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            width: 24,
            height: 24,
            borderRadius: "50%",
            background: "var(--bg-card)",
            border: "2px solid var(--border-bright)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--text)",
          }}>
            <Camera size={11} />
          </div>
        </button>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 600, color: "var(--text)", marginTop: 2 }}>{name}</div>
        <div style={{ fontSize: 13, color: "var(--text-muted)", fontFamily: "var(--font-body)", marginTop: 2 }}>{handle}</div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "0 20px 96px" }}>
        {/* Meals + Friends (Instagram-style tight row) */}
        <div style={{
          display: "flex",
          gap: 0,
          marginBottom: 14,
          padding: "12px 0",
          borderTop: "1px solid var(--border)",
          borderBottom: "1px solid var(--border)",
        }}>
          <IgStat value={currentUser.stats.meals} label="Meals" />
          <div style={{ width: 1, background: "var(--border)" }} />
          <IgStat value={currentUser.stats.friends} label="Friends" />
        </div>

        {/* Payment methods accepted */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-body)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>Payment Methods Accepted</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {paymentMethods
              .filter((pm) => ACCEPTED_METHODS.includes(pm.id))
              .map((pm) => (
                <div key={pm.id} style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "6px 10px",
                  borderRadius: 999,
                  background: "var(--bg-card)",
                  border: `1px solid ${pm.color}55`,
                  color: "var(--text)",
                  fontSize: 12,
                  fontFamily: "var(--font-body)",
                  fontWeight: 500,
                }}>
                  <span style={{
                    width: 18,
                    height: 18,
                    borderRadius: 999,
                    background: pm.color,
                    color: "#fff",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}>
                    {iconFor(pm.id)}
                  </span>
                  {pm.name}
                </div>
              ))}
          </div>
        </div>

        {/* Stats section — visible on your own profile */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-body)", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Stats
          </div>
          <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-body)", marginBottom: 8 }}>
            Only visible to others if you toggle them on in Privacy.
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <StatRow label="Average meal spend" value={`$${AVG_SPEND}`} />
            <StatRow label="Total spend (all-time)" value={`$${TOTAL_SPEND}`} />
            <StatRow label="Total meals" value={TOTAL_MEALS.toString()} />
          </div>
        </div>
      </div>

      {editOpen && (
        <EditProfileSheet
          initialName={name}
          initialHandle={handle}
          onClose={() => setEditOpen(false)}
          onSave={(n, h) => {
            setName(n);
            setHandle(h);
            setEditOpen(false);
          }}
        />
      )}

      <HomeBottomBar />
    </div>
  );
}

function IgStat({ value, label }: { value: number | string; label: string }) {
  return (
    <div style={{
      flex: 1,
      textAlign: "center",
      padding: "2px 8px",
    }}>
      <div style={{ fontSize: 20, fontWeight: 700, color: "var(--text)", fontFamily: "var(--font-body)" }}>{value}</div>
      <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-body)", marginTop: 2 }}>{label}</div>
    </div>
  );
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "10px 14px",
      borderRadius: 12,
      background: "var(--bg-card)",
      border: "1px solid var(--border)",
    }}>
      <div style={{ fontSize: 13, color: "var(--text)", fontFamily: "var(--font-body)" }}>{label}</div>
      <div style={{ fontSize: 15, fontWeight: 700, color: "var(--amber)", fontFamily: "var(--font-body)" }}>{value}</div>
    </div>
  );
}

function EditProfileSheet({
  initialName,
  initialHandle,
  onClose,
  onSave,
}: {
  initialName: string;
  initialHandle: string;
  onClose: () => void;
  onSave: (name: string, handle: string) => void;
}) {
  const [name, setName] = useState(initialName);
  const [handle, setHandle] = useState(initialHandle);
  const canSave = name.trim().length > 0 && handle.trim().length > 0;

  return (
    <div
      onClick={onClose}
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
            Edit profile
          </div>
          <button
            onClick={onClose}
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

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <div style={{
            width: 78,
            height: 78,
            borderRadius: "50%",
            background: "linear-gradient(135deg, var(--amber), var(--orange))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "3px solid var(--amber)",
          }}>
            <User size={36} color="#000" strokeWidth={1.6} />
          </div>
          <button style={{
            padding: "6px 12px",
            fontSize: 11,
            fontFamily: "var(--font-body)",
            color: "var(--amber)",
            background: "transparent",
            border: "1px solid var(--amber)",
            borderRadius: 999,
            cursor: "pointer",
          }}>
            Change photo
          </button>
        </div>

        <div>
          <label style={{ display: "block", fontSize: 11, color: "var(--text-muted)", marginBottom: 6, fontFamily: "var(--font-body)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Name
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div>
          <label style={{ display: "block", fontSize: 11, color: "var(--text-muted)", marginBottom: 6, fontFamily: "var(--font-body)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Handle
          </label>
          <input
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
            style={inputStyle}
          />
        </div>

        <button
          disabled={!canSave}
          onClick={() => canSave && onSave(name.trim(), handle.trim())}
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: 12,
            background: canSave ? "var(--amber)" : "var(--bg-card)",
            color: canSave ? "#000" : "var(--text-muted)",
            fontWeight: 700,
            fontSize: 14,
            border: "none",
            cursor: canSave ? "pointer" : "not-allowed",
            fontFamily: "var(--font-body)",
          }}
        >
          Save
        </button>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: 10,
  background: "var(--bg-card)",
  border: "1px solid var(--border-bright)",
  color: "var(--text)",
  fontSize: 15,
  fontFamily: "var(--font-body)",
  outline: "none",
};
