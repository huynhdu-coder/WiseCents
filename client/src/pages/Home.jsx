import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-app-bg px-4 text-center">

      {/* Title */}
      <h1 className="text-3xl font-bold text-app-text sm:text-4xl">
        Welcome to WiseCents
      </h1>

      {/* Subtitle */}
      <p className="mt-3 max-w-md text-sm text-app-muted sm:text-base">
        Track your spending, save smarter, and let AI guide you toward financial freedom.
      </p>

      {/* Actions */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Link
          to="/login"
          className="rounded-xl bg-app-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-app-primaryHover"
        >
          Log In
        </Link>

        <Link
          to="/register"
          className="rounded-xl border border-app-border bg-app-surface px-6 py-3 text-sm font-semibold text-app-text transition hover:bg-app-soft"
        >
          Sign Up
        </Link>
      </div>

      {/* Footer */}
      <footer className="mt-10 text-xs text-app-muted">
        © {new Date().getFullYear()} WiseCents. All rights reserved.
      </footer>
    </div>
  );
}