import express from "express";
import {
  createLinkToken,
  exchangePublicToken,
  getTransactions,
} from "../controllers/plaidController.js";

const router = express.Router();

router.post("/create_link_token", createLinkToken);
router.post("/exchange_public_token", exchangePublicToken);
router.get("/transactions", getTransactions);

export default router;
