import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import AIChatWidget from "../components/AIChatWidget";
import AlertToasts from "../components/AlertToasts";

export default function DashboardLayout() {
  const routerLocation = useLocation();

  return (
    <div className="h-screen overflow-hidden bg-app-bg text-app-text font-body">
      <div className="flex h-full">
        <Sidebar />

        <div className="min-w-0 flex-1 overflow-y-auto">
          {routerLocation.pathname === "/dashboard/chat" ? (
            <div className="h-full">
              <Outlet />
            </div>
          ) : (
            <main className="mx-auto max-w-[1400px] px-4 py-4 sm:px-5 lg:px-6">
              <Outlet />
            </main>
          )}
        </div>
      </div>

      {routerLocation.pathname !== "/dashboard/chat" &&
        routerLocation.pathname !== "/dashboard/subscription" && (
          <AIChatWidget />
        )}

      <AlertToasts />
    </div>
  );
}