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

  if (loading) return <p>Cargando estadísticas...</p>
  if (error) return <p style={{ color: 'red' }}>{error}</p>

  return (
    <div>
      <h2>Estadísticas</h2>
      {stats ? (
        <div>
          <p>Total empleados: {stats.totalEmpleados ?? stats.total ?? 'N/A'}</p>
          <p>Activos: {stats.activos ?? 'N/A'}</p>
          <p>Inactivos: {stats.inactivos ?? 'N/A'}</p>
          <p>Promedio salarial: {stats.promedioSalarios ?? 'N/A'}</p>
          <p>Antigüedad promedio (años): {stats.antiguedadPromedio ?? 'N/A'}</p>
          <h3>Empleados por puesto</h3>
          {stats.empleadosPorPuesto ? (
            <ul>
              {Object.entries(stats.empleadosPorPuesto).map(([k, v]) => (
                <li key={k}>{k}: {v}</li>
              ))}
            </ul>
          ) : <p>No hay datos por puesto</p>}
        </div>
      ) : <p>No hay estadísticas</p>}
    </div>
  )
}
