import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Camera, Calendar, ShieldCheck, ArrowLeft } from "lucide-react";
import api, { getErrorMessage } from "../../services/api";
import Loader from "../../components/Loader";
import ErrorMessage from "../../components/ErrorMessage";
import EmptyState from "../../components/EmptyState";
import { formatDate } from "../../utils/units";

export default function FarmerCropHistory() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/ai/crop-disease/history")
      .then((res) => setReports(res.data.reports || []))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link to="/farmer/crop-disease" className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700">
            <ArrowLeft className="h-3 w-3" /> Back to Scanner
          </Link>
          <h1 className="mt-1 text-2xl font-bold text-brand-900">Crop Disease Analysis History</h1>
        </div>
      </div>

      {reports.length === 0 ? (
        <EmptyState
          title="No crop scans recorded"
          text="You haven't scanned any cane leaves yet. Take a photograph of any unhealthy leaves to get preliminary identification."
          action={
            <Link
              to="/farmer/crop-disease"
              className="rounded-xl bg-brand-600 px-5 py-2.5 font-medium text-white hover:bg-brand-700"
            >
              Scan a leaf now
            </Link>
          }
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {reports.map((r) => (
            <div key={r._id} className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
              <div className="p-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="rounded-full bg-brand-100 px-2.5 py-0.5 text-xs font-semibold text-brand-800">
                        {r.confidenceScore}% Confidence
                      </span>
                      {r.aiProvider && (
                        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-800 border border-emerald-200">
                          {r.aiProvider}
                        </span>
                      )}
                    </div>
                    <h2 className="mt-2 text-lg font-bold text-gray-900">{r.detectedDisease}</h2>
                    <p className="text-xs text-gray-500">
                      Field: <span className="font-medium text-gray-700">{r.field?.name || "General plot"}</span>
                    </p>
                  </div>
                  <span className="text-xs text-gray-400">{formatDate(r.createdAt)}</span>
                </div>

                <div className="mt-4 rounded-xl bg-gray-50 p-3 text-xs text-gray-600">
                  <p className="font-semibold text-gray-800">Key Recommendation:</p>
                  <p className="mt-1">{r.recommendedActions?.[0] || "Consult local agricultural extension center."}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
