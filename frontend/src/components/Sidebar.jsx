/**
 * Sidebar.jsx
 * Navigazione principale con selettore azienda + link al profilo aziendale
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
    <div
      className="bg-white border-end p-3 d-flex flex-column"
      style={{ width: 240, minHeight: "100vh" }}
    >
      {/* intestazione */}
      <div>
        <h5 className="text-primary mb-3">Gestionale</h5>

        {/* Selettore azienda */}
        <div className="mb-2">
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

        {/* Link al profilo aziendale */}
        <div
          className="border-top pt-2 mt-2 mb-3"
          style={{ borderColor: "#dee2e6" }}
        >
          <NavLink
            to="/profilo"
            className={({ isActive }) =>
              `nav-link px-0 small fw-semibold ${
                isActive ? "text-primary" : "text-dark"
              }`
            }
          >
            🏢 Profilo Azienda
          </NavLink>
        </div>

        {/* Navigazione sezioni operative */}
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
        </nav>
      </div>

      {/* footer */}
      <div className="mt-auto text-center small text-muted border-top pt-3">
        © {new Date().getFullYear()} Gestionale Multi-Azienda
      </div>
    </div>
  );
}
