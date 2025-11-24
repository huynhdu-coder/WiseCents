import express from "express";
import cors from "cors";
import plaidRoutes from "./routes/plaidRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";


const app = express();

app.use(cors({origin: ["http://localhost:3000", "https://victorious-hill-01f04f60f.3.azurestaticapps.net"],
  methods: "GET,POST,PUT,DELETE",
  credentials: true}));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/plaid", plaidRoutes);

app.get("/", (req, res) => res.send("WiseCents Backend Running"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 WiseCents backend running on port ${PORT}`);
});
