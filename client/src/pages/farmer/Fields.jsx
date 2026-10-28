import { useEffect, useState, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, Eye, Pencil, Archive, MapPin } from "lucide-react";
import api, { getErrorMessage } from "../../services/api";
import Loader from "../../components/Loader";
import ErrorMessage from "../../components/ErrorMessage";
import EmptyState from "../../components/EmptyState";
import ConfirmModal from "../../components/ConfirmModal";
import { formatArea, totalArea, formatDate } from "../../utils/units";

export default function Fields() {
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [toArchive, setToArchive] = useState(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/fields");
      setFields(res.data.fields);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return fields;
    return fields.filter((f) =>
      [f.name, f.village, f.variety].some((v) => v?.toLowerCase().includes(q))
    );
  }, [fields, search]);

  // Only active fields count toward cultivated area
  const total = useMemo(() => totalArea(fields.filter((f) => f.status === "active")), [fields]);

  const confirmArchive = async () => {
    setBusy(true);
    try {
      await api.delete(`/fields/${toArchive._id}`);
      setToArchive(null);
      await load();
    } catch (err) {
      setError(getErrorMessage(err));
      setToArchive(null);
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-xl sm:text-2xl font-bold text-brand-900">My Fields</h1>
        <Link to="/farmer/fields/new" className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white hover:bg-brand-700 shadow-sm self-start sm:self-auto">
          <Plus className="h-4 w-4" /> Add field
        </Link>
      </div>

      <div className="mt-4">
        <ErrorMessage message={error} onRetry={load} />
      </div>

      {fields.length === 0 && !error ? (
        <div className="mt-6">
          <EmptyState
            title="No fields yet"
            text="Add your first field to start tracking your sugarcane crop."
            action={
              <Link to="/farmer/fields/new" className="rounded-xl bg-brand-600 px-5 py-2.5 font-semibold text-white hover:bg-brand-700 shadow-sm">
                Add your first field
              </Link>
            }
          />
        </div>
      ) : (
        <>
          <div className="mt-4 grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-3">
            <div className="rounded-2xl bg-white p-4 sm:p-5 shadow-sm border border-brand-100">
              <p className="text-xs sm:text-sm text-gray-500">Active fields</p>
              <p className="text-xl sm:text-2xl font-bold text-brand-700 mt-1">{fields.filter((f) => f.status === "active").length}</p>
            </div>
            <div className="rounded-2xl bg-white p-4 sm:p-5 shadow-sm border border-brand-100">
              <p className="text-xs sm:text-sm text-gray-500">Cultivated area (acres)</p>
              <p className="text-xl sm:text-2xl font-bold text-brand-700 mt-1">{total.acres.toFixed(2)}</p>
            </div>
            <div className="rounded-2xl bg-white p-4 sm:p-5 shadow-sm border border-brand-100">
              <p className="text-xs sm:text-sm text-gray-500">Cultivated area (hectares)</p>
              <p className="text-xl sm:text-2xl font-bold text-brand-700 mt-1">{total.hectares.toFixed(2)}</p>
            </div>
          </div>

          <div className="relative mt-5 sm:mt-6 max-w-md">
            <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, village or variety"
              aria-label="Search fields"
              className="w-full rounded-xl border border-gray-200 bg-white py-2.5 sm:py-3 pl-10 pr-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 shadow-2xs"
            />
          </div>

          {filtered.length === 0 ? (
            <p className="mt-6 text-gray-600 text-sm">No fields match your search.</p>
          ) : (
            <div className="mt-5 sm:mt-6 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((f) => (
                <div key={f._id} className="rounded-2xl border border-brand-100 bg-white p-4 sm:p-5 shadow-sm">
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="font-semibold text-gray-900">{f.name}</h2>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${f.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-200 text-gray-600"}`}>
                      {f.status}
                    </span>
                  </div>
                  <p className="mt-1 flex items-center gap-1 text-sm text-gray-500">
                    <MapPin className="h-4 w-4" /> {f.village}
                  </p>
                  <dl className="mt-3 space-y-1 text-sm">
                    <div className="flex justify-between"><dt className="text-gray-500">Area</dt><dd>{formatArea(f.area, f.areaUnit)}</dd></div>
                    <div className="flex justify-between"><dt className="text-gray-500">Variety</dt><dd>{f.variety || "—"}</dd></div>
                    <div className="flex justify-between"><dt className="text-gray-500">Planted</dt><dd>{formatDate(f.plantingDate)}</dd></div>
                    <div className="flex justify-between"><dt className="text-gray-500">Expected harvest</dt><dd>{formatDate(f.expectedHarvestDate)}</dd></div>
                  </dl>
                  <div className="mt-4 flex gap-2">
                    <Link to={`/farmer/fields/${f._id}`} className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg border px-3 py-2 text-sm hover:bg-gray-50">
                      <Eye className="h-4 w-4" /> View
                    </Link>
                    <Link to={`/farmer/fields/${f._id}/edit`} className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg border px-3 py-2 text-sm hover:bg-gray-50">
                      <Pencil className="h-4 w-4" /> Edit
                    </Link>
                    {f.status === "active" && (
                      <button onClick={() => setToArchive(f)} className="inline-flex items-center justify-center gap-1 rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600 hover:bg-red-50" aria-label={`Archive ${f.name}`}>
                        <Archive className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      <ConfirmModal
        open={!!toArchive}
        title="Archive this field?"
        text={`"${toArchive?.name}" will be archived and no longer counted in your cultivated area. Your records are kept.`}
        confirmLabel="Archive"
        busy={busy}
        onConfirm={confirmArchive}
        onCancel={() => setToArchive(null)}
      />
    </div>
  );
}
