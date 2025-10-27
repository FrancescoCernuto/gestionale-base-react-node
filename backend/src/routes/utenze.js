import express from "express";
import { v4 as uuid } from "uuid";
import { ensureCompany } from "../db/memory.js";

const router = express.Router();

/**
 * GET – Elenco utenze
 */
router.get("/", (req, res) => {
  const companyId = req.header("x-company-id");
  const { utenze } = ensureCompany(companyId);
  res.json(utenze);
});

/**
 * POST – Aggiunge utenza
 */
router.post("/", (req, res) => {
  const companyId = req.header("x-company-id");
  const { utenze } = ensureCompany(companyId);

  const nuova = {
    id: uuid(),
    fornitore: req.body.fornitore || "",
    tipo: req.body.tipo || "",
    importo: parseFloat(req.body.importo) || 0,
    scadenza: req.body.scadenza || "",
    stato: req.body.stato || "in_sospeso",
  };

  utenze.push(nuova);
  res.status(201).json(nuova);
});

/**
 * DELETE – Elimina utenza per ID
 */
router.delete("/:id", (req, res) => {
  const companyId = req.header("x-company-id");
  const { utenze } = ensureCompany(companyId);
  ensureCompany(companyId).utenze = utenze.filter(
    (u) => u.id !== req.params.id
  );
  res.json({ ok: true });
});

export default router;
