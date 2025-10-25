import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";

import fattureRoutes from "./routes/fatture.js";
import utenzeRoutes from "./routes/utenze.js";
import fornitoriBeniRoutes from "./routes/fornitoriBeni.js";
import fornitoriServiziRoutes from "./routes/fornitoriServizi.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// Healthcheck
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// Rotte API
app.use("/api/fatture", fattureRoutes);
app.use("/api/utenze", utenzeRoutes);
app.use("/api/fornitori-beni", fornitoriBeniRoutes);
app.use("/api/fornitori-servizi", fornitoriServiziRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`✅ Backend avviato su http://localhost:${PORT}`));
