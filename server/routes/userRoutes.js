import express from "express";
import { getProfile, updatePreferences } from "../controllers/userController.js"; 
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/profile", auth, getProfile);
router.put("/preferences", auth, updatePreferences); 

export default router;