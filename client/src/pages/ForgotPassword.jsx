import { useState } from "react";
import { Link } from "react-router-dom";
import { KeyRound, ArrowLeft, CheckCircle2, Eye, EyeOff, ShieldAlert } from "lucide-react";
import api, { getErrorMessage } from "../services/api";

export default function ForgotPassword() {
  const [step, setStep] = useState(1); // 1 = enter mobile/email, 2 = enter OTP and new password, 3 = success
  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState("");
  const [demoOtp, setDemoOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setError("");
    if (!identifier.trim()) {
      setError("Please enter your registered mobile number or email.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/auth/forgot-password", { identifier: identifier.trim() });
      setDemoOtp(res.data.demoOtp || "");
      if (res.data.demoOtp) {
        setOtp(res.data.demoOtp); // Auto-fill demo OTP for convenience
      }
      setStep(2);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");

    if (!otp.trim()) {
      setError("Please enter the 6-digit OTP.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/auth/reset-password", {
        identifier: identifier.trim(),
        otp: otp.trim(),
        newPassword,
      });

      setSuccessMsg(res.data.message || "Password reset successful!");
      setStep(3);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md items-center px-3.5 py-8 sm:px-4 sm:py-12">
      <div className="w-full rounded-2xl sm:rounded-3xl bg-white p-5 sm:p-8 shadow-lg border border-brand-100">
        <div className="mb-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-100 text-brand-700">
            <KeyRound className="h-6 w-6" />
          </div>
          <h1 className="mt-3 text-2xl font-bold text-brand-900">Forgot Password</h1>
          <p className="mt-1 text-xs text-gray-500">
            {step === 1 && "Enter your registered mobile number or email to receive a reset code."}
            {step === 2 && "Enter the verification code and set your new password."}
            {step === 3 && "Your password has been updated."}
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</div>
        )}

        {/* STEP 1: Enter mobile / email */}
        {step === 1 && (
          <form onSubmit={handleRequestOtp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="identifier">
                Registered Mobile Number or Email
              </label>
              <input
                id="identifier"
                type="text"
                required
                placeholder="e.g. 9876543210 or admin@agrocane.com"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="mt-1 w-full rounded-xl border px-4 py-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-xl bg-brand-600 py-3 font-semibold text-white shadow-sm hover:bg-brand-700 disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Verifying Account..." : "Send Verification OTP"}
            </button>

            <div className="pt-2 text-center">
              <Link to="/login" className="inline-flex items-center gap-1 text-xs font-semibold text-brand-700 hover:underline">
                <ArrowLeft className="h-3.5 w-3.5" /> Back to Login
              </Link>
            </div>
          </form>
        )}

        {/* STEP 2: Enter OTP and New Password */}
        {step === 2 && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            {demoOtp && (
              <div className="rounded-xl border border-brand-200 bg-brand-50/70 p-3 text-xs text-brand-900">
                <span className="font-bold">Verification Code:</span>
                <p className="mt-0.5">Your OTP code is <span className="font-mono text-base font-extrabold text-brand-700">{demoOtp}</span> (valid for 10 minutes).</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="otp">
                6-Digit Verification OTP
              </label>
              <input
                id="otp"
                type="text"
                maxLength={6}
                required
                placeholder="Enter 6-digit code"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="mt-1 w-full rounded-xl border px-4 py-3 text-center font-mono text-lg font-bold tracking-widest focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="newPassword">
                New Password
              </label>
              <div className="relative mt-1">
                <input
                  id="newPassword"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="At least 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full rounded-xl border px-4 py-3 pr-11 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
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
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="confirmPassword">
                Confirm New Password
              </label>
              <div className="relative mt-1">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  placeholder="Repeat new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-xl border px-4 py-3 pr-11 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
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
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-xl bg-brand-600 py-3 font-semibold text-white shadow-sm hover:bg-brand-700 disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Updating Password..." : "Reset Password"}
            </button>

            <div className="flex justify-between pt-2 text-xs">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-gray-500 hover:text-gray-700 cursor-pointer"
              >
                Change Mobile / Email
              </button>
              <Link to="/login" className="font-semibold text-brand-700 hover:underline">
                Back to Login
              </Link>
            </div>
          </form>
        )}

        {/* STEP 3: Success Screen */}
        {step === 3 && (
          <div className="text-center space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-600">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <p className="text-sm font-medium text-gray-800">{successMsg}</p>
            <div className="pt-2">
              <Link
                to="/login"
                className="inline-block w-full rounded-xl bg-brand-600 py-3 font-semibold text-white shadow-sm hover:bg-brand-700"
              >
                Go to Farmer Login
              </Link>
              <Link
                to="/admin/login"
                className="mt-2 inline-block w-full rounded-xl border border-gray-300 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"
              >
                Go to Admin Login
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
