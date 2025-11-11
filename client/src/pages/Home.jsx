import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center">
      <h1 className="text-4xl font-bold text-wisegreen mb-4">Welcome to WiseCents</h1>
      <p className="text-gray-600 max-w-md mb-8">
        Track your spending, save smarter, and let our AI guide you toward financial freedom.
      </p>

      <div className="flex gap-4">
        <Link
          to="/login"
          className="bg-wisegreen text-white px-6 py-3 rounded-lg hover:bg-wisegreen/80 transition"
        >
          Log In
        </Link>
        <a
          href="/"
          className="border border-wisegreen text-wisegreen px-6 py-3 rounded-lg hover:bg-wisegreen hover:text-white transition"
        >
          Learn More
        </a>
      </div>

      <footer className="mt-12 text-gray-400 text-sm">
        © {new Date().getFullYear()} WiseCents. All rights reserved.
      </footer>
    </div>
  );
}
