import FinancialHealthGauge from "./FinancialHealthGauge";

export default function FinancialAuditCard({ audit }) {
  if (!audit) {
    return (
      <div className="col-span-3 rounded-[24px] border border-app-border bg-app-surface p-5 shadow-card">
        <p className="text-sm text-app-muted">Loading audit...</p>
      </div>
    );
  }

  const getSavingsColor = (rate) => {
    if (rate >= 0.2) return "text-green-500";
    if (rate >= 0.1) return "text-yellow-500";
    return "text-red-500";
  };

  const getSpendingColor = (ratio) => {
    if (ratio <= 0.7) return "text-green-500";
    if (ratio <= 0.9) return "text-yellow-500";
    return "text-red-500";
  };

  const getHousingColor = (ratio) => {
    if (ratio <= 0.3) return "text-green-500";
    if (ratio <= 0.4) return "text-yellow-500";
    return "text-red-500";
  };

  const getEmergencyColor = (months) => {
    if (months >= 6) return "text-green-500";
    if (months >= 3) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <div className="col-span-3 flex flex-col rounded-[24px] border border-app-border bg-app-surface p-5 shadow-card">

      {/* Header */}
      <div className="mb-4">
        <h2 className="text-xl font-bold text-app-text sm:text-2xl">
          Financial Audit
        </h2>
        <p className="text-sm text-app-muted">
          Your financial health overview
        </p>
      </div>

      {/* Metrics */}
      <div className="space-y-3 text-sm">

        <div className="flex items-center justify-between">
          <span className="text-app-muted">Savings Rate</span>
          <span className={`font-semibold ${getSavingsColor(audit.savingsRate)}`}>
            {(audit.savingsRate * 100).toFixed(0)}%
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-app-muted">Spending Ratio</span>
          <span className={`font-semibold ${getSpendingColor(audit.spendingRatio)}`}>
            {(audit.spendingRatio * 100).toFixed(0)}%
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-app-muted">Housing Cost</span>
          <span className={`font-semibold ${getHousingColor(audit.housingRatio)}`}>
            {(audit.housingRatio * 100).toFixed(0)}%
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-app-muted">Emergency Fund</span>
          <span className={`font-semibold ${getEmergencyColor(audit.emergencyFundMonths)}`}>
            {(audit.emergencyFundMonths ?? 0).toFixed(1)} mo
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-app-muted">Cash Flow</span>
          <span
            className={`font-semibold ${
              (audit.monthlyCashFlow ?? 0) > 0
                ? "text-app-primary"
                : "text-red-500"
            }`}
          >
            ${(audit.monthlyCashFlow ?? 0).toFixed(0)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-app-muted">Top Spending</span>
          <span className="font-semibold text-app-text">
            {audit.topCategory ?? "N/A"}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-app-muted">Subscriptions</span>
          <span className="font-semibold text-app-text">
            {audit.subscriptionCount ?? 0}
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="my-5 border-t border-app-border" />

      {/* Score */}
      <div className="flex flex-col items-center justify-center">
        <p className="text-sm text-app-muted mb-2">
          Overall Score
        </p>

        <FinancialHealthGauge score={audit.score ?? 0} />
      </div>

    </div>
  );
}