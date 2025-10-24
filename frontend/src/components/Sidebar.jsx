import React from 'react'
import { NavLink } from 'react-router-dom'
import { useStore } from '../context/StoreContext.jsx'

export default function Sidebar() {
  const { company, setCompany, companies } = useStore()
  return (
    <aside className="sidebar d-flex flex-column p-3">
      <div className="brand mb-3">Gestionale</div>

      <div className="mb-3">
        <label className="form-label mb-1">Azienda</label>
        <select className="form-select" value={company} onChange={(e)=>setCompany(e.target.value)}>
          {companies.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <nav className="nav nav-pills flex-column gap-1">
        <NavLink className="nav-link" to="/dashboard">Dashboard</NavLink>
        <NavLink className="nav-link" to="/fatture">Fatture</NavLink>
        <NavLink className="nav-link" to="/utenze">Utenze</NavLink>
        <NavLink className="nav-link" to="/fornitori-beni">Fornitori Beni</NavLink>
        <NavLink className="nav-link" to="/fornitori-servizi">Fornitori Servizi</NavLink>
      </nav>

      <div className="mt-auto small text-secondary">
        <hr/>
        <div>© Gestionale</div>
      </div>
    </aside>
  )
}
