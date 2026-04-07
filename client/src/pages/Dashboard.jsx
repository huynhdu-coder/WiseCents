import { useState, useEffect, useCallback, useMemo } from "react";
import { API_BASE } from "../config/apiBase";
import GoalPanel from "../components/dashboard/GoalPanel";
import DashboardHero from "../components/dashboard/DashboardHero";
import StatsGrid from "../components/dashboard/StatsGrid";
import AccountSection from "../components/dashboard/AccountSection";
import SmartInsightCard from "../components/dashboard/SmartInsightCard";
import ExpenseLineChart from "../components/dashboard/ExpenseLineChart";
import GoalFormModal from "../components/goals/GoalFormModal";

export default function Dashboard() {
  const [linkToken, setLinkToken] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [goals, setGoals] = useState([]);
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [monthlyData, setMonthlyData] = useState([]);

  const token = localStorage.getItem("token");

  const fetchAccounts = useCallback(async () => {
    if (!token) return;

    try {
      const res = await fetch(`${API_BASE}/api/accounts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (Array.isArray(data)) {
        setAccounts(data);
      } else if (Array.isArray(data.accounts)) {
        setAccounts(data.accounts);
      } else {
        setAccounts([]);
      }
    } catch (error) {
      console.error("Error fetching accounts:", error);
      setAccounts([]);
    }
  }, [token]);

  const deleteAccount = async (accountId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this account?"
    );

    if (!confirmDelete) return;

    try {
      const res = await fetch(`${API_BASE}/api/accounts/${accountId}/delete`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to delete account");
      }

      fetchAccounts();
    } catch (error) {
      console.error("Delete account error:", error);
      alert("Failed to delete account.");
    }
  };

  const fetchMonthlyData = useCallback(async () => {
    if (!token) {
      setMonthlyData([]);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/reports/monthly-report`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Monthly report fetch failed:", data);
        setMonthlyData([]);
        return;
      }

      const normalized = Object.keys(data || {})
        .sort()
        .map((month) => ({
          month,
          income: Number(data[month]?.income || 0),
          expenses: Number(data[month]?.expenses || 0),
          net: Number(data[month]?.net || 0),
        }));

      setMonthlyData(normalized);
    } catch (error) {
      console.error("Error fetching monthly data:", error);
      setMonthlyData([]);
    }
  }, [token]);

  const fetchGoals = useCallback(async () => {
    if (!token) {
      setGoals([]);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/goals`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Goals fetch failed:", data);
        setGoals([]);
        return;
      }

      if (Array.isArray(data)) {
        setGoals(data);
      } else {
        setGoals([]);
      }
    } catch (error) {
      console.error("Error fetching goals:", error);
      setGoals([]);
    }
  }, [token]);

  useEffect(() => {
    if (!token) return;

    fetch(`${API_BASE}/api/plaid/create_link_token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setLinkToken(data.link_token);
      })
      .catch(console.error);
  }, [token]);

  useEffect(() => {
    fetchAccounts();
    fetchGoals();
    fetchMonthlyData();
  }, [fetchAccounts, fetchGoals, fetchMonthlyData]);

  const totalBalance = useMemo(() => {
    return accounts.reduce((sum, acc) => {
      return sum + Number(acc.current_balance || 0);
    }, 0);
  }, [accounts]);

  const activeGoals = useMemo(() => {
    return goals.filter((goal) => {
      const current = Number(goal.current_amount || 0);
      const target = Number(goal.target_amount || 0);
      return target > 0 && current < target;
    }).length;
  }, [goals]);

  const goalCompletion = useMemo(() => {
    if (!goals.length) return 0;

    const totalCurrent = goals.reduce(
      (sum, goal) => sum + Number(goal.current_amount || 0),
      0
    );

    const totalTarget = goals.reduce(
      (sum, goal) => sum + Number(goal.target_amount || 0),
      0
    );

    if (totalTarget <= 0) return 0;

    return Math.round((totalCurrent / totalTarget) * 100);
  }, [goals]);

  return (
    <>
      <DashboardHero onManageGoals={() => setShowGoalForm(true)} />

      <StatsGrid
        totalBalance={totalBalance}
        linkedAccounts={accounts.length}
        activeGoals={activeGoals}
        goalCompletion={goalCompletion}
      />

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <AccountSection
          linkToken={linkToken}
          accounts={accounts}
          fetchAccounts={fetchAccounts}
          deleteAccount={deleteAccount}
        />

        <ExpenseLineChart />

        <GoalPanel
          goals={goals}
          fetchGoals={fetchGoals}
          onAddGoal={() => setShowGoalForm(true)}
        />

        <SmartInsightCard
          monthlyData={monthlyData}
          goals={goals}
        />
      </section>

      <GoalFormModal
        open={showGoalForm}
        onClose={() => setShowGoalForm(false)}
        onCreated={fetchGoals}
      />
    </>
  );
}