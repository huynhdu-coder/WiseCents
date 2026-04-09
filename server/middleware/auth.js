import jwt from "jsonwebtoken";
import prisma from "../config/prisma.js";
import User from "../models/User.js";

const auth = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    req.userId = user.user_id;

    const dbUser = await prisma.users.findUnique({
      where: { user_id: req.userId },
      select: {
        subscription_status: true,
        trial_end: true,
      },
    });

    if (dbUser?.subscription_status === "trial") {
      const now = new Date();

      if (dbUser.trial_end && now > dbUser.trial_end) {
        await prisma.users.update({
          where: { user_id: req.userId },
          data: { subscription_status: "expired" },
        });
      }
    }

    next();
  } catch (error) {
    console.error("AUTH ERROR:", error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default auth;