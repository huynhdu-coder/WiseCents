import { useState } from "react";
import owlLogo from "../assets/owl-logo.png";

export default function AIChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi! I’m WiseCents 🦉 How can I help?" }
  ]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");

    const token = localStorage.getItem("token");

    const res = await fetch(
      "http://localhost:5000/api/ai/chat",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ message: input })
      }
    );

    const data = await res.json();
    setMessages(prev => [...prev, { sender: "bot", text: data.reply }]);
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
        <div className="fixed bottom-24 right-6 w-80 bg-white rounded-xl shadow-xl flex flex-col z-50">
          <div className="bg-wisegreen text-white p-3 font-semibold">
            WiseCents AI
          </div>

          <div className="flex-1 p-3 overflow-y-auto space-y-2 text-sm">
            {messages.map((m, i) => (
              <div key={i} className={m.sender === "user" ? "text-right" : ""}>
                <span className="inline-block bg-gray-100 p-2 rounded">
                  {m.text}
                </span>
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