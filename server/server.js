import express from "express";
import cors from "cors";
import plaidRoutes from "./routes/plaidRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";


const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/plaid", plaidRoutes);

app.get("/", (req, res) => res.send("WiseCents Backend Running"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 WiseCents backend running on port ${PORT}`);
});
