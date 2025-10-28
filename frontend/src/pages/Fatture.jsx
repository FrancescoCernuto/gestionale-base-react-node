/**
 * Pagina Fatture – date emissione/scadenza + cambio stato persistente
 */
import { useState, useMemo } from "react";
import { useCrud } from "../hooks/useCrud";

export default function Fatture() {
  const { data, loading, error, add, update, remove } = useCrud("fatture");

  const [form, setForm] = useState({
    numero: "",
    emissario: "",
    categoria: "",
    data: "",
    scadenza: "",
    importo: "",
    metodoPagamento: "",
    stato: "in_sospeso",
    note: "",
    allegato: null,
  });

  const [search, setSearch] = useState("");
  const [filtroStato, setFiltroStato] = useState("");

  const isScaduta = (f) => {
    if (!f.scadenza || f.stato === "pagata") return false;
    return new Date(f.scadenza) < new Date();
  };

  const dataVista = data.map((f) =>
    isScaduta(f) && f.stato !== "pagata" ? { ...f, stato: "scaduta" } : f
  );

  const filtrate = useMemo(() => {
    return dataVista.filter((f) => {
      const s = search.trim().toLowerCase();
      const matchSearch = s
        ? (f.numero || "").toLowerCase().includes(s) ||
          (f.emissario || "").toLowerCase().includes(s) ||
          (f.categoria || "").toLowerCase().includes(s)
        : true;
      const matchStato = filtroStato ? f.stato === filtroStato : true;
      return matchSearch && matchStato;
    });
  }, [dataVista, search, filtroStato]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files?.length > 0) {
      setForm((p) => ({ ...p, allegato: files[0].name }));
    } else {
      setForm((p) => ({ ...p, [name]: value }));
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.numero || !form.emissario || !form.importo) return;

    const nuova = {
      ...form,
      importo: parseFloat(form.importo),
      data: form.data || new Date().toISOString().slice(0, 10),
    };

    await add(nuova);
    setForm({
      numero: "",
      emissario: "",
      categoria: "",
      data: "",
      scadenza: "",
      importo: "",
      metodoPagamento: "",
      stato: "in_sospeso",
      note: "",
      allegato: null,
    });
  };

  const cambiaStato = async (fattura, nuovoStato) => {
    await update(fattura.id, { stato: nuovoStato });
  };

  return (
    <div className="container-fluid py-3">
      <h4>Fatture</h4>

      {/* Form */}
      <form onSubmit={submit} className="row g-2 mb-4">
        <div className="col-md-2"><input name="numero" className="form-control" placeholder="Numero" value={form.numero} onChange={handleChange}/></div>
        <div className="col-md-2"><input name="emissario" className="form-control" placeholder="Emissario" value={form.emissario} onChange={handleChange}/></div>
        <div className="col-md-2"><input name="categoria" className="form-control" placeholder="Categoria" value={form.categoria} onChange={handleChange}/></div>
        <div className="col-md-2"><input type="date" name="data" className="form-control" value={form.data} onChange={handleChange}/></div>
        <div className="col-md-2"><input type="date" name="scadenza" className="form-control" value={form.scadenza} onChange={handleChange}/></div>
        <div className="col-md-2"><input type="number" name="importo" className="form-control" placeholder="Importo (€)" value={form.importo} onChange={handleChange}/></div>
        <div className="col-md-2">
          <select name="metodoPagamento" className="form-select" value={form.metodoPagamento} onChange={handleChange}>
            <option value="">Metodo</option>
            <option value="bonifico">Bonifico</option>
            <option value="contanti">Contanti</option>
            <option value="carta">Carta</option>
            <option value="assegno">Assegno</option>
          </select>
        </div>
        <div className="col-md-2"><input name="note" className="form-control" placeholder="Note" value={form.note} onChange={handleChange}/></div>
        <div className="col-md-2"><input type="file" name="allegato" className="form-control" onChange={handleChange}/></div>
        <div className="col-md-1 d-grid"><button type="submit" className="btn btn-primary">+</button></div>
      </form>

      {/* Filtri */}
      <div className="row g-2 mb-3">
        <div className="col-md-6">
          <input type="text" className="form-control" placeholder="Cerca per numero, emissario o categoria..." value={search} onChange={(e)=>setSearch(e.target.value)}/>
        </div>
        <div className="col-md-3">
          <select className="form-select" value={filtroStato} onChange={(e)=>setFiltroStato(e.target.value)}>
            <option value="">Tutti gli stati</option>
            <option value="in_sospeso">In sospeso</option>
            <option value="pagata">Pagate</option>
            <option value="scaduta">Scadute</option>
          </select>
        </div>
      </div>

      {/* Tabella */}
      {error && <div className="alert alert-danger">{error}</div>}
      {loading ? <p>Caricamento…</p> : (
        <table className="table table-striped align-middle shadow-sm rounded">
          <thead className="table-light">
            <tr>
              <th>Numero</th><th>Emissario</th><th>Categoria</th>
              <th>Data</th><th>Scadenza</th><th>Importo (€)</th>
              <th>Metodo</th><th>Stato</th><th>Note</th><th>Allegato</th><th>Azioni</th>
            </tr>
          </thead>
          <tbody>
            {filtrate.length === 0 ? (
              <tr><td colSpan="11" className="text-center text-muted">Nessuna fattura trovata</td></tr>
            ) : (
              filtrate.map(f => (
                <tr key={f.id}>
                  <td>{f.numero}</td>
                  <td>{f.emissario}</td>
                  <td>{f.categoria}</td>
                  <td>{f.data}</td>
                  <td>{f.scadenza}</td>
                  <td>{Number(f.importo).toFixed(2)} €</td>
                  <td>{f.metodoPagamento}</td>
                  <td>
                    <span className={`badge text-bg-${
                      f.stato === "pagata" ? "success" : f.stato === "scaduta" ? "danger" : "warning"
                    }`}>
                      {f.stato.replace("_", " ")}
                    </span>
                  </td>
                  <td>{f.note}</td>
                  <td>{f.allegato ? `📎 ${f.allegato}` : "-"}</td>
                  <td>
                    {f.stato !== "pagata" && (
                      <button className="btn btn-sm btn-outline-success me-2" onClick={()=>cambiaStato(f,"pagata")}>✓ Pagata</button>
                    )}
                    {f.stato !== "in_sospeso" && (
                      <button className="btn btn-sm btn-outline-secondary me-2" onClick={()=>cambiaStato(f,"in_sospeso")}>⟳ In sospeso</button>
                    )}
                    <button className="btn btn-sm btn-outline-danger" onClick={()=>remove(f.id)}>✕ Elimina</button>
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
