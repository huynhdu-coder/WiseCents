import { useState, useEffect, useCallback} from "react";
import PlaidLinkButton from "../components/plaid/PlaidLinkButton";

const API_BASE =
  process.env.REACT_APP_BACKEND ??
  (process.env.NODE_ENV === "development"
    ? "http://localhost:5000"
    : "");

export default function Dashboard() {
  const [linkToken, setLinkToken] = useState(null);
  const [accounts, setAccounts] = useState([]);

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
  }, [fetchAccounts]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-wisegreen mb-4">
        Dashboard Overview
      </h1>
      <p className="text-gray-600 mb-6">
        Overview of your spending, financial summary and AI insights.
      </p>

      {/* Show connect button only when linkToken is ready */}
      {linkToken ? (
        <PlaidLinkButton
          linkToken={linkToken}
          onSuccess={fetchAccounts}
        />
      ) : (
        <p className="text-gray-500">Loading bank connection...</p>
      )}

      {/* Show user accounts after successful connection */}
      {accounts.length > 0 && (
        <div className="mt-6 bg-white p-4 rounded shadow">
          <h2 className="text-xl font-bold mb-3">Your Accounts</h2>

          {accounts.map((acc) => (
            <div key={acc.account_id} className="border-b py-2">
              <p className="font-semibold">{acc.name}</p>
              <p className="text-gray-600 capitalize">{acc.subtype}</p>
              <p className="text-wisegreen font-bold">
                Balance: ${acc.current_balance}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
