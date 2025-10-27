import { useEffect, useState } from 'react'
import { api } from '../services/api'

export default function Estadisticas() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    (async () => {
      try {
        const data = await api.estadisticas()
        setStats(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  if (loading) return <div className="container mt-4">Cargando estadísticas...</div>
  if (error) return <div className="container mt-4"><div className="alert alert-danger">{error}</div></div>

  return (
    <div className="container-fluid px-4 mt-4">
      <h2 className="mb-3">Estadísticas</h2>
      {stats ? (
        <div className="row g-3">
          <div className="col-md-3">
            <div className="card text-bg-light mb-3">
              <div className="card-body">
                <h5 className="card-title">Total empleados</h5>
                <p className="card-text fs-4">{stats.totalEmpleados ?? stats.total ?? 'N/A'}</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-bg-light mb-3">
              <div className="card-body">
                <h5 className="card-title">Activos</h5>
                <p className="card-text fs-4">{stats.activos ?? 'N/A'}</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-bg-light mb-3">
              <div className="card-body">
                <h5 className="card-title">Inactivos</h5>
                <p className="card-text fs-4">{stats.inactivos ?? 'N/A'}</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-bg-light mb-3">
              <div className="card-body">
                <h5 className="card-title">Promedio salarial</h5>
                <p className="card-text fs-4">{stats.promedioSalarios ?? 'N/A'}</p>
              </div>
            </div>
          </div>

          <div className="col-12">
            <h4>Empleados por puesto</h4>
            {stats.empleadosPorPuesto ? (
              <div className="row">
                {Object.entries(stats.empleadosPorPuesto).map(([k, v]) => (
                  <div key={k} className="col-sm-6 col-md-3">
                    <div className="card mb-2">
                      <div className="card-body">
                        <h6 className="card-subtitle mb-2 text-muted">{k}</h6>
                        <p className="card-text fs-5">{v}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : <p>No hay datos por puesto</p>}
          </div>
        </div>
      ) : <p>No hay estadísticas</p>}
    </div>
  )
}
