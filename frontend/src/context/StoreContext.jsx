import { createContext, useContext, useState } from "react";

const StoreContext = createContext();

export function StoreProvider({ children }) {
  const [companies, setCompanies] = useState([
    { id: "1", name: "Azienda Demo" },
  ]);
  const [company, setCompany] = useState(companies[0]);

  return (
    <StoreContext.Provider value={{ companies, company, setCompany }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  return useContext(StoreContext);
}

