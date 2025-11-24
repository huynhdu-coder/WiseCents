import { useState, useEffect } from "react";
import PlaidLinkButton from "../components/plaid/PlaidLinkButton";

export default function Dashboard() {
  const [linkToken, setLinkToken] = useState(null);
  const [accounts, setAccounts] = useState([]);

  const token = localStorage.getItem("token");
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = storedUser?.user_id;

  // Fetch Plaid link token
  useEffect(() => {
    if (!token || !userId) {
      console.error("Missing token or userId - user not logged in");
      return;
    }

    fetch(
      "https://wisecents-backend-dev-ewbgf0bxgwe9fta2.eastus2-01.azurewebsites.net/api/plaid/create_link_token",
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
        console.log("Fetched link token:", data.link_token);
        setLinkToken(data.link_token);
      })
      .catch((err) => console.error("Error fetching link token:", err));
  }, [token, userId]);

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
          onAccountsFetched={(acc) => setAccounts(acc)}
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
                Balance: ${acc.balances.current}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
