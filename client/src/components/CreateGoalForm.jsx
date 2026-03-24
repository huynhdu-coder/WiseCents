import { useState, useEffect } from "react";
import api from "../api/axios";

export default function CreateGoalForm({ onCreated }) {
  const [name, setName] = useState("");
  const [target, setTarget] = useState("");
  const [deadline, setDeadline] = useState("");
  const [accounts, setAccounts] = useState([]);
  const [accountId, setAccountId] = useState("");

  useEffect(() => {
    async function fetchAccounts() {
      const res = await api.get("/accounts");
      setAccounts(res.data);
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

    onCreated();
    setName("");
    setTarget("");
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white shadow rounded">
      <h2 className="text-lg font-semibold mb-3">Create Goal</h2>

      <input
        className="w-full mb-2 p-2 border rounded"
        placeholder="Goal Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        className="w-full mb-2 p-2 border rounded"
        type="number"
        placeholder="Target Amount"
        value={target}
        onChange={(e) => setTarget(e.target.value)}
      />

      <input
        className="w-full mb-2 p-2 border rounded"
        type="date"
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
      />

      <select
        className="w-full mb-2 p-2 border rounded"
        onChange={(e) => setAccountId(e.target.value)}
      >
        <option>Select Funding Account</option>
        {accounts.map(acc => (
          <option key={acc.account_id} value={acc.account_id}>
            {acc.name} (${acc.current_balance})
          </option>
        ))}
      </select>

      <button className="bg-green-600 text-white px-4 py-2 rounded">
        Create Goal
      </button>
    </form>
  );
}
