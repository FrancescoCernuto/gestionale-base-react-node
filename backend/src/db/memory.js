// Un "database" in memoria condiviso tra le rotte
const memoryDB = {};

export function ensureCompany(companyId) {
  if (!memoryDB[companyId]) {
    memoryDB[companyId] = {
      fatture: [],
      utenze: [],
      fornitoriBeni: [],
      fornitoriServizi: [],
    };
  }
  return memoryDB[companyId];
}

export function getAll() {
  return memoryDB;
}
