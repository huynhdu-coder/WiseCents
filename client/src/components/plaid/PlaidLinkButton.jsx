import { usePlaidLink } from "react-plaid-link";

// export default function PlaidLinkButton({ linkToken, userId }) {
//   const { open, ready } = usePlaidLink({
//     token: linkToken,
//     onSuccess: async (public_token, metadata) => {
//     console.log("PUBLIC TOKEN:", public_token);
//   await fetch("http://localhost:5000/api/plaid/exchange_public_token", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ public_token, userId }),
//   });

//   alert("Bank account connected!");
// }
// });
export default function PlaidLinkButton({ linkToken }) {
  const token = localStorage.getItem("token");

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: async (public_token, metadata) => {

      const res = await fetch("http://localhost:5000/api/plaid/exchange_public_token", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({      public_token}),
    });

    const data = await res.json();

    if (data.success) {
      alert("Bank connected successfully!");
    } else {
          alert("Failed to connect bank: " + data.error);
    }
  },
  onExit: (err) => {
    if (err) console.log("Plaid exit error:", err);
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
