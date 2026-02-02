import express from "express";
import auth from "../middleware/auth.js";
import { getTransactions } from "../controllers/transactionController.js";

const router = express.Router();

router.get("/", auth, getTransactions);

export default router;
