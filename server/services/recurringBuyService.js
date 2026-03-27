import { runRecurringBuysInternal } from "../controllers/investmentController.js";

export async function runRecurringBuys() {
  await runRecurringBuysInternal();
}