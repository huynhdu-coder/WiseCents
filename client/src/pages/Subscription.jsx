import { useEffect, useMemo, useState } from "react";
import {
  HiOutlineCheckCircle,
  HiOutlineExclamationTriangle,
  HiOutlineInformationCircle,
  HiOutlineSparkles,
  HiOutlineXMark,
} from "react-icons/hi2";

const TRIAL_DAYS = 10;

const PLAN_CONFIG = {
  FREE: {
    key: "FREE",
    name: "Free Trial",
    priceLabel: "$0",
    subtitle: `Access for ${TRIAL_DAYS} days`,
    badge: "Starter",
    features: [
      "Budget dashboard access",
      "Basic account overview",
      "Limited AI guidance",
      "Intro access to WiseCents features",
    ],
  },
  FULL: {
    key: "FULL",
    name: "Full Version",
    priceLabel: "$4.99 / month",
    subtitle: "Full premium access",
    badge: "Premium",
    features: [
      "Unlimited AI insights",
      "Full budgeting and reporting tools",
      "Advanced financial tracking",
      "Access to all premium WiseCents features",
    ],
  },
  STUDENT: {
    key: "STUDENT",
    name: "Student Version",
    priceLabel: "$0.50 / month",
    subtitle: "Student discounted premium plan",
    badge: "Student",
    features: [
      "All Full Version features",
      "Student-only discount pricing",
      "Premium AI and reporting access",
      "Built for college budgeting",
    ],
  },
};

function safeParse(value, fallback = null) {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function getStoredUser() {
  const raw = localStorage.getItem("user");
  const parsed = safeParse(raw, {});
  return parsed || {};
}

function getUserEmail(user) {
  if (!user) return "";
  return user.email || user?.user?.email || "";
}

function getSubscriptionState() {
  const stored = safeParse(localStorage.getItem("subscriptionState"), null);

  if (stored?.currentPlan && stored?.trialStart) {
    return stored;
  }

  const defaultState = {
    currentPlan: "FREE",
    trialStart: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  localStorage.setItem("subscriptionState", JSON.stringify(defaultState));
  return defaultState;
}

function saveSubscriptionState(nextState) {
  localStorage.setItem("subscriptionState", JSON.stringify(nextState));
}

function getTrialInfo(trialStart) {
  const start = new Date(trialStart);
  const now = new Date();
  const msElapsed = now.getTime() - start.getTime();
  const daysElapsed = Math.floor(msElapsed / (1000 * 60 * 60 * 24));
  const daysRemaining = Math.max(TRIAL_DAYS - daysElapsed, 0);
  const expired = daysElapsed >= TRIAL_DAYS;

  return {
    daysElapsed,
    daysRemaining,
    expired,
  };
}

function PaymentModal({ open, selectedPlan, onClose, onConfirm }) {
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!open) {
      setCardName("");
      setCardNumber("");
      setExpiry("");
      setCvc("");
      setProcessing(false);
    }
  }, [open]);

  if (!open || !selectedPlan) return null;

  const plan = PLAN_CONFIG[selectedPlan];

  const handlePayNow = () => {
    setProcessing(true);

    setTimeout(() => {
      setProcessing(false);
      onConfirm();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-lg rounded-3xl border border-app-border bg-app-surface shadow-2xl">
        <div className="flex items-center justify-between border-b border-app-border px-6 py-5">
          <div>
            <h2 className="text-xl font-bold text-app-text">Payment Details</h2>
            <p className="mt-1 text-sm text-app-muted">
              Activate <span className="font-semibold text-app-text">{plan.name}</span> for{" "}
              <span className="font-semibold text-app-primary">{plan.priceLabel}</span>
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl border border-app-border bg-app-soft p-2 text-app-muted transition hover:text-app-text"
          >
            <HiOutlineXMark className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 px-6 py-6">
          <div className="rounded-3xl bg-gradient-to-r from-app-primary to-emerald-500 px-5 py-5 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold opacity-90">WiseCents Secure Checkout</span>
              <HiOutlineCheckCircle className="h-5 w-5" />
            </div>

            <div className="mt-6 text-lg font-semibold tracking-[0.2em]">
              •••• •••• •••• 4242
            </div>

            <div className="mt-4 flex items-end justify-between">
              <div>
                <p className="text-xs uppercase opacity-80">Plan</p>
                <p className="text-sm font-semibold">{plan.name}</p>
              </div>
              <div className="text-right">
                <p className="text-xs uppercase opacity-80">Price</p>
                <p className="text-sm font-semibold">{plan.priceLabel}</p>
              </div>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-app-text">
              Name on card
            </label>
            <input
              type="text"
              autoComplete="cc-name"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              placeholder="John Doe"
              className="w-full rounded-2xl border border-app-border bg-app-bg px-4 py-3 text-sm text-app-text outline-none transition placeholder:text-app-muted focus:border-app-primary"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-app-text">
              Card number
            </label>
            <input
              type="text"
              autoComplete="cc-number"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              placeholder="1234 5678 9012 3456"
              className="w-full rounded-2xl border border-app-border bg-app-bg px-4 py-3 text-sm text-app-text outline-none transition placeholder:text-app-muted focus:border-app-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-app-text">
                Expiration
              </label>
              <input
                type="text"
                autoComplete="cc-exp"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                placeholder="MM/YY"
                className="w-full rounded-2xl border border-app-border bg-app-bg px-4 py-3 text-sm text-app-text outline-none transition placeholder:text-app-muted focus:border-app-primary"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-app-text">
                CVC
              </label>
              <input
                type="text"
                autoComplete="cc-csc"
                value={cvc}
                onChange={(e) => setCvc(e.target.value)}
                placeholder="123"
                className="w-full rounded-2xl border border-app-border bg-app-bg px-4 py-3 text-sm text-app-text outline-none transition placeholder:text-app-muted focus:border-app-primary"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-app-border bg-app-soft px-4 py-3 text-sm text-app-muted">
            This is a demo flow for now. Clicking <span className="font-semibold text-app-text">Pay Now</span> will activate the plan after a quick verification message.
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-app-border px-6 py-5">
          <button
            onClick={onClose}
            className="rounded-2xl border border-app-border bg-app-soft px-5 py-3 text-sm font-semibold text-app-text transition hover:bg-app-bg"
          >
            Cancel
          </button>

          <button
            onClick={handlePayNow}
            disabled={processing}
            className="rounded-2xl bg-app-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-app-primaryHover disabled:cursor-not-allowed disabled:opacity-70"
          >
            {processing ? "Verifying..." : "Pay Now"}
          </button>
        </div>
      </div>
    </div>
  );
}

function MessageModal({
  open,
  title,
  message,
  tone = "info",
  confirmText = "Okay",
  onClose,
}) {
  if (!open) return null;

  const toneClasses =
    tone === "success"
      ? "border-green-500/20 bg-green-500/10 text-green-200"
      : tone === "warning"
      ? "border-yellow-500/20 bg-yellow-500/10 text-yellow-200"
      : "border-app-border bg-app-soft text-app-text";

  const Icon =
    tone === "warning"
      ? HiOutlineExclamationTriangle
      : HiOutlineInformationCircle;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-md rounded-3xl border border-app-border bg-app-surface shadow-2xl">
        <div className="flex items-center justify-between border-b border-app-border px-6 py-5">
          <div className="flex items-center gap-3">
            <div className={`rounded-2xl border p-2 ${toneClasses}`}>
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-app-text">{title}</h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl border border-app-border bg-app-soft p-2 text-app-muted transition hover:text-app-text"
          >
            <HiOutlineXMark className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 py-6">
          <p className="text-sm leading-6 text-app-muted">{message}</p>
        </div>

        <div className="flex justify-end border-t border-app-border px-6 py-5">
          <button
            onClick={onClose}
            className="rounded-2xl bg-app-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-app-primaryHover"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

function ConfirmModal({
  open,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Keep Plan",
  onConfirm,
  onClose,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-md rounded-3xl border border-app-border bg-app-surface shadow-2xl">
        <div className="flex items-center justify-between border-b border-app-border px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/10 p-2 text-yellow-200">
              <HiOutlineExclamationTriangle className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-app-text">{title}</h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl border border-app-border bg-app-soft p-2 text-app-muted transition hover:text-app-text"
          >
            <HiOutlineXMark className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 py-6">
          <p className="text-sm leading-6 text-app-muted">{message}</p>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-app-border px-6 py-5">
          <button
            onClick={onClose}
            className="rounded-2xl border border-app-border bg-app-soft px-5 py-3 text-sm font-semibold text-app-text transition hover:bg-app-bg"
          >
            {cancelText}
          </button>

          <button
            onClick={onConfirm}
            className="rounded-2xl border border-red-400/25 bg-red-500/10 px-5 py-3 text-sm font-semibold text-red-300 transition hover:bg-red-500/15"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

function PlanCard({
  planKey,
  currentPlan,
  onPurchase,
  onCancel,
  trialExpired,
}) {
  const plan = PLAN_CONFIG[planKey];
  const isCurrent = currentPlan === planKey;

  return (
    <div className="grid grid-cols-1 gap-5 rounded-3xl border border-app-border bg-app-surface p-6 lg:grid-cols-[1fr_auto]">
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <h3 className="text-xl font-bold text-app-text">{plan.name}</h3>
          <span className="rounded-full border border-app-border bg-app-soft px-3 py-1 text-xs font-semibold uppercase tracking-wide text-app-muted">
            {plan.badge}
          </span>
        </div>

        <div className="mt-3 flex flex-wrap items-end gap-3">
          <span className="text-2xl font-bold text-app-primary">{plan.priceLabel}</span>
          <span className="text-sm text-app-muted">{plan.subtitle}</span>
        </div>

        <ul className="mt-5 space-y-3">
          {plan.features.map((feature) => (
            <li key={feature} className="flex items-start gap-3 text-sm text-app-text">
              <HiOutlineCheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-app-primary" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex min-w-[220px] flex-col justify-center gap-3">
        {isCurrent ? (
          <button
            disabled
            className="rounded-2xl border border-app-border bg-app-soft px-5 py-3 text-sm font-semibold text-app-text"
          >
            Current Plan
          </button>
        ) : planKey === "FREE" ? (
          <button
            onClick={onCancel}
            className="rounded-2xl border border-red-400/25 bg-red-500/10 px-5 py-3 text-sm font-semibold text-red-300 transition hover:bg-red-500/15"
          >
            Downgrade / Cancel
          </button>
        ) : (
          <button
            onClick={() => onPurchase(planKey)}
            className="rounded-2xl bg-app-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-app-primaryHover"
          >
            {planKey === "FULL" ? "Purchase Full Version" : "Purchase Student Version"}
          </button>
        )}

        {planKey === "FREE" && trialExpired && (
          <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-200">
            Your free trial has expired.
          </div>
        )}
      </div>
    </div>
  );
}

export default function Subscription() {
  const [subscription, setSubscription] = useState(() => getSubscriptionState());
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState("info");
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [messageModal, setMessageModal] = useState({
    open: false,
    title: "",
    message: "",
    tone: "info",
  });

  const user = useMemo(() => getStoredUser(), []);
  const userEmail = getUserEmail(user);

  const trialInfo = useMemo(
    () => getTrialInfo(subscription.trialStart),
    [subscription.trialStart]
  );

  useEffect(() => {
    localStorage.setItem(
      "subscriptionExpired",
      String(subscription.currentPlan === "FREE" && trialInfo.expired)
    );
  }, [subscription.currentPlan, trialInfo.expired]);

  const setTempStatus = (message, type = "info") => {
    setStatusMessage(message);
    setStatusType(type);
  };

  const updatePlan = (planKey) => {
    const nextState = {
      ...subscription,
      currentPlan: planKey,
      updatedAt: new Date().toISOString(),
    };

    saveSubscriptionState(nextState);
    setSubscription(nextState);
  };

  const handlePurchaseClick = (planKey) => {
    if (planKey === "STUDENT") {
      const isEdu = userEmail.toLowerCase().endsWith(".edu");

      if (!isEdu) {
        setTempStatus(
          "Student verification failed. Please use a verified .edu email.",
          "warning"
        );

        setMessageModal({
          open: true,
          title: "Student Verification Failed",
          message:
            "You are not verified for the Student Version. A valid .edu email is required before this plan can be activated.",
          tone: "warning",
        });
        return;
      }

      setSelectedPlan(planKey);
      setMessageModal({
        open: true,
        title: "Student Verified",
        message:
          "Your .edu email has been verified. Click Okay to continue to payment for the Student Version.",
        tone: "success",
      });
      return;
    }

    if (planKey === "FULL") {
      setSelectedPlan(planKey);
      setShowPaymentModal(true);
    }
  };

  const handlePaymentConfirm = () => {
    if (!selectedPlan) return;

    updatePlan(selectedPlan);
    setShowPaymentModal(false);

    if (selectedPlan === "FULL") {
      setTempStatus("Full Version activated successfully.", "success");
    } else if (selectedPlan === "STUDENT") {
      setTempStatus("Student Version activated successfully.", "success");
    }

    setSelectedPlan(null);
  };

  const handleCancelToFree = () => {
    setShowCancelConfirm(true);
  };

  const confirmCancelToFree = () => {
    updatePlan("FREE");
    setShowCancelConfirm(false);
    setTempStatus("Your subscription was downgraded to Free Trial.", "warning");
  };

  const currentPlan = PLAN_CONFIG[subscription.currentPlan];
  const currentPrice =
    subscription.currentPlan === "FREE" && trialInfo.expired
      ? "Expired"
      : currentPlan.priceLabel;

  const statusClasses =
    statusType === "success"
      ? "border-green-500/20 bg-green-500/10 text-green-200"
      : statusType === "warning"
      ? "border-yellow-500/20 bg-yellow-500/10 text-yellow-200"
      : "border-app-border bg-app-soft text-app-text";

  return (
    <>
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="border-b border-app-border pb-5">
          <h1 className="text-3xl font-bold text-app-text">Subscription Plans</h1>
          <p className="mt-2 text-sm text-app-muted">
            Manage your plan, compare tiers, and choose the best WiseCents option for you.
          </p>
        </div>

        <div className="mt-8 rounded-3xl border border-app-border bg-app-surface p-6">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div>
              <div className="flex items-center gap-2 text-app-primary">
                <HiOutlineSparkles className="h-5 w-5" />
                <span className="text-sm font-semibold uppercase tracking-wide">
                  Your current plan
                </span>
              </div>

              <h2 className="mt-3 text-2xl font-bold text-app-text">
                {currentPlan.name}
              </h2>

              <p className="mt-2 text-sm text-app-muted">
                Current price:{" "}
                <span className="font-semibold text-app-primary">{currentPrice}</span>
              </p>

              <p className="mt-2 text-sm text-app-muted">
                {subscription.currentPlan === "FREE"
                  ? "Upgrade today to unlock full access to WiseCents!"
                  : "Enjoying full access to all of WiseCents features."}
              </p>

              {subscription.currentPlan === "FREE" && !trialInfo.expired && (
                <p className="mt-2 text-sm text-app-muted">
                  Days remaining in free trial:{" "}
                  <span className="font-semibold text-app-text">{trialInfo.daysRemaining}</span>
                </p>
              )}

              {userEmail && (
                <p className="mt-2 text-sm text-app-muted">
                  Signed in as: <span className="font-medium text-app-text">{userEmail}</span>
                </p>
              )}
            </div>

            <div className="min-w-[220px] rounded-2xl border border-app-border bg-app-soft px-4 py-4 text-sm text-app-muted">
              {subscription.currentPlan === "FREE" && trialInfo.expired
                ? "Your free trial has expired. Choose a paid plan to continue premium access."
                : "Switch plans anytime. Student pricing requires a verified .edu email."}
            </div>
          </div>

          {statusMessage && (
            <div className={`mt-5 rounded-2xl border px-4 py-3 text-sm ${statusClasses}`}>
              {statusMessage}
            </div>
          )}
        </div>

        <div className="mt-8 space-y-5">
          <PlanCard
            planKey="FREE"
            currentPlan={subscription.currentPlan}
            onPurchase={handlePurchaseClick}
            onCancel={handleCancelToFree}
            trialExpired={trialInfo.expired}
          />

          <PlanCard
            planKey="FULL"
            currentPlan={subscription.currentPlan}
            onPurchase={handlePurchaseClick}
            onCancel={handleCancelToFree}
            trialExpired={trialInfo.expired}
          />

          <PlanCard
            planKey="STUDENT"
            currentPlan={subscription.currentPlan}
            onPurchase={handlePurchaseClick}
            onCancel={handleCancelToFree}
            trialExpired={trialInfo.expired}
          />
        </div>
      </div>

      <PaymentModal
        open={showPaymentModal}
        selectedPlan={selectedPlan}
        onClose={() => {
          setShowPaymentModal(false);
          setSelectedPlan(null);
        }}
        onConfirm={handlePaymentConfirm}
      />

      <MessageModal
        open={messageModal.open}
        title={messageModal.title}
        message={messageModal.message}
        tone={messageModal.tone}
        onClose={() => {
          const shouldOpenStudentPayment =
            messageModal.title === "Student Verified" && selectedPlan === "STUDENT";

          setMessageModal({
            open: false,
            title: "",
            message: "",
            tone: "info",
          });

          if (shouldOpenStudentPayment) {
            setShowPaymentModal(true);
          }
        }}
      />

      <ConfirmModal
        open={showCancelConfirm}
        title="Confirm Downgrade"
        message="Are you sure you want to cancel your current subscription and downgrade to the Free Trial? You will lose full premium access and return to the free version."
        confirmText="Yes, Downgrade"
        cancelText="Keep Current Plan"
        onConfirm={confirmCancelToFree}
        onClose={() => setShowCancelConfirm(false)}
      />
    </>
  );
}