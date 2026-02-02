import { usePlaidLink } from "react-plaid-link";


const API_BASE =
 process.env.REACT_APP_BACKEND ??
  (process.env.NODE_ENV === "development"
    ? "http://localhost:5000"
    : "");

export default function PlaidLinkButton({ linkToken, onSuccess }) {
  const token = localStorage.getItem("token");

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: async (public_token) => {
      


    // Exchange public token → save access_token in DB
      await fetch(`${API_BASE}/api/plaid/exchange_public_token`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({public_token}),
    });
    onSuccess();
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
