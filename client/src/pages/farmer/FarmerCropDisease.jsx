import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Camera,
  Upload,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  History,
  ShieldAlert,
  Sparkles,
  Settings,
  Key,
  X,
  ExternalLink,
  Cpu,
} from "lucide-react";
import api, { getErrorMessage } from "../../services/api";

export default function FarmerCropDisease() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [fields, setFields] = useState([]);
  const [selectedField, setSelectedField] = useState("");
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [error, setError] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [aiConfig, setAiConfig] = useState({
    hasApiKey: false,
    hasOpenAIKey: false,
    provider: "openai",
    visionModel: "gpt-4o-mini",
  });
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [savingKey, setSavingKey] = useState(false);
  const [keySaveMessage, setKeySaveMessage] = useState("");

  useEffect(() => {
    // Load active fields
    api
      .get("/fields?status=active")
      .then((res) => {
        setFields(res.data.fields || []);
        if (res.data.fields?.length > 0) setSelectedField(res.data.fields[0]._id);
      })
      .catch(() => {});

    // Load AI config
    api
      .get("/ai/config")
      .then((res) => {
        if (res.data?.success) {
          setAiConfig(res.data);
        }
      })
      .catch(() => {});
  }, []);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setError("");
    if (!selected) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(selected.type)) {
      setError("Please select a valid image file (JPG, PNG, or WEBP).");
      return;
    }

    if (selected.size > 5 * 1024 * 1024) {
      setError("Image size exceeds 5MB limit. Please upload a smaller photo.");
      return;
    }

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setReport(null);
  };

  const handleAnalyze = async () => {
    if (!file) return;

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("provider", "openai");
      if (selectedField) formData.append("fieldId", selectedField);

      const res = await api.post("/ai/crop-disease/analyze", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setReport(res.data.report);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setPreview(null);
    setReport(null);
    setError("");
  };

  const handleSaveApiKey = async (e) => {
    e.preventDefault();
    if (!apiKeyInput.trim()) return;

    setSavingKey(true);
    setKeySaveMessage("");

    try {
      const res = await api.post("/ai/config", {
        apiKey: apiKeyInput.trim(),
        provider: "openai",
      });
      setAiConfig((prev) => ({
        ...prev,
        hasApiKey: true,
        hasOpenAIKey: true,
        provider: "openai",
      }));
      setKeySaveMessage(res.data.message || "AI API key configured successfully!");
      setApiKeyInput("");
      setTimeout(() => setShowSettings(false), 2000);
    } catch (err) {
      setKeySaveMessage(`Error: ${getErrorMessage(err)}`);
    } finally {
      setSavingKey(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-brand-900">AI Crop Disease Detection</h1>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 border border-emerald-200">
              <Sparkles className="h-3 w-3 text-emerald-600" />
              AI Vision Active
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-0.5">
            गन्ने की पत्तियों या तने की फोटो अपलोड करें — AI विज़न रोग के लक्षण, सटीक पहचान और दवा बताएगा
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* AI Settings Button */}
          <button
            onClick={() => setShowSettings(true)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 shadow-xs hover:bg-gray-50 transition"
          >
            <Settings className="h-4 w-4 text-brand-600" /> AI Settings
          </button>

          <Link
            to="/farmer/crop-history"
            className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 shadow-xs hover:bg-gray-50 transition"
          >
            <History className="h-4 w-4" /> History
          </Link>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl bg-red-50 p-4 text-sm text-red-700 border border-red-200">
          {error}
        </div>
      )}

      {/* Upload Zone */}
      {!report && (
        <div className="rounded-3xl border border-brand-100 bg-white p-6 shadow-sm md:p-8">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
            <div>
              <label className="block text-sm font-bold text-gray-800">
                1. Affected Field (खेत चुनें - Optional)
              </label>
              <p className="text-xs text-gray-500">जिस खेत की फसल प्रभावित है उसे चुन सकते हैं</p>
            </div>
            <select
              value={selectedField}
              onChange={(e) => setSelectedField(e.target.value)}
              className="rounded-xl border border-gray-200 px-3 py-2 text-xs focus:border-brand-500 focus:outline-none"
            >
              <option value="">-- सामान्य / कोई विशिष्ट खेत नहीं --</option>
              {fields.map((f) => (
                <option key={f._id} value={f._id}>
                  {f.name} ({f.variety || "General"}, {f.village})
                </option>
              ))}
            </select>
          </div>

          <div className="mb-2">
            <label className="block text-sm font-bold text-gray-800 mb-2">
              2. Upload Cane Leaf / Stalk Photo (गन्ने की पत्ती या तने की फोटो)
            </label>
          </div>

          {!preview ? (
            <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-emerald-300 bg-emerald-50/30 p-10 transition hover:bg-emerald-50/70">
              <div className="rounded-full bg-emerald-100 p-4 text-emerald-700 shadow-2xs">
                <Camera className="h-9 w-9" />
              </div>
              <p className="mt-4 text-base font-semibold text-brand-900">
                Click to upload or drag & drop cane leaf photo
              </p>
              <p className="mt-1 text-xs text-gray-500">
                गन्ने की पत्ती, गोभ या तने की साफ़ फोटो अपलोड करें (JPG, PNG, WEBP max 5MB)
              </p>
              <span className="mt-3 inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1 text-xs font-semibold text-white">
                <Sparkles className="h-3.5 w-3.5" /> Ready for AI Analysis
              </span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          ) : (
            <div className="space-y-4">
              <div className="relative overflow-hidden rounded-2xl border bg-gray-50">
                <img
                  src={preview}
                  alt="Crop preview"
                  className="mx-auto max-h-80 w-auto object-contain rounded-xl"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleReset}
                  className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                >
                  Change Photo
                </button>
                <button
                  type="button"
                  onClick={handleAnalyze}
                  disabled={loading}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-50 transition"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      AI रोग की जांच कर रहा है...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" /> Analyze with AI (जांच करें)
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Analysis Result Card */}
      {report && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-emerald-200 bg-white p-6 shadow-sm md:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-4">
              <div>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800 uppercase tracking-wider">
                  <Sparkles className="h-3 w-3 text-emerald-600" />
                  {report.aiProvider || "AgroCane AI Vision Engine"}
                </span>
                <h2 className="mt-2 text-2xl font-bold text-gray-900">{report.detectedDisease}</h2>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 font-medium">Confidence Score</p>
                <p className="text-3xl font-extrabold text-emerald-700">{report.confidenceScore}%</p>
              </div>
            </div>

            {/* Observed Symptoms */}
            <div className="mt-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-700">
                Observed Pathological Symptoms (AI द्वारा पहचाने गए लक्षण)
              </h3>
              <ul className="mt-2 space-y-2 text-sm text-gray-700">
                {report.symptoms?.map((s, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-emerald-600" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recommended Cultural & Chemical Actions */}
            <div className="mt-6 rounded-2xl bg-emerald-50/70 border border-emerald-200 p-5">
              <h3 className="font-bold text-emerald-950 text-sm uppercase tracking-wide">
                AI Recommended Treatment & Medicine (रोकथाम एवं दवा का विवरण)
              </h3>
              <ul className="mt-3 space-y-2.5 text-sm text-emerald-950 font-medium">
                {report.recommendedActions?.map((act, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    <span>{act}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Mandatory Safety Disclaimer */}
            <div className="mt-6 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50/70 p-4 text-xs text-amber-900">
              <ShieldAlert className="h-5 w-5 shrink-0 text-amber-600" />
              <div>
                <span className="font-bold">Important Agricultural Advisory:</span>
                <p className="mt-0.5 leading-relaxed">{report.disclaimer}</p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 shadow-sm transition"
              >
                <RefreshCw className="h-4 w-4" /> Check Another Leaf (दूसरी पत्ती जांचें)
              </button>
              <Link
                to="/farmer/crop-history"
                className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
              >
                Go to History
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* AI Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl border border-gray-100 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-emerald-600" />
                <h2 className="font-bold text-gray-900 text-base">AI Vision Settings</h2>
              </div>
              <button
                onClick={() => setShowSettings(false)}
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-gray-600">
              <div className="rounded-xl bg-emerald-50/70 p-3.5 border border-emerald-100">
                <p className="font-semibold text-emerald-950 mb-1 flex items-center gap-1">
                  <Sparkles className="h-3.5 w-3.5 text-emerald-600" /> AI Crop Disease Doctor:
                </p>
                <p>
                  AI directly analyzes your uploaded sugarcane leaf or stalk photo, identifies diseases like Red Rot, Pokkah Boeng, Smut, or Shoot Borer, and provides exact chemical dosages.
                </p>
                <p className="mt-1 text-[11px] text-emerald-800">
                  ⚡ <strong>Always-On Resilience:</strong> Even without an API key, the built-in AI expert pathology engine diagnoses crops seamlessly.
                </p>
              </div>

              <div>
                <span className="font-medium text-gray-700">AI Vision Status: </span>
                <span className="font-bold text-emerald-700">
                  {aiConfig.hasOpenAIKey ? "Active (Live Cloud AI Vision)" : "Active (AgroCane Pathology Engine)"}
                </span>
              </div>

              <form onSubmit={handleSaveApiKey} className="space-y-2 pt-1">
                <label className="block font-medium text-gray-700">
                  AI Vision API Key (Optional for cloud models):
                </label>
                <div className="flex gap-2">
                  <input
                    type="password"
                    value={apiKeyInput}
                    onChange={(e) => setApiKeyInput(e.target.value)}
                    placeholder="sk-proj-... or API key"
                    className="flex-1 rounded-xl border border-gray-200 px-3 py-2 text-xs focus:border-emerald-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={savingKey || !apiKeyInput.trim()}
                    className="rounded-xl bg-emerald-600 px-4 py-2 font-semibold text-white hover:bg-emerald-700 disabled:opacity-50 transition"
                  >
                    {savingKey ? "Saving..." : "Save Key"}
                  </button>
                </div>
                <p className="text-[11px] text-gray-400 flex items-center gap-1">
                  Get your API key from{" "}
                  <a
                    href="https://platform.openai.com/api-keys"
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-700 hover:underline inline-flex items-center gap-0.5"
                  >
                    OpenAI Platform <ExternalLink className="h-2.5 w-2.5" />
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
                className="rounded-xl bg-gray-100 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-200 transition"
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
