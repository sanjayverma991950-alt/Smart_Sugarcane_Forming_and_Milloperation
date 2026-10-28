import { useEffect, useState, useCallback } from "react";
import { TrendingUp, RefreshCw, AlertTriangle, ShieldCheck, CheckCircle2 } from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend
} from "recharts";
import api, { getErrorMessage } from "../../services/api";
import Loader from "../../components/Loader";
import ErrorMessage from "../../components/ErrorMessage";
import { formatDate } from "../../utils/units";

export default function AdminSupplyForecast() {
  const [forecasts, setForecasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  const loadForecasts = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/ai/supply-prediction");
      setForecasts(res.data.forecasts || []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadForecasts();
  }, [loadForecasts]);

  const handleGenerate = async () => {
    setGenerating(true);
    setError("");
    try {
      await api.post("/ai/supply-prediction/generate", {});
      await loadForecasts();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setGenerating(false);
    }
  };

  if (loading && forecasts.length === 0) return <Loader />;

  const latest = forecasts[0];

  // Chart data comparing bounds and actual
  const chartData = forecasts.slice(0, 5).reverse().map((f) => ({
    season: f.season?.name || "Season",
    predicted: f.predictedQuantityTonnes,
    lowerBound: f.lowerBoundTonnes,
    upperBound: f.upperBoundTonnes,
    actual: f.actualQuantityTonnes || 0,
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI Sugarcane Supply Prediction</h1>
          <p className="text-sm text-gray-500">
            Forecasting seasonal mill cane arrivals based on cultivated acreage, varieties, and historical deliveries
          </p>
        </div>
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="inline-flex items-center gap-2 rounded-xl bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-800 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${generating ? "animate-spin" : ""}`} />
          {generating ? "Calculating Yield Model..." : "Generate New Forecast"}
        </button>
      </div>

      {error && <ErrorMessage message={error} onRetry={loadForecasts} />}

      {/* Limitations Disclaimer Banner */}
      <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50/70 p-4 text-xs text-amber-950">
        <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600" />
        <div>
          <span className="font-bold">Algorithmic Forecasting Notice:</span>
          <p className="mt-0.5 leading-relaxed">
            Supply predictions are statistical estimations based on registered acreage and variety yield factors.
            Predictions must never be treated as guaranteed supply quotas. Official payments and ticket releases
            are governed strictly by certified physical weighbridge deliveries.
          </p>
        </div>
      </div>

      {/* Latest Forecast Card */}
      {latest && (
        <div className="rounded-3xl border border-brand-200 bg-white p-6 shadow-sm md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4">
            <div>
              <span className="font-mono text-xs font-bold text-brand-700 uppercase">
                {latest.modelName}
              </span>
              <h2 className="mt-1 text-2xl font-bold text-gray-900">
                Season {latest.season?.name} Projected Supply
              </h2>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400">Generated on</p>
              <p className="text-xs font-semibold text-gray-700">{formatDate(latest.createdAt)}</p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-gray-50 p-4">
              <p className="text-xs font-medium text-gray-500">Lower Estimate (-12%)</p>
              <p className="mt-2 text-2xl font-bold text-gray-700">
                {latest.lowerBoundTonnes?.toLocaleString("en-IN")} <span className="text-sm font-normal">T</span>
              </p>
            </div>

            <div className="rounded-2xl border border-brand-200 bg-brand-50/60 p-4">
              <p className="text-xs font-semibold uppercase text-brand-700">Predicted Supply</p>
              <p className="mt-2 text-3xl font-extrabold text-brand-900">
                {latest.predictedQuantityTonnes?.toLocaleString("en-IN")} <span className="text-base font-normal">T</span>
              </p>
            </div>

            <div className="rounded-2xl bg-gray-50 p-4">
              <p className="text-xs font-medium text-gray-500">Upper Estimate (+12%)</p>
              <p className="mt-2 text-2xl font-bold text-gray-700">
                {latest.upperBoundTonnes?.toLocaleString("en-IN")} <span className="text-sm font-normal">T</span>
              </p>
            </div>
          </div>

          {/* Input Data Summary */}
          {latest.inputDataSummary && (
            <div className="mt-6 rounded-2xl bg-gray-50 p-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">Model Input Summary</h3>
              <div className="mt-3 grid grid-cols-2 gap-4 text-xs sm:grid-cols-4">
                <div>
                  <span className="text-gray-400">Registered Fields:</span>
                  <p className="font-bold text-gray-800">{latest.inputDataSummary.totalRegisteredFields}</p>
                </div>
                <div>
                  <span className="text-gray-400">Cultivated Area:</span>
                  <p className="font-bold text-gray-800">{latest.inputDataSummary.totalCultivatedAreaAcres} Acres</p>
                </div>
                <div>
                  <span className="text-gray-400">Deliveries Recorded:</span>
                  <p className="font-bold text-gray-800">{latest.inputDataSummary.historicalDeliveriesCount}</p>
                </div>
                <div>
                  <span className="text-gray-400">Actual Delivered:</span>
                  <p className="font-bold text-emerald-700">{latest.actualQuantityTonnes || 0} Tonnes</p>
                </div>
              </div>
            </div>
          )}

          {/* Warnings if any */}
          {latest.warnings?.length > 0 && (
            <div className="mt-4 rounded-xl border border-amber-100 bg-amber-50/50 p-3 text-xs text-amber-800">
              <span className="font-bold">Model Observations:</span> {latest.warnings.join(". ")}
            </div>
          )}
        </div>
      )}

      {/* Chart: Expected vs Actual */}
      {chartData.length > 0 && (
        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <h3 className="text-base font-bold text-gray-900 mb-4">
            Expected vs Actual Cane Supply Comparison (Tonnes)
          </h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="season" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="predicted" fill="#15803d" name="Predicted Supply (T)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="actual" fill="#0284c7" name="Verified Actual Supply (T)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
