"use client";

import { useRouter } from "next/navigation";
import { receiptItems } from "@/lib/mock-data";
import { useState } from "react";
import { Pencil, Trash2, Plus, X } from "lucide-react";
import { BackButton, HomeBottomBar } from "../PhoneNav";

type Item = { id: string; name: string; price: number; assignedTo: string[] };

type EditorState =
  | { mode: "closed" }
  | { mode: "add" }
  | { mode: "edit"; itemId: string };

export default function ItemsDetectedScreen() {
  const router = useRouter();
  const [items, setItems] = useState<Item[]>(receiptItems.map((i) => ({ ...i })));
  const [editor, setEditor] = useState<EditorState>({ mode: "closed" });

  const total = items.reduce((s, i) => s + i.price, 0);

  const removeItem = (id: string) => setItems((prev) => prev.filter((i) => i.id !== id));

  const saveItem = (name: string, price: number) => {
    if (editor.mode === "add") {
      setItems((prev) => [
        ...prev,
        { id: `i${Date.now()}`, name: name.trim(), price, assignedTo: [] },
      ]);
    } else if (editor.mode === "edit") {
      const id = editor.itemId;
      setItems((prev) => prev.map((i) => (i.id === id ? { ...i, name: name.trim(), price } : i)));
    }
    setEditor({ mode: "closed" });
  };

  const editingItem =
    editor.mode === "edit" ? items.find((i) => i.id === editor.itemId) ?? null : null;

  return (
    <div style={{ position: "relative", height: "100%", background: "var(--bg-base)", display: "flex", flexDirection: "column" }}>
      <BackButton to="/screen/new-split" />
      <div style={{ padding: "56px 20px 12px", flexShrink: 0 }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 600, color: "var(--text)" }}>
          Items Detected
        </div>
        <div style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "var(--font-body)", marginTop: 4 }}>
          {items.length} items · ${total.toFixed(2)} subtotal
        </div>
      </div>

      {/* Items list */}
      <div style={{ flex: 1, overflowY: "auto", padding: "0 20px 8px" }}>
        {items.map((item) => (
          <div
            key={item.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "12px 0",
              borderBottom: "1px solid var(--border)",
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "var(--amber)",
                flexShrink: 0,
              }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, color: "var(--text)", fontFamily: "var(--font-body)", fontWeight: 500 }}>
                {item.name}
              </div>
            </div>
            <div style={{ fontSize: 15, fontWeight: 600, color: "var(--text)", fontFamily: "var(--font-body)", minWidth: 60, textAlign: "right" }}>
              ${item.price.toFixed(2)}
            </div>
            <button
              onClick={() => setEditor({ mode: "edit", itemId: item.id })}
              aria-label="Edit item"
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                cursor: "pointer",
                color: "var(--text-secondary)",
                width: 30,
                height: 30,
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Pencil size={13} />
            </button>
            <button
              onClick={() => removeItem(item.id)}
              aria-label="Delete item"
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                cursor: "pointer",
                color: "#f87171",
                width: 30,
                height: 30,
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Trash2 size={13} />
            </button>
          </div>
        ))}

        {/* Add item */}
        <button
          onClick={() => setEditor({ mode: "add" })}
          style={{
            width: "100%",
            padding: "12px",
            marginTop: 8,
            borderRadius: 10,
            background: "transparent",
            border: "1px dashed var(--border-bright)",
            color: "var(--text-muted)",
            fontSize: 13,
            cursor: "pointer",
            fontFamily: "var(--font-body)",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
          }}
        >
          <Plus size={14} /> Add missing item
        </button>
      </div>

      {/* Total + CTA */}
      <div style={{ padding: "16px 20px", borderTop: "1px solid var(--border)", background: "var(--bg-surface)", flexShrink: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
          <span style={{ fontSize: 14, color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}>Subtotal</span>
          <span style={{ fontSize: 16, fontWeight: 700, color: "var(--amber)", fontFamily: "var(--font-body)" }}>${total.toFixed(2)}</span>
        </div>
        <button
          onClick={() => router.push("/screen/add-people")}
          style={{
            width: "100%",
            padding: "15px",
            borderRadius: 14,
            background: "var(--amber)",
            color: "#000",
            fontWeight: 700,
            fontSize: 15,
            border: "none",
            cursor: "pointer",
            fontFamily: "var(--font-body)",
          }}
        >
          Looks good &mdash; Add people
        </button>
      </div>

      {editor.mode !== "closed" && (
        <ItemEditorSheet
          key={editor.mode === "edit" ? editor.itemId : "add"}
          title={editor.mode === "add" ? "Add item" : "Edit item"}
          initialName={editingItem?.name ?? ""}
          initialPrice={editingItem?.price ?? 0}
          onCancel={() => setEditor({ mode: "closed" })}
          onSave={saveItem}
        />
      )}

      <HomeBottomBar />
    </div>
  );
}

function ItemEditorSheet({
  title,
  initialName,
  initialPrice,
  onCancel,
  onSave,
}: {
  title: string;
  initialName: string;
  initialPrice: number;
  onCancel: () => void;
  onSave: (name: string, price: number) => void;
}) {
  const [name, setName] = useState(initialName);
  const [priceStr, setPriceStr] = useState(initialPrice ? initialPrice.toFixed(2) : "");

  const canSave = name.trim().length > 0 && !isNaN(parseFloat(priceStr)) && parseFloat(priceStr) > 0;

  return (
    <div
      onClick={onCancel}
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
          <div style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 600, color: "var(--text)" }}>{title}</div>
          <button
            onClick={onCancel}
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

        <div>
          <label style={{ display: "block", fontSize: 11, color: "var(--text-muted)", marginBottom: 6, fontFamily: "var(--font-body)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Item name
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Truffle Fries"
            style={inputStyle}
          />
        </div>

        <div>
          <label style={{ display: "block", fontSize: 11, color: "var(--text-muted)", marginBottom: 6, fontFamily: "var(--font-body)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Price
          </label>
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>$</span>
            <input
              value={priceStr}
              onChange={(e) => setPriceStr(e.target.value.replace(/[^0-9.]/g, ""))}
              placeholder="0.00"
              inputMode="decimal"
              style={{ ...inputStyle, paddingLeft: 26 }}
            />
          </div>
        </div>

        <button
          disabled={!canSave}
          onClick={() => canSave && onSave(name, parseFloat(priceStr))}
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
