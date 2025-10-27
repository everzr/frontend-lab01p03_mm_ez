import { useEffect, useMemo, useState } from 'react'
import { api } from '../services/api'
import { Bar, Pie } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement)

function safeNumber(v) {
  const n = Number(v)
  return Number.isFinite(n) ? n : null
}

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

  // Derive missing stats when possible
  const derived = useMemo(() => {
    if (!stats) return null
    // normalize backend field names to a canonical shape used in the UI
    const out = { ...stats }
    // backend: empleadosActivos / empleadosInactivos -> map to activos/inactivos
    if (out.empleadosActivos != null && out.activos == null) out.activos = out.empleadosActivos
    if (out.empleadosInactivos != null && out.inactivos == null) out.inactivos = out.empleadosInactivos
    // backend: promedioSalario (BigDecimal) -> promedioSalarios (string/number)
    if (out.promedioSalario != null && out.promedioSalarios == null) {
      // keep two decimals
      const n = safeNumber(out.promedioSalario)
      out.promedioSalarios = n != null ? Number(n).toFixed(2) : String(out.promedioSalario)
    }

    // empleadosPorPuesto: object mapping puesto->count
    if (!out.empleadosPorPuesto) {
      // maybe backend returns list of empleados
      if (out.empleados && Array.isArray(out.empleados)) {
        out.empleadosPorPuesto = out.empleados.reduce((acc, e) => {
          const p = e.puesto || 'Desconocido'
          acc[p] = (acc[p] || 0) + 1
          return acc
        }, {})
      }
    }

    // total
    if (out.totalEmpleados == null) {
      if (out.total != null) out.totalEmpleados = out.total
      else if (out.empleados && Array.isArray(out.empleados)) out.totalEmpleados = out.empleados.length
      else if (out.empleadosPorPuesto) out.totalEmpleados = Object.values(out.empleadosPorPuesto).reduce((a,b) => a + b, 0)
    }

    // activos/inactivos
    if (out.activos == null || out.inactivos == null) {
      if (out.porEstado) {
        out.activos = out.porEstado.Activo ?? out.porEstado.ACTIVO ?? out.porEstado.activo
        out.inactivos = out.porEstado.Inactivo ?? out.porEstado.INACTIVO ?? out.porEstado.inactivo
      } else if (out.empleados && Array.isArray(out.empleados)) {
        out.activos = out.empleados.filter(e => String(e.estado).toLowerCase() === 'activo').length
        out.inactivos = out.empleados.filter(e => String(e.estado).toLowerCase() === 'inactivo').length
      }
    }

    // promedio salarial
    if (out.promedioSalarios == null) {
      if (out.salarios && Array.isArray(out.salarios) && out.salarios.length) {
        const nums = out.salarios.map(s => safeNumber(s)).filter(x => x != null)
        out.promedioSalarios = nums.length ? (nums.reduce((a,b) => a+b,0)/nums.length).toFixed(2) : null
      } else if (out.empleados && Array.isArray(out.empleados)) {
        const nums = out.empleados.map(e => safeNumber(e.salario)).filter(x => x != null)
        out.promedioSalarios = nums.length ? (nums.reduce((a,b) => a+b,0)/nums.length).toFixed(2) : null
      }
    }

    return out
  }, [stats])

  if (loading) return <div className="container-fluid px-4 mt-4">Cargando estadísticas...</div>
  if (error) return <div className="container-fluid px-4 mt-4"><div className="alert alert-danger">{error}</div></div>

  const s = derived
  if (!s) return <div className="container-fluid px-4 mt-4">No hay estadísticas</div>

  // prepare chart data
  const puestos = s.empleadosPorPuesto ? Object.keys(s.empleadosPorPuesto) : []
  const puestosCounts = s.empleadosPorPuesto ? Object.values(s.empleadosPorPuesto) : []

  const estadoLabels = ['Activo', 'Inactivo']
  const estadoValues = [s.activos ?? 0, s.inactivos ?? 0]

  const barData = {
    labels: puestos,
    datasets: [
      {
        label: 'Empleados por puesto',
        data: puestosCounts,
        backgroundColor: 'rgba(54, 162, 235, 0.6)'
      }
    ]
  }

  const pieData = {
    labels: estadoLabels,
    datasets: [
      {
        data: estadoValues,
        backgroundColor: ['#198754', '#dc3545']
      }
    ]
  }

  return (
    <div className="container-fluid px-4 mt-4">
      <h2 className="mb-3 text-center">Estadísticas</h2>
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card text-bg-light mb-3">
            <div className="card-body text-center">
              <h5 className="card-title">Total empleados</h5>
              <p className="card-text fs-4">{s.totalEmpleados ?? 'N/A'}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-bg-light mb-3">
            <div className="card-body text-center">
              <h5 className="card-title">Activos</h5>
              <p className="card-text fs-4">{s.activos ?? 'N/A'}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-bg-light mb-3">
            <div className="card-body text-center">
              <h5 className="card-title">Inactivos</h5>
              <p className="card-text fs-4">{s.inactivos ?? 'N/A'}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-bg-light mb-3">
            <div className="card-body text-center">
              <h5 className="card-title">Promedio salarial</h5>
              <p className="card-text fs-4">{s.promedioSalarios ?? 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-8 mb-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Empleados por puesto</h5>
              {puestos.length ? <Bar data={barData} options={{ responsive: true, plugins: { legend: { display: false } } }} /> : <p>No hay datos por puesto</p>}
            </div>
          </div>
        </div>
        <div className="col-lg-4 mb-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Estado</h5>
              { (s.activos != null || s.inactivos != null) ? <Pie data={pieData} options={{ responsive: true }} /> : <p>No hay datos de estado</p> }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
