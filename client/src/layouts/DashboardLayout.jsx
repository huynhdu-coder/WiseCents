import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import AIChatWidget from "../components/AIChatWidget";
import AlertToasts from "../components/AlertToasts";
import api from "../api/axios";

export default function DashboardLayout() {
  const [subscription, setSubscription] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/subscription")
      .then((res) => {
        setSubscription(res.data);

        if (
          location.pathname !== "/dashboard/subscription" &&
          (res.data.subscription_status === "expired" ||
            res.data.show_trial_warning)
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
    <div className="h-screen overflow-hidden bg-app-bg text-app-text font-body">
      <div className="flex h-full">
        <Sidebar />

        <div className="min-w-0 flex-1">
          <main className="h-full overflow-hidden">
            {location.pathname === "/dashboard/chat" ? (
              <div className="h-full">
                <Outlet />
              </div>
            ) : (
              <div className="mx-auto h-full max-w-[1400px] overflow-y-auto px-4 py-4 sm:px-5 lg:px-6">
                <Outlet />
              </div>
            )}
          </main>
        </div>
      </div>

      <AIChatWidget />
      <AlertToasts />

      {showPopup && subscription && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="max-w-sm rounded-xl bg-white p-6 text-center shadow-lg">
            <h2 className="mb-2 text-lg font-semibold">
              {subscription.subscription_status === "expired"
                ? "Trial Expired"
                : "Trial Ending Soon"}
            </h2>

            <p className="mb-4 text-sm text-gray-600">
              {subscription.subscription_status === "expired"
                ? "Your free trial has ended. Upgrade to continue full access."
                : `Your free trial ends in ${subscription.trial_days_left} day(s). Choose a plan to avoid interruption.`}
            </p>

            <button
              onClick={handleViewPlans}
              className="rounded bg-app-primary px-4 py-2 text-white hover:bg-app-primaryHover"
            >
              View Plans
            </button>

            <button
              onClick={() => setShowPopup(false)}
              className="mx-auto mt-2 block text-sm text-gray-500"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  );
}