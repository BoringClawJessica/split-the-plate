"use client";

import Sidebar from "./Sidebar";
import PhoneFrame from "./PhoneFrame";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getPrevScreen, getNextScreen } from "@/lib/screens";
import ScreenContent from "./ScreenContent";
import { Menu, X } from "lucide-react";

export default function ScreenLayout({ slug }: { slug: string }) {
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Ignore when typing in inputs
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      if (e.key === "ArrowLeft") {
        const prev = getPrevScreen(slug);
        if (prev) router.push(`/screen/${prev.slug}`);
      }
      if (e.key === "ArrowRight") {
        const next = getNextScreen(slug);
        if (next) router.push(`/screen/${next.slug}`);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [slug, router]);

  // Close drawer on route change
  useEffect(() => {
    setDrawerOpen(false);
  }, [slug]);

  return (
    <>
      <div className="stp-shell">
        {/* Desktop-fixed sidebar */}
        <aside className="stp-sidebar-desktop">
          <Sidebar currentSlug={slug} onNavigate={() => setDrawerOpen(false)} />
        </aside>

        {/* Main phone area */}
        <main className="stp-main">
          {/* Mobile top bar */}
          <div className="stp-mobile-topbar">
            <button
              className="stp-menu-btn"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open screen menu"
            >
              <Menu size={20} />
              <span>Screens</span>
            </button>
            <div className="stp-mobile-title">
              <span className="stp-mobile-brand">
                <span style={{ color: "var(--amber)", fontWeight: 700 }}>SPLIT</span> THE PLATE
              </span>
            </div>
            <div style={{ width: 44 }} />
          </div>

          <PhoneFrame slug={slug} />
        </main>

        {/* Mobile drawer + backdrop */}
        {drawerOpen && (
          <>
            <div
              className="stp-backdrop"
              onClick={() => setDrawerOpen(false)}
              aria-hidden
            />
            <aside className="stp-sidebar-drawer" role="dialog" aria-label="Screen menu">
              <button
                className="stp-drawer-close"
                onClick={() => setDrawerOpen(false)}
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
              <Sidebar currentSlug={slug} onNavigate={() => setDrawerOpen(false)} />
            </aside>
          </>
        )}
      </div>

      <style>{`
        .stp-shell {
          display: flex;
          min-height: 100vh;
          min-height: 100dvh;
          background: var(--bg-deep);
          overflow-x: hidden;
        }
        .stp-sidebar-desktop {
          width: 240px;
          min-width: 240px;
          height: 100vh;
          height: 100dvh;
          position: sticky;
          top: 0;
        }
        .stp-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
        }
        .stp-mobile-topbar {
          display: none;
        }
        .stp-menu-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          background: var(--bg-raised);
          border: 1px solid var(--border-bright);
          color: var(--text);
          border-radius: 999px;
          font-size: 13px;
          font-family: var(--font-body);
          cursor: pointer;
        }
        .stp-menu-btn:active { background: var(--bg-card); }
        .stp-mobile-title {
          flex: 1;
          text-align: center;
          font-family: var(--font-display);
          font-size: 13px;
          color: var(--text-muted);
          letter-spacing: 0.08em;
        }
        .stp-mobile-brand { white-space: nowrap; }
        .stp-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.6);
          backdrop-filter: blur(2px);
          z-index: 40;
          animation: stpFade 0.15s ease-out;
        }
        .stp-sidebar-drawer {
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          width: 82vw;
          max-width: 320px;
          background: var(--bg-surface);
          border-right: 1px solid var(--border);
          z-index: 50;
          animation: stpSlideIn 0.2s ease-out;
          display: flex;
          flex-direction: column;
        }
        .stp-drawer-close {
          position: absolute;
          top: 12px;
          right: 12px;
          width: 32px;
          height: 32px;
          border-radius: 999px;
          background: var(--bg-raised);
          border: 1px solid var(--border-bright);
          color: var(--text);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 2;
        }
        @keyframes stpFade { from { opacity: 0 } to { opacity: 1 } }
        @keyframes stpSlideIn {
          from { transform: translateX(-100%) }
          to   { transform: translateX(0) }
        }

        @media (max-width: 900px) {
          .stp-sidebar-desktop { display: none; }
          .stp-mobile-topbar {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 10px 12px;
            border-bottom: 1px solid var(--border);
            background: var(--bg-surface);
            position: sticky;
            top: 0;
            z-index: 20;
          }
        }
      `}</style>
    </>
  );
}
