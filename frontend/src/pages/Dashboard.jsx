/**
 * Dashboard intelligente con KPI, grafici e reminder fatture in scadenza
 */
import { useMemo } from "react";
import { useCrud } from "../hooks/useCrud";
import { useStore } from "../context/StoreContext";
import { Bar, Doughnut, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend, Title);

export default function Dashboard() {
  const { company } = useStore();
  const { data: fatture, loading, error } = useCrud("fatture");

  const today = new Date();

  // Utility
  const daysDiff = (a, b) => Math.round((b - a) / (1000 * 60 * 60 * 24));

  const stats = useMemo(() => {
    if (!Array.isArray(fatture))
      return { kpi: {}, byMonth: {}, byState: {}, byCategory: {}, prossime: [] };

    const kpi = { inScadenza: 0, scadute: 0, pagate: 0, totale: 0 };
    const byMonth = {};
    const byState = { pagata: 0, in_sospeso: 0, scaduta: 0 };
    const byCategory = {};
    const prossime = [];

    for (const f of fatture) {
      const importo = Number(f.importo) || 0;
      kpi.totale += importo;
      const scad = f.scadenza ? new Date(f.scadenza) : null;

      if (f.stato === "pagata") kpi.pagate++;
      if (scad && scad < today && f.stato !== "pagata") kpi.scadute++;
      if (scad && daysDiff(today, scad) <= 7 && f.stato !== "pagata")
        kpi.inScadenza++;

      // prossime scadenze
      if (scad && f.stato !== "pagata")
        prossime.push({ ...f, giorniMancanti: daysDiff(today, scad) });

      // per mese
      const d = f.data ? new Date(f.data) : null;
      if (d && d.getFullYear() === today.getFullYear()) {
        const m = d.getMonth();
        byMonth[m] = (byMonth[m] || 0) + importo;
      }

      // stato
      byState[f.stato] = (byState[f.stato] || 0) + 1;

      // categoria
      const cat = f.categoria || "Non specificata";
      byCategory[cat] = (byCategory[cat] || 0) + 1;
    }

    prossime.sort((a, b) => (a.giorniMancanti ?? 9999) - (b.giorniMancanti ?? 9999));
    return { kpi, byMonth, byState, byCategory, prossime: prossime.slice(0, 5) };
  }, [fatture]);

  const monthLabels = [
    "Gen", "Feb", "Mar", "Apr", "Mag", "Giu",
    "Lug", "Ago", "Set", "Ott", "Nov", "Dic",
  ];

  // Opzioni grafiche con tooltip
  const tooltipFmt = (ctx) => {
    const val = ctx.raw;
    return val.toLocaleString("it-IT", { style: "currency", currency: "EUR" });
  };

  const chartMonth = {
    labels: monthLabels,
    datasets: [
      {
        label: "Totale € per mese",
        data: monthLabels.map((_, i) => stats.byMonth[i] || 0),
        backgroundColor: "rgba(54,162,235,0.6)",
      },
    ],
  };
  const optMonth = {
    plugins: {
      tooltip: { callbacks: { label: tooltipFmt } },
      legend: { display: false },
    },
  };

  const chartState = {
    labels: Object.keys(stats.byState),
    datasets: [
      {
        data: Object.values(stats.byState),
        backgroundColor: ["#198754", "#ffc107", "#dc3545"],
      },
    ],
  };

  const chartCategory = {
    labels: Object.keys(stats.byCategory),
    datasets: [
      {
        data: Object.values(stats.byCategory),
        backgroundColor: [
          "#0d6efd",
          "#6f42c1",
          "#fd7e14",
          "#20c997",
          "#6610f2",
          "#198754",
          "#dc3545",
        ],
      },
    ],
  };

  return (
    <div className="container-fluid py-3">
      <h4 className="mb-4">
        Dashboard {company ? `– ${company.name}` : ""}
      </h4>
      {error && <div className="alert alert-danger">{error}</div>}

      {/* KPI */}
      <div className="row g-3 mb-4">
        <div className="col-md-3 col-6">
          <div className="card text-center shadow-sm">
            <div className="card-body">
              <div className="text-muted small">Totale Fatture</div>
              <div className="display-6">{fatture?.length ?? 0}</div>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-6">
          <div className="card text-center shadow-sm">
            <div className="card-body">
              <div className="text-muted small">In scadenza</div>
              <div className="display-6 text-warning">{stats.kpi.inScadenza}</div>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-6">
          <div className="card text-center shadow-sm">
            <div className="card-body">
              <div className="text-muted small">Scadute</div>
              <div className="display-6 text-danger">{stats.kpi.scadute}</div>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-6">
          <div className="card text-center shadow-sm">
            <div className="card-body">
              <div className="text-muted small">Pagate</div>
              <div className="display-6 text-success">{stats.kpi.pagate}</div>
            </div>
          </div>
        </div>
      </div>

      {/* GRAFICI */}
      <div className="row g-4 mb-4">
        <div className="col-lg-6">
          <div className="card p-3 shadow-sm h-100">
            <h6 className="text-muted mb-3">Andamento mensile</h6>
            <Bar data={chartMonth} options={optMonth} />
          </div>
        </div>
        <div className="col-lg-3 col-md-6">
          <div className="card p-3 shadow-sm h-100">
            <h6 className="text-muted mb-3">Stato fatture</h6>
            <Doughnut data={chartState} />
          </div>
        </div>
        <div className="col-lg-3 col-md-6">
          <div className="card p-3 shadow-sm h-100">
            <h6 className="text-muted mb-3">Categorie</h6>
            <Pie data={chartCategory} />
          </div>
        </div>
      </div>

      {/* FATTURE IN SCADENZA */}
      <div className="card shadow-sm">
        <div className="card-body">
          <h6 className="text-muted mb-3">Fatture prossime alla scadenza</h6>
          {stats.prossime.length === 0 && (
            <div className="text-secondary small">Nessuna fattura in scadenza prossimamente.</div>
          )}
          {stats.prossime.length > 0 && (
            <div className="table-responsive">
              <table className="table table-sm align-middle">
                <thead>
                  <tr>
                    <th>Numero</th>
                    <th>Fornitore</th>
                    <th>Scadenza</th>
                    <th>Giorni</th>
                    <th>Importo (€)</th>
                    <th>Stato</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.prossime.map((f) => (
                    <tr key={f.id}>
                      <td>{f.numero}</td>
                      <td>{f.fornitore || "-"}</td>
                      <td>{f.scadenza ? new Date(f.scadenza).toLocaleDateString("it-IT") : "-"}</td>
                      <td>{f.giorniMancanti ?? "-"}</td>
                      <td>{Number(f.importo).toLocaleString("it-IT", { minimumFractionDigits: 2 })}</td>
                      <td>
                        <span
                          className={`badge ${
                            f.stato === "pagata"
                              ? "bg-success"
                              : f.giorniMancanti < 0
                              ? "bg-danger"
                              : "bg-warning text-dark"
                          }`}
                        >
                          {f.stato}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
