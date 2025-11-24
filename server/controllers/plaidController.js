import pool from "../config/database.js";
import { Configuration, PlaidApi, PlaidEnvironments } from "plaid";
import { encrypt, decrypt } from "../utils/encryption.js";


const config = new Configuration({
  basePath: PlaidEnvironments[process.env.PLAID_ENV],
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID": process.env.PLAID_CLIENT_ID,
      "PLAID-SECRET": process.env.PLAID_SECRET,
    },
  },
});

const client = new PlaidApi(config);


// 1. Generate Link Token
export const createLinkToken = async (req, res) => {
  const  userId  = req.userId;
  try {
    const response = await client.linkTokenCreate({
      user: { client_user_id: String(userId) },
      client_name: "WiseCents",
      products: ["transactions"],
      language: "en",
      country_codes: ["US"],
    });

    res.json({ link_token: response.data.link_token });
  } catch (err) {
    console.error("PLAID LINK ERROR:", err.response?.data || err.message);
    res.status(400).json({ error: err.response?.data || err.message });
  }
};

// 2. Exchange public_token → access_token
export const exchangePublicToken = async (req, res) => {
  const { public_token } = req.body;
  const  userId  = req.userId;

  try {
    const exchangeResponse = await client.itemPublicTokenExchange({
      public_token
    });

    const accessToken = exchangeResponse.data.access_token;
    const itemId = exchangeResponse.data.item_id;

    const encryptedToken = encrypt(accessToken);

  await pool.query(
  `INSERT INTO plaid_items (user_id, plaid_access_token, plaid_item_id)
     VALUES ($1, $2, $3)
     ON CONFLICT (user_id) DO UPDATE
     SET plaid_access_token = EXCLUDED.plaid_access_token,
         plaid_item_id = EXCLUDED.plaid_item_id`,
  [userId, encryptedToken, itemId]
);

    res.json({ success: true });
  } catch (err) {
    console.error("PLAID EXCHANGE ERROR:", err.response?.data || err);
    res.status(400).json({ error: err.response?.data || err.message });
  }
};

// 3. Fetch Transactions
export const getTransactions = async (req, res) => {
  const userId  = req.userId;

  try {
    const result = await pool.query(
      "SELECT plaid_access_token FROM plaid_items WHERE user_id = $1",
      [userId]
    );

    if (result.rows.length === 0)
      return res.status(400).json({ error: "User has no linked bank accounts" });

    const encrypted = result.rows[0].plaid_access_token;
    const accessToken = decrypt(encrypted);

    const response = await client.transactionsGet({
      access_token: accessToken,
      start_date: "2022-01-01",
      end_date: "2025-12-31",
    });

    res.json(response.data.transactions);
  } catch (err) {
    console.error("GET TRANSACTIONS ERROR:", err.response?.data || err);
    res.status(400).json({ error: err.response?.data || err.message });
  }
};


// 4. Get Accounts
export const getAccounts = async (req, res) => {
  try {
    const userId = req.userId;

    const result = await pool.query(
      "SELECT plaid_access_token FROM plaid_items WHERE user_id = $1",
      [userId]
    );

    const encrypted = result.rows[0].plaid_access_token;
    const accessToken = decrypt(encrypted);

    const response = await client.accountsGet({
      access_token: accessToken,
    });

    res.json(response.data.accounts);
  } catch (err) {
    console.error("GET ACCOUNTS ERROR:", err.response?.data || err);
    res.status(400).json({ error: err.response?.data || err.message });
  }
};

