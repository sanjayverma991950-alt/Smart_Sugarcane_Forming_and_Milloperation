import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Sprout, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getErrorMessage } from "../services/api";

const inputCls =
  "mt-1 w-full rounded-lg border px-3 py-3 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100";

function Field({ label, id, error, children }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium">{label}</label>
      {children}
      {error && <p className="mt-1 text-sm text-red-600">{error.message}</p>}
    </div>
  );
}

export default function Register() {
  const { register: signup } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { preferredLanguage: "en" } });

  // The form never sends a "role" field: the server must always set role = farmer
  const onSubmit = async ({ confirmPassword, ...data }) => {
    setServerError("");
    try {
      await signup(data);
      navigate("/farmer");
    } catch (err) {
      setServerError(getErrorMessage(err));
    }
  };

  return (
    <div className="mx-auto max-w-xl px-4 py-12">
      <form onSubmit={handleSubmit(onSubmit)} className="rounded-2xl bg-white p-8 shadow-lg" noValidate>
        <div className="mb-6 text-center">
          <Sprout className="mx-auto h-10 w-10 text-brand-600" />
          <h1 className="mt-2 text-2xl font-bold text-brand-900">Farmer Registration</h1>
        </div>

        {serverError && (
          <p role="alert" className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{serverError}</p>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full name" id="name" error={errors.name}>
            <input id="name" className={inputCls} {...register("name", { required: "Name is required", minLength: { value: 2, message: "Too short" } })} />
          </Field>

          <Field label="Mobile number" id="mobile" error={errors.mobile}>
            <input id="mobile" inputMode="numeric" className={inputCls}
              {...register("mobile", { required: "Mobile is required", pattern: { value: /^[6-9]\d{9}$/, message: "Enter a valid 10-digit mobile number" } })} />
          </Field>

          <Field label="Email (optional)" id="email" error={errors.email}>
            <input id="email" type="email" className={inputCls}
              {...register("email", { pattern: { value: /^\S+@\S+\.\S+$/, message: "Enter a valid email" } })} />
          </Field>

          <Field label="Preferred language" id="lang" error={errors.preferredLanguage}>
            <select id="lang" className={inputCls} {...register("preferredLanguage")}>
              <option value="en">English</option>
              <option value="hi">हिन्दी (Hindi)</option>
            </select>
          </Field>

          <Field label="Village" id="village" error={errors.village}>
            <input id="village" className={inputCls} {...register("village", { required: "Village is required" })} />
          </Field>

          <Field label="District" id="district" error={errors.district}>
            <input id="district" className={inputCls} {...register("district", { required: "District is required" })} />
          </Field>

          <Field label="State" id="state" error={errors.state}>
            <input id="state" className={inputCls} defaultValue="Uttar Pradesh" {...register("state", { required: "State is required" })} />
          </Field>

          <div />

          <Field label="Password" id="password" error={errors.password}>
            <div className="relative mt-1">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className="w-full rounded-lg border px-3 py-3 pr-11 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
                {...register("password", { required: "Password is required", minLength: { value: 8, message: "At least 8 characters" } })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </Field>

          <Field label="Confirm password" id="confirmPassword" error={errors.confirmPassword}>
            <div className="relative mt-1">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                className="w-full rounded-lg border px-3 py-3 pr-11 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (v) => v === watch("password") || "Passwords do not match",
                })}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </Field>
        </div>

        <button disabled={isSubmitting} className="mt-6 w-full rounded-lg bg-brand-600 py-3 font-medium text-white hover:bg-brand-700 disabled:opacity-60 cursor-pointer">
          {isSubmitting ? "Creating account..." : "Create account"}
        </button>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already registered? <Link to="/login" className="font-medium text-brand-700">Login</Link>
        </p>
      </form>
    </div>
  );
}
