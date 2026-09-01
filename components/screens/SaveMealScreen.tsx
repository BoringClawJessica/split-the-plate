"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Camera, Star, Check } from "lucide-react";
import { BackButton, HomeBottomBar } from "../PhoneNav";

export default function SaveMealScreen() {
  const router = useRouter();
  const [restaurant, setRestaurant] = useState("Fuego & Sol Mexican");
  const [notes, setNotes] = useState("");
  const [rating, setRating] = useState(4);

  return (
    <div style={{ position: "relative", height: "100%", background: "var(--bg-base)", display: "flex", flexDirection: "column" }}>
      <BackButton to="/screen/gamble-results" />
      <div style={{ padding: "56px 20px 12px", flexShrink: 0 }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 600, color: "var(--text)" }}>
          Save this meal
        </div>
        <div style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "var(--font-body)", marginTop: 4 }}>
          Keep a memory of tonight
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "0 20px" }}>
        {/* Photo upload */}
        <div style={{
          width: "100%",
          height: 140,
          borderRadius: 16,
          background: "var(--bg-card)",
          border: "2px dashed var(--border-bright)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          marginBottom: 20,
          gap: 8,
        }}>
          <Camera size={28} color="var(--text-muted)" />
          <div style={{ fontSize: 13, color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>Add photos</div>
          <div style={{ fontSize: 11, color: "var(--border-bright)", fontFamily: "var(--font-body)" }}>Tap to upload or use camera</div>
        </div>

        {/* Restaurant name */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-body)", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>Restaurant</label>
          <input
            value={restaurant}
            onChange={(e) => setRestaurant(e.target.value)}
            style={{
              width: "100%", padding: "12px 14px", borderRadius: 12,
              background: "var(--bg-card)", border: "1px solid var(--border-bright)",
              color: "var(--text)", fontSize: 15, fontFamily: "var(--font-body)", outline: "none",
            }}
          />
        </div>

        {/* Rating */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-body)", display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>Your Rating</label>
          <div style={{ display: "flex", gap: 8 }}>
            {[1, 2, 3, 4, 5].map((star) => {
              const active = star <= rating;
              return (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  aria-label={`${star} star${star === 1 ? "" : "s"}`}
                  style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: active ? "var(--amber)" : "var(--text-muted)", transition: "color 0.1s" }}
                >
                  <Star size={28} strokeWidth={1.6} fill={active ? "var(--amber)" : "none"} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Notes */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-body)", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="How was it? Any standout dishes?"
            rows={3}
            style={{
              width: "100%", padding: "12px 14px", borderRadius: 12,
              background: "var(--bg-card)", border: "1px solid var(--border-bright)",
              color: "var(--text)", fontSize: 14, fontFamily: "var(--font-body)", outline: "none",
              resize: "none",
            }}
          />
        </div>

        {/* Party */}
        <div>
          <label style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-body)", display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>Party (4 people)</label>
          <div style={{ display: "flex", gap: 8 }}>
            {["Eli", "Sofia", "Marcus", "Jade"].map((p) => (
              <div key={p} style={{ padding: "6px 10px", borderRadius: 8, background: "var(--bg-card)", border: "1px solid var(--border)", fontSize: 11, color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}>
                {p}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ padding: "16px 20px", borderTop: "1px solid var(--border)", background: "var(--bg-surface)", flexShrink: 0 }}>
        <button
          onClick={() => router.push("/screen/meal-detail")}
          style={{
            width: "100%", padding: "15px", borderRadius: 14,
            background: "var(--amber)", color: "#000",
            fontWeight: 700, fontSize: 15, border: "none", cursor: "pointer",
            fontFamily: "var(--font-body)",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          <Check size={16} /> Save Meal
        </button>
      </div>
      <div style={{ height: 80, flexShrink: 0 }} />
      <HomeBottomBar />
    </div>
  );
}
