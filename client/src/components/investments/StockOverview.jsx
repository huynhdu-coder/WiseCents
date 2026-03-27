import { formatCurrency, formatPercent, cn } from "../../utils/investmentFormatters";
import TradingViewChart from "./TradingViewChart";

function MiniMetric({ label, value }) {
  return (
    <div className="rounded-2xl bg-slate-900 px-4 py-3">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="mt-2 text-sm font-medium text-white">{value}</p>
    </div>
  );
}

function toTradingViewSymbol(symbol) {
  return `NASDAQ:${symbol}`;
}

export default function StockOverview({ symbol, quote }) {
  const price = Number(quote?.currentPrice || 0);
  const change = Number(quote?.change || 0);
  const percentChange = Number(quote?.percentChange || 0);
  const isPositive = percentChange >= 0;

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-950 p-6 text-white shadow-sm">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Selected Stock</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">{symbol}</h1>
          <div className="mt-4 flex items-end gap-3">
            <span className="text-4xl font-bold">{formatCurrency(price)}</span>
            <span className={cn("pb-1 text-sm font-medium", isPositive ? "text-emerald-400" : "text-rose-400")}>
              {formatCurrency(change)} · {formatPercent(percentChange)}
            </span>
          </div>
          <p className="mt-2 text-sm text-slate-400">
            Prev Close {formatCurrency(quote?.previousClose)}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <MiniMetric label="Current" value={formatCurrency(quote?.currentPrice)} />
          <MiniMetric label="Change" value={formatCurrency(quote?.change)} />
          <MiniMetric label="% Change" value={formatPercent(quote?.percentChange)} />
        </div>
      </div>

      <div className="mt-6 rounded-3xl border border-slate-800 bg-slate-900/70 p-4">
        <TradingViewChart symbol={toTradingViewSymbol(symbol)} />
      </div>
    </div>
  );
}