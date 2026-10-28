import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Sprout, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getErrorMessage } from "../services/api";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    setServerError("");
    try {
      const user = await login(data, false);
      navigate(user.role === "admin" ? "/admin" : "/farmer");
    } catch (err) {
      setServerError(getErrorMessage(err));
    }
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md items-center px-4 py-12">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full rounded-2xl bg-white p-8 shadow-lg" noValidate>
        <div className="mb-6 text-center">
          <Sprout className="mx-auto h-10 w-10 text-brand-600" />
          <h1 className="mt-2 text-2xl font-bold text-brand-900">Farmer Login</h1>
        </div>

        {serverError && (
          <p role="alert" className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{serverError}</p>
        )}

        <label className="block text-sm font-medium" htmlFor="mobile">Mobile number</label>
        <input
          id="mobile"
          inputMode="numeric"
          className="mt-1 w-full rounded-lg border px-3 py-3 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
          {...register("mobile", {
            required: "Mobile number is required",
            pattern: { value: /^[6-9]\d{9}$/, message: "Enter a valid 10-digit Indian mobile number" },
          })}
        />
        {errors.mobile && <p className="mt-1 text-sm text-red-600">{errors.mobile.message}</p>}

        <div className="mt-4 flex items-center justify-between">
          <label className="block text-sm font-medium" htmlFor="password">Password</label>
          <Link to="/forgot-password" className="text-xs font-semibold text-brand-700 hover:underline">
            Forgot password?
          </Link>
        </div>
        <div className="relative mt-1">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            className="w-full rounded-lg border px-3 py-3 pr-11 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
            {...register("password", { required: "Password is required" })}
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
        {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}

        <button
          disabled={isSubmitting}
          className="mt-6 w-full rounded-lg bg-brand-600 py-3 font-medium text-white hover:bg-brand-700 disabled:opacity-60 cursor-pointer"
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </button>

        <p className="mt-4 text-center text-sm text-gray-600">
          New farmer? <Link to="/register" className="font-medium text-brand-700">Register here</Link>
        </p>
      </form>
    </div>
  );
}
