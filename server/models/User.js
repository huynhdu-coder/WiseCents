import prisma from "../config/prisma.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

class User {
  constructor(row) {
    this.user_id = row.user_id;
    this.first_name = row.first_name;
    this.last_name = row.last_name;
    this.email = row.email;
    this.password = row.password;
    this.phone = row.phone;
    this.dob = row.dob;
    this.is_admin = row.is_admin;
    this.primary_intent = row.primary_intent;
    this.advice_style = row.advice_style;
    this.change_tolerance = row.change_tolerance;
    this.ai_data_consent = row.ai_data_consent;
    this.created_at = row.created_at;
    this.updated_at = row.updated_at;
  }

  static async findByEmail(email) {
    const user = await prisma.users.findUnique({
      where: { email },
    });
    return user ? new User(user) : null;
  }

  static async findById(id) {
    const user = await prisma.users.findUnique({
      where: { user_id: id },
    });
    return user ? new User(user) : null;
  }

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
        dob: dob ? new Date(dob) : null,
        is_admin: false,
        primary_intent,
        advice_style,
        change_tolerance,
      },
    });

    return new User(user);
  }

  static async updatePreferences(
    userId,
    { primary_intent, advice_style, change_tolerance }
  ) {
    const user = await prisma.users.update({
      where: { user_id: userId },
      data: {
        ...(primary_intent !== undefined ? { primary_intent } : {}),
        ...(advice_style !== undefined ? { advice_style } : {}),
        ...(change_tolerance !== undefined ? { change_tolerance } : {}),
        updated_at: new Date(),
      },
    });

    return user ? new User(user) : null;
  }

  static async updateConsent(userId, ai_data_consent) {
    const user = await prisma.users.update({
      where: { user_id: userId },
      data: {
        ai_data_consent,
        updated_at: new Date(),
      },
    });

    return user ? new User(user) : null;
  }

  toPublicJSON() {
    return {
      user_id: this.user_id,
      first_name: this.first_name,
      last_name: this.last_name,
      email: this.email,
      phone: this.phone,
      dob: this.dob,
      is_admin: this.is_admin,
      primary_intent: this.primary_intent,
      advice_style: this.advice_style,
      change_tolerance: this.change_tolerance,
      ai_data_consent: this.ai_data_consent,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }

  async verifyPassword(plainPassword) {
    return bcrypt.compare(plainPassword, this.password);
  }

  generateToken() {
    return jwt.sign({ userId: this.user_id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
  }
}

export default User;