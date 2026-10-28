import { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import api, { getErrorMessage } from "../../services/api";
import Loader from "../../components/Loader";
import ErrorMessage from "../../components/ErrorMessage";
import { formatDate } from "../../utils/units";

const inputCls =
  "mt-1 w-full rounded-lg border px-3 py-3 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100";
const readOnlyCls = "mt-1 w-full rounded-lg border bg-gray-100 px-3 py-3 text-gray-600";

export default function Profile() {
  const [farmer, setFarmer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm();

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      const res = await api.get("/farmers/me");
      setFarmer(res.data.farmer);
      reset({
        name: res.data.farmer.name || "",
        email: res.data.farmer.email || "",
        village: res.data.farmer.village || "",
        district: res.data.farmer.district || "",
        state: res.data.farmer.state || "",
        address: res.data.farmer.address || "",
        preferredLanguage: res.data.farmer.preferredLanguage || "en",
      });
    } catch (err) {
      setLoadError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [reset]);

  useEffect(() => {
    load();
  }, [load]);

  const onSubmit = async (data) => {
    setMessage({ type: "", text: "" });
    try {
      const res = await api.patch("/farmers/me", data);
      setFarmer(res.data.farmer);
      reset(data);
      setMessage({ type: "success", text: "Profile updated." });
    } catch (err) {
      setMessage({ type: "error", text: getErrorMessage(err) });
    }
  };

  if (loading) return <Loader />;
  if (loadError) return <ErrorMessage message={loadError} onRetry={load} />;

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-xl sm:text-2xl font-bold text-brand-900">My Profile</h1>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-4 sm:mt-6 rounded-2xl sm:rounded-3xl bg-white p-4 sm:p-6 shadow-sm border border-brand-100">
        {message.text && (
          <p
            role={message.type === "error" ? "alert" : "status"}
            className={`mb-4 rounded-xl p-3 text-sm ${
              message.type === "error" ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"
            }`}
          >
            {message.text}
          </p>
        )}

        {/* Read-only details: the server does not allow changing these */}
        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-3">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700">Farmer ID</label>
            <div className={readOnlyCls}>{farmer.farmerId || "—"}</div>
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700">Mobile number</label>
            <div className={readOnlyCls}>{farmer.mobile}</div>
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700">Registered on</label>
            <div className={readOnlyCls}>{formatDate(farmer.createdAt)}</div>
          </div>
        </div>

        <div className="mt-5 sm:mt-6 grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="block text-sm font-medium">Full name</label>
            <input id="name" className={inputCls} {...register("name", { required: "Name is required", minLength: { value: 2, message: "Too short" } })} />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium">Email (optional)</label>
            <input id="email" type="email" className={inputCls} {...register("email", { pattern: { value: /^\S+@\S+\.\S+$/, message: "Enter a valid email" } })} />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
          </div>

          <div>
            <label htmlFor="village" className="block text-sm font-medium">Village</label>
            <input id="village" className={inputCls} {...register("village", { required: "Village is required" })} />
            {errors.village && <p className="mt-1 text-sm text-red-600">{errors.village.message}</p>}
          </div>

          <div>
            <label htmlFor="district" className="block text-sm font-medium">District</label>
            <input id="district" className={inputCls} {...register("district", { required: "District is required" })} />
            {errors.district && <p className="mt-1 text-sm text-red-600">{errors.district.message}</p>}
          </div>

          <div>
            <label htmlFor="state" className="block text-sm font-medium">State</label>
            <input id="state" className={inputCls} {...register("state", { required: "State is required" })} />
            {errors.state && <p className="mt-1 text-sm text-red-600">{errors.state.message}</p>}
          </div>

          <div>
            <label htmlFor="lang" className="block text-sm font-medium">Preferred language</label>
            <select id="lang" className={inputCls} {...register("preferredLanguage")}>
              <option value="en">English</option>
              <option value="hi">हिन्दी (Hindi)</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="address" className="block text-sm font-medium">Address (optional)</label>
            <textarea id="address" rows={3} className={inputCls} {...register("address", { maxLength: { value: 300, message: "Maximum 300 characters" } })} />
            {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>}
          </div>
        </div>

        <button
          disabled={isSubmitting || !isDirty}
          className="mt-6 rounded-lg bg-brand-600 px-6 py-3 font-medium text-white hover:bg-brand-700 disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : "Save changes"}
        </button>
      </form>
    </div>
  );
}
