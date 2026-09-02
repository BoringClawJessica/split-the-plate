"use client";

import { useRouter } from "next/navigation";
import {
  receiptItems as receiptItemsSeed,
  scannedRestaurantName,
  currentUser,
  friends as friendsSeed,
} from "@/lib/mock-data";
import { useEffect, useMemo, useState } from "react";
import { Pencil, Trash2, Plus, X, Users, Check } from "lucide-react";
import { BackButton, HomeBottomBar } from "../PhoneNav";
import {
  readSplit,
  writeSplit,
  SplitItem,
  SplitPerson,
} from "@/lib/split-state";

type EditorState =
  | { mode: "closed" }
  | { mode: "add" }
  | { mode: "edit"; itemId: string };

/**
 * ItemsDetectedScreen — the CANONICAL up-front assignment step.
 *
 * Order in the new flow:
 *   New Split → Add People → Scan / Manual → Items Detected (this) → Split Method
 *
 * Here the user (leader) does BOTH: reviews items AND assigns each one
 * to the person(s) who ordered it. Once out of this step, downstream
 * screens (By Item, Even, Custom, Gamble Pay) just READ the assignments.
 *
 * We persist to sessionStorage via `writeSplit` so subsequent screens
 * see the same items/people/assignments without prop-drilling or
 * dragging in a context provider for the prototype.
 */
export default function ItemsDetectedScreen() {
  const router = useRouter();

  // People: read from what Add People wrote, or fall back to a sensible
  // default (you + first 3 friends) if the user landed here directly.
  const initialPeople: SplitPerson[] = useMemo(() => {
    const persisted = readSplit();
    if (persisted && persisted.people.length > 0) return persisted.people;
    return [
      { id: currentUser.id, name: "You", avatar: currentUser.avatar },
      ...friendsSeed.slice(0, 3).map((f) => ({
        id: f.id,
        name: f.name,
        avatar: f.avatar,
        handle: f.handle,
      })),
    ];
  }, []);

  const [people] = useState<SplitPerson[]>(initialPeople);

  const [items, setItems] = useState<SplitItem[]>(() => {
    const persisted = readSplit();
    if (persisted && persisted.items.length > 0) return persisted.items;
    return receiptItemsSeed.map((i) => ({ ...i, assignedTo: [...i.assignedTo] }));
  });

  const [editor, setEditor] = useState<EditorState>({ mode: "closed" });
  const [restaurant, setRestaurant] = useState<string>(() => {
    const persisted = readSplit();
    return persisted?.restaurant || scannedRestaurantName;
  });

  // Which item is currently open in the "assign to who?" sheet.
  const [assignForItemId, setAssignForItemId] = useState<string | null>(null);

  const total = items.reduce((s, i) => s + i.price, 0);
  const assignedCount = items.filter((i) => i.assignedTo.length > 0).length;
  const allAssigned = assignedCount === items.length && items.length > 0;

  // Persist EVERY change so a screen switch keeps state.
  useEffect(() => {
    writeSplit({
      people,
      items,
      restaurant,
      leaderId: currentUser.id,
    });
  }, [people, items, restaurant]);

  const removeItem = (id: string) =>
    setItems((prev) => prev.filter((i) => i.id !== id));

  const saveItem = (name: string, price: number) => {
    if (editor.mode === "add") {
      setItems((prev) => [
        ...prev,
        { id: `i${Date.now()}`, name: name.trim(), price, assignedTo: [] },
      ]);
    } else if (editor.mode === "edit") {
      const id = editor.itemId;
      setItems((prev) =>
        prev.map((i) => (i.id === id ? { ...i, name: name.trim(), price } : i)),
      );
    }
    setEditor({ mode: "closed" });
  };

  const togglePersonForItem = (itemId: string, personId: string) => {
    setItems((prev) =>
      prev.map((i) => {
        if (i.id !== itemId) return i;
        const has = i.assignedTo.includes(personId);
        return {
          ...i,
          assignedTo: has
            ? i.assignedTo.filter((p) => p !== personId)
            : [...i.assignedTo, personId],
        };
      }),
    );
  };

  const editingItem =
    editor.mode === "edit"
      ? items.find((i) => i.id === editor.itemId) ?? null
      : null;

  const assigningItem = assignForItemId
    ? items.find((i) => i.id === assignForItemId) ?? null
    : null;

  const nameForPerson = (pid: string) =>
    people.find((p) => p.id === pid)?.name ?? "?";

  return (
    <div style={{ position: "relative", height: "100%", background: "var(--bg-base)", display: "flex", flexDirection: "column" }}>
      <BackButton to="/screen/add-people" />
      <div style={{ padding: "56px 20px 12px", flexShrink: 0 }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 600, color: "var(--text)" }}>
          Items Detected
        </div>
        <div style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "var(--font-body)", marginTop: 4 }}>
          {items.length} items · ${total.toFixed(2)} subtotal · {assignedCount}/{items.length} assigned
        </div>
      </div>

      {/* Restaurant name */}
      <div style={{ padding: "0 20px 14px", flexShrink: 0 }}>
        <label style={{ display: "block", fontSize: 11, color: "var(--text-muted)", marginBottom: 6, fontFamily: "var(--font-body)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
          Restaurant name
        </label>
        <input
          value={restaurant}
          onChange={(e) => setRestaurant(e.target.value)}
          placeholder="e.g. Blue Plate Diner"
          style={{
            width: "100%",
            padding: "11px 14px",
            borderRadius: 10,
            background: "var(--bg-card)",
            border: "1px solid var(--border-bright)",
            color: "var(--text)",
            fontSize: 15,
            fontFamily: "var(--font-body)",
            outline: "none",
          }}
        />
      </div>

      {/* Items list w/ inline "assign" */}
      <div style={{ flex: 1, overflowY: "auto", padding: "0 20px 8px" }}>
        {items.map((item) => {
          const assignees = item.assignedTo;
          return (
            <div
              key={item.id}
              style={{
                padding: "12px 0",
                borderBottom: "1px solid var(--border)",
              }}
            >
              {/* Top row: name + price + edit/delete */}
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: assignees.length > 0 ? "var(--amber)" : "var(--border-bright)",
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
                  style={iconBtnStyle}
                >
                  <Pencil size={13} />
                </button>
                <button
                  onClick={() => removeItem(item.id)}
                  aria-label="Delete item"
                  style={{ ...iconBtnStyle, color: "#f87171" }}
                >
                  <Trash2 size={13} />
                </button>
              </div>

              {/* Assignment chip row */}
              <div style={{ marginTop: 8, marginLeft: 20, display: "flex", alignItems: "center", flexWrap: "wrap", gap: 6 }}>
                {assignees.length === 0 ? (
                  <button
                    onClick={() => setAssignForItemId(item.id)}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "5px 10px",
                      borderRadius: 8,
                      background: "rgba(245,158,11,0.08)",
                      border: "1px dashed rgba(245,158,11,0.4)",
                      color: "var(--amber)",
                      fontSize: 11,
                      fontWeight: 600,
                      cursor: "pointer",
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    <Users size={12} /> Assign to…
                  </button>
                ) : (
                  <>
                    {assignees.map((pid) => (
                      <span
                        key={pid}
                        style={{
                          padding: "3px 9px",
                          borderRadius: 999,
                          background: "rgba(245,158,11,0.12)",
                          border: "1px solid rgba(245,158,11,0.35)",
                          color: "var(--amber)",
                          fontSize: 11,
                          fontFamily: "var(--font-body)",
                          fontWeight: 600,
                        }}
                      >
                        {nameForPerson(pid)}
                      </span>
                    ))}
                    <button
                      onClick={() => setAssignForItemId(item.id)}
                      style={{
                        padding: "3px 9px",
                        borderRadius: 999,
                        background: "transparent",
                        border: "1px solid var(--border-bright)",
                        color: "var(--text-muted)",
                        fontSize: 11,
                        cursor: "pointer",
                        fontFamily: "var(--font-body)",
                      }}
                    >
                      Edit
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}

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
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ fontSize: 14, color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}>Subtotal</span>
          <span style={{ fontSize: 16, fontWeight: 700, color: "var(--amber)", fontFamily: "var(--font-body)" }}>${total.toFixed(2)}</span>
        </div>
        {!allAssigned && (
          <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-body)", marginBottom: 10 }}>
            Unassigned items will be split evenly across everyone.
          </div>
        )}
        <button
          onClick={() => router.push("/screen/split-method")}
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
          Choose Split Method
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

      {assigningItem && (
        <AssignSheet
          item={assigningItem}
          people={people}
          onToggle={(pid) => togglePersonForItem(assigningItem.id, pid)}
          onClose={() => setAssignForItemId(null)}
        />
      )}

      <HomeBottomBar hidden />
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

function AssignSheet({
  item,
  people,
  onToggle,
  onClose,
}: {
  item: SplitItem;
  people: SplitPerson[];
  onToggle: (pid: string) => void;
  onClose: () => void;
}) {
  return (
    <div
      onClick={onClose}
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
          gap: 12,
          maxHeight: "70%",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 600, color: "var(--text)" }}>Assign item</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "var(--font-body)", marginTop: 2 }}>
              {item.name} · ${item.price.toFixed(2)} · pick one or more
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Done"
            style={{
              padding: "6px 12px",
              borderRadius: 999,
              background: "var(--amber)",
              color: "#000",
              fontWeight: 700,
              fontSize: 12,
              border: "none",
              cursor: "pointer",
              fontFamily: "var(--font-body)",
            }}
          >
            Done
          </button>
        </div>

        <div style={{ overflowY: "auto", display: "flex", flexDirection: "column", gap: 6 }}>
          {people.map((p) => {
            const selected = item.assignedTo.includes(p.id);
            return (
              <button
                key={p.id}
                onClick={() => onToggle(p.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "10px 12px",
                  borderRadius: 12,
                  background: selected ? "rgba(245,158,11,0.10)" : "var(--bg-card)",
                  border: `1px solid ${selected ? "var(--amber)" : "var(--border)"}`,
                  cursor: "pointer",
                  fontFamily: "var(--font-body)",
                  textAlign: "left",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.avatar} alt={p.name} style={{ width: 36, height: 36, borderRadius: "50%", border: "2px solid var(--border)" }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>{p.name}</div>
                  {p.handle && (
                    <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{p.handle}</div>
                  )}
                </div>
                <div style={{
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  background: selected ? "var(--amber)" : "var(--bg-raised)",
                  border: `1px solid ${selected ? "var(--amber)" : "var(--border-bright)"}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                  {selected && <Check size={14} color="#000" strokeWidth={3} />}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const iconBtnStyle: React.CSSProperties = {
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
};

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
