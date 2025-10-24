/**
 * API client – gestione multi-azienda
 * Aggiunge header x-company-id e semplifica le chiamate fetch.
 */

const DEFAULT_TIMEOUT = 15000;

function toQuery(params = {}) {
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null) return;
    Array.isArray(v) ? v.forEach(x => q.append(k, x)) : q.append(k, v);
  });
  const s = q.toString();
  return s ? `?${s}` : '';
}

async function doFetch(url, { method = 'GET', headers = {}, body, timeout = DEFAULT_TIMEOUT } = {}) {
  const ctrl = new AbortController();
  const id = setTimeout(() => ctrl.abort('timeout'), timeout);

  const opts = { method, headers: { Accept: 'application/json', ...headers }, signal: ctrl.signal };
  if (body) {
    opts.headers['Content-Type'] = 'application/json';
    opts.body = JSON.stringify(body);
  }

  let res;
  try {
    res = await fetch(url, opts);
  } catch (err) {
    clearTimeout(id);
    throw { message: err.name === 'AbortError' ? 'Timeout' : 'Errore di rete', status: 0 };
  }
  clearTimeout(id);

  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw { message: json.error || json.message || 'Errore API', status: res.status };
  return json;
}

/**
 * Factory per creare un client legato a una company
 */
export function createApiClient({ companyId, baseUrl, timeout = DEFAULT_TIMEOUT } = {}) {
  if (!companyId) throw new Error('companyId obbligatorio');
  const BASE = baseUrl || import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

  const req = (method, path, { params, headers, body } = {}) =>
    doFetch(`${BASE}${path}${toQuery(params)}`, {
      method,
      headers: { 'x-company-id': companyId, ...headers },
      body,
      timeout,
    });

  return {
    get: (path, opts) => req('GET', path, opts),
    post: (path, body, opts) => req('POST', path, { ...opts, body }),
    put: (path, body, opts) => req('PUT', path, { ...opts, body }),
    del: (path, opts) => req('DELETE', path, opts),
    health: () => doFetch(`${BASE}/health`, { headers: { 'x-company-id': companyId } }),
    _config: { BASE, companyId },
  };
}
