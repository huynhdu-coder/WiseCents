import express from "express";
import { register, login } from "../controllers/authController.js";
import {
  requestPasswordReset,
  verifyResetCode,
  resetPassword,
} from "../controllers/passwordResetController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.post("/forgot-password", requestPasswordReset);
router.post("/verify-reset-code", verifyResetCode);
router.post("/reset-password", resetPassword);

export default router;
