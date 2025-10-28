/**
 * API client centralizzato con header x-company-id e JSON body.
 */
export function createApiClient(companyId) {
  if (!companyId) throw new Error("companyId obbligatorio");

  const baseUrl = "http://localhost:4000/api";

  async function request(url, options = {}) {
    const headers = {
      "Content-Type": "application/json",
      "x-company-id": companyId,
      ...options.headers,
    };

    const res = await fetch(baseUrl + url, { ...options, headers });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Errore API ${res.status}: ${text}`);
    }
    return res.json();
  }

  return {
    get: (url) => request(url),
    post: (url, data) =>
      request(url, { method: "POST", body: JSON.stringify(data) }),
    put: (url, data) =>
      request(url, { method: "PUT", body: JSON.stringify(data) }),
    delete: (url) => request(url, { method: "DELETE" }),
  };
}
