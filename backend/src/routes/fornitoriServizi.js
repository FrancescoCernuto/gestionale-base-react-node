import express from "express";
import { v4 as uuid } from "uuid";
import { ensureCompany } from "../db/memory.js";

const router = express.Router();

/**
 * GET – Elenco fornitori di servizi
 */
router.get("/", (req, res) => {
  const companyId = req.header("x-company-id");
  const { fornitoriServizi } = ensureCompany(companyId);
  res.json(fornitoriServizi);
});

/**
 * POST – Aggiunge fornitore di servizi
 */
router.post("/", (req, res) => {
  const companyId = req.header("x-company-id");
  const { fornitoriServizi } = ensureCompany(companyId);

  const nuovo = {
    id: uuid(),
    nome: req.body.nome || "",
    servizio: req.body.servizio || "",
    contatti: req.body.contatti || "",
    stato: req.body.stato || "attivo",
    createdAt: new Date().toISOString(),
  };

  fornitoriServizi.push(nuovo);
  res.status(201).json(nuovo);
});

/**
 * DELETE – Rimuove fornitore
 */
router.delete("/:id", (req, res) => {
  const companyId = req.header("x-company-id");
  const { fornitoriServizi } = ensureCompany(companyId);
  ensureCompany(companyId).fornitoriServizi = fornitoriServizi.filter(
    (f) => f.id !== req.params.id
  );
  res.json({ ok: true });
});

export default router;
