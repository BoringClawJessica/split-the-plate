"use client";

import { useRouter } from "next/navigation";
import { Apple, Phone, Utensils } from "lucide-react";

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
          Going dutch, in style.
        </div>
      </div>

      {/* Hero */}
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 20,
        marginBottom: 32,
      }}>
        <div style={{
          width: 96,
          height: 96,
          borderRadius: 28,
          background: "linear-gradient(135deg, var(--amber), var(--orange))",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 16px 40px rgba(245,158,11,0.3)",
        }}>
          <Utensils size={44} color="#000" strokeWidth={1.6} />
        </div>
        <div style={{
          fontFamily: "var(--font-display)",
          fontSize: 24,
          fontWeight: 400,
          color: "var(--text)",
          textAlign: "center",
          lineHeight: 1.3,
          fontStyle: "italic",
        }}>
          &ldquo;Who had the steak?&rdquo;
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
          icon={<Apple size={18} />}
          label="Continue with Apple"
          style={{ background: "var(--text)", color: "#000" }}
        />
        <AuthButton
          onClick={() => go("/screen/profile-setup")}
          icon={<GoogleG />}
          label="Continue with Google"
          style={{ background: "var(--bg-card)", color: "var(--text)", border: "1px solid var(--border-bright)" }}
        />
        <AuthButton
          onClick={() => go("/screen/profile-setup")}
          icon={<Phone size={18} />}
          label="Continue with Phone"
          style={{ background: "transparent", color: "var(--text)", border: "1px solid var(--border-bright)" }}
        />
      </div>

      <div style={{ marginTop: 20, textAlign: "center", fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-body)", lineHeight: 1.6 }}>
        By continuing, you agree to our Terms &amp; Privacy Policy
      </div>
    </div>
  );
}

function GoogleG() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.44c-.28 1.49-1.12 2.75-2.39 3.6v2.99h3.86c2.26-2.08 3.58-5.15 3.58-8.83z"/>
      <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.94-2.9l-3.86-2.99c-1.07.72-2.44 1.15-4.08 1.15-3.14 0-5.79-2.12-6.74-4.97H1.28v3.11C3.25 21.3 7.31 24 12 24z"/>
      <path fill="#FBBC05" d="M5.26 14.29c-.24-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.6H1.28C.46 8.24 0 10.06 0 12s.46 3.76 1.28 5.4l3.98-3.11z"/>
      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.7 1.28 6.6l3.98 3.11C6.21 6.87 8.86 4.75 12 4.75z"/>
    </svg>
  );
}

function AuthButton({ onClick, icon, label, style }: {
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  style?: React.CSSProperties;
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
      <span style={{ display: "inline-flex", alignItems: "center" }}>{icon}</span>
      {label}
    </button>
  );
}
