/**
 * StoreContext.jsx
 * Gestisce azienda attiva, lista aziende e notifiche dinamiche (refresh automatico)
 */
import { createContext, useContext, useState, useEffect } from "react";
import { createApiClient } from "../lib/api";

const StoreContext = createContext();

export function StoreProvider({ children }) {
  const [companies] = useState([
    { id: "1", name: "Tech Srl" },
    { id: "2", name: "Bar Fancellis" },
    { id: "3", name: "G&G Consulting" },
  ]);
  const [company, setCompany] = useState(companies[0]);
  const [alerts, setAlerts] = useState({ scadute: 0, inScadenza: 0, lastUpdate: null });

  // Funzione per aggiornare i conteggi di scadenze e scadute
  async function updateAlerts(currentCompany) {
    try {
      const api = createApiClient(currentCompany.id);
      const list = await api.get("/fatture");
      const oggi = new Date();
      let scadute = 0;
      let inScadenza = 0;
      list.forEach((f) => {
        if (!f.scadenza || f.stato === "pagata") return;
        const dataScadenza = new Date(f.scadenza);
        const diffGiorni = Math.floor((dataScadenza - oggi) / (1000 * 60 * 60 * 24));
        if (diffGiorni < 0) scadute++;
        else if (diffGiorni <= 7) inScadenza++;
      });
      setAlerts({
        scadute,
        inScadenza,
        lastUpdate: new Date().toISOString(),
      });
    } catch {
      setAlerts({ scadute: 0, inScadenza: 0, lastUpdate: new Date().toISOString() });
    }
  }

  // 🔁 Esegui al cambio azienda e ogni 5 minuti
  useEffect(() => {
    if (!company) return;
    updateAlerts(company); // aggiornamento iniziale

    const interval = setInterval(() => {
      updateAlerts(company);
    }, 5 * 60 * 1000); // ogni 5 minuti

    return () => clearInterval(interval);
  }, [company]);

  return (
    <StoreContext.Provider value={{ company, setCompany, companies, alerts }}>
      {children}
    </StoreContext.Provider>
  );
}

export const useStore = () => useContext(StoreContext);
