"use client";

import Link from "next/link";
import { getPrevScreen, getNextScreen, screens, getScreenIndex } from "@/lib/screens";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ScreenContent from "./ScreenContent";

interface PhoneFrameProps {
  slug: string;
  children?: React.ReactNode;
}

export default function PhoneFrame({ slug, children }: PhoneFrameProps) {
  const prev = getPrevScreen(slug);
  const next = getNextScreen(slug);
  const idx = getScreenIndex(slug);
  const screen = screens[idx];

  return (
    <div className="stp-frame-wrap">
      {/* Screen label */}
      <div style={{ marginBottom: 12, textAlign: "center", padding: "0 12px" }}>
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

      <div className="stp-frame-row">
        {/* Prev arrow (side, desktop) */}
        <div className="stp-side-arrow">
          <NavArrow href={prev ? `/screen/${prev.slug}` : null} direction="left" label={prev?.title} />
        </div>

        {/* Phone */}
        <div className="stp-phone">
          {/* Side buttons */}
          <div className="stp-btn" style={{ left: -3, top: 120, height: 32 }} />
          <div className="stp-btn" style={{ left: -3, top: 170, height: 56 }} />
          <div className="stp-btn" style={{ left: -3, top: 238, height: 56 }} />
          <div className="stp-btn stp-btn-r" style={{ right: -3, top: 170, height: 72 }} />

          {/* Inner screen */}
          <div className="stp-inner">
            {/* Status bar */}
            <div className="stp-statusbar">
              <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text)", fontFamily: "var(--font-body)" }}>
                9:41
              </span>
              {/* Dynamic island */}
              <div className="stp-island" />
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
                  <div style={{ width: 22, height: 11, border: "1.5px solid rgba(30,27,23,0.4)", borderRadius: 3, padding: "1px 2px", display: "flex", alignItems: "center" }}>
                    <div style={{ width: "80%", height: "100%", background: "var(--text)", borderRadius: 1.5 }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Screen content */}
            <div className="phone-screen" style={{ height: "calc(100% - 50px)", position: "relative" }}>
              {children ?? <ScreenContent slug={slug} />}
            </div>
          </div>
        </div>

        {/* Next arrow (side, desktop) */}
        <div className="stp-side-arrow">
          <NavArrow href={next ? `/screen/${next.slug}` : null} direction="right" label={next?.title} />
        </div>
      </div>

      {/* Bottom arrows (mobile) */}
      <div className="stp-bottom-arrows">
        <NavArrow href={prev ? `/screen/${prev.slug}` : null} direction="left" label={prev?.title} />
        <div style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
          {idx + 1} / {screens.length}
        </div>
        <NavArrow href={next ? `/screen/${next.slug}` : null} direction="right" label={next?.title} />
      </div>

      {/* Bottom hint */}
      <div className="stp-hint">
        Use ← → arrow keys or tap arrows to navigate · All {screens.length} screens
      </div>

      <style>{`
        .stp-frame-wrap {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 24px 24px 32px;
          background: radial-gradient(ellipse at center, rgba(255,107,53,0.06) 0%, transparent 70%);
          min-height: 100%;
          position: relative;
        }
        .stp-frame-row {
          display: flex;
          align-items: center;
          gap: 24px;
          max-width: 100%;
        }
        .stp-phone {
          width: 393px;
          height: 852px;
          background: #1a1510;
          border-radius: 55px;
          position: relative;
          box-shadow:
            0 0 0 2px #2a2018,
            0 0 0 4px #3d3020,
            0 40px 80px rgba(30,27,23,0.35),
            0 0 60px rgba(255,107,53,0.12);
          overflow: hidden;
          flex-shrink: 0;
          /* Scale down on narrow viewports */
          transform-origin: top center;
        }
        .stp-btn {
          position: absolute;
          width: 3px;
          background: #2a2018;
          border-radius: 2px 0 0 2px;
        }
        .stp-btn-r {
          border-radius: 0 2px 2px 0;
        }
        .stp-inner {
          position: absolute;
          inset: 6px;
          border-radius: 50px;
          overflow: hidden;
          background: var(--bg-base);
        }
        .stp-statusbar {
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 28px;
          background: rgba(255,248,241,0.85);
          backdrop-filter: blur(10px);
          position: relative;
          z-index: 10;
          flex-shrink: 0;
        }
        .stp-island {
          position: absolute;
          top: 12px;
          left: 50%;
          transform: translateX(-50%);
          width: 120px;
          height: 34px;
          background: #1a1510;
          border-radius: 20px;
        }
        .stp-bottom-arrows {
          display: none;
          margin-top: 16px;
          align-items: center;
          gap: 24px;
        }
        .stp-hint {
          margin-top: 16px;
          font-size: 11px;
          color: var(--text-muted);
          text-align: center;
          font-family: var(--font-body);
          padding: 0 12px;
        }

        /* Tablet: phone shrinks a bit */
        @media (max-width: 1180px) {
          .stp-frame-row { gap: 16px; }
        }

        /* Mobile: hide side arrows, scale phone to viewport, show bottom arrows */
        @media (max-width: 900px) {
          .stp-side-arrow { display: none; }
          .stp-frame-wrap { padding: 12px 8px 24px; }
          .stp-frame-row { gap: 0; }
          .stp-phone {
            /* Fluid scale via calc: viewport-width based */
            transform: scale(var(--phone-scale, 0.7));
            margin-bottom: calc(-1 * 852px * (1 - var(--phone-scale, 0.7)));
          }
          .stp-bottom-arrows { display: flex; }
        }
        @media (max-width: 600px) {
          .stp-phone { --phone-scale: 0.86; }
        }
        @media (max-width: 500px) {
          .stp-phone { --phone-scale: 0.76; }
        }
        @media (max-width: 430px) {
          .stp-phone { --phone-scale: 0.68; }
        }
        @media (max-width: 380px) {
          .stp-phone { --phone-scale: 0.6; }
        }
        @media (min-width: 601px) and (max-width: 900px) {
          .stp-phone { --phone-scale: 0.9; }
        }
      `}</style>
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
      >
        {direction === "left" ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
      </Link>
      {label && (
        <div style={{ fontSize: 9, color: "var(--text-muted)", maxWidth: 70, textAlign: "center", lineHeight: 1.3, fontFamily: "var(--font-body)" }}>
          {label}
        </div>
      )}
    </div>
  );
}
