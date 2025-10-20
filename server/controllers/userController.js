const User = require('../models/User');

// Register a new user
const register = async (req, res) => {
  try {
    const { email, password, first_name, last_name } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const newUser = await User.create({
      first_name,
      last_name,
      email,
      password,
      phone,
      dob
    });

    // Generate JWT token
    const token = newUser.generateToken();

    res.status(201).json({
      token,
      user: {
        id: newUser.id,
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        email: newUser.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login user
 const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await user.verifyPassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user profile
 const getProfile = async (req, res) => {
  try {
    const user = req.user;
    res.json({
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      is_admin: user.is_admin
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile' });
  }
};

module.exports = { register, login, getProfile };
