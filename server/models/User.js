const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class User {
  constructor(id, email, password, is_admin, created_at, updated_at) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.is_admin = is_admin;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  // Create a new user
  static async create(userData) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const query = `
      INSERT INTO users (email, password)
      VALUES ($1, $2)
      RETURNING *
    `;
    const values = [userData.email, hashedPassword];
    const result = await pool.query(query, values);
    return new User(
      result.rows[0].id,
      result.rows[0].email,
      result.rows[0].password,
      result.rows[0].is_admin,
      result.rows[0].created_at,
      result.rows[0].updated_at
    );
  }

  // Find user by email
  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    if (result.rows.length === 0) return null;
    const user = result.rows[0];
    return new User(
      user.id,
      user.email,
      user.password,
      user.is_admin,
      user.created_at,
      user.updated_at
    );
  }

  // Find user by ID
  static async findById(id) {
    const query = 'SELECT * FROM users WHERE id = $1';
    const result = await pool.query(query, [id]);
    if (result.rows.length === 0) return null;
    const user = result.rows[0];
    return new User(
      user.id,
      user.email,
      user.password,
      user.is_admin,
      user.created_at,
      user.updated_at
    );
  }

  // Update user
  static async update(id, updateData) {
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }
    const setClause = Object.keys(updateData)
      .map((key, index) => `${key} = $${index + 2}`)
      .join(', ');
    const query = `
      UPDATE users 
      SET ${setClause}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `;
    const values = [id, ...Object.values(updateData)];
    const result = await pool.query(query, values);
    if (result.rows.length === 0) return null;
    const user = result.rows[0];
    return new User(
      user.id,
      user.email,
      user.password,
      user.is_admin,
      user.created_at,
      user.updated_at
    );
  }

  // Delete user
  static async delete(id) {
    const query = 'DELETE FROM users WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows.length > 0;
  }

  // Verify password
  async verifyPassword(password) {
    return bcrypt.compare(password, this.password);
  }

  // Generate JWT token
  generateToken() {
    return jwt.sign(
      { 
        id: this.id,
        email: this.email 
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
  }

}

module.exports = User;