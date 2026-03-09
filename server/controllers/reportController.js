import prisma from "../config/prisma.js";

export const getMonthlyReport = async (req, res) => {
  try {
    const userId = req.userId;

    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 11);
    startDate.setDate(1);

    const transactions = await prisma.transactions.findMany({
      where: {
        user_id: userId,
        date: {
          gte: startDate,
        },
        bank_accounts: {
          is_hidden: false,
        },
      },
      select: {
        amount: true,
        date: true,
      },
    });

    const monthly = {};

    // initialize last 12 months
    for (let i = 11; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);

      const key = d.toISOString().slice(0, 7);

      monthly[key] = {
        income: 0,
        expenses: 0,
        net: 0,
      };
    }

    transactions.forEach(t => {
      const month = new Date(t.date).toISOString().slice(0, 7);

      if (!monthly[month]) return;

      const amount = Number(t.amount);

      if (amount > 0) {
        monthly[month].expenses += amount;
      } else {
        monthly[month].income += Math.abs(amount);
      }

      monthly[month].net += -amount; 
    });

    res.json(monthly);

  } catch (error) {
    console.error("Monthly trend error:", error);
    res.status(500).json({ error: "Failed to fetch monthly data" });
  }
};



export const getSpendingByCategory = async (req, res) => {
  try {
    const userId = req.userId;

    const data = await prisma.transactions.groupBy({
      by: ["category_primary"],
      where: {
        user_id: userId,
        amount: { gt: 0 }, // spending only
        bank_accounts: {
          is_hidden: false,
        },
      },
      _sum: {
        amount: true,
      },
    });

    const formatted = data.map(item => ({
      category: item.category_primary || "Uncategorized",
      total: Number(item._sum.amount || 0),
    }));

    res.json(formatted);

  } catch (error) {
    console.error("Spending by category error:", error);
    res.status(500).json({ error: "Failed to fetch category data" });
  }
};

export const getFilteredTransactions = async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;

  const skip = (page - 1) * limit;

  try {
    const userId = req.userId;
    const { dateRange = "90", account = "all", category = "all" } = req.query;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - Number(dateRange));

    const where = {
      user_id: userId,
      date: {
        gte: startDate
      },
      bank_accounts: {
        is_hidden: false
      }
    };

    if (category !== "all") {
      where.category_primary = category;
    }

    if (account !== "all") {
      where.bank_accounts = {
        ...where.bank_accounts,
        subtype: account
      };
    }


    const total = await prisma.transactions.count({
      where
    });

    const transactions = await prisma.transactions.findMany({
      where,
      orderBy: { date: "desc" },
      skip,
      take: limit,
      include: {
        bank_accounts: true
      }
    });

    const formatted = transactions.map(t => ({
      transaction_id: t.transaction_id,
      name: t.name,
      amount: Number(t.amount),
      date: t.date,
      account_name: t.bank_accounts?.name,
      category: t.category_primary
    }));

    res.json({
      transactions: formatted,
      page,
      totalPages: Math.ceil(total / limit),
      total
    });

  } catch (error) {
    console.error("Filtered transactions error:", error);
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
};

export const getFinancialAudit = async (req, res) => {
  const { dateRange = "90", account = "all", category = "all" } = req.query;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - Number(dateRange));
  
  try {
    const userId = req.userId;
    
    const where = {
      user_id: userId,
      date: {
        gte: startDate
      },
      bank_accounts: {
        is_hidden: false
      }
    };

    if (category !== "all") {
      where.category_primary = category;
    }

    if (account !== "all") {
      where.bank_accounts = {
        ...where.bank_accounts,
        subtype: account
      };
    }

    const transactions = await prisma.transactions.findMany({
      where,
      select: {
        amount: true,
        category_primary: true
      }
    });

    let income = 0;
    let expenses = 0;
    let housing = 0;

    const categoryTotals = {};
    const recurring = {};

    transactions.forEach(t => {
      const amount = Number(t.amount);
      const category = t.category_primary || "Other";

      // Plaid format: income negative, expenses positive
      if (amount < 0) {
        income += Math.abs(amount);
      } else {
        expenses += amount;

        categoryTotals[category] =
          (categoryTotals[category] || 0) + amount;
      }

      if (category === "Home") {
        housing += Math.abs(amount);
      }

      recurring[category] = (recurring[category] || 0) + 1;
    });

    const savingsRate =
      income > 0 ? (income - expenses) / income : 0;

    const spendingRatio =
      income > 0 ? expenses / income : 0;

    const housingRatio =
      income > 0 ? housing / income : 0;

    const emergencyFundMonths =
      expenses > 0 ? income / expenses : 0;

    const monthlyCashFlow = income - expenses;

    const topCategory = Object.entries(categoryTotals)
      .sort((a, b) => b[1] - a[1])[0];

    const subscriptionCount =
      Object.values(recurring).filter(v => v > 10).length;

    let score = 0;

    if (savingsRate >= 0.2) score += 20;
    if (spendingRatio <= 0.8) score += 20;
    if (housingRatio <= 0.3) score += 20;
    if (emergencyFundMonths >= 3) score += 20;
    if (subscriptionCount <= 5) score += 20;

    res.json({
      savingsRate,
      spendingRatio,
      housingRatio,
      emergencyFundMonths,
      monthlyCashFlow,
      topCategory: topCategory?.[0] || "N/A",
      topCategoryAmount: topCategory?.[1] || 0,
      subscriptionCount,
      score
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Audit failed" });
  }
};