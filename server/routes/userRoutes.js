import express from "express";
import { getProfile } from "../controllers/userController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/profile", auth, getProfile);

export default router;