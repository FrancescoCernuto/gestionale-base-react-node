/**
 * StoreContext.jsx
 * Gestisce azienda attiva, alert dinamici con refresh ogni 5 min e toast
 */
import { createContext, useContext, useState, useEffect, useRef } from "react";
import { createApiClient } from "../lib/api";
import toast from "react-hot-toast";

const StoreContext = createContext();

export function StoreProvider({ children }) {
  const [companies] = useState([
    { id: "1", name: "Tech Srl" },
    { id: "2", name: "Bar Fancellis" },
    { id: "3", name: "G&G Consulting" },
  ]);
  const [company, setCompany] = useState(companies[0]);
  const [alerts, setAlerts] = useState({
    scadute: 0,
    inScadenza: 0,
    lastUpdate: null,
  });
  const prevAlerts = useRef({ scadute: 0, inScadenza: 0 });

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

      // 🔔 Mostra toast solo se ci sono novità
      if (
        scadute > prevAlerts.current.scadute ||
        inScadenza > prevAlerts.current.inScadenza
      ) {
        toast(`🔔 Nuove scadenze: ${inScadenza} in arrivo, ${scadute} scadute`, {
          icon: "⚠️",
        });
      }

      prevAlerts.current = { scadute, inScadenza };
      setAlerts({ scadute, inScadenza, lastUpdate: new Date().toISOString() });
    } catch {
      setAlerts({
        scadute: 0,
        inScadenza: 0,
        lastUpdate: new Date().toISOString(),
      });
    }
  }

  useEffect(() => {
    if (!company) return;
    updateAlerts(company);
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
