import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendStudentVerificationEmail(to, code) {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: "Verify your WiseCents student email",
    text: `Your WiseCents verification code is: ${code}`,
  });
}