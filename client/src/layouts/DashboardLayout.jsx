import React from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { Outlet } from "react-router-dom"; 
import AIChatWidget from "../components/AIChatWidget";

export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-wisewhite font-body">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <Topbar />

        {/* Main content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>

      {/* FLOATING AI CHAT W/ OWL LOGO*/}
      <AIChatWidget />
    </div>
  );
}
