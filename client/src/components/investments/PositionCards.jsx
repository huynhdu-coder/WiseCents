import {
  cn,
  formatCurrency,
  formatNumber,
  formatPercent,
} from "../../utils/investmentFormatters";

export default function PositionCards({ holdings, onSelect }) {
  if (!holdings.length) {
    return (
      <div className="rounded-xl2 border border-dashed border-app-borderSoft bg-app-soft px-4 py-8 text-center">
        <p className="text-sm text-app-muted">No positions yet.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {holdings.map((position) => {
        const isPositive = Number(position.gainLoss || 0) >= 0;

        return (
          <button
            type="button"
            key={position.symbol}
            onClick={() => onSelect(position.symbol)}
            className="rounded-xl2 border border-app-border bg-app-surface p-3.5 text-left transition hover:bg-app-soft hover:border-app-borderSoft sm:p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-base font-semibold text-app-text sm:text-lg">
                  {position.symbol}
                </p>
                <p className="text-sm text-app-muted">
                  {formatNumber(position.quantity, 6)} shares
                </p>
              </div>

              <div
                className={cn(
                  "shrink-0 text-sm font-semibold",
                  isPositive ? "text-app-success" : "text-app-danger"
                )}
              >
                {formatPercent(position.percentGainLoss)}
              </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-app-muted">Avg Cost</p>
                <p className="font-medium text-app-text">
                  {formatCurrency(position.avgCost)}
                </p>
              </div>

              <div>
                <p className="text-app-muted">Current Price</p>
                <p className="font-medium text-app-text">
                  {formatCurrency(position.currentPrice)}
                </p>
              </div>

              <div>
                <p className="text-app-muted">Market Value</p>
                <p className="font-medium text-app-text">
                  {formatCurrency(position.marketValue)}
                </p>
              </div>

              <div>
                <p className="text-app-muted">Gain/Loss</p>
                <p
                  className={cn(
                    "font-medium",
                    isPositive ? "text-app-success" : "text-app-danger"
                  )}
                >
                  {formatCurrency(position.gainLoss)}
                </p>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}