import pool from "../config/database.js";
import { encrypt } from "../utils/encryption.js";
import {
  createLinkTokenPlaid,
  exchangePublicTokenPlaid,
} from "../services/plaidService.js";
import {
  syncAccounts,
  syncTransactions,
} from "../services/plaidSyncService.js";


export const createLinkToken = async (req, res) => {
  try {
    const response = await createLinkTokenPlaid(req.userId);
    res.json({ link_token: response.data.link_token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


export const exchangePublicToken = async (req, res) => {
  try {
    const { public_token } = req.body;
    const response = await exchangePublicTokenPlaid(public_token);

    await pool.query(
      `
      INSERT INTO plaid_items
      (user_id, plaid_item_id, plaid_access_token)
      VALUES ($1,$2,$3)
      ON CONFLICT (plaid_item_id)
      DO UPDATE SET plaid_access_token = EXCLUDED.plaid_access_token
      `,
      [
        req.userId,
        response.data.item_id,
        encrypt(response.data.access_token),
      ]
    );


    /* Initial sync */
    await syncAccounts(req.userId);
    await syncTransactions(req.userId);

    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

