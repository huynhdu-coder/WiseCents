import { Banknote } from "lucide-react";
import SectionCard from "./SectionCard";

export default function TransferPanel({
  transferAmount,
  setTransferAmount,
  loading,
  onTransfer,
}) {
  return (
    <SectionCard
      title="Transfer from Checking"
      right={<Banknote className="h-4 w-4 text-app-muted" />}
    >
      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-app-text">
            Amount
          </label>
          <input
            type="number"
            min="1"
            step="0.01"
            value={transferAmount}
            onChange={(e) => setTransferAmount(e.target.value)}
            placeholder="500"
            className="w-full rounded-xl border border-app-border bg-app-surface px-3 py-2.5 text-sm text-app-text outline-none placeholder:text-app-muted focus:border-app-primary"
          />
        </div>

        <button
          type="button"
          onClick={onTransfer}
          disabled={loading}
          className="w-full rounded-xl bg-app-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-app-primaryHover disabled:opacity-50"
        >
          {loading ? "Transferring..." : "Transfer Funds"}
        </button>
      </div>
    </SectionCard>
  );
}