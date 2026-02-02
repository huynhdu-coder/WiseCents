import express from "express";
import auth from "../middleware/auth.js";
import { getMonthlyReport } from "../controllers/reportController.js";

const router = express.Router();

router.get("/monthly", auth, getMonthlyReport);

export default router;
