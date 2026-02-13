import express from "express";
import auth from "../middleware/auth.js";
import OpenAI from "openai";
import prisma from "../config/prisma.js";

const router = express.Router();

// azure openai
const openai = new OpenAI({
  apiKey: process.env.AZURE_OPENAI_API_KEY,
  baseURL: `${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT}`,
  defaultQuery: { "api-version": "2024-02-15-preview" }
});

router.get("/test", async (_req, res) => {
  try {
    const userCount = await prisma.users.count();
    res.json({ ok: true, userCount });
  } catch (err) {
    console.error("PRISMA TEST ERROR:", err);
    res.status(500).json({ ok: false, error: String(err?.message || err) });
  }
});

router.post("/chat", auth, async (req, res) => {
  try {
    const userId = req.userId;
    const { message } = req.body;

    // fetch recent transactions
    const tx = await prisma.transactions.findMany({
      where: { user_id: userId },
      select: { category: true, amount: true },
      orderBy: { date: "desc" },
      take: 25
    });

    // basic data summarization
    const summary = tx
      .map(t => `${t.category}: $${t.amount}`)
      .join("\n");

    // ai prompt 
    const completion = await openai.chat.completions.create({
      model: process.env.AZURE_OPENAI_DEPLOYMENT,
      messages: [
        { role: "system", content: "You are WiseCents, a helpful financial assistant for college students." },
        { role: "assistant", content: `Recent transactions:\n${Summary}` },
        { role: "user", content: message }
      ]
    });

    res.json({ reply: completion.choices[0].message.content });
    
  } catch (err) {
    console.error("AI CHAT ERROR:", err);
    res.status(500).json({ error: "AI chat failed" });
  }
});

export default router;