import prisma from "../config/prisma.js";

export async function checkAndCreateAlerts(userId) {
  const user = await prisma.users.findUnique({
    where: { user_id: userId },
    select: {
      notif_budget_alerts: true,
      notif_goal_alerts: true,
      notif_budget_threshold: true,
    },
  });

  if (!user) return [];
  const newAlerts = [];

  if (user.notif_budget_alerts) {
    const threshold = Number(user.notif_budget_threshold ?? 80);
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    // Total spending this month (positive amounts = expenses)
    const txAgg = await prisma.transactions.aggregate({
      where: {
        user_id: userId,
        amount: { gt: 0 },
        date: { gte: monthStart },
        bank_accounts: { is_hidden: false },
      },
      _sum: { amount: true },
    });

    const spentThisMonth = Number(txAgg._sum.amount ?? 0);

    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    const lastAgg = await prisma.transactions.aggregate({
      where: {
        user_id: userId,
        amount: { gt: 0 },
        date: { gte: lastMonthStart, lte: lastMonthEnd },
        bank_accounts: { is_hidden: false },
      },
      _sum: { amount: true },
    });

    const lastMonthTotal = Number(lastAgg._sum.amount ?? 0);

    if (lastMonthTotal > 0) {
      const pct = (spentThisMonth / lastMonthTotal) * 100;

      if (pct >= 100) {
        const existing = await prisma.spending_alerts.findFirst({
          where: {
            user_id: userId,
            type: "budget_exceeded",
            created_at: { gte: monthStart },
          },
        });
        if (!existing) {
          const alert = await prisma.spending_alerts.create({
            data: {
              user_id: userId,
              type: "budget_exceeded",
              title: "Monthly Budget Exceeded 🚨",
              message: `You've spent $${spentThisMonth.toFixed(2)} this month — ${Math.round(pct)}% of last month's $${lastMonthTotal.toFixed(2)}. Consider reviewing your spending.`,
            },
          });
          newAlerts.push(alert);
        }
      } else if (pct >= threshold) {
        const existing = await prisma.spending_alerts.findFirst({
          where: {
            user_id: userId,
            type: "budget_warning",
            created_at: { gte: monthStart },
          },
        });
        if (!existing) {
          const alert = await prisma.spending_alerts.create({
            data: {
              user_id: userId,
              type: "budget_warning",
              title: `Budget Alert: ${Math.round(pct)}% Used ⚠️`,
              message: `You've spent $${spentThisMonth.toFixed(2)} this month — ${Math.round(pct)}% of last month's total ($${lastMonthTotal.toFixed(2)}). You set an alert at ${threshold}%.`,
            },
          });
          newAlerts.push(alert);
        }
      }
    }

    const catThis = await prisma.transactions.groupBy({
      by: ["category_primary"],
      where: {
        user_id: userId,
        amount: { gt: 0 },
        date: { gte: monthStart },
        bank_accounts: { is_hidden: false },
      },
      _sum: { amount: true },
    });

    const catLast = await prisma.transactions.groupBy({
      by: ["category_primary"],
      where: {
        user_id: userId,
        amount: { gt: 0 },
        date: { gte: lastMonthStart, lte: lastMonthEnd },
        bank_accounts: { is_hidden: false },
      },
      _sum: { amount: true },
    });

    const lastByCat = Object.fromEntries(
      catLast.map((c) => [c.category_primary, Number(c._sum.amount)])
    );

    for (const cat of catThis) {
      const catName = cat.category_primary || "Uncategorized";
      const thisAmt = Number(cat._sum.amount);
      const lastAmt = lastByCat[cat.category_primary] ?? 0;
      if (lastAmt > 0) {
        const catPct = (thisAmt / lastAmt) * 100;
        if (catPct >= threshold) {
          const existing = await prisma.spending_alerts.findFirst({
            where: {
              user_id: userId,
              type: "budget_warning",
              title: { contains: catName },
              created_at: { gte: monthStart },
            },
          });
          if (!existing) {
            const alert = await prisma.spending_alerts.create({
              data: {
                user_id: userId,
                type: "budget_warning",
                title: `${catName}: ${Math.round(catPct)}% of Last Month ⚠️`,
                message: `You've spent $${thisAmt.toFixed(2)} on ${catName} this month, which is ${Math.round(catPct)}% of what you spent last month ($${lastAmt.toFixed(2)}).`,
              },
            });
            newAlerts.push(alert);
          }
        }
      }
    }
  }

  if (user.notif_goal_alerts) {
    const goals = await prisma.goals.findMany({
      where: { user_id: userId },
    });

    for (const goal of goals) {
      const target = Number(goal.target_amount ?? 0);
      const current = Number(goal.current_amount ?? 0);
      if (target <= 0) continue;

      const pct = (current / target) * 100;

      // Milestones: 25%, 50%, 75%, 100%
      for (const milestone of [25, 50, 75, 100]) {
        if (pct >= milestone) {
          const type = milestone === 100 ? "goal_completed" : "goal_milestone";
          const existing = await prisma.spending_alerts.findFirst({
            where: {
              user_id: userId,
              type,
              title: { contains: goal.name },
              message: { contains: `${milestone}%` },
            },
          });
          if (!existing) {
            const alert = await prisma.spending_alerts.create({
              data: {
                user_id: userId,
                type,
                title:
                  milestone === 100
                    ? `Goal Completed: ${goal.name} 🎉`
                    : `Goal Milestone: ${goal.name} — ${milestone}% reached`,
                message:
                  milestone === 100
                    ? `Congratulations! You've fully funded "${goal.name}" ($${current.toFixed(2)} of $${target.toFixed(2)}).`
                    : `You're ${milestone}% of the way to your "${goal.name}" goal ($${current.toFixed(2)} of $${target.toFixed(2)}).`,
              },
            });
            newAlerts.push(alert);
          }
        }
      }

      if (goal.deadline && pct < 75) {
        const daysLeft = Math.ceil(
          (new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24)
        );
        if (daysLeft > 0 && daysLeft <= 7) {
          const existing = await prisma.spending_alerts.findFirst({
            where: {
              user_id: userId,
              type: "goal_milestone",
              title: { contains: "deadline" },
              message: { contains: goal.name },
              created_at: {
                gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
              },
            },
          });
          if (!existing) {
            const alert = await prisma.spending_alerts.create({
              data: {
                user_id: userId,
                type: "goal_milestone",
                title: `Goal deadline approaching: ${goal.name} ⏰`,
                message: `Your goal "${goal.name}" is due in ${daysLeft} day${daysLeft !== 1 ? "s" : ""} and you're at ${Math.round(pct)}% ($${current.toFixed(2)} of $${target.toFixed(2)}).`,
              },
            });
            newAlerts.push(alert);
          }
        }
      }
    }
  }

  return newAlerts;
}

export async function checkAllUsers() {
  const users = await prisma.users.findMany({
    where: {
      OR: [
        { notif_budget_alerts: true },
        { notif_goal_alerts: true },
      ],
    },
    select: { user_id: true },
  });

  const results = {};
  for (const { user_id } of users) {
    results[user_id] = await checkAndCreateAlerts(user_id);
  }
  return results;
}
