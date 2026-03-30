import cron from "node-cron";
import nodemailer from "nodemailer";
import prisma from "../config/prisma.js";
import { checkAndCreateAlerts } from "./notificationService.js";

function createTransport() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER || process.env.EMAIL_USER,
      pass: process.env.SMTP_PASS || process.env.EMAIL_PASS,
    },
  });
}

// ── HTML email builder ────────────────────────────────────────────────────────
function buildDigestHTML({ firstName, budgetSummary, goals, newAlerts }) {
  const month = new Date().toLocaleString("default", { month: "long", year: "numeric" });

  const alertRows =
    newAlerts.length > 0
      ? newAlerts
          .map(
            (a) => `
          <tr>
            <td style="padding:10px 0; border-bottom:1px solid #f0f0f0;">
              <strong style="color:#2d6a4f;">${a.title}</strong><br/>
              <span style="color:#555;font-size:14px;">${a.message}</span>
            </td>
          </tr>`
          )
          .join("")
      : `<tr><td style="padding:10px 0;color:#888;font-size:14px;">No new alerts — your finances look on track! 🎉</td></tr>`;

  const goalRows =
    goals.length > 0
      ? goals
          .map((g) => {
            const pct = Math.min(g.progress_percentage, 100).toFixed(0);
            const barColor = pct >= 100 ? "#2d6a4f" : pct >= 75 ? "#52b788" : "#95d5b2";
            return `
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;">
              <div style="display:flex;justify-content:space-between;margin-bottom:4px;">
                <strong>${g.name}</strong>
                <span style="color:#555;font-size:13px;">$${Number(g.current_amount).toFixed(2)} / $${Number(g.target_amount).toFixed(2)}</span>
              </div>
              <div style="background:#e8f5e9;border-radius:4px;height:10px;width:100%;">
                <div style="background:${barColor};border-radius:4px;height:10px;width:${pct}%;"></div>
              </div>
              <span style="font-size:12px;color:#888;">${pct}% complete</span>
            </td>
          </tr>`;
          })
          .join("")
      : `<tr><td style="padding:10px 0;color:#888;font-size:14px;">No active goals. <a href="${process.env.CLIENT_URL || "https://victorious-hill-01f04f60f.3.azurestaticapps.net"}/dashboard" style="color:#2d6a4f;">Create one →</a></td></tr>`;

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:30px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:#2d6a4f;padding:28px 32px;">
              <h1 style="margin:0;color:#ffffff;font-size:22px;">🦉 WiseCents Daily Digest</h1>
              <p style="margin:6px 0 0;color:#95d5b2;font-size:14px;">${month}</p>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding:24px 32px 8px;">
              <p style="margin:0;font-size:16px;color:#333;">Hi ${firstName},</p>
              <p style="color:#555;font-size:14px;">Here's your daily financial snapshot from WiseCents.</p>
            </td>
          </tr>

          <!-- Budget summary -->
          <tr>
            <td style="padding:8px 32px;">
              <h2 style="font-size:16px;color:#2d6a4f;margin-bottom:8px;">📊 This Month's Spending</h2>
              <table width="100%">
                <tr>
                  <td style="padding:6px 0;color:#555;font-size:14px;">Spent so far</td>
                  <td style="text-align:right;font-weight:bold;font-size:14px;">$${budgetSummary.spentThisMonth.toFixed(2)}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;color:#555;font-size:14px;">Last month total</td>
                  <td style="text-align:right;font-size:14px;color:#888;">$${budgetSummary.lastMonthTotal.toFixed(2)}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;color:#555;font-size:14px;">% of last month</td>
                  <td style="text-align:right;font-size:14px;color:${budgetSummary.pct >= 100 ? "#e63946" : budgetSummary.pct >= 80 ? "#f4a261" : "#2d6a4f"};">
                    <strong>${budgetSummary.lastMonthTotal > 0 ? budgetSummary.pct.toFixed(0) + "%" : "—"}</strong>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Alerts -->
          <tr>
            <td style="padding:16px 32px 8px;">
              <h2 style="font-size:16px;color:#2d6a4f;margin-bottom:8px;">🔔 New Alerts</h2>
              <table width="100%">${alertRows}</table>
            </td>
          </tr>

          <!-- Goals -->
          <tr>
            <td style="padding:16px 32px 8px;">
              <h2 style="font-size:16px;color:#2d6a4f;margin-bottom:8px;">🎯 Your Goals</h2>
              <table width="100%">${goalRows}</table>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td style="padding:24px 32px;" align="center">
              <a href="${process.env.CLIENT_URL || "https://victorious-hill-01f04f60f.3.azurestaticapps.net"}/dashboard"
                 style="background:#2d6a4f;color:#fff;text-decoration:none;padding:12px 28px;border-radius:8px;font-size:14px;font-weight:bold;display:inline-block;">
                Open WiseCents →
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f9f9f9;padding:16px 32px;border-top:1px solid #eee;">
              <p style="margin:0;font-size:11px;color:#aaa;text-align:center;">
                You're receiving this because you enabled daily digests in WiseCents Settings.<br/>
                <a href="${process.env.CLIENT_URL || "https://victorious-hill-01f04f60f.3.azurestaticapps.net"}/settings" style="color:#2d6a4f;">Manage notification settings</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

async function sendDigestForUser(transporter, user, newAlerts) {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

  const [thisAgg, lastAgg, goals] = await Promise.all([
    prisma.transactions.aggregate({
      where: {
        user_id: user.user_id,
        amount: { gt: 0 },
        date: { gte: monthStart },
        bank_accounts: { is_hidden: false },
      },
      _sum: { amount: true },
    }),
    prisma.transactions.aggregate({
      where: {
        user_id: user.user_id,
        amount: { gt: 0 },
        date: { gte: lastMonthStart, lte: lastMonthEnd },
        bank_accounts: { is_hidden: false },
      },
      _sum: { amount: true },
    }),
    prisma.goals.findMany({ where: { user_id: user.user_id } }),
  ]);

  const spentThisMonth = Number(thisAgg._sum.amount ?? 0);
  const lastMonthTotal = Number(lastAgg._sum.amount ?? 0);
  const pct = lastMonthTotal > 0 ? (spentThisMonth / lastMonthTotal) * 100 : 0;

  const goalsFormatted = goals.map((g) => ({
    ...g,
    progress_percentage:
      Number(g.target_amount) > 0
        ? (Number(g.current_amount) / Number(g.target_amount)) * 100
        : 0,
  }));

  const html = buildDigestHTML({
    firstName: user.first_name,
    budgetSummary: { spentThisMonth, lastMonthTotal, pct },
    goals: goalsFormatted,
    newAlerts,
  });

  await transporter.sendMail({
    from: `"WiseCents" <${process.env.SMTP_FROM || process.env.SMTP_USER || process.env.EMAIL_USER}>`,
    to: user.email,
    subject: `💰 Your WiseCents Daily Digest — ${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })}`,
    html,
  });

  await prisma.users.update({
    where: { user_id: user.user_id },
    data: { last_digest_sent: new Date() },
  });

  console.log(`[Digest] Sent to ${user.email}`);
}

export function startDigestCron() {
  cron.schedule("0 8 * * *", async () => {
    console.log("[Digest] Starting daily digest run...");

    if (!(process.env.SMTP_USER || process.env.EMAIL_USER) || !(process.env.SMTP_PASS || process.env.EMAIL_PASS)) {
      console.warn("[Digest] SMTP_USER / SMTP_PASS not set — skipping email send.");
      return;
    }

    const transporter = createTransport();

    const users = await prisma.users.findMany({
      where: { notif_email_digest: true },
      select: {
        user_id: true,
        first_name: true,
        email: true,
      },
    });

    console.log(`[Digest] Processing ${users.length} users...`);

    for (const user of users) {
      try {
        const newAlerts = await checkAndCreateAlerts(user.user_id);
        await sendDigestForUser(transporter, user, newAlerts);
      } catch (err) {
        console.error(`[Digest] Failed for user ${user.user_id}:`, err.message);
      }
    }

    console.log("[Digest] Done.");
  }, { timezone: "America/New_York" });
  console.log("[Digest] Daily digest cron scheduled (8:00 AM EST).");
}
