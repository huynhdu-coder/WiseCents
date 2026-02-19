import express from "express";
import auth from "../middleware/auth.js";
import { getSpendingByCategory,getMonthlyReport } from "../controllers/reportController.js";

const router = express.Router();

router.get("/spending-by-category", auth, getSpendingByCategory);
router.get("/monthly-report", auth, getMonthlyReport);

export default router;
