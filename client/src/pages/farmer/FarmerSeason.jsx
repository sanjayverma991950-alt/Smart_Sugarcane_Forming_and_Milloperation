import { useEffect, useState } from "react";
import { CalendarDays, AlertCircle, CheckCircle2 } from "lucide-react";
import api, { getErrorMessage } from "../../services/api";
import Loader from "../../components/Loader";
import ErrorMessage from "../../components/ErrorMessage";
import { formatDate } from "../../utils/units";

export default function FarmerSeason() {
  const [seasons, setSeasons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/seasons")
      .then((res) => setSeasons(res.data.seasons || []))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;

  const activeSeason = seasons.find((s) => s.status === "active") || seasons[0];

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-brand-900">Crushing Season Schedule</h1>
      </div>

      {activeSeason ? (
        <div className="rounded-2xl sm:rounded-3xl border border-brand-200 bg-white p-4 sm:p-6 md:p-8 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4">
            <div>
              <span className="rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-800 uppercase">
                {activeSeason.status} Season
              </span>
              <h2 className="mt-2 text-xl sm:text-2xl font-bold text-gray-900">Season {activeSeason.name}</h2>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            <div className="rounded-2xl bg-gray-50 p-4">
              <p className="text-xs font-medium text-gray-500">Tentative Opening Date</p>
              <p className="mt-1 text-lg font-bold text-gray-900">
                {formatDate(activeSeason.tentativeStartDate)}
              </p>
            </div>

            <div className="rounded-2xl bg-brand-50 p-4">
              <p className="text-xs font-medium text-brand-700">Confirmed Opening Date</p>
              <p className="mt-1 text-lg font-bold text-brand-900">
                {activeSeason.confirmedStartDate ? formatDate(activeSeason.confirmedStartDate) : "Awaiting Confirmation"}
              </p>
            </div>

            <div className="rounded-2xl bg-gray-50 p-4">
              <p className="text-xs font-medium text-gray-500">Expected Closing Date</p>
              <p className="mt-1 text-lg font-bold text-gray-900">
                {formatDate(activeSeason.expectedEndDate)}
              </p>
            </div>
          </div>

          {activeSeason.notes && (
            <div className="mt-6 rounded-xl border border-gray-100 bg-gray-50 p-4 text-sm text-gray-700">
              <p className="font-semibold text-gray-900">Mill Advisory Note:</p>
              <p className="mt-1">{activeSeason.notes}</p>
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-2xl bg-white p-8 text-center text-gray-500 shadow-sm">
          No crushing seasons recorded by the mill administration yet.
        </div>
      )}

      {/* Historical Seasons */}
      {seasons.length > 1 && (
        <div className="rounded-2xl border border-gray-100 bg-white p-4 sm:p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900">Season History</h3>
          <div className="mt-4 divide-y">
            {seasons.map((s) => (
              <div key={s._id} className="flex items-start sm:items-center justify-between gap-2.5 py-3 text-sm">
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{s.name}</p>
                  <p className="text-xs text-gray-500">
                    {formatDate(s.tentativeStartDate)} &mdash; {formatDate(s.expectedEndDate)}
                  </p>
                </div>
                <span className="shrink-0 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium capitalize text-gray-700">
                  {s.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
