import express from "express";
import auth from "../middleware/auth.js";
import { getSpendingByCategory,getMonthlyReport, getFilteredTransactions, getFinancialAudit } from "../controllers/reportController.js";

const router = express.Router();

router.get("/spending-by-category", auth, getSpendingByCategory);
router.get("/monthly-report", auth, getMonthlyReport);
router.get("/transactions", auth, getFilteredTransactions);
router.get("/financial-audit", auth, getFinancialAudit);

export default router;
