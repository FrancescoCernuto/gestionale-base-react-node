/**
 * Rotte Fornitori Servizi – CRUD base
 */
const express = require("express");
const { v4: uuid } = require("uuid");
const { ensureCompany } = require("../db/memory");

const router = express.Router();

router.get("/", (req, res) => {
  const { fornitoriServizi } = ensureCompany(req.companyId);
  res.json(fornitoriServizi);
});

router.post("/", (req, res) => {
  const { fornitoriServizi } = ensureCompany(req.companyId);
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

router.put("/:id", (req, res) => {
  const { fornitoriServizi } = ensureCompany(req.companyId);
  const idx = fornitoriServizi.findIndex((f) => f.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Fornitore non trovato" });
  fornitoriServizi[idx] = { ...fornitoriServizi[idx], ...req.body };
  res.json(fornitoriServizi[idx]);
});

router.delete("/:id", (req, res) => {
  const data = ensureCompany(req.companyId);
  data.fornitoriServizi = data.fornitoriServizi.filter((f) => f.id !== req.params.id);
  res.json({ ok: true });
});

module.exports = router;
