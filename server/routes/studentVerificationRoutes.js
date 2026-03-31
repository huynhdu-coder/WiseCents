import express from "express";
import auth from "../middleware/auth.js";
import {
  requestStudentVerification,
  confirmStudentVerification,
  getStudentVerificationStatus,
} from "../controllers/studentVerificationController.js";

const router = express.Router();

router.post("/request", auth, requestStudentVerification);
router.post("/confirm", auth, confirmStudentVerification);
router.get("/status", auth, getStudentVerificationStatus);

export default router;