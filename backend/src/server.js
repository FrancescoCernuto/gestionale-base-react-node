/**
 * Server Express – API Gestionale Multi-Azienda
 * Gestisce le rotte REST con header x-company-id e storage in memoria.
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const companyContext = require('./middleware/companyContext');

const app = express();

// Middleware base
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Healthcheck
app.get('/api/health', (req, res) => {
  res.json({ ok: true, ts: new Date().toISOString() });
});

// Middleware per la gestione multi-azienda
app.use('/api', companyContext);

// Rotte CRUD
app.use('/api/fatture', require('./routes/fatture'));

// (in futuro) altre risorse
// app.use('/api/utenze', require('./routes/utenze'));
// app.use('/api/fornitori-beni', require('./routes/fornitoriBeni'));
// app.use('/api/fornitori-servizi', require('./routes/fornitoriServizi'));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ API server running at http://localhost:${PORT}`);
});
