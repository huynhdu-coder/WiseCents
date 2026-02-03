import express from "express";
import {
  createLinkToken,
  exchangePublicToken,

} from "../controllers/plaidController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/create_link_token", auth, createLinkToken);
router.post("/exchange_public_token", auth, exchangePublicToken);


export default router;
