/**
 * Rotte CRUD per Fatture (in-memory)
 */
const express = require('express');
const { v4: uuid } = require('uuid');
const { ensureCompany } = require('../db/memory');

const router = express.Router(); // 👈 Deve stare QUI, PRIMA di usarlo

// Lista fatture
router.get('/', (req, res) => {
  const { fatture } = ensureCompany(req.companyId);
  res.json(fatture);
});

// Crea fattura
router.post('/', (req, res) => {
  const fatture = ensureCompany(req.companyId).fatture;
  const data = req.body;
  const nuova = {
    id: uuid(),
    numero: data.numero || '',
    emissario: data.emissario || '',
    categoria: data.categoria || '',
    data: data.data || '',
    scadenza: data.scadenza || '',
    importo: Number(data.importo) || 0,
    metodoPagamento: data.metodoPagamento || '',
    stato: data.stato || 'in_sospeso',
    note: data.note || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  fatture.push(nuova);
  res.status(201).json(nuova);
});

// Aggiorna fattura
router.put('/:id', (req, res) => {
  const fatture = ensureCompany(req.companyId).fatture;
  const idx = fatture.findIndex(f => f.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });

  fatture[idx] = { ...fatture[idx], ...req.body, updatedAt: new Date().toISOString() };
  res.json(fatture[idx]);
});

// Elimina fattura
router.delete('/:id', (req, res) => {
  const fatture = ensureCompany(req.companyId).fatture;
  const idx = fatture.findIndex(f => f.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });

  const [deleted] = fatture.splice(idx, 1);
  res.json(deleted);
});

module.exports = router;
