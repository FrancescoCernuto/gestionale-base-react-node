// Ogni azienda ha il proprio spazio dati
const store = new Map();

function ensureCompany(companyId) {
  if (!store.has(companyId)) {
    store.set(companyId, { fatture: [] });
  }
  return store.get(companyId);
}

module.exports = { ensureCompany };
