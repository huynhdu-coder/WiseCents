import React from "react";
import { usePlaidLink } from "react-plaid-link";

export default function PlaidLinkButton({ linkToken, userId }) {
  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: async (public_token, metadata) => {
      try {
        const res = await fetch(
          "https://wisecents-backend-dev-ewbgf0bxgwe9fta2.eastus2-01.azurewebsites.net/api/plaid/exchange_public_token",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ public_token, userId }),
          }
        );

        if (!res.ok) throw new Error("Exchange token failed");

        alert("✅ Bank account connected successfully!");
      } catch (err) {
        console.error("Error exchanging token:", err);
        alert("❌ Failed to exchange Plaid token.");
      }
    },
    onExit: (err, metadata) => {
      if (err) console.error("Plaid Link exited with error:", err);
    },
  });

  return (
    <button
      onClick={() => open()}
      disabled={!ready}
      className="bg-wisegreen text-white px-6 py-3 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
    >
      Connect Bank Account
    </button>
  );
}
