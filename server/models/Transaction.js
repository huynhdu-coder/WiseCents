const pool = require('../config/database');

class Transaction {
  constructor(id, userId, amount, type, category, description, date, created_at, updated_at) {
    this.id = id;
    this.userId = userId;
    this.amount = amount;
    this.type = type;
    this.category = category;
    this.description = description;
    this.date = date;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  // Create a new transaction
  static async create(transactionData) {
    console.log('Transaction.create called with data:', transactionData); // Debug log
    
    if (!transactionData.userId) {
      throw new Error('User ID is required to create a transaction');
    }

    const query = `
      INSERT INTO transactions (
        user_id, amount, type, category, description, date
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const values = [
      transactionData.userId,
      transactionData.amount,
      transactionData.type,
      transactionData.category,
      transactionData.description,
      transactionData.date || new Date()
    ];
    
    console.log('Executing query with values:', values); // Debug log
    
    const result = await pool.query(query, values);
    console.log('Query result:', result.rows[0]); // Debug log
    
    return new Transaction(
      result.rows[0].id,
      result.rows[0].user_id,
      result.rows[0].amount,
      result.rows[0].type,
      result.rows[0].category,
      result.rows[0].description,
      result.rows[0].date,
      result.rows[0].created_at,
      result.rows[0].updated_at
    );
  }

  // Find transaction by ID
  static async findById(id) {
    const query = 'SELECT * FROM transactions WHERE id = $1';
    const result = await pool.query(query, [id]);
    if (result.rows.length === 0) return null;
    const transaction = result.rows[0];
    return new Transaction(
      transaction.id,
      transaction.user_id,
      transaction.amount,
      transaction.type,
      transaction.category,
      transaction.description,
      transaction.date,
      transaction.created_at,
      transaction.updated_at
    );
  }

  // Find all transactions for a user
  static async findByUserId(userId) {
    const query = 'SELECT * FROM transactions WHERE user_id = $1 ORDER BY date DESC';
    const result = await pool.query(query, [userId]);
    return result.rows.map(transaction => new Transaction(
      transaction.id,
      transaction.user_id,
      transaction.amount,
      transaction.type,
      transaction.category,
      transaction.description,
      transaction.date,
      transaction.created_at,
      transaction.updated_at
    ));
  }

  // Update a transaction
  static async update(id, updateData) {
    const setClause = Object.keys(updateData)
      .map((key, index) => `${key} = $${index + 2}`)
      .join(', ');
    const query = `
      UPDATE transactions 
      SET ${setClause}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `;
    const values = [id, ...Object.values(updateData)];
    const result = await pool.query(query, values);
    if (result.rows.length === 0) return null;
    const transaction = result.rows[0];
    return new Transaction(
      transaction.id,
      transaction.user_id,
      transaction.amount,
      transaction.type,
      transaction.category,
      transaction.description,
      transaction.date,
      transaction.created_at,
      transaction.updated_at
    );
  }

  // Delete a transaction
  static async delete(id) {
    const query = 'DELETE FROM transactions WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows.length > 0;
  }

}

module.exports = Transaction;