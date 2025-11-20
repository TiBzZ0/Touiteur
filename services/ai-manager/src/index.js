const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

const aiRoutes = require("./routes/ai.routes");

if (process.env.NODE_ENV !== "production") {
  console.log("CORS enabled for development mode");
  app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true
  }));
}

app.use(express.json());

app.use("/api/ai", aiRoutes);

const PORT = 3010;
app.listen(PORT, () => {
  console.log(`Serveur IA lancé sur http://localhost:${PORT}`);
});
