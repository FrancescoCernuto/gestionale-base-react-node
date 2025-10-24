/**
 * Test API – verifica connessione con backend
 */
import { useEffect, useState } from 'react';
import { useApi } from '../hooks/useApi';

export default function TestApi() {
  const api = useApi();
  const [status, setStatus] = useState('Verifica in corso...');

  useEffect(() => {
    api.health()
      .then(data => setStatus(`✅ OK ${data.ts}`))
      .catch(err => setStatus(`❌ ${err.message || 'Errore di connessione'}`));
  }, [api]);

  return (
    <div className="container py-4">
      <h4>Test API / Healthcheck</h4>
      <p>{status}</p>
    </div>
  );
}
