import express from "express";
import { getProfile, updatePreferences, updateConsent } from "../controllers/userController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/profile", auth, getProfile);
router.put("/preferences", auth, updatePreferences);
router.put("/consent", auth, updateConsent);

export default router;