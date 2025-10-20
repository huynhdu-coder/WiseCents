const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const { getProfile, login, register } = require('../controllers/userController');

// // Admin middleware
// const isAdmin = async (req, res, next) => {
//   try {
//     const token = req.headers.authorization?.split(' ')[1];
//     if (!token) {
//       return res.status(401).json({ message: 'No token provided' });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const user = await User.findById(decoded.id);
    
//     if (!user || !user.is_admin) {
//       return res.status(403).json({ message: 'Not authorized to access this resource' });
//     }

// 		console.log('Decoded token:', decoded);
// 		console.log('User from DB:', user);

//     next();
//   } catch (error) {
//     console.error('Admin verification error:', error);
//     res.status(401).json({ message: 'Invalid token' });
//   }
// };

// // Get all users (admin only)
// router.get('/', isAdmin, async (req, res) => {
//   try {
//     const query = 'SELECT id, email, created_at, updated_at FROM users';
//     const result = await pool.query(query);
//     res.json({
//       message: 'Users retrieved successfully',
//       users: result.rows
//     });
//   } catch (error) {
//     console.error('Error fetching users:', error);
//     res.status(500).json({ message: 'Error fetching users' });
//   }
// });

// // Debug endpoint to check database structure
// router.get('/debug/tables', async (req, res) => {
//   try {
//     const query = `
//       SELECT table_name 
//       FROM information_schema.tables 
//       WHERE table_schema = 'public'
//     `;
//     const result = await pool.query(query);
//     res.json({
//       message: 'Database tables retrieved successfully',
//       tables: result.rows.map(row => row.table_name)
//     });
//   } catch (error) {
//     console.error('Error checking database structure:', error);
//     res.status(500).json({ message: 'Error checking database structure' });
//   }
// });

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/profile', verifyToken, getProfile);

module.exports = router;