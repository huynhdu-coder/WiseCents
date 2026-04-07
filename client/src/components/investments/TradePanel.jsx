import { useState } from "react";
import { RefreshCcw } from "lucide-react";
import SectionCard from "./SectionCard";
import { cn, formatCurrency } from "../../utils/investmentFormatters";

export default function TradePanel({
  selectedSymbol,
  quote,
  cashBalance,
  dollarAmount,
  setDollarAmount,
  recurringAmount,
  setRecurringAmount,
  frequency,
  setFrequency,
  loading,
  onBuy,
  onSell,
  onCreateRecurring,
  onRefresh,
}) {
  const [tab, setTab] = useState("buy");

  return (
    <div className="space-y-4">
      <SectionCard
        title="Trade"
        right={
          <button
            type="button"
            onClick={onRefresh}
            className="inline-flex items-center gap-2 rounded-xl border border-app-border bg-app-surface px-3 py-2 text-sm font-medium text-app-text transition hover:bg-app-soft"
          >
            <RefreshCcw className="h-4 w-4" /> Refresh
          </button>
        }
      >
        {/* Tabs */}
        <div className="mb-4 grid grid-cols-3 gap-2 rounded-xl2 bg-app-soft p-1">
          {[
            { key: "buy", label: "Buy" },
            { key: "recurring", label: "Recurring" },
            { key: "sell", label: "Sell" },
          ].map((item) => {
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setTab(item.key)}
                className={cn(
                  "rounded-xl px-3 py-2 text-sm font-semibold transition",
                  tab === item.key
                    ? item.key === "buy"
                      ? "bg-app-success text-white"
                      : item.key === "sell"
                      ? "bg-app-danger text-white"
                      : "bg-app-primary text-white"
                    : "text-app-muted hover:bg-app-surface"
                )}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Stock Info */}
        <div className="mb-4 rounded-xl2 border border-app-border bg-app-soft p-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-app-muted">
                Selected
              </p>
              <h3 className="mt-1 text-xl font-bold text-app-text">
                {selectedSymbol || "—"}
              </h3>
            </div>

            <div className="text-right">
              <p className="text-xs text-app-muted">Current Price</p>
              <p className="mt-1 text-lg font-semibold text-app-text">
                {formatCurrency(quote?.currentPrice)}
              </p>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between text-sm">
            <span className="text-app-muted">Available Cash</span>
            <span className="font-medium text-app-text">
              {formatCurrency(cashBalance)}
            </span>
          </div>
        </div>

        {/* BUY */}
        {tab === "buy" && (
          <div className="space-y-4">
            <label>
              <span className="mb-1 block text-sm font-medium text-app-text">
                Dollar Amount
              </span>
              <input
                type="number"
                min="1"
                step="0.01"
                value={dollarAmount}
                onChange={(e) => setDollarAmount(e.target.value)}
                className="w-full rounded-xl border border-app-border bg-app-surface px-3 py-2.5 text-sm text-app-text outline-none focus:border-app-primary"
              />
            </label>

            <button
              type="button"
              disabled={loading}
              onClick={onBuy}
              className="w-full rounded-xl bg-app-success px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Buying..." : `Buy ${selectedSymbol}`}
            </button>
          </div>
        )}

        {/* SELL */}
        {tab === "sell" && (
          <div className="space-y-4">
            <label>
              <span className="mb-1 block text-sm font-medium text-app-text">
                Dollar Amount
              </span>
              <input
                type="number"
                min="1"
                step="0.01"
                value={dollarAmount}
                onChange={(e) => setDollarAmount(e.target.value)}
                className="w-full rounded-xl border border-app-border bg-app-surface px-3 py-2.5 text-sm text-app-text outline-none focus:border-app-primary"
              />
            </label>

            <button
              type="button"
              disabled={loading}
              onClick={onSell}
              className="w-full rounded-xl bg-app-danger px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Selling..." : `Sell ${selectedSymbol}`}
            </button>
          </div>
        )}

        {/* RECURRING */}
        {tab === "recurring" && (
          <div className="space-y-4">
            <label>
              <span className="mb-1 block text-sm font-medium text-app-text">
                Recurring Amount
              </span>
              <input
                type="number"
                min="1"
                step="0.01"
                value={recurringAmount}
                onChange={(e) => setRecurringAmount(e.target.value)}
                className="w-full rounded-xl border border-app-border bg-app-surface px-3 py-2.5 text-sm text-app-text outline-none focus:border-app-primary"
              />
            </label>

            <label>
              <span className="mb-1 block text-sm font-medium text-app-text">
                Frequency
              </span>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="w-full rounded-xl border border-app-border bg-app-surface px-3 py-2.5 text-sm text-app-text outline-none focus:border-app-primary"
              >
                <option value="DAILY">Daily</option>
                <option value="WEEKLY">Weekly</option>
                <option value="BIWEEKLY">Biweekly</option>
                <option value="MONTHLY">Monthly</option>
              </select>
            </label>

            <button
              type="button"
              disabled={loading}
              onClick={onCreateRecurring}
              className="w-full rounded-xl bg-app-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Create Recurring Buy"}
            </button>
          </div>
        )}
      </SectionCard>
    </div>
  );
}