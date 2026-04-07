import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function CreateGoalForm({ onCreated }) {
  const [name, setName] = useState("");
  const [target, setTarget] = useState("");
  const [deadline, setDeadline] = useState("");
  const [accounts, setAccounts] = useState([]);
  const [accountId, setAccountId] = useState("");

  useEffect(() => {
    async function fetchAccounts() {
      try {
        const res = await api.get("/accounts");
        setAccounts(res.data || []);
      } catch (err) {
        console.error("Error fetching accounts:", err);
      }
    }

    fetchAccounts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await api.post("/goals", {
      name,
      target_amount: Number(target),
      deadline,
      funding_account_id: Number(accountId),
    });

    onCreated?.();
    setName("");
    setTarget("");
    setDeadline("");
    setAccountId("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-app-text">
          Goal Name
        </label>
        <input
          className="w-full rounded-xl border border-app-border bg-app-surface px-3 py-2.5 text-sm text-app-text outline-none placeholder:text-app-muted focus:border-app-primary"
          placeholder="Emergency Fund"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-app-text">
          Target Amount
        </label>
        <input
          className="w-full rounded-xl border border-app-border bg-app-surface px-3 py-2.5 text-sm text-app-text outline-none placeholder:text-app-muted focus:border-app-primary"
          type="number"
          placeholder="5000"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-app-text">
          Deadline
        </label>
        <input
          className="w-full rounded-xl border border-app-border bg-app-surface px-3 py-2.5 text-sm text-app-text outline-none focus:border-app-primary"
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-app-text">
          Funding Account
        </label>
        <select
          className="w-full rounded-xl border border-app-border bg-app-surface px-3 py-2.5 text-sm text-app-text outline-none focus:border-app-primary"
          value={accountId}
          onChange={(e) => setAccountId(e.target.value)}
          required
        >
          <option value="">Select funding account</option>
          {accounts.map((acc) => (
            <option key={acc.account_id} value={acc.account_id}>
              {acc.name} (${Number(acc.current_balance || 0).toLocaleString()})
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <button
          type="submit"
          className="rounded-xl bg-app-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-app-primaryHover"
        >
          Create Goal
        </button>
      </div>
    </form>
  );
}