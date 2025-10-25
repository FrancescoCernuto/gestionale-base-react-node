/**
 * Sidebar – navigazione principale multi-azienda
 */
import { NavLink } from "react-router-dom";
import { useStore } from "../context/StoreContext";

export default function Sidebar() {
  const { company, setCompany, companies } = useStore();

  return (
    <div
      className="bg-white border-end p-3"
      style={{ width: "240px", minHeight: "100vh" }}
    >
      <h5 className="mb-3 text-primary">Gestionale</h5>

      {/* Selettore azienda */}
      <div className="mb-4">
        <label className="form-label small text-muted">Azienda</label>
        <select
  className="form-select form-select-sm"
  value={company?.id || ""}
  onChange={(e) =>
    setCompany(companies?.find((c) => c.id === e.target.value))
  }
>
  {(companies || []).map((c) => (
    <option key={c.id} value={c.id}>
      {c.name}
    </option>
  ))}
</select>

      </div>

      {/* Navigazione */}
      <nav className="nav flex-column">
        <NavLink to="/dashboard" className="nav-link text-dark">
          📊 Dashboard
        </NavLink>
        <NavLink to="/fatture" className="nav-link text-dark">
          💰 Fatture
        </NavLink>
        <NavLink to="/utenze" className="nav-link text-dark">
          🔌 Utenze
        </NavLink>
        <hr />
        <NavLink to="/fornitori-beni" className="nav-link text-dark">
          📦 Fornitori Beni
        </NavLink>
        <NavLink to="/fornitori-servizi" className="nav-link text-dark">
          🧰 Fornitori Servizi
        </NavLink>
      </nav>
    </div>
  );
}
