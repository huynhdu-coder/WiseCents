import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");

  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const res = await api.post("/auth/register", {
        first_name: firstName,
        last_name: lastName,
        email,
        password,
        phone,
        dob,
      });

      // Auto-login
      login(res.data.user, res.data.token);

      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

return (
  <div className="flex min-h-screen items-center justify-center bg-app-bg px-4 text-app-text">
    <div className="w-full max-w-sm rounded-xl3 border border-app-border bg-app-surface p-8 shadow-card">
      <h2 className="mb-6 text-center text-2xl font-semibold text-app-text">
        Create your WiseCents account
      </h2>

      {error && (
        <div className="mb-3 rounded-xl border border-app-danger/30 bg-app-danger/10 px-3 py-2 text-center text-sm text-app-danger">
          {error}
        </div>
      )}

      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <label className="mb-1 block text-left text-sm font-medium text-app-muted">
            First Name
          </label>
          <input
            type="text"
            placeholder="John"
            className="w-full rounded-xl border border-app-border bg-app-soft px-3 py-2 text-app-text placeholder:text-app-muted focus:outline-none focus:ring-2 focus:ring-app-primary/40"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-left text-sm font-medium text-app-muted">
            Last Name
          </label>
          <input
            type="text"
            placeholder="Doe"
            className="w-full rounded-xl border border-app-border bg-app-soft px-3 py-2 text-app-text placeholder:text-app-muted focus:outline-none focus:ring-2 focus:ring-app-primary/40"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>

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
          />
        </div>

        <div>
          <label className="mb-1 block text-left text-sm font-medium text-app-muted">
            Phone
          </label>
          <input
            type="text"
            placeholder="123-456-7890"
            className="w-full rounded-xl border border-app-border bg-app-soft px-3 py-2 text-app-text placeholder:text-app-muted focus:outline-none focus:ring-2 focus:ring-app-primary/40"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div>
          <label className="mb-1 block text-left text-sm font-medium text-app-muted">
            Date of Birth
          </label>
          <input
            type="date"
            className="w-full rounded-xl border border-app-border bg-app-soft px-3 py-2 text-app-text focus:outline-none focus:ring-2 focus:ring-app-primary/40"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
          />
        </div>

        <div>
          <label className="mb-1 block text-left text-sm font-medium text-app-muted">
            Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full rounded-xl border border-app-border bg-app-soft px-3 py-2 text-app-text placeholder:text-app-muted focus:outline-none focus:ring-2 focus:ring-app-primary/40"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
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
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-xl bg-app-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-app-primaryHover"
        >
          Create Account
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-app-muted">
        Already have an account?{" "}
        <span
          onClick={() => navigate("/login")}
          className="cursor-pointer font-semibold text-app-primary transition hover:text-app-primaryHover hover:underline"
        >
          Login
        </span>
      </p>
    </div>
  </div>
);
}
