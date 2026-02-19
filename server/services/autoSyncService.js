import cron from "node-cron";
import prisma from "../config/prisma.js";
import { syncAccounts, syncTransactions } from "./plaidSyncService.js";

export const startWeeklySync = () => {

  // Every Sunday at 2 AM
  cron.schedule("0 2 * * 0", async () => {
    console.log("Weekly auto sync started...");

    try {
      const users = await prisma.users.findMany({
        select: { user_id: true },
      });

      for (const user of users) {
        await syncAccounts(user.user_id);
        await syncTransactions(user.user_id);
      }

      console.log("Weekly auto sync completed");

    } catch (error) {
      console.error("Weekly sync failed:", error);
    }
  });

};
