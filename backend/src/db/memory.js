// db/memory.js
// In-memory store per ogni azienda (mock finché non usiamo SQLite)

const _db = new Map();

export function ensureCompany(companyId = "default") {
  if (!_db.has(companyId)) {
    _db.set(companyId, {
      fatture: [],
      utenze: [],
      fornitoriBeni: [],
      fornitoriServizi: [],
      profile: {
        // Identità
        denominazione: "",
        formaGiuridica: "",
        partitaIVA: "",
        codiceFiscale: "",
        codiceREA: "",
        numeroRI: "",
        ateco: "",
        regimeFiscale: "",
        dataCostituzione: "",

        // Sedi
        sedeLegale: {
          indirizzo: "",
          cap: "",
          comune: "",
          provincia: "",
          nazione: "IT",
        },
        sedeOperativa: {
          indirizzo: "",
          cap: "",
          comune: "",
          provincia: "",
          nazione: "IT",
        },

        // Contatti & Fatturazione Elettronica
        pec: "",
        codiceDestinatario: "",
        email: "",
        telefono: "",
        sito: "",

        // Banca
        iban: "",
        banca: "",

        // Rappresentante legale
        rappresentante: {
          nome: "",
          cognome: "",
          codiceFiscale: "",
          ruolo: "Legale Rappresentante",
        },

        note: "",
        updatedAt: null,
      },
    });
  }
  return _db.get(companyId);
}
