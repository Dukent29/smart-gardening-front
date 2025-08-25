// components/SimpleChatBot.jsx
import { useState, useRef, useEffect } from "react";
import { FiSend } from "react-icons/fi";

const questions = [
  "Care tips",
  "Growing conditions",
  "Disease and pest treatment",
  "Is it edible?",
  "Is it weedy?",
  "When does it flower?"
];

const answers = {
  "Care tips": "Water regularly but avoid overwatering. Place in indirect sunlight.",
  "Growing conditions": "Prefers moist, well-drained soil and mild temperatures.",
  "Disease and pest treatment": "Use natural remedies or mild pesticides. Keep leaves dry.",
  "Is it edible?": "Some species are, others aren’t. Always verify before consuming!",
  "Is it weedy?": "It can be invasive in certain areas. Monitor its growth.",
  "When does it flower?": "Usually during spring and summer, depending on the species."
};

export default function SimpleChatBot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const handleSend = () => {
    if (!input.trim()) return;
    const botReply = answers[input.trim()] || "I’m still learning! 🤖";
    setMessages((prev) => [
      ...prev,
      { from: "user", text: input },
      { from: "bot", text: botReply }
    ]);
    setInput("");
  };

  const handleQuestionClick = (question) => {
    setInput(question);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] bg-white rounded-lg shadow relative px-4 py-4">

      {/* Question Chips */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
        {questions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleQuestionClick(q)}
            className="border text-sm text-gray-700 rounded-md px-3 py-2 hover:bg-green-50 transition"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Chat Zone */}
      <div className="flex-1 overflow-y-auto space-y-2 pb-24">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`max-w-[80%] px-4 py-2 rounded-xl text-sm ${
              msg.from === "user"
                ? "bg-green-100 self-end ml-auto text-gray-700"
                : "bg-gray-100 self-start mr-auto text-gray-700"
            }`}
          >
            {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Bottom Input */}
      <div className="absolute bottom-0 left-0 right-0 px-4 py-3 bg-white border-t flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Pose ta question ici..."
          className="flex-1 px-4 py-2 border rounded-full text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button
          onClick={handleSend}
          className="bg-green-600 hover:bg-green-700 text-white rounded-full p-2"
        >
          <FiSend />
        </button>
      </div>
    </div>
  );
}
