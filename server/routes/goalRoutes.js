import express from "express";
import auth from "../middleware/auth.js";
import {
  createGoal,
  getGoals,
  addMoneyToGoal,
  getGoalContributions,
  deleteGoal,
} from "../controllers/goalController.js";

const router = express.Router();

router.post("/", auth, createGoal);
router.get("/", auth, getGoals);
router.post("/:id/add", auth, addMoneyToGoal);
router.get("/:id/contributions", auth, getGoalContributions);
router.delete("/:id", auth, deleteGoal);

export default router;
