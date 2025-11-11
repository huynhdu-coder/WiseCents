import React from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
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
            />
          </div>

          <div>
            <label className="block text-left text-gray-600 text-sm mb-1">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-wisegreen"
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
          <span className="text-wisegreen font-semibold cursor-pointer hover:underline">
            Sign up soon
          </span>
        </p>
      </div>
    </div>
  );
}
