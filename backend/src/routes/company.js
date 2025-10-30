/**
 * company.js
 * Gestione profilo aziendale per-azienda (multi-tenant tramite x-company-id)
 */
import express from "express";
import { ensureCompany } from "../db/memory.js";

const router = express.Router();

// 📖 GET - profilo azienda
router.get("/", (req, res) => {
  const companyId = req.header("x-company-id");
  const store = ensureCompany(companyId);
  res.json(store.profile);
});

// ✏️ PUT - aggiorna profilo
router.put("/", (req, res) => {
  const companyId = req.header("x-company-id");
  const store = ensureCompany(companyId);
  store.profile = { ...store.profile, ...req.body, updatedAt: new Date().toISOString() };
  res.json(store.profile);
});

export default router;
