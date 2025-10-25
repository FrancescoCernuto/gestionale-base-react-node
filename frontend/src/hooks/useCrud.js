import { useEffect, useState } from "react";
import { useStore } from "../context/StoreContext";

export function useCrud(endpoint) {
  const { company } = useStore();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const baseUrl = "http://localhost:4000/api";

  useEffect(() => {
    if (!company) return;
    fetch(`${baseUrl}/${endpoint}`, {
      headers: { "x-company-id": company.id },
    })
      .then((r) => r.json())
      .then((json) => setData(Array.isArray(json) ? json : []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [company, endpoint]);

  const add = async (item) => {
    if (!company) return;
    const res = await fetch(`${baseUrl}/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-company-id": company.id,
      },
      body: JSON.stringify(item),
    });
    const nuovo = await res.json();
    setData((d) => [...d, nuovo]);
  };

  const remove = async (id) => {
    if (!company) return;
    await fetch(`${baseUrl}/${endpoint}/${id}`, {
      method: "DELETE",
      headers: { "x-company-id": company.id },
    });
    setData((d) => d.filter((x) => x.id !== id));
  };

  return { data, loading, error, add, remove };
}
