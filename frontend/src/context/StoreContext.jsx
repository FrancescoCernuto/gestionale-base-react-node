import React, { createContext, useContext, useMemo, useState } from 'react'

const StoreContext = createContext(null)

export function StoreProvider({ children }) {
  const [company, setCompany] = useState('Bar Fancellis')
  const companies = ['Bar Fancellis', 'G&G', 'Terza Azienda']

  const value = useMemo(()=> ({ company, setCompany, companies }), [company])
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('StoreContext missing')
  return ctx
}
