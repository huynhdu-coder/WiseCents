import { useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import owlImage from "../assets/owl-logo.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", { email, password });
      login(res.data.user, res.data.token);
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      if (err.response) {
        setError(err.response.data?.message || "Invalid email or password");
      } else if (err.request) {
        setError("Cannot connect to server. Please check if the backend is running.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

return (
  <div className="flex min-h-screen items-center justify-center bg-app-bg px-4 py-8">
    <div className="w-full max-w-md rounded-xl2 border border-app-border bg-app-surface p-6 shadow-card sm:p-8">
      <div className="mb-6 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-app-primarySoft text-2xl">
          <img src={owlImage} alt="WiseCents Logo" className="h-15 w-15" />
        </div>

        <h2 className="text-2xl font-bold text-app-text sm:text-3xl">
          Login to WiseCents
        </h2>
        <p className="mt-2 text-sm text-app-muted">
          Welcome back. Sign in to continue managing your finances.
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-app-danger/20 bg-app-danger/10 p-3 text-sm text-app-danger">
          {error}
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="mb-1 block text-left text-sm font-medium text-app-text">
            Email
          </label>
          <input
            type="email"
            placeholder="your@email.com"
            className="w-full rounded-xl border border-app-border bg-app-surface px-3 py-2.5 text-sm text-app-text outline-none placeholder:text-app-muted focus:border-app-primary"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div>
          <label className="mb-1 block text-left text-sm font-medium text-app-text">
            Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full rounded-xl border border-app-border bg-app-surface px-3 py-2.5 text-sm text-app-text outline-none placeholder:text-app-muted focus:border-app-primary"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />

          <div className="mt-2 text-right">
            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="text-sm font-medium text-app-primary transition hover:underline"
            >
              Forgot password?
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="w-full rounded-xl bg-app-primary py-2.5 text-sm font-semibold text-white transition hover:bg-app-primaryHover disabled:cursor-not-allowed disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-app-muted">
        Don&apos;t have an account?{" "}
        <button
          type="button"
          onClick={() => navigate("/register")}
          className="font-semibold text-app-primary transition hover:underline"
        >
          Sign up
        </button>
      </p>
    </div>
  </div>
);
}
