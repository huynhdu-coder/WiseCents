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
    if (String(user.ai_data_consent).toLowerCase() === "true") {
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
    You are WiseCents, a financial assistant.

    You DO have access to the user's summarized financial data.
    It is provided below.
    Use it when answering questions.

    User preferences:
    - Advice Style: ${user.advice_style}
    - Change Tolerance: ${user.change_tolerance}
    - Primary Intent: ${user.primary_intent}

    If transaction summary says "No recent transactions available",
    state that clearly.

    Respond in short paragraphs or bullet points and you can line breaks.
    Be structured and readable.
    Never say you don't have access to their data.
    Format responses with:
    - Clear headings, if there is a main header ensure it is Bold or has a line break after to identify the header.
    - Bullet points when giving advice.
    - Short paragraphs or sentences.
    - Avoid long blocks of text.
    Respond using Markdown formatting if best suited.
    Please keep responses concise with minimal introductions or conclusions if at all.
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