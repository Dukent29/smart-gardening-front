// components/SimpleChatBot.jsx
import { useState, useRef, useEffect } from "react";
import { FiSend } from "react-icons/fi";

const speciesData = {
  "Rose": {
    questions: [
      "Conseils d'entretien",
      "Conditions de croissance",
      "Quand fleurit-elle ?",
      "Comment tailler ?",
    ],
    answers: {
      "Conseils d'entretien": "Arrosez régulièrement mais évitez de mouiller les feuilles. Placez-la en plein soleil.",
      "Conditions de croissance": "Préfère un sol bien drainé et beaucoup de lumière.",
      "Quand fleurit-elle ?": "Les roses fleurissent généralement au printemps et en été.",
      "Comment tailler ?": "Taillez les tiges mortes ou faibles en fin d'hiver pour favoriser la croissance.",
    },
  },
  "Cactus": {
    questions: [
      "Conseils d'entretien",
      "À quelle fréquence arroser ?",
      "A-t-il besoin de lumière ?",
      "Est-il comestible ?",
    ],
    answers: {
      "Conseils d'entretien": "Arrosez avec parcimonie et assurez un bon drainage. Évitez l'excès d'eau.",
      "À quelle fréquence arroser ?": "Arrosez une fois toutes les 2-3 semaines, selon la saison.",
      "A-t-il besoin de lumière ?": "Oui, placez-le dans une lumière vive et indirecte.",
      "Est-il comestible ?": "Certaines espèces sont comestibles, mais vérifiez avant de consommer.",
    },
  },
  "Tulipe": {
    questions: [
      "Conseils d'entretien",
      "Quand fleurit-elle ?",
      "Comment planter les bulbes ?",
      "A-t-elle besoin d'engrais ?",
    ],
    answers: {
      "Conseils d'entretien": "Gardez le sol humide mais pas détrempé. Placez-la en plein ou partiel soleil.",
      "Quand fleurit-elle ?": "Les tulipes fleurissent au début du printemps.",
      "Comment planter les bulbes ?": "Plantez les bulbes à l'automne, à 15-20 cm de profondeur dans un sol bien drainé.",
      "A-t-elle besoin d'engrais ?": "Utilisez un engrais équilibré lors de la plantation des bulbes.",
    },
  },
  "Orchidée": {
    questions: [
      "Conseils d'entretien",
      "Comment arroser ?",
      "A-t-elle besoin d'humidité ?",
      "Quand fleurit-elle ?",
    ],
    answers: {
      "Conseils d'entretien": "Placez-la dans une lumière vive mais indirecte. Évitez le soleil direct.",
      "Comment arroser ?": "Arrosez une fois par semaine, en laissant le substrat sécher légèrement entre deux arrosages.",
      "A-t-elle besoin d'humidité ?": "Oui, les orchidées aiment une atmosphère humide.",
      "Quand fleurit-elle ?": "Les orchidées fleurissent généralement une fois par an, selon l'espèce.",
    },
  },
  "Basilic": {
    questions: [
      "Conseils d'entretien",
      "Comment récolter ?",
      "A-t-il besoin de soleil ?",
      "À quelle fréquence arroser ?",
    ],
    answers: {
      "Conseils d'entretien": "Gardez le sol humide et placez-le en plein soleil.",
      "Comment récolter ?": "Pincez régulièrement les feuilles pour favoriser la croissance.",
      "A-t-il besoin de soleil ?": "Oui, le basilic a besoin d'au moins 6 à 8 heures de soleil par jour.",
      "À quelle fréquence arroser ?": "Arrosez lorsque le dessus du sol est sec.",
    },
  },
  "Fougère": {
    questions: [
      "Conseils d'entretien",
      "A-t-elle besoin de soleil ?",
      "Comment la garder en bonne santé ?",
      "A-t-elle besoin d'humidité ?",
    ],
    answers: {
      "Conseils d'entretien": "Gardez le sol constamment humide et placez-la à la lumière indirecte.",
      "A-t-elle besoin de soleil ?": "Les fougères préfèrent la lumière indirecte ou filtrée.",
      "Comment la garder en bonne santé ?": "Brumisez régulièrement et évitez que le sol ne sèche complètement.",
      "A-t-elle besoin d'humidité ?": "Oui, les fougères aiment une atmosphère humide.",
    },
  },
  "Lavande": {
    questions: [
      "Conseils d'entretien",
      "Comment tailler ?",
      "A-t-elle besoin d'engrais ?",
      "Quand fleurit-elle ?",
    ],
    answers: {
      "Conseils d'entretien": "Plantez dans un sol bien drainé et placez en plein soleil.",
      "Comment tailler ?": "Taillez après la floraison pour maintenir la forme et encourager la croissance.",
      "A-t-elle besoin d'engrais ?": "La lavande n'a pas besoin de beaucoup d'engrais. Utilisez un engrais pauvre en azote si nécessaire.",
      "Quand fleurit-elle ?": "La lavande fleurit de la fin du printemps au début de l'été.",
    },
  },
  "Menthe": {
    questions: [
      "Conseils d'entretien",
      "Comment récolter ?",
      "Se propage-t-elle rapidement ?",
      "À quelle fréquence arroser ?",
    ],
    answers: {
      "Conseils d'entretien": "Gardez le sol humide et placez-la à la mi-ombre.",
      "Comment récolter ?": "Pincez régulièrement les feuilles pour favoriser une croissance touffue.",
      "Se propage-t-elle rapidement ?": "Oui, la menthe se propage rapidement. Plantez-la en pot pour contrôler sa croissance.",
      "À quelle fréquence arroser ?": "Arrosez lorsque le dessus du sol est sec.",
    },
  },
};

export default function SimpleChatBot() {
  const [species, setSpecies] = useState(""); // Espèce de plante sélectionnée
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const handleSend = () => {
    if (!input.trim()) return;

    if (!species) {
      setMessages((prev) => [
        ...prev,
        { from: "user", text: input },
        { from: "bot", text: "Veuillez d'abord sélectionner une espèce de plante." },
      ]);
      setInput("");
      return;
    }

    const botReply =
      speciesData[species]?.answers[input.trim()] ||
      "Je suis encore en train d'apprendre sur cette espèce ! 🤖";
    setMessages((prev) => [
      ...prev,
      { from: "user", text: input },
      { from: "bot", text: botReply },
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

      {/* Sélection de l'espèce */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Sélectionnez une espèce de plante :
        </label>
        <select
          value={species}
          onChange={(e) => setSpecies(e.target.value)}
          className="w-full px-4 py-2 border rounded-md text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="">-- Choisir une espèce --</option>
          {Object.keys(speciesData).map((sp, idx) => (
            <option key={idx} value={sp}>
              {sp}
            </option>
          ))}
        </select>
      </div>

      {/* Questions suggérées */}
      {species && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
          {speciesData[species].questions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleQuestionClick(q)}
              className="border text-sm text-gray-700 rounded-md px-3 py-2 hover:bg-green-50 transition"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Zone de discussion */}
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

      {/* Champ de saisie */}
      <div className="absolute bottom-0 left-0 right-0 px-4 py-3 bg-white border-t flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Posez votre question ici..."
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
