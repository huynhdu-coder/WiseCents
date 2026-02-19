import prisma from "../config/prisma.js";
import { decrypt } from "../utils/encryption.js";
import { plaidClient } from "./plaidClient.js";

export async function syncTransactions(userId) {
  try {
    const items = await prisma.plaid_items.findMany({
      where: { user_id: userId },
    });

    if (!items.length) return;

    // Build account map ONCE
    const accounts = await prisma.bank_accounts.findMany({
      where: { user_id: userId },
      select: {
        account_id: true,
        plaid_account_id: true,
      },
    });

    const accountMap = {};
    accounts.forEach(acc => {
      accountMap[acc.plaid_account_id] = acc.account_id;
    });

    for (const item of items) {
      const accessToken = decrypt(item.plaid_access_token);
      let cursor = item.cursor || null;
      let hasMore = true;

      while (hasMore) {
        const response = await plaidClient.transactionsSync({
          access_token: accessToken,
          cursor,
        });

        const { added, modified, removed, next_cursor, has_more } =
          response.data;

        // ---------------- ADDED ----------------
        for (const tx of added) {
          const accountId = accountMap[tx.account_id];
          if (!accountId) continue;

          await prisma.transactions.upsert({
            where: { transaction_id: tx.transaction_id },
            update: {
              name: tx.name,
              amount: tx.amount,
              date: new Date(tx.date),
              category_primary:
                tx.personal_finance_category?.primary || null,
              category_detailed:
                tx.personal_finance_category?.detailed || null,
            },
            create: {
              transaction_id: tx.transaction_id,
              user_id: userId,
              account_id: accountId,
              name: tx.name,
              amount: tx.amount,
              date: new Date(tx.date),
              category_primary:
                tx.personal_finance_category?.primary || null,
              category_detailed:
                tx.personal_finance_category?.detailed || null,
            },
          });
        }

        // ---------------- MODIFIED ----------------
        for (const tx of modified) {
          await prisma.transactions.update({
            where: { transaction_id: tx.transaction_id },
            data: {
              name: tx.name,
              amount: tx.amount,
              date: new Date(tx.date),
              category_primary:
                tx.personal_finance_category?.primary || null,
              category_detailed:
                tx.personal_finance_category?.detailed || null,
            },
          }).catch(() => {});
        }

        // ---------------- REMOVED ----------------
        for (const tx of removed) {
          await prisma.transactions.delete({
            where: { transaction_id: tx.transaction_id },
          }).catch(() => {});
        }

        cursor = next_cursor;
        hasMore = has_more;
      }

      // Save updated cursor
      await prisma.plaid_items.update({
        where: { plaid_item_id: item.plaid_item_id },
        data: { cursor },
      });
    }

  } catch (error) {
    console.error("Transaction sync error:", error);
    throw error;
  }
}
export async function syncAccounts(userId) {
  try {
    const items = await prisma.plaid_items.findMany({
      where: { user_id: userId },
    });

    if (!items.length) return;

    for (const item of items) {
      const accessToken = decrypt(item.plaid_access_token);

      const response = await plaidClient.accountsGet({
        access_token: accessToken,
      });

      for (const acc of response.data.accounts) {
        await prisma.bank_accounts.upsert({
          where: {
            plaid_account_id: acc.account_id,
          },
          update: {
            current_balance: acc.balances.current,
            available_balance: acc.balances.available,
            name: acc.name,
            official_name: acc.official_name,
            type: acc.type,
            subtype: acc.subtype,
          },
          create: {
            user_id: userId,
            plaid_item_id: item.plaid_item_id,
            plaid_account_id: acc.account_id,
            name: acc.name,
            official_name: acc.official_name,
            type: acc.type,
            subtype: acc.subtype,
            current_balance: acc.balances.current,
            available_balance: acc.balances.available,
          },
        });
      }
    }
  } catch (error) {
    console.error("Account sync error:", error);
    throw error;
  }
}
