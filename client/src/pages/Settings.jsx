import { useState, useEffect } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import PageHeader from "../components/layout/PageHeader";

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
  <div className="flex items-center justify-between py-3 border-b border-app-border last:border-0">
    <div>
      <p className="text-sm font-semibold text-app-text">{label}</p>
      {description && (
        <p className="text-xs text-app-muted mt-0.5">
          {description}
        </p>
      )}
    </div>

    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition ${
        checked ? "bg-app-primary" : "bg-app-border"
      }`}
      role="switch"
      aria-checked={checked}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-app-surface shadow transition ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  </div>
);

return (
  <div className="max-w-2xl space-y-8 text-app-text">
    <PageHeader
      title="Settings"  
      subtitle="Customize your WiseCents experience and manage your preferences."
    />

    <form onSubmit={handleNotifSave} className="bg-app-surface p-6 rounded-xl shadow-card border border-app-border">
      <h2 className="text-xl font-semibold text-app-primary mb-1">
        🔔 Notification Settings
      </h2>
      <p className="text-sm text-app-muted mb-5">
        Control how WiseCents keeps you informed about your budget and goals.
      </p>

      <div className="mb-5">
        <Toggle
          checked={notifSettings.notif_email_digest}
          onChange={(val) => setNotifSettings((s) => ({ ...s, notif_email_digest: val }))}
          label="Daily Email Digest"
          description="Receive a daily summary of your budget usage and goal progress."
        />

        <Toggle
          checked={notifSettings.notif_budget_alerts}
          onChange={(val) => setNotifSettings((s) => ({ ...s, notif_budget_alerts: val }))}
          label="Budget Alerts"
          description="Get notified when your monthly spending reaches a threshold."
        />

        <Toggle
          checked={notifSettings.notif_goal_alerts}
          onChange={(val) => setNotifSettings((s) => ({ ...s, notif_goal_alerts: val }))}
          label="Goal Milestone Alerts"
          description="Get notified when your goals hit milestones."
        />
      </div>

      {notifSettings.notif_budget_alerts && (
        <div className="mb-5">
          <label className="block text-sm font-semibold text-app-text mb-1">
            Budget Alert Threshold
          </label>

          <p className="text-xs text-app-muted mb-3">
            Alert me when spending reaches{" "}
            <strong className="text-app-primary">
              {notifSettings.notif_budget_threshold}%
            </strong>
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
            className="w-full accent-app-primary"
          />

          <div className="flex justify-between text-xs text-app-muted mt-1">
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
              ? "bg-app-primarySoft text-app-primary"
              : "bg-red-100 text-red-600"
          }`}
        >
          {notifMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={notifLoading}
        className="bg-app-primary text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-app-primaryHover disabled:opacity-50"
      >
        {notifLoading ? "Saving..." : "Save Notification Settings"}
      </button>
    </form>

    {/* AI Consent */}
    <div className="bg-app-surface p-6 rounded-xl shadow-card border border-app-border">
      <h2 className="text-xl font-semibold text-app-primary mb-1">
        AI Data Privacy
      </h2>

      <p className="text-sm text-app-muted mb-5">
        Control whether WiseCents can use your data for AI insights.
      </p>

      <div className="space-y-3">
        <button
          onClick={() => handleConsentToggle("opt-in")}
          disabled={consentLoading}
          className={`w-full text-left rounded-xl border px-4 py-3 transition ${
            aiConsent === "opt-in"
              ? "border-app-primary bg-app-primarySoft"
              : "border-app-border hover:border-app-muted"
          }`}
        >
          <p className="text-sm font-semibold text-app-text">
            Yes, use my transaction data
          </p>
          <p className="text-xs text-app-muted mt-1">
            Get personalized AI insights
          </p>
        </button>

        <button
          onClick={() => handleConsentToggle("opt-out")}
          disabled={consentLoading}
          className={`w-full text-left rounded-xl border px-4 py-3 transition ${
            aiConsent === "opt-out"
              ? "border-app-primary bg-app-primarySoft"
              : "border-app-border hover:border-app-muted"
          }`}
        >
          <p className="text-sm font-semibold text-app-text">
            No, keep my data private
          </p>
          <p className="text-xs text-app-muted mt-1">
            AI will provide general advice only
          </p>
        </button>
      </div>

      {!aiConsent && (
        <div className="mt-4 p-3 bg-app-soft border border-app-border rounded-lg text-sm text-app-muted">
          You haven't set a preference yet.{" "}
          <button
            onClick={() => setShowConsentModal(true)}
            className="text-app-primary font-semibold underline"
          >
            Set it now
          </button>
        </div>
      )}

      {consentMessage && (
        <p className="mt-3 text-sm text-app-muted">{consentMessage}</p>
      )}

      <p className="mt-4 text-xs text-app-muted">
        🔒 Your data is never shared.{" "}
        <a
          href="/privacy"
          target="_blank"
          rel="noreferrer"
          className="underline text-app-primary"
        >
          View Privacy Policy
        </a>
      </p>
    </div>

    {/* AI Preferences */}
      {aiConsent === "opt-in" && (
      <form
        onSubmit={handleSubmit}
        className="bg-app-surface p-6 rounded-xl shadow-card border border-app-border"
      >
        <h2 className="text-xl font-semibold text-app-primary mb-5">
          AI Preferences
        </h2>

        <div className="mb-6">
          <label className="block text-app-text font-semibold mb-2">
            What's your primary financial goal?
          </label>
          <select
            value={preferences.primary_intent}
            onChange={(e) =>
              setPreferences({
                ...preferences,
                primary_intent: e.target.value,
              })
            }
            className="w-full border border-app-border rounded-lg px-3 py-2 text-sm bg-app-bg text-app-text focus:outline-none focus:ring-2 focus:ring-app-primary"
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
          <label className="block text-app-text font-semibold mb-2">
            How should the AI advisor communicate?
          </label>
          <select
            value={preferences.advice_style}
            onChange={(e) =>
              setPreferences({
                ...preferences,
                advice_style: e.target.value,
              })
            }
            className="w-full border border-app-border rounded-lg px-3 py-2 text-sm bg-app-bg text-app-text focus:outline-none focus:ring-2 focus:ring-app-primary"
          >
            <option value="motivational">Motivational & Encouraging</option>
            <option value="balanced">Balanced (Default)</option>
            <option value="analytical">Analytical & Data-Driven</option>
            <option value="strict">Strict & Direct</option>
            <option value="casual">Casual & Friendly</option>
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-app-text font-semibold mb-2">
            How aggressive should budget recommendations be?
          </label>
          <select
            value={preferences.change_tolerance}
            onChange={(e) =>
              setPreferences({
                ...preferences,
                change_tolerance: e.target.value,
              })
            }
            className="w-full border border-app-border rounded-lg px-3 py-2 text-sm bg-app-bg text-app-text focus:outline-none focus:ring-2 focus:ring-app-primary"
          >
            <option value="conservative">
              Conservative - Small, gradual changes
            </option>
            <option value="moderate">Moderate - Balanced approach</option>
            <option value="aggressive">Aggressive - Significant changes</option>
            <option value="very_aggressive">
              Very Aggressive - Maximum savings
            </option>
          </select>
        </div>

        {message && (
          <div
            className={`mt-3 text-sm ${
              message.includes("✅")
                ? "text-green-600"
                : "text-red-500"
            }`}
          >
            {message}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-4 bg-app-primary text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-app-primaryHover disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Preferences"}
        </button>
      </form>
    )}

    {aiConsent === "opt-out" && (
      <div className="bg-app-surface p-6 rounded-xl shadow-card border border-app-border text-center">
        <p className="text-2xl mb-2">🔒</p>
        <p className="text-app-text font-semibold text-sm">
          AI Preferences are hidden.
        </p>
        <p className="text-app-muted text-xs mt-1">
          Opt in to AI data use above to unlock personalized preference settings.
        </p>
      </div>
    )}
  </div>
);
}
