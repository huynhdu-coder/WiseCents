import express from "express";
import auth from "../middleware/auth.js";
import prisma from "../config/prisma.js";
import OpenAI from "openai";

const router = express.Router();

// Azure OpenAI client
const openai = new OpenAI({
  apiKey: process.env.AZURE_OPENAI_API_KEY,
  baseURL: `${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT}`,
  defaultQuery: { "api-version": "2024-02-15-preview" },
});

router.post("/chat", auth, async (req, res) => {
  try {
    const userId = req.userId;
    const { message } = req.body;

    // Fetch recent transactions (Prisma 7)
    const transactions = await prisma.transactions.findMany({
      where: {
        user_id: userId,
      },
      select: {
        category_primary: true,
        category_detailed: true,
        amount: true,
        date: true,
      },
      orderBy: {
        date: "desc",
      },
      take: 25,
    });

    // Summarize for AI (safe + schema-accurate)
    const txSummary = transactions
      .map(t => {
        const category =
          t.category_detailed ||
          t.category_primary ||
          "Uncategorized";
        return `${category}: $${t.amount}`;
      })
      .join("\n");

    // AI prompt
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are WiseCents, a helpful financial assistant for college students.",
        },
        {
          role: "assistant",
          content: `Recent transactions:\n${txSummary}`,
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    res.json({
      reply: completion.choices[0].message.content,
    });
  } catch (err) {
    console.error("AI CHAT ERROR:", err);
    res.status(500).json({ error: "AI chat failed" });
  }
});

export default router;