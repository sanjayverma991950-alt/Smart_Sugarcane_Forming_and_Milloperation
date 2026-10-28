import { useEffect, useState, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import { Pencil, ArrowLeft } from "lucide-react";
import api, { getErrorMessage } from "../../services/api";
import Loader from "../../components/Loader";
import ErrorMessage from "../../components/ErrorMessage";
import { formatArea, formatDate, toAcres, toHectares } from "../../utils/units";

function Row({ label, value }) {
  return (
    <div className="flex justify-between gap-4 border-b py-3 text-sm last:border-0">
      <dt className="text-gray-500">{label}</dt>
      <dd className="text-right font-medium capitalize text-gray-900">{value || "—"}</dd>
    </div>
  );
}

export default function FieldDetails() {
  const { id } = useParams();
  const [field, setField] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get(`/fields/${id}`);
      setField(res.data.field);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} onRetry={load} />;

  const hasCoords = field.latitude != null && field.longitude != null;

  return (
    <div className="mx-auto max-w-3xl">
      <Link to="/farmer/fields" className="inline-flex items-center gap-1 text-sm text-brand-700">
        <ArrowLeft className="h-4 w-4" /> Back to fields
      </Link>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-brand-900">{field.name}</h1>
        <Link to={`/farmer/fields/${field._id}/edit`} className="inline-flex items-center gap-2 rounded-lg border border-brand-600 px-4 py-2 text-sm font-medium text-brand-700 hover:bg-brand-50">
          <Pencil className="h-4 w-4" /> Edit
        </Link>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <dl className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="mb-2 font-semibold text-brand-900">Field</h2>
          <Row label="Status" value={field.status} />
          <Row label="Village" value={field.village} />
          <Row label="Area (as entered)" value={formatArea(field.area, field.areaUnit)} />
          <Row label="Area in acres" value={`${toAcres(field.area, field.areaUnit).toFixed(2)} acres`} />
          <Row label="Area in hectares" value={`${toHectares(field.area, field.areaUnit).toFixed(2)} ha`} />
          <Row label="Soil" value={field.soilType} />
          <Row label="Irrigation" value={field.irrigationMethod} />
        </dl>

        <dl className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="mb-2 font-semibold text-brand-900">Crop</h2>
          <Row label="Variety" value={field.variety} />
          <Row label="Crop cycle" value={field.cropType} />
          <Row label="Planted" value={field.plantingDate ? formatDate(field.plantingDate) : ""} />
          <Row label="Expected harvest" value={field.expectedHarvestDate ? formatDate(field.expectedHarvestDate) : ""} />
          <Row label="Actual harvest" value={field.actualHarvestDate ? formatDate(field.actualHarvestDate) : ""} />
          <Row
            label="Your expected production"
            value={field.expectedProductionTonnes != null ? `${field.expectedProductionTonnes} tonnes (estimate)` : ""}
          />
        </dl>
      </div>

      <div className="mt-6 rounded-2xl bg-white p-5 text-sm shadow-sm">
        <h2 className="mb-2 font-semibold text-brand-900">Location for weather alerts</h2>
        {hasCoords ? (
          <p className="text-gray-700">Latitude {field.latitude}, Longitude {field.longitude}</p>
        ) : (
          <p className="text-gray-600">No coordinates saved. Your village will be used. You can add coordinates by editing this field.</p>
        )}
      </div>

      {field.notes && (
        <div className="mt-6 rounded-2xl bg-white p-5 text-sm shadow-sm">
          <h2 className="mb-2 font-semibold text-brand-900">Notes</h2>
          <p className="whitespace-pre-wrap text-gray-700">{field.notes}</p>
        </div>
      )}
    </div>
  );
}
