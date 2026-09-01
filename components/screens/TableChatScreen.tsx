"use client";

import { useState } from "react";
import { tableMessages } from "@/lib/mock-data";
import { Send, Utensils } from "lucide-react";
import { BackButton, HomeBottomBar } from "../PhoneNav";

export default function TableChatScreen() {
  const [messages, setMessages] = useState(tableMessages);
  const [input, setInput] = useState("");

  const send = () => {
    if (!input.trim()) return;
    setMessages((m) => [...m, { id: `m${Date.now()}`, sender: "Eli", text: input, time: "now", type: "message" }]);
    setInput("");
  };

  return (
    <div style={{ position: "relative", height: "100%", background: "var(--bg-base)", display: "flex", flexDirection: "column" }}>
      <BackButton to="/screen/home" />
      {/* Header */}
      <div style={{
        padding: "56px 20px 16px",
        borderBottom: "1px solid var(--border)",
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        gap: 10,
      }}>
        <div style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--amber)",
        }}>
          <Utensils size={18} strokeWidth={1.7} />
        </div>
        <div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 600, color: "var(--text)" }}>Table Chat</div>
          <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>Fuego & Sol Mexican · Aug 28</div>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px" }}>
        {messages.map((msg) => {
          if (msg.type === "system") {
            return (
              <div key={msg.id} style={{ textAlign: "center", margin: "12px 0" }}>
                <span style={{
                  fontSize: 11,
                  color: "var(--text-muted)",
                  fontFamily: "var(--font-body)",
                  padding: "4px 12px",
                  borderRadius: 12,
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                }}>
                  {msg.text}
                </span>
              </div>
            );
          }
          const isMe = msg.sender === "Eli";
          return (
            <div key={msg.id} style={{
              display: "flex",
              justifyContent: isMe ? "flex-end" : "flex-start",
              marginBottom: 8,
            }}>
              <div>
                {!isMe && (
                  <div style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "var(--font-body)", marginBottom: 3, marginLeft: 4 }}>
                    {msg.sender}
                  </div>
                )}
                <div style={{
                  padding: "10px 14px",
                  borderRadius: isMe ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                  background: isMe ? "var(--amber)" : "var(--bg-card)",
                  color: isMe ? "#000" : "var(--text)",
                  fontSize: 14,
                  fontFamily: "var(--font-body)",
                  maxWidth: 220,
                  border: isMe ? "none" : "1px solid var(--border)",
                }}>
                  {msg.text}
                </div>
                <div style={{ fontSize: 9, color: "var(--text-muted)", fontFamily: "var(--font-body)", marginTop: 3, textAlign: isMe ? "right" : "left", marginRight: isMe ? 4 : 0, marginLeft: isMe ? 0 : 4 }}>
                  {msg.time}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input */}
      <div style={{
        padding: "12px 16px",
        borderTop: "1px solid var(--border)",
        display: "flex",
        gap: 8,
        background: "var(--bg-surface)",
        flexShrink: 0,
      }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Message the table..."
          style={{
            flex: 1,
            padding: "10px 14px",
            borderRadius: 20,
            background: "var(--bg-card)",
            border: "1px solid var(--border-bright)",
            color: "var(--text)",
            fontSize: 14,
            fontFamily: "var(--font-body)",
            outline: "none",
          }}
        />
        <button
          onClick={send}
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: "var(--amber)",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Send size={16} color="#000" />
        </button>
      </div>
      <div style={{ height: 80, flexShrink: 0 }} />
      <HomeBottomBar />
    </div>
  );
}
