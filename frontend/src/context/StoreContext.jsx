/**
 * StoreContext.jsx
 * Gestisce azienda attiva e stato globale condiviso (es. notifiche dashboard)
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
  const [alerts, setAlerts] = useState({ scadute: 0, inScadenza: 0 });

  // 🔁 Calcola automaticamente fatture in scadenza/scadute per l'azienda attiva
  useEffect(() => {
    if (!company) return;
    const api = createApiClient(company.id);
    api.get("/fatture")
      .then((list) => {
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
        setAlerts({ scadute, inScadenza });
      })
      .catch(() => setAlerts({ scadute: 0, inScadenza: 0 }));
  }, [company]);

  return (
    <StoreContext.Provider value={{ company, setCompany, companies, alerts }}>
      {children}
    </StoreContext.Provider>
  );
}

export const useStore = () => useContext(StoreContext);

