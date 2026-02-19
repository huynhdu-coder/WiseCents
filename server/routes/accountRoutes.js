import express from "express";
import auth from "../middleware/auth.js";
import {
  getAccounts,
  renameAccount,
  deleteAccount,
  hideAccount
} from "../controllers/accountController.js";

const router = express.Router();

router.get("/", auth, getAccounts);
router.delete("/:id/delete", auth, deleteAccount);
router.patch("/:id", auth, renameAccount);
router.patch("/:id/hide", auth, hideAccount);

export default router;
