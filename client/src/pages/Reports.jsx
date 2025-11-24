import React, { useState } from "react";

export default function Reports() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);


  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        "https://wisecents-backend-dev-ewbgf0bxgwe9fta2.eastus2-01.azurewebsites.net/api/plaid/transactions",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,  // REQUIRED
          },
        }
      );

      const data = await res.json();

      if (Array.isArray(data)) {
        setTransactions(data);
      } else {
        alert(data.error || "No transactions found.");
      }
    } catch (err) {
      console.error("Error fetching transactions:", err);
      alert("Failed to load transactions.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 text-gray-900">
      <h1 className="text-3xl font-bold text-wisegreen mb-6">Reports</h1>

      <button
        onClick={fetchTransactions}
        disabled={loading}
        className="bg-wiseyellow px-6 py-3 rounded-lg font-semibold text-wisegreen hover:bg-yellow-400 transition disabled:opacity-50 mb-6"
      >
        {loading ? "Fetching..." : "Fetch Transactions"}
      </button>

      {transactions.length > 0 ? (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-wisegreen text-white">
              <tr>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 text-right">Amount ($)</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((txn) => (
                <tr key={txn.transaction_id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4">{txn.date}</td>
                  <td className="py-2 px-4 flex items-center gap-2">
                    {txn.logo_url && (
                      <img src={txn.logo_url} alt="" className="w-5 h-5 rounded-full" />
                    )}
                    {txn.name || txn.merchant_name || "—"}
                  </td>
                  <td className="py-2 px-4">
                    {txn.personal_finance_category?.primary || "—"}
                  </td>
                  <td className="py-2 px-4 text-right">
                    {txn.amount.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-600">No transactions to display yet.</p>
      )}
    </div>
  );
}
