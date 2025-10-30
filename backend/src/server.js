/**
 * server.js
 * Express API con CORS, logging e rotte multi-azienda
 */
import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

import fattureRoutes from "./routes/fatture.js";
import utenzeRoutes from "./routes/utenze.js";
import fornitoriBeniRoutes from "./routes/fornitoriBeni.js";
import fornitoriServiziRoutes from "./routes/fornitoriServizi.js";
import companyRoutes from "./routes/company.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// Healthcheck
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// Rotte API
app.use("/api/fatture", fattureRoutes);
app.use("/api/utenze", utenzeRoutes);
app.use("/api/fornitori-beni", fornitoriBeniRoutes);
app.use("/api/fornitori-servizi", fornitoriServiziRoutes);
app.use("/api/company", companyRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`✅ Backend attivo su http://localhost:${PORT}`));
