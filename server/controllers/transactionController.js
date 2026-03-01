import prisma from "../config/prisma.js";

export const getTransactions = async (req, res) => {
  try {
    const userId = req.userId;

    const transactions = await prisma.transactions.findMany({
      where: {
        user_id: userId,
        bank_accounts: {
          is_hidden: false,
        },
      },
      orderBy: {
        date: "desc",
      },
      take: 100,
      include: {
        bank_accounts: {
          select: {
            name: true,
            subtype: true,
          },
        },
      },
    });

    const formatted = transactions.map((tx) => ({
      transaction_id: tx.id, 
      name: tx.name,
      amount: Number(tx.amount), 
      category: tx.category_primary || "Uncategorized",
      date: tx.date,
      account_name: tx.bank_accounts?.name,
      account_subtype: tx.bank_accounts?.subtype,
    }));

    res.json(formatted);

  } catch (err) {
    console.error("GET TRANSACTIONS ERROR:", err);
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
};