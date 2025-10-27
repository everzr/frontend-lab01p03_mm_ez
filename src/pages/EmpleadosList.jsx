import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../services/api'
import { PUESTOS } from '../constants'

export default function EmpleadosList() {
  const [empleados, setEmpleados] = useState([])
  const [allEmpleados, setAllEmpleados] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filtroPuesto, setFiltroPuesto] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('')
  const [monto, setMonto] = useState('')
  const [salarioComp, setSalarioComp] = useState('>')

  const load = async () => {
    setLoading(true)
    try {
      const data = await api.list()
      setEmpleados(data)
      setAllEmpleados(data)
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const eliminar = async (id) => {
    if (!confirm('Eliminar empleado?')) return
    await api.remove(id)
    await load()
  }

  // Apply filters client-side so filters can be combined
  const aplicarFiltros = () => {
    let res = [...allEmpleados]
    if (filtroPuesto) res = res.filter(e => e.puesto === filtroPuesto)
    if (filtroEstado) res = res.filter(e => (e.estado || '').toLowerCase() === filtroEstado.toLowerCase())
    if (monto) {
      const num = parseFloat(monto)
      if (!Number.isNaN(num)) {
        if (salarioComp === '>') res = res.filter(e => parseFloat(e.salario) > num)
        else res = res.filter(e => parseFloat(e.salario) < num)
      }
    }
    setEmpleados(res)
  }

  const clearFiltros = () => {
    setFiltroPuesto('')
    setFiltroEstado('')
    setMonto('')
    setSalarioComp('>')
    setEmpleados(allEmpleados)
  }

  return (
    <div className="container-fluid px-4 mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Empleados</h2>
        <Link to="/empleados/nuevo" className="btn btn-success">Crear empleado</Link>
      </div>

      <div className="card mb-3">
        <div className="card-body">
          <div className="row g-3 align-items-end">
            <div className="col-lg-3 col-md-4">
              <label className="form-label">Puesto</label>
              <select className="form-select" value={filtroPuesto} onChange={e => setFiltroPuesto(e.target.value)}>
                <option value="">--</option>
                {PUESTOS.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
            <div className="col-lg-3 col-md-4">
              <label className="form-label">Estado</label>
              <select className="form-select" value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)}>
                <option value="">--</option>
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
              </select>
            </div>
            <div className="col-lg-3 col-md-4">
              <label className="form-label">Salario monto</label>
              <div className="input-group">
                <select className="form-select" style={{ maxWidth: 90 }} value={salarioComp} onChange={e => setSalarioComp(e.target.value)}>
                  <option value=">">&gt;</option>
                  <option value="<">&lt;</option>
                </select>
                <input className="form-control" value={monto} onChange={e => setMonto(e.target.value)} placeholder="1000.00" />
              </div>
            </div>
            <div className="col-lg-3 d-flex gap-2">
              <button className="btn btn-primary" onClick={aplicarFiltros}>Aplicar filtros</button>
              <button className="btn btn-outline-secondary" onClick={clearFiltros}>Limpiar</button>
              <button className="btn btn-outline-danger ms-auto" onClick={load}>Recargar</button>
            </div>
          </div>
        </div>
      </div>

      {loading && <p>Cargando...</p>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="table-light">
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Puesto</th>
              <th>Salario</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {empleados.map(e => (
              <tr key={e.id_empleado}>
                <td>{e.id_empleado}</td>
                <td>{e.nombre} {e.apellido}</td>
                <td>{e.puesto}</td>
                <td>{e.salario}</td>
                <td>{e.estado}</td>
                <td>
                  <Link to={`/empleados/editar/${e.id_empleado}`} className="btn btn-sm btn-outline-primary me-2">Editar</Link>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => eliminar(e.id_empleado)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
