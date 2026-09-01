"use client";

import Link from "next/link";
import { screenGroups, screens } from "@/lib/screens";
import { useState } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";

const groupOrder = [
  "Onboarding",
  "Home",
  "New Split",
  "Gamble Pay",
  "Meal Memory",
  "Profile & Settings",
  "Edge States",
  "Coming Soon",
];

const groupColors: Record<string, string> = {
  Onboarding: "#ab3500",
  Home: "#ff6b35",
  "New Split": "#15803d",
  "Gamble Pay": "#dc2626",
  "Meal Memory": "#0891b2",
  "Profile & Settings": "#7c3aed",
  "Edge States": "#8c7b72",
  "Coming Soon": "#594139",
};

export default function Sidebar({
  currentSlug,
  onNavigate,
}: {
  currentSlug: string;
  onNavigate?: () => void;
}) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const totalScreens = screens.length;
  const currentIdx = screens.findIndex((s) => s.slug === currentSlug);

  const toggle = (group: string) => {
    setCollapsed((p) => ({ ...p, [group]: !p[group] }));
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "var(--bg-surface)",
        borderRight: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "20px 16px 16px",
          borderBottom: "1px solid var(--border)",
          background: "var(--bg-base)",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 16,
            fontWeight: 600,
            color: "var(--amber)",
            letterSpacing: "-0.02em",
            lineHeight: 1.2,
          }}
        >
          SPLIT
          <br />
          <span style={{ color: "var(--text)", fontWeight: 300 }}>THE PLATE</span>
        </div>
        <div
          style={{
            marginTop: 8,
            fontSize: 10,
            color: "var(--text-muted)",
            fontFamily: "var(--font-body)",
          }}
        >
          Screen {currentIdx + 1} / {totalScreens}
        </div>
        {/* Progress bar */}
        <div
          style={{
            marginTop: 6,
            height: 2,
            background: "var(--border)",
            borderRadius: 1,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${((currentIdx + 1) / totalScreens) * 100}%`,
              background: "linear-gradient(90deg, var(--brand-orange-from), var(--brand-orange-to))",
              borderRadius: 1,
              transition: "width 0.3s ease",
            }}
          />
        </div>
      </div>

      {/* Screen list */}
      <div style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
        {groupOrder.map((group) => {
          const groupScreens = screenGroups[group];
          if (!groupScreens) return null;
          const isCollapsed = collapsed[group];
          const color = groupColors[group] || "#6b7280";
          const hasActive = groupScreens.some((s) => s.slug === currentSlug);

          return (
            <div key={group}>
              {/* Group header */}
              <button
                onClick={() => toggle(group)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "6px 16px",
                  background: hasActive ? "rgba(255,107,53,0.08)" : "transparent",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: color,
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    flex: 1,
                    fontSize: 10,
                    fontWeight: 600,
                    color: color,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  {group}
                </span>
                {isCollapsed ? (
                  <ChevronRight size={10} color="var(--text-muted)" />
                ) : (
                  <ChevronDown size={10} color="var(--text-muted)" />
                )}
              </button>

              {/* Screen items */}
              {!isCollapsed &&
                groupScreens.map((screen) => {
                  const isActive = screen.slug === currentSlug;
                  return (
                    <Link
                      key={screen.slug}
                      href={`/screen/${screen.slug}`}
                      onClick={() => onNavigate?.()}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "5px 16px 5px 28px",
                        textDecoration: "none",
                        background: isActive
                          ? "rgba(255,107,53,0.14)"
                          : "transparent",
                        borderLeft: isActive
                          ? `2px solid var(--amber)`
                          : "2px solid transparent",
                        transition: "background 0.15s",
                      }}
                    >
                      {screen.phase && (
                        <span
                          style={{
                            fontSize: 8,
                            color: "var(--text-muted)",
                            marginRight: 4,
                            background: "var(--bg-card)",
                            padding: "1px 4px",
                            borderRadius: 3,
                          }}
                        >
                          {screen.phase}
                        </span>
                      )}
                      <span
                        style={{
                          fontSize: 11,
                          color: isActive ? "var(--amber)" : "var(--text-secondary)",
                          fontWeight: isActive ? 600 : 400,
                          fontFamily: "var(--font-body)",
                        }}
                      >
                        {screen.title}
                      </span>
                    </Link>
                  );
                })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
