/**
 * Pagina Fatture – CRUD completo con filtri, ricerca e allegati
 * Versione aggiornata con anteprima/icona file
 */
import { useState, useMemo } from "react";
import { useCrud } from "../hooks/useCrud";

export default function Fatture() {
  const { data, loading, error, add, remove } = useCrud("fatture");

  const [form, setForm] = useState({
    numero: "",
    importo: "",
    categoria: "",
    metodoPagamento: "",
    stato: "in_sospeso",
    file: null,
  });
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [filtroStato, setFiltroStato] = useState("");
  const [search, setSearch] = useState("");

  const categorie = ["Vendite", "Acquisti", "Servizi", "Altro"];
  const metodi = ["Contanti", "Carta", "Bonifico", "Assegno"];
  const stati = ["in_sospeso", "pagata", "scaduta"];

  // filtro dinamico con ricerca
  const filtrate = useMemo(() => {
    return data.filter((f) => {
      const matchCat = filtroCategoria ? f.categoria === filtroCategoria : true;
      const matchStato = filtroStato ? f.stato === filtroStato : true;
      const matchSearch = search
        ? f.numero.toLowerCase().includes(search.toLowerCase()) ||
          f.emissario?.toLowerCase().includes(search.toLowerCase())
        : true;
      return matchCat && matchStato && matchSearch;
    });
  }, [data, filtroCategoria, filtroStato, search]);

  // invio form con FormData (per file)
  const submit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => {
      if (v) fd.append(k, v);
    });

    await add(fd);
    setForm({
      numero: "",
      importo: "",
      categoria: "",
      metodoPagamento: "",
      stato: "in_sospeso",
      file: null,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setForm({ ...form, file });
  };

  // funzione helper per icona o preview
  const renderAllegato = (fattura) => {
    if (!fattura.allegato)
      return <span className="text-muted">—</span>;

    const fileUrl = `http://localhost:4000/api/fatture/uploads/${fattura.allegato}`;
    const isImage = /\.(jpg|jpeg|png|gif)$/i.test(fattura.allegato);

    if (isImage) {
      return (
        <a href={fileUrl} target="_blank" rel="noreferrer">
          <img
            src={fileUrl}
            alt="allegato"
            style={{
              width: 40,
              height: 40,
              objectFit: "cover",
              borderRadius: 4,
              border: "1px solid #dee2e6",
            }}
          />
        </a>
      );
    }

    return (
      <a href={fileUrl} target="_blank" rel="noreferrer">
        📎
      </a>
    );
  };

  return (
    <div className="container-fluid py-3">
      <h4 className="mb-3">Fatture</h4>

      {/* Form per nuova fattura */}
      <form onSubmit={submit} className="row g-2 mb-4">
        <div className="col-md-2">
          <input
            type="text"
            className="form-control"
            placeholder="Numero"
            value={form.numero}
            onChange={(e) => setForm({ ...form, numero: e.target.value })}
            required
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
            value={form.stato}
            onChange={(e) => setForm({ ...form, stato: e.target.value })}
          >
            {stati.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-2">
          <input
            type="file"
            className="form-control"
            onChange={handleFileChange}
          />
        </div>

        <div className="col-12 text-end">
          <button className="btn btn-primary" type="submit">
            Aggiungi Fattura
          </button>
        </div>
      </form>

      {/* Filtri e ricerca */}
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
            placeholder="Cerca per numero o emissario..."
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
        <table className="table table-striped align-middle">
          <thead>
            <tr>
              <th>Numero</th>
              <th>Importo (€)</th>
              <th>Categoria</th>
              <th>Metodo</th>
              <th>Stato</th>
              <th>Allegato</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtrate.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center text-muted">
                  Nessuna fattura trovata
                </td>
              </tr>
            ) : (
              filtrate.map((f) => (
                <tr key={f.id}>
                  <td>{f.numero}</td>
                  <td>{f.importo}</td>
                  <td>{f.categoria}</td>
                  <td>{f.metodoPagamento}</td>
                  <td>{f.stato}</td>
                  <td>{renderAllegato(f)}</td>
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
