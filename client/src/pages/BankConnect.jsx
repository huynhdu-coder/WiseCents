import React, { useState } from "react";
import PlaidLinkButton from "../components/plaid/PlaidLinkButton";
import { API } from "../utils/api";

export default function BankConnect() {
  const [linkToken, setLinkToken] = useState(null);
  const USER_ID = 1;

  const generateLinkToken = async () => {
    try {
      const res = await fetch(API.createLinkToken, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: USER_ID }),
      });

      const data = await res.json();
      setLinkToken(data.link_token);
    } catch (err) {
      console.error("Error generating link token:", err);
      alert("Unable to generate Plaid link token.");
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50 text-gray-900">
      <h1 className="text-3xl font-bold text-wisegreen mb-6">
        Connect Your Bank
      </h1>

      {!linkToken ? (
        <button
          onClick={generateLinkToken}
          className="bg-wiseyellow px-5 py-3 rounded-lg font-semibold text-wisegreen hover:bg-yellow-400 transition"
        >
          Generate Link Token
        </button>
      ) : (
        <PlaidLinkButton linkToken={linkToken} userId={USER_ID} />
      )}
    </div>
  );
}
