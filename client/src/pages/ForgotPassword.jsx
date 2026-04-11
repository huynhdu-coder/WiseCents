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
    <div className="flex min-h-screen items-center justify-center bg-app-bg px-4 text-app-text">
      <div className="w-full max-w-sm rounded-xl3 border border-app-border bg-app-surface p-8 shadow-card">
        {step !== STEPS.SUCCESS && (
          <div className="mb-6 flex justify-center gap-2">
            {[STEPS.EMAIL, STEPS.CODE, STEPS.NEW_PASSWORD].map((s, i) => (
              <div
                key={s}
                className={`h-2 w-8 rounded-full transition-colors ${
                  [STEPS.EMAIL, STEPS.CODE, STEPS.NEW_PASSWORD].indexOf(step) >= i
                    ? "bg-app-primary"
                    : "bg-app-border"
                }`}
              />
            ))}
          </div>
        )}

        {step === STEPS.EMAIL && (
          <>
            <h2 className="mb-2 text-center text-2xl font-semibold text-app-text">
              Reset Password
            </h2>
            <p className="mb-6 text-center text-sm text-app-muted">
              Enter your email and we'll send you a 6-digit verification code.
            </p>

            {error && (
              <div className="mb-4 rounded-xl border border-app-danger/30 bg-app-danger/10 p-3 text-sm text-app-danger">
                {error}
              </div>
            )}

            <form onSubmit={handleRequestCode} className="space-y-4">
              <div>
                <label className="mb-1 block text-left text-sm font-medium text-app-muted">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="your@gmail.com"
                  className="w-full rounded-xl border border-app-border bg-app-soft px-3 py-2 text-app-text placeholder:text-app-muted focus:outline-none focus:ring-2 focus:ring-app-primary/40"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-app-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-app-primaryHover disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Sending..." : "Send Code"}
              </button>
            </form>
          </>
        )}

        {step === STEPS.CODE && (
          <>
            <h2 className="mb-2 text-center text-2xl font-semibold text-app-text">
              Enter Code
            </h2>
            <p className="mb-6 text-center text-sm text-app-muted">
              We sent a 6-digit code to{" "}
              <span className="font-medium text-app-text">{email}</span>. It expires in
              15 minutes.
            </p>

            {error && (
              <div className="mb-4 rounded-xl border border-app-danger/30 bg-app-danger/10 p-3 text-sm text-app-danger">
                {error}
              </div>
            )}

            <form onSubmit={handleVerifyCode} className="space-y-4">
              <div>
                <label className="mb-1 block text-left text-sm font-medium text-app-muted">
                  Verification Code
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="123456"
                  className="w-full rounded-xl border border-app-border bg-app-soft px-3 py-2 text-center text-2xl tracking-[0.3em] text-app-text placeholder:text-app-muted focus:outline-none focus:ring-2 focus:ring-app-primary/40"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                  required
                  disabled={loading}
                />
              </div>
              <button
                type="submit"
                disabled={loading || code.length !== 6}
                className="w-full rounded-xl bg-app-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-app-primaryHover disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Verifying..." : "Verify Code"}
              </button>
            </form>

            <button
              onClick={() => {
                setStep(STEPS.EMAIL);
                setError("");
                setCode("");
              }}
              className="mt-3 w-full text-center text-sm text-app-muted transition hover:text-app-text"
            >
              ← Use a different email
            </button>
          </>
        )}

        {step === STEPS.NEW_PASSWORD && (
          <>
            <h2 className="mb-2 text-center text-2xl font-semibold text-app-text">
              New Password
            </h2>
            <p className="mb-6 text-center text-sm text-app-muted">
              Choose a strong password for your account.
            </p>

            {error && (
              <div className="mb-4 rounded-xl border border-app-danger/30 bg-app-danger/10 p-3 text-sm text-app-danger">
                {error}
              </div>
            )}

            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="mb-1 block text-left text-sm font-medium text-app-muted">
                  New Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-app-border bg-app-soft px-3 py-2 text-app-text placeholder:text-app-muted focus:outline-none focus:ring-2 focus:ring-app-primary/40"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <div>
                <label className="mb-1 block text-left text-sm font-medium text-app-muted">
                  Confirm Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-app-border bg-app-soft px-3 py-2 text-app-text placeholder:text-app-muted focus:outline-none focus:ring-2 focus:ring-app-primary/40"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-app-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-app-primaryHover disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          </>
        )}

        {step === STEPS.SUCCESS && (
          <div className="text-center">
            <div className="mb-4 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-app-success/15 text-3xl text-app-success">
                ✓
              </div>
            </div>
            <h2 className="mb-2 text-2xl font-semibold text-app-text">Password Reset!</h2>
            <p className="mb-6 text-sm text-app-muted">
              Your password has been updated. You can now log in with your new
              password.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="w-full rounded-xl bg-app-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-app-primaryHover"
            >
              Go to Login
            </button>
          </div>
        )}

        {step === STEPS.EMAIL && (
          <p className="mt-6 text-center text-sm text-app-muted">
            Remember your password?{" "}
            <span
              onClick={() => navigate("/login")}
              className="cursor-pointer font-semibold text-app-primary transition hover:text-app-primaryHover hover:underline"
            >
              Login
            </span>
          </p>
        )}
      </div>
    </div>
  );
}
