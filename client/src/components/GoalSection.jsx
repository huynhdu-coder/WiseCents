import { useState } from "react";
import { API_BASE } from "../config/apiBase";

export default function GoalSection({ goals, refreshGoals }) {
  const [amounts, setAmounts] = useState({});
  const token = localStorage.getItem("token");

  const handleAddMoney = async (goalId) => {
    const amount = Number(amounts[goalId]);
    if (!amount || amount <= 0) return;

    try {
      await fetch(`${API_BASE}/api/goals/${goalId}/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount }),
      });

      setAmounts((prev) => ({ ...prev, [goalId]: "" }));
      refreshGoals();
    } catch (err) {
      console.error("Error adding money:", err);
    }
  };

  if (!goals || goals.length === 0) {
    return (
      <div className="mt-10 text-gray-500">
        No goals created yet.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">

      {goals.map((goal) => {
        const progress =
          Number(goal.current_amount || 0) /
          Number(goal.target_amount || 1);

        const progressPercent = Math.min(progress * 100, 100);

        return (
          <div
            key={goal.goal_id}
            className="bg-white shadow-md rounded-2xl p-6 border border-gray-100"
          >
            <h3 className="text-lg font-semibold text-gray-800">
              {goal.name}
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              Target: ${Number(goal.target_amount).toLocaleString()}
            </p>

            <div className="w-full bg-gray-200 h-3 rounded mt-4">
              <div
                className="bg-wisegreen h-3 rounded transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <p className="mt-3 text-sm text-gray-600">
              ${Number(goal.current_amount || 0).toLocaleString()} saved
            </p>

            {goal.bank_accounts && (
              <p className="text-xs text-gray-400 mt-1">
                Funding from: {goal.bank_accounts.name}
              </p>
            )}

            {/* Add Money Section */}
            <div className="flex gap-2 mt-4">
              <input
                type="number"
                placeholder="Add amount"
                className="border rounded px-2 py-1 w-full"
                value={amounts[goal.goal_id] || ""}
                onChange={(e) =>
                  setAmounts({
                    ...amounts,
                    [goal.goal_id]: e.target.value,
                  })
                }
              />

              <button
                onClick={() => handleAddMoney(goal.goal_id)}
                className="bg-wisegreen text-white px-4 py-1 rounded-lg"
              >
                Add
              </button>
            </div>
          </div>
        );
      })}

    </div>
  );
}
