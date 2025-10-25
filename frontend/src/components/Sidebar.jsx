import { NavLink } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

export default function Sidebar() {
  const { company, setCompany } = useStore();

  // Lista fissa delle aziende disponibili
  const companies = [
    { id: 'bar-fancellis', name: 'Bar Fancellis' },
    { id: 'g-and-g', name: 'G & G' },
    { id: 'terza-azienda', name: 'Terza Azienda' },
  ];

  // Se il contesto non ha ancora un'azienda, imposta la prima
  if (!company) {
    setCompany(companies[0]);
    return null; // evita errore al primo render
  }

  return (
    <div
      className="d-flex flex-column p-3 border-end bg-white"
      style={{ width: 260, minHeight: '100vh' }}
    >
      <h5 className="mb-3">Gestionale</h5>

      {/* Selettore azienda */}
      <div className="mb-4">
        <label className="form-label">Azienda</label>
        <select
          className="form-select"
          value={company.id}
          onChange={(e) =>
            setCompany(companies.find((c) => c.id === e.target.value))
          }
        >
          {Array.isArray(companies) &&
            companies.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
        </select>
      </div>

      {/* Navigazione principale */}
      <ul className="nav nav-pills flex-column gap-1">
        <li className="nav-item">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              'nav-link ' + (isActive ? 'active' : '')
            }
          >
            Dashboard
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink
            to="/fatture"
            className={({ isActive }) =>
              'nav-link ' + (isActive ? 'active' : '')
            }
          >
            Fatture
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink
            to="/utenze"
            className={({ isActive }) =>
              'nav-link ' + (isActive ? 'active' : '')
            }
          >
            Utenze
          </NavLink>
        </li>
      </ul>

      <div className="mt-auto small text-muted">
        Attiva: <strong>{company?.name}</strong>
      </div>
    </div>
  );
}
