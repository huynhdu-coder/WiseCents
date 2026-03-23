import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const STEPS = {
  EMAIL: "email",
  CODE: "code",
  NEW_PASSWORD: "new_password",
  SUCCESS: "success",
};

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(STEPS.EMAIL);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRequestCode = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/auth/forgot-password", { email });
      setStep(STEPS.CODE);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send code. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/auth/verify-reset-code", { email, code });
      setStep(STEPS.NEW_PASSWORD);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid or expired code.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/auth/reset-password", { email, code, newPassword });
      setStep(STEPS.SUCCESS);
    } catch (err) {
      setError(err.response?.data?.message || "Password reset failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-sm">
        {step !== STEPS.SUCCESS && (
          <div className="flex justify-center gap-2 mb-6">
            {[STEPS.EMAIL, STEPS.CODE, STEPS.NEW_PASSWORD].map((s, i) => (
              <div
                key={s}
                className={`h-2 w-8 rounded-full transition-colors ${
                  [STEPS.EMAIL, STEPS.CODE, STEPS.NEW_PASSWORD].indexOf(step) >= i
                    ? "bg-wisegreen"
                    : "bg-gray-200"
                }`}
              />
            ))}
          </div>
        )}
        {step === STEPS.EMAIL && (
          <>
            <h2 className="text-2xl font-bold text-wisegreen mb-2 text-center">
              Reset Password
            </h2>
            <p className="text-gray-500 text-sm text-center mb-6">
              Enter your email and we'll send you a 6-digit verification code.
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleRequestCode} className="space-y-4">
              <div>
                <label className="block text-left text-gray-600 text-sm mb-1">Email</label>
                <input
                  type="email"
                  placeholder="your@gmail.com"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-wisegreen"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-wisegreen text-white py-2 rounded-lg hover:bg-wisegreen/80 transition disabled:opacity-50"
              >
                {loading ? "Sending..." : "Send Code"}
              </button>
            </form>
          </>
        )}
        {step === STEPS.CODE && (
          <>
            <h2 className="text-2xl font-bold text-wisegreen mb-2 text-center">
              Enter Code
            </h2>
            <p className="text-gray-500 text-sm text-center mb-6">
              We sent a 6-digit code to <span className="font-medium text-gray-700">{email}</span>.
              It expires in 15 minutes.
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleVerifyCode} className="space-y-4">
              <div>
                <label className="block text-left text-gray-600 text-sm mb-1">
                  Verification Code
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="123456"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-center text-2xl tracking-widest focus:outline-none focus:ring-2 focus:ring-wisegreen"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                  required
                  disabled={loading}
                />
              </div>
              <button
                type="submit"
                disabled={loading || code.length !== 6}
                className="w-full bg-wisegreen text-white py-2 rounded-lg hover:bg-wisegreen/80 transition disabled:opacity-50"
              >
                {loading ? "Verifying..." : "Verify Code"}
              </button>
            </form>

            <button
              onClick={() => { setStep(STEPS.EMAIL); setError(""); setCode(""); }}
              className="w-full text-sm text-gray-400 hover:text-gray-600 mt-3 text-center"
            >
              ← Use a different email
            </button>
          </>
        )}
        {step === STEPS.NEW_PASSWORD && (
          <>
            <h2 className="text-2xl font-bold text-wisegreen mb-2 text-center">
              New Password
            </h2>
            <p className="text-gray-500 text-sm text-center mb-6">
              Choose a strong password for your account.
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-left text-gray-600 text-sm mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-wisegreen"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-left text-gray-600 text-sm mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-wisegreen"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-wisegreen text-white py-2 rounded-lg hover:bg-wisegreen/80 transition disabled:opacity-50"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          </>
        )}
        {step === STEPS.SUCCESS && (
          <div className="text-center">
            <div className="text-5xl mb-4">✅</div>
            <h2 className="text-2xl font-bold text-wisegreen mb-2">Password Reset!</h2>
            <p className="text-gray-500 text-sm mb-6">
              Your password has been updated. You can now log in with your new password.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="w-full bg-wisegreen text-white py-2 rounded-lg hover:bg-wisegreen/80 transition"
            >
              Go to Login
            </button>
          </div>
        )}
        {step === STEPS.EMAIL && (
          <p className="text-gray-500 text-sm text-center mt-6">
            Remember your password?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-wisegreen font-semibold cursor-pointer hover:underline"
            >
              Login
            </span>
          </p>
        )}
      </div>
    </div>
  );
}
