import React, { useState } from "react";
import owlLogo from "../assets/owl-logo.png";

export default function Chat() {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hi! I’m WiseCents, your personal finance assistant. Ask me anything about your spending, saving, or goals!",
    },
  ]);

  const [input, setInput] = useState("");

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);

    // Add delayed "AI" response
    setTimeout(() => {
      const botReply = { sender: "bot", text: generateBotResponse(input) };
      setMessages((prev) => [...prev, botReply]);
    }, 1000);

    setInput("");
  };

  const generateBotResponse = (message) => {
    const lower = message.toLowerCase();

    if (lower.includes("summary") || lower.includes("report")) {
      return "📊 Based on your activity this month, you’ve saved around $230 and spent mostly on food and transport.";
    } else if (lower.includes("save")) {
      return "💡 Try setting a weekly savings goal! Would you like help setting one?";
    } else if (lower.includes("spend")) {
      return "🧾 Your top spending category last week was dining out — consider home cooking to save ~$50 monthly!";
    } else if (lower.includes("goal")) {
      return "🎯 Let’s set a goal! How much do you want to save this month?";
    } else if (lower.includes("hi") || lower.includes("hello")) {
      return "👋 Hello again! How can I help you manage your finances today?";
    } else {
      return "🤖 I’m still learning! Try asking about your ‘summary’, ‘savings’, or ‘spending habits’.";
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
            className={`flex items-end ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            
            {msg.sender === "bot" && (
              <img
                src={owlLogo}
                alt="WiseCents Bot"
                className="w-12 h-12 rounded-full mr-2 border border-gray-200"
              />
            )}

            {/* Message bubble */}
            <div
              className={`max-w-xs md:max-w-md px-4 py-2 rounded-2xl text-sm shadow ${
                msg.sender === "user"
                  ? "bg-wiseyellow text-black rounded-br-none"
                  : "bg-white border border-gray-200 rounded-bl-none"
              }`}
            >
              {msg.text}
            </div>

            {/* Optional placeholder for alignment */}
            {msg.sender === "user" && <div className="w-8" />}
          </div>
        ))}
      </div>

      {/* Input Area */}
      <form
        onSubmit={handleSend}
        className="p-4 bg-white border-t border-gray-200 flex gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask WiseCents something..."
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-wisegreen"
        />
        <button
          type="submit"
          className="bg-wisegreen text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
        >
          Send
        </button>
      </form>
    </div>
  );
}
