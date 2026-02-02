import { plaidClient } from "./plaidClient.js";

export const createLinkTokenPlaid = (userId) =>
  plaidClient.linkTokenCreate({
    user: { client_user_id: String(userId) },
    client_name: "WiseCents",
    products: ["transactions"],
    language: "en",
    country_codes: ["US"],
  });

export const exchangePublicTokenPlaid = (publicToken) =>
  plaidClient.itemPublicTokenExchange({
    public_token: publicToken,
  });

export const fetchAccountsPlaid = (accessToken) =>
  plaidClient.accountsGet({ access_token: accessToken });

export const fetchTransactionsPlaid = (accessToken, start, end) =>
  plaidClient.transactionsGet({
    access_token: accessToken,
    start_date: start,
    end_date: end,
  });

