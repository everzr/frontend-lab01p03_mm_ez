import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../services/api'

export default function EmpleadosList() {
  const [empleados, setEmpleados] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filtroPuesto, setFiltroPuesto] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('')
  const [monto, setMonto] = useState('')

  const load = async () => {
    setLoading(true)
    try {
      const data = await api.list()
      setEmpleados(data)
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
    load()
  }

  const aplicarFiltroPuesto = async () => {
    if (!filtroPuesto) return load()
    const res = await api.filterByPuesto(filtroPuesto)
    setEmpleados(res)
  }

  const aplicarFiltroEstado = async () => {
    if (!filtroEstado) return load()
    const res = await api.filterByEstado(filtroEstado)
    setEmpleados(res)
  }

  const aplicarFiltroSalario = async (tipo) => {
    if (!monto) return load()
    const res = tipo === 'mayor' ? await api.filterBySalarioMayor(monto) : await api.filterBySalarioMenor(monto)
    setEmpleados(res)
  }

  return (
    <div>
      <h2>Empleados</h2>

      <div style={{ marginBottom: 12 }}>
        <Link to="/empleados/nuevo">Crear empleado</Link>
      </div>

      <div style={{ marginBottom: 12 }}>
        <label>Puesto: <input value={filtroPuesto} onChange={e => setFiltroPuesto(e.target.value)} /></label>
        <button onClick={aplicarFiltroPuesto} style={{ marginLeft: 8 }}>Filtrar</button>
        <label style={{ marginLeft: 12 }}>Estado: 
          <select value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)}>
            <option value="">--</option>
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>
        </label>
        <button onClick={aplicarFiltroEstado} style={{ marginLeft: 8 }}>Filtrar</button>
      </div>

      <div style={{ marginBottom: 12 }}>
        <label>Salario Monto: <input value={monto} onChange={e => setMonto(e.target.value)} placeholder="1000.00" /></label>
        <button onClick={() => aplicarFiltroSalario('mayor')} style={{ marginLeft: 8 }}>Mayor</button>
        <button onClick={() => aplicarFiltroSalario('menor')} style={{ marginLeft: 8 }}>Menor</button>
      </div>

      {loading && <p>Cargando...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
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
            <tr key={e.id_empleado} style={{ borderTop: '1px solid #eee' }}>
              <td>{e.id_empleado}</td>
              <td>{e.nombre} {e.apellido}</td>
              <td>{e.puesto}</td>
              <td>{e.salario}</td>
              <td>{e.estado}</td>
              <td>
                <Link to={`/empleados/editar/${e.id_empleado}`} style={{ marginRight: 8 }}>Editar</Link>
                <button onClick={() => eliminar(e.id_empleado)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
