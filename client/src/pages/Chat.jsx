import { API_BASE } from "../config/apiBase";
import { useEffect, useRef, useState } from "react";
import owlLogo from "../assets/owl-logo.png";
import ReactMarkdown from "react-markdown";

export default function Chat() {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hello, I am your Wise Assistant. Ask me anything about your finances, goals, or concerns!",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const text = input.trim();
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
      <div className="flex items-center gap-3 border-b border-app-border bg-app-surface px-5 py-4 shadow-sm">
        <img
          src={owlLogo}
          alt="Wise Assistant"
          className="h-10 w-10 rounded-full"
        />
        <div>
          <h1 className="text-lg font-semibold">Wise Assistant</h1>
          <p className="text-sm text-app-muted">
            Ask about your finances, goals, subscriptions, and investments
          </p>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        <div className="mx-auto flex h-full w-full max-w-5xl flex-col gap-4">
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
                  alt="Wise Assistant"
                  className="mr-2 h-9 w-9 rounded-full border border-app-border"
                />
              )}

              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-card md:max-w-3xl ${
                  msg.sender === "user"
                    ? "rounded-br-none bg-app-primary text-white"
                    : "rounded-bl-none border border-app-border bg-app-surface text-app-text"
                }`}
              >
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-end justify-start">
              <img
                src={owlLogo}
                alt="Wise Assistant"
                className="mr-2 h-9 w-9 rounded-full border border-app-border"
              />
              <div className="rounded-2xl rounded-bl-none border border-app-border bg-app-surface px-4 py-3 text-sm shadow-card">
                Thinking…
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      <form
        onSubmit={handleSend}
        className="border-t border-app-border bg-app-surface p-4"
      >
        <div className="mx-auto flex w-full max-w-5xl gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Wise Assistant about spending, goals, accounts, subscriptions, or investments..."
            className="flex-1 rounded-xl border border-app-border bg-app-bg px-3 py-2 text-base text-app-text placeholder:text-app-muted focus:outline-none focus:ring-2 focus:ring-app-primary"
          />

          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-app-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-app-primaryHover disabled:opacity-60"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  )
};