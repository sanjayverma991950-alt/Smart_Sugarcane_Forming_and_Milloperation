import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { LocateFixed } from "lucide-react";
import api, { getErrorMessage } from "../../services/api";
import Loader from "../../components/Loader";
import ErrorMessage from "../../components/ErrorMessage";
import { toInputDate } from "../../utils/units";

const inputCls =
  "mt-1 w-full rounded-lg border px-3 py-3 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100";

function Field({ label, id, error, hint, children, className = "" }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-medium">{label}</label>
      {children}
      {hint && !error && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
      {error && <p className="mt-1 text-sm text-red-600">{error.message}</p>}
    </div>
  );
}

const defaults = {
  name: "",
  village: "",
  area: "",
  areaUnit: "acre",
  variety: "",
  cropType: "plant",
  plantingDate: "",
  expectedHarvestDate: "",
  actualHarvestDate: "",
  soilType: "",
  irrigationMethod: "",
  expectedProductionTonnes: "",
  latitude: "",
  longitude: "",
  notes: "",
  status: "active",
};

// Empty strings become undefined so the server only receives real values
const clean = (data) => {
  const out = {};
  Object.entries(data).forEach(([k, v]) => {
    if (v === "" || v === null) return;
    out[k] = v;
  });
  ["area", "expectedProductionTonnes", "latitude", "longitude"].forEach((k) => {
    if (out[k] !== undefined) out[k] = Number(out[k]);
  });
  return out;
};

export default function FieldForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(isEdit);
  const [loadError, setLoadError] = useState("");
  const [serverError, setServerError] = useState("");
  const [geoMessage, setGeoMessage] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: defaults });

  useEffect(() => {
    if (!isEdit) return;
    api
      .get(`/fields/${id}`)
      .then((res) => {
        const f = res.data.field;
        reset({
          ...defaults,
          ...f,
          plantingDate: toInputDate(f.plantingDate),
          expectedHarvestDate: toInputDate(f.expectedHarvestDate),
          actualHarvestDate: toInputDate(f.actualHarvestDate),
          latitude: f.latitude ?? "",
          longitude: f.longitude ?? "",
          expectedProductionTonnes: f.expectedProductionTonnes ?? "",
        });
      })
      .catch((err) => setLoadError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [id, isEdit, reset]);

  const useMyLocation = () => {
    setGeoMessage("");
    if (!navigator.geolocation) {
      setGeoMessage("Your browser does not support location.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setValue("latitude", pos.coords.latitude.toFixed(5), { shouldDirty: true });
        setValue("longitude", pos.coords.longitude.toFixed(5), { shouldDirty: true });
        setGeoMessage("Location added. Stand at the field for best accuracy.");
      },
      () => setGeoMessage("Could not get location. You can type it in or leave it empty.")
    );
  };

  const onSubmit = async (data) => {
    setServerError("");
    try {
      const payload = clean(data);
      if (isEdit) {
        await api.patch(`/fields/${id}`, payload);
      } else {
        await api.post("/fields", payload);
      }
      navigate("/farmer/fields");
    } catch (err) {
      setServerError(getErrorMessage(err));
    }
  };

  if (loading) return <Loader />;
  if (loadError) return <ErrorMessage message={loadError} />;

  const planting = watch("plantingDate");
  const expected = watch("expectedHarvestDate");

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-xl sm:text-2xl font-bold text-brand-900">{isEdit ? "Edit Field" : "Add Field"}</h1>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-4 sm:mt-6 rounded-2xl sm:rounded-3xl bg-white p-4 sm:p-6 shadow-sm border border-brand-100">
        {serverError && (
          <p role="alert" className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{serverError}</p>
        )}

        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
          <Field label="Field name or ID" id="name" error={errors.name}>
            <input id="name" className={inputCls} {...register("name", { required: "Field name is required" })} />
          </Field>

          <Field label="Village / location" id="village" error={errors.village}>
            <input id="village" className={inputCls} {...register("village", { required: "Village is required" })} />
          </Field>

          <Field label="Area" id="area" error={errors.area}>
            <input id="area" type="number" step="0.01" className={inputCls}
              {...register("area", {
                required: "Area is required",
                validate: (v) => Number(v) > 0 || "Area must be greater than 0",
              })} />
          </Field>

          <Field label="Area unit" id="areaUnit" error={errors.areaUnit} hint="The unit is saved with the field, so acres and hectares are never mixed up.">
            <select id="areaUnit" className={inputCls} {...register("areaUnit")}>
              <option value="acre">Acres</option>
              <option value="hectare">Hectares</option>
            </select>
          </Field>

          <Field label="Sugarcane variety" id="variety" error={errors.variety}>
            <input id="variety" className={inputCls} {...register("variety")} />
          </Field>

          <Field label="Crop cycle" id="cropType" error={errors.cropType}>
            <select id="cropType" className={inputCls} {...register("cropType")}>
              <option value="plant">Plant crop</option>
              <option value="ratoon">Ratoon crop</option>
            </select>
          </Field>

          <Field label="Planting date" id="plantingDate" error={errors.plantingDate}>
            <input id="plantingDate" type="date" className={inputCls} {...register("plantingDate")} />
          </Field>

          <Field label="Expected harvest date" id="expectedHarvestDate" error={errors.expectedHarvestDate}>
            <input id="expectedHarvestDate" type="date" className={inputCls}
              {...register("expectedHarvestDate", {
                validate: (v) => !v || !planting || v > planting || "Must be after the planting date",
              })} />
          </Field>

          <Field label="Actual harvest date (if harvested)" id="actualHarvestDate" error={errors.actualHarvestDate}>
            <input id="actualHarvestDate" type="date" className={inputCls}
              {...register("actualHarvestDate", {
                validate: (v) => !v || !planting || v > planting || "Must be after the planting date",
              })} />
          </Field>

          <Field label="Expected production (tonnes)" id="prod" error={errors.expectedProductionTonnes} hint="Your own estimate. It is not a verified quantity.">
            <input id="prod" type="number" step="0.1" min="0" className={inputCls}
              {...register("expectedProductionTonnes", {
                validate: (v) => v === "" || Number(v) >= 0 || "Cannot be negative",
              })} />
          </Field>

          <Field label="Soil type" id="soilType" error={errors.soilType}>
            <select id="soilType" className={inputCls} {...register("soilType")}>
              <option value="">Not sure / skip</option>
              <option value="loam">Loam</option>
              <option value="clay">Clay</option>
              <option value="sandy">Sandy</option>
              <option value="silt">Silt</option>
              <option value="other">Other</option>
            </select>
          </Field>

          <Field label="Irrigation method" id="irrigationMethod" error={errors.irrigationMethod}>
            <select id="irrigationMethod" className={inputCls} {...register("irrigationMethod")}>
              <option value="">Not sure / skip</option>
              <option value="flood">Flood</option>
              <option value="furrow">Furrow</option>
              <option value="drip">Drip</option>
              <option value="sprinkler">Sprinkler</option>
              <option value="rainfed">Rainfed</option>
            </select>
          </Field>

          {isEdit && (
            <Field label="Status" id="status" error={errors.status}>
              <select id="status" className={inputCls} {...register("status")}>
                <option value="active">Active</option>
                <option value="archived">Archived</option>
              </select>
            </Field>
          )}
        </div>

        {/* Location used for weather and irrigation alerts */}
        <div className="mt-6 rounded-xl bg-brand-50 p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="font-medium text-brand-900">Field location (optional)</h2>
              <p className="text-xs text-gray-600">Used for weather and irrigation alerts. If empty, your village is used.</p>
            </div>
            <button type="button" onClick={useMyLocation} className="inline-flex items-center gap-1 rounded-lg border border-brand-600 px-3 py-2 text-sm text-brand-700 hover:bg-white">
              <LocateFixed className="h-4 w-4" /> Use my location
            </button>
          </div>
          {geoMessage && <p className="mt-2 text-sm text-gray-700">{geoMessage}</p>}
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <Field label="Latitude" id="latitude" error={errors.latitude}>
              <input id="latitude" type="number" step="any" className={inputCls}
                {...register("latitude", { validate: (v) => v === "" || (Number(v) >= -90 && Number(v) <= 90) || "Must be between -90 and 90" })} />
            </Field>
            <Field label="Longitude" id="longitude" error={errors.longitude}>
              <input id="longitude" type="number" step="any" className={inputCls}
                {...register("longitude", { validate: (v) => v === "" || (Number(v) >= -180 && Number(v) <= 180) || "Must be between -180 and 180" })} />
            </Field>
          </div>
        </div>

        <Field label="Notes (optional)" id="notes" error={errors.notes} className="mt-4">
          <textarea id="notes" rows={3} className={inputCls} {...register("notes", { maxLength: { value: 500, message: "Maximum 500 characters" } })} />
        </Field>

        <div className="mt-6 flex flex-col sm:flex-row gap-2.5 sm:gap-3">
          <button disabled={isSubmitting} className="rounded-xl bg-brand-600 px-6 py-3 font-semibold text-white hover:bg-brand-700 disabled:opacity-60 cursor-pointer">
            {isSubmitting ? "Saving..." : isEdit ? "Save changes" : "Add field"}
          </button>
          <Link to="/farmer/fields" className="inline-flex items-center justify-center rounded-xl border border-gray-300 px-6 py-3 font-medium text-gray-700 hover:bg-gray-50">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
