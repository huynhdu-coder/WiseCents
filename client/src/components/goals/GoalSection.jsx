import { useState } from "react";
import { API_BASE } from "../../config/apiBase";

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
      <div className="rounded-xl2 border border-dashed border-app-borderSoft bg-app-soft px-4 py-8 text-center">
        <p className="text-sm font-medium text-app-muted">
          No goals created yet.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {goals.map((goal) => {
        const current = Number(goal.current_amount || 0);
        const target = Number(goal.target_amount || 1);
        const progress = current / target;
        const progressPercent = Math.min(progress * 100, 100);

        return (
          <div
            key={goal.goal_id}
            className="rounded-xl2 border border-app-border bg-app-surface p-4 shadow-card"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="truncate text-base font-bold text-app-text sm:text-lg">
                  {goal.name}
                </h3>
                <p className="mt-1 text-sm text-app-muted">
                  Target: ${target.toLocaleString()}
                </p>
              </div>

              <span className="shrink-0 rounded-full bg-app-primarySoft px-2.5 py-1 text-xs font-semibold text-app-primary">
                {Math.round(progressPercent)}%
              </span>
            </div>

            <div className="mt-4">
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-app-borderSoft">
                <div
                  className="h-full rounded-full bg-app-primary transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <p className="mt-2 text-sm font-medium text-app-text">
                ${current.toLocaleString()} saved
              </p>

              {goal.bank_accounts && (
                <p className="mt-1 text-xs text-app-muted">
                  Funding from: {goal.bank_accounts.name}
                </p>
              )}
            </div>

            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <input
                type="number"
                placeholder="Add amount"
                className="w-full rounded-xl border border-app-border bg-app-surface px-3 py-2 text-sm text-app-text outline-none placeholder:text-app-muted focus:border-app-primary"
                value={amounts[goal.goal_id] || ""}
                onChange={(e) =>
                  setAmounts((prev) => ({
                    ...prev,
                    [goal.goal_id]: e.target.value,
                  }))
                }
              />

              <button
                type="button"
                onClick={() => handleAddMoney(goal.goal_id)}
                className="shrink-0 rounded-xl bg-app-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-app-primaryHover"
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