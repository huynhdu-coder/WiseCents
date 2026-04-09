import { API_BASE } from "../config/apiBase";
import { useState } from "react";
import owlLogo from "../assets/owl-logo.png";
import ReactMarkdown from "react-markdown";

export default function Chat() {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hello, I am your Wise Assistant! Ask me anything about goals, concerns, or personal finances.",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const text = input;
    setInput("");

    setMessages((prev) => [...prev, { sender: "user", text }]);

    const token = localStorage.getItem("token");
    if (!token) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "You’re not logged in. Please log in again." },
      ]);
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE}/api/ai/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: text }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text: data?.error || data?.message || "I ran into a server error.",
          },
        ]);
        return;
      }

      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: data.reply ?? "(No reply returned)" },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "I can’t reach the backend right now." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full min-h-0 flex-col bg-app-bg text-app-text">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-app-border bg-app-surface px-5 py-4 shadow-sm">
        <img
          src={owlLogo}
          alt="WiseCents Owl"
          className="h-10 w-10 rounded-full"
        />
        <div>
          <h1 className="text-lg font-semibold">WiseCents AI Chat</h1>
          <p className="text-sm text-app-muted">
            Your personal finance assistant
          </p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex items-end ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.sender === "bot" && (
              <img
                src={owlLogo}
                alt="Bot"
                className="mr-2 h-9 w-9 rounded-full border border-app-border"
              />
            )}

            <div
              className={`max-w-xs rounded-2xl px-4 py-2 text-sm shadow-card md:max-w-md ${
                msg.sender === "user"
                  ? "bg-app-primary text-white rounded-br-none"
                  : "bg-app-surface border border-app-border rounded-bl-none"
              }`}
            >
              <ReactMarkdown>{msg.text}</ReactMarkdown>
            </div>

            {msg.sender === "user" && <div className="w-2" />}
          </div>
        ))}

        {loading && (
          <div className="flex items-end justify-start">
            <img
              src={owlLogo}
              alt="Bot"
              className="mr-2 h-9 w-9 rounded-full border border-app-border"
            />
            <div className="rounded-2xl rounded-bl-none border border-app-border bg-app-surface px-4 py-2 text-sm shadow-card">
              Thinking…
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <form
        onSubmit={handleSend}
        className="flex gap-2 border-t border-app-border bg-app-surface p-4"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask WiseCents something..."
          className="flex-1 rounded-xl border border-app-border bg-app-bg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-app-primary"
        />

        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-app-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-app-primaryHover disabled:opacity-60"
        >
          Send
        </button>
      </form>
    </div>
  );
}