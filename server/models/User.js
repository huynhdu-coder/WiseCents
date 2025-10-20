const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class User {
  constructor(id, email, password, is_admin, created_at, updated_at) {
    this.id = id;
    this.first_name = first_name;
    this.last_name = last_name;
    this.email = email;
    this.password = password;
    this.phone = phone;
    this.dob = this.dob;
    this.is_admin = is_admin;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  // Create a new user
  static async create(userData) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const query = `
      INSERT INTO users (first_name, last_name, email, password, phone, dob)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const values = [ 
      userData.first_name,
      userData.last_name,
      userData.email,
      hashedPassword,
      userData.phone || null,
      userData.dob || null
    ];

    const result = await pool.query(query, values);
    const user = result.rows[0];
    return new User(
      user.id, 
      user.first_name, 
      user.last_name,
      user.email, 
      user.password,
      user.phone,
      user.dob, 
      user.is_admin,
      user.created_at, 
      user.updated_at
    );
  }

  // Find user by email
  static async findByEmail(email) {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) return null;
    const user = result.rows[0];
    return new User(
      user.id, 
      user.first_name, 
      user.last_name,
      user.email, 
      user.password,
      user.phone,
      user.dob, 
      user.is_admin,
      user.created_at, 
      user.updated_at
    );
  }

  // Find user by ID
  static async findById(id) {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
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