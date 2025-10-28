/**
 * Rotte Utenze
 * Simula CRUD in memoria per luce, acqua, gas, ecc.
 */
import express from "express";
import { v4 as uuid } from "uuid";
import { ensureCompany } from "../db/memory.js";

const router = express.Router();

// 📘 Lista utenze
router.get("/", (req, res) => {
  const companyId = req.header("x-company-id");
  const { utenze } = ensureCompany(companyId);
  res.json(utenze);
});

// ➕ Aggiungi utenza
router.post("/", (req, res) => {
  const companyId = req.header("x-company-id");
  const { utenze } = ensureCompany(companyId);
  const nuova = {
    id: uuid(),
    fornitore: req.body.fornitore || "",
    tipo: req.body.tipo || "",
    importo: Number(req.body.importo) || 0,
    scadenza: req.body.scadenza || "",
    stato: req.body.stato || "in_sospeso",
    note: req.body.note || "",
  };
  utenze.push(nuova);
  res.status(201).json(nuova);
});

// ✏️ Modifica utenza
router.put("/:id", (req, res) => {
  const companyId = req.header("x-company-id");
  const { utenze } = ensureCompany(companyId);
  const index = utenze.findIndex((u) => u.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Utenza non trovata" });
  utenze[index] = { ...utenze[index], ...req.body };
  res.json(utenze[index]);
});

// 🗑️ Elimina utenza
router.delete("/:id", (req, res) => {
  const companyId = req.header("x-company-id");
  const { utenze } = ensureCompany(companyId);
  const index = utenze.findIndex((u) => u.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Utenza non trovata" });
  utenze.splice(index, 1);
  res.json({ success: true });
});

export default router;
