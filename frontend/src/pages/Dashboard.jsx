import React from 'react'
import { useStore } from '../context/StoreContext.jsx'

export default function Dashboard() {
  const { company } = useStore()
  return (
    <div className="container-fluid-like">
      <h2 className="page-title">📊 Dashboard <small className="text-secondary">({company?.name})</small></h2>
      <div className="card shadow-sm p-3">
        <div className="text-secondary">Contenuto da implementare.</div>
      </div>
    </div>
  )
}
