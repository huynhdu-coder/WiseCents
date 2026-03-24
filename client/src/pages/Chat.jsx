import { API_BASE } from "../config/apiBase";
import { useState } from "react";
import owlLogo from "../assets/owl-logo.png";
import ReactMarkdown from "react-markdown";

export default function Chat() {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hi! I’m WiseCents, your personal finance assistant. Ask me anything about your spending, saving, or goals!",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

   const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const text = input;
    setInput("");

    // add user message immediately
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
          { sender: "bot", text: data?.message || data?.error || "AI request failed." },
        ]);
        return;
      }

      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: data.reply ?? "(No reply returned)" },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Network error calling AI endpoint." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-wisegreen text-white p-4 text-lg font-semibold shadow-md flex items-center gap-2">
        <img src={owlLogo} alt="WiseCents Owl" className="w-12 h-12 rounded-full" />
        WiseCents AI Chat
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex items-end ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.sender === "bot" && (
              <img
                src={owlLogo}
                alt="WiseCents Bot"
                className="w-12 h-12 rounded-full mr-2 border border-gray-200"
              />
            )}

            <div
              className={`max-w-xs md:max-w-md px-4 py-2 rounded-2xl text-sm shadow ${
                msg.sender === "user"
                  ? "bg-wiseyellow text-black rounded-br-none"
                  : "bg-white border border-gray-200 rounded-bl-none"
              }`}
            >
              <ReactMarkdown>{msg.text}</ReactMarkdown>
            </div>

            {msg.sender === "user" && <div className="w-8" />}
          </div>
        ))}

        {loading && (
          <div className="flex items-end justify-start">
            <img
              src={owlLogo}
              alt="WiseCents Bot"
              className="w-12 h-12 rounded-full mr-2 border border-gray-200"
            />
            <div className="bg-white border border-gray-200 px-4 py-2 rounded-2xl text-sm shadow rounded-bl-none">
              Thinking…
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-200 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask WiseCents something..."
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-wisegreen"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-wisegreen text-white px-4 py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-60"
        >
          Send
        </button>
      </form>
    </div>
  );
}