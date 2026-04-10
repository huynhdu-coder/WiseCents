import express from "express";
import auth from "../middleware/auth.js";
import OpenAI from "openai";
import prisma from "../config/prisma.js";
import { buildAIContext } from "../utils/aiDigest.js";

const router = express.Router();

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

    if (!message || !message.trim()) {
      return res.status(400).json({ error: "Message is required" });
    }

    const user = await prisma.users.findUnique({
      where: { user_id: userId },
      select: {
        user_id: true,
        first_name: true,
        last_name: true,
        email: true,
        advice_style: true,
        change_tolerance: true,
        primary_intent: true,
        ai_data_consent: true,
        subscription_type: true,
        subscription_status: true,
        trial_start: true,
        trial_end: true,
        student_verified: true,
        student_discount_active: true,
        student_email: true,
        student_verified_at: true,
        student_discount_percent: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const consent = String(user.ai_data_consent || "").toLowerCase();
    const hasConsent =
      consent === "true" || consent === "opt-in" || consent === "yes";

    let appContext = {
      consentGranted: false,
      profile: {
        firstName: user.first_name ?? null,
        adviceStyle: user.advice_style ?? null,
        changeTolerance: user.change_tolerance ?? null,
        primaryIntent: user.primary_intent ?? null,
      },
      subscription: {
        subscriptionType: user.subscription_type ?? "free",
        subscriptionStatus: user.subscription_status ?? "trial",
        trialStart: user.trial_start ?? null,
        trialEnd: user.trial_end ?? null,
        studentVerified: Boolean(user.student_verified),
        studentDiscountActive: Boolean(user.student_discount_active),
      },
      note: "User has not consented to AI financial data analysis.",
    };

    if (hasConsent) {
      const [
        accounts,
        goals,
        transactions,
        paperAccount,
        paperPositions,
        paperOrders,
        portfolioSnapshots,
        investmentTransfers,
        recurringBuys,
      ] = await Promise.all([
        prisma.bank_accounts.findMany({
          where: { user_id: userId },
          select: {
            account_id: true,
            name: true,
            official_name: true,
            type: true,
            subtype: true,
            current_balance: true,
            available_balance: true,
            nickname: true,
            is_hidden: true,
            created_at: true,
          },
          orderBy: { created_at: "desc" },
        }),

        prisma.goals.findMany({
          where: { user_id: userId },
          select: {
            goal_id: true,
            name: true,
            target_amount: true,
            current_amount: true,
            deadline: true,
            funding_account_id: true,
            recurring_amount: true,
            recurring_frequency: true,
            last_recurring_date: true,
          },
          orderBy: { deadline: "asc" },
        }),

        prisma.transactions.findMany({
          where: { user_id: userId },
          select: {
            transaction_id: true,
            name: true,
            amount: true,
            date: true,
            category_primary: true,
            category_detailed: true,
            account_id: true,
            bank_accounts: {
              select: {
                name: true,
                official_name: true,
                nickname: true,
              },
            },
          },
          orderBy: { date: "desc" },
          take: 100,
        }),

        prisma.paper_accounts.findUnique({
          where: { user_id: userId },
          select: {
            paper_account_id: true,
            cash_balance: true,
            starting_balance: true,
            created_at: true,
            updated_at: true,
          },
        }),

        prisma.paper_positions.findMany({
          where: {
            paper_accounts: {
              user_id: userId,
            },
          },
          select: {
            quantity: true,
            avg_cost: true,
            total_cost: true,
            updated_at: true,
            investment_assets: {
              select: {
                symbol: true,
                name: true,
              },
            },
          },
          orderBy: { updated_at: "desc" },
        }),

        prisma.paper_orders.findMany({
          where: {
            paper_accounts: {
              user_id: userId,
            },
          },
          select: {
            side: true,
            status: true,
            dollar_amount: true,
            quantity: true,
            price: true,
            executed_at: true,
            investment_assets: {
              select: {
                symbol: true,
                name: true,
              },
            },
          },
          orderBy: { executed_at: "desc" },
          take: 25,
        }),

        prisma.portfolio_snapshots.findMany({
          where: {
            paper_accounts: {
              user_id: userId,
            },
          },
          select: {
            total_value: true,
            cash_balance: true,
            invested_value: true,
            created_at: true,
          },
          orderBy: { created_at: "desc" },
          take: 5,
        }),

        prisma.investment_transfers.findMany({
          where: { user_id: userId },
          select: {
            amount: true,
            created_at: true,
            bank_accounts: {
              select: {
                name: true,
                official_name: true,
                nickname: true,
              },
            },
          },
          orderBy: { created_at: "desc" },
          take: 20,
        }),

        prisma.recurring_buys.findMany({
          where: {
            is_active: true,
            paper_accounts: {
              user_id: userId,
            },
          },
          select: {
            dollar_amount: true,
            frequency: true,
            next_run_at: true,
            last_run_at: true,
            is_active: true,
            investment_assets: {
              select: {
                symbol: true,
                name: true,
              },
            },
          },
          orderBy: { next_run_at: "asc" },
        }),
      ]);

      appContext = buildAIContext({
        user,
        accounts,
        goals,
        transactions,
        paperAccount,
        paperPositions,
        paperOrders,
        portfolioSnapshots,
        investmentTransfers,
        recurringBuys,
        subscriptions: user,
      });
    }

    const systemPrompt = `
You are Wise Assistant, the in-app financial assistant for WiseCents.

You may answer questions using ONLY the app context provided in JSON.
The app context may include:
- user profile preferences
- subscription details
- bank accounts and balances
- goals and progress
- transactions and spending categories
- paper investing account data
- positions, orders, transfers, and recurring buys

Rules:
- Never invent facts, balances, transactions, holdings, goals, or subscription details.
- If a user asks for data not present in the context, say that briefly.
- If consent is not granted, you may still discuss preferences and subscription info, but do not pretend to know financial data.
- Be concise, practical, and human-readable.
- Use short paragraphs.
- Use bullets only when useful.
- Reference exact numbers, dates, categories, and account names when available.
- Do not claim you cannot answer if relevant context is available.
- Do not provide live market/news/web info unless it exists in the provided app context.
- Use Markdown formatting when helpful
`;

    const completion = await openai.chat.completions.create({
      model: process.env.AZURE_OPENAI_DEPLOYMENT,
      temperature: 0.4,
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "assistant",
          content: `APP_CONTEXT_JSON:\n${JSON.stringify(appContext, null, 2)}`,
        },
        { role: "user", content: message.trim() },
      ],
    });

    return res.json({
      reply: completion.choices?.[0]?.message?.content || "No reply returned.",
    });
  } catch (err) {
    console.error("AI CHAT ERROR:", err);
    return res.status(500).json({
      error: "AI chat failed",
      details: err?.message || String(err),
    });
  }
});

export default router;