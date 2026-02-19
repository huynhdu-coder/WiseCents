import prisma from "../config/prisma.js";

export const deleteAccount = async (req, res) => {
  try {
    const userId = req.userId;
    const accountId = parseInt(req.params.id);

    const result = await prisma.bank_accounts.updateMany({
      where: {
        account_id: accountId,
        user_id: userId,
      },
      data: {
        is_hidden: true,
      },
    });

    if (!result.count) {
      return res.status(404).json({ error: "Account not found" });
    }

    res.json({ message: "Account hidden successfully" });

  } catch (error) {
    console.error("Hide account error:", error);
    res.status(500).json({ error: "Failed to hide account" });
  }
};

// Get all accounts for user
export const getAccounts = async (req, res) => {
  try {
    const userId = req.userId;

    const accounts = await prisma.bank_accounts.findMany({
      where: {
          user_id: userId,
          is_hidden: false,
      },
      select: {
        account_id: true,
        name: true,
        nickname: true,
        type: true,
        subtype: true,
        current_balance: true,
        available_balance: true,
        is_hidden: true,
      },
      orderBy: {
        created_at: "asc",
      },
    });

    res.json(accounts);
  } catch (error) {
    console.error("Get accounts error:", error);
    res.status(500).json({ error: "Failed to fetch accounts" });
  }
};

// Rename an account
export const renameAccount = async (req, res) => {
  try {
    const userId = req.userId;
    const accountId = parseInt(req.params.id);
    const { nickname } = req.body;

    const result = await prisma.bank_accounts.updateMany({
      where: {
        account_id: accountId,
        user_id: userId,
      },
      data: { nickname },
    });

    if (!result.count) {
      return res.status(404).json({ error: "Account not found" });
    }

    res.json({ success: true });

  } catch (error) {
    console.error("Rename account error:", error);
    res.status(500).json({ error: "Failed to rename account" });
  }
};

export const hideAccount = async (req, res) => {
  try {
    const userId = req.userId;
    const accountId = parseInt(req.params.id);
    const { is_hidden } = req.body;

    const result = await prisma.bank_accounts.updateMany({
      where: {
        account_id: accountId,
        user_id: userId,
      },
      data: { is_hidden },
    });

    if (!result.count) {
      return res.status(404).json({ error: "Account not found" });
    }

    res.json({ success: true });

  } catch (error) {
    console.error("Hide account error:", error);
    res.status(500).json({ error: "Failed to update account" });
  }
};


