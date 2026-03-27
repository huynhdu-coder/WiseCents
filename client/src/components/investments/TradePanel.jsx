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
    <div className="space-y-5">
      <SectionCard
        title="Trade"
        right={
          <button
            type="button"
            onClick={onRefresh}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
          >
            <RefreshCcw className="h-4 w-4" /> Refresh
          </button>
        }
      >
        <div className="mb-4 grid grid-cols-3 gap-2 rounded-2xl bg-slate-100 p-1">
          {[
            { key: "buy", label: "Buy" },
            { key: "recurring", label: "Recurring" },
            { key: "sell", label: "Sell" },
          ].map((item) => {
            const activeStyles =
              item.key === "buy"
                ? "bg-emerald-600 text-white shadow-sm"
                : item.key === "sell"
                ? "bg-rose-600 text-white shadow-sm"
                : "bg-slate-900 text-white shadow-sm";

            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setTab(item.key)}
                className={cn(
                  "rounded-2xl px-3 py-2 text-sm font-medium transition",
                  tab === item.key
                    ? activeStyles
                    : "text-slate-500 hover:bg-white hover:text-slate-900"
                )}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        <div className="mb-5 rounded-2xl bg-slate-950 p-4 text-white">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400">Selected</p>
              <h3 className="mt-1 text-2xl font-semibold">{selectedSymbol}</h3>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-400">Current Price</p>
              <p className="mt-1 text-xl font-semibold">{formatCurrency(quote?.currentPrice)}</p>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-slate-400">Available Cash</span>
            <span className="font-medium">{formatCurrency(cashBalance)}</span>
          </div>
        </div>

        {tab === "buy" ? (
          <div className="space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Dollar Amount</span>
              <input
                type="number"
                min="1"
                step="0.01"
                value={dollarAmount}
                onChange={(e) => setDollarAmount(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
              />
            </label>

            <button
              type="button"
              disabled={loading}
              onClick={onBuy}
              className="w-full rounded-2xl bg-emerald-600 px-4 py-3 font-medium text-white hover:bg-emerald-500 disabled:opacity-50"
            >
              {loading ? "Buying..." : `Buy ${selectedSymbol}`}
            </button>
          </div>
        ) : tab === "sell" ? (
          <div className="space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Dollar Amount</span>
              <input
                type="number"
                min="1"
                step="0.01"
                value={dollarAmount}
                onChange={(e) => setDollarAmount(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
              />
            </label>

            <button
              type="button"
              disabled={loading}
              onClick={onSell}
              className="w-full rounded-2xl bg-rose-600 px-4 py-3 font-medium text-white hover:bg-rose-500 disabled:opacity-50"
            >
              {loading ? "Selling..." : `Sell ${selectedSymbol}`}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Recurring Amount</span>
              <input
                type="number"
                min="1"
                step="0.01"
                value={recurringAmount}
                onChange={(e) => setRecurringAmount(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Frequency</span>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
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
              className="w-full rounded-2xl bg-slate-900 px-4 py-3 font-medium text-white hover:bg-slate-800 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Create Recurring Buy"}
            </button>
          </div>
        )}
      </SectionCard>
    </div>
  );
}