import { useEffect, useState } from "react";

const API_BASE =
  process.env.REACT_APP_BACKEND || "http://localhost:5000";
  
export default function Reports() {
  const [transactions, setTransactions] = useState([]);

  const token = localStorage.getItem("token");

  // Function to fetch transactions from backend
  useEffect(() => {
    if (!token) return;

    fetch(`${API_BASE}/api/transactions`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then(setTransactions)
      .catch(console.error);
  }, [token]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-wisegreen mb-4">
        Transactions
      </h1>

      <div className="bg-white rounded shadow divide-y">
        {transactions.map((tx) => (
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
        ))}

        {transactions.length === 0 && (
          <p className="p-4 text-gray-500">No transactions found.</p>
        )}
      </div>
    </div>
  );
}
