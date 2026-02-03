import pool from "../config/database.js";
import { decrypt } from "../utils/encryption.js";
import { plaidClient } from "./plaidClient.js";
import { fetchAccountsPlaid } from "./plaidService.js";


export async function syncAccounts(userId) {
 
  const itemsRes = await pool.query(
    `
    SELECT plaid_item_id, plaid_access_token
    FROM plaid_items
    WHERE user_id = $1
    `,
    [userId]
  );

  if (!itemsRes.rows.length) return;

  
  for (const item of itemsRes.rows) {
    const accessToken = decrypt(item.plaid_access_token);
    const plaidItemId = item.plaid_item_id;

    
    const response = await fetchAccountsPlaid(accessToken);

    
    for (const acc of response.data.accounts) {
      await pool.query(
        `
        INSERT INTO bank_accounts
        (user_id, plaid_item_id, plaid_account_id,
         name, type, subtype,
         current_balance, available_balance)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
        ON CONFLICT (plaid_account_id)
        DO UPDATE SET
          current_balance = EXCLUDED.current_balance,
          available_balance = EXCLUDED.available_balance
        `,
        [
          userId,
          plaidItemId,
          acc.account_id,
          acc.name,
          acc.type,
          acc.subtype,
          acc.balances.current,
          acc.balances.available,
        ]
      );
    }
  }
}
export async function syncTransactions(userId) {

  const itemsRes = await pool.query(
    `
    SELECT plaid_item_id, plaid_access_token, cursor
    FROM plaid_items
    WHERE user_id = $1
    `,
    [userId]
  );

  if (!itemsRes.rows.length) return;


  for (const item of itemsRes.rows) {
    const accessToken = decrypt(item.plaid_access_token);
    let cursor = item.cursor || null;
    let hasMore = true;

    while (hasMore) {
      const response = await plaidClient.transactionsSync({
        access_token: accessToken,
        cursor,
      });

      const {
        added,
        modified,
        removed,
        next_cursor,
        has_more,
      } = response.data;

  
      for (const tx of added) {
        await pool.query(
          `
          INSERT INTO transactions
          (user_id, account_id, plaid_transaction_id,
           name, amount, category, date)
          SELECT
            $1,
            ba.account_id,
            $2,
            $3,
            $4,
            $5,
            $6
          FROM bank_accounts ba
          WHERE ba.plaid_account_id = $7
          ON CONFLICT (plaid_transaction_id) DO NOTHING
          `,
          [
            userId,
            tx.transaction_id,
            tx.name,
            tx.amount,
            tx.category?.[0] || null,
            tx.date,
            tx.account_id,
          ]
        );
      }


      for (const tx of modified) {
        await pool.query(
          `
          UPDATE transactions
          SET
            name = $1,
            amount = $2,
            category = $3,
            date = $4
          WHERE plaid_transaction_id = $5
          `,
          [
            tx.name,
            tx.amount,
            tx.category?.[0] || null,
            tx.date,
            tx.transaction_id,
          ]
        );
      }


      for (const tx of removed) {
        await pool.query(
          `
          DELETE FROM transactions
          WHERE plaid_transaction_id = $1
          `,
          [tx.transaction_id]
        );
      }

      cursor = next_cursor;
      hasMore = has_more;
    }

    await pool.query(
      `
      UPDATE plaid_items
      SET cursor = $1
      WHERE plaid_item_id = $2
      `,
      [cursor, item.plaid_item_id]
    );
  }
}
