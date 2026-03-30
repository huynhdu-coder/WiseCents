import { useState, useEffect } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Settings() {
  const { aiConsent, setShowConsentModal, handleConsent } = useAuth();

  const [preferences, setPreferences] = useState({
    primary_intent: "general_budgeting",
    advice_style: "balanced",
    change_tolerance: "moderate",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [consentLoading, setConsentLoading] = useState(false);
  const [consentMessage, setConsentMessage] = useState("");

  const [notifSettings, setNotifSettings] = useState({
    notif_email_digest: true,
    notif_budget_alerts: true,
    notif_goal_alerts: true,
    notif_budget_threshold: 80,
  });
  const [notifLoading, setNotifLoading] = useState(false);
  const [notifMessage, setNotifMessage] = useState("");

  useEffect(() => {
    api.get("/user/profile").then((res) => {
      setPreferences({
        primary_intent: res.data.primary_intent,
        advice_style: res.data.advice_style,
        change_tolerance: res.data.change_tolerance,
      });
    }).catch((err) => console.error(err));

    api.get("/notifications/settings").then((res) => {
      setNotifSettings({
        notif_email_digest: res.data.notif_email_digest ?? true,
        notif_budget_alerts: res.data.notif_budget_alerts ?? true,
        notif_goal_alerts: res.data.notif_goal_alerts ?? true,
        notif_budget_threshold: res.data.notif_budget_threshold ?? 80,
      });
    }).catch((err) => console.error("Failed to load notification settings", err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      await api.put("/user/preferences", preferences);
      setMessage("✅ Preferences saved successfully!");
    } catch (err) {
      setMessage("❌ Failed to save preferences");
    } finally {
      setLoading(false);
    }
  };

  const handleConsentToggle = async (newConsent) => {
    setConsentLoading(true);
    setConsentMessage("");
    try {
      await api.put("/user/consent", { ai_data_consent: newConsent });
      localStorage.setItem("ai_data_consent", newConsent);
      handleConsent(newConsent);
      setConsentMessage("✅ Consent preference saved!");
    } catch (err) {
      setConsentMessage("❌ Failed to update consent");
    } finally {
      setConsentLoading(false);
    }
  };

  const handleNotifSave = async (e) => {
    e.preventDefault();
    setNotifLoading(true);
    setNotifMessage("");
    try {
      await api.put("/notifications/settings", notifSettings);
      setNotifMessage("✅ Notification settings saved!");
    } catch (err) {
      setNotifMessage("❌ Failed to save notification settings");
    } finally {
      setNotifLoading(false);
    }
  };

  const Toggle = ({ checked, onChange, label, description }) => (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
      <div>
        <p className="text-sm font-semibold text-wisetext">{label}</p>
        {description && <p className="text-xs text-gray-400 mt-0.5">{description}</p>}
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
          checked ? "bg-wisegreen" : "bg-gray-300"
        }`}
        role="switch"
        aria-checked={checked}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );

  return (
    <div className="max-w-2xl space-y-8">
      <h1 className="text-2xl font-bold text-wisegreen">Settings</h1>
      <form onSubmit={handleNotifSave} className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold text-wisegreen mb-1">🔔 Notification Settings</h2>
        <p className="text-sm text-gray-500 mb-5">
          Control how WiseCents keeps you informed about your budget and goals.
        </p>

        <div className="mb-5">
          <Toggle
            checked={notifSettings.notif_email_digest}
            onChange={(val) => setNotifSettings((s) => ({ ...s, notif_email_digest: val }))}
            label="Daily Email Digest"
            description="Receive a daily summary of your budget usage and goal progress at 8:00 AM UTC."
          />
          <Toggle
            checked={notifSettings.notif_budget_alerts}
            onChange={(val) => setNotifSettings((s) => ({ ...s, notif_budget_alerts: val }))}
            label="Budget Alerts"
            description="Get notified when your monthly spending reaches a threshold vs. last month."
          />
          <Toggle
            checked={notifSettings.notif_goal_alerts}
            onChange={(val) => setNotifSettings((s) => ({ ...s, notif_goal_alerts: val }))}
            label="Goal Milestone Alerts"
            description="Get notified at 25%, 50%, 75%, and 100% progress on your savings goals."
          />
        </div>

        {notifSettings.notif_budget_alerts && (
          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Budget Alert Threshold
            </label>
            <p className="text-xs text-gray-400 mb-3">
              Alert me when spending reaches{" "}
              <strong className="text-wisegreen">{notifSettings.notif_budget_threshold}%</strong> of
              last month's total.
            </p>
            <input
              type="range"
              min={10}
              max={100}
              step={5}
              value={notifSettings.notif_budget_threshold}
              onChange={(e) =>
                setNotifSettings((s) => ({
                  ...s,
                  notif_budget_threshold: Number(e.target.value),
                }))
              }
              className="w-full accent-wisegreen"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>10%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>
        )}

        {notifMessage && (
          <div
            className={`mb-4 p-3 rounded text-sm ${
              notifMessage.includes("✅")
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {notifMessage}
          </div>
        )}

        <button
          type="submit"
          disabled={notifLoading}
          className="bg-wisegreen text-white px-6 py-2 rounded hover:bg-green-700 disabled:opacity-50 text-sm"
        >
          {notifLoading ? "Saving..." : "Save Notification Settings"}
        </button>
      </form>
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold text-wisegreen mb-1">AI Data Privacy</h2>
        <p className="text-sm text-gray-500 mb-5">
          Control whether WiseCents can use your transaction history to personalize AI advice.
        </p>

        <div className="space-y-3">
          <button
            onClick={() => handleConsentToggle("opt-in")}
            disabled={consentLoading}
            className={`w-full text-left rounded-xl border-2 px-4 py-3 transition-all
              ${aiConsent === "opt-in"
                ? "border-wisegreen bg-green-50"
                : "border-gray-200 hover:border-gray-300"
              } disabled:opacity-50`}
          >
            <div className="flex items-start gap-3">
              <span className="mt-0.5 text-lg">{aiConsent === "opt-in" ? "🟢" : "⚪"}</span>
              <div>
                <p className="font-semibold text-sm text-wisetext">
                  Yes, use my transaction data
                  {aiConsent === "opt-in" && (
                    <span className="ml-2 text-xs font-normal text-wisegreen bg-green-100 px-2 py-0.5 rounded-full">
                      Active
                    </span>
                  )}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Get personalized spending insights and AI recommendations based on your activity.
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={() => handleConsentToggle("opt-out")}
            disabled={consentLoading}
            className={`w-full text-left rounded-xl border-2 px-4 py-3 transition-all
              ${aiConsent === "opt-out"
                ? "border-wiseyellow bg-yellow-50"
                : "border-gray-200 hover:border-gray-300"
              } disabled:opacity-50`}
          >
            <div className="flex items-start gap-3">
              <span className="mt-0.5 text-lg">{aiConsent === "opt-out" ? "🔴" : "⚪"}</span>
              <div>
                <p className="font-semibold text-sm text-wisetext">
                  No, keep my data private
                  {aiConsent === "opt-out" && (
                    <span className="ml-2 text-xs font-normal text-wiseyellow bg-yellow-100 px-2 py-0.5 rounded-full">
                      Active
                    </span>
                  )}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  AI will only offer general financial advice without your transaction history.
                </p>
              </div>
            </div>
          </button>
        </div>

        {!aiConsent && (
          <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-500">
            You haven't set a preference yet.{" "}
            <button
              onClick={() => setShowConsentModal(true)}
              className="text-wisegreen font-semibold underline"
            >
              Set it now
            </button>
          </div>
        )}

        {consentMessage && (
          <p className={`mt-3 text-sm ${consentMessage.includes("✅") ? "text-green-600" : "text-red-600"}`}>
            {consentMessage}
          </p>
        )}

        <p className="mt-4 text-xs text-gray-400">
          🔒 Your data is never sold or shared with third parties.{" "}
          <a
            href="/privacy"
            target="_blank"
            rel="noreferrer"
            className="underline text-wisegreen hover:text-green-700"
          >
            View Privacy Policy
          </a>
        </p>
      </div>

      {/* ── AI Preferences ────────────────────────────────────────── */}
      {aiConsent === "opt-in" && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-wisegreen mb-5">AI Preferences</h2>

          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">
              What's your primary financial goal?
            </label>
            <select
              value={preferences.primary_intent}
              onChange={(e) => setPreferences({ ...preferences, primary_intent: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2"
            >
              <option value="save_more">Save More Money</option>
              <option value="reduce_debt">Reduce Debt</option>
              <option value="investment_planning">Investment Planning</option>
              <option value="expense_tracking">Track Expenses</option>
              <option value="general_budgeting">General Budgeting</option>
              <option value="retirement_planning">Retirement Planning</option>
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">
              How should the AI advisor communicate?
            </label>
            <select
              value={preferences.advice_style}
              onChange={(e) => setPreferences({ ...preferences, advice_style: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2"
            >
              <option value="motivational">Motivational & Encouraging</option>
              <option value="balanced">Balanced (Default)</option>
              <option value="analytical">Analytical & Data-Driven</option>
              <option value="strict">Strict & Direct</option>
              <option value="casual">Casual & Friendly</option>
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">
              How aggressive should budget recommendations be?
            </label>
            <select
              value={preferences.change_tolerance}
              onChange={(e) => setPreferences({ ...preferences, change_tolerance: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2"
            >
              <option value="conservative">Conservative - Small, gradual changes</option>
              <option value="moderate">Moderate - Balanced approach</option>
              <option value="aggressive">Aggressive - Significant changes</option>
              <option value="very_aggressive">Very Aggressive - Maximum savings</option>
            </select>
          </div>

          {message && (
            <div className={`mb-4 p-3 rounded ${message.includes("✅") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-wisegreen text-white px-6 py-2 rounded hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Preferences"}
          </button>
        </form>
      )}
      {aiConsent === "opt-out" && (
        <div className="bg-white p-6 rounded-lg shadow border border-gray-100 text-center">
          <p className="text-2xl mb-2">🔒</p>
          <p className="text-gray-600 font-semibold text-sm">AI Preferences are hidden.</p>
          <p className="text-gray-400 text-xs mt-1">
            Opt in to AI data use above to unlock personalized preference settings.
          </p>
        </div>
      )}
    </div>
  );
}
