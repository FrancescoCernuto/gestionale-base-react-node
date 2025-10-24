/**
 * Hook useApi – ritorna un client API legato all'azienda attiva
 * (usa il company.id del contesto globale)
 */
import { useMemo } from 'react';
import { createApiClient } from '../lib/api';
import { useStore } from '../context/StoreContext';

export function useApi() {
  const { company } = useStore();
  return useMemo(() => createApiClient({ companyId: company.id }), [company.id]);
}
