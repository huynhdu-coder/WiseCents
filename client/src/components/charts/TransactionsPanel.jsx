function buildPagination(currentPage, totalPages) {
  const pages = [];

  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
    return pages;
  }

  pages.push(1);

  if (currentPage > 3) pages.push("...");

  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);

  for (let i = start; i <= end; i++) pages.push(i);

  if (currentPage < totalPages - 2) pages.push("...");

  pages.push(totalPages);

  return pages;
}

export default function TransactionsPanel({
  transactions,
  page,
  setPage,
  totalPages,
}) {
  const safeTotalPages = Math.max(totalPages || 1, 1);
  const pagination = buildPagination(page, safeTotalPages);

  return (
    <div className="col-span-7 flex h-[580px] flex-col rounded-[24px] border border-app-border bg-app-surface shadow-card">
      
      {/* HEADER */}
      <div className="border-b border-app-border px-5 py-4">
        <h2 className="text-xl font-bold text-app-text sm:text-2xl">Transactions</h2>
        <p className="text-sm text-app-muted">
          Recent transaction activity
        </p>
      </div>

      {/* SCROLLABLE LIST */}
      <div className="flex-1 overflow-y-auto">
        {transactions?.length > 0 ? (
          <div className="divide-y divide-app-border">
            {transactions.map((tx) => {
              const amount = Number(tx.amount || 0);
              const isIncome = amount < 0;

              return (
                <div
                  key={tx.transaction_id}
                  className="flex items-center justify-between px-5 py-4"
                >
                  <div className="min-w-0">
                    <p className="truncate text-base font-semibold text-app-text">
                      {tx.name}
                    </p>
                    <p className="mt-1 text-sm text-app-muted">
                      {tx.account_name} • {tx.category || "Uncategorized"}
                    </p>
                  </div>

                  <div className="text-right">
                    <p
                      className={`text-base font-bold ${
                        isIncome ? "text-app-primary" : "text-red-500"
                      }`}
                    >
                      ${Math.abs(amount).toFixed(2)}
                    </p>
                    <p className="mt-1 text-sm text-app-muted">
                      {new Date(tx.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="px-5 py-6 text-sm text-app-muted">
            No transactions found.
          </div>
        )}
      </div>

      {/* FIXED PAGINATION */}
      <div className="border-t border-app-border px-4 py-3">
        <div className="flex items-center justify-center gap-2 flex-wrap">
          
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="px-3 py-2 text-sm rounded-lg border border-app-border bg-app-surface hover:bg-app-soft disabled:opacity-40"
          >
            Prev
          </button>

          {pagination.map((item, i) =>
            item === "..." ? (
              <span key={i} className="px-2 text-sm text-app-muted">
                ...
              </span>
            ) : (
              <button
                key={item}
                onClick={() => setPage(item)}
                className={`px-3 py-2 text-sm rounded-lg border ${
                  page === item
                    ? "bg-app-primary text-white border-app-primary"
                    : "border-app-border hover:bg-app-soft"
                }`}
              >
                {item}
              </button>
            )
          )}

          <button
            onClick={() => setPage((p) => Math.min(p + 1, safeTotalPages))}
            disabled={page === safeTotalPages}
            className="px-3 py-2 text-sm rounded-lg border border-app-border bg-app-surface hover:bg-app-soft disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}