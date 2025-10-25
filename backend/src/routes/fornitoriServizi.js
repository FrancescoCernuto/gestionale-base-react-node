/**
 * Pagina Fornitori Servizi – CRUD completo
 */
import { useState, useMemo } from "react";
import { useCrud } from "../hooks/useCrud";

export default function FornitoriServizi() {
  const { data, loading, error, add, remove } = useCrud("fornitori-servizi");
  const [form, setForm] = useState({ nome: "", servizio: "", contatti: "", stato: "attivo" });
  const [search, setSearch] = useState("");
  const [filtroStato, setFiltroStato] = useState("");

  const filtrati = useMemo(() => {
    return data.filter((f) => {
      const matchSearch = search
        ? f.nome.toLowerCase().includes(search.toLowerCase()) ||
          f.servizio.toLowerCase().includes(search.toLowerCase())
        : true;
      const matchStato = filtroStato ? f.stato === filtroStato : true;
      return matchSearch && matchStato;
    });
  }, [data, search, filtroStato]);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.nome) return;
    await add(form);
    setForm({ nome: "", servizio: "", contatti: "", stato: "attivo" });
  };

  return (
    <div className="container-fluid py-3">
      <h4>Fornitori Servizi</h4>

      <form onSubmit={submit} className="row g-2 mb-3">
        <div className="col-md-3">
          <input
            type="text"
            className="form-control"
            placeholder="Nome"
            value={form.nome}
            onChange={(e) => setForm({ ...form, nome: e.target.value })}
          />
        </div>
        <div className="col-md-3">
          <input
            type="text"
            className="form-control"
            placeholder="Servizio"
            value={form.servizio}
            onChange={(e) => setForm({ ...form, servizio: e.target.value })}
          />
        </div>
        <div className="col-md-3">
          <input
            type="text"
            className="form-control"
            placeholder="Contatti (email o telefono)"
            value={form.contatti}
            onChange={(e) => setForm({ ...form, contatti: e.target.value })}
          />
        </div>
        <div className="col-md-2">
          <select
            className="form-select"
            value={form.stato}
            onChange={(e) => setForm({ ...form, stato: e.target.value })}
          >
            <option value="attivo">Attivo</option>
            <option value="non_attivo">Non attivo</option>
          </select>
        </div>
        <div className="col-md-1">
          <button className="btn btn-primary w-100" type="submit">+</button>
        </div>
      </form>

      {/* Filtri */}
      <div className="row g-2 mb-3">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Cerca per nome o servizio..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <select
            className="form-select"
            value={filtroStato}
            onChange={(e) => setFiltroStato(e.target.value)}
          >
            <option value="">Tutti</option>
            <option value="attivo">Attivi</option>
            <option value="non_attivo">Non attivi</option>
          </select>
        </div>
      </div>

      {/* Tabella */}
      {error && <div className="alert alert-danger">{error}</div>}
      {loading ? (
        <p>Caricamento…</p>
      ) : (
        <table className="table table-striped align-middle shadow-sm rounded">
          <thead className="table-light">
            <tr>
              <th>Nome</th>
              <th>Servizio</th>
              <th>Contatti</th>
              <th>Stato</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtrati.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center text-muted">
                  Nessun fornitore trovato
                </td>
              </tr>
            ) : (
              filtrati.map((f) => (
                <tr key={f.id}>
                  <td>{f.nome}</td>
                  <td>{f.servizio}</td>
                  <td>{f.contatti}</td>
                  <td>{f.stato}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => remove(f.id)}
                    >
                      Elimina
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
