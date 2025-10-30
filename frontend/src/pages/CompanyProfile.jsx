/**
 * CompanyProfile.jsx
 * Scheda anagrafica aziendale (multi-azienda, dati italiani)
 */
import { useEffect, useState } from "react";
import { useCompanyProfile } from "../hooks/useCompanyProfile";
import { useStore } from "../context/StoreContext";
import toast from "react-hot-toast";

export default function CompanyProfile() {
  const { company } = useStore();
  const { profile, loading, error, save } = useCompanyProfile();
  const [form, setForm] = useState(null);

  useEffect(() => {
    if (profile) setForm(profile);
  }, [profile]);

  const update = (path, value) => {
    setForm((prev) => {
      const clone = structuredClone(prev || {});
      const parts = path.split(".");
      let cur = clone;
      for (let i = 0; i < parts.length - 1; i++) cur = cur[parts[i]] ||= {};
      cur[parts.at(-1)] = value;
      return clone;
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const saved = await save(form);
    toast.success("Profilo azienda aggiornato");
    setForm(saved);
  };

  if (loading || !form) return <div className="container py-3">Caricamento…</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container py-3">
      <h4 className="mb-3">Profilo azienda {company ? `– ${company.name}` : ""}</h4>

      <form className="row g-3" onSubmit={onSubmit}>
        {/* Identità */}
        <div className="col-12"><h6 className="text-muted">Identità</h6></div>

        <div className="col-md-4">
          <label className="form-label small">Denominazione</label>
          <input
            className="form-control form-control-sm"
            value={form.denominazione || ""}
            onChange={(e) => update("denominazione", e.target.value)}
          />
        </div>

        <div className="col-md-2">
          <label className="form-label small">Forma Giuridica</label>
          <input
            className="form-control form-control-sm"
            value={form.formaGiuridica || ""}
            onChange={(e) => update("formaGiuridica", e.target.value)}
          />
        </div>

        <div className="col-md-2">
          <label className="form-label small">Partita IVA</label>
          <input
            className="form-control form-control-sm"
            value={form.partitaIVA || ""}
            onChange={(e) => update("partitaIVA", e.target.value)}
          />
        </div>

        <div className="col-md-2">
          <label className="form-label small">Codice Fiscale</label>
          <input
            className="form-control form-control-sm"
            value={form.codiceFiscale || ""}
            onChange={(e) => update("codiceFiscale", e.target.value)}
          />
        </div>

        <div className="col-md-2">
          <label className="form-label small">ATECO</label>
          <input
            className="form-control form-control-sm"
            value={form.ateco || ""}
            onChange={(e) => update("ateco", e.target.value)}
          />
        </div>

        {/* Sede legale */}
        <div className="col-12 mt-3"><h6 className="text-muted">Sede Legale</h6></div>
        <div className="col-md-4">
          <input
            className="form-control form-control-sm"
            placeholder="Indirizzo"
            value={form.sedeLegale?.indirizzo || ""}
            onChange={(e) => update("sedeLegale.indirizzo", e.target.value)}
          />
        </div>
        <div className="col-md-2">
          <input
            className="form-control form-control-sm"
            placeholder="CAP"
            value={form.sedeLegale?.cap || ""}
            onChange={(e) => update("sedeLegale.cap", e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <input
            className="form-control form-control-sm"
            placeholder="Comune"
            value={form.sedeLegale?.comune || ""}
            onChange={(e) => update("sedeLegale.comune", e.target.value)}
          />
        </div>
        <div className="col-md-2">
          <input
            className="form-control form-control-sm"
            placeholder="Provincia"
            value={form.sedeLegale?.provincia || ""}
            onChange={(e) => update("sedeLegale.provincia", e.target.value)}
          />
        </div>

        {/* Contatti */}
        <div className="col-12 mt-3"><h6 className="text-muted">Contatti</h6></div>
        <div className="col-md-3">
          <input
            className="form-control form-control-sm"
            placeholder="PEC"
            value={form.pec || ""}
            onChange={(e) => update("pec", e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <input
            className="form-control form-control-sm"
            placeholder="Email"
            value={form.email || ""}
            onChange={(e) => update("email", e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <input
            className="form-control form-control-sm"
            placeholder="Telefono"
            value={form.telefono || ""}
            onChange={(e) => update("telefono", e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <input
            className="form-control form-control-sm"
            placeholder="Sito"
            value={form.sito || ""}
            onChange={(e) => update("sito", e.target.value)}
          />
        </div>

        {/* Banca */}
        <div className="col-12 mt-3"><h6 className="text-muted">Banca</h6></div>
        <div className="col-md-4">
          <input
            className="form-control form-control-sm"
            placeholder="IBAN"
            value={form.iban || ""}
            onChange={(e) => update("iban", e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <input
            className="form-control form-control-sm"
            placeholder="Nome Banca"
            value={form.banca || ""}
            onChange={(e) => update("banca", e.target.value)}
          />
        </div>

        {/* Rappresentante */}
        <div className="col-12 mt-3"><h6 className="text-muted">Rappresentante Legale</h6></div>
        <div className="col-md-3">
          <input
            className="form-control form-control-sm"
            placeholder="Nome"
            value={form.rappresentante?.nome || ""}
            onChange={(e) => update("rappresentante.nome", e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <input
            className="form-control form-control-sm"
            placeholder="Cognome"
            value={form.rappresentante?.cognome || ""}
            onChange={(e) => update("rappresentante.cognome", e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <input
            className="form-control form-control-sm"
            placeholder="Codice Fiscale"
            value={form.rappresentante?.codiceFiscale || ""}
            onChange={(e) => update("rappresentante.codiceFiscale", e.target.value)}
          />
        </div>

        {/* Note e pulsante salva */}
        <div className="col-12 mt-3">
          <textarea
            className="form-control form-control-sm"
            rows="2"
            placeholder="Note"
            value={form.note || ""}
            onChange={(e) => update("note", e.target.value)}
          />
        </div>

        <div className="col-12 d-flex align-items-center gap-3">
          <button type="submit" className="btn btn-primary btn-sm">Salva</button>
          {form.updatedAt && (
            <small className="text-muted">
              Ultimo aggiornamento: {new Date(form.updatedAt).toLocaleString("it-IT")}
            </small>
          )}
        </div>
      </form>
    </div>
  );
}
