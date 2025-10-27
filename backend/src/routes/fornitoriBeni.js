import express from "express";
import { v4 as uuid } from "uuid";
import { ensureCompany } from "../db/memory.js";

const router = express.Router();

/**
 * GET – Elenco fornitori di beni
 */
router.get("/", (req, res) => {
  const companyId = req.header("x-company-id");
  const { fornitoriBeni } = ensureCompany(companyId);
  res.json(fornitoriBeni);
});

/**
 * POST – Aggiunge fornitore di beni
 */
router.post("/", (req, res) => {
  const companyId = req.header("x-company-id");
  const { fornitoriBeni } = ensureCompany(companyId);

  const nuovo = {
    id: uuid(),
    nome: req.body.nome || "",
    categoria: req.body.categoria || "",
    contatti: req.body.contatti || "",
    stato: req.body.stato || "attivo",
    createdAt: new Date().toISOString(),
  };

  fornitoriBeni.push(nuovo);
  res.status(201).json(nuovo);
});

/**
 * DELETE – Rimuove fornitore
 */
router.delete("/:id", (req, res) => {
  const companyId = req.header("x-company-id");
  const { fornitoriBeni } = ensureCompany(companyId);
  ensureCompany(companyId).fornitoriBeni = fornitoriBeni.filter(
    (f) => f.id !== req.params.id
  );
  res.json({ ok: true });
});

export default router;
