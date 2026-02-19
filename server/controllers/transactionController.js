import pool from "../config/database.js";

export const getTransactions = async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT
        t.id,
        t.name,
        t.amount,
        t.category_primary,
        t.category_detailed,
        t.date,
        ba.name AS account_name,
        ba.subtype AS account_subtype
      FROM public.transactions t
      JOIN public.bank_accounts ba
        ON t.account_id = ba.account_id
      WHERE t.user_id = $1
        AND ba.is_hidden = false
      ORDER BY t.date DESC
      LIMIT 100
      `,
      [req.userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("GET TRANSACTIONS ERROR:", err);
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
};