import prisma from "../config/prisma.js";
import { syncTransactions, syncAccounts } from "../services/plaidSyncService.js";

export const handlePlaidWebhook = async (req, res) => {
  try {
    const { webhook_type, webhook_code, item_id } = req.body;


    if (
      webhook_type === "TRANSACTIONS" &&
      webhook_code === "SYNC_UPDATES_AVAILABLE"
    ) {
      const item = await prisma.plaid_items.findFirst({
        where: { plaid_item_id: item_id },
        select: { user_id: true },
      });

      if (item) {
        await syncAccounts(item.user_id);
        await syncTransactions(item.user_id);
      }
    }

    res.sendStatus(200);

  } catch (error) {
    console.error("Webhook error:", error);
    res.sendStatus(500);
  }
};
