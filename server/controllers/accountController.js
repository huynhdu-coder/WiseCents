import pool from "../config/database.js";
export const getAccounts = async (req, res) => {
  const result = await pool.query(
    `
    SELECT account_id, name, nickname, type, subtype,
           current_balance, available_balance, is_hidden
    FROM bank_accounts
    WHERE user_id=$1
    ORDER BY created_at
    `,
    [req.userId]
  );
  res.json(result.rows);
};
export const renameAccount = async (req, res) => {
  await pool.query(
    `
    UPDATE bank_accounts
    SET nickname=$1
    WHERE account_id=$2 AND user_id=$3
    `,
    [req.body.nickname, req.params.id, req.userId]
  );
  res.json({ success: true });
};
export const hideAccount = async (req, res) => {
  await pool.query(
    `
    UPDATE bank_accounts
    SET is_hidden=$1
    WHERE account_id=$2 AND user_id=$3
    `,
    [req.body.is_hidden, req.params.id, req.userId]
  );
  res.json({ success: true });
};
