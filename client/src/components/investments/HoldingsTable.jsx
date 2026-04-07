import {
  cn,
  formatCurrency,
  formatNumber,
  formatPercent,
} from "../../utils/investmentFormatters";

export default function HoldingsTable({ holdings, onSelect }) {
  if (!holdings.length) {
    return (
      <div className="rounded-xl2 border border-dashed border-app-borderSoft bg-app-soft px-4 py-8 text-center">
        <p className="text-sm text-app-muted">No positions yet.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl2 border border-app-border">
      <table className="min-w-full text-sm">
        <thead className="bg-app-soft">
          <tr className="text-left">
            <th className="px-4 py-3 font-semibold text-app-muted">Symbol</th>
            <th className="px-4 py-3 font-semibold text-app-muted">Shares</th>
            <th className="px-4 py-3 font-semibold text-app-muted">Avg Cost</th>
            <th className="px-4 py-3 font-semibold text-app-muted">Price</th>
            <th className="px-4 py-3 font-semibold text-app-muted">Market Value</th>
            <th className="px-4 py-3 font-semibold text-app-muted">Gain/Loss</th>
          </tr>
        </thead>

        <tbody className="bg-app-surface">
          {holdings.map((holding) => {
            const gain = Number(holding.gainLoss || 0);

            return (
              <tr
                key={holding.symbol}
                className="cursor-pointer border-t border-app-border transition hover:bg-app-soft"
                onClick={() => onSelect(holding.symbol)}
              >
                <td className="whitespace-nowrap px-4 py-3 font-semibold text-app-text">
                  {holding.symbol}
                </td>

                <td className="whitespace-nowrap px-4 py-3 text-app-text">
                  {formatNumber(holding.quantity, 6)}
                </td>

                <td className="whitespace-nowrap px-4 py-3 text-app-text">
                  {formatCurrency(holding.avgCost)}
                </td>

                <td className="whitespace-nowrap px-4 py-3 text-app-text">
                  {formatCurrency(holding.currentPrice)}
                </td>

                <td className="whitespace-nowrap px-4 py-3 text-app-text">
                  {formatCurrency(holding.marketValue)}
                </td>

                <td
                  className={cn(
                    "whitespace-nowrap px-4 py-3 font-medium",
                    gain >= 0 ? "text-app-success" : "text-app-danger"
                  )}
                >
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