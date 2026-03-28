import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import plaidRoutes from "./routes/plaidRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import accountRoutes from "./routes/accountRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import goalRoutes from "./routes/goalRoutes.js";
import investmentRoutes from "./routes/investmentRoutes.js";
import "dotenv/config";
// import { startWeeklySync } from "./services/autoSyncService.js";

const app = express();
const isProduction = process.env.NODE_ENV === "production";

const corsOptions = {
  origin: [
    "http://localhost:3000",
    "https://victorious-hill-01f04f60f.3.azurestaticapps.net"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

// app.use((req, res, next) => {
//   console.log(new Date().toISOString(), req.method, req.originalUrl);
//   next();
// });

//Auth limiter: strict
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isProduction ? 20 : 200,
  message: { error: "Too many auth requests from this IP, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

// General API limiter: relaxed
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isProduction ? 500 : 5000,
  message: { error: "Too many requests from this IP, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api/auth", authLimiter);
app.use("/api/user", apiLimiter);
app.use("/api/plaid", apiLimiter);
app.use("/api/reports", apiLimiter);
app.use("/api/accounts", apiLimiter);
app.use("/api/ai", apiLimiter);
app.use("/api/goals", apiLimiter);
app.use("/api/investments", apiLimiter);

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/plaid", plaidRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/accounts", accountRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/investments", investmentRoutes);

app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err);
  res.status(err.status || 500).json({
    error: err.message || "Internal server error",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`WiseCents backend running on port ${PORT}`);
});

