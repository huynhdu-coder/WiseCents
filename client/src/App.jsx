import { BrowserRouter, Routes, Route,} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Chat from "./pages/Chat";
import Reports from "./pages/Reports.jsx";
import Settings from "./pages/Settings";

import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* Public pages */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected dashboard routes - wrapped in DashboardLayout */}
          <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
            <Route index element={<Dashboard />} />        {/* /dashboard */}
            <Route path="chat" element={<Chat />} />       {/* /dashboard/chat */}
            <Route path="reports" element={<Reports />} /> {/* /dashboard/reports */}
            <Route path="settings" element={<Settings />} /> {/* /dashboard/settings */}
            </Route>

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
