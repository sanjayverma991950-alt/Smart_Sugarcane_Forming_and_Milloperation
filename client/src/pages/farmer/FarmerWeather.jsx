import { useEffect, useState, useCallback } from "react";
import { CloudSun, Droplets, Wind, Thermometer, AlertTriangle, CheckCircle2, Calendar } from "lucide-react";
import api, { getErrorMessage } from "../../services/api";
import Loader from "../../components/Loader";
import ErrorMessage from "../../components/ErrorMessage";
import { formatDate } from "../../utils/units";

export default function FarmerWeather() {
  const [fields, setFields] = useState([]);
  const [selectedField, setSelectedField] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadWeather = useCallback(async (fieldId) => {
    setLoading(true);
    setError("");
    try {
      const url = fieldId ? `/weather/forecast?fieldId=${fieldId}` : "/weather/forecast";
      const res = await api.get(url);
      setWeather(res.data.forecast);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    api
      .get("/fields?status=active")
      .then((res) => {
        const list = res.data.fields || [];
        setFields(list);
        if (list.length > 0) {
          setSelectedField(list[0]._id);
          loadWeather(list[0]._id);
        } else {
          loadWeather();
        }
      })
      .catch(() => loadWeather());
  }, [loadWeather]);

  const handleFieldChange = (e) => {
    const id = e.target.value;
    setSelectedField(id);
    loadWeather(id);
  };

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} onRetry={() => loadWeather(selectedField)} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-brand-900">Weather & Sugarcane Irrigation Advisory</h1>
          <p className="text-sm text-gray-500">Live meteorological observations and crop-specific watering recommendations</p>
        </div>

        {fields.length > 0 && (
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-gray-600">Weather for Field:</label>
            <select
              value={selectedField}
              onChange={handleFieldChange}
              className="rounded-xl border bg-white px-3 py-2 text-sm shadow-xs focus:border-brand-500 focus:outline-none"
            >
              {fields.map((f) => (
                <option key={f._id} value={f._id}>
                  {f.name} ({f.village})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {weather && (
        <>
          {/* Hero Weather Card */}
          <div className="rounded-3xl bg-gradient-to-br from-brand-900 via-brand-800 to-brand-700 p-6 text-white shadow-md md:p-8">
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div>
                <span className="rounded-full bg-brand-600/60 px-3 py-1 text-xs font-semibold uppercase tracking-wider">
                  Live Conditions &bull; {weather.description}
                </span>
                <div className="mt-4 flex items-baseline gap-4">
                  <span className="text-5xl font-extrabold tracking-tight md:text-6xl">
                    {weather.temperature}&deg;C
                  </span>
                  <span className="text-lg text-brand-200">Western UP Cane Zone</span>
                </div>
              </div>

              {/* 3 Metric Pills */}
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-2xl bg-white/10 p-3.5 backdrop-blur-xs text-center">
                  <Droplets className="mx-auto h-5 w-5 text-blue-200" />
                  <p className="mt-1 text-xs text-brand-100">Humidity</p>
                  <p className="text-sm font-bold">{weather.humidity}%</p>
                </div>
                <div className="rounded-2xl bg-white/10 p-3.5 backdrop-blur-xs text-center">
                  <CloudSun className="mx-auto h-5 w-5 text-amber-200" />
                  <p className="mt-1 text-xs text-brand-100">Precipitation</p>
                  <p className="text-sm font-bold">{weather.rainMm} mm</p>
                </div>
                <div className="rounded-2xl bg-white/10 p-3.5 backdrop-blur-xs text-center">
                  <Wind className="mx-auto h-5 w-5 text-teal-200" />
                  <p className="mt-1 text-xs text-brand-100">Wind Speed</p>
                  <p className="text-sm font-bold">{weather.windSpeedKmh} km/h</p>
                </div>
              </div>
            </div>
          </div>

          {/* AI Irrigation Suggestion Box */}
          <div
            className={`rounded-3xl border p-6 shadow-sm ${
              weather.alertType !== "normal"
                ? "border-amber-200 bg-amber-50/70 text-amber-950"
                : "border-brand-200 bg-brand-50/70 text-brand-950"
            }`}
          >
            <div className="flex items-center gap-2">
              {weather.alertType !== "normal" ? (
                <AlertTriangle className="h-5 w-5 text-amber-600" />
              ) : (
                <CheckCircle2 className="h-5 w-5 text-brand-600" />
              )}
              <h2 className="font-bold text-base">Agricultural Irrigation Advisory:</h2>
            </div>

            <p className="mt-2 text-sm leading-relaxed font-medium">
              {weather.adviceEn}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-gray-700 italic">
              {weather.adviceHi}
            </p>

            {weather.suggestedActions?.length > 0 && (
              <div className="mt-4 border-t border-brand-200/50 pt-3">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-600">
                  Recommended Action:
                </span>
                <p className="mt-1 text-xs text-gray-800">{weather.suggestedActions[0]}</p>
              </div>
            )}
          </div>

          {/* 7-Day Forecast Row */}
          {weather.dailyForecast?.length > 0 && (
            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
              <h3 className="text-base font-bold text-gray-900">7-Day Agro-Weather Forecast</h3>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-7">
                {weather.dailyForecast.map((d, i) => (
                  <div key={i} className="rounded-2xl border border-gray-100 bg-gray-50/50 p-3 text-center">
                    <p className="text-xs font-semibold text-gray-500">
                      {new Date(d.date).toLocaleDateString("en-IN", { weekday: "short" })}
                    </p>
                    <p className="mt-1 text-xs font-medium text-gray-400">
                      {new Date(d.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                    </p>
                    <div className="my-2 text-sm font-bold text-gray-900">
                      {Math.round(d.maxTemp)}&deg; / {Math.round(d.minTemp)}&deg;
                    </div>
                    <p className="text-[11px] text-gray-600 truncate">{d.weather}</p>
                    {d.rainSumMm > 0 && (
                      <span className="mt-1 inline-block rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-semibold text-blue-700">
                        {d.rainSumMm.toFixed(1)} mm
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
