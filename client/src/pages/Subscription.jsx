import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Subscription() {
  const [subscription, setSubscription] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const [activating, setActivating] = useState(false);
  const [message, setMessage] = useState("");
  const [promoPopup, setPromoPopup] = useState(null);

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentPlan, setPaymentPlan] = useState(null); // "standard" | "student" | null

  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");

  const loadSubscription = async () => {
    try {
      const res = await api.get("/subscription");
      setSubscription(res.data);
    } catch (err) {
      console.error("Failed to load subscription", err);
    }
  };

  useEffect(() => {
    loadSubscription();
  }, []);

  const handleVerifyEmail = async () => {
    setVerifying(true);
    setMessage("");

    try {
      const res = await api.post("/subscription/verify-student-email");

      setPromoPopup({
        title: res.data.title,
        message: res.data.message,
      });

      await loadSubscription();
    } catch (err) {
      const data = err?.response?.data;

      setPromoPopup({
        title: data?.title || "Verification Failed",
        message:
          data?.message ||
          data?.error ||
          "Unable to verify your signed-in email.",
      });

      await loadSubscription();
    } finally {
      setVerifying(false);
    }
  };

  const handleActivateStudentPlan = async () => {
    setActivating(true);
    setMessage("");

    try {
      const res = await api.post("/subscription/activate-student-plan");
      setMessage(res.data.message);
      setShowPaymentModal(false);
      setPaymentPlan(null);
      await loadSubscription();
    } catch (err) {
      setMessage(
        err?.response?.data?.error || "Failed to activate student plan."
      );
    } finally {
      setActivating(false);
    }
  };

  const handleActivateStandardPlan = async () => {
    setActivating(true);
    setMessage("");

    try {
      const res = await api.post("/subscription/activate-standard-plan");
      setMessage(res.data.message);
      setShowPaymentModal(false);
      setPaymentPlan(null);
      await loadSubscription();
    } catch (err) {
      setMessage(
        err?.response?.data?.error || "Failed to activate standard plan."
      );
    } finally {
      setActivating(false);
    }
  };

  const handleCancelToFree = async () => {
    setActivating(true);
    setMessage("");

    try {
      const res = await api.post("/subscription/cancel-to-free");
      setMessage(res.data.message);
      await loadSubscription();
    } catch (err) {
      setMessage(
        err?.response?.data?.error || "Failed to return to free plan."
      );
    } finally {
      setActivating(false);
    }
  };

  const openPaymentModal = (plan) => {
    setPaymentPlan(plan);
    setShowPaymentModal(true);
  };

  const handlePayNow = async () => {
    if (paymentPlan === "student") {
      await handleActivateStudentPlan();
    } else if (paymentPlan === "standard") {
      await handleActivateStandardPlan();
    }
  };

  if (!subscription) {
    return (
      <div className="p-6 text-app-text">
        Loading subscriptions... Please Wait...
      </div>
    );
  }

  const currentPlanLabel =
    subscription.subscription_type === "student"
      ? "Student Plan"
      : subscription.subscription_type === "standard"
      ? "Full Plan"
      : "Free Trial";

  const isFreePlan = subscription.subscription_type === "free";
  const isFullPlan = subscription.subscription_type === "standard";
  const isStudentPlan =
    subscription.subscription_type === "student" &&
    subscription.student_discount_active;

  const showCancelToFree = !isFreePlan;
  const showActivateFull = !isFullPlan;
  const showVerifyStudent = !isStudentPlan && !subscription.student_verified;
  const showActivateStudent =
    !isStudentPlan &&
    subscription.student_verified &&
    !subscription.student_discount_active;

  return (
    <div className="max-w-5xl space-y-8 text-app-text">
      <h1 className="text-2xl font-bold text-app-text">Subscription Plans</h1>

      <div className="rounded-lg bg-app-surface p-6 shadow-card">
        <h2 className="mb-1 text-lg font-semibold text-app-text">Current Plan</h2>

        <p className="mb-3 text-sm text-app-muted">
          You are currently on: <strong>{currentPlanLabel}</strong>
        </p>

        {subscription.subscription_status === "trial" && (
          <div className="space-y-1 text-sm text-app-muted">
            <p>
              Trial ends on:{" "}
              {new Date(subscription.trial_end).toLocaleDateString()}
            </p>
            <p>Days left: {subscription.trial_days_left}</p>
          </div>
        )}

        {subscription.subscription_status === "expired" && (
          <p className="text-sm font-semibold text-app-danger">
            Your free trial has expired. Upgrade to restore full access.
          </p>
        )}

        {isFullPlan && (
          <p className="mt-2 text-sm text-app-muted">
            Full plan active at $10/month.
          </p>
        )}

        {isStudentPlan && (
          <p className="mt-2 text-sm font-semibold text-app-success">
            Student plan active at $0.50/month.
          </p>
        )}

        {message && <p className="mt-3 text-sm text-app-text">{message}</p>}
      </div>

      <div className="rounded-lg bg-app-surface p-6 shadow-card">
        <h2 className="mb-4 text-lg font-semibold text-app-text">
          Subscription Options
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-app-border text-left">
                <th className="py-3 pr-4">Tier</th>
                <th className="py-3 pr-4">What It Gives</th>
                <th className="py-3 pr-4">Price</th>
                <th className="py-3">Action</th>
              </tr>
            </thead>

            <tbody>
              <tr className="align-top border-b border-app-border">
                <td className="py-4 pr-4 font-semibold">Free Trial</td>

                <td className="py-4 pr-4 text-sm text-app-muted">
                  <ul className="ml-5 list-disc space-y-1">
                    <li>Full access to all features for 10 days</li>
                    <li>AI financial assistant</li>
                    <li>Transaction tracking & reports</li>
                    <li>Budgeting and goal tools</li>
                    <li className="text-app-muted/70">
                      Limited access after trial ends
                    </li>
                  </ul>
                </td>

                <td className="py-4 pr-4">$0</td>

                <td className="py-4">
                  {showCancelToFree ? (
                    <button
                      type="button"
                      onClick={handleCancelToFree}
                      disabled={activating}
                      className="rounded border border-app-border bg-app-surface px-4 py-2 text-app-text hover:bg-app-soft disabled:opacity-50"
                    >
                      {activating ? "Saving..." : "Downgrade / Cancel Subscription"}
                    </button>
                  ) : (
                    <span className="text-sm text-app-muted">Current plan</span>
                  )}
                </td>
              </tr>

              <tr className="align-top border-b border-app-border">
                <td className="py-4 pr-4 font-semibold">Full</td>

                <td className="py-4 pr-4 text-sm text-app-muted">
                  <ul className="ml-5 list-disc space-y-1">
                    <li>Unlimited AI financial assistant access</li>
                    <li>Advanced spending insights & reports</li>
                    <li>Real-time transaction syncing</li>
                    <li>Goal tracking & automation</li>
                    <li>Investment tracking tools</li>
                  </ul>
                </td>

                <td className="py-4 pr-4">$10/month</td>

                <td className="py-4">
                  {showActivateFull ? (
                    <button
                      type="button"
                      onClick={() => openPaymentModal("standard")}
                      className="rounded bg-app-primary px-4 py-2 text-white hover:bg-app-primaryHover"
                    >
                      Sign up for Full Access
                    </button>
                  ) : (
                    <span className="text-sm text-app-muted">Current plan</span>
                  )}
                </td>
              </tr>

              <tr className="align-top">
                <td className="py-4 pr-4 font-semibold">Student</td>

                <td className="py-4 pr-4 text-sm text-app-muted">
                  <ul className="ml-5 list-disc space-y-1">
                    <li>Everything in Full Plan</li>
                    <li>Unlimited AI financial assistant</li>
                    <li>Full budgeting & reporting tools</li>
                    <li>Investment tracking</li>
                    <li className="font-medium text-app-success">
                      Student discount pricing ($0.50/month)
                    </li>
                  </ul>
                </td>

                <td className="py-4 pr-4">$0.50/month</td>

                <td className="py-4">
                  {isStudentPlan ? (
                    <span className="text-sm text-app-muted">Current plan</span>
                  ) : showActivateStudent ? (
                    <button
                      type="button"
                      onClick={() => openPaymentModal("student")}
                      disabled={activating}
                      className="rounded bg-app-primary px-4 py-2 text-white hover:bg-app-primaryHover disabled:opacity-50"
                    >
                      {activating ? "Activating..." : "Verify Email Address for Student Discount"}
                    </button>
                  ) : showVerifyStudent ? (
                    <button
                      type="button"
                      onClick={handleVerifyEmail}
                      disabled={verifying}
                      className="rounded border border-app-border bg-app-surface px-4 py-2 text-app-text hover:bg-app-soft disabled:opacity-50"
                    >
                      {verifying ? "Verifying..." : "Verify Email Address for Student Discount"}
                    </button>
                  ) : (
                    <span className="text-sm text-app-muted">Unavailable</span>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-xl bg-app-surface p-6 shadow-lg">
            <h2 className="mb-4 text-lg font-semibold text-app-text">
              {paymentPlan === "student"
                ? "Enter Payment Information for Student Plan"
                : "Enter Payment Information for Full Plan"}
            </h2>

            <p className="mb-4 text-sm text-app-muted">
              {paymentPlan === "student"
                ? "Student pricing is $0.50/month for verified academic users."
                : "Full plan pricing is $10/month."}
            </p>

            <div className="space-y-3">
              <input
                type="text"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                placeholder="Name on card"
                className="w-full rounded border border-app-border bg-app-surface px-3 py-2 text-app-text placeholder:text-app-muted focus:outline-none focus:ring-2 focus:ring-app-primary"
              />

              <input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                placeholder="Card number"
                className="w-full rounded border border-app-border bg-app-surface px-3 py-2 text-app-text placeholder:text-app-muted focus:outline-none focus:ring-2 focus:ring-app-primary"
              />

              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  value={cardExpiry}
                  onChange={(e) => setCardExpiry(e.target.value)}
                  placeholder="MM/YY"
                  className="w-full rounded border border-app-border bg-app-surface px-3 py-2 text-app-text placeholder:text-app-muted focus:outline-none focus:ring-2 focus:ring-app-primary"
                />

                <input
                  type="text"
                  value={cardCvc}
                  onChange={(e) => setCardCvc(e.target.value)}
                  placeholder="CVC"
                  className="w-full rounded border border-app-border bg-app-surface px-3 py-2 text-app-text placeholder:text-app-muted focus:outline-none focus:ring-2 focus:ring-app-primary"
                />
              </div>
            </div>

            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={handlePayNow}
                disabled={activating}
                className="rounded bg-app-primary px-4 py-2 text-white hover:bg-app-primaryHover disabled:opacity-50"
              >
                {activating ? "Processing..." : "Pay Now"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowPaymentModal(false);
                  setPaymentPlan(null);
                }}
                className="rounded border border-app-border bg-app-surface px-4 py-2 text-app-text hover:bg-app-soft"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {promoPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="max-w-sm rounded-xl bg-app-surface p-6 text-center shadow-lg">
            <h2 className="mb-2 text-lg font-semibold text-app-text">
              {promoPopup.title}
            </h2>

            <p className="mb-4 text-sm text-app-muted">
              {promoPopup.message}
            </p>

            <button
              onClick={() => setPromoPopup(null)}
              className="rounded bg-app-primary px-4 py-2 text-white hover:bg-app-primaryHover"
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}