"use client";

import { useState } from "react";
import { ChevronDown, Send, Sparkles } from "lucide-react";

const modes = [
  {
    id: "auto",
    label: "Auto Neural",
    description: "Automatically chooses the best Gemini route",
  },
  {
    id: "fast",
    label: "Fast Response",
    description: "Low-latency answers",
  },
  {
    id: "deep",
    label: "Deep Reasoning",
    description: "Complex tasks and analysis",
  },
  {
    id: "vision",
    label: "Vision Fusion",
    description: "Images, PDFs, and screenshots",
  },
];

export default function Home() {
  const [mode, setMode] = useState("auto");
  const [thinkingLevel, setThinkingLevel] = useState("High");
  const [menuOpen, setMenuOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);

  const selectedMode = modes.find((item) => item.id === mode);

  async function sendMessage(event) {
    event.preventDefault();

    const text = input.trim();

    if (!text || loading) return;

    setInput("");
    setLoading(true);

    setMessages((current) => [
      ...current,
      { role: "user", text },
    ]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: text,
          mode,
          thinkingLevel,
        }),
      });

      const data = await response.json();

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          text: data.text || data.error,
          mode: data.mode,
        },
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          text: "Unable to connect to Nexora neural engine.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="nexora-shell">
      <header className="topbar">
        <button className="menu-icon">☰</button>

        <button
          className="model-trigger"
          onClick={() => setMenuOpen((value) => !value)}
        >
          <Sparkles size={17} />
          <span>{selectedMode.label}</span>
          <ChevronDown size={15} />
        </button>

        <button className="upgrade-button">Upgrade</button>
        <div className="profile-circle">N</div>
      </header>

      {menuOpen && (
        <div className="neural-menu">
          {modes.map((item) => (
            <button
              key={item.id}
              className={mode === item.id ? "mode-item active" : "mode-item"}
              onClick={() => {
                setMode(item.id);
                setMenuOpen(false);
              }}
            >
              <span className="mode-check">
                {mode === item.id ? "✓" : ""}
              </span>

              <span className="mode-copy">
                <strong>{item.label}</strong>
                <small>{item.description}</small>
              </span>
            </button>
          ))}

          <div className="thinking-control">
            <div>
              <strong>Thinking level</strong>
              <small>{thinkingLevel}</small>
            </div>

            <select
              value={thinkingLevel}
              onChange={(event) => setThinkingLevel(event.target.value)}
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>
        </div>
      )}

      <section className="hero">
        <div className="neural-orb">
          <Sparkles size={40} />
        </div>

        <p className="eyebrow">NEXORA NEURAL ENGINE</p>
        <h1>What are we building today?</h1>
        <p className="subtitle">
          {selectedMode.description}
        </p>
      </section>

      <section className="messages">
        {messages.length === 0 && (
          <p className="empty-message">
            Ask a question, upload an image, or start a complex task.
          </p>
        )}

        {messages.map((message, index) => (
          <div
            key={index}
            className={
              message.role === "user"
                ? "message user-message"
                : "message ai-message"
            }
          >
            {message.text}
          </div>
        ))}

        {loading && (
          <div className="message ai-message">
            {selectedMode.label} is thinking…
          </div>
        )}
      </section>

      <form className="composer" onSubmit={sendMessage}>
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder={`Ask ${selectedMode.label}...`}
        />

        <button
          className="send-button"
          type="submit"
          disabled={loading || !input.trim()}
        >
          <Send size={18} />
        </button>
      </form>

      <footer className="engine-status">
        <span>Gemini powered</span>
        <span>{selectedMode.label}</span>
        <span>Thinking: {thinkingLevel}</span>
      </footer>
    </main>
  );
}
