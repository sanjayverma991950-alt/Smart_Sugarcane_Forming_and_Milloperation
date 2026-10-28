import { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Volume2, VolumeX, Send, Bot, Sparkles, AlertCircle } from "lucide-react";
import api, { getErrorMessage } from "../../services/api";

export default function FarmerVoiceAssistant() {
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [spokenText, setSpokenText] = useState("");
  const [reply, setReply] = useState("");
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [language, setLanguage] = useState("hi"); // Default to Hindi for farmer voice
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = language === "hi" ? "hi-IN" : "en-IN";

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join("");
      setSpokenText(transcript);
    };

    recognition.onerror = (event) => {
      console.warn("Speech recognition error:", event.error);
      setIsListening(false);
      if (event.error === "not-allowed") {
        setError("Microphone permission was denied. Please allow microphone access in your browser.");
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
  }, [language]);

  const toggleListening = () => {
    setError("");
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setSpokenText("");
      setReply("");
      try {
        recognitionRef.current.lang = language === "hi" ? "hi-IN" : "en-IN";
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error("Speech start error:", err);
      }
    }
  };

  const handleAsk = async (queryText) => {
    const textToQuery = queryText || spokenText;
    if (!textToQuery.trim()) return;

    setLoading(true);
    setError("");

    try {
      const res = await api.post("/ai/voice/chat", {
        text: textToQuery,
        language,
      });

      const responseText = res.data.reply;
      setReply(responseText);

      // Auto speak response using SpeechSynthesis (clean up markdown syntax for voice)
      if (autoSpeak && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        const spokenClean = responseText
          .replace(/\*\*/g, "")
          .replace(/[#•\-_]/g, " ")
          .replace(/\s+/g, " ");
        const utterance = new SpeechSynthesisUtterance(spokenClean);
        utterance.lang = language === "hi" ? "hi-IN" : "en-IN";
        window.speechSynthesis.speak(utterance);
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const sampleVoicePrompts = [
    { label: "Mera ticket status?", query: "Mera ticket ka status kya hai?" },
    { label: "Mera pending payment?", query: "Mera payment kitna pending hai?" },
    { label: "Red Rot se bachaav?", query: "Lal sadan rog se bachaav ke liye kya karein?" },
    { label: "Khad aur NPK dose?", query: "Ganne me khad aur NPK kitna aur kab dalein?" },
    { label: "Co 15023 kism?", query: "Ganne ki Co 15023 kism ki kya khasiyat hai?" },
    { label: "Dimak ki dawai?", query: "Ganne me dimak lagne par konsi dawai dalein?" },
  ];

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-brand-900">AI Voice Assistant (बोलकर पूछें)</h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Ask about your tickets, payments, weather, and season dates in Hindi or English
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Language Switch */}
          <div className="flex rounded-xl bg-gray-100 p-1 text-xs font-semibold">
            <button
              onClick={() => setLanguage("hi")}
              className={`rounded-lg px-2.5 sm:px-3 py-1.5 transition cursor-pointer ${language === "hi" ? "bg-white text-brand-700 shadow-sm" : "text-gray-600"}`}
            >
              हिन्दी (Hindi)
            </button>
            <button
              onClick={() => setLanguage("en")}
              className={`rounded-lg px-2.5 sm:px-3 py-1.5 transition cursor-pointer ${language === "en" ? "bg-white text-brand-700 shadow-sm" : "text-gray-600"}`}
            >
              English
            </button>
          </div>

          {/* Auto Speak Toggle */}
          <button
            onClick={() => setAutoSpeak(!autoSpeak)}
            title={autoSpeak ? "Voice output enabled" : "Voice output muted"}
            className={`rounded-xl border p-2 transition cursor-pointer ${autoSpeak ? "border-brand-300 bg-brand-50 text-brand-700" : "border-gray-200 text-gray-400"}`}
          >
            {autoSpeak ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {!speechSupported && (
        <div className="flex items-center gap-2 rounded-xl bg-amber-50 p-3 text-sm text-amber-800">
          <AlertCircle className="h-4 w-4 shrink-0" />
          Speech recognition is not supported in this browser. You can type your question in the text box below.
        </div>
      )}

      {error && (
        <div className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</div>
      )}

      {/* Voice Mic Hero Card */}
      <div className="flex flex-col items-center justify-center rounded-2xl sm:rounded-3xl border border-brand-100 bg-gradient-to-b from-brand-50/50 via-white to-white p-5 sm:p-8 text-center shadow-sm">
        {/* Pulsing Mic Button */}
        <button
          onClick={toggleListening}
          disabled={!speechSupported}
          className={`relative flex h-24 w-24 sm:h-28 sm:w-28 items-center justify-center rounded-full transition-all duration-300 shadow-lg cursor-pointer ${
            isListening
              ? "bg-red-500 text-white ring-8 ring-red-200 animate-pulse scale-105"
              : "bg-brand-600 text-white hover:bg-brand-700 hover:scale-105"
          } disabled:opacity-50`}
        >
          {isListening ? <Mic className="h-10 w-10 sm:h-12 sm:w-12" /> : <Mic className="h-10 w-10 sm:h-12 sm:w-12" />}
        </button>

        <p className="mt-4 font-semibold text-gray-800 text-sm sm:text-base">
          {isListening
            ? "सुन रहा हूँ... बोलिए (Listening...)"
            : "माइक दबाकर बोलें (Tap mic to speak)"}
        </p>
        <p className="mt-1 text-xs text-gray-500">
          Supports Hindi, English, and Hinglish queries
        </p>

        {/* Quick Voice Chips */}
        <div className="mt-5 sm:mt-6 flex flex-wrap justify-center gap-1.5 sm:gap-2">
          {sampleVoicePrompts.map((p, i) => (
            <button
              key={i}
              onClick={() => {
                setSpokenText(p.query);
                handleAsk(p.query);
              }}
              className="rounded-xl border border-brand-200 bg-white px-2.5 sm:px-3 py-1.5 text-xs font-medium text-brand-800 shadow-xs hover:bg-brand-50 cursor-pointer"
            >
              &ldquo;{p.label}&rdquo;
            </button>
          ))}
        </div>
      </div>

      {/* Transcript & Input Bar */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 shadow-sm">
        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500">
          Recognized Voice / Typed Text
        </label>
        <div className="mt-2 flex flex-col sm:flex-row gap-2 sm:gap-3">
          <input
            type="text"
            value={spokenText}
            onChange={(e) => setSpokenText(e.target.value)}
            placeholder="आप जो बोलेंगे वह यहां दिखेगा या सीधे टाइप करें..."
            className="flex-1 rounded-xl border px-3.5 sm:px-4 py-2.5 sm:py-3 text-sm focus:border-brand-500 focus:outline-none"
          />
          <button
            onClick={() => handleAsk()}
            disabled={!spokenText.trim() || loading}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-brand-600 px-5 py-2.5 sm:py-3 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-50 cursor-pointer"
          >
            <Send className="h-4 w-4" /> Ask
          </button>
        </div>
      </div>

      {/* Voice Answer Display */}
      {loading && (
        <div className="rounded-2xl border border-brand-100 bg-brand-50/50 p-6 text-center text-sm text-brand-800">
          Fetching verified records from sugar mill database...
        </div>
      )}

      {reply && !loading && (
        <div className="rounded-2xl border border-brand-200 bg-white p-6 shadow-md">
          <div className="flex items-center gap-2 text-brand-800 font-bold text-base mb-2">
            <Bot className="h-5 w-5 text-brand-600" /> AgroCane Verified Answer:
          </div>
          <div className="text-gray-800 text-sm leading-relaxed bg-brand-50/50 p-4 rounded-xl border border-brand-100 whitespace-pre-wrap">
            {reply.split("\n").map((line, idx) => {
              const parts = line.split(/(\*\*.*?\*\*)/g);
              return (
                <div key={idx} className="my-1">
                  {parts.map((p, pIdx) =>
                    p.startsWith("**") && p.endsWith("**") ? (
                      <strong key={pIdx} className="font-semibold text-gray-900">
                        {p.slice(2, -2)}
                      </strong>
                    ) : (
                      p
                    )
                  )}
                </div>
              );
            })}
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
            <span>Grounded on your authenticated farmer records</span>
            {autoSpeak && <span>Audio playback active</span>}
          </div>
        </div>
      )}
    </div>
  );
}
