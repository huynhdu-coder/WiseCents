import prisma from "../config/prisma.js";

const ACADEMIC_DOMAINS = [
  "uc.edu",
  "osu.edu",
  "mit.edu",
];

function isAcademicEmail(email) {
  if (!email || !email.includes("@")) return false;

  const normalized = email.toLowerCase().trim();
  const domain = normalized.split("@")[1] || "";

  return domain.endsWith(".edu") || ACADEMIC_DOMAINS.includes(domain);
}

export const getSubscription = async (req, res) => {
  try {
    const user = await prisma.users.findUnique({
      where: { user_id: req.userId },
      select: {
        subscription_type: true,
        subscription_status: true,
        trial_start: true,
        trial_end: true,
        student_email: true,
        student_email_domain: true,
        student_verified: true,
        student_discount_active: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const now = new Date();
    const msLeft = user.trial_end ? new Date(user.trial_end) - now : 0;
    const daysLeft = Math.max(0, Math.ceil(msLeft / (1000 * 60 * 60 * 24)));

    return res.json({
      ...user,
      trial_days_left: daysLeft,
      show_trial_warning:
        user.subscription_status === "trial" && daysLeft <= 3 && daysLeft > 0,
      is_trial_expired:
        user.subscription_status === "expired" ||
        (user.subscription_status === "trial" && daysLeft === 0),
    });
  } catch (err) {
    console.error("getSubscription:", err);
    return res.status(500).json({ error: "Failed to fetch subscription" });
  }
};

export const verifyStudentEmail = async (req, res) => {
  try {
    const user = await prisma.users.findUnique({
      where: { user_id: req.userId },
      select: {
        email: true,
      },
    });

    if (!user?.email) {
      return res.status(400).json({
        title: "Verification Failed",
        message: "No email found for this account.",
        error: "No email found for this account.",
      });
    }

    const normalized = user.email.toLowerCase().trim();
    const domain = normalized.split("@")[1] || "";
    const eligible = isAcademicEmail(normalized);

    if (!eligible) {
      await prisma.users.update({
        where: { user_id: req.userId },
        data: {
          student_verified: false,
          student_discount_active: false,
          student_email: normalized,
          student_email_domain: domain,
        },
      });

      return res.status(400).json({
        eligible: false,
        title: "Student Discount Unavailable",
        message: "Your signed-in email does not qualify for the student plan.",
      });
    }

    await prisma.users.update({
      where: { user_id: req.userId },
      data: {
        student_verified: true,
        student_email: normalized,
        student_email_domain: domain,
      },
    });

    return res.json({
      eligible: true,
      title: "Student Discount Unlocked",
      message:
        "Your signed-in email qualifies for the student plan at $0.50/month.",
    });
  } catch (err) {
    console.error("verifyStudentEmail:", err);
    return res.status(500).json({
      title: "Verification Failed",
      message: "Failed to verify student email.",
      error: "Failed to verify student email.",
    });
  }
};

export const activateStudentPlan = async (req, res) => {
  try {
    const user = await prisma.users.findUnique({
      where: { user_id: req.userId },
      select: { student_verified: true },
    });

    if (!user?.student_verified) {
      return res.status(400).json({ error: "Student verification required" });
    }

    await prisma.users.update({
      where: { user_id: req.userId },
      data: {
        subscription_type: "student",
        subscription_status: "active",
        student_discount_active: true,
      },
    });

    return res.json({
      success: true,
      message: "Student plan activated.",
    });
  } catch (err) {
    console.error("activateStudentPlan:", err);
    return res.status(500).json({ error: "Failed to activate student plan" });
  }
};

export const activateStandardPlan = async (req, res) => {
  try {
    await prisma.users.update({
      where: { user_id: req.userId },
      data: {
        subscription_type: "standard",
        subscription_status: "active",
        student_discount_active: false,
      },
    });

    return res.json({
      success: true,
      message: "Standard plan activated.",
    });
  } catch (err) {
    console.error("activateStandardPlan:", err);
    return res.status(500).json({ error: "Failed to activate standard plan" });
  }
};

export const cancelToFree = async (req, res) => {
  try {
    await prisma.users.update({
      where: { user_id: req.userId },
      data: {
        subscription_type: "free",
        subscription_status: "expired",
        student_discount_active: false,
      },
    });

    return res.json({
      success: true,
      message: "Returned to free plan.",
    });
  } catch (err) {
    console.error("cancelToFree:", err);
    return res.status(500).json({ error: "Failed to return to free plan." });
  }
};