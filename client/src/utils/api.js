export const BACKEND = process.env.REACT_APP_BACKEND;

export const API = {
  createLinkToken: `${BACKEND}/api/plaid/create_link_token`,
  exchangePublicToken: `${BACKEND}/api/plaid/exchange_public_token`,
  transactions: `${BACKEND}/api/plaid/transactions`,
};
