import { useState } from "react";
import PlaidLinkButton from "../plaid/PlaidLinkButton";
import AccountCard from "./AccountCard";

export default function AccountSection({
  linkToken,
  accounts = [],
  fetchAccounts,
  deleteAccount,
}) {
  const [showAll, setShowAll] = useState(false);

  const visibleAccounts = showAll ? accounts : accounts.slice(0, 2);
  const hasMoreThanTwo = accounts.length > 2;

  return (
    <section className="rounded-xl2 border border-app-border bg-app-surface p-4 shadow-card sm:p-5">
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <h2 className="text-xl font-bold leading-tight text-app-text sm:text-2xl">
            Accounts
          </h2>
          <p className="mt-1 text-sm text-app-muted">
            Linked bank accounts and balances
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-app-soft px-3 py-1 text-xs font-semibold text-app-muted">
            {accounts.length} total
          </span>

          {linkToken && (
            <PlaidLinkButton
              linkToken={linkToken}
              onSuccess={fetchAccounts}
              label="Connect Bank"
            />
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {visibleAccounts.map((acc) => (
          <AccountCard
            key={acc.account_id}
            account={acc}
            onDelete={deleteAccount}
          />
        ))}
      </div>

      {hasMoreThanTwo && (
        <div className="mt-4 flex justify-center">
          <button
            type="button"
            onClick={() => setShowAll((prev) => !prev)}
            className="rounded-full border border-app-border bg-app-surface px-4 py-2 text-sm font-semibold text-app-text transition hover:bg-app-soft"
          >
            {showAll ? "Show Less" : `Show More (${accounts.length - 2})`}
          </button>
        </div>
      )}
    </section>
  );
}