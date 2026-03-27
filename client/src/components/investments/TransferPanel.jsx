import { Banknote } from "lucide-react";
import SectionCard from "./SectionCard";

export default function TransferPanel({
  transferAmount,
  setTransferAmount,
  loading,
  onTransfer,
}) {
  return (
    <SectionCard title="Transfer from Checking" right={<Banknote className="h-4 w-4 text-slate-400" />}>
      <div className="space-y-4">
        <input
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
          type="number"
          min="1"
          step="0.01"
          value={transferAmount}
          onChange={(e) => setTransferAmount(e.target.value)}
          placeholder="500"
        />
        <button
          className="w-full rounded-2xl bg-blue-600 px-4 py-3 font-medium text-white hover:bg-blue-500 disabled:opacity-50"
          onClick={onTransfer}
          disabled={loading}
        >
          {loading ? "Transferring..." : "Transfer Funds"}
        </button>
      </div>
    </SectionCard>
  );
}