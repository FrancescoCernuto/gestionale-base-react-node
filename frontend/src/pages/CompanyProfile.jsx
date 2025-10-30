/**
 * CompanyProfile.jsx
 * Scheda anagrafica azienda (multi-azienda, vista + modifica)
 */
import { useEffect, useState } from "react";
import { useCompanyProfile } from "../hooks/useCompanyProfile";
import { useStore } from "../context/StoreContext";
import toast from "react-hot-toast";

export default function CompanyProfile() {
  const { company } = useStore();
  const { profile, loading, error, save } = useCompanyProfile();
  const [form, setForm] = useState(null);
  const [editMode, setEditMode] = useState(false);

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
    setForm(saved);
    setEditMode(false);
    toast.success("Profilo aggiornato");
  };

  if (loading || !form) return <div className="container py-3">Caricamento…</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  const Field = ({ label, path, placeholder = "", type = "text" }) => (
    <div className="col-md-3 mb-2">
      <label className="form-label small">{label}</label>
      {editMode ? (
        <input
          type={type}
          className="form-control form-control-sm"
          value={path.split(".").reduce((a, b) => (a ? a[b] : ""), form) || ""}
          onChange={(e) => update(path, e.target.value)}
          placeholder={placeholder}
        />
      ) : (
        <div className="border rounded p-1 bg-white text-truncate small" style={{ minHeight: "31px" }}>
          {path.split(".").reduce((a, b) => (a ? a[b] : ""), form) || <span className="text-muted">—</span>}
        </div>
      )}
    </div>
  );

  return (
    <div className="container py-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0">Profilo azienda {company ? `– ${company.name}` : ""}</h4>
        {!editMode ? (
          <button className="btn btn-outline-primary btn-sm" onClick={() => setEditMode(true)}>
            ✏️ Modifica dati
          </button>
        ) : (
          <div className="d-flex gap-2">
            <button className="btn btn-success btn-sm" onClick={onSubmit}>💾 Salva</button>
            <button className="btn btn-secondary btn-sm" onClick={() => setEditMode(false)}>Annulla</button>
          </div>
        )}
      </div>

      {/* IDENTITÀ */}
      <h6 className="text-muted mt-3">Identità</h6>
      <div className="row g-2">
        <Field label="Denominazione" path="denominazione" />
        <Field label="Forma giuridica" path="formaGiuridica" />
        <Field label="Partita IVA" path="partitaIVA" />
        <Field label="Codice Fiscale" path="codiceFiscale" />
        <Field label="Codice REA" path="codiceREA" />
        <Field label="Numero Registro Imprese" path="numeroRI" />
        <Field label="ATECO" path="ateco" />
        <Field label="Regime fiscale" path="regimeFiscale" />
        <Field label="Data costituzione" path="dataCostituzione" type="date" />
      </div>

      {/* Sede legale */}
      <h6 className="text-muted mt-3">Sede Legale</h6>
      <div className="row g-2">
        <Field label="Indirizzo" path="sedeLegale.indirizzo" />
        <Field label="CAP" path="sedeLegale.cap" />
        <Field label="Comune" path="sedeLegale.comune" />
        <Field label="Provincia" path="sedeLegale.provincia" />
      </div>

      {/* Sede operativa */}
      <h6 className="text-muted mt-3">Sede Operativa</h6>
      <div className="row g-2">
        <Field label="Indirizzo" path="sedeOperativa.indirizzo" />
        <Field label="CAP" path="sedeOperativa.cap" />
        <Field label="Comune" path="sedeOperativa.comune" />
        <Field label="Provincia" path="sedeOperativa.provincia" />
      </div>

      {/* Contatti */}
      <h6 className="text-muted mt-3">Contatti & Fatturazione Elettronica</h6>
      <div className="row g-2">
        <Field label="PEC" path="pec" />
        <Field label="Codice Destinatario SDI" path="codiceDestinatario" />
        <Field label="Email" path="email" />
        <Field label="Telefono" path="telefono" />
        <Field label="Sito Web" path="sito" />
      </div>

      {/* Banca */}
      <h6 className="text-muted mt-3">Banca</h6>
      <div className="row g-2">
        <Field label="IBAN" path="iban" />
        <Field label="Banca" path="banca" />
      </div>

      {/* Rappresentante */}
      <h6 className="text-muted mt-3">Rappresentante legale</h6>
      <div className="row g-2">
        <Field label="Nome" path="rappresentante.nome" />
        <Field label="Cognome" path="rappresentante.cognome" />
        <Field label="Codice Fiscale" path="rappresentante.codiceFiscale" />
        <Field label="Ruolo" path="rappresentante.ruolo" />
      </div>

      {/* Note */}
      <h6 className="text-muted mt-3">Note</h6>
      {editMode ? (
        <textarea
          className="form-control form-control-sm"
          rows="3"
          value={form.note || ""}
          onChange={(e) => update("note", e.target.value)}
        />
      ) : (
        <div className="border rounded p-2 bg-white small" style={{ minHeight: "40px" }}>
          {form.note || <span className="text-muted">—</span>}
        </div>
      )}

      {/* Ultimo aggiornamento */}
      {form.updatedAt && (
        <div className="text-end text-muted small mt-2">
          Ultimo aggiornamento: {new Date(form.updatedAt).toLocaleString("it-IT")}
        </div>
      )}
    </div>
  );
}
