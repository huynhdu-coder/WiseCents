import express from "express";
import plaidClient from "../config/plaidClient.js";
import moment from "moment";

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

export default router;
