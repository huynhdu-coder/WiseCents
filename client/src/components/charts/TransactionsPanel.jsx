export default function TransactionsPanel({
  transactions,
  page,
  setPage,
  totalPages,
}) {
  return (
    <div className="col-span-7 bg-white rounded shadow">
			<div className="px-4 py-3 border-b text-lg font-semibold mb-4">Transactions</div>

			<div className="divide-y max-h-[500px] overflow-y-auto">
        {Array.isArray(transactions) && transactions.length > 0 ? (
          transactions.map((tx) => (
            <div
              key={tx.transaction_id}
              className="flex justify-between items-center px-4 py-3"
            >
              <div>
                <p className="font-semibold">{tx.name}</p>
                <p className="text-sm text-gray-500">
                  {tx.account_name} • {tx.category || "Uncategorized"}
                </p>
              </div>

              <div className="text-right">
                <p
                  className={`font-bold ${
                    tx.amount < 0 ? "text-wisegreen" : "text-red-500"
                  }`}
                >
                  ${Math.abs(tx.amount).toFixed(2)}
                </p>

                <p className="text-sm text-gray-400">
                  {new Date(tx.date).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="p-4 text-gray-500">No transactions found.</p>
        )}
      </div>

      <div className="flex justify-center items-center gap-2 mt-4">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-40"
        >
          Prev
        </button>

        {[...Array(totalPages || 1)].map((_, i) => {
          const pageNum = i + 1;

          return (
            <button
              key={pageNum}
              onClick={() => setPage(pageNum)}
              className={`px-3 py-1 rounded border text-sm ${
                page === pageNum
                  ? "bg-wisegreen text-white border-wisegreen"
                  : "hover:bg-gray-100"
              }`}
            >
              {pageNum}
            </button>
          );
        })}

        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages || 1))}
          disabled={page === totalPages || totalPages === 0}
          className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}