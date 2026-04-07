import { formatCurrency, formatPercent, cn } from "../../utils/investmentFormatters";
import TradingViewChart from "./TradingViewChart";

function MiniMetric({ label, value, valueClassName = "" }) {
  return (
    <div className="rounded-xl2 border border-app-border bg-app-surface p-3">
      <p className="text-xs font-medium uppercase tracking-wide text-app-muted">
        {label}
      </p>
      <p className={cn("mt-1 text-sm font-semibold text-app-text", valueClassName)}>
        {value}
      </p>
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
    <section className="rounded-xl2 border border-app-border bg-app-surface p-4 shadow-card sm:p-5">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-app-muted">
            Selected Stock
          </p>

          <h1 className="mt-2 truncate text-2xl font-bold tracking-tight text-app-text sm:text-3xl">
            {symbol}
          </h1>

          <div className="mt-3 flex flex-wrap items-end gap-x-3 gap-y-1">
            <span className="text-3xl font-bold leading-tight text-app-text sm:text-4xl">
              {formatCurrency(price)}
            </span>

            <span
              className={cn(
                "text-sm font-semibold",
                isPositive ? "text-app-success" : "text-app-danger"
              )}
            >
              {formatCurrency(change)} · {formatPercent(percentChange)}
            </span>
          </div>

          <p className="mt-2 text-sm text-app-muted">
            Prev Close {formatCurrency(quote?.previousClose)}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:w-[360px]">
          <MiniMetric
            label="Current"
            value={formatCurrency(quote?.currentPrice)}
          />
          <MiniMetric
            label="Change"
            value={formatCurrency(quote?.change)}
            valueClassName={isPositive ? "text-app-success" : "text-app-danger"}
          />
          <MiniMetric
            label="% Change"
            value={formatPercent(quote?.percentChange)}
            valueClassName={isPositive ? "text-app-success" : "text-app-danger"}
          />
        </div>
      </div>

      <div className="mt-5 rounded-xl2 border border-app-border bg-app-soft p-3 sm:p-4">
        <TradingViewChart symbol={toTradingViewSymbol(symbol)} />
      </div>
    </section>
  );
}