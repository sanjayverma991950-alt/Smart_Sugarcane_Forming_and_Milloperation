import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ShieldCheck, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getErrorMessage } from "../services/api";

export default function AdminLogin() {
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
      await login(data, true);
      navigate("/admin");
    } catch (err) {
      setServerError(getErrorMessage(err));
    }
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md items-center px-4 py-12">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full rounded-2xl bg-white p-8 shadow-lg" noValidate>
        <div className="mb-6 text-center">
          <ShieldCheck className="mx-auto h-10 w-10 text-brand-600" />
          <h1 className="mt-2 text-2xl font-bold text-brand-900">Admin Login</h1>
          <p className="text-sm text-gray-500">Authorized mill staff only</p>
        </div>

        {serverError && (
          <p role="alert" className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{serverError}</p>
        )}

        <label className="block text-sm font-medium" htmlFor="email">Email</label>
        <input id="email" type="email"
          className="mt-1 w-full rounded-lg border px-3 py-3 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
          {...register("email", { required: "Email is required" })} />
        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}

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

        <button disabled={isSubmitting} className="mt-6 w-full rounded-lg bg-brand-700 py-3 font-medium text-white hover:bg-brand-900 disabled:opacity-60 cursor-pointer">
          {isSubmitting ? "Logging in..." : "Login as Admin"}
        </button>
      </form>
    </div>
  );
}
