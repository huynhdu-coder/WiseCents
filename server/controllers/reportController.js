import prisma from "../config/prisma.js";

export const getMonthlyReport = async (req, res) => {
  try {
    const userId = req.userId;

    const result = await prisma.$queryRaw`
      WITH months AS (
        SELECT 
          TO_CHAR(date_trunc('month', CURRENT_DATE) - 
          INTERVAL '1 month' * generate_series(0, 11), 
          'YYYY-MM') AS month
      )

      SELECT 
        m.month,
        COALESCE(SUM(CASE WHEN t.amount > 0 THEN t.amount ELSE 0 END), 0) AS expenses,
        COALESCE(SUM(CASE WHEN t.amount < 0 THEN ABS(t.amount) ELSE 0 END), 0) AS income,
        COALESCE(SUM(t.amount), 0) AS net

      FROM months m
      LEFT JOIN transactions t
        ON TO_CHAR(t.date, 'YYYY-MM') = m.month
        AND t.user_id = ${userId}

      LEFT JOIN bank_accounts b
        ON t.account_id = b.account_id
        AND b.is_hidden = false

      GROUP BY m.month
      ORDER BY m.month ASC
    `;

    const formatted = result.map(row => ({
      month: row.month,
      income: Number(row.income),
      expenses: Number(row.expenses),
      net: Number(row.net),
    }));

    res.json(formatted);

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
