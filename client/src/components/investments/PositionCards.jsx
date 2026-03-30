import { cn, formatCurrency, formatNumber, formatPercent } from "../../utils/investmentFormatters";

export default function PositionCards({ holdings, onSelect }) {
  if (!holdings.length) {
    return <p className="text-sm text-slate-500">No positions yet.</p>;
  }

  return (
    <div className="grid gap-3 md:grid-cols-2">
      {holdings.map((position) => {
        const isPositive = Number(position.gainLoss || 0) >= 0;

        return (
          <button
            type="button"
            key={position.symbol}
            onClick={() => onSelect(position.symbol)}
            className="rounded-2xl border border-slate-200 p-4 text-left transition hover:border-slate-300 hover:bg-slate-50"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-lg font-semibold text-slate-900">{position.symbol}</p>
                <p className="text-sm text-slate-500">{formatNumber(position.quantity, 6)} shares</p>
              </div>
              <div className={cn("text-sm font-medium", isPositive ? "text-emerald-600" : "text-rose-600")}>
                {formatPercent(position.percentGainLoss)}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-slate-500">Avg Cost</p>
                <p className="font-medium text-slate-900">{formatCurrency(position.avgCost)}</p>
              </div>
              <div>
                <p className="text-slate-500">Current Price</p>
                <p className="font-medium text-slate-900">{formatCurrency(position.currentPrice)}</p>
              </div>
              <div>
                <p className="text-slate-500">Market Value</p>
                <p className="font-medium text-slate-900">{formatCurrency(position.marketValue)}</p>
              </div>
              <div>
                <p className="text-slate-500">Gain/Loss</p>
                <p className={cn("font-medium", isPositive ? "text-emerald-600" : "text-rose-600")}>
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