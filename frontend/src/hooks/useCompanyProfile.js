/**
 * useCompanyProfile.js
 * Hook React per gestire il profilo aziendale (fetch + update)
 */
import { useEffect, useState, useCallback, useMemo } from "react";
import { useStore } from "../context/StoreContext";
import { createApiClient } from "../lib/api";

export function useCompanyProfile() {
  const { company } = useStore();
  const api = useMemo(() => (company ? createApiClient(company.id) : null), [company?.id]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    if (!api) return;
    setLoading(true);
    setError(null);
    try {
      const data = await api.get("/company");
      setProfile(data);
    } catch (err) {
      setError(err.message || "Errore caricamento profilo");
    } finally {
      setLoading(false);
    }
  }, [api]);

  const save = useCallback(
    async (partial) => {
      const data = await api.put("/company", partial);
      setProfile(data);
      return data;
    },
    [api]
  );

  useEffect(() => {
    load();
  }, [load]);

  return { profile, loading, error, save, reload: load };
}
