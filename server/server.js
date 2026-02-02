import express from "express";
import cors from "cors";
import plaidRoutes from "./routes/plaidRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import accountRoutes from "./routes/accountRoutes.js";
import transactionsRoutes from "./routes/transactionRoutes.js";


const app = express();

app.use(cors({origin: ["http://localhost:3000", "https://victorious-hill-01f04f60f.3.azurestaticapps.net"],
  methods: "GET,POST,PUT,DELETE",
  credentials: true}));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/plaid", plaidRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/accounts", accountRoutes);
app.use("/api/transactions", transactionsRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 WiseCents backend running on port ${PORT}`);
});
