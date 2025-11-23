import React, { useState } from "react";
import { API } from "../utils/api"; 

export default function Reports() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const USER_ID = 1;

  const fetchTransactions = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API.transactions}?userId=${USER_ID}`);

    
      const text = await response.text();
      let data;

      try {
        data = JSON.parse(text);
      } catch (jsonErr) {
        throw new Error(
          "Backend returned invalid response. Check Azure logs or CORS."
        );
      }

      if (data.error) throw new Error(data.error.message || data.error);

      setTransactions(data.transactions || []);
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setError(err.message || "Unable to fetch transactions.");
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

      {/* Error */}
      {error && (
        <div className="bg-red-100 text-red-800 p-3 rounded-lg mb-6 border border-red-300">
          ❌ {error}
        </div>
      )}

      {/* Transactions Table */}
      <div className="bg-white rounded-xl shadow p-4 overflow-x-auto">
        {transactions.length === 0 ? (
          <p className="text-gray-500 text-center py-10">
            No transactions yet. Click “Fetch Data” to load activity.
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

                  <td className="p-3">
                    {tx.merchant_name || "N/A"}
                  </td>

                  <td className="p-3 text-sm text-gray-600">
                    {tx.category ? tx.category.join(", ") : "Uncategorized"}
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

      {/* Summary */}
      {transactions.length > 0 && (
        <div className="mt-8 bg-white shadow-md rounded-xl p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            🧠 Summary Insight
          </h2>

          <p className="text-gray-700 leading-relaxed">
            Based on your spending, WiseCents AI will analyze your habits and
            identify opportunities to save more effectively.
          </p>

          <button
            onClick={() => alert("AI summary coming soon!")}
            className="mt-4 bg-wiseyellow text-wisegreen px-4 py-2 rounded-lg font-semibold hover:bg-yellow-400 transition"
          >
            Generate AI Summary
          </button>
        </div>
      )}
    </div>
  );
}
