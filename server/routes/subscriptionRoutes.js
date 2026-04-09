import express from "express";
import auth from "../middleware/auth.js";
import {
  getSubscription,
  verifyStudentEmail,
  activateStudentPlan,
  activateStandardPlan,
  cancelToFree,
} from "../controllers/subscriptionController.js";

const router = express.Router();

router.get("/", auth, getSubscription);
router.post("/verify-student-email", auth, verifyStudentEmail);
router.post("/activate-student-plan", auth, activateStudentPlan);
router.post("/activate-standard-plan", auth, activateStandardPlan);
router.post("/cancel-to-free", auth, cancelToFree);

export default router;