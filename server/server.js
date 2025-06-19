const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const User = require('./models/User');
const Transaction = require('./models/Transaction');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Test route
app.get('/test', (req, res) => {
  res.json({ message: 'Server is running!' });
});

// Import routes
const userRoutes = require('./routes/users');
const transactionRoutes = require('./routes/transactions');

// Use routes
app.use('/api/users', userRoutes);
app.use('/api/transactions', transactionRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Initialize database and start server
async function startServer() {
  try {
    // Start server
    const PORT = process.env.PORT || 8000;
    const server = app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Test the server at: http://localhost:${PORT}/test`);
    });

    // Handle server errors
    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Trying port ${PORT + 1}...`);
        server.close();
        app.listen(PORT + 1, () => {
          console.log(`Server is running on port ${PORT + 1}`);
          console.log(`Test the server at: http://localhost:${PORT + 1}/test`);
        });
      } else {
        console.error('Server error:', error);
        process.exit(1);
      }
    });

  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
}


// Start the server
startServer();
