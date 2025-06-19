const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');

// Admin middleware
const isAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    
    if (!user || !user.is_admin) {
      return res.status(403).json({ message: 'Not authorized to access this resource' });
    }

		console.log('Decoded token:', decoded);
		console.log('User from DB:', user);

    next();
  } catch (error) {
    console.error('Admin verification error:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Get all users (admin only)
router.get('/', isAdmin, async (req, res) => {
  try {
    const query = 'SELECT id, email, created_at, updated_at FROM users';
    const result = await pool.query(query);
    res.json({
      message: 'Users retrieved successfully',
      users: result.rows
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// Debug endpoint to check database structure
router.get('/debug/tables', async (req, res) => {
  try {
    const query = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    const result = await pool.query(query);
    res.json({
      message: 'Database tables retrieved successfully',
      tables: result.rows.map(row => row.table_name)
    });
  } catch (error) {
    console.error('Error checking database structure:', error);
    res.status(500).json({ message: 'Error checking database structure' });
  }
});

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const user = await User.create({ email, password });
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user.id,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Error creating user' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await user.verifyPassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error during login' });
  }
});

// Get user profile
router.get('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
				is_admin: user.is_admin
      }
    });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
});

module.exports = router;