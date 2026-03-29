import express from "express";
import auth from "../middleware/auth.js";
import {
  getNotificationSettings,
  updateNotificationSettings,
  getAlerts,
  markAlertRead,
  markAllRead,
} from "../controllers/notificationController.js";

const router = express.Router();

router.get("/settings", auth, getNotificationSettings);
router.put("/settings", auth, updateNotificationSettings);
router.get("/", auth, getAlerts);
router.put("/read-all", auth, markAllRead);
router.put("/:id/read", auth, markAlertRead);

export default router;
