import pool from "../config/database.js";
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
    this.created_at = row.created_at;
  }

  // 🔹 Find user by email
  static async findByEmail(email) {
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1 LIMIT 1",
      [email]
    );

    if (result.rows.length === 0) return null;
    return new User(result.rows[0]);
  }

  // 🔹 Find user by ID
  static async findById(id) {
    const result = await pool.query(
      "SELECT * FROM users WHERE user_id = $1 LIMIT 1",
      [id]
    );

    if (result.rows.length === 0) return null;
    return new User(result.rows[0]);
  }

  // 🔹 Create new user
  static async create({
    first_name,
    last_name,
    email,
    password,
    phone,
    dob,
  }) {
    const hashed = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (first_name, last_name, email, password, phone, dob, is_admin)
       VALUES ($1, $2, $3, $4, $5, $6, false)
       RETURNING *`,
      [first_name, last_name, email, hashed, phone, dob]
    );

    return new User(result.rows[0]);
  }

  // 🔹 Password validation
  async verifyPassword(plainPassword) {
    return bcrypt.compare(plainPassword, this.password);
  }

  // 🔹 Generate JWT token
  generateToken() {
    return jwt.sign(
      { userId: this.user_id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
  }
}

export default User;
