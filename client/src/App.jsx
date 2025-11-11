import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Chat from "./pages/Chat";
import Reports from "./pages/Reports.jsx";
import Settings from "./pages/Settings";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public pages */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* Protected dashboard routes - wrapped in DashboardLayout */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />        {/* /dashboard */}
          <Route path="chat" element={<Chat />} />       {/* /dashboard/chat */}
          <Route path="reports" element={<Reports />} /> {/* /dashboard/reports */}
          <Route path="settings" element={<Settings />} /> {/* /dashboard/settings */}
        </Route>
      </Routes>
    </Router>
  );
}
