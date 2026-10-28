import { useState, useEffect, useRef } from "react";
import {
  Bot,
  Send,
  Sparkles,
  User,
  Settings,
  Trash2,
  Key,
  Check,
  ExternalLink,
  X,
  HelpCircle,
  RefreshCw,
  Cpu,
} from "lucide-react";
import api, { getErrorMessage } from "../../services/api";

const QUICK_TOPICS = [
  {
    category: "उर्वरक",
    en: "What is the recommended fertilizer (NPK) dose for sugarcane?",
    hi: "गन्ने के लिए खाद और NPK की क्या मात्रा और समय है?",
    label: "🧪 खाद व NPK शेड्यूल",
  },
  {
    category: "रोग",
    en: "How can I identify and prevent Red Rot disease?",
    hi: "लाल सड़न (Red Rot) रोग के लक्षण और बचाव क्या हैं?",
    label: "🩺 लाल सड़न (Red Rot) बचाव",
  },
  {
    category: "किस्में",
    en: "Which sugarcane varieties should replace Co 0238?",
    hi: "Co 0238 की जगह कौन सी नई किस्में लगानी चाहिए?",
    label: "🌱 Co 0118 व Co 15023 किस्में",
  },
  {
    category: "बुवाई",
    en: "How to plant sugarcane using the trench method?",
    hi: "ट्रेंच विधि से गन्ना बुवाई कैसे करें और क्या लाभ हैं?",
    label: "🚜 ट्रेंच विधि बुवाई",
  },
  {
    category: "कीट",
    en: "What medicine should be used for Shoot Borer and Termites?",
    hi: "कंसुआ (Shoot Borer) और दीमक के लिए कौन सी दवा डालें?",
    label: "🐛 कंसुआ व दीमक की दवा",
  },
  {
    category: "सिंचाई",
    en: "When is irrigation most critical for sugarcane?",
    hi: "गन्ने में सबसे जरूरी सिंचाई कब करनी चाहिए?",
    label: "💧 फॉर्मेटिव सिंचाई समय",
  },
  {
    category: "पर्ची",
    en: "What is the status of my sugarcane supply ticket?",
    hi: "मेरी गन्ना सप्लाई पर्ची का क्या स्टेटस है?",
    label: "🎫 मेरी पर्ची स्थिति",
  },
  {
    category: "भुगतान",
    en: "How much payment is pending from the sugar mill?",
    hi: "चीनी मिल से मेरा कितना भुगतान बकाया है?",
    label: "💰 भुगतान बैलेंस",
  },
];

// Helper to format AI replies with bold headers and bullet points
function FormattedMessage({ text }) {
  if (!text) return null;
  const lines = text.split("\n");

  return (
    <div className="space-y-1.5 text-sm leading-relaxed">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={idx} className="h-1.5" />;
        }

        // Parse **bold** markdown segments
        const parts = line.split(/(\*\*.*?\*\*)/g);
        const renderedLine = parts.map((part, pIdx) => {
          if (part.startsWith("**") && part.endsWith("**")) {
            return (
              <strong key={pIdx} className="font-semibold text-gray-900">
                {part.slice(2, -2)}
              </strong>
            );
          }
          return part;
        });

        // Bullet point
        if (trimmed.startsWith("• ") || trimmed.startsWith("- ")) {
          return (
            <div key={idx} className="flex items-start gap-2 pl-1 my-1">
              <span className="text-brand-600 font-bold select-none">•</span>
              <div className="flex-1">{renderedLine.slice(1)}</div>
            </div>
          );
        }

        // Numbered list item
        if (/^\d+\.\s/.test(trimmed)) {
          const match = trimmed.match(/^(\d+\.)\s(.*)$/);
          return (
            <div key={idx} className="flex items-start gap-2 pl-1 my-1">
              <span className="font-bold text-brand-700 shrink-0 select-none">
                {match ? match[1] : ""}
              </span>
              <div className="flex-1">
                {match
                  ? match[2].split(/(\*\*.*?\*\*)/g).map((part, pIdx) =>
                      part.startsWith("**") && part.endsWith("**") ? (
                        <strong key={pIdx} className="font-semibold text-gray-900">
                          {part.slice(2, -2)}
                        </strong>
                      ) : (
                        part
                      )
                    )
                  : renderedLine}
              </div>
            </div>
          );
        }

        return (
          <p key={idx} className="my-0.5">
            {renderedLine}
          </p>
        );
      })}
    </div>
  );
}

export default function FarmerAssistant() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "नमस्ते! मैं आपका एग्रोकेन 360 कृषि सलाहकार (AI Advisor) हूँ।\n\nआप मुझसे गन्ने की बुवाई, उन्नत किस्में (Co 0118, Co 15023), खाद (NPK), रोग (लाल सड़न/पोक्का बोइंग), कीट (कंसुआ/दीमक), सिंचाई या अपनी पर्ची व भुगतान से जुड़ा कोई भी सवाल सीधे नीचे टाइप करके पूछ सकते हैं!",
      source: "engine",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [input, setInput] = useState("");
  const [language, setLanguage] = useState("hi");
  const [loading, setLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [aiConfig, setAiConfig] = useState({ hasApiKey: false, provider: "gemini" });
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [savingKey, setSavingKey] = useState(false);
  const [keySaveMessage, setKeySaveMessage] = useState("");

  const messagesEndRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Load AI configuration status
  useEffect(() => {
    api
      .get("/ai/config")
      .then((res) => {
        if (res.data?.success) {
          setAiConfig(res.data);
        }
      })
      .catch(() => {});
  }, []);

  const handleSend = async (textToSend) => {
    const q = (textToSend || input).trim();
    if (!q || loading) return;

    const userMsg = {
      role: "user",
      text: q,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await api.post("/ai/agricultural-assistant", {
        query: q,
        language,
      });

      const aiMsg = {
        role: "assistant",
        text: res.data.reply,
        source: res.data.source || "engine",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      const errorMsg = {
        role: "assistant",
        text: `माफ़ कीजिए, उत्तर प्राप्त नहीं हो सका: ${getErrorMessage(err)}`,
        source: "error",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveApiKey = async (e) => {
    e.preventDefault();
    if (!apiKeyInput.trim()) return;

    setSavingKey(true);
    setKeySaveMessage("");

    try {
      const res = await api.post("/ai/config", { apiKey: apiKeyInput.trim() });
      setAiConfig((prev) => ({ ...prev, hasApiKey: true }));
      setKeySaveMessage(res.data.message || "Gemini API Key configured successfully!");
      setApiKeyInput("");
      setTimeout(() => setShowSettings(false), 2000);
    } catch (err) {
      setKeySaveMessage(`Error: ${getErrorMessage(err)}`);
    } finally {
      setSavingKey(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        role: "assistant",
        text: "बातचीत रीसेट हो गई है। आप गन्ना फसल या चीनी मिल से संबंधित कोई भी नया सवाल पूछ सकते हैं!",
        source: "engine",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  };

  return (
    <div className="mx-auto flex h-[calc(100vh-8.5rem)] max-w-4xl flex-col rounded-3xl border border-brand-100 bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between border-b border-gray-100 bg-white px-6 py-3.5 gap-3">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-gradient-to-tr from-brand-700 to-brand-500 p-2.5 text-white shadow-sm">
            <Bot className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-gray-900 text-base">AgroCane AI Advisor</h1>
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${
                  aiConfig.hasApiKey
                    ? "bg-purple-50 text-purple-700 border border-purple-200"
                    : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                }`}
              >
                <Cpu className="h-3 w-3" />
                {aiConfig.hasApiKey ? "Gemini 1.5 Flash" : "Agronomy Engine v2"}
              </span>
            </div>
            <p className="text-xs text-gray-500">
              गन्ना कृषि वैज्ञानिक व मिल सहायक (Ask any question in Hindi or English)
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {/* Language Switch */}
          <div className="flex items-center rounded-xl bg-gray-100 p-1 text-xs font-semibold">
            <button
              onClick={() => setLanguage("hi")}
              className={`rounded-lg px-2.5 py-1 transition ${
                language === "hi"
                  ? "bg-white text-brand-700 shadow-xs"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              हिन्दी
            </button>
            <button
              onClick={() => setLanguage("en")}
              className={`rounded-lg px-2.5 py-1 transition ${
                language === "en"
                  ? "bg-white text-brand-700 shadow-xs"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              English
            </button>
          </div>

          {/* AI Settings Button */}
          <button
            onClick={() => setShowSettings(true)}
            title="AI Engine / Gemini API Settings"
            className="flex items-center gap-1 rounded-xl border border-gray-200 p-2 text-xs font-medium text-gray-600 hover:bg-gray-50 transition"
          >
            <Settings className="h-4 w-4" />
          </button>

          {/* Clear Chat Button */}
          <button
            onClick={handleClearChat}
            title="Clear Chat History"
            className="flex items-center gap-1 rounded-xl border border-gray-200 p-2 text-xs font-medium text-gray-600 hover:bg-gray-50 hover:text-red-600 transition"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 space-y-4 overflow-y-auto p-6 bg-gradient-to-b from-gray-50/40 via-white to-white">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-3 ${
              m.role === "user" ? "flex-row-reverse" : ""
            }`}
          >
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-bold shadow-xs ${
                m.role === "user"
                  ? "bg-brand-700 text-white"
                  : "bg-brand-100 text-brand-800"
              }`}
            >
              {m.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
            </div>
            <div
              className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed shadow-xs ${
                m.role === "user"
                  ? "bg-brand-600 text-white"
                  : "bg-white text-gray-800 border border-gray-100"
              }`}
            >
              {m.role === "user" ? (
                <p className="whitespace-pre-wrap font-medium">{m.text}</p>
              ) : (
                <FormattedMessage text={m.text} />
              )}
              <div className="mt-2 flex items-center justify-between gap-3 text-[10px]">
                {m.role === "assistant" && (
                  <span className="text-gray-400 font-medium">
                    {m.source === "gemini" ? "✨ Gemini 1.5 Flash" : "🌾 AgroCane Agronomy Engine"}
                  </span>
                )}
                <span className={`block ml-auto ${m.role === "user" ? "text-brand-200" : "text-gray-400"}`}>
                  {m.time}
                </span>
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-100 text-brand-800">
              <Bot className="h-4 w-4" />
            </div>
            <div className="rounded-2xl border border-gray-100 bg-white p-4 text-sm text-gray-600 shadow-xs flex items-center gap-2">
              <RefreshCw className="h-4 w-4 animate-spin text-brand-600" />
              <span>आपके प्रश्न का विश्लेषण कर समाधान तैयार किया जा रहा है...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Topics Bar */}
      <div className="border-t border-gray-100 bg-gray-50/70 px-5 py-2.5">
        <div className="flex items-center justify-between mb-1.5">
          <p className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
            <Sparkles className="h-3 w-3 text-amber-500" /> तुरंत पूछें (Quick Suggestions)
          </p>
          <span className="text-[11px] text-gray-400">या सीधे नीचे अपना प्रश्न टाइप करें 👇</span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {QUICK_TOPICS.map((s, i) => (
            <button
              key={i}
              onClick={() => handleSend(language === "hi" ? s.hi : s.en)}
              className="shrink-0 rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-xs text-gray-700 hover:border-brand-400 hover:bg-brand-50 hover:text-brand-800 transition"
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2 border-t border-gray-100 p-3.5 bg-white"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            language === "hi"
              ? "गन्ना फसल, खाद, रोग, दवा, किस्में, पर्ची या भुगतान से जुड़ा कोई भी सवाल पूछें..."
              : "Ask any question about sugarcane, diseases, fertilizer, varieties, tickets, or payments..."
          }
          className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="inline-flex items-center gap-1.5 rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-brand-700 disabled:opacity-50 transition"
        >
          <Send className="h-4 w-4" /> भेजें (Send)
        </button>
      </form>

      {/* AI Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl border border-gray-100 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-brand-600" />
                <h2 className="font-bold text-gray-900 text-base">AI Engine Settings</h2>
              </div>
              <button
                onClick={() => setShowSettings(false)}
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-gray-600">
              <div className="rounded-xl bg-brand-50/60 p-3 border border-brand-100">
                <p className="font-semibold text-brand-900 mb-1">⚡ Dual-Core AI Architecture:</p>
                <p>
                  1. <strong>AgroCane Agronomy Engine v2:</strong> Always active offline with verified scientific sugarcane pathology, NPK nutrition, pest controls, and mill ticket/payment logic.
                </p>
                <p className="mt-1">
                  2. <strong>Google Gemini 1.5 Flash:</strong> Connects to cloud generative AI to answer ANY custom or nuanced farmer questions.
                </p>
              </div>

              <div>
                <span className="font-medium text-gray-700">Current AI Mode: </span>
                <span className="font-bold text-brand-700">
                  {aiConfig.hasApiKey ? "✨ Google Gemini 1.5 Active" : "🌾 Built-in Agronomy Engine Active"}
                </span>
              </div>

              <form onSubmit={handleSaveApiKey} className="space-y-2 pt-1">
                <label className="block font-medium text-gray-700">
                  Google Gemini API Key (Optional):
                </label>
                <div className="flex gap-2">
                  <input
                    type="password"
                    value={apiKeyInput}
                    onChange={(e) => setApiKeyInput(e.target.value)}
                    placeholder="AIzaSy..."
                    className="flex-1 rounded-xl border px-3 py-2 text-xs focus:border-brand-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={savingKey || !apiKeyInput.trim()}
                    className="rounded-xl bg-brand-600 px-4 py-2 font-semibold text-white hover:bg-brand-700 disabled:opacity-50"
                  >
                    {savingKey ? "Saving..." : "Save Key"}
                  </button>
                </div>
                <p className="text-[11px] text-gray-400 flex items-center gap-1">
                  You can get a free Gemini API key at{" "}
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noreferrer"
                    className="text-brand-600 hover:underline inline-flex items-center gap-0.5"
                  >
                    Google AI Studio <ExternalLink className="h-2.5 w-2.5" />
                  </a>
                </p>
              </form>

              {keySaveMessage && (
                <div className="rounded-xl bg-emerald-50 p-2.5 text-xs text-emerald-800 border border-emerald-200">
                  {keySaveMessage}
                </div>
              )}
            </div>

            <div className="pt-2 text-right border-t">
              <button
                onClick={() => setShowSettings(false)}
                className="rounded-xl bg-gray-100 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
