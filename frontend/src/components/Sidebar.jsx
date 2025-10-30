/**
 * Sidebar.jsx
 * Navigazione principale + badge alert + orario ultimo aggiornamento
 */
import { NavLink } from "react-router-dom";
import { useStore } from "../context/StoreContext";

export default function Sidebar() {
  const { companies, company, setCompany, alerts } = useStore();

  const formatTime = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    return d.toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="bg-white border-end p-3 d-flex flex-column" style={{ width: 240, minHeight: "100vh" }}>
      <div>
        <h5 className="text-primary mb-3">Gestionale</h5>

        <div className="mb-3">
          <label className="form-label small text-muted">Azienda attiva</label>
          <select
            className="form-select form-select-sm"
            value={company?.id || ""}
            onChange={(e) =>
              setCompany(companies.find((c) => c.id === e.target.value))
            }
          >
            {companies.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {alerts.lastUpdate && (
            <div className="text-muted small mt-1">
              Ultimo agg. {formatTime(alerts.lastUpdate)}
            </div>
          )}
        </div>

        <nav className="nav flex-column small">
          <NavLink to="/dashboard" className="nav-link">
            Dashboard{" "}
            {(alerts.scadute > 0 || alerts.inScadenza > 0) && (
              <span className="badge bg-danger ms-1">
                {alerts.scadute + alerts.inScadenza}
              </span>
            )}
          </NavLink>
          <NavLink to="/fatture" className="nav-link">
            Fatture
          </NavLink>
          <NavLink to="/utenze" className="nav-link">
            Utenze
          </NavLink>
          <NavLink to="/fornitori-beni" className="nav-link">
            Fornitori Beni
          </NavLink>
          <NavLink to="/fornitori-servizi" className="nav-link">
            Fornitori Servizi
          </NavLink>
          <NavLink to="/profilo" className="nav-link">
          Profilo Azienda</NavLink>
        </nav>
      </div>

      <div className="mt-auto text-center small text-muted border-top pt-3">
        © {new Date().getFullYear()} Gestionale Multi-Azienda
      </div>
    </div>
  );
}
