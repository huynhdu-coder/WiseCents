import pool from "../database.js";
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
  try {
    const response = await client.linkTokenCreate({
      user: { client_user_id: String(req.body.userId) },
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
  const { public_token, userId } = req.body;

  try {
    const response = await client.itemPublicTokenExchange({ public_token });

    const encryptedToken = encrypt(response.data.access_token);

    await pool.query(
      "UPDATE users SET access_token = $1 WHERE id = $2",
      [encryptedToken, userId]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("PLAID EXCHANGE ERROR:", err.response?.data || err.message);
    res.status(400).json({ error: err.response?.data || err.message });
  }
};

// 3. Fetch Transactions
export const getTransactions = async (req, res) => {
  const { userId } = req.query;

  try {
    const result = await pool.query(
      "SELECT access_token FROM users WHERE id = $1",
      [userId]
    );

    if (!result.rows[0]?.access_token) {
      return res.status(400).json({ error: "Missing access token" });
    }

    const accessToken = decrypt(result.rows[0].access_token);

    const today = new Date().toISOString().split("T")[0];
    const past = new Date();
    past.setMonth(past.getMonth() - 1);

    const start = past.toISOString().split("T")[0];

    const response = await client.transactionsGet({
      access_token: accessToken,
      start_date: start,
      end_date: today,
    });

    res.json({ transactions: response.data.transactions });
  } catch (err) {
    console.error("PLAID ERROR:", err.response?.data || err.message);
    res.status(400).json({ error: err.response?.data || err.message });
  }
};
