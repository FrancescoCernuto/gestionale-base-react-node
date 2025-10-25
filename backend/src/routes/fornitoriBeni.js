/**
 * Rotte Fornitori Beni – CRUD base
 */
const express = require("express");
const { v4: uuid } = require("uuid");
const { ensureCompany } = require("../db/memory");

const router = express.Router();

router.get("/", (req, res) => {
  const { fornitoriBeni } = ensureCompany(req.companyId);
  res.json(fornitoriBeni);
});

router.post("/", (req, res) => {
  const { fornitoriBeni } = ensureCompany(req.companyId);
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

router.put("/:id", (req, res) => {
  const { fornitoriBeni } = ensureCompany(req.companyId);
  const idx = fornitoriBeni.findIndex((f) => f.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Fornitore non trovato" });
  fornitoriBeni[idx] = { ...fornitoriBeni[idx], ...req.body };
  res.json(fornitoriBeni[idx]);
});

router.delete("/:id", (req, res) => {
  const data = ensureCompany(req.companyId);
  data.fornitoriBeni = data.fornitoriBeni.filter((f) => f.id !== req.params.id);
  res.json({ ok: true });
});

module.exports = router;
