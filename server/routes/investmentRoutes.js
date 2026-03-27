import express from "express";
import auth from "../middleware/auth.js";
import {
  ensurePaperAccount,
  getQuote,
  transferFromChecking,
  buyStock,
  sellStock,
  getPortfolio,
  createRecurringBuy,
} from "../controllers/investmentController.js";

const router = express.Router();

router.post("/paper-account", auth, ensurePaperAccount);
router.get("/quote/:symbol", auth, getQuote);
router.post("/transfer", auth, transferFromChecking);
router.post("/buy", auth, buyStock);
router.post("/sell", auth, sellStock);
router.get("/portfolio", auth, getPortfolio);
router.post("/recurring-buys", auth, createRecurringBuy);

export default router;