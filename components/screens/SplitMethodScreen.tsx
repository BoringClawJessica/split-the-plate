"use client";

import { useRouter } from "next/navigation";
import { Scale, Utensils, Pencil, Dice5 } from "lucide-react";
import { BackButton, HomeBottomBar } from "../PhoneNav";

type Method = {
  id: string;
  name: string;
  description: string;
  route: string;
  icon: React.ReactNode;
  wild?: boolean;
};

const methods: Method[] = [
  {
    id: "even",
    name: "Split Even",
    description: "Divide the total equally among everyone",
    route: "/screen/even-split",
    icon: <Scale size={24} strokeWidth={1.6} />,
  },
  {
    id: "by_item",
    name: "By Item",
    description: "Assign each item to the person who ordered it",
    route: "/screen/by-item",
    icon: <Utensils size={24} strokeWidth={1.6} />,
  },
  {
    id: "custom",
    name: "Custom",
    description: "Enter a custom amount for each person",
    route: "/screen/custom-split",
    icon: <Pencil size={24} strokeWidth={1.6} />,
  },
  {
    id: "gamble",
    name: "Gamble Pay",
    description: "Play a game to decide who owes what",
    route: "/screen/gamble-picker",
    icon: <Dice5 size={24} strokeWidth={1.6} />,
    wild: true,
  },
];

export default function SplitMethodScreen() {
  const router = useRouter();

  return (
    <div style={{ position: "relative", height: "100%", background: "var(--bg-base)", display: "flex", flexDirection: "column", padding: "56px 20px 92px" }}>
      <BackButton to="/screen/items-detected" />
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 600, color: "var(--text)" }}>
          How to split?
        </div>
        <div style={{ fontSize: 13, color: "var(--text-secondary)", fontFamily: "var(--font-body)", marginTop: 4 }}>
          5 people · $187.00 subtotal
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, flex: 1 }}>
        {methods.map((method) => (
          <button
            key={method.id}
            onClick={() => router.push(method.route)}
            style={{
              padding: "18px",
              borderRadius: 18,
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              cursor: "pointer",
              textAlign: "left",
              display: "flex",
              alignItems: "center",
              gap: 16,
              transition: "all 0.15s",
            }}
          >
            <div style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              background: method.wild ? "linear-gradient(135deg, rgba(220,38,38,0.3), rgba(234,88,12,0.3))" : "var(--bg-raised)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: method.wild ? "#f87171" : "var(--amber)",
              flexShrink: 0,
              border: method.wild ? "1px solid rgba(220,38,38,0.3)" : "1px solid var(--border)",
            }}>
              {method.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{
                fontFamily: "var(--font-body)",
                fontSize: 15,
                fontWeight: 600,
                color: method.wild ? "#ea580c" : "var(--text)",
                marginBottom: 4,
              }}>
                {method.name}
                {method.wild && (
                  <span style={{
                    marginLeft: 8,
                    fontSize: 10,
                    padding: "2px 6px",
                    borderRadius: 4,
                    background: "rgba(220,38,38,0.2)",
                    color: "#f87171",
                    fontWeight: 400,
                    verticalAlign: "middle",
                  }}>
                    WILD
                  </span>
                )}
              </div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--text-muted)", lineHeight: 1.4 }}>
                {method.description}
              </div>
            </div>
            <div style={{ color: "var(--text-muted)", fontSize: 18 }}>›</div>
          </button>
        ))}
      </div>
      <HomeBottomBar hidden />
    </div>
  );
}
