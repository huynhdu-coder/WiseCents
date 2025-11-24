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
export default function PlaidLinkButton({ linkToken, onAccountsFetched }) {
  const token = localStorage.getItem("token");

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: async (public_token, metadata) => {

    // Exchange public token → save access_token in DB
      await fetch("https://wisecents-backend-dev-ewbgf0bxgwe9fta2.eastus2-01.azurewebsites.net/api/plaid/exchange_public_token", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({      public_token}),
    });

      //Fetch account data to confirm connection
      const accountsRes = await fetch("https://wisecents-backend-dev-ewbgf0bxgwe9fta2.eastus2-01.azurewebsites.net/api/plaid/get_accounts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
      });

    const accounts = await accountsRes.json();

    onAccountsFetched(accounts);

    alert("Bank connected!");
    
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
