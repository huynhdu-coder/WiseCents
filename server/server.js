import pool from "./config/database.js";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";


// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());


// Test route
app.get("/api/dbcheck", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ success: true, time: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});


// // Use routes
// app.use('/api/users', userRoutes);

// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  try {
    await pool.connect();
    console.log("✅ Connected to PostgreSQL");
  } catch (err) {
    console.error("❌ Database connection error:", err);
  }
  console.log(`Server running on port ${PORT}`);
});
