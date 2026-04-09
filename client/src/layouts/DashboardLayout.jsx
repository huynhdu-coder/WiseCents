import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import AIChatWidget from "../components/AIChatWidget";
import AlertToasts from "../components/AlertToasts";
import api from "../api/axios";

export default function DashboardLayout() {
  const [subscription, setSubscription] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/subscription")
      .then((res) => {
        setSubscription(res.data);

        if (
          location.pathname !== "/dashboard/subscription" &&
          (res.data.subscription_status === "expired" || res.data.show_trial_warning)
        ) {
          setShowPopup(true);
        } else {
          setShowPopup(false);
        }
      })
      .catch((err) => console.error("Failed to load subscription", err));
  }, [location.pathname]);

  const handleViewPlans = () => {
    setShowPopup(false);
    navigate("/dashboard/subscription");
  };

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

      {/* Notification toasts (fixed, top-right) */}
      <AlertToasts />

      {showPopup && subscription && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-sm text-center">
            <h2 className="text-lg font-semibold mb-2">
              {subscription.subscription_status === "expired"
                ? "Trial Expired"
                : "Trial Ending Soon"}
            </h2>

            <p className="text-sm text-gray-600 mb-4">
              {subscription.subscription_status === "expired"
                ? "Your free trial has ended. Upgrade to continue full access."
                : `Your free trial ends in ${subscription.trial_days_left} day(s). Choose a plan to avoid interruption.`}
            </p>

            <button
              onClick={handleViewPlans}
              className="bg-wisegreen text-white px-4 py-2 rounded"
            >
              View Plans
            </button>

            <button
              onClick={() => setShowPopup(false)}
              className="block mt-2 text-sm text-gray-500 mx-auto"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  );
}