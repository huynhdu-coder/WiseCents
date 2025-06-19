const Transaction = require('../models/Transaction');
const { Op } = require('sequelize');

// Get all transactions with filtering and sorting
exports.getTransactions = async (req, res) => {
  try {
    const { startDate, endDate, type, category, sortBy = 'date', sortOrder = 'DESC' } = req.query;
    
    const whereClause = {};
    
    if (startDate && endDate) {
      whereClause.date = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }
    
    if (type) {
      whereClause.type = type;
    }
    
    if (category) {
      whereClause.category = category;
    }

    const transactions = await Transaction.findAll({
      where: whereClause,
      order: [[sortBy, sortOrder]],
    });

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new transaction
exports.createTransaction = async (req, res) => {
  try {
    const { amount, type, category, description, date } = req.body;
    const transaction = await Transaction.create({
      amount,
      type,
      category,
      description,
      date: date || new Date()
    });
    res.status(201).json(transaction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get a single transaction
exports.getTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      where: {
        id: req.params.id
      }
    });

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a transaction
exports.updateTransaction = async (req, res) => {
  try {
    const { amount, type, category, description, date } = req.body;
    
    const transaction = await Transaction.findOne({
      where: {
        id: req.params.id
      }
    });

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    await transaction.update({
      amount,
      type,
      category,
      description,
      date
    });

    res.json(transaction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a transaction
exports.deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      where: {
        id: req.params.id
      }
    });

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    await transaction.destroy();
    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get transaction statistics
exports.getTransactionStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const whereClause = {};
    if (startDate && endDate) {
      whereClause.date = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }

    const transactions = await Transaction.findAll({
      where: whereClause,
      attributes: [
        'type',
        'category',
        'amount'
      ]
    });

    const stats = {
      totalIncome: 0,
      totalExpenses: 0,
      categoryBreakdown: {}
    };

    transactions.forEach(transaction => {
      if (transaction.type === 'income') {
        stats.totalIncome += parseFloat(transaction.amount);
      } else {
        stats.totalExpenses += Math.abs(parseFloat(transaction.amount));
      }

      if (!stats.categoryBreakdown[transaction.category]) {
        stats.categoryBreakdown[transaction.category] = {
          income: 0,
          expenses: 0
        };
      }

      if (transaction.type === 'income') {
        stats.categoryBreakdown[transaction.category].income += parseFloat(transaction.amount);
      } else {
        stats.categoryBreakdown[transaction.category].expenses += Math.abs(parseFloat(transaction.amount));
      }
    });

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 