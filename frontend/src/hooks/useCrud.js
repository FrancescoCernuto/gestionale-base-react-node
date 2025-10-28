import { useState, useEffect, useCallback } from "react";
import { useStore } from "../context/StoreContext";
import { createApiClient } from "../lib/api";

/**
 * Hook CRUD generico per una risorsa (fatture, utenze, ecc.)
 */
export function useCrud(resource) {
  const { company } = useStore();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const api = company ? createApiClient(company.id) : null;

  const fetchAll = useCallback(async () => {
    if (!api) return;
    setLoading(true);
    try {
      const list = await api.get(`/${resource}`);
      setData(Array.isArray(list) ? list : []);
    } catch (e) {
      setError(e.message);
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
