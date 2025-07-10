import { useState } from "react";
import axios from "@/lib/axios";

export default function ChatBotComponent({ accessToken }) {
  const [message, setMessage] = useState('');
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message || !accessToken) return;

    try {
      setLoading(true);
      const res = await axios.post(
        `/chat/ask-question?access_token=${accessToken}`,
        {
          question: message,
          temperature: 0.5,
          app_name: "SmartGardeningBot"
        }
      );

      const answer = res.data?.answer || "❌ Pas de réponse.";
      setResponses((prev) => [...prev, { question: message, answer }]);
      setMessage('');
    } catch (err) {
      console.error(err);
      setResponses((prev) => [...prev, { question: message, answer: "❌ Erreur d’API." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2 max-h-[300px] overflow-y-auto p-2 border rounded">
        {responses.map((res, idx) => (
          <div key={idx}>
            <p className="font-semibold">🧑‍🌾 Vous: {res.question}</p>
            <p className="text-green-700">🤖 Bot: {res.answer}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 border p-2 rounded"
          placeholder="Posez une question sur cette plante..."
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          {loading ? 'Envoi...' : 'Envoyer'}
        </button>
      </div>
    </div>
  );
}
