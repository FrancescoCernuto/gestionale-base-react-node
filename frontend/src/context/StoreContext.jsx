import { createContext, useContext, useState } from 'react';

const StoreContext = createContext();

export function StoreProvider({ children }) {
  // default azienda (fissa per ora)
  const [company, setCompany] = useState({ id: 'bar-fancellis', name: 'Bar Fancellis' });

  return (
    <StoreContext.Provider value={{ company, setCompany }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore deve essere usato dentro StoreProvider');
  return ctx;
}
