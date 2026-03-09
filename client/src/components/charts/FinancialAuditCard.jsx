import FinancialHealthGauge from "./FinancialHealthGauge";

export default function FinancialAuditCard({ audit }) {

  if (!audit) {
    return (
      <div className="col-span-3 bg-white rounded shadow p-4">
        <p className="text-gray-500">Loading audit...</p>
      </div>
    );
  }

  const getSavingsColor = (rate) => {
    if (rate >= 0.2) return "text-green-600";
    if (rate >= 0.1) return "text-yellow-500";
    return "text-red-500";
  };

  const getSpendingColor = (ratio) => {
    if (ratio <= 0.7) return "text-green-600";
    if (ratio <= 0.9) return "text-yellow-500";
    return "text-red-500";
  };

  const getHousingColor = (ratio) => {
    if (ratio <= 0.3) return "text-green-600";
    if (ratio <= 0.4) return "text-yellow-500";
    return "text-red-500";
  };

  const getEmergencyColor = (months) => {
    if (months >= 6) return "text-green-600";
    if (months >= 3) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <div className="col-span-3 bg-white rounded shadow p-4">

      <h2 className="text-lg font-semibold mb-4">
        Financial Audit
      </h2>

      <div className="space-y-3 text-sm">

        <div className="flex justify-between">
          <span>Savings Rate</span>
          <span className={getSavingsColor(audit.savingsRate)}>
            {(audit.savingsRate * 100).toFixed(0)}%
          </span>
        </div>

        <div className="flex justify-between">
          <span>Spending Ratio</span>
          <span className={getSpendingColor(audit.spendingRatio)}>
            {(audit.spendingRatio * 100).toFixed(0)}%
          </span>
        </div>

        <div className="flex justify-between">
          <span>Housing Cost</span>
          <span className={getHousingColor(audit.housingRatio)}>
            {(audit.housingRatio * 100).toFixed(0)}%
          </span>
        </div>

        <div className="flex justify-between">
          <span>Emergency Fund</span>
          <span className={getEmergencyColor(audit.emergencyFundMonths)}>
            {(audit.emergencyFundMonths ?? 0).toFixed(1)} months
          </span>
        </div>

        <div className="flex justify-between">
          <span>Monthly Cash Flow</span>
          <span className={(audit.monthlyCashFlow ?? 0) > 0 ? "text-green-600" : "text-red-500"}>
            ${(audit.monthlyCashFlow ?? 0).toFixed(0)}
          </span>
        </div>

        <div className="flex justify-between">
          <span>Top Spending</span>
          <span>{audit.topCategory ?? "N/A"}</span>
        </div>

        <div className="flex justify-between">
          <span>Subscriptions</span>
          <span>{audit.subscriptionCount ?? 0}</span>
        </div>

      </div>

      <div className="mt-6 text-center">
        <div className="mt-6">
          <FinancialHealthGauge score={audit.score ?? 0} />
        </div>
      </div>

    </div>
  );
}