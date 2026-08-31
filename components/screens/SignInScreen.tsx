"use client";

import { useRouter } from "next/navigation";

export default function SignInScreen() {
  const router = useRouter();
  const go = (path: string) => router.push(path);

  return (
    <div style={{
      height: "100%",
      background: "linear-gradient(180deg, #0d0900 0%, var(--bg-base) 100%)",
      display: "flex",
      flexDirection: "column",
      padding: "40px 28px 40px",
    }}>
      {/* Logo */}
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <div style={{
          fontFamily: "var(--font-display)",
          fontSize: 28,
          fontWeight: 600,
          color: "var(--amber)",
          letterSpacing: "-0.03em",
        }}>
          Split the Plate
        </div>
        <div style={{ marginTop: 8, fontSize: 14, color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}>
          Join 40,000+ diners going dutch in style
        </div>
      </div>

      {/* Illustration / hero text */}
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        marginBottom: 32,
      }}>
        <div style={{ fontSize: 64 }}>🍽️</div>
        <div style={{
          fontFamily: "var(--font-display)",
          fontSize: 24,
          fontWeight: 400,
          color: "var(--text)",
          textAlign: "center",
          lineHeight: 1.3,
          fontStyle: "italic",
        }}>
          "Who had the steak?"
          <br />
          <span style={{ color: "var(--amber)", fontStyle: "normal", fontWeight: 600, fontSize: 20 }}>
            Never again.
          </span>
        </div>
      </div>

      {/* Auth buttons */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <AuthButton
          onClick={() => go("/screen/profile-setup")}
          icon="🍎"
          label="Continue with Apple"
          style={{ background: "var(--text)", color: "#000" }}
        />
        <AuthButton
          onClick={() => go("/screen/profile-setup")}
          icon="G"
          label="Continue with Google"
          style={{ background: "var(--bg-card)", color: "var(--text)", border: "1px solid var(--border-bright)" }}
          iconStyle={{ fontWeight: 700, fontSize: 16, color: "#4285F4" }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "4px 0" }}>
          <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
          <span style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>or</span>
          <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
        </div>
        <AuthButton
          onClick={() => go("/screen/profile-setup")}
          icon="📱"
          label="Continue with Phone"
          style={{ background: "transparent", color: "var(--text)", border: "1px solid var(--border-bright)" }}
        />
      </div>

      <div style={{ marginTop: 20, textAlign: "center", fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-body)", lineHeight: 1.6 }}>
        By continuing, you agree to our Terms & Privacy Policy
      </div>
    </div>
  );
}

function AuthButton({ onClick, icon, label, style, iconStyle }: {
  onClick: () => void;
  icon: string;
  label: string;
  style?: React.CSSProperties;
  iconStyle?: React.CSSProperties;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        padding: "14px 20px",
        borderRadius: 14,
        border: "none",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        fontSize: 15,
        fontWeight: 500,
        fontFamily: "var(--font-body)",
        transition: "transform 0.1s",
        ...style,
      }}
    >
      <span style={{ fontSize: 18, ...iconStyle }}>{icon}</span>
      {label}
    </button>
  );
}
