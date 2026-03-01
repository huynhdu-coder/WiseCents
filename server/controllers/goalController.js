import prisma from "../config/prisma.js";

//Create Goal
export async function createGoal(req, res) {
  try {
    const { name, target_amount, deadline, funding_account_id } = req.body;

    if (!name || !target_amount) {
      return res.status(400).json({ error: "Name and target required" });
    }

    const goal = await prisma.goals.create({
      data: {
        user_id: req.userId,
        name,
        target_amount: Number(target_amount),
        current_amount: 0,
        deadline: deadline ? new Date(deadline) : null,
        funding_account_id: funding_account_id
          ? parseInt(funding_account_id)
          : null,
      },
    });

    res.status(201).json(goal);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create goal" });
  }
}


//Get All Goals (with progress %)

export async function getGoals(req, res) {
  try {
    const goals = await prisma.goals.findMany({
      where: { user_id: req.userId },
      include: {
        bank_accounts: true,
      },
    });

    const formatted = goals.map(goal => {
      const target = Number(goal.target_amount || 0);
      const current = Number(goal.current_amount || 0);

      const progress =
        target > 0 ? (current / target) * 100 : 0;

      return {
        ...goal,
        progress_percentage: Math.min(progress, 100),
      };
    });

    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch goals" });
  }
}


// Add Money To Goal
export async function addMoneyToGoal(req, res) {
  try {
    const amount = Number(req.body.amount);
    const goalId = Number(req.params.id);
    const userId = req.userId;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    const result = await prisma.$transaction(async (tx) => {

      // Ownership enforced
      const goal = await tx.goals.findFirst({
        where: {
          goal_id: goalId,
          user_id: userId,
        },
      });

      if (!goal) throw new Error("Goal not found");

      if (!goal.funding_account_id)
        throw new Error("No funding account linked");

      const account = await tx.bank_accounts.findFirst({
        where: {
          account_id: goal.funding_account_id,
          user_id: userId,
        },
      });

      if (!account) throw new Error("Account not found");

      if (Number(account.current_balance) < amount)
        throw new Error("Insufficient funds");

      // Update goal
      await tx.goals.update({
        where: { goal_id: goalId },
        data: {
          current_amount:
            Number(goal.current_amount || 0) + amount,
        },
      });

      // Update account balance
      await tx.bank_accounts.update({
        where: { account_id: account.account_id },
        data: {
          current_balance:
            Number(account.current_balance) - amount,
        },
      });

      // Record contribution
      await tx.goal_contributions.create({
        data: {
          goal_id: goalId,
          account_id: account.account_id,
          amount: amount,
        },
      });

      return { success: true };
    });

    res.json(result);

  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
}

//Get Contribution History
export async function getGoalContributions(req, res) {
  try {
    const goalId = Number(req.params.id);

    const contributions = await prisma.goal_contributions.findMany({
      where: {
        goal_id: goalId,
        goals: {
          user_id: req.userId,
        },
      },
      orderBy: { created_at: "desc" },
    });

    res.json(contributions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch contributions" });
  }
}


/**
 * Delete Goal
 */
export async function deleteGoal(req, res) {
  try {
    await prisma.goals.deleteMany({
      where: {
        goal_id: Number(req.params.id),
        user_id: req.userId,
      },
    });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete goal" });
  }
}
