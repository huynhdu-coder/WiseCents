import prisma from "../config/prisma.js";

export const requireActiveSubscription = async (req, res, next) => {
  try {
    const user = await prisma.users.findUnique({
      where: { user_id: req.userId },
      select: { subscription_status: true }
    });

    if (user.subscription_status === "expired") {
      return res.status(403).json({
        error: "Subscription required"
      });
    }

    next();
  } catch (err) {
    res.status(500).json({ error: "Subscription check failed" });
  }
};