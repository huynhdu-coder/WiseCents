import prisma from "../config/prisma.js";

export async function getNotificationSettings(req, res) {
  try {
    const user = await prisma.users.findUnique({
      where: { user_id: req.userId },
      select: {
        notif_email_digest: true,
        notif_budget_alerts: true,
        notif_goal_alerts: true,
        notif_budget_threshold: true,
      },
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({
      notif_email_digest: user.notif_email_digest,
      notif_budget_alerts: user.notif_budget_alerts,
      notif_goal_alerts: user.notif_goal_alerts,
      notif_budget_threshold: Number(user.notif_budget_threshold ?? 80),
    });
  } catch (err) {
    console.error("getNotificationSettings:", err);
    res.status(500).json({ error: "Failed to fetch notification settings" });
  }
}

export async function updateNotificationSettings(req, res) {
  try {
    const {
      notif_email_digest,
      notif_budget_alerts,
      notif_goal_alerts,
      notif_budget_threshold,
    } = req.body;

    const data = {};
    if (typeof notif_email_digest === "boolean") data.notif_email_digest = notif_email_digest;
    if (typeof notif_budget_alerts === "boolean") data.notif_budget_alerts = notif_budget_alerts;
    if (typeof notif_goal_alerts === "boolean") data.notif_goal_alerts = notif_goal_alerts;
    if (notif_budget_threshold !== undefined) {
      const threshold = Number(notif_budget_threshold);
      if (isNaN(threshold) || threshold < 1 || threshold > 100) {
        return res.status(400).json({ error: "Budget threshold must be 1–100" });
      }
      data.notif_budget_threshold = threshold;
    }

    await prisma.users.update({ where: { user_id: req.userId }, data });
    res.json({ message: "Notification settings saved" });
  } catch (err) {
    console.error("updateNotificationSettings:", err);
    res.status(500).json({ error: "Failed to update notification settings" });
  }
}

export async function getAlerts(req, res) {
  try {
    const alerts = await prisma.spending_alerts.findMany({
      where: { user_id: req.userId },
      orderBy: [{ is_read: "asc" }, { created_at: "desc" }],
      take: 50,
    });
    const unreadCount = alerts.filter((a) => !a.is_read).length;
    res.json({ alerts, unreadCount });
  } catch (err) {
    console.error("getAlerts:", err);
    res.status(500).json({ error: "Failed to fetch alerts" });
  }
}

export async function markAlertRead(req, res) {
  try {
    await prisma.spending_alerts.updateMany({
      where: { alert_id: Number(req.params.id), user_id: req.userId },
      data: { is_read: true },
    });
    res.json({ success: true });
  } catch (err) {
    console.error("markAlertRead:", err);
    res.status(500).json({ error: "Failed to mark alert read" });
  }
}

export async function markAllRead(req, res) {
  try {
    await prisma.spending_alerts.updateMany({
      where: { user_id: req.userId, is_read: false },
      data: { is_read: true },
    });
    res.json({ success: true });
  } catch (err) {
    console.error("markAllRead:", err);
    res.status(500).json({ error: "Failed to mark all read" });
  }
}
