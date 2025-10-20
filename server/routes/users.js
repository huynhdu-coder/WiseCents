const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const { getProfile, login, register } = require('../controllers/userController');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/profile', verifyToken, getProfile);

module.exports = router;