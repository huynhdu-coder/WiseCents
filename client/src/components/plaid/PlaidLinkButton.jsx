import { usePlaidLink } from "react-plaid-link";
import { API_BASE } from "../../config/apiBase";

export default function PlaidLinkButton({ linkToken, onSuccess }) {
  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: async (public_token) => {
      const token = localStorage.getItem("token"); 

      if (!token) {
        alert("Not logged in. Please log in again.");
        return;
      }

      // Exchange public token → save access_token in DB
      const res = await fetch(`${API_BASE}/api/plaid/exchange_public_token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ public_token }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("exchange_public_token failed:", res.status, text);
        alert("Bank link failed. Check console.");
        return;
      }

      if (onSuccess) onSuccess();
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