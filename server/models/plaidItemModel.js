import pool from '../config/database.js';
import CryptoJS from 'crypto-js';

const key = process.env.ENCRYPTION_KEY; // MUST be 32 chars

export const savePlaidItem = async (userId, accessToken, itemId) => {
  const encrypted = CryptoJS.AES.encrypt(accessToken, key).toString();

  await pool.query(
    `INSERT INTO plaid_items (user_id, access_token, item_id)
     VALUES ($1, $2, $3)
     ON CONFLICT (user_id)
     DO UPDATE SET access_token = EXCLUDED.access_token, item_id = EXCLUDED.item_id`,
    [userId, encrypted, itemId]
  );
};
