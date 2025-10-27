import express from "express";
import { v4 as uuid } from "uuid";
import { ensureCompany } from "../db/memory.js";

const router = express.Router();

// GET – tutte le fatture
router.get("/", (req, res) => {
  const companyId = req.header("x-company-id");
  const { fatture } = ensureCompany(companyId);
  res.json(fatture);
});

// POST – aggiunge una fattura
router.post("/", (req, res) => {
  const companyId = req.header("x-company-id");
  const { fatture } = ensureCompany(companyId);

  const nuova = {
    id: uuid(),
    numero: req.body.numero || "",
    emissario: req.body.emissario || "",
    categoria: req.body.categoria || "",
    data: req.body.data || new Date().toISOString().slice(0, 10),
    scadenza: req.body.scadenza || "",
    importo: parseFloat(req.body.importo) || 0,
    metodoPagamento: req.body.metodoPagamento || "",
    stato: req.body.stato || "in_sospeso",
    note: req.body.note || "",
    allegato: req.body.allegato || null,
    createdAt: new Date().toISOString(),
  };

  fatture.push(nuova);
  res.status(201).json(nuova);
});

// DELETE – elimina
router.delete("/:id", (req, res) => {
  const companyId = req.header("x-company-id");
  const { fatture } = ensureCompany(companyId);
  const filtered = fatture.filter((f) => f.id !== req.params.id);
  ensureCompany(companyId).fatture = filtered;
  res.json({ ok: true });
});

export default router;
