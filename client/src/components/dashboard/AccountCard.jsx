export default function AccountCard({ account, onDelete }) {
  const currentBalance = Number(account.current_balance || 0);
  const availableBalance = Number(account.available_balance ?? currentBalance);

  return (
    <div className="rounded-xl2 border border-app-border bg-app-surface p-4 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-bold leading-tight text-app-text">
            {account.name}
          </h3>
        </div>

        <button
          onClick={() => onDelete(account.account_id)}
          className="shrink-0 text-xs font-semibold text-app-danger transition hover:opacity-80"
        >
          Delete
        </button>
      </div>

      <div className="mt-4">
        <p className="text-xs font-medium uppercase tracking-wide text-app-muted">
          Current Balance
        </p>
        <p className="mt-1 truncate text-2xl font-bold leading-tight text-app-primary">
          ${currentBalance.toLocaleString()}
        </p>
      </div>

      <div className="mt-4 flex items-end justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-app-muted">
            Available
          </p>
          <p className="mt-1 truncate text-sm font-semibold text-app-text sm:text-base">
            ${availableBalance.toLocaleString()}
          </p>
        </div>

        <span className="max-w-[120px] truncate rounded-full bg-app-primarySoft px-2.5 py-1 text-[11px] font-semibold capitalize text-app-primary">
          {account.subtype || account.type || "account"}
        </span>
      </div>
    </div>
  );
}