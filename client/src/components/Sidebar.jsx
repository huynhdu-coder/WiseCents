import React from "react";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const navClass = ({ isActive }) =>
    isActive ? "text-wiseyellow font-semibold" : "hover:text-wiseyellow";

  return (
    <aside className="bg-wisegreen text-wisewhite w-64 min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-8">WiseCents</h1>
      <nav className="flex flex-col gap-4">
        <NavLink to="/dashboard" end className={navClass}>Dashboard</NavLink>
        <NavLink to="/dashboard/bank-connect" className={navClass}>Connect Bank</NavLink>
        <NavLink to="/dashboard/reports" className={navClass}>Reports</NavLink>
        <NavLink to="/dashboard/chat" className={navClass}>AI Chat</NavLink>
        <NavLink to="/dashboard/settings" className={navClass}>Settings</NavLink>
      </nav>
    </aside>
  );
}
