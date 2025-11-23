import express from "express";
import plaidClient from "../config/plaidClient.js";
import moment from "moment";
import pool from "../config/database.js";

const router = express.Router();

// Fetch transactions from Plaid
router.get("/transactions", async (req, res) => {
  try {
    // date range: last 30 days
    const startDate = moment().subtract(30, "days").format("YYYY-MM-DD");
    const endDate = moment().format("YYYY-MM-DD");

    const response = await plaidClient.transactionsGet({
      access_token: process.env.PLAID_ACCESS_TOKEN, // store securely in .env
      start_date: startDate,
      end_date: endDate,
    });

    const transactions = response.data.transactions;
    res.json({ transactions });
  } catch (error) {
    console.error("Plaid error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Save Plaid transactions to PostgreSQL
router.post("/store-transactions", async (req, res) => {
  try {
    const { transactions } = req.body;

    if (!transactions || transactions.length === 0) {
      return res.status(400).json({ error: "No transactions provided" });
    }

    const insertQuery = `
      INSERT INTO transactions (transaction_id, name, amount, date, category, merchant)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (transaction_id) DO NOTHING;
    `;

    for (let tx of transactions) {
      const category = tx.category?.join(", ") || null;

      await pool.query(insertQuery, [
        tx.transaction_id,
        tx.name,
        tx.amount,
        tx.date,
        category,
        tx.merchant_name || null,
      ]);
    }

    res.json({ message: "Transactions saved to DB" });
  } catch (error) {
    console.error("DB Save Error:", error);
    res.status(500).json({ error: "Failed to save transactions" });
  }
});

router.get("/stored-transactions", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT *
      FROM transactions
      ORDER BY date DESC
    `);

    res.json({ transactions: result.rows });
  } catch (error) {
    console.error("Fetch DB Error:", error);
    res.status(500).json({ error: "Failed to fetch stored transactions" });
  }
});

export default router;
