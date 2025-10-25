/**
 * useCrud – gestione base CRUD via API client
 */
import { useEffect, useState, useCallback } from 'react';
import { useApi } from './useApi';

export function useCrud(resource) {
  const api = useApi();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(`/${resource}`);
      setData(res);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [api, resource]);

  const add = async (payload) => {
    await api.post(`/${resource}`, payload);
    fetchAll();
  };

  const update = async (id, payload) => {
    await api.put(`/${resource}/${id}`, payload);
    fetchAll();
  };

  const remove = async (id) => {
    await api.del(`/${resource}/${id}`);
    fetchAll();
  };

  useEffect(() => { fetchAll(); }, [fetchAll]);

  return { data, loading, error, add, update, remove, refetch: fetchAll };
}
