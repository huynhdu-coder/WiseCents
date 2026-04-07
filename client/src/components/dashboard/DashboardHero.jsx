import NotificationBell from "../NotificationBell";
import { useNavigate } from "react-router-dom";

export default function DashboardHero({ onManageGoals }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const firstName =
    user?.first_name || user?.name?.split(" ")[0] || "there";

  return (
    <section className="sticky top-0 z-20 -mx-4 mb-4 border-b border-app-border bg-app-bg/90 px-4 py-3 backdrop-blur-sm sm:-mx-5 sm:px-5 lg:-mx-6 lg:px-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold leading-tight text-app-text sm:text-3xl">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-app-muted">
            Welcome back {firstName}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-app-border bg-app-soft text-app-text transition hover:bg-app-mutedSurface"
            aria-label="Notifications"
          >
            <NotificationBell className="text-base" />
          </button>

          <button
            type="button"
            onClick={() => navigate("/dashboard/reports")}
            className="rounded-full border border-app-border bg-app-surface px-3.5 py-2 text-sm font-semibold text-app-text transition hover:bg-app-soft"
          >
            View Reports
          </button>

          {/* <button
            type="button"
            onClick={onManageGoals}
            className="rounded-full bg-app-primary px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-app-primaryHover"
          >
            Manage Goals
          </button> */}
        </div>
      </div>
    </section>
  );
}