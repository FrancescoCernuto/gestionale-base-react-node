/**
 * Utenze.jsx
 * Gestione bollette e utenze periodiche
 */
import { useState } from "react";
import { useCrud } from "../hooks/useCrud";

export default function Utenze() {
  const { data: utenze, add, update, remove, loading } = useCrud("utenze");
  const [form, setForm] = useState({
    fornitore: "",
    tipo: "",
    importo: "",
    scadenza: "",
    stato: "in_sospeso",
    note: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.fornitore || !form.tipo || !form.scadenza) return;
    await add(form);
    setForm({ fornitore: "", tipo: "", importo: "", scadenza: "", stato: "in_sospeso", note: "" });
  };

  const togglePagata = async (id, stato) => {
    const nuovo = stato === "pagata" ? "in_sospeso" : "pagata";
    await update(id, { stato: nuovo });
  };

  return (
    <div className="container py-3">
      <h4 className="mb-3">Utenze</h4>

      <form className="row g-2 align-items-end mb-4" onSubmit={handleSubmit}>
        <div className="col-md-2">
          <label className="form-label small">Fornitore</label>
          <input
            className="form-control form-control-sm"
            value={form.fornitore}
            onChange={(e) => setForm({ ...form, fornitore: e.target.value })}
            required
          />
        </div>
        <div className="col-md-2">
          <label className="form-label small">Tipo</label>
          <select
            className="form-select form-select-sm"
            value={form.tipo}
            onChange={(e) => setForm({ ...form, tipo: e.target.value })}
            required
          >
            <option value="">Seleziona</option>
            <option>Luce</option>
            <option>Gas</option>
            <option>Acqua</option>
            <option>Internet</option>
            <option>Telefono</option>
            <option>Altro</option>
          </select>
        </div>
        <div className="col-md-2">
          <label className="form-label small">Importo (€)</label>
          <input
            type="number"
            className="form-control form-control-sm"
            value={form.importo}
            onChange={(e) => setForm({ ...form, importo: e.target.value })}
            min="0"
          />
        </div>
        <div className="col-md-2">
          <label className="form-label small">Scadenza</label>
          <input
            type="date"
            className="form-control form-control-sm"
            value={form.scadenza}
            onChange={(e) => setForm({ ...form, scadenza: e.target.value })}
            required
          />
        </div>
        <div className="col-md-2">
          <label className="form-label small">Stato</label>
          <select
            className="form-select form-select-sm"
            value={form.stato}
            onChange={(e) => setForm({ ...form, stato: e.target.value })}
          >
            <option value="in_sospeso">In sospeso</option>
            <option value="pagata">Pagata</option>
          </select>
        </div>
        <div className="col-md-2 d-grid">
          <button className="btn btn-primary btn-sm" type="submit">
            Aggiungi
          </button>
        </div>
      </form>

      {loading ? (
        <div>Caricamento...</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-sm table-striped align-middle">
            <thead className="table-light">
              <tr>
                <th>Fornitore</th>
                <th>Tipo</th>
                <th>Importo (€)</th>
                <th>Scadenza</th>
                <th>Stato</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {utenze.map((u) => {
                const scadenza = u.scadenza
                  ? new Date(u.scadenza).toLocaleDateString("it-IT")
                  : "-";
                const today = new Date();
                const diff =
                  new Date(u.scadenza) - today < 0 && u.stato !== "pagata";
                return (
                  <tr
                    key={u.id}
                    className={diff ? "table-warning" : ""}
                    style={{ cursor: "default" }}
                  >
                    <td>{u.fornitore}</td>
                    <td>{u.tipo}</td>
                    <td>{Number(u.importo).toFixed(2)}</td>
                    <td>{scadenza}</td>
                    <td>
                      <span
                        className={`badge ${
                          u.stato === "pagata"
                            ? "bg-success"
                            : diff
                            ? "bg-danger"
                            : "bg-warning text-dark"
                        }`}
                      >
                        {u.stato}
                      </span>
                    </td>
                    <td className="text-end">
                      <button
                        className="btn btn-sm btn-outline-success me-1"
                        onClick={() => togglePagata(u.id, u.stato)}
                      >
                        {u.stato === "pagata" ? "↺" : "✓"}
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => remove(u.id)}
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
