const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded); // Debug log
    req.userId = decoded.id;
    console.log('Set userId in request:', req.userId); // Debug log
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Get all transactions for the authenticated user
router.get('/', verifyToken, async (req, res) => {
  try {
    const transactions = await Transaction.findByUserId(req.userId);
    res.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ message: 'Error fetching transactions' });
  }
});

// Create a new transaction
router.post('/', verifyToken, async (req, res) => {
  try {
    console.log('Creating transaction with userId:', req.userId); // Debug log
    console.log('Request body:', req.body); // Debug log
    
    const transactionData = {
      ...req.body,
      userId: req.userId
    };
    
    console.log('Transaction data:', transactionData); // Debug log
    
    const transaction = await Transaction.create(transactionData);
    res.status(201).json(transaction);
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({ 
      message: 'Error creating transaction',
      error: error.message 
    });
  }
});

// Get a specific transaction
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Verify the transaction belongs to the user
    if (transaction.userId !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to access this transaction' });
    }

    res.json(transaction);
  } catch (error) {
    console.error('Error fetching transaction:', error);
    res.status(500).json({ message: 'Error fetching transaction' });
  }
});

// Update a transaction
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Verify the transaction belongs to the user
    if (transaction.userId !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to update this transaction' });
    }

    const updatedTransaction = await Transaction.update(req.params.id, req.body);
    res.json(updatedTransaction);
  } catch (error) {
    console.error('Error updating transaction:', error);
    res.status(500).json({ message: 'Error updating transaction' });
  }
});

// Delete a transaction
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Verify the transaction belongs to the user
    if (transaction.userId !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this transaction' });
    }

    await Transaction.delete(req.params.id);
    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    res.status(500).json({ message: 'Error deleting transaction' });
  }
});

module.exports = router;