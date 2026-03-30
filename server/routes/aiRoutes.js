import express from "express";
import auth from "../middleware/auth.js";
import OpenAI from "openai";
import prisma from "../config/prisma.js";
import { buildTransactionDigest } from "../utils/aiDigest.js";

const router = express.Router();

// Azure openai endpoint
const openai = new OpenAI({
  apiKey: process.env.AZURE_OPENAI_API_KEY,
  baseURL: `${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT}`,
  defaultQuery: { "api-version": "2024-02-15-preview" },
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

    // Get user preferences
    const user = await prisma.users.findUnique({
      where: { user_id: userId },
      select: {
        advice_style: true,
        change_tolerance: true,
        primary_intent: true,
        ai_data_consent: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    let digestText = "User has opted out of transaction analysis.";

    // Respect AI consent switch
    const consent = String(user.ai_data_consent || "").toLowerCase();
    const hasConsent = consent === "true" || consent === "opt-in" || consent === "yes";

    if (hasConsent) {
      const transactions = await prisma.transactions.findMany({
        where: { user_id: userId },
        select: {
          category_primary: true,
          amount: true,
          date: true
        },
        orderBy: { date: "desc" },
        take: 25
      });

      const digest = buildTransactionDigest(transactions);
      digestText = digest.summaryText;
    }

    // Build System Prompt
    const systemPrompt = `
    You are WiseCents, a financial assistant for college students.

    You are given:
    1. the user's financial preferences
    2. a summarized transaction digest when the user has consented

    Use that information directly when answering.
    Do not say you lack access to the user's financial data if a digest is provided.

    User preferences:
    - Advice style: ${user.advice_style}
    - Change tolerance: ${user.change_tolerance}
    - Primary intent: ${user.primary_intent}

    Response rules:
    - Be concise and practical
    - Use short paragraphs if the user is asking for advice, otherwise, use concise responses
    - You can use bullets when giving advice or breakdowns
    - Avoid long walls of text at all possible, the point is to be human readable while providing the most information
    - Use Markdown formatting when helpful
    - If there are no recent transactions, say that clearly and briefly
    - If asked about something outside financial data or outside available app context, say so clearly instead of guessing
    - Do not invent live data, weather, news, or account details that were not provided.
    - Please keep responses concise with minimal introductions or conclusions if at all.
    - If you do not know, use the information you have and don't let the person know if you cannot answer.
    `;

    // Call OpenAI
    const completion = await openai.chat.completions.create({
      model: process.env.AZURE_OPENAI_DEPLOYMENT,
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "assistant",
          content: `Sanitized Transaction Summary:\n${digestText}`
        },
        { role: "user", content: message }
      ],
      temperature: 0.5
    });

    return res.json({
      reply: completion.choices[0].message.content
    });

  } catch (err) {
    console.error("AI CHAT ERROR:", err);
    return res.status(500).json({ error: "AI chat failed" });
  }
});

export default router;