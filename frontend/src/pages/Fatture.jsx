/**
 * Pagina Fatture – con scadenza, fornitore e filtri avanzati
 */
import { useState, useMemo } from "react";
import { useCrud } from "../hooks/useCrud";

export default function Fatture() {
  const { data, loading, error, add, remove } = useCrud("fatture");
  const { data: fornitoriServizi } = useCrud("fornitori-servizi");
  const { data: fornitoriBeni } = useCrud("fornitori-beni");

  const [form, setForm] = useState({
    numero: "",
    importo: "",
    categoria: "",
    metodoPagamento: "",
    stato: "in_sospeso",
    scadenza: "",
    fornitoreId: "",
    file: null,
  });
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [filtroStato, setFiltroStato] = useState("");
  const [search, setSearch] = useState("");

  const categorie = ["Vendite", "Acquisti", "Servizi", "Altro"];
  const metodi = ["Contanti", "Carta", "Bonifico", "Assegno"];
  const stati = ["in_sospeso", "pagata", "scaduta"];

  const tuttiFornitori = [...fornitoriBeni, ...fornitoriServizi];

  const oggi = new Date();
  const filtrate = useMemo(() => {
    return data
      .map((f) => {
        // Calcola scaduta
        const scadenza = f.scadenza ? new Date(f.scadenza) : null;
        const scaduta =
          scadenza && scadenza < oggi && f.stato !== "pagata" ? "scaduta" : f.stato;
        return { ...f, stato: scaduta };
      })
      .filter((f) => {
        const matchCat = filtroCategoria ? f.categoria === filtroCategoria : true;
        const matchStato = filtroStato ? f.stato === filtroStato : true;
        const matchSearch = search
          ? f.numero.toLowerCase().includes(search.toLowerCase())
          : true;
        return matchCat && matchStato && matchSearch;
      });
  }, [data, filtroCategoria, filtroStato, search]);

  const submit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => {
      if (k !== "file") fd.append(k, v || "");
    });
    if (form.file) fd.append("file", form.file);

    await add(fd);
    setForm({
      numero: "",
      importo: "",
      categoria: "",
      metodoPagamento: "",
      stato: "in_sospeso",
      scadenza: "",
      fornitoreId: "",
      file: null,
    });
  };

  return (
    <div className="container-fluid py-3">
      <h4 className="mb-3">Fatture</h4>

      {/* Form di creazione */}
      <form onSubmit={submit} className="row g-2 mb-3 align-items-center">
        <div className="col-md-2">
          <input
            type="text"
            className="form-control"
            placeholder="Numero"
            value={form.numero}
            onChange={(e) => setForm({ ...form, numero: e.target.value })}
          />
        </div>
        <div className="col-md-2">
          <input
            type="number"
            className="form-control"
            placeholder="Importo (€)"
            value={form.importo}
            onChange={(e) => setForm({ ...form, importo: e.target.value })}
          />
        </div>
        <div className="col-md-2">
          <input
            type="date"
            className="form-control"
            value={form.scadenza}
            onChange={(e) => setForm({ ...form, scadenza: e.target.value })}
          />
        </div>
        <div className="col-md-2">
          <select
            className="form-select"
            value={form.categoria}
            onChange={(e) => setForm({ ...form, categoria: e.target.value })}
          >
            <option value="">Categoria</option>
            {categorie.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="col-md-2">
          <select
            className="form-select"
            value={form.metodoPagamento}
            onChange={(e) =>
              setForm({ ...form, metodoPagamento: e.target.value })
            }
          >
            <option value="">Metodo</option>
            {metodi.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
        </div>
        <div className="col-md-2">
          <select
            className="form-select"
            value={form.fornitoreId}
            onChange={(e) =>
              setForm({ ...form, fornitoreId: e.target.value })
            }
          >
            <option value="">Fornitore</option>
            {tuttiFornitori.map((f) => (
              <option key={f.id} value={f.id}>
                {f.nome}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-3">
          <input
            type="file"
            className="form-control"
            onChange={(e) => setForm({ ...form, file: e.target.files[0] })}
          />
        </div>
        <div className="col-md-2">
          <button className="btn btn-primary w-100" type="submit">
            Aggiungi
          </button>
        </div>
      </form>

      {/* Filtri */}
      <div className="row g-2 mb-3">
        <div className="col-md-3">
          <select
            className="form-select"
            value={filtroCategoria}
            onChange={(e) => setFiltroCategoria(e.target.value)}
          >
            <option value="">Filtra per categoria</option>
            {categorie.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="col-md-3">
          <select
            className="form-select"
            value={filtroStato}
            onChange={(e) => setFiltroStato(e.target.value)}
          >
            <option value="">Filtra per stato</option>
            {stati.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Cerca per numero..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
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
              <th>Numero</th>
              <th>Importo (€)</th>
              <th>Categoria</th>
              <th>Metodo</th>
              <th>Scadenza</th>
              <th>Stato</th>
              <th>Fornitore</th>
              <th>Allegato</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtrate.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center text-muted">
                  Nessuna fattura trovata
                </td>
              </tr>
            ) : (
              filtrate.map((f) => {
                const fornitore =
                  tuttiFornitori.find((x) => x.id === f.fornitoreId)?.nome || "—";
                return (
                  <tr key={f.id}>
                    <td>{f.numero}</td>
                    <td>{f.importo}</td>
                    <td>{f.categoria}</td>
                    <td>{f.metodoPagamento}</td>
                    <td>{f.scadenza || "—"}</td>
                    <td>{f.stato}</td>
                    <td>{fornitore}</td>
                    <td>
                      {f.allegato ? (
                        <a
                          href={`http://localhost:4000/api/fatture/uploads/${f.allegato}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Apri
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => remove(f.id)}
                      >
                        Elimina
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
