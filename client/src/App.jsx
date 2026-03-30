import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import PrivacyConsentModal from "./components/PrivacyConsentModal";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";

import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Chat from "./pages/Chat";
import Reports from "./pages/Reports.jsx";
import Settings from "./pages/Settings";
import InvestmentsPage from "./pages/InvestmentsPage";

import ProtectedRoute from "./components/ProtectedRoute";
import PrivacyPolicy from "./pages/PrivacyPolicy";

function ConsentModal() {
  const { showConsentModal, handleConsent } = useAuth();
  if (!showConsentModal) return null;
  return <PrivacyConsentModal onConsent={handleConsent} />;
}

export default function App() {
  return (
    <AuthProvider>
      <ConsentModal />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="chat" element={<Chat />} />
            <Route path="reports" element={<Reports />} />
            <Route path="investments" element={<InvestmentsPage />} />
            <Route path="settings" element={<Settings />} />
          </Route>

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
