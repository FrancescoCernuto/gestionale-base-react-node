/**
 * Rotte Fatture – con scadenza e collegamento fornitore
 */
const express = require("express");
const { v4: uuid } = require("uuid");
const path = require("path");
const { ensureCompany } = require("../db/memory");
const upload = require("../uploadConfig");

const router = express.Router();

// Serve file allegati
router.use("/uploads", express.static(path.join(__dirname, "../../uploads")));

// GET – lista fatture
router.get("/", (req, res) => {
  const { fatture } = ensureCompany(req.companyId);
  res.json(fatture);
});

// POST – crea nuova fattura con allegato opzionale
router.post("/", upload.single("file"), (req, res) => {
  const fatture = ensureCompany(req.companyId).fatture;
  const data = req.body;
  const fileName = req.file ? req.file.filename : null;

  const fattura = {
    id: uuid(),
    numero: data.numero || "",
    emissario: data.emissario || "",
    fornitoreId: data.fornitoreId || "",
    categoria: data.categoria || "",
    importo: Number(data.importo) || 0,
    metodoPagamento: data.metodoPagamento || "",
    stato: data.stato || "in_sospeso",
    scadenza: data.scadenza || "",
    note: data.note || "",
    allegato: fileName,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  fatture.push(fattura);
  res.status(201).json(fattura);
});

// PUT – aggiorna fattura
router.put("/:id", (req, res) => {
  const { fatture } = ensureCompany(req.companyId);
  const idx = fatture.findIndex((f) => f.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Fattura non trovata" });
  fatture[idx] = { ...fatture[idx], ...req.body, updatedAt: new Date().toISOString() };
  res.json(fatture[idx]);
});

// DELETE
router.delete("/:id", (req, res) => {
  const data = ensureCompany(req.companyId);
  data.fatture = data.fatture.filter((f) => f.id !== req.params.id);
  res.json({ ok: true });
});

module.exports = router;
