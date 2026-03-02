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
import goalRoutes from "./routes/goalRoutes.js";


const app = express();

const allowedOrigins = [
  "https://victorious-hill-01f04f60f.3.azurestaticapps.net",
  "http://localhost:3000"
];


app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (Postman, curl)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.options("*", cors());

app.use(express.json());


const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: { error: 'Too many requests from this IP, please try again later.' },
  standardHeaders: true, 
  legacyHeaders: false, 
  skip: (req) => req.method === "OPTIONS"
});

app.use("/api/", limiter);

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/plaid", plaidRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/accounts", accountRoutes);
app.use("/api/transactions", transactionsRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/goals", goalRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`WiseCents backend running on port ${PORT}`);
});
