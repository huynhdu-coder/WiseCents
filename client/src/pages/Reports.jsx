import React, { useState } from "react";

export default function Reports() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Local fetch — update when you deploy backend to Azure
  const API_URL = "http://localhost:5000/api/plaid/transactions";

  const fetchTransactions = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(API_URL);
      const data = await response.json();

      if (data.error) throw new Error(data.error.message || "Failed to fetch transactions");

      setTransactions(data.transactions || []);
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setError("Unable to fetch transactions. Please ensure your backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 text-gray-900">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-wisegreen">📊 Reports</h1>
        <button
          onClick={fetchTransactions}
          disabled={loading}
          className="bg-wisegreen text-white px-5 py-2 rounded-lg hover:bg-green-700 transition"
        >
          {loading ? "Fetching..." : "Fetch Data"}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 text-red-800 p-3 rounded-lg mb-6 border border-red-300">
          {error}
        </div>
      )}

      {/* Transactions Table */}
      <div className="bg-white rounded-xl shadow p-4 overflow-x-auto">
        {transactions.length === 0 ? (
          <p className="text-gray-500 text-center py-10">
            No transactions yet. Click “Fetch Data” to load recent activity.
          </p>
        ) : (
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="border-b text-left bg-gray-100">
                <th className="p-3">Date</th>
                <th className="p-3">Name</th>
                <th className="p-3">Merchant</th>
                <th className="p-3">Category</th>
                <th className="p-3 text-right">Amount ($)</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx, i) => (
                <tr key={i} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="p-3 text-gray-700">{tx.date}</td>
                  <td className="p-3 font-medium">{tx.name}</td>
                  <td className="p-3 flex items-center gap-2">
                    {tx.icon && (
                      <img src={tx.icon} alt={tx.category} className="w-5 h-5 rounded" />
                    )}
                    {tx.merchant || "N/A"}
                  </td>
                  <td className="p-3 text-sm text-gray-600">
                    {tx.category || "Uncategorized"}
                  </td>
                  <td
                    className={`p-3 text-right font-semibold ${
                      tx.amount < 0 ? "text-red-500" : "text-green-600"
                    }`}
                  >
                    {tx.amount.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Summary / AI Section */}
      {transactions.length > 0 && (
        <div className="mt-8 bg-white shadow-md rounded-xl p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            🧠 Summary Insight
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Based on these transactions, WiseCents AI can help you summarize
            spending patterns and identify savings opportunities.
          </p>
          <button
            onClick={() => alert("AI summary coming soon! 🤖")}
            className="mt-4 bg-wiseyellow text-wisegreen px-4 py-2 rounded-lg font-semibold hover:bg-yellow-400 transition"
          >
            Generate AI Summary
          </button>
        </div>
      )}
    </div>
  );
}
