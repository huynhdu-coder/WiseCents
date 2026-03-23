import prisma from "../config/prisma.js";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

const generateCode = () => Math.floor(100000 + Math.random() * 900000).toString();
const transporter = nodemailer.createTransport({
  service: "gmail", 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, 
  },
});
export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await prisma.users.findUnique({ where: { email } });
n
    if (!user) {
      return res.json({ message: "If that email exists, a code has been sent." });
    }

    await prisma.password_reset_tokens.updateMany({
      where: { user_id: user.user_id, used: false },
      data: { used: true },
    });

    const code = generateCode();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); 

    await prisma.password_reset_tokens.create({
      data: {
        user_id: user.user_id,
        token: code,
        expires_at: expiresAt,
      },
    });

    await transporter.sendMail({
      from: `"WiseCents" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your WiseCents Password Reset Code",
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: auto;">
          <h2 style="color: #2d6a4f;">WiseCents Password Reset</h2>
          <p>Hi ${user.first_name},</p>
          <p>Use the code below to reset your password. It expires in <strong>15 minutes</strong>.</p>
          <div style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #2d6a4f; margin: 24px 0;">
            ${code}
          </div>
          <p>If you didn't request this, you can safely ignore this email.</p>
        </div>
      `,
    });

    res.json({ message: "If that email exists, a code has been sent." });
  } catch (err) {
    console.error("requestPasswordReset error:", err);
    res.status(500).json({ message: "Failed to send reset email" });
  }
};

export const verifyResetCode = async (req, res) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) return res.status(400).json({ message: "Email and code are required" });

    const user = await prisma.users.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ message: "Invalid code" });

    const resetToken = await prisma.password_reset_tokens.findFirst({
      where: {
        user_id: user.user_id,
        token: code,
        used: false,
        expires_at: { gt: new Date() },
      },
    });

    if (!resetToken) {
      return res.status(400).json({ message: "Invalid or expired code" });
    }

    res.json({ message: "Code verified", valid: true });
  } catch (err) {
    console.error("verifyResetCode error:", err);
    res.status(500).json({ message: "Verification failed" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;
    if (!email || !code || !newPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters" });
    }

    const user = await prisma.users.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ message: "Invalid request" });

    const resetToken = await prisma.password_reset_tokens.findFirst({
      where: {
        user_id: user.user_id,
        token: code,
        used: false,
        expires_at: { gt: new Date() },
      },
    });

    if (!resetToken) {
      return res.status(400).json({ message: "Invalid or expired code" });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await prisma.users.update({
      where: { user_id: user.user_id },
      data: { password: hashed, updated_at: new Date() },
    });

    await prisma.password_reset_tokens.update({
      where: { id: resetToken.id },
      data: { used: true },
    });

    res.json({ message: "Password reset successfully" });
  } catch (err) {
    console.error("resetPassword error:", err);
    res.status(500).json({ message: "Password reset failed" });
  }
};
