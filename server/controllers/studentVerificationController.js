import crypto from "crypto";
import prisma from "../config/prisma.js";
import { isAcademicEmail } from "../utils/isAcademicEmail.js";
import { sendStudentVerificationEmail } from "../services/emailService.js";

function hashCode(code) {
  return crypto.createHash("sha256").update(code).digest("hex");
}

export async function requestStudentVerification(req, res) {
  try {
    const userId = req.userId;
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (!isAcademicEmail(normalizedEmail)) {
      return res.status(400).json({
        error: "This email does not appear to be an academic email address",
      });
    }

    const domain = normalizedEmail.split("@")[1];
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const codeHash = hashCode(code);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.student_email_verifications.create({
      data: {
        user_id: userId,
        email: normalizedEmail,
        code_hash: codeHash,
        expires_at: expiresAt,
      },
    });

    await prisma.users.update({
      where: { user_id: userId },
      data: {
        student_email: normalizedEmail,
        student_email_domain: domain,
        student_status: "pending",
      },
    });

    await sendStudentVerificationEmail(normalizedEmail, code);

    return res.json({ message: "Verification code sent" });
  } catch (err) {
    console.error("requestStudentVerification:", err);
    return res.status(500).json({ error: "Failed to send verification code" });
  }
}

export async function confirmStudentVerification(req, res) {
  try {
    const userId = req.userId;
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ error: "Email and code are required" });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const codeHash = hashCode(code);

    const verification = await prisma.student_email_verifications.findFirst({
      where: {
        user_id: userId,
        email: normalizedEmail,
        code_hash: codeHash,
        verified: false,
      },
      orderBy: { created_at: "desc" },
    });

    if (!verification) {
      return res.status(400).json({ error: "Invalid verification code" });
    }

    if (new Date() > verification.expires_at) {
      return res.status(400).json({ error: "Verification code expired" });
    }

    await prisma.student_email_verifications.update({
      where: { verification_id: verification.verification_id },
      data: { verified: true },
    });

    await prisma.users.update({
      where: { user_id: userId },
      data: {
        student_status: "verified",
        student_verified_at: new Date(),
        student_discount_percent: 80,
      },
    });

    return res.json({
      verified: true,
      discountApplied: true,
      message: "Student email verified successfully",
    });
  } catch (err) {
    console.error("confirmStudentVerification:", err);
    return res.status(500).json({ error: "Failed to verify code" });
  }
}

export async function getStudentVerificationStatus(req, res) {
  try {
    const user = await prisma.users.findUnique({
      where: { user_id: req.userId },
      select: {
        student_email: true,
        student_email_domain: true,
        student_status: true,
        student_verified_at: true,
        student_discount_percent: true,
      },
    });

    return res.json(user);
  } catch (err) {
    console.error("getStudentVerificationStatus:", err);
    return res.status(500).json({ error: "Failed to fetch student status" });
  }
}