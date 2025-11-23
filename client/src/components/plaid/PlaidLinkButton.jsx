import { usePlaidLink } from "react-plaid-link";
import { API } from "../../utils/api";

export default function PlaidLinkButton({ linkToken, userId }) {
  const onSuccess = async (public_token, metadata) => {
    await fetch(API.exchangePublicToken, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ public_token, userId }),
    });

    alert("Bank linked successfully!");
  };

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess,
  });

  return (
    <button
      onClick={() => open()}
      disabled={!ready}
      className="bg-wisegreen text-white px-4 py-2 rounded-lg"
    >
      Connect Bank
    </button>
  );
}
