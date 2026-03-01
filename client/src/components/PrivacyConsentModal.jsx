import { useState } from "react";
import owlLogo from "../assets/owl-logo.png";
import api from "../api/axios";

export default function PrivacyConsentModal({ onConsent }) {
  const [decision, setDecision] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleConfirm = async () => {
    if (!decision) return;
    setSaving(true);
    setError("");

    try {
      await api.put("/user/consent", { ai_data_consent: decision });
      localStorage.setItem("ai_data_consent", decision);
      setConfirmed(true);
      setTimeout(() => onConsent(decision), 600);
    } catch (err) {
      setError("Failed to save your preference. Please try again.");
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div
        className={`bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden
          transition-all duration-500 ${confirmed ? "scale-95 opacity-0" : "scale-100 opacity-100"}`}
      >
        <div className="bg-wisegreen px-6 py-5 flex items-center gap-3">
          <img src={owlLogo} alt="WiseCents" className="w-10 h-10 rounded-full" />
          <div>
            <h2 className="text-white font-heading font-semibold text-lg leading-tight">
              Your Data, Your Choice
            </h2>
            <p className="text-wiselight text-xs mt-0.5">WiseCents Privacy Settings</p>
          </div>
        </div>
        <div className="px-6 py-5">
          <p className="text-wisetext text-sm leading-relaxed mb-5">
            To give you personalized AI-powered financial insights, WiseCents can analyze
            your transaction data. You're in full control — you can change this at any
            time in <span className="font-semibold text-wisegreen">Settings</span>.
          </p>
          <div className="space-y-3 mb-6">
            <button
              onClick={() => setDecision("opt-in")}
              className={`w-full text-left rounded-xl border-2 px-4 py-3 transition-all
                ${decision === "opt-in"
                  ? "border-wisegreen bg-green-50"
                  : "border-gray-200 hover:border-wiselight"
                }`}
            >
              <div className="flex items-start gap-3">
                <span className="mt-0.5 text-lg">{decision === "opt-in" ? "🟢" : "⚪"}</span>
                <div>
                  <p className="font-semibold text-wisetext text-sm">Yes, use my transaction data</p>
                  <p className="text-gray-500 text-xs mt-0.5">
                    Get personalized spending insights, budget tips, and AI recommendations
                    based on your real financial activity.
                  </p>
                </div>
              </div>
            </button>

            <button
              onClick={() => setDecision("opt-out")}
              className={`w-full text-left rounded-xl border-2 px-4 py-3 transition-all
                ${decision === "opt-out"
                  ? "border-wiseyellow bg-yellow-50"
                  : "border-gray-200 hover:border-wiselight"
                }`}
            >
              <div className="flex items-start gap-3">
                <span className="mt-0.5 text-lg">{decision === "opt-out" ? "🔴" : "⚪"}</span>
                <div>
                  <p className="font-semibold text-wisetext text-sm">No, keep my data private</p>
                  <p className="text-gray-500 text-xs mt-0.5">
                    AI will only offer general financial advice without accessing
                    your personal transaction history.
                  </p>
                </div>
              </div>
            </button>
          </div>

          {error && (
            <p className="text-red-500 text-xs mb-4">{error}</p>
          )}

          <p className="text-xs text-gray-400 mb-5 leading-relaxed">
            🔒 Your data is never sold or shared with third parties. See our full{" "}
            <a href="/privacy" className="underline text-wisegreen hover:text-green-700">
              Privacy Policy
            </a>{" "}
            for details.
          </p>

          <button
            onClick={handleConfirm}
            disabled={!decision || saving}
            className={`w-full py-2.5 rounded-xl font-semibold text-sm transition-all
              ${decision && !saving
                ? "bg-wisegreen text-white hover:bg-green-700 cursor-pointer"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
          >
            {saving ? "Saving..." : "Confirm & Continue"}
          </button>
        </div>
      </div>
    </div>
  );
}
