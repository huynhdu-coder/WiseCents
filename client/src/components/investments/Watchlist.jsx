import {
  cn,
  formatCurrency,
  formatNumber,
  formatPercent,
} from "../../utils/investmentFormatters";

export default function Watchlist({ items, selectedSymbol, onSelect }) {
  if (!items.length) {
    return (
      <div className="rounded-xl2 border border-dashed border-app-borderSoft bg-app-soft px-4 py-8 text-center">
        <p className="text-sm text-app-muted">No symbols yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {items.map((item) => {
        const isActive = selectedSymbol === item.symbol;
        const isPositive = Number(item.percentGainLoss || 0) >= 0;

        return (
          <button
            key={item.symbol}
            type="button"
            onClick={() => onSelect(item.symbol)}
            className={cn(
              "flex w-full items-center justify-between rounded-xl2 border px-4 py-3 text-left transition",
              isActive
                ? "border-app-primary bg-app-primary text-white"
                : "border-app-border bg-app-surface hover:border-app-borderSoft hover:bg-app-soft"
            )}
          >
            <div className="min-w-0">
              <p className="font-semibold">{item.symbol}</p>
              <p
                className={cn(
                  "text-xs",
                  isActive ? "text-white/80" : "text-app-muted"
                )}
              >
                {item.quantity
                  ? `${formatNumber(item.quantity, 4)} shares`
                  : "Quick select"}
              </p>
            </div>

            <div className="min-w-0 text-right">
              <p className="font-medium">
                {item.currentPrice ? formatCurrency(item.currentPrice) : "--"}
              </p>
              <p
                className={cn(
                  "text-xs font-medium",
                  isActive
                    ? "text-white/80"
                    : isPositive
                    ? "text-app-success"
                    : "text-app-danger"
                )}
              >
                {formatPercent(item.percentGainLoss || 0)}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}