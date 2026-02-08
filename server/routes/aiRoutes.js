import express from "express";
import auth from "../middleware/auth.js";
import db from "../config/database.js";
import OpenAI from "openai";

const router = express.Router();

// azure openai
const openai = new OpenAI({
  apiKey: process.env.AZURE_OPENAI_API_KEY,
  baseURL: `${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT}`,
  defaultQuery: { "api-version": "2024-02-15-preview" }
});

router.post("/chat", auth, async (req, res) => {
  try {
    const userId = req.userId;
    const { message } = req.body;

    // fetch recent transactions
    const txResult = await db.query(
      `SELECT category, amount, date
       FROM transactions
       WHERE user_id = $1
       ORDER BY date DESC
       LIMIT 25`,
      [userId]
    );

    // basic data summarization
    const txSummary = txResult.rows
      .map(t => `${t.category}: $${t.amount}`)
      .join("\n");

    // ai prompt 
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are WiseCents, a helpful financial assistant for college students."
        },
        {
          role: "assistant",
          content: `Recent transactions:\n${txSummary}`
        },
        {
          role: "user",
          content: message
        }
      ]
    });

    res.json({
      reply: completion.choices[0].message.content
    });
  } catch (err) {
    console.error("AI CHAT ERROR:", err);
    res.status(500).json({ error: "AI chat failed" });
  }
});

export default router;