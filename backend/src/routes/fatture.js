import express from "express";
import { v4 as uuid } from "uuid";
import { ensureCompany } from "../db/memory.js";

const router = express.Router();

/** GET – elenco fatture */
router.get("/", (req, res) => {
  const companyId = req.header("x-company-id");
  const { fatture } = ensureCompany(companyId);
  res.json(fatture);
});

/** POST – crea nuova fattura */
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
    updatedAt: new Date().toISOString(),
  };

  fatture.push(nuova);
  res.status(201).json(nuova);
});

/** PUT – aggiorna fattura (es. cambio stato) */
router.put("/:id", (req, res) => {
  const companyId = req.header("x-company-id");
  const { fatture } = ensureCompany(companyId);

  const index = fatture.findIndex(f => f.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Fattura non trovata" });

  fatture[index] = {
    ...fatture[index],
    ...req.body,
    updatedAt: new Date().toISOString(),
  };

  res.json(fatture[index]);
});

/** DELETE – rimuove fattura */
router.delete("/:id", (req, res) => {
  const companyId = req.header("x-company-id");
  const db = ensureCompany(companyId);
  db.fatture = db.fatture.filter(f => f.id !== req.params.id);
  res.json({ ok: true });
});

export default router;
