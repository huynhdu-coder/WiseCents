import { useState } from "react";
import { useLocation } from "react-router-dom";
import owlLogo from "../assets/owl-logo.png";
import ReactMarkdown from "react-markdown";

export default function AIChatWidget() {
  const location = useLocation();
  
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi! I’m WiseCents 🦉 How can I help?" }
  ]);
  const [input, setInput] = useState("");

  if (location.pathname === "/dashboard/chat") {
    return null;
  }

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userText = input;
    const userMsg = { sender: "user", text: userText };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: userText }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text:
              data?.error ||
              data?.message ||
              "I ran into a server error while answering that.",
          },
        ]);
        return;
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: data.reply || "I couldn't generate a response.",
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "I can’t reach the backend right now.",
        },
      ]);
    }
  };

  return (
    <>
      {/* Floating Owl Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 bg-white p-3 rounded-full shadow-lg"
      >
        <img src={owlLogo} className="w-12 h-12" alt="WiseCents AI Assistant" />
      </button>

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-24 right-6 w-80 h-[32rem] bg-white rounded-xl shadow-xl flex flex-col z-50 overflow-hidden">
          <div className="bg-wisegreen text-white p-3 font-semibold">
            WiseCents AI
          </div>

          <div className="flex-1 p-3 overflow-y-auto space-y-2 text-sm">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] px-3 py-2 rounded-lg ${
                    m.sender === "user"
                      ? "bg-wisegreen text-white"
                      : "bg-gray-100 text-gray-900"
                  }`}
                >
                  <ReactMarkdown>{m.text}</ReactMarkdown>
                </div>
              </div>
            ))}
          </div>

          <div className="p-2 border-t flex gap-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              className="flex-1 border rounded px-2"
              placeholder="Ask about spending, goals..."
            />
            <button onClick={sendMessage} className="text-wisegreen font-bold">
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}