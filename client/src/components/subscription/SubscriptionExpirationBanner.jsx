import { Link, useLocation } from "react-router-dom";

const TRIAL_DAYS = 10;

function safeParse(value, fallback = null) {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function getSubscriptionState() {
  const stored = safeParse(localStorage.getItem("subscriptionState"), null);

  if (stored?.currentPlan && stored?.trialStart) {
    return stored;
  }

  return {
    currentPlan: "FREE",
    trialStart: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

function isTrialExpired(trialStart) {
  const start = new Date(trialStart);
  const now = new Date();
  const msElapsed = now.getTime() - start.getTime();
  const daysElapsed = Math.floor(msElapsed / (1000 * 60 * 60 * 24));
  return daysElapsed >= TRIAL_DAYS;
}

export default function SubscriptionExpiryBanner() {
  const location = useLocation();
  const subscription = getSubscriptionState();

  const expired =
    subscription.currentPlan === "FREE" && isTrialExpired(subscription.trialStart);

  if (!expired || location.pathname === "/dashboard/subscription") {
    return null;
  }

  return (
    <div className="border-b border-yellow-500/20 bg-yellow-500/10 px-4 py-3">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
        <p className="text-yellow-100">
          Your free trial has expired. Go to the subscription page to choose a plan.
        </p>

        <Link
          to="/dashboard/subscription"
          className="inline-flex w-fit items-center justify-center rounded-xl bg-app-primary px-4 py-2 font-semibold text-white transition hover:bg-app-primaryHover"
        >
          View Plans
        </Link>
      </div>
    </div>
  );
}