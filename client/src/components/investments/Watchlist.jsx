import { cn, formatCurrency, formatNumber, formatPercent } from "../../utils/investmentFormatters";

export default function Watchlist({ items, selectedSymbol, onSelect }) {
  if (!items.length) {
    return <p className="text-sm text-slate-500">No symbols yet.</p>;
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
              "flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left transition",
              isActive
                ? "border-slate-900 bg-slate-900 text-white"
                : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
            )}
          >
            <div>
              <p className="font-semibold">{item.symbol}</p>
              <p className={cn("text-xs", isActive ? "text-slate-300" : "text-slate-500")}>
                {item.quantity ? `${formatNumber(item.quantity, 4)} shares` : "Quick select"}
              </p>
            </div>

            <div className="text-right">
              <p className="font-medium">{item.currentPrice ? formatCurrency(item.currentPrice) : "--"}</p>
              <p
                className={cn(
                  "text-xs font-medium",
                  isActive ? "text-slate-200" : isPositive ? "text-emerald-600" : "text-rose-600"
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