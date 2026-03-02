import prisma from "../config/prisma.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

class User {
  constructor(row) {
    Object.assign(this, row);
  }

  // 🔹 Find by email
  static async findByEmail(email) {
    const user = await prisma.users.findUnique({
      where: { email },
    });
    return user ? new User(user) : null;
  }

  // 🔹 Find by ID
  static async findById(userId) {
    const user = await prisma.users.findUnique({
      where: { user_id: userId },
    });
    return user ? new User(user) : null;
  }

  // 🔹 Create user
  static async create({
    first_name,
    last_name,
    email,
    password,
    phone,
    dob,
    primary_intent = "general_budgeting",
    advice_style = "balanced",
    change_tolerance = "moderate",
  }) {
    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.users.create({
      data: {
        first_name,
        last_name,
        email,
        password: hashed,
        phone,
        dob,
        is_admin: false,
        primary_intent,
        advice_style,
        change_tolerance,
      },
    });

    return new User(user);
  }

  // 🔹 Update user preferences
  static async updatePreferences(userId, {
    primary_intent,
    advice_style,
    change_tolerance,
  }) {
    try {
      const user = await prisma.users.update({
        where: { user_id: userId },
        data: {
          ...(primary_intent && { primary_intent }),
          ...(advice_style && { advice_style }),
          ...(change_tolerance && { change_tolerance }),
          updated_at: new Date(),
        },
      });

      return new User(user);
    } catch {
      return null;
    }
  }

  // 🔹 Update AI data consent
  static async updateConsent(userId, ai_data_consent) {
    try {
      const user = await prisma.users.update({
        where: { user_id: userId },
        data: {
          ai_data_consent,
          updated_at: new Date(),
        },
      });

      return new User(user);
    } catch {
      return null;
    }
  }

  // 🔹 Public-safe JSON
  toPublicJSON() {
    const {
      password,
      ...safe
    } = this;
    return safe;
  }

  // 🔹 Verify password
  async verifyPassword(plainPassword) {
    return bcrypt.compare(plainPassword, this.password);
  }

  // 🔹 JWT
  generateToken() {
    return jwt.sign(
      { userId: this.user_id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
  }
}

export default User;