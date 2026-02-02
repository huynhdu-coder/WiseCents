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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold text-wisegreen mb-6 text-center">
          Create your WiseCents account
        </h2>

        {error && (
          <p className="text-red-500 text-sm text-center mb-3">{error}</p>
        )}

        <form onSubmit={handleRegister} className="space-y-4">

          {/* First Name */}
          <div>
            <label className="block text-left text-gray-600 text-sm mb-1">
              First Name
            </label>
            <input
              type="text"
              placeholder="John"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-wisegreen outline-none"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-left text-gray-600 text-sm mb-1">
              Last Name
            </label>
            <input
              type="text"
              placeholder="Doe"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-wisegreen outline-none"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-left text-gray-600 text-sm mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="your@gmail.com"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-wisegreen"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-left text-gray-600 text-sm mb-1">
              Phone
            </label>
            <input
              type="text"
              placeholder="123-456-7890"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-wisegreen"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-left text-gray-600 text-sm mb-1">
              Date of Birth
            </label>
            <input
              type="date"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-wisegreen"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-left text-gray-600 text-sm mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-wisegreen outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-left text-gray-600 text-sm mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-wisegreen outline-none"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-wisegreen text-white py-2 rounded-lg hover:bg-wisegreen/80 transition"
          >
            Create Account
          </button>
        </form>

        <p className="text-gray-500 text-sm text-center mt-6">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-wisegreen font-semibold cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
