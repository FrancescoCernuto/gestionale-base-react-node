import React from 'react'
import { useStore } from '../context/StoreContext.jsx'

export default function Fatture() {
  const { company } = useStore()
  return (
    <div className="container-fluid-like">
      <h2 className="page-title">📄 Fatture <small className="text-secondary">({company})</small></h2>
      <div className="card shadow-sm p-3">
        <div className="text-secondary">Contenuto da implementare.</div>
      </div>
    </div>
  )
}
