import 'dotenv/config';
import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import plaidRoutes from "./routes/plaidRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import accountRoutes from "./routes/accountRoutes.js";
import transactionsRoutes from "./routes/transactionRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import type { Request, Response, NextFunction } from "express";

const app = express();

const corsOptions = {
  origin: [
    "http://localhost:3000",
    "https://victorious-hill-01f04f60f.3.azurestaticapps.net"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); 

app.use(express.json());


const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: { error: 'Too many requests from this IP, please try again later.' },
  standardHeaders: true, 
  legacyHeaders: false, 
});

app.use("/api/", limiter);

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/plaid", plaidRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/accounts", accountRoutes);
app.use("/api/transactions", transactionsRoutes);
app.use("/api/ai", aiRoutes);

// Error handling middleware
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error("=== Backend Error ===");
  console.error(err.stack || err); // print full error stack
  res.status(500).json({ message: err.message || "Internal Server Error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`WiseCents backend running on port ${PORT}`);
});