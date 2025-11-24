import { useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async(e) => {
    e.preventDefault();
    const res = await api.post("/auth/login", { email, password });
    login(res.data.user, res.data.token);
    navigate("/dashboard");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold text-wisegreen mb-6 text-center">
          Login to WiseCents
        </h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-left text-gray-600 text-sm mb-1">Email</label>
            <input
              type="email"
              placeholder="your@gmail.com"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-wisegreen"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            required
            />
          </div>

          <div>
            <label className="block text-left text-gray-600 text-sm mb-1">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-wisegreen"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-wisegreen text-white py-2 rounded-lg hover:bg-wisegreen/80 transition"
          >
            Login
          </button>
        </form>

        <p className="text-gray-500 text-sm text-center mt-6">
          Don’t have an account?{" "}
          <span 
            onClick={() => navigate("/register")} className="text-wisegreen font-semibold cursor-pointer hover:underline">
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}
