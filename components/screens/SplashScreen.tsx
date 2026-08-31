"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SplashScreen() {
  const router = useRouter();
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 400);
    const t2 = setTimeout(() => setPhase(2), 900);
    const t3 = setTimeout(() => setPhase(3), 1400);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  return (
    <div
      onClick={() => router.push("/screen/signin")}
      style={{
        height: "100%",
        background: "linear-gradient(160deg, #0d0900 0%, #1a0f00 50%, #0d0900 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient glow */}
      <div style={{
        position: "absolute",
        width: 300,
        height: 300,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(245,158,11,0.15) 0%, transparent 70%)",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        animation: "pulse-ring 2s ease-out infinite",
      }} />

      {/* Logo */}
      <div style={{
        textAlign: "center",
        opacity: phase >= 1 ? 1 : 0,
        transform: phase >= 1 ? "translateY(0)" : "translateY(20px)",
        transition: "all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
      }}>
        {/* Split word with jagged cut effect */}
        <div style={{ position: "relative", display: "inline-block", marginBottom: 4 }}>
          <div style={{
            fontFamily: "var(--font-display)",
            fontSize: 56,
            fontWeight: 700,
            color: "var(--amber)",
            letterSpacing: "-0.04em",
            lineHeight: 1,
            position: "relative",
          }}>
            {/* Top half */}
            <div style={{
              overflow: "hidden",
              height: 34,
              clipPath: "polygon(0 0, 100% 0, 100% 45%, 60% 55%, 40% 45%, 0 55%)",
              opacity: phase >= 2 ? 1 : 0,
              transform: phase >= 2 ? "translateY(0)" : "translateY(-10px)",
              transition: "all 0.4s ease 0.2s",
            }}>
              SPLIT
            </div>
            {/* Bottom half */}
            <div style={{
              overflow: "hidden",
              height: 34,
              clipPath: "polygon(0 45%, 40% 55%, 60% 45%, 100% 55%, 100% 100%, 0 100%)",
              marginTop: -8,
              opacity: phase >= 2 ? 1 : 0,
              transform: phase >= 2 ? "translateY(0)" : "translateY(10px)",
              transition: "all 0.4s ease 0.3s",
            }}>
              SPLIT
            </div>
            {/* Jagged cut line */}
            <div style={{
              position: "absolute",
              top: "50%",
              left: 0,
              right: 0,
              height: 2,
              background: "var(--bg-base)",
              transform: "skewY(-2deg)",
            }} />
          </div>
        </div>

        <div style={{
          fontFamily: "var(--font-display)",
          fontSize: 18,
          fontWeight: 300,
          color: "var(--text-secondary)",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          opacity: phase >= 2 ? 1 : 0,
          transition: "opacity 0.6s ease 0.4s",
        }}>
          THE PLATE
        </div>
      </div>

      {/* Tagline */}
      <div style={{
        marginTop: 32,
        fontSize: 14,
        color: "var(--text-muted)",
        fontFamily: "var(--font-body)",
        opacity: phase >= 3 ? 1 : 0,
        transition: "opacity 0.6s ease",
      }}>
        dinner's better when nobody fights over the check
      </div>

      {/* Dots */}
      <div style={{
        position: "absolute",
        bottom: 60,
        display: "flex",
        gap: 6,
        opacity: phase >= 3 ? 1 : 0,
        transition: "opacity 0.6s ease",
      }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: i === 0 ? "var(--amber)" : "var(--border-bright)",
          }} />
        ))}
      </div>

      <div style={{
        position: "absolute",
        bottom: 30,
        fontSize: 11,
        color: "var(--text-muted)",
        fontFamily: "var(--font-body)",
        opacity: phase >= 3 ? 0.6 : 0,
        transition: "opacity 0.6s ease",
      }}>
        tap to continue
      </div>
    </div>
  );
}
