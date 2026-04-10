import { API_BASE } from "../config/apiBase";
import { useEffect, useRef, useState } from "react";
import owlLogo from "../assets/owl-logo.png";
import ReactMarkdown from "react-markdown";

export default function AIChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hi! I’m Wise Assistant. Ask about spending, goals, accounts, subscriptions, or investments.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading, open]);

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
    <>
      {open && (
        <div className="fixed bottom-24 right-6 z-50 h-[460px] w-[340px] overflow-hidden rounded-2xl border border-app-border bg-app-surface shadow-2xl">
          <div className="flex h-full min-h-0 flex-col">
            <div className="flex items-center gap-3 border-b border-app-border bg-app-surface px-4 py-3">
              <img
                src={owlLogo}
                alt="Wise Assistant"
                className="h-9 w-9 rounded-full border border-app-border"
              />
              <div className="min-w-0">
                <h2 className="truncate text-sm font-semibold text-app-text">
                  Wise Assistant
                </h2>
                <p className="truncate text-xs text-app-muted">
                  Quick help with your finances
                </p>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="ml-auto rounded-md px-2 py-1 text-app-muted hover:bg-app-soft hover:text-app-text"
                aria-label="Close chat"
              >
                ✕
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto bg-app-bg p-3">
              <div className="flex flex-col gap-3">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${
                      msg.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm shadow-sm ${
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
                  <div className="flex justify-start">
                    <div className="max-w-[85%] rounded-2xl rounded-bl-none border border-app-border bg-app-surface px-3 py-2 text-sm text-app-text shadow-sm">
                      Thinking…
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>

            <form
              onSubmit={handleSend}
              className="border-t border-app-border bg-app-surface p-3"
            >
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask Wise Assistant..."
                  className="min-w-0 flex-1 rounded-xl border border-app-border bg-app-bg px-3 py-2 text-sm text-app-text placeholder:text-app-muted focus:outline-none focus:ring-2 focus:ring-app-primary"
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-xl bg-app-primary px-3 py-2 text-sm font-semibold text-white hover:bg-app-primaryHover disabled:opacity-60"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full border border-app-border bg-app-surface shadow-xl transition hover:scale-105"
        aria-label={open ? "Close Wise Assistant" : "Open Wise Assistant"}
      >
        <img
          src={owlLogo}
          alt="Wise Assistant"
          className="h-10 w-10 rounded-full"
        />
      </button>
    </>
  );
}