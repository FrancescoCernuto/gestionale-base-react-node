import { useState, useEffect, useCallback, useMemo } from "react";
import { useStore } from "../context/StoreContext";
import { createApiClient } from "../lib/api";

/**
 * Hook CRUD generico e stabile (niente loop di fetch).
 */
export function useCrud(resource) {
  const { company } = useStore();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔒 Memo: l'API client cambia solo se cambia l'azienda
  const api = useMemo(() => {
    return company ? createApiClient(company.id) : null;
  }, [company?.id]);

  const fetchAll = useCallback(async () => {
    if (!api) return;
    setLoading(true);
    setError(null);
    try {
      const list = await api.get(`/${resource}`, { cache: "no-store" });
      setData(Array.isArray(list) ? list : []);
    } catch (e) {
      setError(e.message || "Errore di caricamento");
    } finally {
      setLoading(false);
    }
  }, [api, resource]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const add = async (payload) => {
    const created = await api.post(`/${resource}`, payload);
    setData((prev) => [...prev, created]);
  };

  const update = async (id, payload) => {
    const updated = await api.put(`/${resource}/${id}`, payload);
    setData((prev) => prev.map((x) => (x.id === id ? updated : x)));
  };

  const remove = async (id) => {
    await api.delete(`/${resource}/${id}`);
    setData((prev) => prev.filter((x) => x.id !== id));
  };

  return { data, loading, error, add, update, remove, refetch: fetchAll };
}
