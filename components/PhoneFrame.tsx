"use client";

import Link from "next/link";
import { getPrevScreen, getNextScreen, screens, getScreenIndex } from "@/lib/screens";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PhoneFrameProps {
  slug: string;
  children: React.ReactNode;
}

export default function PhoneFrame({ slug, children }: PhoneFrameProps) {
  const prev = getPrevScreen(slug);
  const next = getNextScreen(slug);
  const idx = getScreenIndex(slug);
  const screen = screens[idx];

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 32px",
        background:
          "radial-gradient(ellipse at center, rgba(245,158,11,0.04) 0%, transparent 70%)",
        minHeight: "100vh",
        position: "relative",
      }}
    >
      {/* Screen label */}
      <div style={{ marginBottom: 16, textAlign: "center" }}>
        <div
          style={{
            fontSize: 11,
            color: "var(--text-muted)",
            fontFamily: "var(--font-body)",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          {screen?.group} · {screen?.title}
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        {/* Prev arrow */}
        <NavArrow href={prev ? `/screen/${prev.slug}` : null} direction="left" label={prev?.title} />

        {/* iPhone 15 Pro frame */}
        <div
          style={{
            width: 393,
            height: 852,
            background: "#000",
            borderRadius: 55,
            position: "relative",
            boxShadow:
              "0 0 0 2px #1a1a1a, 0 0 0 4px #333, 0 40px 80px rgba(0,0,0,0.8), 0 0 60px rgba(245,158,11,0.08)",
            overflow: "hidden",
            flexShrink: 0,
          }}
        >
          {/* Side buttons */}
          <div style={{ position: "absolute", left: -3, top: 120, width: 3, height: 32, background: "#2a2a2a", borderRadius: "2px 0 0 2px" }} />
          <div style={{ position: "absolute", left: -3, top: 170, width: 3, height: 56, background: "#2a2a2a", borderRadius: "2px 0 0 2px" }} />
          <div style={{ position: "absolute", left: -3, top: 238, width: 3, height: 56, background: "#2a2a2a", borderRadius: "2px 0 0 2px" }} />
          <div style={{ position: "absolute", right: -3, top: 170, width: 3, height: 72, background: "#2a2a2a", borderRadius: "0 2px 2px 0" }} />

          {/* Screen area */}
          <div
            style={{
              position: "absolute",
              inset: 6,
              borderRadius: 50,
              overflow: "hidden",
              background: "var(--bg-base)",
            }}
          >
            {/* Status bar */}
            <div
              style={{
                height: 50,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 28px",
                background: "rgba(8,6,3,0.9)",
                backdropFilter: "blur(10px)",
                position: "relative",
                zIndex: 10,
                flexShrink: 0,
              }}
            >
              <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text)", fontFamily: "var(--font-body)" }}>
                9:41
              </span>
              {/* Dynamic island */}
              <div
                style={{
                  position: "absolute",
                  top: 12,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 120,
                  height: 34,
                  background: "#000",
                  borderRadius: 20,
                }}
              />
              <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
                <svg width="14" height="10" viewBox="0 0 14 10" fill="var(--text)">
                  <rect x="0" y="4" width="2" height="6" rx="1" opacity="0.4"/>
                  <rect x="3" y="2.5" width="2" height="7.5" rx="1" opacity="0.6"/>
                  <rect x="6" y="1" width="2" height="9" rx="1" opacity="0.8"/>
                  <rect x="9" y="0" width="2" height="10" rx="1"/>
                </svg>
                <svg width="15" height="11" viewBox="0 0 15 11" fill="var(--text)" opacity="0.8">
                  <path d="M7.5 2.5C9.8 2.5 11.8 3.4 13.2 4.9L14.5 3.6C12.7 1.8 10.2 0.7 7.5 0.7S2.3 1.8 0.5 3.6L1.8 4.9C3.2 3.4 5.2 2.5 7.5 2.5Z"/>
                  <path d="M7.5 5.5C8.9 5.5 10.2 6 11.2 6.9L12.5 5.6C11.1 4.3 9.4 3.5 7.5 3.5S3.9 4.3 2.5 5.6L3.8 6.9C4.8 6 6.1 5.5 7.5 5.5Z"/>
                  <circle cx="7.5" cy="9.5" r="1.5"/>
                </svg>
                <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <div style={{ width: 22, height: 11, border: "1.5px solid rgba(255,255,255,0.5)", borderRadius: 3, padding: "1px 2px", display: "flex", alignItems: "center" }}>
                    <div style={{ width: "80%", height: "100%", background: "var(--text)", borderRadius: 1.5 }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Screen content */}
            <div
              className="phone-screen"
              style={{
                height: "calc(100% - 50px)",
                position: "relative",
              }}
            >
              {children}
            </div>
          </div>
        </div>

        {/* Next arrow */}
        <NavArrow href={next ? `/screen/${next.slug}` : null} direction="right" label={next?.title} />
      </div>

      {/* Bottom hint */}
      <div style={{ marginTop: 20, fontSize: 11, color: "var(--text-muted)", textAlign: "center", fontFamily: "var(--font-body)" }}>
        Use ← → arrow keys or click arrows to navigate · All {screens.length} screens
      </div>
    </div>
  );
}

function NavArrow({ href, direction, label }: { href: string | null; direction: "left" | "right"; label?: string }) {
  if (!href) {
    return <div style={{ width: 44 }} />;
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      <Link
        href={href}
        style={{
          width: 44,
          height: 44,
          borderRadius: "50%",
          background: "var(--bg-raised)",
          border: "1px solid var(--border-bright)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textDecoration: "none",
          color: "var(--text-secondary)",
          transition: "all 0.15s",
        }}
        onMouseOver={(e) => {
          (e.currentTarget as HTMLElement).style.background = "var(--bg-card)";
          (e.currentTarget as HTMLElement).style.color = "var(--amber)";
          (e.currentTarget as HTMLElement).style.borderColor = "var(--amber-dim)";
        }}
        onMouseOut={(e) => {
          (e.currentTarget as HTMLElement).style.background = "var(--bg-raised)";
          (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)";
          (e.currentTarget as HTMLElement).style.borderColor = "var(--border-bright)";
        }}
      >
        {direction === "left" ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
      </Link>
      {label && (
        <div style={{ fontSize: 9, color: "var(--text-muted)", maxWidth: 60, textAlign: "center", lineHeight: 1.3, fontFamily: "var(--font-body)" }}>
          {label}
        </div>
      )}
    </div>
  );
}
