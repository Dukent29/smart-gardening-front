import { useEffect, useMemo, useRef, useState } from "react";
import { FiSend, FiChevronDown, FiClock, FiCopy, FiCheck } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";


const speciesData = {
  Rose: {
    questions: [
      "Conseils d'entretien",
      "Conditions de croissance",
      "Quand fleurit-elle ?",
      "Comment tailler ?",
    ],
    answers: {
      "Conseils d'entretien":
        "Arrosez régulièrement mais évitez de mouiller les feuilles. Placez-la en plein soleil.",
      "Conditions de croissance": "Préfère un sol bien drainé et beaucoup de lumière.",
      "Quand fleurit-elle ?": "Les roses fleurissent généralement au printemps et en été.",
      "Comment tailler ?":
        "Taillez les tiges mortes ou faibles en fin d'hiver pour favoriser la croissance.",
    },
  },
  Cactus: {
    questions: [
      "Conseils d'entretien",
      "À quelle fréquence arroser ?",
      "A-t-il besoin de lumière ?",
      "Est-il comestible ?",
    ],
    answers: {
      "Conseils d'entretien":
        "Arrosez avec parcimonie et assurez un bon drainage. Évitez l'excès d'eau.",
      "À quelle fréquence arroser ?": "Arrosez une fois toutes les 2-3 semaines, selon la saison.",
      "A-t-il besoin de lumière ?": "Oui, placez-le dans une lumière vive et indirecte.",
      "Est-il comestible ?":
        "Certaines espèces sont comestibles, mais vérifiez avant de consommer.",
    },
  },
  Tulipe: {
    questions: [
      "Conseils d'entretien",
      "Quand fleurit-elle ?",
      "Comment planter les bulbes ?",
      "A-t-elle besoin d'engrais ?",
    ],
    answers: {
      "Conseils d'entretien":
        "Gardez le sol humide mais pas détrempé. Placez-la en plein ou partiel soleil.",
      "Quand fleurit-elle ?": "Les tulipes fleurissent au début du printemps.",
      "Comment planter les bulbes ?":
        "Plantez les bulbes à l'automne, à 15-20 cm de profondeur dans un sol bien drainé.",
      "A-t-elle besoin d'engrais ?":
        "Utilisez un engrais équilibré lors de la plantation des bulbes.",
    },
  },
  Orchidée: {
    questions: [
      "Conseils d'entretien",
      "Comment arroser ?",
      "A-t-elle besoin d'humidité ?",
      "Quand fleurit-elle ?",
    ],
    answers: {
      "Conseils d'entretien":
        "Placez-la dans une lumière vive mais indirecte. Évitez le soleil direct.",
      "Comment arroser ?":
        "Arrosez une fois par semaine, en laissant le substrat sécher légèrement entre deux arrosages.",
      "A-t-elle besoin d'humidité ?": "Oui, les orchidées aiment une atmosphère humide.",
      "Quand fleurit-elle ?":
        "Les orchidées fleurissent généralement une fois par an, selon l'espèce.",
    },
  },
  Basilic: {
    questions: [
      "Conseils d'entretien",
      "Comment récolter ?",
      "A-t-il besoin de soleil ?",
      "À quelle fréquence arroser ?",
    ],
    answers: {
      "Conseils d'entretien": "Gardez le sol humide et placez-le en plein soleil.",
      "Comment récolter ?":
        "Pincez régulièrement les feuilles pour favoriser la croissance.",
      "A-t-il besoin de soleil ?":
        "Oui, le basilic a besoin d'au moins 6 à 8 heures de soleil par jour.",
      "À quelle fréquence arroser ?": "Arrosez lorsque le dessus du sol est sec.",
    },
  },
  Fougère: {
    questions: [
      "Conseils d'entretien",
      "A-t-elle besoin de soleil ?",
      "Comment la garder en bonne santé ?",
      "A-t-elle besoin d'humidité ?",
    ],
    answers: {
      "Conseils d'entretien":
        "Gardez le sol constamment humide et placez-la à la lumière indirecte.",
      "A-t-elle besoin de soleil ?": "Les fougères préfèrent la lumière indirecte ou filtrée.",
      "Comment la garder en bonne santé ?":
        "Brumisez régulièrement et évitez que le sol ne sèche complètement.",
      "A-t-elle besoin d'humidité ?": "Oui, les fougères aiment une atmosphère humide.",
    },
  },
  Lavande: {
    questions: [
      "Conseils d'entretien",
      "Comment tailler ?",
      "A-t-elle besoin d'engrais ?",
      "Quand fleurit-elle ?",
    ],
    answers: {
      "Conseils d'entretien":
        "Plantez dans un sol bien drainé et placez en plein soleil.",
      "Comment tailler ?":
        "Taillez après la floraison pour maintenir la forme et encourager la croissance.",
      "A-t-elle besoin d'engrais ?":
        "La lavande n'a pas besoin de beaucoup d'engrais. Utilisez un engrais pauvre en azote si nécessaire.",
      "Quand fleurit-elle ?": "La lavande fleurit de la fin du printemps au début de l'été.",
    },
  },
  Menthe: {
    questions: [
      "Conseils d'entretien",
      "Comment récolter ?",
      "Se propage-t-elle rapidement ?",
      "À quelle fréquence arroser ?",
    ],
    answers: {
      "Conseils d'entretien": "Gardez le sol humide et placez-la à la mi-ombre.",
      "Comment récolter ?":
        "Pincez régulièrement les feuilles pour favoriser une croissance touffue.",
      "Se propage-t-elle rapidement ?":
        "Oui, la menthe se propage rapidement. Plantez-la en pot pour contrôler sa croissance.",
      "À quelle fréquence arroser ?": "Arrosez lorsque le dessus du sol est sec.",
    },
  },
};

// Utility — tiny date formatter
function formatTime(date) {
  try {
    return new Intl.DateTimeFormat(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  } catch {
    return date.toLocaleTimeString();
  }
}

// Logic isolated for testability
export function getBotReply(species, question) {
  const reply = speciesData?.[species]?.answers?.[question];
  return reply || "Je suis encore en train d'apprendre sur cette espèce ! 🤖";
}

// Lightweight runtime tests (browser only)
try {
  if (typeof window !== "undefined") {
    console.assert(
      getBotReply("Rose", "Conseils d'entretien").toLowerCase().includes("arrosez"),
      "Test: Rose conseils should mention arrosez"
    );
    console.assert(
      getBotReply("Rose", "Question inconnue").includes("apprendre"),
      "Test: unknown question should fall back"
    );
    console.assert(
      getBotReply("Inconnue", "Peu importe").includes("apprendre"),
      "Test: unknown species should fall back"
    );
  }
} catch (_) {}

export default function SimpleChatBot() {
  const [species, setSpecies] = useState("");
  const [openSelect, setOpenSelect] = useState(false);
  const [selectQuery, setSelectQuery] = useState("");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const scrollRef = useRef(null);
  const bottomRef = useRef(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [showTypeahead, setShowTypeahead] = useState(false);

  // Filter species list via search box in custom select
  const speciesOptions = useMemo(() => Object.keys(speciesData), []);
  const filteredSpecies = useMemo(() => {
    const q = selectQuery.trim().toLowerCase();
    if (!q) return speciesOptions;
    return speciesOptions.filter((s) => s.toLowerCase().includes(q));
  }, [speciesOptions, selectQuery]);

  // Build typeahead suggestions from questions of current species
  const typeahead = useMemo(() => {
    if (!species || !input.trim()) return [];
    const q = input.trim().toLowerCase();
    const list = speciesData[species]?.questions || [];
    const score = (cand) => {
      const c = cand.toLowerCase();
      if (c.includes(q)) return 2; // best
      const qt = new Set(q.split(/\s+/));
      const ct = new Set(c.split(/\s+/));
      const inter = [...qt].filter((t) => ct.has(t)).length;
      return inter / Math.max(1, qt.size);
    };
    return list
      .map((cand) => ({ cand, s: score(cand) }))
      .filter((o) => o.s >= 0.5)
      .sort((a, b) => b.s - a.s)
      .slice(0, 4)
      .map((o) => o.cand);
  }, [species, input]);

  // Auto-scroll behavior
  useEffect(() => {
    if (isAtBottom) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isBotTyping, isAtBottom]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 40;
      setIsAtBottom(nearBottom);
    };
    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const pushMessage = (from, text) => {
    setMessages((prev) => [...prev, { from, text, at: new Date() }]);
  };

  const handleSend = () => {
    const value = input.trim();
    if (!value) return;

    if (!species) {
      pushMessage("user", value);
      pushMessage("bot", "Veuillez d'abord sélectionner une espèce de plante.");
      setInput("");
      setShowTypeahead(false);
      return;
    }

    pushMessage("user", value);
    setInput("");
    setShowTypeahead(false);

    setIsBotTyping(true);
    const reply = getBotReply(species, value);

    setTimeout(() => {
      pushMessage("bot", reply);
      setIsBotTyping(false);
    }, Math.min(900 + Math.random() * 600, 1600));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuestionClick = (q) => setInput(q);

  const copyMessage = async (idx) => {
    try {
      await navigator.clipboard.writeText(messages[idx].text);
      setCopiedIndex(idx);
      setTimeout(() => setCopiedIndex(null), 1200);
    } catch {}
  };

  return (
    <div className="flex flex-col h-[calc(100vh-180px)] bg-white/70 backdrop-blur rounded-b-3xl shadow-xl relative p-4 sm:p-6 border border-green-100">
      {/* Header */}
      <div className="flex items-center justify-between pb-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-green-100 grid place-items-center text-green-700 font-semibold">🤖</div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Plant Helper</h2>
            <p className="text-xs text-gray-500">Chat bot jardinage — réponses rapides</p>
          </div>
        </div>
      </div>

      {/* Custom Select (modern, smooth) */}
      <div className="relative mb-4">
        <button
          type="button"
          onClick={() => setOpenSelect((v) => !v)}
          className="w-full flex items-center justify-between rounded-2xl border border-green-200 bg-white px-4 py-3 text-sm text-gray-800 shadow-sm transition focus:outline-none focus:ring-2 focus:ring-green-500/50 hover:border-green-300"
        >
          <span className="truncate">{species ? species : "— Choisir une espèce —"}</span>
          <FiChevronDown className={`transition ${openSelect ? "rotate-180" : ""}`} />
        </button>
        <AnimatePresence>
          {openSelect && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.16 }}
              className="absolute z-20 mt-2 w-full rounded-2xl border border-green-200 bg-white shadow-xl overflow-hidden"
            >
              <div className="p-2">
                <input
                  autoFocus
                  value={selectQuery}
                  onChange={(e) => setSelectQuery(e.target.value)}
                  placeholder="Rechercher une espèce…"
                  className="w-full rounded-xl border border-green-300 px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500/40"
                />
              </div>
              <div className="max-h-56 overflow-y-auto py-1">
                {filteredSpecies.map((sp) => (
                  <button
                    key={sp}
                    onClick={() => {
                      setSpecies(sp);
                      setOpenSelect(false);
                      setSelectQuery("");
                    }}
                    className={`w-full text-left px-4 py-2 text-sm transition flex items-center gap-2 ${species === sp ? "bg-green-50 font-medium" : "hover:bg-green-50"}`}
                  >
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span className="text-gray-800">{sp}</span>
                  </button>
                ))}
                {filteredSpecies.length === 0 && (
                  <div className="px-4 py-6 text-sm text-gray-500">Aucun résultat</div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Suggested Questions as compact rounded chips */}
      {species && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
          {speciesData[species].questions.map((q) => (
            <button
              key={q}
              title={q}
              onClick={() => handleQuestionClick(q)}
              className="rounded-full border border-green-200 bg-white text-gray-700 text-xs px-3 py-1.5 hover:bg-green-50 transition shadow-sm"
            >
              {q} {/* Display the full question */}
            </button>
          ))}
        </div>
      )}

      {/* Chat area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto rounded-2xl bg-gradient-to-b from-white to-green-50/40 p-3 sm:p-4 space-y-2">
        {messages.map((msg, idx) => {
          const isUser = msg.from === "user";
          return (
            <div key={idx} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
              {!isUser && (
                <div className="mr-2 mt-1 h-7 w-7 shrink-0 rounded-2xl bg-green-100 grid place-items-center text-green-700 text-xs">B</div>
              )}
              <div className={`group max-w-[80%] sm:max-w-[70%] ${isUser ? "items-end" : "items-start"} flex flex-col`}>
                <motion.div
                  initial={{ opacity: 0, y: 4, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={`${isUser ? "bg-emerald-500 text-white" : "bg-white text-gray-800 border border-green-100"} relative rounded-3xl px-4 py-2 shadow-md break-words`}
                >
                  <p className="text-[14px] leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                  {/* Copy button */}
                  <button
                    onClick={() => copyMessage(idx)}
                    className={`absolute -bottom-4 ${isUser ? "right-3" : "left-3"} opacity-0 group-hover:opacity-100 transition bg-white border border-green-200 text-gray-700 rounded-full px-2 py-0.5 text-[10px] shadow`}
                    title="Copier"
                  >
                    {copiedIndex === idx ? (
                      <span className="inline-flex items-center gap-1"><FiCheck /> Copié</span>
                    ) : (
                      <span className="inline-flex items-center gap-1"><FiCopy /> Copier</span>
                    )}
                  </button>
                </motion.div>
                {/* Timestamp */}
                <div className={`mt-1 flex items-center gap-1 text-[10px] ${isUser ? "text-emerald-900/80" : "text-gray-500"}`}>
                  <FiClock />
                  <span>{formatTime(msg.at)}</span>
                </div>
              </div>
            </div>
          );
        })}

        {/* Typing indicator */}
        <AnimatePresence>
          {isBotTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-start"
            >
              <div className="mr-2 mt-1 h-7 w-7 shrink-0 rounded-2xl bg-green-100 grid place-items-center text-green-700 text-xs">B</div>
              <div className="rounded-3xl border border-green-100 bg-white px-4 py-2 text-sm text-gray-800 shadow-md">
                <span className="inline-flex gap-1">
                  <span className="inline-block h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.2s]"></span>
                  <span className="inline-block h-2 w-2 animate-bounce rounded-full bg-gray-400"></span>
                  <span className="inline-block h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:0.2s]"></span>
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={bottomRef} />
      </div>

      {/* Scroll-to-bottom helper */}
      <AnimatePresence>
        {!isAtBottom && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            onClick={() => bottomRef.current?.scrollIntoView({ behavior: "smooth" })}
            className="absolute right-5 bottom-24 rounded-full bg-white border border-green-200 shadow-lg px-3 py-2 text-xs text-gray-700 hover:bg-green-50"
          >
            Revenir en bas
          </motion.button>
        )}
      </AnimatePresence>

      {/* Composer with typeahead */}
      <div className="mt-3 relative">
        <div className="rounded-3xl border border-green-200 bg-white shadow-sm">
          <div className="flex items-center gap-2 p-2">
            <textarea
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setShowTypeahead(!!e.target.value);
                const el = e.target;
                el.style.height = "auto";
                el.style.height = Math.min(el.scrollHeight, 96) + "px";
              }}
              onFocus={() => setShowTypeahead(!!input)}
              onBlur={() => setTimeout(() => setShowTypeahead(false), 120)}
              onKeyDown={handleKeyDown}
              placeholder="Pose ta question… (Entrée pour envoyer, Shift+Entrée pour ligne)"
              rows={1}
              className="flex-1 resize-none rounded-2xl px-4 py-2 text-[14px] text-gray-800 placeholder:text-gray-400 focus:outline-none overflow-y-hidden leading-6"
            />
            <button
              onClick={handleSend}
              className="rounded-2xl bg-emerald-500 px-3 py-2 text-white shadow hover:bg-emerald-600 active:scale-[0.99]"
              aria-label="Envoyer"
            >
              <FiSend />
            </button>
          </div>
        </div>
        {/* Typeahead panel */}
        <AnimatePresence>
          {showTypeahead && species && typeahead.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              className="absolute left-2 right-2 -top-2 translate-y-[-100%] rounded-2xl border border-green-200 bg-white shadow-xl overflow-hidden z-10"
            >
              <div className="p-2 text-xs text-gray-500">Suggestions</div>
              <ul className="max-h-48 overflow-y-auto">
                {typeahead.map((s) => (
                  <li key={s}>
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => setInput(s)}
                      className="w-full text-left px-4 py-2 text-sm text-gray-500 hover:bg-green-50"
                    >
                      {s}
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
