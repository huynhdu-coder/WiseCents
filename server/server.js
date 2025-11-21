import pool from "./config/database.js";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import plaidRoutes from "./routes/plaidRoutes.js";

// Load environment variables
dotenv.config();

const app = express();

//Plaid routes
app.use("/api/plaid", plaidRoutes);

// Middleware
app.use(cors());
app.use(express.json());


// Database connection
async function connectDB() {
  try {
    const res = await pool.query("SELECT NOW()");
    console.log("✅ Connected to Azure PostgreSQL at:", res.rows[0].now);
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
    process.exit(1); 
  }
}

// Test route
app.get("/test", (req, res) => {
  res.json({ message: "Server is running and connected to Azure PostgreSQL!" });
});

// Server start
const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () =>
    console.log(`🚀 WiseCents backend running on port ${PORT}`)
  );
});
