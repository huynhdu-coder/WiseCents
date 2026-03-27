import { cn, formatCurrency, formatNumber, formatPercent } from "../../utils/investmentFormatters";

export default function HoldingsTable({ holdings, onSelect }) {
  if (!holdings.length) {
    return <p className="text-sm text-slate-500">No positions yet.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="border-b border-slate-100 text-left text-slate-500">
            <th className="pb-3 pr-4 font-medium">Symbol</th>
            <th className="pb-3 pr-4 font-medium">Shares</th>
            <th className="pb-3 pr-4 font-medium">Avg Cost</th>
            <th className="pb-3 pr-4 font-medium">Price</th>
            <th className="pb-3 pr-4 font-medium">Market Value</th>
            <th className="pb-3 pr-4 font-medium">Gain/Loss</th>
          </tr>
        </thead>
        <tbody>
          {holdings.map((holding) => {
            const gain = Number(holding.gainLoss || 0);

            return (
              <tr
                key={holding.symbol}
                className="cursor-pointer border-b border-slate-50 hover:bg-slate-50"
                onClick={() => onSelect(holding.symbol)}
              >
                <td className="py-4 pr-4 font-semibold text-slate-900">{holding.symbol}</td>
                <td className="py-4 pr-4 text-slate-700">{formatNumber(holding.quantity, 6)}</td>
                <td className="py-4 pr-4 text-slate-700">{formatCurrency(holding.avgCost)}</td>
                <td className="py-4 pr-4 text-slate-700">{formatCurrency(holding.currentPrice)}</td>
                <td className="py-4 pr-4 text-slate-700">{formatCurrency(holding.marketValue)}</td>
                <td className={cn("py-4 pr-4 font-medium", gain >= 0 ? "text-emerald-600" : "text-rose-600")}>
                  {formatCurrency(gain)} ({formatPercent(holding.percentGainLoss)})
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}