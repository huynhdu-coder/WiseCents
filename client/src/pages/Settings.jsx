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

  useEffect(() => {
    api.get("/user/profile").then((res) => {
      setPreferences({
        primary_intent: res.data.primary_intent,
        advice_style: res.data.advice_style,
        change_tolerance: res.data.change_tolerance,
      });
    }).catch((err) => console.error(err));
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

  return (
    <div className="max-w-2xl space-y-8">
      <h1 className="text-2xl font-bold text-wisegreen">Settings</h1>
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
          🔒 Your data is never sold or shared with third parties.
        </p>
      </div>
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
