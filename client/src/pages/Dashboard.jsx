import { useState, useEffect, useCallback} from "react";
import PlaidLinkButton from "../components/plaid/PlaidLinkButton";
import { API_BASE } from "../config/apiBase";
import AccountCard from "../components/accounts/AccountCard";
import GoalSection from "../components/GoalSection";
import CreateGoalForm from "../components/CreateGoalForm";
import CategoryPieChart from "../components/charts/CategoryPieChart";
import MonthlyBarChart from "../components/charts/MonthlyBarChart";



export default function Dashboard() {
  const [linkToken, setLinkToken] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [goals, setGoals] = useState([]);
  const [showGoalForm, setShowGoalForm] = useState(false);
  

  const token = localStorage.getItem("token");
  
  //Fetch accounts function
  const fetchAccounts = useCallback( async () => {
    if (!token) return;
    try{
      const res = await fetch(`${API_BASE}/api/accounts`, {
        headers: {
          Authorization: `Bearer ${token}`,
      },
    });
      const data = await res.json();
      setAccounts(data);
    } catch (error) {
      console.error("Error fetching accounts:", error);
    }
  }, [token]);

  // Delete account function
  const deleteAccount = async (accountId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this account?"
    );

    if (!confirmDelete) return;

    try {
      const res = await fetch(
        `${API_BASE}/api/accounts/${accountId}/delete`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to delete account");
      }

      // Refresh account list
      fetchAccounts();

    } catch (error) {
      console.error("Delete account error:", error);
      alert("Failed to delete account.");
    }
  };

  // Fetch goals function
  const fetchGoals = useCallback(async () => {
    if (!token) return;

    try {
      const res = await fetch(`${API_BASE}/api/goals`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setGoals(data);
    } catch (error) {
      console.error("Error fetching goals:", error);
    }
  }, [token]);

  // Fetch Plaid link token
  useEffect(() => {
    if (!token) return;

    fetch(`${API_BASE}/api/plaid/create_link_token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setLinkToken(data.link_token);
      })
      .catch(console.error);
  }, [token]);


  // Load accounts on page load
  useEffect(() => {
    fetchAccounts();
    fetchGoals();
  }, [fetchAccounts, fetchGoals]);

  return (
    <div className="p-8 bg-gray-100 min-h-screen">

      <h1 className="text-2xl font-bold text-wisegreen mb-2">
        Dashboard
      </h1>

      {/* Plaid Connect + Account Cards */}
      <div className="flex gap-6 overflow-x-auto pb-4 items-start">
        {linkToken && (
      <div className="min-w-[280px] bg-white border-2 border-dashed border-gray-300 
                      rounded-xl flex flex-col justify-center items-center 
                      p-6 hover:border-wisegreen hover:bg-green-50 
                      transition-all duration-200 shadow-sm">
        
        <div className="text-3xl text-wisegreen mb-2">+</div>
        
        <PlaidLinkButton
          linkToken={linkToken}
          onSuccess={fetchAccounts}
          label="Add Account"
        />

      </div>
    )}

        {/* Accounts Section */}
        {accounts.map((acc) => (
          <AccountCard
            key={acc.account_id}
            account={acc}
            onDelete={deleteAccount}
          />
        ))}
      </div>

      {/* ADD GOAL BUTTON */}
      <div className="mt-8">
        <button
          onClick={() => setShowGoalForm(!showGoalForm)}
          className="bg-wisegreen text-white px-6 py-2 rounded-xl shadow hover:shadow-lg transition"
        >
          + Add Goal
        </button>
      </div>


      {/* GOAL FORM */}
      {showGoalForm && (
        <div className="mt-6">
          <CreateGoalForm onCreated={fetchGoals} />
        </div>
      )}

      {/* GOAL SECTION */}
      <div className="mt-10">
        <GoalSection goals={goals} refreshGoals={fetchGoals}/>
      </div>

      {/* CHARTS */}
      <div className="grid md:grid-cols-2 gap-6 mt-10">
        <CategoryPieChart />
        <MonthlyBarChart />
      </div>


    </div>
  );
}
